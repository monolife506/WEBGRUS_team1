const User = require('../models/user.model');
const Post = require('../models/post.model');

/*
POST /api/users/
새로운 유저 생성
*/

async function createUser(req, res, next) {
    try {
        console.log("Request to createUser:");
        console.log(req.body);

        const user = new User(req.body);
        await user.save();
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
PUT /api/users/
현재 유저의 정보 수정
jwt 토큰 필요
*/

/*
DELETE /api/users/
현재 유저의 정보 삭제
jwt 토큰 필요
*/

/*
PUT /api/users/favorites
id가 postid인 글을 현재 유저의 favorite list에 추가
이미 그 글이 favorite list에 존재한다면 제거
jwt 토큰 필요
*/

async function toggleFavorite(req, res, next) {
    try {
        const post = await Post.findById(req.params.postid);
        const user = await User.findOne({ userid: req.user.userid, favorites: req.params.postid });
        if (!user) {
            await User.findOneAndUpdate({ userid: req.user.userid }, { $push: { favorites: req.params.postid } });
            await post.updateOne({ $inc: { likecnt: 1 } });
            return res.status(200).json({ 'status': 'add' });
        } else {
            await user.updateOne({ $pull: { favorites: req.params.postid } });
            await post.updateOne({ $inc: { likecnt: -1 } });
            return res.status(200).json({ 'status': 'del' });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

/*
GET /api/users/favorites/:postid
현재 유저가 특정 글에 좋아요 표시를 했는지 확인
jwt 토큰 필요
*/

async function checkFavorite(req, res, next) {
    try {
        const user = await User.findOne({ userid: req.user.userid, favorites: req.params.postid });
        if (!user) return res.status(200).json({ 'post': req.params.postid, 'favorite': false });
        else return res.status(200).json({ 'post': req.params.postid, 'favorite': true });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err);
    }
}

module.exports.createUser = createUser;
module.exports.toggleFavorite = toggleFavorite;
module.exports.checkFavorite = checkFavorite;
