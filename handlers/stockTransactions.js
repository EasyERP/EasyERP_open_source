var mongoose = require('mongoose');
var stockCorrections = function (models, event) {
    'use strict';

    var StockTransactionService = require('../services/stockTransaction')(models);
    var AvailabilityHelper = require('../helpers/availability')(models);
    var FilterMapper = require('../helpers/filterMapper');
    var RESPONSES = require('../constants/responses');

    var path = require('path');
    var Uploader = require('../services/fileStorage/index');
    var uploader = new Uploader();

    this.create = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var options = {
            body  : body,
            dbName: dbName
        };

        StockTransactionService.create(options, function (err, doc) {
            if (err) {
                return next(err);
            }

            function callback(err, orderRows) {
                if (err) {
                    return next(err);
                }

                StockTransactionService.updateById({
                    dbName: dbName,
                    body  : {
                        orderRows: orderRows
                    },

                    id      : doc._id,
                    settings: {new: true}
                }, function (err, order) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(doc);
                });
            }

            AvailabilityHelper.updateAvailableProducts({
                dbName: dbName,
                doc   : doc.toJSON()
            }, callback);

        });

    };

    this.getList = function (req, res, next) {
        var data = req.query;
        var quickSearch = data.quickSearch;
        var matchObject = {};
        var regExp;
        var limit = parseInt(data.count, 10);
        var skip = (parseInt(data.page || 1, 10) - 1) * limit;
        var obj = {};
        var filterMapper = new FilterMapper();

        var keys;
        var sort;
        var options;

        obj.$and = [];
        obj.$and.push({_type: 'stockTransactions'});

        if (data && data.filter) {
            obj.$and.push(filterMapper.mapFilter(data.filter, 'stockTransactions'));
        }

        if (quickSearch) {
            regExp = new RegExp(quickSearch, 'ig');
            matchObject['warehouse.name'] = {
                $regex: regExp
            };
        }

        if (data.sort) {
            keys = Object.keys(data.sort)[0];
            data.sort[keys] = parseInt(data.sort[keys], 10);
            sort = data.sort;
        } else {
            sort = {'createdBy.date': -1};
        }

        options = {
            match      : obj,
            matchObject: matchObject,
            sort       : sort,
            skip       : skip,
            limit      : limit,
            dbName     : req.session.lastDb
        };

        StockTransactionService.get(options, function (err, result) {
            var count;
            var response = {};

            if (err) {
                return next(err);
            }

            count = result[0] && result[0].total ? result[0].total : 0;

            response.total = count;
            response.data = result;
            res.status(200).send(response);
        });

    };

    this.update = function (req, res, next) {
        updateOnlySelectedFields(req, res, next);
    };

    this.getById = function (req, res, next) {
        var options = {
            id    : req.params.id,
            dbName: req.session.lastDb
        };

        StockTransactionService.getById(options, function (err, correction) {
            if (err) {
                return next(err);
            }

            res.status(200).send(correction);
        });
    };

    this.bulkRemove = function (req, res, next) {
        var options = {
            ids   : req.body.ids || [],
            dbName: req.session.lastDb
        };

        // todo some validation on ids array, like check for objectId

        StockTransactionService.remove(options, function (err, correction) {
            if (err) {
                return next(err);
            }

            res.status(200).send(correction);
        });
    };

    this.uploadFile = function (req, res, next) {
        var dbName = req.session.lastDb;
        //var Model = models.get(dbName, opportunitiesCT, opportunitiesSchema);
        var headers = req.headers;
        var id = headers.modelid || 'empty';
        var contentType = headers.modelname || 'stockTransactions';
        var addNote = headers.addnote;
        var files = req.files && req.files.attachfile ? req.files.attachfile : null;
        var historyOptions = {};
        var dir;
        var err;

        contentType = contentType.toLowerCase();
        dir = path.join(contentType, id);

        if (!files) {
            err = new Error(RESPONSES.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }

        uploader.postFile(dir, files, {userId: req.session.uName}, function (err, file) {
            var notes = [];
            if (err) {
                return next(err);
            }

            if (addNote) {
                notes = file.map(function (elem) {
                    return {
                        _id: mongoose.Types.ObjectId(),

                        attachment: {
                            name    : elem.name,
                            shortPas: elem.shortPas
                        },

                        user: {
                            _id  : req.session.uId,
                            login: req.session.uName
                        },

                        date: new Date()
                    };
                });
            }

            StockTransactionService.updateById({
                id      : id,
                dbName  : dbName,
                body    : {
                    $push: {
                        attachments: {$each: file},
                        notes      : {$each: notes}
                    }
                },
                settings: {
                    new: true
                }
            }, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Stock Transaction updated success', data: result});
            });

            /*Model.findByIdAndUpdate(id, {
             $push: {
             attachments: {$each: file},
             notes      : {$each: notes}
             }
             }, {new: true}, function (err, response) {
             if (err) {
             return next(err);
             }

             historyOptions = {
             contentType: response.isOpportunitie ? 'opportunitie' : 'lead',
             dbName     : dbName,
             contentId  : response._id,
             contentName: response.name
             };

             if (files) {
             historyOptions.files = files;
             historyWriter.sendToFollowers(historyOptions);
             }

             res.status(200).send({success: 'Opportunity updated success', data: response});
             });*/
        });
    };

    function updateOnlySelectedFields(req, res, next) {
        var data = req.body;
        var id = req.params.id;
        var dbName = req.session.lastDb;
        var uId = req.session.uId;

        var keys = Object.keys(data);

        var options = {
            dbName  : dbName,
            settings: {new: true},
            body    : data,
            id      : id
        };

        keys.forEach(function (el) {
            if (el.split('.')[0] === 'status') {
                data[el + 'On'] = new Date();
                data[el + 'ById'] = uId;
            }
        });

        StockTransactionService.updateById(options, function (err, goodsNote) {
            var goodsNote = goodsNote ? goodsNote.toJSON() : {};

            if (err) {
                return next(err);
            }

            function callback(err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({status: goodsNote.status});
            }

            if (data['status.shipped']) {
                AvailabilityHelper.deliverProducts({
                    dbName      : dbName,
                    uId         : uId,
                    goodsOutNote: goodsNote
                }, callback);
            } else if (data['status.received']) {
                AvailabilityHelper.receiveProducts({
                    dbName     : dbName,
                    uId        : uId,
                    goodsInNote: goodsNote
                }, callback);
            } else {
                callback();
            }

        });

    }

};

module.exports = stockCorrections;
