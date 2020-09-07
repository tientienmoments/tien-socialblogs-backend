const express = require("express");
const router = express.Router();
const validators = require('../middlewares/validators')
const { body } = require("express-validator")
const authController = require("../controllers/authController")

/**
 * @route POST api/auth/login
 * @description login
 * @access Public
 */
router.post(
    "/login",
    validators.validate([
        body("email", "Invalid email").exists().isEmail(),
        body("password", "Invalid password").exists().notEmpty(),
    ]),
    authController.loginWithEmail
);
// make rout for login facebook
router.get(
    "/login/facebook/:token",
    authController.loginWithFacebook
    
)

//make router for login google
router.get(
    "/login/google/:token",
    authController.loginWithGoogle
)

module.exports = router;