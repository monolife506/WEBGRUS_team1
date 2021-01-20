const Post = require("../models/post.model");

/*
POST /api/posts/:postid/comments
id가 postid인 글에 댓글 추가하기
jwt 토큰 요구
*/

async function createComment(req, res, next) {
    try {
        const postId = req.params.postid;

        req.body.owner = req.user.userid;
        let post = await Post.findById(postId);
        if (!post) res.status(404).json({ error: "Posts not found", done: false });

        await post.updateOne({ $push: { comments: req.body }, $inc: { commentcnt: 1 } });
        post = await Post.findById(postId);
        return res.status(200).json({ comment: post.comments.slice(-1)[0], done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

/*
PUT /api/posts/:postid/comments/:commentid
id가 postid인 글에사 id가 commentid인 댓글 수정
jwt 토큰 요구
*/

async function updateComment(req, res, next) {
    try {
        const postId = req.params.postid;
        const commentId = req.params.commentid;

        let post = await Post.findById(postId);
        if (!post) res.status(404).json({ error: "Posts not found", done: false });

        const comment = await post.comments.id(commentId);
        if (!comment) res.status(404).json({ error: "Comments not found", done: false });
        if (comment.owner != req.user.userid) return res.status(401).json({ error: "Unauthorized", done: false });

        req.body.modifytime = new Date().toISOString();
        await Post.updateOne(
            { 'comments._id': commentId },
            { 'comments.$.content': req.body.content, 'comments.$.modifytime': req.body.modifytime }
        );

        post = await Post.findById(postId);
        return res.status(200).json({ comment: post.comments.id(commentId), done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

/*
DELETE /api/posts/:postid/comments/:commentid
id가 postid인 글에사 id가 commentid인 댓글 지우기
jwt 토큰 요구
*/

async function deleteComment(req, res, next) {
    try {
        const post = await Post.findById(req.params.postid);
        if (!post) res.status(404).json({ error: "Posts not found", done: false });

        const comment = await post.comments.id(req.params.commentid);
        if (!comment) res.status(404).json({ error: "Comments not found", done: false });
        if (comment.owner != req.user.userid) return res.status(401).json({ error: "Unauthorized", done: false });

        await post.updateOne({ $pull: { comments: { _id: req.params.commentid } }, $inc: { commentcnt: -1 } });
        return res.status(200).json({ done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

module.exports.createComment = createComment;
module.exports.updateComment = updateComment;
module.exports.deleteComment = deleteComment;