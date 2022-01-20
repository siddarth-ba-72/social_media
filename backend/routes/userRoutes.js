const express = require('express');
const router = express.Router();

const {
	registerUser,
	loginUser,
	followOrUnfollowUser,
	logoutUser,
	changePassword,
	updateUserProfile
} = require('../controllers/userCtrl.js');

const { authenticatedUser } = require('../middlewares/authMiddleware.js');

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router.route("/follow/:id").get(authenticatedUser, followOrUnfollowUser);

router.route("/change/password").put(authenticatedUser, changePassword);

router.route("/update/profile").put(authenticatedUser, updateUserProfile);

module.exports = router;
