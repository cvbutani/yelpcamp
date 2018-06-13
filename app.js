var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds"),
    Comment     = require("./models/comment");
    
seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

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

app.get("/campgrounds/new", function(req, res) {
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

app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err,campground)  {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req,res){
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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Connected to server");
});