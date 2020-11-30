// auth.controller.js
// 현재 유저의 로그인/로그아웃 관리

const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user.model');

/*
POST /auth/login
로그인 - JWT 발급
*/

async function setAuth(req, res, next) {
    let user, token;
    try {
        // local 방식으로 인증
        user = await passport.authenticate('local', { session: false });
        if (!user) return res.status(400).end();
        // local 방식으로 로그인 성공 시 토큰 생성
        await req.login(user, { session: false });
        token = jwt.sign({ userid: user.userid }, 'secret', { expiresIn: "24h" });
    }
    catch (err) {
        next(err);
    }
    return res.json({ user, token });
}

/*
POST /auth/logout
로그아웃 - JWT 데이터 제거
*/

function deleteAuth(req, res, next) {
    req.logout();
}

