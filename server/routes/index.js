const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const chatRoutes = require("./chat");
const { errorMiddleware } = require("../middlewares/error");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/chat", chatRoutes);

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

router.use(errorMiddleware);

module.exports = router;
