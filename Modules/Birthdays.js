var Birthdays = function (models, event) {
    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter.js');
    var birthdaysSchema = mongoose.Schemas['birthday'];
    var employeeSchema = mongoose.Schemas['Employee'];

    var getEmployeesInDateRange = function (req, callback, response) {
        function getAge(birthday) {
            birthday = new Date(birthday);
            var today = new Date();
            var years = today.getFullYear() - birthday.getFullYear();

            birthday.setFullYear(today.getFullYear());

            if (today < birthday) {
                years--;
            }
            console.log(years);
            return (years < 0) ? 0 : years;
        };

        var separateWeklyAndMonthly = function (arrayOfEmployees) {
            var dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var dayNumber = dateOnly.getDay();
            var LeftOffset = dayNumber - 1;
            var RightOffset = 7 - dayNumber;
            var FirstDateWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - LeftOffset).valueOf();
            var LastDateWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + RightOffset).valueOf();
            var FirstDateNxtWeek =  new Date(now.getFullYear(), now.getMonth(), now.getDate() + RightOffset +1 ).valueOf();
            var LastDateNxtWeek =  new Date(now.getFullYear(), now.getMonth(), now.getDate() + RightOffset * 2+1 ).valueOf();

            var currentEmployees = {};
            function getDaysToBirthday(birthday) {
                var today = new Date();
                var days;
                var firstDayOfYear = new Date(today.getFullYear() + 1, 0, 1);
                var lastDayOfYear = new Date(today.getFullYear(), 11, 31);
                if (birthday.getMonth() >= today.getMonth()) {
                    birthday.setFullYear(today.getFullYear());
                    days = Math.round((birthday - today) / 1000 / 60 / 60 / 24);
                } else {
                    days = Math.round((lastDayOfYear - today) / 1000 / 60 / 60 / 24);
                    days += Math.round((birthday.setFullYear(today.getFullYear() + 1) - firstDayOfYear) / 1000 / 60 / 60 / 24);
                }
                return days;
            }

            currentEmployees.monthly = arrayOfEmployees.map(function (employee) {
                if (employee.dateBirth) {
                    employee.daysForBirth = getDaysToBirthday(employee.dateBirth);
                }
                return employee;
            });

            currentEmployees.nextweek = currentEmployees.monthly.filter(function (employee) {
                if (employee.dateBirth) {
                    birthday = new Date(employee.dateBirth);
                    birthday.setHours(0);
                    var valueOfBirthday = birthday.valueOf();
                    if (valueOfBirthday >= FirstDateNxtWeek) {
                        if ((valueOfBirthday <= LastDateNxtWeek)) {
                            return true;
                        }
                    }
                }
            });

            currentEmployees.weekly = currentEmployees.monthly.filter(function (employee) {
                if (employee.dateBirth) {
                    birthday = new Date(employee.dateBirth);
                    birthday.setHours(0);
                    var valueOfBirthday = birthday.valueOf();
                    if (valueOfBirthday >= FirstDateWeek) {
                        if ((valueOfBirthday <= LastDateWeek)) {
                            return true;
                        }
                    }

                }
            });
            currentEmployees.monthly.sort(function (a, b) {
                if (a.daysForBirth > b.daysForBirth)
                    return 1;
                if (a.daysForBirth < b.daysForBirth)
                    return -1;
                return 0;
            });
            currentEmployees.weekly.sort(function (a, b) {
                if (a.daysForBirth > b.daysForBirth)
                    return 1;
                if (a.daysForBirth < b.daysForBirth)
                    return -1;
                return 0;
            });

            currentEmployees.nextweek.sort(function (a, b) {
                if (a.daysForBirth > b.daysForBirth)
                    return 1
                if (a.daysForBirth < b.daysForBirth)
                    return -1
                return 0;
            });
            return currentEmployees;
        };

        var now = new Date();
        var day = 0;
        var _month = now.getMonth() + 1;
        var NUMBER_OF_MONTH = 1;
        var tempMonthLength = _month + NUMBER_OF_MONTH;
        var realPart;
        var query;
        if (tempMonthLength / 12 < 1) {

            query = {
                $or: [
                        { $and: [{ month: _month }, { days: { $gte: day } }, { days: { $lte: 31 } }] },
                        { $and: [{ month: { $gt: _month } }, { month: { $lt: tempMonthLength } }] },
                        { $and: [{ month: tempMonthLength }, { days: { $lte: day } }] }
                ]
            }
        } else {
            realPart = tempMonthLength % 12;
            query = {
                $or: [
                        { $and: [{ month: _month }, { days: { $gte: day } }, { days: { $lte: 31 } }] },
                        { $and: [{ month: { $gte: 1 } }, { month: { $lt: realPart } }] },
                        { $and: [{ month: realPart }, { days: { $lt: day } }] }
                ]
            }
        }

        models.get(req.session.lastDb, "Employees", employeeSchema).aggregate(
            {
                $match: {
                    $and: [
                        { dateBirth: { $ne: null } },
                        { isEmployee: true }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    month: { $month: '$dateBirth' },
                    days: { $dayOfMonth: '$dateBirth' }
                }
            },
            {
                $match: query
            },
            function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    var query = models.get(req.session.lastDb, "Employees", employeeSchema).find();
                    query.where('_id').in(res)
                        .select('_id name dateBirth age jobPosition workPhones.mobile department')
                        .populate('jobPosition', '_id name')
                        .populate('department', ' _id departmentName')
                        .lean()
                        .exec(function (error, ress) {
                            if (error) {
                                console.log(error);
                                callback(req, separateWeklyAndMonthly([]), response);
                            } else {
                                ress.map(function(employee) {
                                    employee.age = getAge(employee.dateBirth);
                                    return employee;
                                });
                                callback(req, separateWeklyAndMonthly(ress), response);
                            }
                        });
                }
            });
    };



    var set = function (req, currentEmployees, response) {
        var res = {};
        var data = {};
        var now = new Date();

        data['date'] = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        data['currentEmployees'] = currentEmployees;

        models.get(req.session.lastDb, "birthdays", birthdaysSchema).findByIdAndUpdate({ _id: 1 }, data, {new: true, upsert: true }, function (error, birth) {
            if (error) {
                logWriter.log('Employees.create Incorrect Incoming Data');
                console.log(error);
                if (response) {
                    response.send(400, { error: 'Employees.create Incorrect Incoming Data' });
                }
                return;
            } else {
                res['data'] = birth.currentEmployees;
                if (response) response.send(res);
                return;
            }
        });
    };

    var get = function (req, response) {

        var res = {};
        res['data'] = [];

        check(req, function (status, emloyees) {
            switch (status) {
                case -1:
                    {
                        response.send(500, { error: 'Internal Sever Error' });
                    }
                    break;
                case 0:
                    {
                        getEmployeesInDateRange(req, set, response);
                    }
                    break;
                case 1:
                    {
                        res['data'] = emloyees;
                        response.send(res);
                    }
                    break;
            }
        });
    };

    var check = function (req, calback) {
        var now = new Date();
        var dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        models.get(req.session.lastDb, "birthdays", birthdaysSchema).find({}, function (err, birth) {
            if (err) {
                logWriter.log('Find Birthdays Error');
                console.log(err);
                calback(-1);
            } else {
                if (birth.length === 0) {
                    calback(0);
                } else {
                    if (birth[0].date < dateOnly) {
                        calback(0);
                    } else {
                        calback(1, birth[0].currentEmployees);
                    }
                }
            }
        });
    };

    recalculate = function (req) {
        getEmployeesInDateRange(req, set);
    };

    event.on('recalculate', recalculate);

    return {
        get: get,
        recalculate: recalculate
    };
};
module.exports = Birthdays;
