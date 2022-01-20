const Post = require('../schemas/postModel.js');
const User = require('../schemas/userModel.js');

exports.createPost = async (req, res) => {
	try {

		const newPost = {
			caption: req.body.caption,
			image: {
				public_id: "req.body.public_id",
				url: "req.body.url",
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
