const express = require('express');
const router = express.Router();

const LoginController = require('../controllers/user');

router.post("/login", LoginController.user_login);

module.exports = router;