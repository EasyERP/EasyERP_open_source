'use strict';

var populateWrapper = require('../helpers/callbackWrapper').populate;
var mongoose = require('mongoose');
var employeeSchema = mongoose.Schemas.Employee;
var validator = require('validator');
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
    };
};
