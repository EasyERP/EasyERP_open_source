var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var oxr = require('open-exchange-rates');

var Currency = function (models) {
    var CurrencyStoreSchema = mongoose.Schemas.CurrencyStore;

    var currencyService = require('../services/currency')(models);

    oxr.set({app_id: process.env.OXR_APP_ID});

    this.getForDd = function (req, res, next) {
        var options = {
            _id     : 1,
            name    : 1,
            sequence: 1,
            symbol  : 1,
            decPlace: 1,
            dbName  : req.session.lastDb
        };

        currencyService.find({
            active: true
        }, options, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.getAll = function (req, res, next) {
        var Currencies = models.get(req.session.lastDb, 'CurrencyStore', CurrencyStoreSchema);

        Currencies.findOne({}, function (err, doc) {
            if (err) {
                return next(err);
            }
            if (!doc || moment(doc.date).diff(new Date(), 'month')) {
                oxr.load('currencies.json', function (err, docs) {
                    var currArr = [];
                    var key;
                    var docsObject;
                    var currencyStore;
                    var saveObj;

                    function callback(err, data) {
                        res.status(200).send({data: currArr});
                    }

                    if (docs) {
                        docsObject = JSON.parse(docs);

                        for (key in docsObject) {
                            currArr.push({
                                _id : key,
                                name: key + '- ' + docsObject[key]
                            });
                        }

                        saveObj = {
                            data: currArr,
                            date: new Date()
                        };

                        if (!doc) {
                            currencyStore = new Currencies(saveObj);
                            currencyStore.save(callback);
                        } else {
                            Currencies.findByIdAndUpdate(doc._id, {$set: saveObj}, callback);
                        }
                    }

                });
            } else {
                res.status(200).send({data: doc.data});
            }
        });
    };

    this.getForList = function (req, res, next) {
        var options = {
            _id     : 1,
            name    : 1,
            sequence: 1,
            symbol  : 1,
            active  : 1,
            decPlace: 1,
            dbName  : req.session.lastDb
        };

        currencyService.find({}, options, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.update = function (req, res, next) {
        var body = req.body;
        var id = req.params.id;

        currencyService.update({
            body  : body,
            id    : id,
            dbName: req.session.lastDb
        }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.create = function (req, res, next) {
        var body = req.body;

        body.dbName = req.session.lastDb;

        currencyService.create(body, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });

    };

    this.remove = function (req, res, next) {
        var id = req.params.id;

        currencyService.remove({id: id, dbName: req.session.lastDb}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };
};

module.exports = Currency;
