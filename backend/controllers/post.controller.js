const fs = require('fs');
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

        const { title, owner, description, tags, files } = req.body;
        const post = new Post({ title: title, owner: owner, description: description, tags: tags, files: files });
        await post.save();
        return res.status(200).json({ post: post, done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

/*
GET /api/posts/content/:postid/
id가 postid인 글의 정보를 받음
로그인된 상태인 경우 조회수를 갱신한다.
*/

async function readPost(req, res, next) {
    try {
        const curUser = req.user.userid;
        const postId = req.params.postid;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Posts not found" });

        const user = await User.findOne({ userid: curUser, watched: postId });
        if (!user) {
            await User.findOneAndUpdate({ userid: curUser }, { $push: { watched: postId } });
            await Post.findByIdAndUpdate(postId, { $inc: { viewcnt: 1 } });
        }

        return res.status(200).json(post);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

async function readPostAnonymous(req, res, next) {
    try {
        const post = await Post.findById(req.params.postid);
        if (!post) return res.status(404).json({ error: "Posts not found" });
        return res.status(200).json(post);
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
        const posts = await Post.find({ owner: req.params.userid });
        if (!posts) return res.status(404).json({ error: "Posts not found" });
        return res.status(200).json(posts);
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
        if (!user) return res.status(404).json({ error: "Users not found" });

        const posts = [];
        for (const postid of user.favorites) {
            let post = await Post.findById(postid);
            if (!post) return res.status(404).json({ error: "Posts not found" });
            posts.push(post);
        }

        return res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
GET /api/posts/search/:query
query를 포함하는 글들의 정보를 받음

URI Query의 mode로 검색의 조건을 결정한다. (GET FORM의 mode)
mode=title // 제목에 따른 검색
mode=content // 내용에 따른 검색
mode=all // 제목과 내용에 따른 검색
mode=owner // 글 작성자에 따른 검색 

mode가 아래의 4가지 중 하나로 명시되지 않은 경우, mode=title로 간주한다.
*/

async function readPostsBySearch(req, res, next) {
    try {
        const query = req.params.query;
        const mode = req.query.mode;
        const posts = [];

        switch (mode) {
            case 'content':
                posts = await Post.find({ description: { $regex: query, $options: 'i' } });
                break;
            case 'all':
                posts = await Post.find().or([{ description: { $regex: query, $options: 'i' } }, { title: { $regex: query, $options: 'i' } }]);
                break;
            case 'owner':
                posts = await Post.find({ owner: { $regex: query, $options: 'i' } });
                break;
            default: // case 'title'
                posts = await Post.find({ title: { $regex: query, $options: 'i' } });
                break;
        }

        return res.status(200).json({ posts: posts, mode: mode });
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
        const posts = await Post.find({});
        if (!posts) return res.status(404).json({ error: "Posts not found" });
        return res.status(200).json(posts);
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

async function updatePost(req, res, next) {
    try {
        const postId = req.params.postid;

        let post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Posts not found", done: false });
        if (post.owner != req.user.userid) return res.status(401).json({ error: "Unauthorized", done: false });

        const deletedFiles = req.body.deletedFiles;
        if (deletedFiles) {
            for (const fileName of deletedFiles) {
                let dir = 'public/images/' + fileName;
                fs.unlink(dir, (err) => {
                    console.log(err);
                });

                await post.updateOne({ $pull: { files: { filename: fileName } } });
            }
        }

        const newFiles = req.files;
        if (newFiles) {
            for (const obj of newFiles)
                await post.updateOne({ $push: { files: obj } });
        }

        const { title, description, tags } = req.body;
        await post.updateOne({ title: title, description: description, tags: tags });
        post = await Post.findById(postId);
        return res.status(200).json({ post: post, done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

/*
DELETE /api/posts/:postid
id가 postid인 글 제거
jwt 토큰 요구
*/

async function deletePost(req, res, next) {
    try {
        const postID = req.params.postid;
        const curUser = req.user.userid;

        const post = await Post.findById(postID);
        if (!post) return res.status(404).json({ error: "Posts not found", done: false });
        if (post.owner != curUser) return res.status(401).json({ error: "Unauthorized", done: false });

        await User.updateMany({ favorites: postID }, { $pull: { favorites: curUser } });
        await post.deleteOne();
        return res.status(200).json({ done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

module.exports.createPost = createPost;

module.exports.readPost = readPost;
module.exports.readPostAnonymous = readPostAnonymous;
module.exports.readPostByUser = readPostByUser;
module.exports.readPostsByFavorites = readPostsByFavorites;
module.exports.readAllPost = readAllPost;
module.exports.readPostsBySearch = readPostsBySearch;

module.exports.updatePost = updatePost;

module.exports.deletePost = deletePost;



