const { token } = require("morgan");
const Post = require("../models/post.model");
const authUtils = require("../utils/auth.utils");

/*
GET /api/posts/content/:id
글 하나의 정보를 받음
*/

async function getPost(req, res, next) {
    try {
        const postID = req.params.id;
        const resp = await Post.findOne({ _id: postID, isDeleted: false });
        if (!resp) return res.status(404);
        return res.status(200).json(resp);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
GET /api/posts/users/:userid
특정 작성자가 작성한 글들의 정보를 받음
*/

async function getPostByUser(req, res, next) {
    try {
        const postOwner = req.params.userid;
        const resp = await Post.find({ owner: postOwner, isDeleted: false });
        if (!resp) return res.status(404);
        return res.status(200).json(resp);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
GET /api/posts/all
모든 글들의 정보를 받음
*/

async function getAllPost(req, res, next) {
    try {
        const resp = await Post.find({ isDeleted: false });
        if (!resp) return res.status(404);
        return res.status(200).json(resp);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
POST /api/posts
새 글 추가하기
*/

async function makePost(req, res, next) {
    try {
        req.body.files = req.files;
        req.body.owner = req.user.userid;

        console.log("Request to makePost:");
        console.log(req.body);
        const post = new Post(req.body);
        await post.save();
        return res.status(200).json({});
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

module.exports.getPost = getPost;
module.exports.getPostByUser = getPostByUser;
module.exports.getAllPost = getAllPost;
module.exports.makePost = makePost;
