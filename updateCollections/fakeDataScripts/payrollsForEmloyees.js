/**
 * Created by liliy on 06.09.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var EmployeesSchema = mongoose.Schemas.Transfer;

var dbObject = mongoose.createConnection('localhost', 'saas');
var Employee = dbObject.model('transfer', EmployeesSchema);

var query = Employee.find({});

var salaries = [400, 350, 800, 600, 500, 1200, 1400, 550, 2000, 600, 800, 700, 750];

query.exec(function (err, result) {

    async.each(result, function (el, cb) {
        var salary = salaries[Math.floor(Math.random() * salaries.length)];
        Employee.findByIdAndUpdate(el._id, {$set: {salary: salary}}, cb);
    }, function () {
        console.log('good');
    });

});