require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const flash = require('connect-flash');
const nodemailer = require("nodemailer");
const http = require("http");
const socketio = require("socket.io");
const passportLocalMongoose = require("passport-local-mongoose");
const {
    getUserDashboard,
} = require("./utils/user");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

app.use(session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie : {
        maxAge: 1000* 60 * 60 *24 * 365
    },
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

mongoose.connect(process.env.mongoURL, {
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

const User = require("./database/User");
const { Socket } = require("dgram");

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
app.use(bodyParser.json());

app.get("/verification", (req, res) => {
    if (req.isAuthenticated()) {
        console.log("here 69");
        res.redirect("/dashboard");
    } else {
        console.log("here 6969");
        res.render("verification");
    }
})

var checkCode = -1;
var userEmail;
var code;
var regConfirm = -1;
app.post("/verification", (req, res) => {
    checkCode = Math.floor(10000000 + Math.random() * 90000000);
    userEmail = req.body.email;
    console.log("here " + userEmail);
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.GMAIL_PASSWORD,
        },
    });
    var mailOptions = {
        from: process.env.GMAIL_ID,
        to: userEmail,
        subject: "Verification Code",
        html: `<p>Your 8-digit Verification Code is: ${checkCode}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.redirect("/verification");
        } else {
            console.log("Email sent: " + info.response + ` ${checkCode}`);
            //res.redirect("/register");
        }
    });
})

app.post("/confirm", (req, res) => {
    code = Number(req.body.code);
    if (code === checkCode) {
        console.log("here 5");
        regConfirm = 0;
        res.redirect("/register");
    } else {
        console.log("here 55");
        res.redirect("/verification");
    }
})

app.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
        console.log("here 1");
        res.redirect("/dashboard");
    } else if (regConfirm === 0) {
        console.log("here 2");
        res.render("register");
    } else {
        console.log("here 3");
        res.redirect("/verification");
    }
})

app.post("/register", (req, res) => {
    const name = req.body.name;
    const password1 = req.body.password;
    const password2 = req.body.password2;

    if (password1 === password2) {
        console.log("a1");
        const newUser = new User({
            name: name,
            email: userEmail,
            verified: true,
        });
        User.register(newUser, req.body.password, function (err, user) {
            console.log("a2");
            if (err) {
                console.log(err + " here 3");
                res.redirect("/register");
            } else {
                console.log("a3");
                User.authenticate("local")(req, res, function () {
                    console.log("here 4");
                    res.redirect("/login");
                });
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

var humaaraUser = {};
app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    function (req, res) {
        humaaraUser = req.user;
        //console.log(humaaraUser);
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

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
})

io.on("connection", socket => {
    socket.emit("dashboard", getUserDashboard(humaaraUser.name, humaaraUser.email));
});

server.listen(PORT, () => {
    console.log("Server Started!");
});