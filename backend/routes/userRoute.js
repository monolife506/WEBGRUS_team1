const express = require('express');
const router = express.Router();

const User = require('../models/userModel');

// Testing GET API: get 
router.get('/users/:id', function (req, res, next) {
    const paramID = req.params.id;

    // error on parsing
    if (!userid)
        res.status(400).json();

    User.find({ userid: paramID })
        .then((user))
        .catch((err) => {
            console.error(err);
            next(err);
        });
});

module.exports = router;