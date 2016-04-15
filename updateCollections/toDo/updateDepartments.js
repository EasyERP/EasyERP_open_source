var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var DepartmentSchema = mongoose.Schemas.Department;

var connectOptions = {
    user  : 'easyerp',
    pass  : '1q2w3e!@#',
    w     : 1,
    j     : true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);

var dbObject = mongoose.createConnection('localhost', 'production');

var Department = dbObject.model("Department", DepartmentSchema);

var query = Department.find({});

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.each(_res, function (dep, callback) {
        var objectToSave = {};
        if (dep.parentDepartment !== null) {
            if (dep.parentDepartment.toString() === '56cebdf6541812c07197358f' || dep.parentDepartment.toString() === '55b92ace21e4b7c40f000016'){
                objectToSave.isDevelopment = true;
            } else {
                objectToSave.isDevelopment = false;
            }
        }

        Department.update({_id: dep._id}, {$set : objectToSave}, callback);

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    });
});