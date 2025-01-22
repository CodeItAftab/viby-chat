const express = require("express");
const {
  getAllUsers,
  // getAllRequests,
  // getAllSentRequests,
  getAllFriends,
  getUser,
  firstProfileUpdate,
} = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.use(isAuthenticated);

router.get("/all/users", getAllUsers);

// router.get("/all/requests", getAllRequests);

// router.get("/all/sent_requests", getAllSentRequests);

router.get("/all/friends", getAllFriends);

router.get("/:id", getUser);

router.post("/first_profile_update", firstProfileUpdate);

module.exports = router;
