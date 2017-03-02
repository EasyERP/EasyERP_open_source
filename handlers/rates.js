var mongoose = require('mongoose');
var async = require('async');
var moment = require('../public/js/libs/moment/moment');
var FilterMapper = require('../helpers/filterMapper');
var filterMapper = new FilterMapper();
var redisStore = require('../helpers/redisClient');

var contentType = 'rates';

var Module = function (models) {
    var RatesSchema = mongoose.Schemas.rates;
    var currencyRatesHelper = require('../helpers/currencyRates')(models);
    var ratesHelper = require('../services/rates')(models);
    var orgService = require('../services/organizationSetting')(models);

    function getForList(req, res, next) {
        var optionsObject = {};
        var query = req.query;
        var filter = query.filter;
        var Model = models.get(req.session.lastDb, 'rates', RatesSchema);

        optionsObject.$and = [];

        if (filter && typeof filter === 'object') {
            optionsObject.$and.push(filterMapper.mapFilter(filter, {contentType: contentType}));
        }

        Model
            .find(optionsObject)
            .select('_id date rates')
            .sort({date: -1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(result);
            });
    }

    this.getForList = function (req, res, next) {
        getForList(req, res, next);
    };

    function getById(req, res, next) {
        var id = req.params.id || req.query.id;

        ratesHelper.getById({dbName: req.session.lastDb, id: id}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    }

    this.getById = getById;

    this.syncRates = function (req, res, next) {
        var data = req.query;
        var startDate = data.startDate && moment(new Date(data.startDate)).format('YYYY-MM-DD') || '2016-05-01';
        var endDate = data.endDate && moment(new Date(data.endDate)).format('YYYY-MM-DD') || '2016-11-02';
        var getRates;
        var createRates;
        var check = new Date(endDate) - new Date(startDate);

        req.query.filter = {
            date: {
                value: [
                    startDate,
                    endDate
                ]
            }
        };

        getRates = function (cb) {
            var ratesArray = [];
            var datesArray = [];

            do {
                datesArray.push(moment(new Date(startDate)).format('YYYY-MM-DD'));

                startDate = moment(new Date(startDate)).add(1, 'day').format('YYYY-MM-DD');

                check = new Date(endDate) - new Date(startDate);
            } while (check > 0);

            async.each(datesArray, function (date, callback) {
                currencyRatesHelper.get({dbName: req.session.lastDb, date: date}, function (err, result) {
                    if (err) {
                        return callback(err);
                    }

                    ratesArray.push(result);

                    callback();
                });
            }, function (err) {
                if (err) {
                    return cb(err);
                }

                cb(null, ratesArray);
            });

        };

        createRates = function (ratesArray, cb) {

            async.each(ratesArray, function (ratesObject, callback) {
                var body = {};
                var rates = ratesObject.rates;
                var currencies = Object.keys(rates);
                var base = ratesObject.base;

                body._id = ratesObject.date;
                body.date = ratesObject.date;
                body.base = base;
                body.rates = {};

                currencies.forEach(function (curr) {
                    if (!body.rates[curr]) {
                        body.rates[curr] = {};
                    }

                    if (curr !== base) {
                        body.rates[curr][base] = rates[curr];
                    }
                });

                ratesHelper.create({dbName: req.session.lastDb, body: body}, callback);
            }, function (err) {
                if (err) {
                    return cb(err);
                }

                cb(null);
            });
        };

        async.waterfall([getRates, createRates], function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
            // getForList(req, res, next);
        });
    };

    this.update = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'rates', RatesSchema);
        var body = req.body;
        var id = req.params.id;

        Model.findByIdAndUpdate(id, body, {new: true}, function (err, rate) {
            if (err) {
                return next(err);
            }

            redisStore.writeToStorage('', rate._id, JSON.stringify(rate));

            res.status(200).send(rate);
        });
    };

    this.create = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var getBaseCurrency;
        var createFunc;
        var waterfalTasks;

        body._id = body.date;

        getBaseCurrency = function (wfCallback) {
            var options = {
                dbName: dbName
            };

            orgService.getBaseCurrency(options, wfCallback);
        };

        createFunc = function (base, wfCallback) {
            body.base = base || 'USD';

            ratesHelper.create({dbName: req.session.lastDb, body: body}, function (err, result) {
                if (err) {
                    return wfCallback(err);
                }

                wfCallback(null, result);

            });
        };

        waterfalTasks = [getBaseCurrency, createFunc];

        async.waterfall(waterfalTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);

        });

    };

    this.remove = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'rates', RatesSchema);
        var id = req.params.id;

        Model.findByIdAndRemove(id, function (err, removed) {
            if (err) {
                return next(err);
            }

            redisStore.removeFromStorage('', removed._id);

            res.status(200).send(removed);
        });
    };
};

module.exports = Module;
