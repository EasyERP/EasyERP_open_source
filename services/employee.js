'use strict';

var populateWrapper = require('../helpers/callbackWrapper').populate;
var mongoose = require('mongoose');
var employeeSchema = mongoose.Schemas.Employee;
var validator = require('validator');
var objectId = mongoose.Types.ObjectId;
var _ = require('lodash');

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var dbName;
            var EmployeeModel;
            var employee;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            EmployeeModel = models.get(dbName, 'Employees', employeeSchema);
            employee = new EmployeeModel(options);
            employee.save(function (err, employee) {
                if (err) {
                    return callback(err);
                }

                callback(null, employee);
            });
        };

        this.findByIdAndUpdate = function (_id, updateObject, options, callback) {
            var _options = {new: true};
            var EmployeeModel;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!_id || !updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            EmployeeModel = models.get(dbName, 'Employees', employeeSchema);
            EmployeeModel.findByIdAndUpdate(_id, updateObject, _options, function (err, employee) {
                if (err) {
                    return callback(err);
                }

                callback(null, employee);
            });
        };

        this.findAndUpdate = function (query, updateObject, options, callback) {
            var _options = {};
            var EmployeeModel;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!query || !updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            EmployeeModel = models.get(dbName, 'Employees', employeeSchema);
            EmployeeModel.update(query, updateObject, _options, function (err, updated) {
                if (err) {
                    return callback(err);
                }

                callback(null, updated);
            });
        };

        this.findById = function (_id, options, callback) {
            var EmployeeModel;
            var dbName;
            var query;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;

            if (!dbName || !validator.isMongoId(_id)) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            EmployeeModel = models.get(dbName, 'Employees', employeeSchema);
            query = EmployeeModel.findById(_id);

            if (typeof callback !== 'function') {
                return query;
            }

            query.exec(function (err, employee) {
                if (err) {
                    return callback(err);
                }

                callback(null, employee);
            });
        };

        this.findByIdAndRemove = function (_id, options, callback) {
            var EmployeeModel;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;

            delete options.dbName;

            if (!dbName || !_id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            EmployeeModel = models.get(dbName, 'Employees', employeeSchema);
            EmployeeModel.findByIdAndRemove(_id, function (err, employee) {
                if (err) {
                    return callback(err);
                }

                callback(null, employee);
            });
        };

        this.sortByFiled = function (options, callback) {
            var EmployeeModel;
            var dbName;
            var query;
            var err;
            var sort;
            var aggregate;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            dbName = options.dbName;
            sort = options.sort;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                if (typeof callback !== 'function') {
                    return populateWrapper(err);
                }

                return callback(err);
            }

            EmployeeModel = models.get(dbName, 'Employees', employeeSchema);

            aggregate = [{
                $match: {
                    isEmployee: true
                }
            }, {
                $lookup: {
                    from        : 'Department',
                    localField  : 'department',
                    foreignField: '_id',
                    as          : 'department'
                }
            }, {
                $lookup: {
                    from        : 'JobPosition',
                    localField  : 'jobPosition',
                    foreignField: '_id',
                    as          : 'jobPosition'
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'manager',
                    foreignField: '_id',
                    as          : 'manager'
                }
            }, {
                $lookup: {
                    from        : 'transfers',
                    localField  : '_id',
                    foreignField: 'employee',
                    as          : 'transfer'
                }
            },
                {
                    $project: {
                        imageSrc             : 1,
                        name                 : 1,
                        workEmail            : 1,
                        personalEmail        : 1,
                        'workPhones.mobile'  : 1,
                        'workPhones.phone'   : 1,
                        skype                : 1,
                        department           : {$arrayElemAt: ['$department', 0]},
                        jobPosition          : {$arrayElemAt: ['$jobPosition', 0]},
                        manager              : {$arrayElemAt: ['$manager', 0]},
                        nationality          : 1,
                        'homeAddress.street' : 1,
                        'homeAddress.city'   : 1,
                        'homeAddress.state'  : 1,
                        'homeAddress.zip'    : 1,
                        'homeAddress.country': 1,
                        dateBirth            : 1,
                        age                  : 1,
                        source               : 1,
                        marital              : 1,
                        employmentType       : 1,
                        gender               : 1,
                        jobType              : 1,
                        'social.FB'          : 1,
                        'social.LI'          : 1,
                        'social.GP'          : 1,
                        userName             : 1,
                        transfer             : 1,
                        _id                  : 1
                    }
                },
                {
                    $project: {
                        imageSrc           : 1,
                        name               : 1,
                        workEmail          : 1,
                        personalEmail      : 1,
                        'workPhones.mobile': 1,
                        'workPhones.phone' : 1,
                        skype              : 1,
                        department         : '$department.name',
                        jobPosition        : '$jobPosition.name',
                        manager            : '$manager.name',
                        nationality        : 1,
                        homeAddress        : 1,
                        dateBirth          : 1,
                        age                : 1,
                        source             : 1,
                        marital            : 1,
                        employmentType     : 1,
                        gender             : 1,
                        jobType            : 1,
                        'social.FB'        : 1,
                        'social.LI'        : 1,
                        'social.GP'        : 1,
                        userName           : 1,
                        hired              : {
                            $filter: {
                                input: '$transfer',
                                as   : 'item',
                                cond : {
                                    $eq: ['$$item.status', 'hired']
                                }
                            }
                        },
                        fired              : {
                            $filter: {
                                input: '$transfer',
                                as   : 'item',
                                cond : {
                                    $eq: ['$$item.status', 'fired']
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        imageSrc      : 1,
                        name          : 1,
                        workEmail     : 1,
                        personalEmail : 1,
                        mobile        : '$workPhones.mobile',
                        phone         : '$workPhones.phone',
                        skype         : 1,
                        department    : 1,
                        jobPosition   : 1,
                        manager       : 1,
                        nationality   : 1,
                        homeAddress   : 1,
                        dateBirth     : 1,
                        age           : 1,
                        source        : 1,
                        marital       : 1,
                        employmentType: 1,
                        gender        : 1,
                        jobType       : 1,
                        FB            : '$social.FB',
                        LI            : '$social.LI',
                        GP            : '$social.GP',
                        userName      : 1,
                        hired         : {$max: '$hired.date'},
                        fired         : {$max: '$fired.date'}
                    }
                }
            ];

            if (options.dateRange) {
                if (options.hired) {
                    aggregate.push({
                        $match: {
                            $and: [
                                {
                                    hired: options.dateRange
                                }
                            ]
                        }
                    });
                }
                else {
                    aggregate.push({
                        $match: {
                            $and: [
                                {
                                    fired: options.dateRange
                                }
                            ]
                        }
                    });
                }
            }

            if (sort) {
                aggregate.push(sort);
            }

            query = EmployeeModel.aggregate(aggregate);

            if (typeof callback !== 'function') {
                return query;
            }

            query.exec(function (err, employee) {
                if (err) {
                    return callback(err);
                }

                callback(null, employee);
            });
        }
    };
}
;
