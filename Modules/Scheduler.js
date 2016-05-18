module.exports = function (db, model) {
    "use strict";
    var nodeScheduler = require('node-schedule');
    var mongoose = require('mongoose');
    var employeeSchema = mongoose.Schemas['Employee'];
    var logWriter = require('../helpers/logWriter');

    var rule = {
        hour  : 9,
        minute: 49
    };

    var Scheduler = function () {

        this.initEveryDayScheduler = function () {

            if (!process.env.INITED_SCHEDULER) {
                nodeScheduler.scheduleJob(rule, updateYearEmployees);
                process.env.INITED_SCHEDULER = true;
                console.log('=================== initEveryDayScheduler ===================');
            } else {
                logWriter.log('Scheduler.initEveryDayScheduler is inited');
                console.log('============== initEveryDayScheduler is INITED ==============');
            }
        }

    };

    var updateYearEmployees = function () {
        for (var key in db) {
            findBirthdayToday(model.get(key, 'Employees', employeeSchema));
        }
    };

    var findBirthdayToday = function (employeesModel) {
        var now = new Date();
        var day = now.getDate();
        var month = now.getMonth() + 1;
        var matchInObject = {
            $match: {
                dateBirth: {
                    $ne: null
                }
            }
        };
        var projectObject = {
            $project: {
                day  : {
                    $dayOfMonth: "$dateBirth"
                },
                month: {
                    $month: "$dateBirth"
                },
                age  : 1,
                dateBirth: 1
            }
        };
        var matchOutObject = {
            $match: {
                day  : {
                    $eq: day
                },
                month: {
                    $eq: month
                }
            }
        };

        employeesModel.aggregate([matchInObject, projectObject, matchOutObject], function (err, resObject) {

            if (err) {
                logWriter.log('Scheduler.findBirthdayToday findBirthdayToday aggregate Err ' + err);
                console.log(err);
            } else if (resObject && resObject.length) {
                resObject.forEach(updateBirthday);
            } else {
                logWriter.log('Scheduler.findBirthdayToday Today No Birthday');
                console.log('Today No Birthday');
            }

        });

        var updateBirthday = function (element, callback) {
            var id = element._id;
            var oldAge = element.age;
            var dateBirth = element.dateBirth;
            var age = new Date().getYear() - new Date(dateBirth).getYear();
            var update = {
                $set: {
                    age: age
                }
            };
            var options = {
                new: false
            };

            employeesModel.findByIdAndUpdate(id, update, options, function (err, result) {
                if (err) {
                    logWriter.log('Scheduler.updateBirthday findByIdAndUpdate Err ' + err);
                    console.log(err);
                }
            });
        };
    };

    return Scheduler;
};