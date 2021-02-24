const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

/*
POST /api/users
새로운 유저 생성
*/

async function createUser(req, res, next) {
    try {
        const { userid, useremail, password } = req.body;
        const user = new User({ userid: userid, useremail: useremail, password: password });
        await user.save();
        return res.status(200).json({ user: user, done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

/*
GET /api/users/:userid
특정 유저의 팔로우/팔로잉, id, 이메일 정보 얻기
*/

async function getUserInfo(req, res, next) {
    try {
        const { userid } = req.params;

        let user = await User.findOne({ userid });
        if (!user) res.status(404).json({ error: "Users not found", done: false });

        const { useremail, followercnt, followers, followingcnt, followings } = user;
        return res.status(200).json({ userid, useremail, followercnt, followers, followingcnt, followings, done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

/*
PUT /api/users
현재 유저의 정보 수정 (이메일, 비밀번호만 변경할 수 있음)
oldpassword로 비밀번호를 한번 더 확인함
jwt 토큰 필요
*/

async function updateUser(req, res, next) {
    try {
        const curUser = req.user.userid;
        const { useremail, password, oldpassword } = req.body;

        let user = await User.findOne({ userid: curUser });
        if (!user) res.status(404).json({ error: "Users not found", done: false });

        const pwdCheck = await bcrypt.compare(oldpassword, user.password)
        if (!pwdCheck) res.status(401).json({ error: "Wrong password", done: false });

        user.useremail = useremail;
        user.password = password;
        await user.save();
        post = await User.findOne({ userid: curUser });
        return res.status(200).json({ user: user, done: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: err, done: false });
    }
}

/*
DELETE /api/users
현재 유저의 정보 삭제
jwt 토큰 필요
*/

async function deleteUser(req, res, next) {
    try {
        const curUser = req.user.userid;
        const { password } = req.body;
        const user = await User.findOne({ userid: curUser });
        if (!user) return res.status(404).json({ error: "Users not found", done: false });

        const pwdCheck = await bcrypt.compare(password, user.password);
        if (!pwdCheck) res.status(401).json({ error: "Wrong password", done: false });

        // 작성한 글들 지우기
        const posts = await Post.find({ owner: curUser });
        if (posts) {
            for (const post of posts) {
                const postId = post._id;
                await User.updateMany({ watched: postId }, { $pull: { watched: postId } });
                await User.updateMany({ favorites: postId }, { $pull: { favorites: postId } });
                await Comment.deleteMany({ post_id: postId });
                await post.deleteOne();
            }
        }

        // 작성한 댓글들 지우기
        const comments = await Comment.find({ owner: curUser });
        if (comments) {
            for (const comment of comments) {
                const post = await Post.findById(comment.post_id);
                await post.updateOne({ $pull: { comments: comment._id }, $inc: { commentcnt: -1 } });
                await comment.deleteOne();
            }
        }

        await User.updateMany({ followings: curUser }, { $pull: { followings: curUser }, $inc: { followingcnt: -1 } });
        await user.deleteOne();
        return res.status(200).json({ done: true });
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
            await post.updateOne({ $inc: { likecnt: 1 }, $push: { likeusers: userId } });
            return res.status(200).json({ status: 'add', done: true });
        } else {
            await user.updateOne({ $pull: { favorites: postId } });
            await post.updateOne({ $inc: { likecnt: -1 }, $pull: { likeusers: userId } });
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
PUT /api/users/following/:userid
특정한 유저의 팔로우 상태 토글하기
jwt 토큰 요구
*/

async function toggleFollowing(req, res, next) {
    try {
        const curUserId = req.user.userid;
        const followingUserId = req.params.userid;
        const followingUser = await User.findOne({ userid: followingUserId });
        if (!followingUser) return res.status(404).json({ error: "Users not found", done: false });

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
GET /api/users/following/:userid
특정한 유저의 팔로우 상태 확인하기
jwt 토큰 요구
*/

async function checkFollowing(req, res, next) {
    try {
        const followingUserId = req.params.userid;
        const user = await User.findOne({ userid: req.user.userid, followings: followingUserId });
        if (!user) return res.status(200).json({ 'user': followingUserId, 'following': false });
        else return res.status(200).json({ 'user': followingUserId, 'following': true });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

module.exports.createUser = createUser;
module.exports.getUserInfo = getUserInfo;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.toggleFavorite = toggleFavorite;
module.exports.checkFavorite = checkFavorite;
module.exports.toggleFollowing = toggleFollowing;
module.exports.checkFollowing = checkFollowing;
