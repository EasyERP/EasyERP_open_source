var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var oxr = require('open-exchange-rates');

var Currency = function (models) {
    var CurrencySchema = mongoose.Schemas.Currency;
    var CurrencyStoreSchema = mongoose.Schemas.CurrencyStore;
    oxr.set({app_id: process.env.OXR_APP_ID});

    this.getForDd = function (req, res, next) {
        var query = models.get(req.session.lastDb, 'currency', CurrencySchema).find();

        query
            .select('_id name sequence symbol')
            .sort({sequence: 1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    };

    this.getAll = function (req, res, next) {
        var Currencies = models.get(req.session.lastDb, 'CurrencyStore', CurrencyStoreSchema);

        Currencies.findOne({}, function(err, doc){
            if (err) {
                return next(err);
            }
            if (!doc || moment(doc.date).diff(new Date(), 'month')){
                oxr.load('currencies.json', function(err, docs){
                    var currArr = [];
                    var key;
                    var docsObject;
                    var currencyStore;
                    var saveObj;

                    function callback (err, data){
                        res.status(200).send({data : currArr});
                    }

                    if (docs) {
                        docsObject = JSON.parse(docs);

                        for (key in docsObject){
                            currArr.push({
                                _id : key,
                                name: key + '- ' + docsObject[key]
                            });
                        }

                        saveObj = {
                            data : currArr,
                            date : new Date()
                        };

                        if (!doc){
                            currencyStore = new Currencies(saveObj);
                            currencyStore.save(callback);
                        } else {
                            Currencies.findByIdAndUpdate(doc._id, {$set : saveObj}, callback);
                        }
                    }

                });
            } else {
                res.status(200).send({data : doc.data});
            }
        });
    };

    this.getForList = function (req, res, next) {
        var Currency = models.get(req.session.lastDb, 'currency', CurrencySchema);

        Currency
            .find()
            .sort({sequence: 1})
            .exec(function (err, methods) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(methods);
            });
    };

    this.update = function (req, res, next) {
        var Currency = models.get(req.session.lastDb, 'currency', CurrencySchema);
        var body = req.body;
        var id = req.params.id;

        Currency.findByIdAndUpdate(id, body, {new : true}, function (err, method) {
            if (err) {
                return next(err);
            }

            res.status(200).send(method);
        });
    };

    this.create = function (req, res, next) {
        var Currency = models.get(req.session.lastDb, 'currency', CurrencySchema);
        var body = req.body;



        Currency.count({}, function(err, count){
            body.sequence = count++;
            var currency = new Currency(body);
            currency.save(function (err, method) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(method);
            });
        });


    };

    this.remove = function (req, res, next) {
        var Currency = models.get(req.session.lastDb, 'currency', CurrencySchema);
        var id = req.params.id;

        Currency.findByIdAndRemove(id, function (err, method) {
            if (err) {
                return next(err);
            }

            res.status(200).send(method);
        });
    };
};

module.exports = Currency;
