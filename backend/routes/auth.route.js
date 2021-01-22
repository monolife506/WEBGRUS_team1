const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post("/login", authController.createAuth);
router.get(
    "/check",
    passport.authenticate('jwt', { session: false }),
    authController.checkAuth
);

module.exports = router;
