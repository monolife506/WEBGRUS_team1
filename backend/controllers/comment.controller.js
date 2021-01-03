const Post = require("../models/post.model");

/*
POST /api/posts/:postid/comments
id가 postid인 글에 댓글 추가하기
jwt 토큰 요구
*/

async function createComment(req, res, next) {
    try {
        req.body.owner = req.user.userid;
        console.log("Request to createComment:");
        console.log(req.body);

        const post = await Post.findById(req.params.postid);
        await post.comments.push(req.body);
        return res.status(200);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
PUT /api/posts/:postid/comments/commentidx
id가 postid인 글에사 idx가 commentidx인 댓글 수정
jwt 토큰 요구
*/

async function updateComment(req, res, next) {
    try {
        req.body.modifytime = Date.now;
        console.log("Request to updateComment:");
        console.log(req.body);


        return res.status(200);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
DELETE /api/posts/:postid/comments
id가 postid인 글에 idx번째 댓글 지우기
jwt 토큰 요구
*/

async function deleteComment(req, res, next) {
    try {

        return res.status(200);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

module.exports.createComment = createComment;
module.exports.updateComment = updateComment;
module.exports.deleteComment = deleteComment;