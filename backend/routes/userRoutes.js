const express = require('express');
const router = express.Router();

const {
	registerUser,
	loginUser,
	followOrUnfollowUser,
	logoutUser,
	changePassword,
	updateUserProfile,
	deleteMyAccount,
	getMyProfile,
	getUserProfile,
	getAllUsers,
	forgotPassword,
	resetPassword,
} = require('../controllers/userCtrl.js');

const { authenticatedUser } = require('../middlewares/authMiddleware.js');

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router.route("/follow/:id").get(authenticatedUser, followOrUnfollowUser);

router.route("/change/password").put(authenticatedUser, changePassword);

router.route("/update/profile").put(authenticatedUser, updateUserProfile);

router.route("/delete/account").delete(authenticatedUser, deleteMyAccount);

router.route("/my/profile").get(authenticatedUser, getMyProfile);

router.route("/profile/:id").get(authenticatedUser, getUserProfile);

router.route("/all/profiles").get(authenticatedUser, getAllUsers);

router.route("/forgot/password").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
