const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport  = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/user.js");

// SIGNUP
router.route("/signup")
    .get( userController.renderSignUp)
    .post(wrapAsync(userController.userSignup));

// LOGIN
router.route("/login")
 .get(userController.renderLogIn)
 .post(saveRedirectUrl,passport.authenticate("local",{ failureRedirect:"/login" ,failureFlash: true}), 
    userController.userLogIn);

// LOGOUT
router.get("/logout",userController.userLogOut);
module.exports =router;