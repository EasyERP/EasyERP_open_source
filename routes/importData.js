/**
 * Created by Roman on 27.05.2015.
 */
var async = require('async');
var express = require('express');
var router = express.Router();
var ImportHandler = require('../helpers/importer/importer');
var mongoose = require('mongoose');
var _ = require('lodash');
/*var multipart = require('connect-multiparty');
 var multipartMiddleware = multipart();*/
var tasks = require('../helpers/importer/map/').tmDevelopment;

module.exports = function (models) {
    var handler = ImportHandler({
        msSql: {
            user: 'thinkmobiles@wbje9y2n5u',
            password: '1q2w3e!@#',
            server: 'wbje9y2n5u.database.windows.net',
            database: 'ex_dev',

            options: {
                encrypt: true
            }
        }
    });

    function comparator(columnName, field) {
       var targetObject =  _.find(field, function(fieldValue){
           return fieldValue.value.toLowerCase() === columnName.toString().toLowerCase();
       });

        return targetObject.fieldValue;
    }

    function queryBuilder(table) {
        return 'SELECT * FROM ' + table;
    }

    function hrImporter(req, tasks) {
        var departmentShema = tasks[0];
        var jobPositionShema = tasks[1];
        var employeeShema = tasks[2];
        var ownerId = req.session ? req.session.uId : null;

        function importDepartment(departmentShema, seriesCb) {
            var query = queryBuilder(departmentShema.table);
            var waterfallTasks;

            function getData(callback) {
                handler.importData(query, callback);
            }

            function saverDepartment(fetchedArray, callback) {
                var collection = departmentShema.collection;
                var Schema = mongoose.Schemas[collection];
                var Model = models.get(req.session.lastDb, collection, Schema);
                var model;

                var mongooseFields = Object.keys(departmentShema.aliases);

                var q = async.queue(function (fetchedDepartment, cb) {
                    var objectToSave = {};

                    for (var i = mongooseFields.length - 1; i >= 0; i--) {
                        var key = mongooseFields[i];
                        var msSqlKey = departmentShema.aliases[key];

                        objectToSave[key] = fetchedDepartment[msSqlKey];
                        objectToSave.createdBy = {
                            user: ownerId
                        };
                        objectToSave.editedBy = {
                            user: ownerId
                        }
                    }

                    if (fetchedDepartment) {
                        model = new Model(objectToSave);
                        model.save(cb);
                    }
                }, 100);

                q.drain = function () {
                    callback(null, 'done');
                };

                async.each(fetchedArray, function (fetchedDepartment) {
                    q.push(fetchedDepartment, function () {
                        console.log('finished ' + fetchedDepartment.ID);
                    });
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, 'Completed');
                })
            }

            waterfallTasks = [getData, saverDepartment];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    seriesCb(err);
                }

                seriesCb(null, 'Complete')
            });
        }

        function importJobPosition(jobPositionShema, seriesCb) {
            var query = queryBuilder(jobPositionShema.table);
            var waterfallTasks;

            function getData(callback) {
                handler.importData(query, callback);
            }

            function saverJobPosition(fetchedArray, callback) {
                var collection = jobPositionShema.collection;
                var departmentCollection = departmentShema.collection;
                var Schema = mongoose.Schemas[collection];
                var DepartmentSchema = mongoose.Schemas[departmentCollection];
                var Model = models.get(req.session.lastDb, collection, Schema);
                var Department = models.get(req.session.lastDb, departmentCollection, DepartmentSchema);
                var model;

                var mongooseFields = Object.keys(jobPositionShema.aliases);

                var q = async.queue(function (fetchedJobPosition, cb) {
                    var objectToSave = {};
                    var departmentQuery;

                    for (var i = mongooseFields.length - 1; i >= 0; i--) {
                        var key = mongooseFields[i];
                        var msSqlKey = jobPositionShema.aliases[key];

                        if (msSqlKey in jobPositionShema.comparator) {
                            fetchedJobPosition[msSqlKey] = comparator(fetchedJobPosition[msSqlKey], jobPositionShema.comparator[msSqlKey]);
                        }

                        objectToSave[key] = fetchedJobPosition[msSqlKey];
                        objectToSave.createdBy = {
                            user: ownerId
                        };
                        objectToSave.editedBy = {
                            user: ownerId
                        }
                    }

                    if (fetchedJobPosition) {
                        departmentQuery = {
                            ID: fetchedJobPosition['Department']
                        };
                        Department.findOne(departmentQuery, {_id: 1}, function (err, department) {
                            if (err) {
                                return cb(err);
                            }

                            objectToSave.department = department._id;

                            model = new Model(objectToSave);
                            model.save(cb);
                        });
                    }
                }, 100);

                q.drain = function () {
                    callback(null, 'done');
                };

                async.each(fetchedArray, function (fetchedDepartment) {
                    q.push(fetchedDepartment, function () {
                        console.log('finished ' + fetchedDepartment.ID);
                    });
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, 'Completed');
                })
            }

            waterfallTasks = [getData, saverJobPosition];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    seriesCb(err);
                }

                seriesCb(null, 'Complete')
            });
        }

        function jobPositionImporter(callback) {
            importJobPosition(jobPositionShema, callback);
        }

        function departmentImporter(callback) {
            importDepartment(departmentShema, callback);
        }

        return [departmentImporter, jobPositionImporter];
    }

    router.post('/', function (req, res, next) {
        var seriesTasks = hrImporter(req, tasks);
        /*handler.importData("SELECT * FROM Employee", function(err, employees){
         if(err){
         return next(err);
         }

         res.status(200).send(employees);
         });*/

        async.series(seriesTasks, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send('Imported success');
        });

    });

    return router;
};