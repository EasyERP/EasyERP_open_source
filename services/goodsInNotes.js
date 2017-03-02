'use strict';
var mongoose = require('mongoose');
var GoodsInNotesSchema = mongoose.Schemas.GoodsInNote;

module.exports = function (models) {
    return new function () {
        this.goodsInFinder = function (options, callback) {
            var Model;
            var dbName;
            var err;
            var order;

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

            Model = models.get(dbName, 'GoodsInNote', GoodsInNotesSchema);
            order = options.order;

            Model.aggregate([{
                $match: {
                    order: order
                }
            }, {
                $unwind: '$orderRows'
            }, {
                $group: {
                    _id      : null,
                    orderRows: {$push: '$orderRows'}
                }
            }], function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result && result.length ? result[0].orderRows : []);
            });

        };

        this.getByOrder = function (options, callback) {
            var GoodsInNote;
            var dbName;
            var err;
            var order = options.order;

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

            GoodsInNote = models.get(dbName, 'GoodsInNote', GoodsInNotesSchema);

            GoodsInNote.aggregate([{
                $match: {
                    order: order
                }
            }, {
                $group: {
                    _id: null,
                    ids: {$addToSet: '$_id'}
                }
            }], function (err, result) {
                var ids;

                if (err) {
                    return callback(err);
                }

                ids = result && result.length ? result[0].ids : [];

                callback(null, ids);
            });
        };
    };
};
