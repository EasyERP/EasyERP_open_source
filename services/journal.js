'use strict';
var mongoose = require('mongoose');
var journalSchema = mongoose.Schemas.journal;

module.exports = function (models) {
    return new function () {
        this.journalFinder = function (options, callback) {
            var Journal;
            var dbName;
            var err;
            var journalId;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Journal = models.get(dbName, 'journal', journalSchema);
            journalId = options.journal;

            Journal.findById(journalId, callback);
        };

        this.journalFinderByAccounts = function (options, callback) {
            var Journal;
            var dbName;
            var err;
            var debitAccount;
            var creditAccount;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                    return false;
                };
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            Journal = models.get(dbName, 'journal', journalSchema);
            debitAccount = options.debitAccount;
            creditAccount = options.creditAccount;

            Journal.findOne({debitAccount: debitAccount, creditAccount: creditAccount}, callback);
        };
    };
};

