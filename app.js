const express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport');

const User = require("./db");
const test = require("./test");

const testOutput = test.calculate;
console.log(test.calculate(2,3));
console.log(testOutput(2,5));

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

User();

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});



app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/status");
    } else {
        res.render("home");
    }

});

app.get("/status", (req, res) => {
    if (req.isAuthenticated()) {
        User.find(req.user._id, (err, foundUser) => {
            if (err) {
                console.log(err);
            } else {
                if (foundUser) {
                    res.render("status", {
                        newUser: foundUser
                    });
                }
            }
        });
    } else {
        res.redirect("login");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    User.register({
        username: req.body.username,
        fullName: req.body.fullName
    }, req.body.password, (err, user) => {

        if (err) {
            console.log(err);
            res.redirect("/login");
        } else {
            passport.authenticate('local')(req, res, function () {
                res.redirect("/status");
            })
        }
    })
});

app.post("/login", (req, res) => {

    const user = new User({
        email: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, function () {
                res.redirect("/status");
            });
        }
    });
});


app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});





app.listen("3000", (req, res) => {
    console.log("server is running on port 3000 successfully");
});