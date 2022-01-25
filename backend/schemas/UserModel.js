const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({

	name: {
		type: String,
		required: [true, 'Name is required'],
	},

	avatar: {
		public_id: String,
		url: String,
	},

	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
	},

	password: {
		type: String,
		required: [true, 'Password is required'],
		minLength: [8, 'Password must be at least 8 characters'],
		select: false,
	},

	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		}
	],

	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		}
	],

	following: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		}
	],

	resetPasswordToken: String,
	resetPasswordExpires: Date,

});

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

userSchema.methods.authenticatePasswords = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
	return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY);
};

userSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString("hex");

	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model('User', userSchema);
