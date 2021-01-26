const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post("/", authController.createAuth);
router.get(
    "/",
    passport.authenticate('jwt', { session: false }),
    authController.checkAuth
);

module.exports = router;
