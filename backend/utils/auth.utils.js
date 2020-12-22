const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

const localStrategyOptions = {
    useridField: "userid",
    passwordField: "password"
};

// db에 저장된 id와 비밀번호 대조
async function localVerify(userid, password, done) {
    try {
        const user = await userModel.findOne({ userid: userid });
        if (!user) return done(null, false); // ID 존재 확인
        const pwdCheck = await bcrypt.compare(password, user.password);
        if (!pwdCheck) return done(null, false); // 비밀번호 확인
        return done(null, user);
    } catch (err) {
        console.log(err);
        done(err)
    }
};

const jwtStrategyOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret' // secret string, change this to global const later
};

// JWT 확인
async function jwtVerify(payload, done) {
    try {
        const user = await userModel.findOne({ userid: payload.userid })
        if (!user) return done(null, false);
        return done(null, user);
    }
    catch (err) {
        console.log(err);
        return done(err);
    }
};

module.exports.init = () => {
    passport.use(new LocalStrategy(localStrategyOptions, localVerify));
    passport.use(new JWTStrategy(jwtStrategyOptions, jwtVerify));
}