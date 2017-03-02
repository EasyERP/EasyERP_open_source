/**
 * Created by roma on 28.04.16.
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

var query = Employee.find({transfer: {$ne: []}}).lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachLimit(_res, 50, function (emp, callback) {
        var objectToSave;
        var transfer = emp.transfer;
        var newTransfer = [];
        var newTr;

        for (var i = 0; i <= transfer.length - 1; i++){
            var trObject = transfer[i];

            if (moment(trObject.date).hours() >= 21){
                trObject.date = moment(trObject.date).add(4, 'hours');
            }

            newTransfer.push(trObject);
        }

        objectToSave = {
            transfer: newTransfer
        };

        Employee.findByIdAndUpdate({_id: emp._id}, objectToSave, callback);
        //callback();
    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    });
});
