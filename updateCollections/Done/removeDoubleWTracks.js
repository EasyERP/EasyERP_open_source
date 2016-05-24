/**
 * Created by roma on 17.05.16.
 */
/**
 * Created by liliy on 13.05.2016.
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
var _ = require('../../node_modules/underscore/underscore');

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
Vacation = dbObject.model("Vacation", vacationSchema);
Holiday = dbObject.model("Holiday", holidaySchema);

wTrack.aggregate([{
    $group: {
        _id   : {
            employee  : '$employee',
            dateByWeek: '$dateByWeek',
            year      : '$year',
            week      : '$week',
            month     : '$month',
            isoYear   : '$isoYear',
            1     :  '$1',
            2     :  '$2',
            3     :  '$3',
            4     :  '$4',
            5     :  '$5',
            6     :  '$6',
            7     :  '$7',
            worked: '$worked',
            jobs: '$jobs'

        },
        root  : {$push: '$_id'}
    }
}, {
    $project: {
        _id: 1,
        root     : 1,
        arraySize: {$size: "$root"}
    }
}, {
    $match: {
        arraySize: {$gte: 2}
    }
}], function (err, results) { // if _type was set
    'use strict';

    if (err) {
        console.log(err);
    }
    console.log(results.length);
    async.each(results, function (doc, callback) {
        wTrack.remove({_id: {$in: doc.root}}, function (err, result){
            if (err){
                return console.log(err);
            }

            console.log(result)
        });
    })
});
;



