const User = require('../schemas/userModel.js');
const Post = require('../schemas/postModel.js');
const sendEmail = require('../middlewares/sendMail.js');
const crypto = require('crypto');

exports.registerUser = async (req, res) => {
	try {

		const {
			name,
			email,
			password,
		} = req.body;

		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({
				success: false,
				message: 'User already exists'
			});
		}

		user = await User.create({
			name,
			email,
			password,
			avatar: {
				public_id: "req.body.public_id",
				url: "req.body.url",
			}
		});

		const token = user.generateToken();
		const options = {
			httpOnly: true,
			expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		}

		res.status(201).cookie("token", token, options).json({
			success: true,
			user,
			token,
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

exports.loginUser = async (req, res) => {
	try {

		const { email, password } = req.body;
		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'User does not exist'
			});
		}

		const validatePassword = await user.authenticatePasswords(password);
		if (!validatePassword) {
			return res.status(400).json({
				success: false,
				message: 'Incorrect password'
			});
		}

		const token = user.generateToken();
		const options = {
			httpOnly: true,
			expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		}

		res.status(200).cookie("token", token, options).json({
			success: true,
			user,
			token,
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

exports.logoutUser = async (req, res) => {
	try {

		res.status(200).cookie("token", null, {
			httpOnly: true,
			expires: new Date(Date.now()),
		}).json({
			success: true,
			message: 'User logged out',
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

exports.followOrUnfollowUser = async (req, res) => {
	try {

		const userToFollow = await User.findById(req.params.id);
		const loggedInUser = await User.findById(req.user._id);

		if (!userToFollow) {
			return res.status(400).json({
				success: false,
				message: 'User does not exist'
			});
		}

		const alreadyFollowing = loggedInUser.following.includes(userToFollow._id);
		if (alreadyFollowing) {
			loggedInUser.following.pull(userToFollow._id);
			userToFollow.followers.pull(loggedInUser._id);

			await userToFollow.save();
			await loggedInUser.save();

			return res.status(200).json({
				success: true,
				message: 'User unfollowed',
			});
		}

		loggedInUser.following.push(userToFollow._id);
		userToFollow.followers.push(loggedInUser._id);

		await loggedInUser.save();
		await userToFollow.save();

		return res.status(200).json({
			success: true,
			message: 'User followed',
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

exports.changePassword = async (req, res) => {
	try {

		const user = await User.findById(req.user._id).select("+password");
		const { oldPassword, newPassword } = req.body;
		if (!oldPassword || !newPassword) {
			return res.status(400).json({
				success: false,
				message: 'Please provide both old and new password'
			});
		}

		const validatePassword = await user.authenticatePasswords(oldPassword);
		if (!validatePassword) {
			return res.status(400).json({
				success: false,
				message: 'Incorrect password'
			});
		}

		user.password = newPassword;
		await user.save();

		res.status(200).json({
			success: true,
			message: 'Password changed',
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

exports.updateUserProfile = async (req, res) => {
	try {

		const user = await User.findById(req.user._id);
		const { name, email } = req.body;

		if (name) {
			user.name = name;
		}
		if (email) {
			user.email = email;
		}

		await user.save();

		res.status(200).json({
			success: true,
			message: 'User profile updated',
			user,
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

exports.deleteMyAccount = async (req, res) => {
	try {

		const user = await User.findById(req.user._id);
		const posts = user.posts;
		const followers = user.followers;
		const following = user.following;
		const userID = user._id;

		await user.remove();
		res.cookie("token", null, {
			httpOnly: true,
			expires: new Date(Date.now()),
		});

		for (let i = 0; i < posts.length; i++) {
			const post = await Post.findById(posts[i]);
			await post.remove();
		}

		for (let i = 0; i < followers.length; i++) {
			const follower = await User.findById(followers[i]);
			follower.following.pull(userID);
			await follower.save();
		}

		for (let i = 0; i < following.length; i++) {
			const follows = await User.findById(following[i]);
			follows.followers.pull(userID);
			await follows.save();
		}

		res.status(200).json({
			success: true,
			message: 'User account deleted',
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

exports.getMyProfile = async (req, res) => {
	try {

		const user = await User.findById(req.user._id)
			.populate("posts");
		res.status(200).json({
			success: true,
			user,
		});


	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

exports.getUserProfile = async (req, res) => {
	try {

		const user = await User.findById(req.params.id)
			.populate("posts");
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'User does not exist'
			});
		}

		res.status(200).json({
			success: true,
			user,
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

exports.getAllUsers = async (req, res) => {
	try {

		const users = await User.find({});
		res.status(200).json({
			success: true,
			users,
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

exports.forgotPassword = async (req, res) => {
	try {

		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'User does not exist'
			});
		}

		const resetPasswordToken = user.getResetPasswordToken();
		await user.save();

		const resetUrl = `${req.protocol}://${req.get("host")}/userapi/password/reset/${resetPasswordToken}`;
		const emailMsg = `Reset Your Password \n\n Click on the link below to reset your password \n\n ${resetUrl}`;

		try {
			await sendEmail({
				email: user.email,
				subject: "Reset Password",
				message: emailMsg
			});
			res.status(200).json({
				success: true,
				message: "Message sent to your email"
			});
		} catch (error) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpires = undefined;
			res.status(500).json({
				success: false,
				message: error.message
			});
		}

	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

exports.resetPassword = async (req, res) => {
	try {

		const resetPasswordToken = crypto
			.createHash("sha256")
			.update(req.params.token)
			.digest("hex");

		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpires: { $gt: Date.now() }
		});
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Token is invalid or has expired"
			});
		}

		user.password = req.body.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		await user.save();
		res.status(200).json({
			success: true,
			message: "Password reset successfully"
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

