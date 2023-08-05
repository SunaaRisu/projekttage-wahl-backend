const express = require('express');
const router = express.Router();

const LoginController = require('../controllers/user');

router.post("/login", LoginController.user_login);

router.get("/refresh_token", LoginController.refresh_token)

module.exports = router;