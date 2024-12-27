const User = require("../models/user");
const Request = require("../models/request");
const Chat = require("../models/chat");
const { TryCatch } = require("../utils/error");
const chat = require("../models/chat");
const { users } = require("../utils/socket");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user._id } },
      "name "
    ).lean();

    const new_users = await Promise.all(
      users.map(async (user) => {
        const chat = await Chat.findOne({
          members: { $all: [req.user._id, user._id] },
          isGroup: false,
        });

        if (chat) {
          return {
            ...user,
            isFriend: true,
            isSentRequest: false,
            isReceivedRequest: false,
            chatId: chat._id,
          };
        }

        const request = await Request.findOne({
          $or: [
            { sender: req.user._id, receiver: user._id },
            { sender: user._id, receiver: req.user._id },
          ],
        });
        if (request?.sender._id.toString() === req.user._id.toString()) {
          return {
            ...user,
            isFriend: false,
            isSentRequest: true,
            isReceivedRequest: false,
            requestId: request._id,
          };
        } else if (
          request?.receiver._id.toString() === req.user._id.toString()
        ) {
          return {
            ...user,
            isFriend: false,
            isSentRequest: false,
            isReceivedRequest: true,
            requestId: request._id,
          };
        } else {
          return {
            ...user,
            isFriend: false,
            isSentRequest: false,
            isReceivedRequest: false,
          };
        }
      })
    );

    console.log(new_users);

    res.status(200).json({ success: true, users: new_users });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllRequests = TryCatch(async (req, res, next) => {
  const requests = await Request.find({ receiver: req.user._id }, "sender")
    .populate("sender", "name")
    .lean();
  res.status(200).json({ success: true, requests });
});

const getAllSentRequests = TryCatch(async (req, res, next) => {
  const requests = await Request.find({ sender: req.user._id }, "receiver")
    .populate("receiver", "name")
    .lean();
  console.log(requests);
  res.status(200).json({ success: true, requests });
});

const getAllFriends = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user._id,
    isGroup: false,
  })
    .populate("members", "name")
    .lean();

  const friends = chats.map((chat) => {
    const friend = chat.members.find(
      (member) => member._id.toString() !== req.user._id.toString()
    );
    return {
      _id: friend._id,
      name: friend.name,
      chatId: chat._id,
      isOnline: users.has(friend._id.toString()),
    };
  });

  res.status(200).json({ success: true, friends });
});

const getUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id).lean();
  res.status(200).json({ success: true, user });
});

module.exports = {
  getAllUsers,
  getAllRequests,
  getAllSentRequests,
  getAllFriends,
  getUser,
};
