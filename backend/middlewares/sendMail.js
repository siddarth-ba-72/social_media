const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
	// let transport = nodemailer.createTransport({
	// 	service: 'gmail',
	// 	auth: {
	// 		user: process.env.MY_MAIL_ID,
	// 		pass: process.env.MY_MAIL_PASSWORD,
	// 	}
	// });
	var transport = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "fe1d7bc0a53788",
			pass: "5496c0826ced20"
		}
	});
	let mailOptions = {
		from: process.env.MY_MAIL_ID,
		to: options.email,
		subject: options.subject,
		text: options.message
	};
	await transport.sendMail(mailOptions, (error, data) => {
		if (error) console.log(error);
		else console.log(`email sent` + data.response);
	})
};

module.exports = sendEmail;
