'use strict';

var mongoose = require('mongoose');

module.exports = function (models) {
    return new function () {
        this.findByUserIdAndRemove = function (userId, options, callback) {
            var _options = {};
            var connection;
            var db;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            connection = mongoose.createConnection(process.env.MAIN_DB_HOST, process.env.MAIN_DB_NAME, process.env.DB_PORT, {
                db    : {native_parser: true},
                server: {poolSize: 1},
                user  : process.env.DB_USER,
                pass  : process.env.DB_PASS
            });

            connection.on('error', function (err) {
                err = err || 'connection error';

                if (typeof callback === 'function') {
                    callback(err);
                }
            });
            connection.once('open', function () {
                db = connection.db;
                db.collection('sessions', function (err, collection) {
                    if (err) {
                        connection.close();
                        return callback(err);
                    }

                    userId = userId.toString();
                    collection.deleteMany({session: {$regex: userId}}, _options, function (err, result) {
                        if (err) {
                            connection.close();
                            return callback(err);
                        }

                        callback(null, result);
                        connection.close();
                    });
                });
            });
        };
    };
};
