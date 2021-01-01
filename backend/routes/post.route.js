const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('../controllers/post.controller');
const fileUtils = require('../utils/file.utils');

// 컨트롤러로 라우팅
router.get("/content/:postid", postController.readPost);
router.get("/users/:userid", postController.readPostByUser);
router.get("/all", postController.readAllPost);
router.post(
    "/",
    passport.authenticate('jwt', { session: false }), // 인증
    fileUtils.uploadFile, // 사진 업로드 (최대 30개)
    postController.createPost // DB상에 글의 정보 추가
);

module.exports = router;
