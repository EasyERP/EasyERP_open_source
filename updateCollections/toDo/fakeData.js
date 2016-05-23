var mongoose = require('mongoose');
var models = require('../../models/index.js');
var moment = require('../../public/js/libs/moment/moment');
var customersSchema = mongoose.Schemas.Customer;
var _ = require('lodash');
var async = require('async');
var dbObject = {};
var mainCb;

var forbiddenIds = [];

var production = mongoose.createConnection('localhost', 'production', 27017, {
    db: {native_parser: true},
    server: {poolSize: 5},
    user: 'easyErp',
    pass: '1q2w3e!@#'
});

var crm = mongoose.createConnection('localhost', 'CRM', 27017, {
    db: {native_parser: true},
    server: {poolSize: 5},
    user: 'easyErp',
    pass: '1q2w3e!@#'
});

var CRMCustomer = crm.model('Customers', customersSchema);
var ProductionCustomer = production.model('Customers', customersSchema);

production.on('error', console.error.bind(console, 'connection error:'));
production.once('open', function callback() {
    dbObject.production = production;
    mainCb();
});
crm.on('error', console.error.bind(console, 'connection error:'));
crm.once('open', function callback() {
    dbObject.production = production;
    mainCb();
});

mainCb = _.after(2, function () {
    function crmSearcher(type, cb) {
        type = type || 'Person';

        CRMCustomer.aggregate([{
            $match: {
                _id: {$nin: forbiddenIds},
                type: type
            }
        }, {
            $sample: {
                size: 1
            }
        }], function (err, result) {
            var crmDoc;

            if (err) {
                return cb(err);
            }

            crmDoc = result[0] || {};

            if (forbiddenIds.indexOf(crmDoc._id.toString()) !== -1) {
                return crmSearcher(type, cb);
            }

            forbiddenIds.push(crmDoc._id.toString());
            cb(null, crmDoc);
        });
    }

    function personsUpdater(parallelCb) {
        ProductionCustomer.find({type: 'Person'}, {
            imageSrc: 1,
            name: 1,
            address: 1,
            website: 1,
            skype: 1,
            phones: 1,
            contacts: 1,
            attachments: 1,
            companyInfo: 1,
            company: 1
        }).exec(function (err, persons) {
            if (err) {
                return parallelCb(err);
            }

            async.each(persons, function (person, callback) {
                crmSearcher('Person', function (err, crmPerson) {
                    if (err) {
                        return callback(err);
                    }

                    delete crmPerson._id;

                    ProductionCustomer.findByIdAndUpdate(person._id, {$set: crmPerson}, function (err, updated) {
                        if (err) {
                            return callback(err);
                        }

                        console.log('====== updated ====');
                        callback();
                    });
                });
            }, function (err) {
                if (err) {
                    return parallelCb(err);
                }

                parallelCb();
            });
        });
    };
    function companiesUpdater(parallelCb) {
        ProductionCustomer.find({type: 'Company'}, {
            imageSrc: 1,
            name: 1,
            address: 1,
            website: 1,
            skype: 1,
            phones: 1,
            contacts: 1,
            attachments: 1,
            companyInfo: 1
        }).exec(function (err, persons) {
            if (err) {
                return parallelCb(err);
            }

            async.each(persons, function (person, callback) {
                crmSearcher('Company', function (err, crmPerson) {
                    if (err) {
                        return callback(err);
                    }

                    delete crmPerson._id;

                    ProductionCustomer.findByIdAndUpdate(person._id, {$set: crmPerson}, function (err, updated) {
                        if (err) {
                            return callback(err);
                        }

                        console.log('====== updated ====');
                        callback();
                    });
                });
            }, function (err) {
                if (err) {
                    return parallelCb(err);
                }
                parallelCb();
            });
        });
    };

    async.parallel([personsUpdater, companiesUpdater], function (err, customersResult) {
        if (err) {
            return console.error(err);
        }

        console.log(customersResult);
    });
});



