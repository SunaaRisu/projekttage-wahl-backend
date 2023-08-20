const express = require('express');
const router = express.Router();
const aagd = require('../middleware/authAndGetData');

const LoginController = require('../controllers/user');

router.post("/login", LoginController.user_login);

router.get("/refresh_token", LoginController.refresh_token);

router.get("/get-user-data", aagd, LoginController.get_user_data);

router.delete("/delete", aagd, LoginController.delete);

router.post("/request-data", aagd, LoginController.request_data);

router.patch("/set-fav", aagd, LoginController.set_fav);

module.exports = router;