/**
 * Created by liliy on 12.05.2016.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var _ = require('lodash');
var moment = require('../../public/js/libs/moment/moment');

require('../../models/index.js');

var EmployeeSchema = mongoose.Schemas['Employee'];
var DepartmentSchema = mongoose.Schemas['Department'];
var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

//var dbObject = mongoose.createConnection('localhost', 'production', 28017, connectOptions);
var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Employee = dbObject.model("Employees", EmployeeSchema);
var Department = dbObject.model("Department", DepartmentSchema);

var query = Employee.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachLimit(_res, 50, function (emp, callback) {
        var objectToSave;
        var transfer = emp.transfer;
        var newTransfer = [];

        transfer.forEach(function (tr, i) {
            tr.weeklyScheduler = '57332c3b94ee1140b6bb49e2';

            if ((tr.status !== 'hired') && (tr.status !== 'fired')){
                if (moment(new Date(tr.date)).date() === moment(new Date(tr.date)).endOf('month').date()){
                    tr.date = moment(new Date(tr.date)).add(1, 'day').startOf('month');
                } else {
                    tr.date = moment(new Date(tr.date)).startOf('month');
                }
            }

            newTransfer.push(tr);
        });

        objectToSave = {
            transfer: newTransfer
        };

        Employee.update({_id: emp._id}, objectToSave, callback);
        //callback();
    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    });
});
