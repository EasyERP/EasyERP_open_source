var mongoose = require('mongoose');
var isoWeekYearComposer = require('../../public/js/helpers/isoWeekYearComposer');
var dbObject;
require('../../models/index.js');

dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, {
    db    : {native_parser: true},
    server: {poolSize: 5},
    user  : 'easyerp',
    pass  : '1q2w3e!@#'
});

dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var query;
    var wTrackSchema;
    var wTrack;

    console.log("Connection to weTrack is success");

    wTrackSchema = mongoose.Schemas.wTrack;
    wTrack = dbObject.model("wTrack", wTrackSchema);

    query = wTrack.find({$or: [/*{month: 12, week: 1},*/ {month: 1, week: 53}]});

    query.exec(function (error, res) {
        var isoYear;
        var query;
        var dateByWeek;

        if (error) {
            return console.dir(error);
        }

        res.forEach(function (wt) {
            isoYear = isoWeekYearComposer(wt.year, wt.week, wt.month);

            dateByWeek = wt.week + isoYear * 100;
            query = {'isoYear': isoYear, 'dateByWeek': dateByWeek};

            wTrack.findByIdAndUpdate(wt._id, query, function (err, response) {
                if (err) {
                    console.log(err);
                }

                console.log(response);
            });
        });
    });

});

