const Post = require('../schemas/postModel.js');
const User = require('../schemas/userModel.js');
const cloudinary = require("cloudinary");

exports.createPost = async (req, res) => {
	try {
		const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
			folder: "posts",
		});

		const newPost = {
			caption: req.body.caption,
			image: {
				public_id: "req.body.public_id",
				url: "req.body.url",
				// public_id: myCloud.public_id,
				// url: myCloud.secure_url,
			},
			owner: req.user._id,
		};
		const post = await Post.create(newPost);

		const user = await User.findById(req.user._id);
		user.posts.push(post._id);
		await user.save();

		res.status(201).json({
			success: true,
			post,
		});

	} catch (error) {
		res.status(500).json({
			status: false,
			message: error.message
		});
	};
};

exports.updatePostCaption = async (req, res) => {
	try {

		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found"
			});
		}

		if (post.owner.toString() !== req.user._id.toString()) {
			return res.status(401).json({
				success: false,
				message: "You are not authorized to delete this post"
			});
		}

		post.caption = req.body.caption;
		await post.save();

		res.status(200).json({
			success: true,
			message: "Post updated",
			post,
		});

	} catch (error) {
		res.status(500).json({
			status: false,
			message: error.message
		});
	}
};

exports.deletePost = async (req, res) => {
	try {

		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found"
			});
		}

		if (post.owner.toString() !== req.user._id.toString()) {
			return res.status(401).json({
				success: false,
				message: "You are not authorized to delete this post"
			});
		}

		await post.remove();

		const user = await User.findById(req.user._id);
		const idx = user.posts.indexOf(req.params.id);
		user.posts.splice(idx, 1);
		await user.save();

		res.status(200).json({
			success: true,
			message: "Post deleted",
		});

	} catch (error) {
		res.status(500).json({
			status: false,
			message: error.message
		});
	}
};

exports.likeOrUnlikePost = async (req, res) => {
	try {

		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found"
			});
		}

		if (post.likes.includes(req.user._id)) {
			const idx = post.likes.indexOf(req.user._id);
			post.likes.splice(idx, 1);
			await post.save();
			return res.status(200).json({
				success: true,
				message: "Post unliked",
				post,
			});
		}
		else {
			post.likes.push(req.user._id);
			await post.save();
			return res.status(200).json({
				success: true,
				message: "Post liked",
				post,
			});
		}

	} catch (error) {
		res.status(500).json({
			status: false,
			message: error.message
		});
	}
};

exports.getPostsOfFollowing = async (req, res) => {
	try {

		const user = await User.findById(req.user._id);

		const posts = await Post.find({
			owner: {
				$in: user.following
			}
		}).populate("owner likes comments.user");

		res.status(200).json({
			success: true,
			posts: posts.reverse(),
		});

	} catch (error) {
		res.status(500).json({
			status: false,
			message: error.message
		});
	}
};

exports.addComment = async (req, res) => {
	try {

		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found"
			});
		}

		let commentIdx = -1;
		post.comments.forEach((item, index) => {
			if (item.user.toString() === req.user._id.toString()) {
				commentIdx = index;
			}
		});

		if (commentIdx !== -1) {
			post.comments[commentIdx].comment = req.body.comment;
			await post.save();
			return res.status(200).json({
				success: true,
				message: "Comment updated",
				post,
			});
		} else {
			const postComment = {
				user: req.user._id,
				comment: req.body.comment,
			};
			post.comments.push(postComment);
			await post.save();
			return res.status(200).json({
				success: true,
				message: "Comment added",
				post,
			});
		}

	} catch (error) {
		res.status(500).json({
			status: false,
			message: error.message
		});
	}
};

exports.removeComment = async (req, res) => {
	try {

		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found"
			});
		}

		if (post.owner.toString() === req.user._id.toString()) {
			if (req.body.commentId === undefined) {
				return res.status(400).json({
					success: false,
					message: "Comment id not provided"
				});
			}
			post.comments.forEach((item, index) => {
				if (item._id.toString() === req.body.commentId.toString()) {
					post.comments.splice(index, 1);
					return;
				}
			});
			await post.save();
			return res.status(200).json({
				success: true,
				message: "Comment removed",
			});
		} else {
			post.comments.forEach((item, index) => {
				if (item.user.toString() === req.user._id.toString()) {
					post.comments.splice(index, 1);
					return;
				}
			});
			await post.save();
			return res.status(200).json({
				success: true,
				message: "Comment removed",
			});
		}

	} catch (error) {
		res.status(500).json({
			status: false,
			message: error.message
		});
	}
};
