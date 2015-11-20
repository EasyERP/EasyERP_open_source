var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var xlsx = require('node-xlsx');
var fs = require('fs');
//var importMap = require('../helpers/importer/map/xlsx');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var async = require('async');
var logWriter = require('../helpers/logWriter.js');
var payrollSchema = mongoose.Schemas['PayRoll'];
var employeeSchema = mongoose.Schemas['Employee'];

module.exports = function (models) {
    function getExtension(filename) {
        var i = filename.lastIndexOf('.');
        return (i < 0) ? '' : filename.substr(i);
    }

    function importFileToDb(req, res, next) {
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', payrollSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var headers = req.headers;
        var files = req.files;
        var modelName = 'PayRoll';
        var filePath;
        var error;
        var rows = 0;
        var notImportedEmployees = {

        };


        if (req.session && req.session.loggedIn && req.session.lastDb) {

            if (headers && files && files.attachfile) {

                filePath = files.attachfile.path;

                if (!modelName || !filePath) {
                    error = new Error((!modelName) ? 'Model name empty' : 'File path empty');
                    error.status = 400;
                    logWriter.log("importFile.js importFileToDb " + error);
                    next(error);

                    return;
                }

                switch (getExtension(filePath)) {
                    case '.xlsx':
                        importXlsxToDb(res, next);
                        break;
                    default:
                        error = new Error('Extension file \"' + getExtension(filePath) + '\" not support');
                        error.status = 400;
                        logWriter.log("importFile.js importFileToDb " + error);
                        next(error);
                }

            } else {
                logWriter.log("importFile.js importFileToDb Bad Request");
                res.status(400).send('Bad Request');
            }
        } else {
            logWriter.log("importFile.js importFileToDb Unauthorized");
            res.status(401).send('Unauthorized');
        }

        function dateObjectComposer(periodArray) {
            "use strict";
            var month;
            var year = 2000 + parseInt(periodArray[1]);


            switch (periodArray[0]) {
                case 'April':
                    month = 4;
                    if (!notImportedEmployees[4]){
                        notImportedEmployees[4] = [];
                    }
                    break;
                case 'May':
                    month = 5;
                    if (!notImportedEmployees[5]){
                        notImportedEmployees[5] = [];
                    }
                    break;
                case 'Jun':
                    month = 6;
                    if (!notImportedEmployees[6]){
                        notImportedEmployees[6] = [];
                    }
                    break;
                case 'July':
                    month = 7;
                    if (!notImportedEmployees[7]){
                        notImportedEmployees[7] = [];
                    }
                    break;
                case 'Aug':
                    month = 8;
                    if (!notImportedEmployees[8]){
                        notImportedEmployees[8] = [];
                    }
                    break;
                case 'Sep':
                    month = 9;
                    if (!notImportedEmployees[9]){
                        notImportedEmployees[9] = [];
                    }
                    break;
                case 'Oct':
                    month = 10;
                    if (!notImportedEmployees[10]){
                        notImportedEmployees[10] = [];
                    }
                    break;
                case 'Nov':
                    month = 11;
                    if (!notImportedEmployees[11]){
                        notImportedEmployees[11] = [];
                    }
                    break;
            }

            return {
                year : year,
                month: month
            }
        };

        function typeComposer(typeString) {
            "use strict";
            var typeObject = {};

            typeString = typeString.toLowerCase();

            switch (typeString) {
                case 'salarycard':
                    typeObject._id = '56459308abb1c35728ad7d10';
                    typeObject.name = 'Salary Card';
                    break;
                case 'salarycash':
                    typeObject._id = '564592fbabb1c35728ad7d0f';
                    typeObject.name = 'Salary Cash';
                    break;
            }

            return typeObject;
        }

        function importXlsxToDb(res, next) {
            var obj = xlsx.parse(filePath);
            var sheet;
            var headers;

            if (!obj) {
                error = new Error('Parse Error');
                logWriter.log("importFile.js importXlsxToDb " + error);
                next(error);
                return;
            }
            sheet = obj[0];

            if (sheet && sheet.data) {
                async.eachLimit(sheet.data, 100, function (data, cb) {
                        var fullName = data[0];
                        var period = data[1];
                        var type = data[2];
                        var salary = data[3];
                        var dataKey;

                        var namesArray = fullName.split(/(?=[A-Z])/);
                        var periodArray = period.split('/');

                        var saveObject = dateObjectComposer(periodArray);

                        dataKey = saveObject.year * 100 + saveObject.month;

                        saveObject.type = typeComposer(type);
                        saveObject.dataKey = dataKey;
                        saveObject.calc = salary;
                        saveObject.paid = 0;
                        saveObject.diff = (-1) * salary;
                        saveObject.employee = {};

                        Employee.findOne({
                            'name.first': namesArray[0],
                            'name.last' : namesArray[1]
                        }, function (err, employee) {
                            "use strict";
                            if (err) {
                                return cb(err);
                            }
                            if (!employee) {
                                notImportedEmployees[saveObject.month].push(fullName);
                                cb(null, 'empty');
                            } else {
                                saveObject.employee._id = employee._id;
                                saveObject.employee.name = employee.name.first + ' ' + employee.name.last;

                                saveToDbOrUpdate(saveObject, cb);
                            }
                        });
                    }, function (err) {
                        var response = 'all imported';

                        if (err) {
                            logWriter.log("importFile.js importXlsxToDb " + err);
                            next(err);
                        } else {
                            if (Object.keys(notImportedEmployees).length) {
                                logWriter.log("unsaved " + notImportedEmployees.toString());
                                response = notImportedEmployees;
                            }
                            res.status(200).send(response);
                        }
                    }
                );
            } else {
                logWriter.log("importFile.js importXlsxToDb \"Bad request\"");
                res.status(400).send('Bad request');
            }
        }

        function saveToDbOrUpdate(objectToDb, callback) {
            var payroll = new PayRoll(objectToDb);

            payroll.save(callback);
        }
    }

    router.post('/', multipartMiddleware, importFileToDb);

    return router;
};