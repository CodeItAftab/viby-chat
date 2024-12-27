const { Router } = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const {
  sendMessage,
  getAllChats,
  getMessages,
} = require("../controllers/chat");

const router = Router();

router.use(isAuthenticated);

router.get("/all/chats", getAllChats);

router.post("/send-message", sendMessage);

router.get("/messages/:chatId", getMessages);

module.exports = router;
