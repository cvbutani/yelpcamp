var express =require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err,campground)  {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err,campground)  {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully comment added");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnersship, function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err || !campground) {
            req.flash("error", "Campground doesn't exists");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        });
    });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnersship, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
          res.redirect("/campgrounds/" + req.params.id );
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnersship, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
           res.redirect("back");
        } else {
            req.flash("success", "Comment successfully deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;