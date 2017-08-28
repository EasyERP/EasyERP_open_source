'use strict';

var mongoose = require('mongoose');
var userSchema = mongoose.Schemas.User;
var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var validator = require('validator');
var populateWrapper = require('../helpers/callbackWrapper').populate;
var CONSTANTS = require('../constants/mainConstants');

var Mailer = require('../helpers/mailer');
var mailer = new Mailer();
var namesRetriever = require('../helpers/namesRetriever');
var logger = require('../helpers/logger');

module.exports = function (models) {
    return new function () {
        this.create = function (options, callback) {
            var shaSum = crypto.createHash('sha256');
            var sendEmail;
            var dbName;
            var UserModel;
            var password;
            var user;
            var err;

            function emailSender(user, waterfallCb) {
                var name = namesRetriever(user.email);

                if (!user.email) {
                    return waterfallCb(null, user);
                }

                if (!sendEmail) {
                    return waterfallCb(null, user);
                }

                mailer.registeredNewUser({
                    firstName: name.first,
                    lastName : name.last,
                    login    : user.login,
                    email    : user.email,
                    password : password,
                    host     : process.env.HOST
                }, function (err) {
                    if (err) {
                        logger.error(err);
                    }

                    waterfallCb(null, user);
                });
            }

            function saveUser(user, waterfallCb) {
                user.save(function (err, _user) {
                    if (err) {
                        return waterfallCb(err);
                    }

                    waterfallCb(null, _user);
                });
            }

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            password = options.pass || '';

            sendEmail = !options.stopEmailing;

            delete options.dbName;
            delete options.stopEmailing;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            shaSum.update(password);
            options.pass = shaSum.digest('hex');

            UserModel = models.get(dbName, 'Users', userSchema);
            user = new UserModel(options);

            async.waterfall([async.apply(saveUser, user), emailSender], callback);

        };

        this.createWithVerify = function (options, callback) {
            var shaSum = crypto.createHash('sha256');
            var dbName = options.dbName;
            var userDb = options.dbId;
            var sendEmail;
            var UserModel;
            var password;
            var user;
            var err;

            options.profile = CONSTANTS.ADMIN_PROFILE;

            function tokenCreator(user, waterfallCb) {
                crypto.randomBytes(6, function (err, buffer) {
                    var token = buffer.toString('hex');

                    user.credentials = {
                        verify_token: token
                    };

                    waterfallCb(null, user);
                });
            }

            function emailSender(user, waterfallCb) {
                var name = user.contactName;
                var token = user.credentials.verify_token;

                if (!user.email) {
                    return waterfallCb(null, user);
                }

                if (!sendEmail) {
                    return waterfallCb(null, user);
                }

                mailer.registeredNewUserWithToken({
                    firstName: name.first,
                    lastName : name.last,
                    login    : user.login,
                    email    : user.email,
                    password : password,
                    host     : process.env.HOST,
                    link     : process.env.HOST + 'users/verify?token=' + token + '&db=' + userDb
                }, function (err) {
                    if (err) {
                        logger.error(err);
                    }

                    waterfallCb(null, user);
                });
            }

            function saveUser(user, waterfallCb) {
                user.save(function (err, _user) {
                    if (err) {
                        return waterfallCb(err);
                    }

                    waterfallCb(null, _user);
                });
            }

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            password = options.pass;

            sendEmail = !options.stopEmailing;

            delete options.dbName;
            delete options.stopEmailing;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            shaSum.update(password);
            options.pass = shaSum.digest('hex');

            UserModel = models.get(dbName, 'Users', userSchema);
            user = new UserModel(options);

            async.waterfall([async.apply(tokenCreator, user), saveUser, emailSender], callback);

        };

        this.find = function (query, projection, options, callback) {
            var _options = {new: true};
            var argumentsLength = arguments.length;
            var UserModel;
            var dbName;
            var err;

            if (argumentsLength) {
                callback = arguments[argumentsLength - 1];

                if (argumentsLength === 3) {
                    options = projection;
                    projection = {};
                } else if (argumentsLength > 4) {
                    err = new Error('Invalid input parameters');
                    err.status = 400;

                    return callback(err);
                }
            } else {
                err = new Error('Invalid input parameters');

                return console.error(err);
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (typeof projection !== 'object') {
                projection = {};
            }

            if (typeof options !== 'object') {
                options = {};
            }

            if (!query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            UserModel = models.get(dbName, 'Users', userSchema);
            UserModel.find(query, projection, _options, function (err, users) {
                if (err) {
                    return callback(err);
                }

                callback(null, users);
            });
        };

        /*       this.findById = function (_id, options, callback) {
         var UserModel;
         var dbName;
         var query;
         var err;

         if (typeof options === 'function') {
         callback = options;
         options = {};
         }

         dbName = options.dbName;

         if (!dbName || !validator.isMongoId(_id)) {
         err = new Error('Invalid input parameters');
         err.status = 400;

         if (typeof callback !== 'function') {
         return populateWrapper(err);
         }

         return callback(err);
         }

         UserModel = models.get(dbName, 'Users', userSchema);
         query = UserModel.findById(_id);

         if (typeof callback !== 'function') {
         return query;
         }

         query
         .populate('relatedEmployee')
         .exec(function (err, user) {
         if (err) {
         return callback(err);
         }

         callback(null, user);
         });
         };*/

        this.findById = function (options, callback) {
            var UserModel;
            var dbName;
            var _id;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            _id = options.id;

            delete options.dbName;
            delete options.id;

            if (!dbName || !_id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            UserModel = models.get(dbName, 'Users', userSchema);
            UserModel
                .findById(_id)
                .populate('relatedEmployee')
                .exec(function (err, user) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, user);
                });
        };

        this.findOne = function (options, callback) {
            var UserModel;
            var dbName;
            var query;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            dbName = options.dbName;
            query = options.query;

            delete options.dbName;
            delete options.id;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            UserModel = models.get(dbName, 'Users', userSchema);
            UserModel
                .findOne(query)
                .populate('relatedEmployee')
                .exec(function (err, user) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, user);
                });
        };

        this.findByIdAndUpdate = function (_id, updateObject, options, callback) {
            var _options = {new: true};
            var UserModel;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!_id || !updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            UserModel = models.get(dbName, 'Users', userSchema);
            UserModel.findByIdAndUpdate(_id, updateObject, _options, function (err, user) {
                if (err) {
                    return callback(err);
                }

                callback(null, user);
            });
        };

        this.findOneAndUpdate = function (query, updateObject, options, callback) {
            var _options = {new: true};
            var UserModel;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (!query || !updateObject || typeof updateObject !== 'object') {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            UserModel = models.get(dbName, 'Users', userSchema);
            UserModel.findOneAndUpdate(query, updateObject, _options, function (err, user) {
                if (err) {
                    return callback(err);
                }

                callback(null, user);
            });
        };

        this.findByIdAndRemove = function (_id, options, callback) {
            var _options = {};
            var UserModel;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName || !_id) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            UserModel = models.get(dbName, 'Users', userSchema);
            UserModel.findByIdAndRemove(_id, _options, function (err, user) {
                if (err) {
                    return callback(err);
                }

                callback(null, user);
            });
        };

        this.findAndRemove = function (query, options, callback) {
            var _options = {multi: true};
            var UserModel;
            var dbName;
            var err;

            if (typeof options === 'function') {
                callback = options;
                options = {};
            }

            if (!callback || typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (options) {
                _options = _.assign(_options, options);
            }

            dbName = _options.dbName;
            delete _options.dbName;

            if (!dbName || !query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            UserModel = models.get(dbName, 'Users', userSchema);
            UserModel.findOneAndRemove(query, function (err, removed) {
                if (err) {
                    return callback(err);
                }

                callback(null, removed);
            });
        };

        this.findOne = function (options, callback) {
            var UserModel;
            var dbName;
            var err;
            var query;

            if (typeof callback !== 'function') {
                callback = function () {
                };
            }

            if (typeof options !== 'object') {
                options = {};
            }

            query = options.query;

            if (!query) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            dbName = options.dbName;
            delete options.dbName;

            if (!dbName) {
                err = new Error('Invalid input parameters');
                err.status = 400;

                return callback(err);
            }

            UserModel = models.get(dbName, 'Users', userSchema);


            UserModel.findOne(query, function (err, user) {
              if (err) {
                    return callback(err);
                }

                callback(null, user);
            });
        };
    };
};
