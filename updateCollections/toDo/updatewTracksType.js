// to divide wTracks on ordinary and OT
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

dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, {
    db    : {native_parser: true},
    server: {poolSize: 5},
    user  : 'easyerp',
    pass  : '1q2w3e!@#'
}); // toDo connection

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log('Connection to db is success');
});

wTrack = dbObject.model("wTrack", wTrackSchema);
Vacation = dbObject.model("Vacation", vacationSchema);
Holiday = dbObject.model("Holiday", holidaySchema);

wTrack.find({_type: 'ordinary'}, function (err, results) { // if _type was set
    'use strict';

    if (err) {
        console.log(err);
    }
    async.eachSeries(results, function (doc, callback) {
        var el = doc.toJSON();
        var id = el._id;

        function findVacationByWeek(parallelCb) {
            var query = {};
            var i;
            var aggregateQuery = [];
            var dateByWeek = el.week + el.year * 100;
            var dateByWeekField = 'vacations.' + dateByWeek;
            var date = moment().isoWeekYear(el.year);
            var daysOfMonth = {};
            var month;
            var monthDay;
            var vacationsWeek = [];
            var day;

            date.isoWeek(el.week);

            for (i = 1; i <= 7; i++) {
                date.isoWeekday(i);
                month = date.month() + 1;
                day = date.date();
                daysOfMonth[day + 100 * month] = i;
            }

            query.$match = {};
            query.$match[dateByWeekField] = {$exists: true};
            query.$match.employee = el.employee;
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
            var year = el.year;
            var week = el.week;
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
                    },
                    {
                        $project: {
                            _id    : 0,
                            comment: 1,
                            date   : 1
                        }
                    },
                    {
                        $sort: {
                            date: 1
                        }
                    }
                ],
                function (err, result) {
                    if (err) {
                        parallelCb(err);
                    }

                    result.forEach(function (holiday) {
                        date = moment(holiday.date);
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

            el.worked = 0;
            updateBody.worked = 0;

            for (i = 7; i >= 1; i--) {
                el[i] = el[i] || 0;  // in case of null

                if ((i === 6) || (i === 7) || vacations[i] || holidays[i]) {
                    updateBody[i] = 0;
                } else {
                    if (el[i] > 8) {
                        el[i] = el[i] - 8;
                        updateBody[i] = 8;
                    } else {
                        updateBody[i] = el[i]; // for correctly calculation .worked
                        el[i] = 0;
                    }
                }
                updateBody.worked += parseInt(updateBody[i], 10);
                el.worked += parseInt(el[i], 10);
            }
            if (el.worked) {
                el._type = 'overtime';
                delete el._id;
                delete el.ID; // todo need to delete?

                if (updateBody.worked) {
                    oTWtrack = new wTrack(el);
                    async.parallel([function (cb) {
                        oTWtrack.save(function (err) {
                            if (err) {
                                cb(err);
                            }
                            cb();
                        });
                    }, function (cb) {
                        wTrack.update({_id: id}, {$set: updateBody}, function (err) {
                            if (err) {
                                cb(err);
                            }
                            cb();
                        });
                    }], function (err) {
                        if (err) {
                            waterfallCb(err);
                        }
                        console.log('wTrack overtime created, ordinary updated');
                        waterfallCb();
                    });
                } else {
                    wTrack.update({_id: id}, {$set : {_type: 'overtime'}}, function (err) {
                        if (err) {
                            waterfallCb(err);
                        }
                        console.log('ordinary updated to overtime');
                        waterfallCb();
                    });
                }
            } else {
                /*console.log('|');*/ // to see work
                waterfallCb();
            }
        }

        async.waterfall([getVacationAndHolidays, changeWTracks], function (err) {
            if (err) {
                callback(err);
            }
            callback();
        });

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('collection updated');
    });
});



