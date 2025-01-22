const express = require("express");
const {
  register,
  sendOTP,
  verifyOTP,
  login,
  logout,
  firstProfileUpdate,
} = require("../controllers/auth");

const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register, sendOTP);

router.post("/verify_otp", verifyOTP);

router.post("/login", login);

router.get("/logout", logout);

module.exports = router;
