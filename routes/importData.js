/**
 * Created by Roman on 27.05.2015.
 */
var async = require('async');
var express = require('express');
var router = express.Router();
var ImportHandler = require('../helpers/importer/importer');
var mongoose = require('mongoose');
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

    function queryBuilder(table) {
        return 'SELECT * FROM ' + table;
    }

    function hrImporter(tasks) {
        var departmentShema = tasks[0];
        var jobPositionShema = tasks[1];
        var employeeShema = tasks[2];

        function importDepartment(departmentShema, callback) {
            var query = queryBuilder(departmentShema.table);

            function getData(callback) {
                handler.importData(query, callback);
            }

            var waterfallTasks = [getData, saverDepartment];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    callback(err);
                }

                callback(null, 'Complete')
            });
        }

        function saverDepartment(fetchedArray, callback) {
            var collection = departmentShema.collection;
            var Schema = mongoose.Schemas[collection];
            var Model = models.get(req.session.lastDb, collection, Schema);
            var model;
            var q = async.queue(function (fetchedDepartment, callback) {
                if (fetchedDepartment) {
                    console.log('fetchedDepartment.ID = ' + fetchedDepartment.ID);
                    model = new Model();
                    model.save(callback);
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

        function departmentImporter(callback) {
            importDepartment(departmentShema, callback);
        }

        return [departmentImporter];
    }

    router.post('/', function (req, res, next) {
        var tasksLength = tasks.length || 0;
        var waterfallTasks = hrImporter(tasks);
        /*handler.importData("SELECT * FROM Employee", function(err, employees){
         if(err){
         return next(err);
         }

         res.status(200).send(employees);
         });*/


        async.waterfall(waterfallTasks, function (task, callback) {
            var collection = task.collection;
            var Schema = mongoose.Schemas[collection];
            var Model = models.get(req.session.lastDb, collection, Schema);
            var query = queryBuilder(task.table);
            var model = new Model();

            console.dir(model);

        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send('Imported success');
        });
    });

    return router;
};