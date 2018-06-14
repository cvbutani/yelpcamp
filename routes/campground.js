var express =require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res) {
    Campground.find({}, function(err, camps) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:camps, currentUser: req.user});
        }
    });
   
});

router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new.ejs");
});

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,findCamp){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground:findCamp});
        }
    });
});

router.post("/", function(req, res) {
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

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;