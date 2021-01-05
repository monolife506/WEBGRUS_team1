const Post = require("../models/post.model");
const User = require("../models/user.model");

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
        return res.status(200).json({ done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
GET /api/posts/content/:postid/
id가 postid인 글의 정보를 받음
로그인된 상태인 경우 조회수를 갱신한다.
*/

async function readPost(req, res, next) {
    try {
        const resp = await Post.findById(req.params.postid);
        if (!resp) return res.status(404);

        const user = await User.findOne({ userid: req.user.userid, watched: req.params.postid });
        if (!user) {
            await user.updateOne({ $push: { watched: req.params.postid } });
            await post.updateOne({ $inc: { viewcnt: 1 } });
        }
        return res.status(200).json(resp);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

async function readPostAnonymous(req, res, next) {
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
GET /api/posts/favorites/:userid
특정 유저가 선호하는 글들을 표시함
*/

async function readPostsByFavorites(req, res, next) {
    try {
        const user = await User.findOne(({ userid: req.params.userid }));
        if (!user) return res.status(404);

        const resp = [];
        for (let index = 0; index < user.favorites.length; index++) {
            const postid = user.favorites[index];
            let post = await Post.findById(postid);
            if (!post) return res.status(404);
            resp.push(post);
        }

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

async function deletePost(req, res, next) {
    try {
        const resp = await Post.findOne({ _id: req.params.postid }, 'owner');
        if (!resp) return res.status(404);
        if (resp.owner != req.user.userid) return res.status(401);
        await resp.deleteOne();
        return res.status(200).json({ done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

module.exports.createPost = createPost;
module.exports.readPost = readPost;
module.exports.readPostByUser = readPostByUser;
module.exports.readPostsByFavorites = readPostsByFavorites;
module.exports.readAllPost = readAllPost;
module.exports.deletePost = deletePost;



