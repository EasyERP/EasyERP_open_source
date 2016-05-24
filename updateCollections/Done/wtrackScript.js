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
    $match: {
        _type: 'ordinary'
    }
}, {
    $group: {
        _id   : {
            employee  : '$employee',
            dateByWeek: '$dateByWeek',
            year      : '$year',
            week      : '$week',
            month     : '$month',
            isoYear   : '$isoYear'
        },
        1     : {$sum: '$1'},
        2     : {$sum: '$2'},
        3     : {$sum: '$3'},
        4     : {$sum: '$4'},
        5     : {$sum: '$5'},
        6     : {$sum: '$6'},
        7     : {$sum: '$7'},
        worked: {$sum: '$worked'},
        root  : {$push: '$$ROOT'},
        dateByWeek: {$addToSet: '$dateByWeek'}
    }
}, {
    $project: {
        1        : 1,
        2        : 1,
        3        : 1,
        4        : 1,
        5        : 1,
        6        : 1,
        7        : 1,
        worked   : 1,
        root     : 1,
        arraySize: {$size: "$root"},
        dateByWeek: 1
    }
}, {
    $match: {
        $and: [{
            arraySize: {$gt: 1}
        }, {$or: [{1: {$gt: 8}}, {2: {$gt: 8}}, {3: {$gt: 8}}, {4: {$gt: 8}}, {5: {$gt: 8}}, {6: {$gt: 8}}, {7: {$gt: 8}}]}]

    }
}, {
    $group: {
        _id: '$_id.employee',
        dateByWeek: {$addToSet: '$_id.dateByWeek'}
    }
}, {
    $lookup: {
        from        : 'Employees',
        localField  : '_id',
        foreignField: '_id',
        as          : 'employee'
    }
}, {
    $project:{
        employee: {$arrayElemAt: ['$employee', 0]},
        dateByWeek: 1
    }
}, {
    $project:{
        employee: '$employee.name',
        dateByWeek: 1,
        _id: 0
    }
}], function (err, results) { // if _type was set
    'use strict';

    if (err) {
        console.log(err);
    }
    console.log(results);
    /*async.eachSeries(results, function (doc, callback) {
            var elem = doc;
            var id = elem._id._id;

            function findVacationByWeek(parallelCb) {
                var query = {};
                var i;
                var aggregateQuery = [];
                var dateByWeek = elem._id.week + elem._id.isoYear * 100;
                var dateByWeekField = 'vacations.' + dateByWeek;
                var date = moment().isoWeekYear(elem._id.isoYear);
                var daysOfMonth = {};
                var month;
                var monthDay;
                var vacationsWeek = [];
                var day;

                date.isoWeek(elem._id.week);

                for (i = 1; i <= 7; i++) {
                    date.isoWeekday(i);
                    month = date.month() + 1;
                    day = date.date();
                    daysOfMonth[day + 100 * month] = i;
                }

                query.$match = {};
                query.$match[dateByWeekField] = {$exists: true};
                query.$match.employee = elem._id.employee;
                aggregateQuery.push(query);

                query = {
                    $project: {
                        _id     : 0,
                        vacArray: 1,
                        month   : 1
                    }
                };

                aggregateQuery.push(query);

                query = {
                    $unwind: {
                        path             : '$vacArray',
                        includeArrayIndex: 'day'
                    }
                };

                aggregateQuery.push(query);

                Vacation.aggregate(aggregateQuery, function (err, vacations) {
                    if (err) {
                        parallelCb(err);
                    }
                    vacations.forEach(function (vacation) {
                        day = vacation.day + 1;
                        month = vacation.month;
                        monthDay = day + 100 * month;
                        if (daysOfMonth[monthDay]) {
                            vacationsWeek[daysOfMonth[monthDay]] = vacation.vacArray;
                        }
                    });
                    parallelCb(null, vacationsWeek);
                });
            }

            function findHolidaysByWeek(parallelCb) {
                var year = elem._id.isoYear;
                var week = elem._id.week;
                var date = moment([year, 2]);
                var holidaysWeek = [];
                var startDate;
                var endDate;
                var day;

                date.isoWeek(week);
                date.isoWeekday(1);

                startDate = new Date(date.toDate());

                date.isoWeekday(7);

                endDate = new Date(date.toDate());

                Holiday.aggregate([
                    {
                        $match: {
                            date: {$gte: startDate, $lte: endDate}
                        }
                    }, {
                        $project: {
                            _id    : 0,
                            comment: 1,
                            date   : 1
                        }
                    }, {
                        $sort: {
                            date: 1
                        }
                    }
                ], function (err, result) {
                    if (err) {
                        parallelCb(err);
                    }

                    result.forEach(function (holiday) {
                        var date = moment(holiday.date);
                        day = date.isoWeekday();
                        holidaysWeek[day] = 'H';
                    });

                    parallelCb(null, holidaysWeek);
                });
            }

            function getVacationAndHolidays(waterfallCb) {
                async.parallel([findVacationByWeek, findHolidaysByWeek], function (err, vacAndHol) {
                    if (err) {
                        waterfallCb(err);
                    }
                    waterfallCb(null, vacAndHol);
                });
            }

            function changeWTracks(vacAndHol, waterfallCb) {
                var i;
                var updateBody = {_type: 'ordinary'};
                var vacations = vacAndHol[0];
                var holidays = vacAndHol[1];
                var oTWtrack;

                var root = elem.root;

                var startObject = {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0
                };

                for (var i = 7; i >= 1; i--) {
                    if (root[0][i] <= 8) {
                        startObject[i] += root[0][i];
                    } else {
                        console.log('bad day');
                    }
                }

                for (var j = 1; j <= root.length - 1; j++) {
                    var el = root[j];

                    var newwTrack = _.clone(el);

                    for (var i = 7; i >= 1; i--) {
                        if (startObject[i] + el[i] <= 8) {
                            startObject[i] += el[i];
                        } else {
                            el._type = 'overtime'
                        }

                    }

                    if ( el._type === 'overtime'){
                        wTrack.findByIdAndUpdate(el._id, {$set: el}, function (err, result) {
                            if (err){
                                return console.log(err);
                            }
                        });
                    }
                }
                waterfallCb();
            }

            async.waterfall([getVacationAndHolidays, changeWTracks], function (err) {
                if (err) {
                    callback(err);
                }
                callback();
            });

        },
        function (err) {
            if (err) {
                return console.dir(err);
            }

            console.dir('collection updated');
        }
    )
    ;*/
})
;



