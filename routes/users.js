const express = require("express");
const router = express.Router();
const catchAsync = require("../Helpers/wrapAsync");
const passport = require("passport");

// user controller
const users = require("../controllers/users");



router.route("/register")
    .get(users.renderRegister) // Register/login route
    .post(catchAsync(users.registerUser)); // Register/login route
// Register/login route
// router.get("/", users.renderLogin);

router.route("/login")
    .get(users.renderLoginForm) // Login route
    .post(passport.authenticate("local", { // passport.authenticate failureFlash => flashes a message if there is a failure, failureRedirect => if things go wrong itredirects to the specified page
        failureFlash: true,
        failureRedirect: "/login"
    }), users.userLogin);

// Logout route
router.get("/logout", users.renderLogout)

module.exports = router;