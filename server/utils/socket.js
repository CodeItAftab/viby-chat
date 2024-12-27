const { Server } = require("socket.io");
const {
  SEND_FRIEND_REQUEST,
  FRIEND_REQUEST_SENT,
  NEW_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  CANCEL_FRIEND_REQUEST,
  REFETCH_FRIEND_REQUESTS,
  FRIEND_REQUEST_CANCELLED,
  REJECT_FRIEND_REQUEST,
  REFETCH_SENT_REQUESTS,
  FRIEND_REQUEST_REJECTED,
  FRIEND_REQUEST_ACCEPTED,
  FRIEND_CAME_ONLINE,
  FRIEND_WENT_OFFLINE,
  MESSAGE_DELIVERED,
  READ_MESSAGE,
  FRIEND_READ_MESSAGE,
} = require("../constants/event");
const Request = require("../models/request");
const Chat = require("../models/chat");
const Message = require("../models/Message");

let io;

const users = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://viby-chat.vercel.app",
      // origin: "*",
      withCredentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const { userId } = socket.handshake.query;
    console.log("New connection: ", socket.id, "\nuserId: ", userId);
    // push user to active users map
    users.set(userId, socket.id);

    const chats = await Chat.find({ members: userId, isGroup: false });

    // Notify friends that user is online
    chats.forEach(async (chat) => {
      const messageCount = await Message.countDocuments({ chatId: chat._id });
      if (messageCount > 0) {
        const friendId = chat.members.find(
          (member) => member.toString() !== userId.toString()
        );
        const friendSocketId = users.get(friendId.toString());
        if (friendSocketId) {
          io.to(friendSocketId).emit(FRIEND_CAME_ONLINE, {
            chatId: chat._id,
          });
        }
      }
    });

    // Make all sent message as delivered
    const chatIds = [];
    chats.forEach(async (chat) => {
      const messages = await Message.find({
        chatId: chat._id,
        state: "sent",
        sender: { $ne: userId },
      });
      if (messages.length > 0) {
        chatIds.push(chat._id);
        messages.forEach(async (message) => {
          message.state = "delivered";
          await message.save();
        });
        friendId = chat.members.find(
          (member) => member.toString() !== userId.toString()
        );
        const friendSocketId = users.get(friendId.toString());
        io.to(friendSocketId).emit(MESSAGE_DELIVERED, {
          chatIds,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected: ", socket.id);

      // Notify friends that user went offline
      chats.forEach(async (chat) => {
        const messageCount = await Message.countDocuments({ chatId: chat._id });
        if (messageCount > 0) {
          const friendId = chat.members.find(
            (member) => member.toString() !== userId.toString()
          );
          const friendSocketId = users.get(friendId.toString());
          if (friendSocketId) {
            io.to(friendSocketId).emit(FRIEND_WENT_OFFLINE, {
              chatId: chat._id,
            });
          }
        }
      });
      users.delete(userId);

      // console.log(users);
    });

    socket.on(SEND_FRIEND_REQUEST, async (data) => {
      console.log({ ...data, from: userId });
      const toSocketId = users.get(data.to);
      const fromSocketId = users.get(userId);
      try {
        const exisitingRequest = await Request.findOne({
          $or: [
            { sender: userId, receiver: data.to },
            { sender: data.to, receiver: userId },
          ],
        });

        if (exisitingRequest) {
          return;
        }

        const request = await Request.create({
          sender: userId,
          receiver: data.to,
        });

        const req = await Request.findById(request._id).populate(
          "sender receiver",
          "name"
        );

        console.log(req);

        io.to(toSocketId).emit(NEW_FRIEND_REQUEST, {
          message: "New Friend Request",
          request: {
            _id: req._id,
            sender: req.sender,
          },
        });
        io.to(fromSocketId).emit(FRIEND_REQUEST_SENT, {
          message: "Friend Request Sent",
          request: {
            _id: req._id,
            receiver: req.receiver,
          },
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on(CANCEL_FRIEND_REQUEST, async (data) => {
      const requestId = data.requestId;
      const receiverId = data.receiverId;
      const toSocketId = users.get(receiverId);
      const fromSocketId = users.get(userId);
      const request = await Request.findByIdAndDelete(requestId);
      if (!request) {
        return;
      }

      io.to(toSocketId).emit(REFETCH_FRIEND_REQUESTS);
      io.to(fromSocketId).emit(FRIEND_REQUEST_CANCELLED, {
        requestId: requestId,
      });
    });

    socket.on(REJECT_FRIEND_REQUEST, async (data) => {
      const requestId = data.requestId;
      const senderId = data.senderId;
      const fromSocketId = users.get(senderId);
      const toSocketId = users.get(userId);

      const request = await Request.findByIdAndDelete(requestId);
      if (!request) {
        return;
      }

      io.to(fromSocketId).emit(REFETCH_SENT_REQUESTS, {
        requestId: requestId,
      });
      io.to(toSocketId).emit(FRIEND_REQUEST_REJECTED, {
        requestId: requestId,
      });
    });

    socket.on(ACCEPT_FRIEND_REQUEST, async (data) => {
      const requestId = data.requestId;

      const request = await Request.findById(requestId);
      if (!request) {
        return;
      }

      const exisitingChat = await Chat.findOne({
        members: { $all: [request.receiver, request.sender] },
        isGroup: false,
      });

      if (exisitingChat) {
        return;
      }

      const chat = await Chat.create({
        members: [userId, request.sender],
      });

      await Request.findByIdAndDelete(requestId);

      const toSocketId = users.get(request.receiver.toString());
      const fromSocketId = users.get(request.sender.toString());

      io.to(toSocketId).emit(FRIEND_REQUEST_ACCEPTED, {
        requestId: requestId,
        chatId: chat._id,
      });
      io.to(fromSocketId).emit(FRIEND_REQUEST_ACCEPTED, {
        requestId: requestId,
        chatId: chat._id,
      });
    });

    socket.on(READ_MESSAGE, async (data) => {
      const chatId = data.chatId;
      const messages = await Message.find({
        sender: { $ne: userId },
        chatId: chatId,
        state: "delivered",
      });
      messages.forEach(async (message) => {
        message.state = "read";
        message.readList.push(userId);
        await message.save();
      });
      // notify friend that message is read
      const senderId = messages[0]?.sender;
      const friendSocketId = users.get(senderId?.toString());

      io.to(friendSocketId).emit(FRIEND_READ_MESSAGE, {
        chatId: chatId,
      });

      io.to(socket.id).emit(READ_MESSAGE, {
        chatId: chatId,
      });
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};

module.exports = { initSocket, getIO, users };
