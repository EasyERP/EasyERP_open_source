var mongoose = require('mongoose');
var Mailer = require('../helpers/mailer');
var mailer = new Mailer();
var async = require('async');
var objectId = mongoose.Types.ObjectId;

var Module = function (models) {
    var OrgSettingsService = require('../services/organizationSetting')(models);
    var EmployeeService = require('../services/employee')(models);
    var FollowersService = require('../services/followers')(models);
    var UserService = require('../services/user')(models);

    function sendEmailToFollower(options, callback) {
        var collectionName;
        var mailOptions;
        var contentName;
        var contentId;
        var followerId;
        var err;

        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        if (typeof callback !== 'function') {
            callback = function () {
            };
        }

        collectionName = options.collectionName;
        contentName = options.contentName;
        contentId = options.contentId;
        followerId = options.followerId;
        options.id = followerId;

        if (!followerId) {
            err = new Error('Invalid input parameters');
            err.status = 400;

            return callback(err);
        }

        UserService.findById(options, function (err, modelUser) {
            var workEmail;
            var employee;

            if (err) {
                return callback(err);
            }

            if (modelUser.relatedEmployee) {
                employee = modelUser.relatedEmployee;

                workEmail = employee.workEmail;
                employee = employee.name.first + ' ' + employee.name.last;
            } else {
                workEmail = modelUser.email;
                employee = modelUser.login;
            }

            if (workEmail) {
                mailOptions = {
                    to            : workEmail,
                    employee      : employee,
                    contentName   : contentName || '',
                    contentId     : contentId || '',
                    collectionName: collectionName,
                    dbName        : options.dbName
                };

                OrgSettingsService.getFromMail(mailOptions, function (err, settings) {
                    if (err) {
                        return callback(err);
                    }
                    if (settings && !settings.defaultEmail && settings.contact) {
                        mailOptions.from = settings.contact.email;
                    }

                    mailer.sendAddedFollower(mailOptions, callback);
                });
            } else {
                console.log('employee have not work email');
                callback();
            }
        });
    }

    this.create = function (req, res, next) {
        var body = req.body;
        var dbName = req.session.lastDb;
        var contentName = body.contentName;
        var isUser = body.isUser;

        body.dbName = dbName;

        function findRelatedUser(callback) {
            if (isUser) {
                return callback();
            }
            EmployeeService.findById(body.followerId, {dbName: dbName}, function (err, result) {
                var relatedUser;

                if (err) {
                    return callback(err);
                }
                relatedUser = result.relatedUser || null;
                body.followerId = relatedUser;

                callback();
            });
        }

        function findFollower(options, callback) {
            FollowersService.find({
                contentId : options.contentId,
                followerId: options.followerId
            }, {
                dbName: options.dbName
            }, callback);
        }

        function saveFollower(options, callback) {
            if (!options.length) {
                FollowersService.create(body, function (err, result) {
                    var contentId = body.contentId;
                    if (err) {
                        return callback(err);
                    }

                    sendEmailToFollower({
                        followerId    : result.followerId,
                        contentName   : contentName,
                        contentId     : contentId,
                        collectionName: result.collectionName,
                        dbName        : dbName
                    });

                    FollowersService.aggregateFind(objectId(contentId), {dbName: dbName}, function (err, result) { // add objectId
                        if (err) {
                            return callback(err);
                        }
                        result = result.map(function (elem) {
                            return {
                                name      : elem.followerName,
                                followerId: elem.follower._id,
                                _id       : elem._id
                            };
                        });

                        callback(null, result);
                    });
                });
            } else {
                callback();
            }
        }

        body.createdBy = {
            date: new Date(),
            user: req.session.uId
        };

        async.waterfall([findRelatedUser, async.apply(findFollower, body), saveFollower], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id || req.body._id;
        var dbName = req.session.lastDb;

        FollowersService.findByIdAndRemove(id, {dbName: dbName}, function (err, result) {
            if (err) {
                return next(err);
            }
            FollowersService.aggregateFind(result.contentId, {dbName: dbName}, function (err, result) {
                if (err) {
                    return next(err);
                }

                result = result.map(function (elem) {
                    return {
                        name      : elem.followerName,
                        followerId: elem.follower._id,
                        _id       : elem._id
                    };
                });

                res.status(200).send({data: result});
            });
        });

    };

    this.sendEmailToFollower = sendEmailToFollower;
};

module.exports = Module;
