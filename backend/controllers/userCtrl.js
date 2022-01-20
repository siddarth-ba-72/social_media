const User = require('../schemas/userModel.js');

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
