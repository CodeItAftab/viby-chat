const { TryCatch } = require("../utils/error");
const Chat = require("../models/chat");
const Message = require("../models/Message");
const { getOtherMembers } = require("../utils/helper");
const { users, getIO } = require("../utils/socket");
const { NEW_MESSAGE_ALERT } = require("../constants/event");
const { getLinkPreview } = require("link-preview-js");

const getMessages = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;
  console.log(chatId);
  const chat = await Chat.findOne({
    _id: chatId,
    members: req.user._id,
  });
  const messages = await Message.find({ chatId })
    .sort({ createdAt: -1 })
    // .limit(3)
    .lean();

  const msgs = messages.map((message) => {
    const isSender = message.sender.toString() === req.user._id.toString();
    return {
      _id: message._id,
      content: message.content,
      sender: message.sender,
      chatId: message.chatId,
      state: message.state,
      type: "text",
      // deliveredList: message.deliveredList,
      // readList: message.readList,
      isSender,
      createdAt: message.createdAt,
    };
  });

  res.json({ success: true, messages: msgs });
});

const sendMessage = TryCatch(async (req, res, next) => {
  const { chatId, content } = req.body;
  if (!content) {
    throw new ErrorHandler(400, "Message is required");
  }

  if (!chatId) {
    throw new ErrorHandler(400, "Chat ID is required");
  }

  const chat = await Chat.findById(chatId, "members").lean();

  if (!chat) {
    throw new ErrorHandler(404, "Chat not found");
  }

  const otherMembers = getOtherMembers(chat.members, req.user._id);
  console.log(users);
  const activeMembers = otherMembers.filter((member) =>
    users.has(member.toString())
  );
  console.log(activeMembers);

  let messageStatus = "sent";

  if (activeMembers.length === otherMembers.length) {
    messageStatus = "delivered";
  }

  const message = new Message({
    sender: req.user._id,
    chatId,
    content,
    state: messageStatus,
    deliveredList: activeMembers,
    readList: [],
  });

  const savedMessage = await message.save();
  const messageForRealTime = {
    _id: savedMessage._id,
    content: savedMessage.content,
    sender: savedMessage.sender,
    chatId: savedMessage.chatId,
    state: savedMessage.state,
    type: "text",
    isSender: true,
    createdAt: savedMessage.createdAt,
  };

  const io = getIO();

  activeMembers.forEach((member) => {
    const socketId = users.get(member.toString());
    io.to(socketId).emit(NEW_MESSAGE_ALERT, {
      message: { ...messageForRealTime, isSender: false },
    });
  });

  res.json({
    // chat,.
    success: true,
    message: messageForRealTime,
  });

  // const message = new Message({
  //   sender: req.user._id,
  //   chatId,
  //   content,
  // });

  // res.status(200).json({ message });
});

const getAllChats = TryCatch(async (req, res, next) => {
  const friends = await Chat.find({ members: req.user._id })
    .populate("members")
    .lean();
  const chats = await Promise.all(
    friends.map(async (friend) => {
      const message = await Message.findOne(
        { chatId: friend._id },
        {},
        { sort: { createdAt: -1 } }
      );
      const otherMember = friend.members.find(
        (member) => member._id.toString() !== req.user._id.toString()
      );
      const unreadMessageCount = await Message.countDocuments({
        chatId: friend._id,
        sender: { $ne: req.user._id },
        readList: { $ne: req.user._id },
      });

      if (message) {
        return {
          _id: friend._id,
          name: friend?.isGroup ? friend.name : otherMember.name,
          friendId: otherMember._id,
          isOnline: users.has(otherMember._id.toString()),
          avatar: friend?.isGroup
            ? friend?.avatar?.url
            : otherMember?.avatar?.url,
          lastMessage: {
            content: message.content,
            createdAt: message.createdAt,
            state: message.state,
            isSender: message.sender.toString() === req.user._id.toString(),
            type: "text",
          },
          unread: unreadMessageCount,
        };
      }
    })
  );

  const sortedChats = chats.sort((a, b) => {
    if (a.lastMessage.createdAt > b.lastMessage.createdAt) {
      return -1;
    } else if (a.lastMessage.createdAt < b.lastMessage.createdAt) {
      return 1;
    } else {
      return 0;
    }
  });

  // try {
  //   const data = await getLinkPreview(
  //     "https://www.youtube.com/watch?v=MejbOFk7H6c"
  //   );
  //   console.log(data);
  // } catch (err) {
  //   console.log(err);
  // }

  res.json({
    success: true,
    message: "Chats fetched successfully",
    chats: sortedChats,
  });

  // console.log(chats);
});

module.exports = { sendMessage, getAllChats, getMessages };
