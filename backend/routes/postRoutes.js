const express = require('express');
const router = express.Router();

const {
	createPost,
	likeOrUnlikePost,
	updatePostCaption,
	deletePost,
	getPostsOfFollowing,
	addComment,
	removeComment,
} = require('../controllers/postCtrl.js');

const { authenticatedUser } = require('../middlewares/authMiddleware.js');

router.route("/post/upload").post(authenticatedUser, createPost);

router.route("/post/:id")
	.get(authenticatedUser, likeOrUnlikePost)
	.put(authenticatedUser, updatePostCaption)
	.delete(authenticatedUser, deletePost);

router.route("/posts").get(authenticatedUser, getPostsOfFollowing);

router.route("/post/comment/:id")
	.put(authenticatedUser, addComment)
	.delete(authenticatedUser, removeComment);

module.exports = router;
