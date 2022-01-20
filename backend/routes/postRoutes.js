const express = require('express');
const router = express.Router();

const {
	createPost,
	likeOrUnlikePost,
} = require('../controllers/postCtrl.js');

const { authenticatedUser } = require('../middlewares/authMiddleware.js');

router.route("/post/upload").post(authenticatedUser, createPost)

router.route("/post/:id").get(authenticatedUser, likeOrUnlikePost);

module.exports = router;
