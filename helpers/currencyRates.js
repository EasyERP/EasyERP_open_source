'use strict';
var request = require('request');
var async = require('async');
var oxr = require('open-exchange-rates');
var moment = require('../public/js/libs/moment/moment');
var oxrHelper = require('./currency');
var appId1 = 'b81387a200c2463e9ae3d31cc60eda62';
var appId2 = 'b81387a200c2463e9ae3d31cc60eda62';
var appId3 = 'b81387a200c2463e9ae3d31cc60eda62';
var appId4 = 'b81387a200c2463e9ae3d31cc60eda62';

module.exports = function (models) {
    return new function () {
        var orgService = require('../services/organizationSetting')(models);
        var currencyService = require('../services/currency')(models);

        this.get = function (opt, cb) {
            var now = moment();
            var baseUrl = 'http://api.fixer.io/latest?base=';
            var waterfallTasks;
            var getLatestRates;
            var getBaseCurrency;
            var getSymbols;
            var getFromOXR;
            var dbName = opt.dbName;
            var date = opt.date;
            var setDate = false;
            var baseCurrency;

            if (date) {
                setDate = true;
                baseUrl = 'http://api.fixer.io/';
            }

            if (typeof cb !== 'function') {
                cb = function () {
                };
            }

            if (typeof date === 'function') {
                cb = date;
                date = moment();
            } else if (!isNaN((new Date(date)).getTime())) {
                date = moment(date);
            } else {
                date = new Date();
            }

            date = moment(date) || now;
            date = date.format('YYYY-MM-DD');

            if (setDate) {
                baseUrl += date + '?base=';
            }

            getBaseCurrency = function (wfCallback) {
                var options = {
                    dbName: dbName
                };

                orgService.getBaseCurrency(options, wfCallback);
            };

            getSymbols = function (base, wfCallback) {
                baseUrl += base;

                baseCurrency = base;

                currencyService.getNames({dbName: dbName}, wfCallback);
            };

            getLatestRates = function (symbols, wfCallback) {
                var method = 'GET';
                var _headers = {
                    'content-type': 'application/json'
                };
                var symbolsString = symbols.join(',');

                if (symbols && symbols.length) {
                    baseUrl += '&&symbols=' + symbolsString;
                }

                request({
                    url    : baseUrl,
                    method : method,
                    json   : true,
                    headers: _headers
                }, function (err, resp, result) {
                    if (err) {
                        return wfCallback(err);
                    }

                    wfCallback(null, symbols, result && result.rates ? result : {rates: {}});
                });
            };

            getFromOXR = function (symbols, ratesObject, callback) {

                if (symbols.length === Object.keys(ratesObject.rates).length) {
                    return callback(null, ratesObject);
                }

               /* if (baseCurrency === 'USD') {
                    oxr.set({app_id: appId1});

                    oxrHelper(date, function (err, oxr) {
                        if (err) {
                            return callback(err);
                        }

                        symbols.forEach(function (currency) {
                            if (!ratesObject.rates[currency]) {
                                ratesObject.rates[currency] = oxr.rates[currency];
                            }
                        });

                        callback(null, ratesObject);
                    });
                } else {*/
                    callback(null, ratesObject);
               // }

            };

            waterfallTasks = [getBaseCurrency, getSymbols, getLatestRates, getFromOXR];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return cb(err);
                }

                cb(null, result);
            });
        };

    };
};
