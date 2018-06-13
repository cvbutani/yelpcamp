var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

var data = [
    {
        name        : "Aaron",
        image       : "http://www.ontarioparks.com/images/headers/parks/summer/1200/aaron.jpg",
        description : "The campground offers almost 100 campsites, one-third of which have electricity.  Campsites can accommodate equipment ranging from tents only to large trailers.  Amenities such as water taps, comfort stations and laundry facilities are close by.  Swimming, boating, great fishing and hiking are only a short distance away."
    } , {
        name        : "Balsam Lake",
        image       : "http://www.ontarioparks.com/images/headers/parks/summer/1200/balsamlake.jpg",
        description : "Balsam Lake has a range of campsites with and without electricity for tents and RVs. For a private, natural experience car access walk-in sites are also available. Campsites may be reserved from the second Friday in May through to the Thanksgiving weekend. Reservations are accepted five months in advance of arrival – reserve early to avoid disappointment."
    } , {
        name        : "Bon Echo",
        image       : "http://www.ontarioparks.com/images/headers/parks/summer/1200/bonecho.jpg",
        description : "Twenty-five canoe-in campsites are located on Joeperry and Pearson Lakes.  A short canoe trip of 10 to 30 minutes will get you to your campsite.  At each campsite, you will find a picnic table, tent space and a toilet nearby.  Joeperry Lake has the added bonus of a sandy beach."
    }];
    
function seedDB(){
    //  REMOVE ALL CAMPGROUNDS
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed Campground");
         //  ADD A FEW CAMPGROUNDS
        data.forEach(function(seed) {
            Campground.create(seed, function(err, data) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Added a Campground");
                    //  CREATE A COMMENT
                    Comment.create({
                        text    : "Awesome Place",
                        author  : "Chirag"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        } else {
                            data.comments.push(comment);
                            data.save();
                            console.log("Created new Comment");
                        }
                    });
                }
            });
        });
    });
}

module.exports = seedDB;