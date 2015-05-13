/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');
var Quotation = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var QuotationSchema = mongoose.Schemas['Quotation'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');

    this.create = function (req, res, next) {
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var body = req.body;
        var quotation = new Quotation(body);

        quotation.save(function (err, product) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: product});
        });
    };

    this.totalCollectionLength = function (req, res, next) {
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var result = {};
        var departmentSearcher;
        var contentIdsSearcher;

        var waterfallTasks;
        var contentType = req.query.contentType;
        var isOrder = !!(contentType === 'Order');
        /* var data = {};

         for (var i in req.query) {
         data[i] = req.query[i];
         }*/

        result['showMore'] = false;

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var arrOfObjectId = deps.objectID();

            models.get(req.session.lastDb, "Quotation", QuotationSchema).aggregate(
                {
                    $match: {
                        $and: [
                            /*optionsObject,*/
                            {
                                $or: [
                                    {
                                        $or: [
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.users': objectId(req.session.uId)}
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.group': {$in: arrOfObjectId}}
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        $and: [
                                            {whoCanRW: 'owner'},
                                            {'groups.owner': objectId(req.session.uId)}
                                        ]
                                    },
                                    {whoCanRW: "everyOne"}
                                ]
                            }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (quotationsIds, waterfallCallback) {
            var queryObject = {_id: {$in: quotationsIds}};
            queryObject.isOrder = isOrder;
            var query = Quotation.find(queryObject);

            query.populate('supplier', '_id name fullName');

            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function(err, result){
            if(err){
                return next(err);
            }

            res.status(200).send({count: result.length});
        });
    };

    this.getByViewType = function (req, res, next) {
        var viewType = req.params.viewType;
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        /* var queryParams = {};

         for (var i in req.query) {
         queryParams[i] = req.query[i];
         }*/

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        var contentType = req.params.contentType;
        var isOrder=!!(contentType==='Order');

        /* var data = {};

         for (var i in req.query) {
         data[i] = req.query[i];
         }*/

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var arrOfObjectId = deps.objectID();

            models.get(req.session.lastDb, "Quotation", QuotationSchema).aggregate(
                {
                    $match: {
                        $and: [
                            /*optionsObject,*/
                            {
                                $or: [
                                    {
                                        $or: [
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.users': objectId(req.session.uId)}
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.group': {$in: arrOfObjectId}}
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        $and: [
                                            {whoCanRW: 'owner'},
                                            {'groups.owner': objectId(req.session.uId)}
                                        ]
                                    },
                                    {whoCanRW: "everyOne"}
                                ]
                            }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (quotationsIds, waterfallCallback) {
            var queryObject = {_id: {$in: quotationsIds}};
            queryObject.isOrder = isOrder;
            var query = Quotation.find(queryObject);

            query.populate('supplier', '_id name fullName');

            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function(err, result){
            if(err){
                return next(err);
            }

            res.status(200).send(result);
        });
    };

};

module.exports = Quotation;