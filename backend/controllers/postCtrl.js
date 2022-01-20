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
