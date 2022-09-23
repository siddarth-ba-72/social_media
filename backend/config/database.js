const mongoose = require('mongoose');

exports.connectDB = () => {
	mongoose.connect(process.env.MONGO_URI)
		.then(() => {
			console.log('Database connected');
		})
		.catch(err => {
			console.log(err);
		});
};
