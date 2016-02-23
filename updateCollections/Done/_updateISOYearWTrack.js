var mongoose = require('mongoose');
require('../../models/index.js');

var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");

    var wTrackSchema = mongoose.Schemas.wTrack;
    var wTrack = dbObject.model("wTrack", wTrackSchema);

    var query = wTrack.find({month:12, week:1});

    query.exec(function (error, _res) {
        if (error) {
            return console.dir(error);
        }
        var nextYear;

        _res.forEach(function(wt){
            nextYear = wt.year + 1;
            wTrack.findByIdAndUpdate(wt._id, {$set: {'isoYear': nextYear}}, function(err, response){
                if (err){
                    console.log(err);
                }

                console.log(response);
            });
        });
    });

    query = wTrack.find({month:1, week: {$gte:10}});

    query.exec(function (error, _res) {
        if (error) {
            return console.dir(error);
        }
        var prevYear;

        _res.forEach(function(wt){
            prevYear = wt.year - 1;
            wTrack.findByIdAndUpdate(wt._id, {$set: {'isoYear': prevYear}}, function(err, response){
                if (err){
                    console.log(err);
                }

                console.log(response);
            });
        });
    });
});

