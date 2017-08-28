var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

module.exports = function (req, res, next, models, settingName, event) {
    'use strict';

    var SettingsService = require('../services/settings')(models, event);
    var lastDb = req.session.lastDb;
    var uId = req.session.uId;
    var params = req.params;
    var ids = params.id ? [params.id] : [];
    var confirmDelete = req.body.confirmDelete;
    var counterDeleted = 0;
    var counterUndeleted = 0;
    var arrayIds = [];
    var arrayOfUndeleted = [];
    var findObj;
    var Model;
    var Schema;
    var message;

    if (!ids || !ids.length) {
        ids = req.body.ids;
    }

    SettingsService.findOne({
        name: 'deleteFilter'
    }, {
        dbName: 'mainDB'
    }, function (err, settings) {
        if (err) {
            return next(err);
        }

        if (!settings){
          req.body.ids = ids;

          return next();
        }

        settings = settings.collections[settingName];

        if (ids && !ids.length) {
            ids = [ids];
        }

        function findForDelete(itemId, deleteCallback) {
            var functionsArray = [];

            async.each(settings, function (settingsItem, eCb) {
                functionsArray.push(function (id, wCb) {
                    findObj = {};

                    Schema = mongoose.Schemas[settingsItem.name];
                    Model = models.get(lastDb, settingsItem.name, Schema);

                    if (typeof id === 'function') {
                        wCb = id;
                        id = itemId;
                    }

                    findObj[settingsItem.field] = id;

                    Model.find(findObj, function (err, res) {
                        if (err) {
                            return wCb(err);
                        }

                        if (res && res.length) {
                            err = new Error('Please, delete fields by once!');
                            err.status = 400;

                            return wCb(err);
                        }

                        wCb(null, itemId);
                    });
                });

                eCb();
            }, function () {
                deleteCallback(functionsArray);
            });
        }

        async.each(ids, function (itemId, callback) {
            findForDelete(itemId, function (functionsArray) {
                async.waterfall(functionsArray, function (err) {
                    if (err) {
                        counterUndeleted += 1;

                        arrayOfUndeleted.push(itemId);

                        return callback();
                    }

                    counterDeleted += 1;
                    arrayIds.push(itemId);
                    callback();
                });
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            if (counterUndeleted) {
                message = counterDeleted + ' of ' + (counterUndeleted + counterDeleted) + ' were removed. Other have relative documents';

                console.log(message);

                if (counterUndeleted + counterDeleted === 1) {
                    message = 'This item has relative documents. You can\'t delete it.';
                }

                if (event && confirmDelete) {
                    event.emit('showInfoDelete', {
                        uId    : uId,
                        message: message
                    });
                }
            }

            if (next) {
                req.body.ids = arrayIds;
                req.body.arrayOfUndeleted = arrayOfUndeleted;

                if (!confirmDelete && arrayOfUndeleted.length) {
                    return res.status(200).send({ids: arrayOfUndeleted});
                }

                next();
            }
        });
    });
};
