const express = require('express');
const router = express.Router();

const {
	registerUser,
	loginUser,
	followOrUnfollowUser,
} = require('../controllers/userCtrl.js');

const { authenticatedUser } = require('../middlewares/authMiddleware.js');

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/follow/:id").get(authenticatedUser, followOrUnfollowUser);

module.exports = router;
