var mongoose = require('mongoose');
var DepartmentSchema;
var async;
var dbObject;
var Project;
var query;

require('../../models/index.js');

DepartmentSchema = mongoose.Schemas.Department;
async = require('async');
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', function (err) {
    console.error(err);
});
dbObject.once('open', function callback() {
    console.log('Connection to production is success');
});

Project = dbObject.model('Department', DepartmentSchema);

Project.collection.update({}, {$rename: {departmentName: 'name'}}, {multi: true}, function (error, res) {
    if (error) {
        return console.dir(error);
    }

    console.log(res);
});
