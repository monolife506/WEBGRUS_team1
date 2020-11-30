const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

// 컨트롤러로 라우팅
router
    .route("/:id")
    .get(postController.getPost)
    .post(postController.makePost)

module.exports = router;
