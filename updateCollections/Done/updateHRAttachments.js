/**
 * Created by liliya on 24.05.16.
 */
/**
 * Created by lilya on 07/12/15.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var employeeSchema = mongoose.Schemas['Employee'];
var async = require('async');

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Employee = dbObject.model('Employees', employeeSchema);

var query = Employee.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.each(_res, function (employee, callback) {
        var attachments = employee.attachments;
        var newAttachments = [];

        attachments.forEach(function (_attach) {
            var url = 'uploads/employees/' + employee._id + '/' + _attach.name;

            url = encodeURIComponent(url);

            _attach.shortPas = url;
            newAttachments.push(_attach);
        });
        Employee.update({_id: employee._id}, {$set: {attachments: newAttachments}}, callback);

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        return console.dir('Good');
    });
});