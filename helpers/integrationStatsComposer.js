'use strict';

module.exports = function (models) {
    var async = require('async');
    var ChannelLinksService = require('../services/channelLinks')(models);
    var OrderService = require('../services/order')(models);
    var ConflictService = require('../services/conflict')(models);

    return function (db, callback) {
        async.parallel({
            importedProducts: function (pCb) {
                ChannelLinksService.importedProducts(db, function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            },

            importedOrders: function (pCb) {
                OrderService.importedOrders(db, function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            },

            conflictProducts: function (pCb) {
                ConflictService.importedConflicts(db, function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            },

            unlinkedOrders: function (pCb) {
                OrderService.importedUnlinked(db, function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
            }
        }, callback);
    };
};
