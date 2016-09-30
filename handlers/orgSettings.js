var mongoose = require('mongoose');
var Module = function (models) {
    'use strict';

    var orgSettingsSchema = mongoose.Schemas.orgSettingsSchema;

    this.getSettings = function (req, res, next) {
        var OrgSettings = models.get(req.session.lastDb, 'orgSettings', orgSettingsSchema);

        OrgSettings
            .findOne({})
            .populate('currency')
            .populate('industry')
            .populate('contact')

            .exec(function (err, settings) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data : settings});
            });
    };

    this.update = function (req, res, next) {
        var OrgSettings = models.get(req.session.lastDb, 'orgSettings', orgSettingsSchema);
        var body = req.body;
        var id = req.params.id;

        OrgSettings.findByIdAndUpdate(id, body, {new : true}, function (err, settings) {
            if (err) {
                return next(err);
            }

            settings.populate('currency', function(err, settings){
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

            settings.populate('currency', function(err, settings){
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

};

module.exports = Module;
