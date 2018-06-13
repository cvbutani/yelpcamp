var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");
    
seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
         res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, camps) {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds:camps});
        }
    });
   
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,findCamp){
        if(err){
            console.log(err);
        } else {
            res.render("show", {campground:findCamp});
        }
    });
});

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


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Connected to server");
});