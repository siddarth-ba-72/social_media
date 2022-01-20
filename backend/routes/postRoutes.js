const express = require('express');
const router = express.Router();

const {
	createPost
} = require('../controllers/postCtrl.js');

const { authenticatedUser } = require('../middlewares/authMiddleware.js');

router.route("/post/upload").post(authenticatedUser, createPost)

module.exports = router;
