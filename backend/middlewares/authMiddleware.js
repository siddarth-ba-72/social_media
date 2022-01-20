const User = require('../schemas/userModel.js');
const jwt = require('jsonwebtoken');

exports.authenticatedUser = async function (req, res, next) {
	try {

		const { token } = req.cookies;
		if (!token) {
			return res.status(401).json({
				success: false,
				message: 'Please Login to continue',
			});
		}

		const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
		req.user = await User.findById(decoded._id);

		next();

	} catch (error) {
		res.status(500).json({
			status: false,
			message: error.message
		});
	}
};
