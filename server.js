require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const flash = require('connect-flash');
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

const PORT = 3000 || process.env.PORT;

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

mongoose.connect("mongodb+srv://Codiscuss-admin:Codiscuss2020Codekaksha@codiscuss.qhijz.mongodb.net/codiscussDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
mongoose.set('useCreateIndex', true);
mongoose.connection.on("connected", () => {
    console.log("Connected to Database!");
});
mongoose.connection.on("error", () => {
    console.log("Failed to connect to database!");
});

const User = require("./database/User")

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        console.log("here 101");
        res.redirect("/dashboard");
    } else {
        console.log("here 102");
        res.sendFile(__dirname + "/public/index.html");
    }
});

app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
        console.log("here 1");
        res.redirect("/dashboard");
    } else {
        console.log("here 2");
        res.render("register");
    }
})
app.post("/register", (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
    });

    const password1 = req.body.password;
    const password2 = req.body.password2;

    if (password1 === password2) {
        User.register(newUser, req.body.password, function (err, user) {
            if (err) {
                console.log(err + " here 3");
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    console.log("here 4");
                    res.redirect("/dashboard");
                })
            }
        })
    } else {
        console.log("here 50");
        res.redirect("/register");
    }
});

app.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        console.log("here 9");
        res.redirect("/dashboard");
    } else {
        console.log("here 99");
        res.render("login");
    }
})

app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    function (req, res) {
        res.redirect('/dashboard');
    });

app.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) {
        console.log("here 5");
        res.render("dashboard");
    } else {
        console.log("here 6");
        res.redirect("/");
    }
})

app.listen(PORT, () => {
    console.log("Server Started!");
});