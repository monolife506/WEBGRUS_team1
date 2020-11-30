const passport = require('passport');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').LocalStrategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const userModel = require('../models/user.model');

const localStrategyOptions = {
    useridField: "userid",
    passwordField: "password"
};

// db에 저장된 id와 비밀번호 대조
const localVerify = (userid, password, done) => {
    let user, pwdCheck;
    try {
        user = await userModel.findOne({ userid });
        if (!user) return done(null, false); // ID 존재 확인
        pwdCheck = await bcrypt.compare(password, user.password);
        if (!pwdCheck) return done(null, false); // 비밀번호 확인
    } catch (err) {
        done(err)
    }
    return done(null, user);
};

const jwtStrategyOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
};

// JWT 확인
async function jwtVerify(payload, done) {
    let user;
    try {
        user = await userModel.findOne({ userid: payload.userid })
        if (!user) return done(null, false);
    }
    catch (err) {
        return done(err);
    }
    return done(null, user);
};

passport.use(new JWTStrategy(jwtStrategyOptions, jwtVerify));
passport.use(new LocalStrategy(localStrategyOptions, localVerify));
passport.initialize();