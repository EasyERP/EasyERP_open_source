var mongoose = require('mongoose');
require('../../models/index.js');

var dbObject = mongoose.createConnection('localhost', 'CRM', 27017);
var oxr = require('open-exchange-rates');
var moment = require('../../public/js/libs/moment/moment');

var CurrencySchema = mongoose.Schemas.Currency;
var CurrencyStoreSchema = mongoose.Schemas.CurrencyStore;

var CurrenciesStore = dbObject.model('CurrencyStore', CurrencyStoreSchema);
var CurrencyModel = dbObject.model('currency', CurrencySchema);

oxr.set({app_id: process.env.OXR_APP_ID});

CurrenciesStore.findOne({}, function (err, doc) {
    if (err) {
        return console.log(err);
    }
    if (!doc || moment(doc.date).diff(new Date(), 'month')) {
        oxr.load('currencies.json', function (err, docs) {
            var currArr = [];
            var key;
            var docsObject;
            var currencyStore;
            var saveObj;

            function callback(err, data) {
                // res.status(200).send({data: currArr});
                console.log('good');

                CurrenciesStore.findOne({}, function (err, models) {
                    if (err) {
                        return console.log(err);
                    }

                    models.data.forEach(function (mod) {
                        var arrays = ['USD', 'UAH', 'EUR'];
                        var newModel;
                        var body = {
                            _id : mod._id,
                            name: mod.name
                        };

                        if (arrays.indexOf(mod._id) > 0) {
                            body.active = true;
                        }

                        newModel = new CurrencyModel(body);

                        newModel.save(function (err, result) {
                            if (err) {
                                return console.log(err);
                            }

                            console.log(result);
                        });

                    });
                });
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
                    currencyStore = new CurrenciesStore(saveObj);
                    currencyStore.save(callback);
                } else {
                    CurrenciesStore.findByIdAndUpdate(doc._id, {$set: saveObj}, callback);
                }
            }

        });
    } else {
        // res.status(200).send({data: doc.data});

        CurrenciesStore.findOne({}, function (err, models) {
            if (err) {
                return console.log(err);
            }

            models.data.forEach(function (mod) {
                var arrays = ['USD', 'UAH', 'EUR'];

                var newModel;
                var body = {
                    _id : mod._id,
                    name: mod.name
                };

                if (arrays.indexOf(mod._id) > 0) {
                    body.active = true;
                }

                newModel = new CurrencyModel(body);

                newModel.save(function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log(result);
                });

            });
        });
    }
});

