/**
 * Created by roma on 28.04.16.
 */
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

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");

    var wTrackModel = dbObject.model("wTrack", wTrackSchema);
    var EmployeeModel = dbObject.model('Employees', employeeSchema);
    var wTrackArray = [];

    wTrackModel.find({}, function (err, result) {
        if (err) {
            console.log(err);
        }

        async.each(result, function (wTrack, cb) {
            var month = wTrack.month;
            var year = wTrack.year;
            var week = wTrack.week;
            var employee = wTrack.employee;
            var day;
            var dayFirst;
            var dateLast;
            var dateFirst;
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
                dateLast = moment().isoWeekYear(wTrack.isoYear || year).month(month - 1).week(week).day(day);
                dateFirst = moment().isoWeekYear(wTrack.isoYear || year).month(month - 1).week(week).day(dayFirst);
            } else {

                cb();
                return;
            }

            if (dateLast && dateFirst) {

                EmployeeModel.findById(employee, function (err, emp) {

                    var dataHire;
                    var isEmployee;
                    var dataFire;

                    if (err) {
                        return cb(err);
                    }

                    dataHire = emp.hire[0];
                    isEmployee = emp.isEmployee;
                    dataFire = emp.fire[emp.fire.length - 1] || null;

                    if (dataHire > dateFirst.toDate() || (!isEmployee && dataFire && dataFire < dateLast.toDate())) {
                        wTrackArray.push(wTrack._id);
                        console.log(wTrack._id, wTrack.worked, wTrack.month, wTrack.year);
                    }
                    cb();
                });
            } else {
                cb();
            }

        }, function (err) {
            if (err) {
                console.log(err);
            }

            console.log(wTrackArray.length);
        });
    });

});
