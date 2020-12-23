// auth.controller.js
// 현재 유저의 로그인/로그아웃 관리

const jwt = require('jsonwebtoken');
const passport = require('passport');

/*
POST /api/auth/login
로그인 - JWT 발급
*/

function createAuth(req, res, next) {
    passport.authenticate('local', { session: false }, (err, user) => {
        if (err) next(err);
        if (!user) return res.status(400).json({ token: 'undefined' });
        req.login(user, { session: false }, (err) => {
            if (err) next(err);
            const token = jwt.sign({ userid: user.userid }, 'secret', { expiresIn: '1h' });
            return res.json({ token });
        });
    })(req, res, next);
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
