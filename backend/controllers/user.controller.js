const User = require('../models/user.model');

/*
POST /api/users
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

module.exports.createUser = createUser;
