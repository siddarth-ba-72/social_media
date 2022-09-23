const app = require('./app');
const { connectDB } = require('../backend/config/database');
const cloudinary = require("cloudinary");

connectDB();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
	console.log(`Server: http://localhost:${process.env.PORT}`);
});
