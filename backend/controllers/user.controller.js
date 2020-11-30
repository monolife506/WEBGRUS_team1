var User = require('mongoose').model('User');

/*
POST /user
새로운 유저 생성
*/

function createUser(req, res, next) {
    const user = new User(req.body);

    const respond = () => {
        res.json({ error: undefined });
    }

    const onError = (err) => {
        res.status(409).json({ error: err })
    }

    user.save()
        .then(respond)
        .catch(onError)
}

module.exports.createUser = createUser;
