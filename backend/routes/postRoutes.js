const express = require('express');
const router = express.Router();

const {
	createPost,
	likeOrUnlikePost,
	deletePost,
} = require('../controllers/postCtrl.js');

const { authenticatedUser } = require('../middlewares/authMiddleware.js');

router.route("/post/upload").post(authenticatedUser, createPost)

router.route("/post/:id")
	.get(authenticatedUser, likeOrUnlikePost)
	.delete(authenticatedUser, deletePost);

module.exports = router;
