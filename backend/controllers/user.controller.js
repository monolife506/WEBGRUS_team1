const User = require('../models/user.model');
const Post = require('../models/post.model');
const { framework } = require('passport');

/*
POST /api/users/
새로운 유저 생성
*/

async function createUser(req, res, next) {
    try {
        const user = new User(req.body);
        await user.save();
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
PUT /api/users/:userid
현재 유저의 정보 수정 
jwt 토큰 필요
*/

/*
DELETE /api/users/:userid
현재 유저의 정보 삭제
jwt 토큰 필요
*/

async function deleteUser(req, res, next) {
    try {
        const userId = req.params.userid;
        const user = await User.findOne({ userid: userId });
        if (!user) return res.status(404).json({ error: "Users not found", done: false });
        if (user.owner != user.userid) return res.status(401).json({ error: "Unauthorized", done: false });

        await User.updateMany({ followings: userId }, { $pull: { followings: userId }, $inc: { followingcnt: -1 } });
        await user.deleteOne();
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

/*
PUT /api/users/favorites/:postid
id가 postid인 글을 현재 유저의 favorite list에 추가
이미 그 글이 favorite list에 존재한다면 제거
jwt 토큰 필요
*/

async function toggleFavorite(req, res, next) {
    try {
        const postId = req.params.postid;
        const userId = req.user.userid;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Posts not found", done: false });

        const user = await User.findOne({ userid: userId, favorites: postId });
        if (!user) {
            await User.findOneAndUpdate({ userid: userId }, { $push: { favorites: postId } });
            await post.updateOne({ $inc: { likecnt: 1 } });
            return res.status(200).json({ status: 'add', done: true });
        } else {
            await user.updateOne({ $pull: { favorites: postId } });
            await post.updateOne({ $inc: { likecnt: -1 } });
            return res.status(200).json({ status: 'del', done: true });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

/*
GET /api/users/favorites/:postid
현재 유저가 특정 글에 좋아요 표시를 했는지 확인
jwt 토큰 필요
*/

async function checkFavorite(req, res, next) {
    try {
        const postId = req.params.postid;
        const user = await User.findOne({ userid: req.user.userid, favorites: postId });
        if (!user) return res.status(200).json({ 'post': postId, 'favorite': false });
        else return res.status(200).json({ 'post': postId, 'favorite': true });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
PUT /api/users/following/{userid}
특정한 유저의 팔로우 상태 토글하기
jwt 토큰 요구
*/

async function toggleFollowing(req, res, next) {
    try {
        const curUserId = req.user.userid;
        const followingUserId = req.params.userid;
        const followingUser = await User.findOne({ userid: followingUserId });
        if (!followingUser)
            return res.status(404).json({ error: "Users not found", done: false });

        const user = await User.findOne({ userid: curUserId, followings: followingUserId });
        if (!user) {
            await User.findOneAndUpdate({ userid: curUserId }, { $push: { followings: followingUserId }, $inc: { followingcnt: 1 } });
            await followingUser.updateOne({ $push: { followers: curUserId }, $inc: { followercnt: 1 } });
            return res.status(200).json({ 'status': 'add', done: true });
        } else {
            await user.updateOne({ $pull: { followings: followingUserId }, $inc: { followingcnt: -1 } });
            await followingUser.updateOne({ $pull: { followers: curUserId }, $inc: { followercnt: -1 } });
            return res.status(200).json({ 'status': 'del', done: true });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

/*
GET /api/users/following/{userid}
특정한 유저의 팔로우 상태 확인하기
jwt 토큰 요구
*/

async function checkFollowing(req, res, next) {
    try {
        const followingUserId = req.params.userid;
        const user = await User.findOne({ userid: req.user.userid, followings: followingUserId });
        if (!user) return res.status(200).json({ 'user': followingUserId, 'favorite': false });
        else return res.status(200).json({ 'user': followingUserId, 'favorite': true });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

module.exports.createUser = createUser;
module.exports.deleteUser = deleteUser;
module.exports.toggleFavorite = toggleFavorite;
module.exports.checkFavorite = checkFavorite;
module.exports.toggleFollowing = toggleFollowing;
module.exports.checkFollowing = checkFollowing;
