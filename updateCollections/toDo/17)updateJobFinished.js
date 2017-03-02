require('../../models/index.js');

var mongoose = require('mongoose');
var CONSTANTS = require('../../constants/mainConstants');
var async = require('async');
var JobsSchema = mongoose.Schemas.jobs;
var ProductSchema = mongoose.Schemas.Products;
var productsAvailabilitySchema = mongoose.Schemas.productsAvailability;

var objectId = mongoose.Types.ObjectId;
var dbObject;
var models;
var dbName = 'CRM';
var dbsObject = {};
var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
var ProductService;
var AvailabilityService;
var JobsModel;
var Product;
var Availability;
var JournalEntryHandler = require('../../handlers/journalEntry');
var _journalEntryHandler;

dbObject = mongoose.createConnection('localhost', dbName);
dbsObject[dbName] = dbObject;
models = require('../../helpers/models')(dbsObject);
ProductService = require('../../services/products')(models);
AvailabilityService = require('../../services/productAvailability')(models);
JobsModel = models.get(dbName, 'jobs', JobsSchema);
Product = models.get(dbName, 'Product', ProductSchema);
Availability = models.get(dbName, 'productsAvailability', productsAvailabilitySchema);

_journalEntryHandler = new JournalEntryHandler(models);

JobsModel.find({workflow: CONSTANTS.JOBSFINISHED}).exec(function (err, models) {
    if (err) {
        return console.log(err);
    }

    async.each(models, function (job, cb) {
        var waterFallTasks;
        var id = job._id.toString();

        function createCosts(wCb) {
            _journalEntryHandler.createCostsForJob({
                req     : {
                    session: {
                        lastDb: dbName,
                        uId   : '52203e707d4dba8813000003'
                    },

                    body: {}
                },
                jobId   : objectId(id),
                workflow: CONSTANTS.JOBSFINISHED,
                callback: wCb
            });
        }

        function getJobCosts(wCb) {

            JobsModel
                .aggregate([{
                    $match: {
                        _id: objectId(id)
                    }
                }, {
                    $lookup: {
                        from        : 'Products',
                        localField  : '_id',
                        foreignField: 'job',
                        as          : 'product'
                    }
                }, {
                    $project: {
                        product: {$arrayElemAt: ['$product', 0]}
                    }
                }, {
                    $lookup: {
                        from        : 'journalentries',
                        localField  : 'product._id',
                        foreignField: 'sourceDocument._id',
                        as          : 'journalentries'
                    }
                }, {
                    $unwind: {
                        path                      : '$journalentries',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $group: {
                        _id : '$_id',
                        cost: {$sum: '$journalentries.debit'}
                    }
                }], function (err, result) {
                    var cost;

                    if (err) {
                        return wCb(err);
                    }

                    cost = result && result.length ? result[0].cost : 0;

                    wCb(null, cost);
                });
        }

        function findAvailabilty(cost, wCb) {
            var options = {
                dbName: dbName,
                job   : id,
                model : Product
            };

            ProductService.getAvailabilityByJob(options, function (err, opt) {
                if (err) {
                    return wCb(err);
                }

                wCb(null, {
                    id     : opt._id,
                    account: opt.account,
                    cost   : cost
                });
            });
        }

        function updateAvailabilty(data, wCb) {
            var options = {
                dbName: dbName,
                id    : data.id,
                body  : {
                    onHand: 1,
                    cost  : data.cost
                },

                model: Availability
            };

            AvailabilityService.updateById(options, function (err) {
                if (err) {
                    return wCb(err);
                }
                wCb(null, data);
            });
        }

        waterFallTasks = [createCosts, getJobCosts, findAvailabilty, updateAvailabilty/*, createJournalEntry*/];

        async.waterfall(waterFallTasks, cb);
    }, function () {
        console.log('good');
    });
});