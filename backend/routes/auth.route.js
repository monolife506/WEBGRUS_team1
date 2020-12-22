const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// 컨트롤러로 라우팅
router
    .route("/login")
    .post(authController.createAuth);

router
    .route("/logout")
    .post(authController.deleteAuth);

module.exports = router;
