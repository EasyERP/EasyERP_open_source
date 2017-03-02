var mongoose = require('mongoose');
var async = require('async');
var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
var dbsObject = {};
var dbName = 'production';
var randomPass = require('../../helpers/randomPass');
var crypto = require('crypto');
var EmployeeService;
var SettingsService;
var UserService;

var EmployeeSchema;
var UserSchema;
var Employee;
var dbObject;
var models;
var User;

require('../../models/index.js');

EmployeeSchema = mongoose.Schemas.Employee;
UserSchema = mongoose.Schemas.User;

dbObject = mongoose.createConnection('localhost', dbName, 27017, connectOptions);
Employee = dbObject.model('Employees', EmployeeSchema);
User = dbObject.model('Users', UserSchema);
dbsObject[dbName] = dbObject;
models = require('../../helpers/models')(dbsObject);
SettingsService = require('../../services/settings')(models);
EmployeeService = require('../../services/employee')(models);
UserService = require('../../services/user')(models);

function defaultProfile(employee, waterfallCb) {
    SettingsService.getSettings({dbName: dbName}, function (err, _defaultProfile) {
        if (err) {
            return waterfallCb(err);
        }

        waterfallCb(null, employee, _defaultProfile._id);
    });
}

function userCreator(employee, profileId, waterfallCb) {
    var email = employee.workEmail || employee.personalEmail;
    var login = email.substring(0, email.indexOf('@'));
    var password = randomPass.generate(8);
    var shaSum = crypto.createHash('sha256');
    var employeeId = employee._id;

    shaSum.update(password);
    password = shaSum.digest('hex');

    function findUser(query, options, _waterfallCb) {
        UserService.find(query, options, function (err, _users) {
            if (err) {
                return _waterfallCb(err);
            }

            _waterfallCb(null, _users);
        });
    }

    function updateUser(_user, _waterfallCb) {
        var defaultAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC';
        var id = _user._id;
        var needUpdateImage = !_user.imageSrc || _user.imageSrc === defaultAvatar;
        var updateObject = {$set: {relatedEmployee: employee._id}};

        if (needUpdateImage) {
            updateObject.$set.imageSrc = employee.imageSrc;
        }

        UserService.findByIdAndUpdate(id, updateObject, {dbName: dbName}, function (err, result) {
            if (err) {
                return _waterfallCb(err);
            }

            _waterfallCb(null, result);
        });
    }

    function userManipulator(users, _waterfallCb) {
        var user = users && users[0];
        var _user = {
            login          : login,
            imageSrc       : employee.imageSrc,
            pass           : password,
            profile        : profileId,
            email          : email,
            relatedEmployee: employeeId,
            dbName         : dbName,
            stopEmailing   : true
        };

        if (users && users.length > 1) {
            console.log('\x1b[36m%s\x1b[0m: ', '>>>>>>> We found few ');
        }

        if (user && user._id) {
            return updateUser(user, _waterfallCb);
        }

        UserService.create(_user, function (err, user) {
            if (err) {
                return _waterfallCb(err);
            }

            EmployeeService.findByIdAndUpdate(employeeId, {$set: {relatedUser: user._id}}, {dbName: dbName}, function (err) {
                if (err) {
                    return _waterfallCb(err);
                }

                _waterfallCb(null, user);
            });
        });
    }

    async.waterfall([async.apply(findUser, {$or: [{login: login}, {email: email}]}, {dbName: dbName}), userManipulator], function (err, user) {
        if (err) {
            return waterfallCb(err);
        }

        waterfallCb(null, employee, user);
    });


}

function employeeUpdater(employee, user, waterfallCb) {
    var _id = employee._id;

    EmployeeService.findByIdAndUpdate(_id, {$set: {relatedUser: user._id}}, {dbName: dbName}, waterfallCb);
}

function iterator(employee, eachCb) {
    var waterfallTasks = [async.apply(defaultProfile, employee), userCreator, employeeUpdater];

    async.waterfall(waterfallTasks, function (err, updated) {
        if (err) {
            return eachCb(err);
        }

        console.log('\x1b[33m%s\x1b[0m: ', 'Updated employee', updated);
        eachCb();
    });
}

Employee.find({isEmployee: true}, function (err, employees) {
    if (err) {
        return console.error(err);
    }

    async.each(employees, iterator, function (err) {
        if (err) {
            return console.error(err);
        }

        console.log('>>> Employees updated <<<');
    });
});




