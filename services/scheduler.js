module.exports = function (model) {
    'use strict';
    var nodeScheduler = require('node-schedule');
    var mongoose = require('mongoose');
    var async = require('async');
    var employeeSchema = mongoose.Schemas.Employee;
    var logWriter = require('../helpers/logger');

    var rule = {
        hour  : 9,
        minute: 49
    };

    function findBirthdayToday(employeesModel) {
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
                day      : {$dayOfMonth: '$dateBirth'},
                month    : {$month: '$dateBirth'},
                age      : 1,
                dateBirth: 1
            }
        };
        var matchOutObject = {
            $match: {
                day: {
                    $eq: day
                },

                month: {
                    $eq: month
                }
            }
        };

        function updateBirthday(element, callback) {
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
        }

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
    }

    function updateYearEmployees() {
        var dbsObject = this.dbsObject;

        async.each(dbsObject, function (connection, eachCb) {
            var dbId = connection.name;

            findBirthdayToday(model.get(dbId, 'Employees', employeeSchema));
            eachCb();
        });
    }

    function Scheduler(dbsObject) {
        this.dbsObject = dbsObject;

        this.initEveryDayScheduler = function () {
            var _updateYearEmployees = updateYearEmployees.bind(this);

            if (!process.env.INITED_SCHEDULER) {
                nodeScheduler.scheduleJob(rule, _updateYearEmployees);
                process.env.INITED_SCHEDULER = true;
                console.log('=================== initEveryDayScheduler ===================');
            } else {
                logWriter.log('Scheduler.initEveryDayScheduler is inited');
                console.log('============== initEveryDayScheduler is INITED ==============');
            }
        };
    }

    return Scheduler;
};
