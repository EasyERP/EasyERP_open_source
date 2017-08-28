var mongoose = require('mongoose');
var async = require('async');

var Module = function (models) {
    'use strict';

    var orgSettingsSchema = mongoose.Schemas.orgSettingsSchema;
    var orgService = require('../services/organizationSetting')(models);
    var MailHelper = require('../helpers/mailer');
    var mailHelper = new MailHelper();
    var path = require('path');
    var fs = require('fs');
    var Uploader = require('../services/fileStorage/index');
    var uploader = new Uploader();

    this.getSettings = function (req, res, next) {
        var OrgSettings = models.get(req.session.lastDb, 'orgSettings', orgSettingsSchema);

        OrgSettings
            .findOne({})
            .populate('currency')
            .populate('industry')
            .populate('contact')
            .populate('salesTax')
            .populate('purchaseTax')
            .populate('shipping')
            .populate('payableTax')
            .populate('carriedTax')
            .populate('discount')
            .populate('bankAccount')
            .populate('paymentTerms')
            .populate('workInProgress')

            .exec(function (err, settings) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: settings});
            });
    };

    this.update = function (req, res, next) {
        var OrgSettings = models.get(req.session.lastDb, 'orgSettings', orgSettingsSchema);
        var body = req.body;
        var id = req.params.id;

        OrgSettings.findByIdAndUpdate(id, body, {new: true}, function (err, settings) {
            if (err) {
                return next(err);
            }

            settings.populate('currency', function (err, settings) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(settings);
            });
        });
    };

    this.create = function (req, res, next) {
        var OrgSettings = models.get(req.session.lastDb, 'orgSettings', orgSettingsSchema);
        var body = req.body;

        var settings = new OrgSettings(body);

        settings.save(function (err, settings) {
            if (err) {
                return next(err);
            }

            settings.populate('currency', function (err, settings) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(settings);
            });

        });
    };

    this.remove = function (req, res, next) {
        var OrgSettings = models.get(req.session.lastDb, 'orgSettings', orgSettingsSchema);
        var id = req.params.id;

        OrgSettings.findByIdAndRemove(id, function (err, method) {
            if (err) {
                return next(err);
            }

            res.status(200).send(method);
        });
    };

    this.sendMessageFromHelp = function (req, res, next) {
        var body = req.body;
        var files = req.files && req.files.attachfile ? req.files.attachfile : null;
        var waterfallTasks;
        var uploadFiles;
        var getFromMail;
        var sendMail;
        var removeFiles;
        var name = req.headers.name;
        var email = req.headers.email;
        var message = req.headers.message;
        var dir = path.join(email);

        uploadFiles = function (wfCb) {
            if (!files) {
                return wfCb(null, []);
            }

            uploader.postFile(dir, files, {userId: req.session.uName}, function (err, files) {
                var newFiles = [];

                if (err) {
                    return wfCb(err);
                }

                files.forEach(function (file) {
                    newFiles.push({
                        filename: file.name,
                        path    : path.join(global.appRoot, decodeURIComponent(file.shortPas))
                    });
                });

                wfCb(null, newFiles);
            });
        };

        getFromMail = function (files, wfCb) {
            orgService.getFromMail({dbName: req.session.lastDb}, function (err, settings) {
                var mail;

                if (err) {
                    return wfCb(err);
                }

                if (settings && !settings.defaultEmail && settings.contact) {
                    mail = settings.contact.email;
                }

                wfCb(null, files || [], mail || 'info@thinkmobiles.com');
            });
        };

        sendMail = function (files, mail, wfCb) {
            mailHelper.sendMailFromHelp({
                from       : email,
                to         : 'norbert.madyar@thinkmobiles.com',
                name       : name,
                email      : email,
                message    : message,
                attachments: files,
                req        : req
            }, function (err) {
                if (err) {
                    return wfCb(err);
                }

                wfCb();
            });
        };

        removeFiles = function (wfCb) {
            uploader.removeDir(dir, 'uploads');

            wfCb();
        };
        waterfallTasks = [uploadFiles, getFromMail, sendMail, removeFiles];

        async.waterfall(waterfallTasks, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
        });
    };

};

module.exports = Module;
