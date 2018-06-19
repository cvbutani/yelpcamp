var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj ={};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCamp){
        if(err || !foundCamp){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            if(foundCamp.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "Please login before attempting to edit campgrounds");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnersship = function(req, res, next){
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundCamp){
        if(err || !foundCamp){
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            if(foundCamp.author.id.equals(req.user._id)){
                next();
            } else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "Please login before attempting to editing comment");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in before you do anything !!");
    res.redirect("/login");
};

module.exports = middlewareObj;