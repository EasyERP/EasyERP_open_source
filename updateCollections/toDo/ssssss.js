var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var EmployeesSchema = mongoose.Schemas.Employees;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);

//var dbObject = mongoose.createConnection('localhost', 'production');



var Employee = dbObject.model('Employees', EmployeesSchema);

var query = Employee.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }
    var i = 0;

    async.eachLimit(_res, 100, function (emp, callback) {
        var objectToSave = {};
        var randomNumber1 = Math.floor(Math.random() * (99999999 - 10000000  + 1) ) + 10000000;
        var randomNumber2 = Math.floor(Math.random() * (99999999 - 10000000  + 1) ) + 10000000;
        var mobileNumber = emp.workPhones ?  emp.workPhones.mobile.substring(0, 6) + randomNumber1 : '';
        var phoneNumber = emp.workPhones ?  emp.workPhones.phone.substring(0, 6) + randomNumber2 : '';
        var skype = cleanFakeSurnames[i] ? cleanFakeSurnames[i].toLowerCase() : '';


        if (emp) {
            objectToSave = {
                name         : {
                    first: cleanFakeNames[i],
                    last : cleanFakeSurnames[i]
                },
                personalEmail: cleanFakeNames[i] + '.' + cleanFakeSurnames[i] + '@gmail.com',
                workEmail    : cleanFakeNames[i] + '.' + cleanFakeSurnames[i] + '@thinkmobiles.com',
                workPhones   : {
                    mobile: mobileNumber,
                    phone : phoneNumber
                },
                skype        : skype
            };
        }


        Employee.update({_id: emp._id}, objectToSave, callback);
        i++;
    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    });
});



