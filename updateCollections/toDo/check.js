var mongoose = require('mongoose');
var async = require('async');
var moment = require('../../public/js/libs/moment/moment');

require('../../models/index.js');

var wTrackSchema = mongoose.Schemas.wTrack;
var employeeSchema = mongoose.Schemas.Employee;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);
var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var wTrackModel = dbObject.model("wTrack", wTrackSchema);
    var EmployeeModel = dbObject.model('Employees', employeeSchema);
    var wTrackArray = [];
    var counterDeleted = 0;
    var counterUpdated = 0;

    wTrackModel.find({}, function (err, result) {
        if (err) {
            console.log(err);
        }

        async.each(result, function (wTrack, cb) {
            var year = wTrack.year;
            var week = wTrack.week;
            var employee = wTrack.employee;
            var day;
            var dayFirst;
            var dateLast;
            var dateFirst;
            var dataForUpdate = {};
            var i;

            for (i = 1; i <= 7; i++) {
                if (wTrack[i]) {
                    day = i;
                }
            }

            for (i = 7; i >= 1; i--) {
                if (wTrack[i]) {
                    dayFirst = i;
                }
            }
            if (day && dayFirst) {
                dateLast = moment().year(wTrack.isoYear || year).isoWeek(week).day(day).startOf('day');
                dateFirst = moment().year(wTrack.isoYear || year).isoWeek(week).day(dayFirst).endOf('day');
            } else {
                cb();
                return;
            }

            if (dateLast && dateFirst) {

                EmployeeModel.findById(employee, function (err, emp) {

                    var dataHire;
                    var isEmployee;
                    var dataFire;
                    var weekDayFirst;
                    var weekDayLast;
                    var weekHire;
                    var weekFire;
                    var worked = wTrack.worked;


                    if (err) {
                        cb(err);
                        return;
                    }

                    dataHire = emp.hire[0];
                    weekHire = moment(dataHire).isoWeek() + moment(dataHire).year()*100;
                    isEmployee = emp.isEmployee;
                    dataFire = emp.fire[emp.fire.length - 1] || null;

                    if (dataFire) {
                        weekFire = moment(dataFire).isoWeek() + moment(dataFire).year()*100;
                    }

                    if (weekHire > wTrack.dateByWeek || (!isEmployee && weekFire && (weekFire < wTrack.dateByWeek))) {
                        counterDeleted += 1;
                        wTrackModel.findByIdAndRemove(wTrack._id,  function (err){
                            if (err){
                                return cb(err);
                            }

                            counterDeleted += 1;
                            cb();
                        });
                        return;
                    }

                    if (dataHire > dateFirst.toDate() || (!isEmployee && dataFire && dataFire < dateLast.toDate())) {
                        dataForUpdate = {};
                        weekDayFirst = moment(dataHire).isoWeekday();
                        if (dataFire){
                            weekDayLast = moment(dataFire).isoWeekday();
                        }

                        if (dataHire > dateFirst.toDate()) {
                            for (i = weekDayFirst - 1; i >= 1; i--) {
                                dataForUpdate[i] = null;
                                worked = worked - wTrack[i];
                            }
                        }
                        if (!isEmployee && dataFire && dataFire < dateLast.toDate()) {
                            for (i = 7; i >= weekDayLast + 1; i--) {
                                dataForUpdate[i] = null;
                                worked = worked - wTrack[i];
                            }
                        }

                        if (Object.keys(dataForUpdate).length) {
                            if (worked) {
                                dataForUpdate.worked  = worked;
                                wTrackModel.update({_id : wTrack._id}, {$set : dataForUpdate}, function (err){
                                    if (err){
                                        return cb(err);
                                    }
                                    counterUpdated += 1;
                                    cb();
                                });
                            } else {
                                wTrackModel.findByIdAndRemove(wTrack._id,  function (err){
                                    if (err){
                                        return cb(err);
                                    }

                                    counterDeleted += 1;
                                    cb();
                                });
                            }
                        } else {
                            cb();
                        }
                    } else {
                        cb();
                    }
                });
            } else {
                cb();
            }

        }, function (err) {
            if (err) {
                console.log(err);
                return;
            }

            console.log('Good');
            console.log(counterDeleted);
            console.log(counterUpdated);
        });
    });

});