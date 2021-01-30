const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const pageUtils = require("../utils/page.utils");
const { pageComments } = pageUtils;

/*
POST /api/posts/:postid/comments
id가 postid인 글에 댓글 추가하기
jwt 토큰 요구
*/

async function createComment(req, res, next) {
    try {
        const postId = req.params.postid;
        const owner = req.user.userid;
        const { content } = req.body;

        const post = await Post.findById(postId);
        if (!post) res.status(404).json({ error: "Posts not found", done: false });

        const comment = new Comment({ post_id: postId, owner: owner, content: content });
        await comment.save();
        await post.updateOne({ $push: { comments: comment._id }, $inc: { commentcnt: 1 } });
        return res.status(200).json({ comment: comment, done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

/*
GET /api/posts/:postid/comments
특정 글에 대한 모든 댓글들의 정보를 받음

다음과 같은 param 항목을 가질 수 있음

page: 현재 보여주는 페이지, 한 페이지는 글을 10개 표시 (maxPost), 첫 페이지는 page=1임.
기본값은 1이며, 존재하지 않는 페이지를 나타내는 경우 오류를 return함.
추가로, page=0인 경우 페이지를 무시하고 모든 글들의 정보를 return함.
*/

async function readComments(req, res, next) {
    try {
        const postId = req.params.postid;
        const { page } = req.query;

        let comments;
        if (page == 0) comments = await Comment.find({ post_id: postId }).sort({ posttime: -1 });
        else {
            const totalCnt = await Comment.countDocuments({ post_id: postId });
            if (totalCnt == 0) return res.status(404).json({ error: "Comments not found" });

            const { postCnt, curPage, pageCnt, skipCnt } = pageComments(page, totalCnt);
            if (curPage > pageCnt) return res.status(400).json({ error: "Wrong page number - exceed maximum page number" });
            else if (curPage < 0) return res.status(400).json({ error: "Wrong page number - lower then 0" });

            comments = await Comment.find({ post_id: postId }).sort({ posttime: -1 }).skip(skipCnt).limit(postCnt);
        }

        return res.status(200).json(comments);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

/*
PUT /api/posts/:postid/comments/:commentid
id가 postid인 글에서 id가 commentid인 댓글 수정
jwt 토큰 요구
*/

async function updateComment(req, res, next) {
    try {
        const postId = req.params.postid;
        const commentId = req.params.commentid;
        const { content } = req.body;
        const curtime = new Date().toISOString();

        const post = await Post.findById(postId);
        if (!post) res.status(404).json({ error: "Posts not found", done: false });

        let comment = await Comment.findById(commentId);
        if (!comment) res.status(404).json({ error: "Comments not found", done: false });
        if (comment.owner != req.user.userid) return res.status(401).json({ error: "Unauthorized", done: false });

        await comment.updateOne({ content: content, modifytime: curtime });
        comment = await Comment.findById(commentId);
        return res.status(200).json({ comment: comment, done: true });
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
        const postId = req.params.postid;
        const commentId = req.params.commentid;

        const post = await Post.findById(postId);
        if (!post) res.status(404).json({ error: "Posts not found", done: false });

        const comment = await Comment.findById(commentId);
        if (!comment) res.status(404).json({ error: "Comments not found", done: false });
        if (comment.owner != req.user.userid) return res.status(401).json({ error: "Unauthorized", done: false });

        await post.updateOne({ $pull: { comments: commentId }, $inc: { commentcnt: -1 } });
        await comment.deleteOne();
        return res.status(200).json({ done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

module.exports.createComment = createComment;
module.exports.readComments = readComments;
module.exports.updateComment = updateComment;
module.exports.deleteComment = deleteComment;