const app = require('./app');
const { connectDB } = require('../backend/config/database');

connectDB();

app.listen(process.env.PORT, () => {
	console.log(`Server: http://localhost:${process.env.PORT}`);
});
