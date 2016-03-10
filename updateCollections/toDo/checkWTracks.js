/**
 * Created by liliy on 10.03.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var _ = require('../../node_modules/underscore/underscore');
var async = require('async');
var moment = require('../../public/js/libs/moment/moment');

var wTrackSchema = mongoose.Schemas.wTrack;
var ObjectId = mongoose.Types.ObjectId;

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var wTrackModel = dbObject.model("wTrack", wTrackSchema);
    var counter = 0;

    wTrackModel.find({}, function (err, result) {

        async.each(result, function (wTrack) {
            var month = wTrack.month;
            var year = wTrack.year;
            var week = wTrack.week;
            var day;

            for (var i = 1; i <= 7; i++){
                if (wTrack[i] !== 0){
                    day = i;
                }
            }

            var date = moment().isoWeekYear(year).month(month - 1).isoWeek(week).day(day);

            if (date){
                var checkMonth = moment(date).month() + 1;

                if (month > checkMonth){
                    console.log(wTrack._id);
                    console.log(year);
                    console.log(checkMonth);
                    console.log(moment(date).isoWeek());
                    console.log(new Date(date));
                    console.log(month);
                    console.log(week);
                    console.log(counter++);
                }
            }

        });
    });


});