require('../../models/index.js');

var mongoose = require('mongoose');
var async = require('async');
var OrderSchema = mongoose.Schemas.Order;
var dbObject;
var models;
var dbName = 'lilyadb';
var dbsObject = {};
var Order;
//var dbObject = mongoose.createConnection('144.76.56.111', 'alex', 28017, connectOptions);

dbObject = mongoose.createConnection('144.76.56.111', dbName, 28017);
dbsObject[dbName] = dbObject;
models = require('../../helpers/models')(dbsObject);
Order = models.get(dbName, 'jobs', OrderSchema);

Order.find({}, function (err, result) {
    if (err) {
        return console.log(err);
    }

    async.each(result, function (el, cb) {
        Order.update({_id: el._id}, {$set: {'status.fulfillStatus': el.status.fullfillStatus}}, cb);
    }, function () {
        console.log('good');
    });
});

Order.find({}, function (err, result) {
    if (err) {
        return console.log(err);
    }

    async.each(result, function (el, cb) {
        Order.update({_id: el._id}, {$unset: {'status.fullfillStatus': ''}}, cb);
    }, function () {
        console.log('good');
    });
});

