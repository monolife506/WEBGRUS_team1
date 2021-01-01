const Post = require("../models/post.model");

/*
POST /api/posts
새 글 추가하기
jwt 토큰 요구
*/

async function createPost(req, res, next) {
    try {
        req.body.files = req.files;
        req.body.owner = req.user.userid;
        console.log("Request to createPost:");
        console.log(req.body);

        const post = new Post(req.body);
        await post.save();
        return res.status(200);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
GET /api/posts/content/:postid
id가 postid인 글의 정보를 받음
*/

async function readPost(req, res, next) {
    try {
        const resp = await Post.findOne({ _id: req.params.postid });
        if (!resp) return res.status(404);
        return res.status(200).json(resp);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
GET /api/posts/users/:userid
id가 userid인 사용자가 작성한 글들의 정보를 받음
*/

async function readPostByUser(req, res, next) {
    try {
        const resp = await Post.find({ owner: req.params.userid });
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

async function readAllPost(req, res, next) {
    try {
        const resp = await Post.find({});
        if (!resp) return res.status(404);
        return res.status(200).json(resp);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}


/*
PUT /api/posts/:postid
id가 postid인 글 수정
jwt 토큰 요구
*/

/*
DELETE /api/posts/:postid
id가 postid인 글 제거
jwt 토큰 요구
*/

async function deleteAllPost(req, res, next) {
    try {
        const resp = await Post.findOne({ _id: req.params.postid }, 'owner');
        if (!resp) return res.status(404);
        if (resp.owner != req.user.userid) return res.status(401);
        await resp.deleteOne();
        return res.status(200);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

module.exports.createPost = createPost;
module.exports.readPost = readPost;
module.exports.readPostByUser = readPostByUser;
module.exports.readAllPost = readAllPost;


