const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config({ path: 'variables.env' });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ? Routes Imports
const postRoute = require('./routes/postRoutes.js');
const userRoute = require('./routes/userRoutes.js');

app.use("/postapi", postRoute);
app.use("/userapi", userRoute);

module.exports = app;
