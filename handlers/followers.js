var mongoose = require('mongoose');
var Mailer = require('../helpers/mailer');
var mailer = new Mailer();
var async = require('async');

var Module = function (models) {
    var OrgSettingsService = require('../services/organizationSetting')(models);
    var EmployeeService = require('../services/employee')(models);
    var FollowersService = require('../services/followers')(models);


    function sendEmailToFollower(options, callback) {
        var collectionName;
        var mailOptions;
        var contentName;
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
        followerId = options.followerId;

        if (!followerId) {
            err = new Error('Invalid input parameters');
            err.status = 400;

            return callback(err);
        }

        EmployeeService.findById(followerId, options, function (err, modelEmployee) {
            var workEmail;
            var employee;

            if (err) {
                return callback(err);
            }

            workEmail = modelEmployee.get('workEmail');
            employee = modelEmployee.get('name');

            if (workEmail) {
                mailOptions = {
                    to            : workEmail,
                    employee      : employee,
                    contentName   : contentName || '',
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

        body.dbName = dbName;

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
                    if (err) {
                        return callback(err);
                    }

                    sendEmailToFollower({
                        followerId    : result.followerId,
                        contentName   : contentName,
                        collectionName: result.collectionName,
                        dbName        : dbName
                    });

                    FollowersService.find({contentId: body.contentId}, {dbName: dbName})
                        .populate('followerId', 'name fullName')
                        .exec(function (err, result) {
                            if (err) {
                                return callback(err);
                            }

                            result = result.map(function (elem) {
                                return {
                                    name      : elem.followerId.fullName,
                                    followerId: elem.followerId._id,
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

        async.waterfall([async.apply(findFollower, body), saveFollower], function (err, result) {
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

            FollowersService.find({contentId: result.contentId}, {dbName: dbName})
                .populate('followerId', 'name fullName')
                .exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    result = result.map(function (elem) {
                        return {
                            name      : elem.followerId.fullName,
                            followerId: elem.followerId._id,
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
