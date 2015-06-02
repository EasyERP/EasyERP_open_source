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

    function queryBuilder(table){
        return 'SELECT * FROM ' + table;
    }

    router.post('/', function (req, res, next) {
        /*handler.importData("SELECT * FROM Employee", function(err, employees){
         if(err){
         return next(err);
         }

         res.status(200).send(employees);
         });*/
        async.each(tasks, function (task, callback) {
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