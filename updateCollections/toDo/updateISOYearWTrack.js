var mongoose = require('mongoose');
var isoWeekYearComposer = require('../../helpers/isoWeekYearComposer');
require('../../models/index.js');

var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");

    var wTrackSchema = mongoose.Schemas.wTrack;
    var wTrack = dbObject.model("wTrack", wTrackSchema);

    var query = wTrack.find({$or:[{month:12, week:1},{month:1, week: 53}]});

    query.exec(function (error, _res) {
        if (error) {
            return console.dir(error);
        }
        var isoYear;

        _res.forEach(function(wt){
            isoYear = isoWeekYearComposer(wt);
            wTrack.findByIdAndUpdate(wt._id, {$set: {'isoYear': isoYear}}, function(err, response){
                if (err){
                    console.log(err);
                }

                console.log(response);
            });
        });
    });

});

