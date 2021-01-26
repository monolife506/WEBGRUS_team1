const fs = require('fs');
const Post = require("../models/post.model");
const User = require("../models/user.model");
const pageUtils = require("../utils/page.utils");
const { pagePosts, sortModes } = pageUtils;

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

// 로그인된 유저
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

// 로그인되지 않은 유저 (익명)
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
=====================================================

아래의 GET 메서드들은 여러개의 글을 표시하며,
다음과 같은 param 항목을 가질 수 있음

page: 현재 보여주는 페이지, 한 페이지는 글을 10개 표시 (maxPost), 첫 페이지는 page=1임.
기본값은 1이며, 존재하지 않는 페이지를 나타내는 경우 오류를 return함.
추가로, page=0인 경우 페이지를 무시하고 모든 글들의 정보를 return함.

sortby: 정렬 기준, 이에 따라 여러개의 글을 정렬하여 표시
- sortby=times: 가장 최근에 만들어진 글부터 정렬 (기본값)
- sortby=views: 조회수가 가장 많은 글부터 정렬
- sortby=likes: 좋아요 수가 가장 많은 글부터 정렬

=====================================================
*/

/*
GET /api/posts/users/:userid
id가 userid인 사용자가 작성한 글들의 정보를 받음
*/

async function readPostByUser(req, res, next) {
    try {
        const { page, sortby } = req.query;

        let posts;
        let sortMode = sortModes[sortby];
        if (!sortMode) sortMode = sortModes['views'];

        if (page == 0) posts = await Post.find({ owner: req.params.userid }).sort(sortMode);
        else {
            const totalCnt = await Post.countDocuments({ owner: req.params.userid });
            if (totalCnt == 0) return res.status(404).json({ error: "Posts not found" });

            const { postCnt, curPage, pageCnt, skipCnt } = pagePosts(page, totalCnt);
            if (curPage > pageCnt) return res.status(400).json({ error: "Wrong page number - exceed maximum page number" });
            else if (curPage < 0) return res.status(400).json({ error: "Wrong page number - lower then 0" });

            posts = await Post.find({ owner: req.params.userid }).sort(sortMode).skip(skipCnt).limit(postCnt);
        }

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

        const { page, sortby } = req.query;
        const userId = req.params.userid;

        let posts;
        let sortMode = sortModes[sortby];
        if (!sortMode) sortMode = sortModes['views'];

        if (page == 0) posts = await Post.find({ likeusers: userId }).sort(sortMode);
        else {
            const totalCnt = await Post.countDocuments({ likeusers: userId });
            if (totalCnt == 0) return res.status(404).json({ error: "Posts not found" });

            const { postCnt, curPage, pageCnt, skipCnt } = pagePosts(page, totalCnt);
            if (curPage > pageCnt) return res.status(400).json({ error: "Wrong page number - exceed maximum page number" });
            else if (curPage < 0) return res.status(400).json({ error: "Wrong page number - lower then 0" });

            posts = await Post.find({ likeusers: userId }).sort(sortMode).skip(skipCnt).limit(postCnt);
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

URI의 param으로 검색의 조건을 결정한다. (GET FORM의 mode)
mode=title // 제목에 따른 검색
mode=content // 내용에 따른 검색
mode=all // 제목과 내용에 따른 검색
mode=owner // 글 작성자에 따른 검색 
mode=tags // 글의 태그에 따른 검색

mode가 아래의 4가지 중 하나로 명시되지 않은 경우, mode=title로 간주
*/

async function readPostsBySearch(req, res, next) {
    try {
        const query = req.params.query;
        const { page, sortby, mode } = req.query;
        const searchModes = {
            'title': { title: { $regex: query, $options: 'i' } },
            'content': { description: { $regex: query, $options: 'i' } },
            'all': { $or: [{ title: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }] },
            'owner': { owner: { $regex: query, $options: 'i' } },
            'tags': { tags: query }
        }

        let posts;
        let searchMode = searchModes[mode];
        let sortMode = sortModes[sortby];
        if (!searchMode) searchMode = searchModes['title'];
        if (!sortMode) sortMode = sortModes['times'];

        if (page == 0) posts = await Post.find(searchMode).sort(sortMode);
        else {
            const totalCnt = await Post.countDocuments(searchMode);
            if (totalCnt == 0) return res.status(404).json({ error: "Posts not found" });

            const { postCnt, curPage, pageCnt, skipCnt } = pagePosts(page, totalCnt);
            if (curPage > pageCnt) return res.status(400).json({ error: "Wrong page number - exceed maximum page number" });
            else if (curPage < 0) return res.status(400).json({ error: "Wrong page number - lower then 0" });

            posts = await Post.find(searchMode).sort(sortMode).skip(skipCnt).limit(postCnt);
        };

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
        const { page, sortby } = req.query;

        let posts;
        let sortMode = sortModes[sortby];
        if (!sortMode) sortMode = sortModes['times'];

        if (page == 0) posts = await Post.find({}).sort(sortMode);
        else {
            const totalCnt = await Post.countDocuments({});
            if (totalCnt == 0) return res.status(404).json({ error: "Posts not found" });

            const { postCnt, curPage, pageCnt, skipCnt } = pagePosts(page, totalCnt);
            if (curPage > pageCnt) return res.status(400).json({ error: "Wrong page number - exceed maximum page number" });
            else if (curPage < 0) return res.status(400).json({ error: "Wrong page number - lower then 0" });

            posts = await Post.find({}).sort(sortMode).skip(skipCnt).limit(postCnt);
        };

        return res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err });
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
                fs.unlink(dir, (err) => { console.log(err); });
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



