// auth.controller.js
// 현재 유저의 로그인/로그아웃 관리

const jwt = require('jsonwebtoken');
const passport = require('passport');

/*
POST /api/auth/login
로그인 - JWT 발급
*/

async function createAuth(req, res, next) {
    try {
        // local 방식으로 인증
        const user = await passport.authenticate('local', { session: false });
        if (!user) return res.status(400).json({ token: undefined });
        // local 방식으로 로그인 성공 시 토큰 생성
        await req.login(user, { session: false });
        token = jwt.sign({ userid: user.userid }, 'secret', { expiresIn: "24h" });
        return res.json({ token });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ token: undefined });
    }
}

/*
POST /api/auth/logout
로그아웃 - JWT 데이터 제거
*/

function deleteAuth(req, res, next) {
    req.logout();
}

module.exports.createAuth = createAuth;
module.exports.deleteAuth = deleteAuth;
