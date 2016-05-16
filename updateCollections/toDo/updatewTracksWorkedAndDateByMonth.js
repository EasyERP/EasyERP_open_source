/**
 * Created by liliy on 16.05.2016.
 */
// to divide wTracks on ordinary and OT
//____________________________________
// update only if _type and isoYear were set to all wTracks
var mongoose = require('mongoose');
var moment = require('../../public/js/libs/moment/moment');
var wTrackSchema;
var vacationSchema;
var dbObject;
var async = require('async');
var wTrack;
var Vacation;
var Holiday;
var holidaySchema;

require('../../models/index.js');

wTrackSchema = mongoose.Schemas['wTrack'];
vacationSchema = mongoose.Schemas['Vacation'];
holidaySchema = mongoose.Schemas['Holiday'];

dbObject = mongoose.createConnection('localhost', 'production', 27017, {
    db    : {native_parser: true},
    server: {poolSize: 5},
    user  : 'easyErp',
    pass  : '1q2w3e!@#'
}); // toDo connection

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log('Connection to db is success');
});

wTrack = dbObject.model("wTrack", wTrackSchema);

wTrack.find({}, function (err, results) { // if _type was set
    'use strict';

    if (err) {
        console.log(err);
    }
    async.eachSeries(results, function (doc, callback) {

        var worked = 0;
        var dateByMonth;
        var dateByWeek;

        for (var i = 7; i >= 1; i--){
            worked += parseInt(doc[i]) || 0;
        }

        dateByMonth = parseInt(doc.year, 10) * 100 + parseInt(doc.month);
        dateByWeek = parseInt(doc.isoYear, 10) * 100 + parseInt(doc.week);

        wTrack.findByIdAndUpdate(doc._id, {$set: {worked: worked, dateByMonth: dateByMonth, dateByWeek: dateByWeek}}, callback);

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('collection updated');
    });
});



