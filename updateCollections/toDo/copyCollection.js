var mongoose = require('mongoose');
require('../../models/index.js');


var collectionName = 'integrations';
var schemaName = 'integrations';
var CustomSchema = mongoose.Schemas[schemaName];
//var CustomSchemaSecond = mongoose.Schemas['wTrackInvoice'];
var hostFirst = '144.76.56.111';
var hostSecond = '144.76.56.111';
var dbNameFirst = 'sergey';
var dbNameSecond = 'CRM';
var portFirst = 28017;
var portSecond = 28017;

var _ = require('lodash');
var async = require('async');
var objectId = mongoose.Types.ObjectId;

var tempArray = [];

var dbObject = mongoose.createConnection(hostFirst, dbNameFirst, portFirst);
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    var Model = dbObject.model(collectionName, CustomSchema);
    var query = Model.find({}).lean();

    query.exec(function (err, result) {
        if (err){
            return console.log(err);
        }

        console.log('data is found');

        async.each(result, function (element, cb) {
            tempArray.push(element);
            cb();
        }, function (err) {
            if (err){
                return console.log(err);
            }

            console.log('data copied');

            dbObject.close();

            dbObject = mongoose.createConnection(hostSecond, dbNameSecond, portSecond);
            dbObject.on('error', console.error.bind(console, 'connection error:'));
            dbObject.once('open', function callback() {
                var Model = dbObject.model(collectionName, CustomSchema);
                var query = Model.remove({});
                var newModel;

                console.log('data remove');

                query.exec(function (err) {
                    if (err){
                        return console.log(err);
                    }

                    Model = dbObject.model(collectionName, CustomSchema);

                    async.each(tempArray, function (element, cb) {

                        //element.transaction = ((element.transaction).toLowerCase()).replace(/\s*/g,'');
                        newModel = new Model(element);

                        newModel.save(function (err, result) {
                            if (err){
                                return console.log(err);
                            }

                            cb();
                        });
                    }, function (err) {
                        if (err){
                            return console.log(err);
                        }

                        console.log('collection changed is successfull');
                    });
                });
            });
        });
    });
});