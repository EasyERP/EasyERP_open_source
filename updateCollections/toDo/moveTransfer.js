var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

require('../../models/index.js');

var Employee = mongoose.Schemas.Employee;
var Transfer = mongoose.Schemas.Transfer;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'production'/*, 28017, connectOptions*/);
// var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    var Employees = dbObject.model('Employees', Employee);
    var Transfers = dbObject.model('Transfer', Transfer);

    console.log('Connection to DB is success');

    Employees.find({}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        async.each(result, function (employee, callback) {
            var transfer = employee.transfer;

            transfer.forEach(function (tr) {

                Transfers.create({
                    date                : tr.date,
                    status              : tr.status,
                    department          : tr.department,
                    isDeveloper         : tr.isDeveloper,
                    jobPosition         : tr.jobPosition,
                    manager             : tr.manager,
                    weeklyScheduler     : tr.weeklyScheduler,
                    jobType             : tr.jobType,
                    salary              : tr.salary,
                    info                : tr.info,
                    employee            : employee._id,
                    scheduledPay        : null,
                    payrollStructureType: null
                }, function (err, res) {
                    if (err) {
                        return callback(err);
                    }
                });
            });

            // for delete 'transfer' field from employee collection
             //Employees.update({_id: employee._id}, {$unset: {transfer: ''}}, {multi: true}, callback);

            callback();
        }, function (err) {
            if (err) {
                return console.dir(err);
            }

            console.dir('Good');
        });
    });
});
