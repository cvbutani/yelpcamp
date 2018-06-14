var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    seedDB          = require("./seeds"),
    Comment         = require("./models/comment")
    User            = require("./models/user");
    
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//  ===============
//  PASSPORT CONFIG
//  ===============
app.use(require("express-session")({
    secret:"I have nissan altima 2016",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  ===============
//  HOME PAGE ROUTE
//  ===============
app.get("/", function(req, res) {
         res.render("landing");
});

//  ===========
//  INDEX ROUTE
//  ===========

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, camps) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:camps});
        }
    });
   
});

//  ====================
//  NEW CAMPGROUND ROUTE
//  ====================

app.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new.ejs");
});

//  =====================
//  SHOW CAMPGROUND ROUTE
//  =====================

app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,findCamp){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground:findCamp});
        }
    });
});

//  =======================
//  CREATE CAMPGROUND ROUTE
//  =======================

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name:name, image:image, description:description};
    
    Campground.create(newCampground, function(err, newCamp){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//  ==============
//  COMMENTS ROUTE
//  ==============

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err,campground)  {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
});

app.post("/campgrounds/:id/comments",isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err,campground)  {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//  ==========
//  AUTH ROUTE
//  ==========

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//  ==========
//  LOGIN FORM
//  ==========

app.get("/login",function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),  function(req, res) {
    res.send("LOGIN LOGIC");
});

//  ============
//  LOGOUT ROUTE
//  ============

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Connected to server");
});