var express =require("express");
var router = express.Router();

var passport = require("passport");
var User = require("../models/user");

router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

router.get("/", function(req, res) {
         res.render("landing");
});

router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    // eval(require("locus"));
    if(req.body.adminCode === "asdasd"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcoeme to Yelpcamp " + user.firstname);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login",function(req, res) {
    res.render("login", {page:'login'});
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),  function(req, res) {
    
    res.send("LOGIN LOGIC");
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;