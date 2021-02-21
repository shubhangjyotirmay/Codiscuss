const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../database/User");

router
.get("/register", (req, res) => {
    res.redirect("/register.html");
    //res.sendFile(__dirname + "../public/register.html");
})
.post("/register", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User.register({username: email}, password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/dashboard");
            })
        }
    })
});

module.exports = router;