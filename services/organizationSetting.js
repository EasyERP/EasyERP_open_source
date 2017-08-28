var mongoose = require('mongoose');
var OrgSettingsSchema = mongoose.Schemas.orgSettingsSchema;
var Mailer = require('../helpers/mailer');
var mailer = new Mailer();

module.exports = function (models) {
    return new function () {
        this.getFromMail = function (mailOptions, cb) {
            var OrgSettings;
            var dbName;
            var err;

            if (typeof mailOptions === 'function') {
                cb = mailOptions;
                mailOptions = {};
            }

            if (typeof cb !== 'function') {
                cb = function () {
                };
            }

            dbName = mailOptions.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return cb(err);
            }

            OrgSettings = models.get(dbName, 'orgSettings', OrgSettingsSchema);
            OrgSettings
                .findOne()
                .populate('contact', 'email')
                .exec(cb);
        };

        this.getBaseCurrency = function (options, cb) {
            var OrgSettings;
            var dbName;
            var err;

            if (typeof options === 'function') {
                cb = options;
                options = {};
            }

            if (typeof cb !== 'function') {
                cb = function () {
                };
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return cb(err);
            }

            OrgSettings = models.get(dbName, 'orgSettings', OrgSettingsSchema);
            OrgSettings
                .findOne()
                .populate('currency')
                .exec(function (err, result) {
                    var base;

                    if (err) {
                        return cb(err);
                    }

                    base = result && result.currency ? result.currency._id : 'USD';

                    cb(null, base);
                });
        };

        this.getDiscount = function (options, cb) {
            var OrgSettings;
            var dbName;
            var err;

            if (typeof options === 'function') {
                cb = options;
                options = {};
            }

            if (typeof cb !== 'function') {
                cb = function () {
                };
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return cb(err);
            }

            OrgSettings = models.get(dbName, 'orgSettings', OrgSettingsSchema);
            OrgSettings
                .findOne()
                .exec(function (err, result) {

                    if (err) {
                        return cb(err);
                    }

                    cb(null, result.discount || null)
                });

        };

        this.getDefaultTaxes = function (options, cb) {
            var OrgSettings;
            var dbName;
            var err;
            var forSales = options.forSales;
            var both = options.both;

            if (typeof options === 'function') {
                cb = options;
                options = {};
            }

            if (typeof cb !== 'function') {
                cb = function () {
                };
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return cb(err);
            }

            OrgSettings = models.get(dbName, 'orgSettings', OrgSettingsSchema);
            OrgSettings
                .findOne()
                .exec(function (err, result) {
                    var taxAccount;
                    var salesTax;
                    var purchaseTax;
                    var payableTax;
                    var carriedTax;

                    if (err) {
                        return cb(err);
                    }

                    salesTax = result && result.salesTax ? result.salesTax : null;
                    purchaseTax = result && result.purchaseTax ? result.purchaseTax : null;
                    payableTax = result && result.payableTax ? result.payableTax : null;
                    carriedTax = result && result.carriedTax ? result.carriedTax : null;

                    if (both) {
                        return cb(null, {
                            salesTax   : salesTax,
                            purchaseTax: purchaseTax,
                            payableTax : payableTax,
                            carriedTax : carriedTax
                        });
                    }

                    if (forSales) {
                        taxAccount = salesTax;

                        return cb(null, taxAccount);
                    }

                    taxAccount = purchaseTax;
                    cb(null, taxAccount);
                });
        };

        this.getDefaultShippingAccount = function (options, cb) {
            var OrgSettings;
            var dbName;
            var err;

            if (typeof options === 'function') {
                cb = options;
                options = {};
            }

            if (typeof cb !== 'function') {
                cb = function () {
                };
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return cb(err);
            }

            OrgSettings = models.get(dbName, 'orgSettings', OrgSettingsSchema);
            OrgSettings
                .findOne()
                .exec(function (err, result) {
                    var shipping;

                    if (err) {
                        return cb(err);
                    }

                    shipping = result && result.shipping ? result.shipping : null;

                    cb(null, shipping);
                });
        };

        this.getBankAccount = function (options, cb) {
            var OrgSettings;
            var dbName;
            var err;

            if (typeof options === 'function') {
                cb = options;
                options = {};
            }

            if (typeof cb !== 'function') {
                cb = function () {
                };
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return cb(err);
            }

            OrgSettings = models.get(dbName, 'orgSettings', OrgSettingsSchema);
            OrgSettings
                .findOne()
                .populate('bankAccount')
                .exec(function (err, result) {

                    if (err) {
                        return cb(err);
                    }

                    if (!result || !result.bankAccount) {
                        err = new Error('Organisation settings not exists');
                        err.status = 400;

                        return cb(err);
                    }

                    result = result.toJSON();

                    cb(null, result.bankAccount);
                });
        };

        this.getWorkInProgress = function (options, cb) {
            var OrgSettings;
            var dbName;
            var err;

            if (typeof options === 'function') {
                cb = options;
                options = {};
            }

            if (typeof cb !== 'function') {
                cb = function () {
                };
            }

            dbName = options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return cb(err);
            }

            OrgSettings = models.get(dbName, 'orgSettings', OrgSettingsSchema);
            OrgSettings
                .findOne()
                .exec(function (err, result) {

                    if (err) {
                        return cb(err);
                    }

                    if (!result) {
                        err = new Error('Organisation settings not exists');
                        err.status = 400;

                        return cb(err);
                    }

                    result = result.toJSON();

                    cb(null, result.workInProgress || null);
                });
        };
    };
};
