const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// 컨트롤러로 라우팅
router
    .route("/")
    .post(userController.createUser);

module.exports = router;