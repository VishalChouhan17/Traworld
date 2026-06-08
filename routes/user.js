const express = require("express");
const router = express.Router();
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync");
const { saveredirectUrl } = require("../middleware");
const usercontroller = require("../controllers/user.js");

router.route("/signup")
    .get(usercontroller.rendersignupform)
    .post(wrapAsync(usercontroller.signup));

router.route("/login")
    .get(usercontroller.renderloginform)
    .post(
        saveredirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        usercontroller.login
    );

router.get("/logout", usercontroller.logout);

module.exports = router;