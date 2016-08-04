var mongoose = require('mongoose');
var Module = function (models) {
    'use strict';

    var ImportSchema = mongoose.Schemas.Imports;
    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var moment = require('../public/js/libs/moment/moment');
    var _ = require('lodash');

    this.getImportMapObject = function (req, res, next) {
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var userId = req.session.uId;
        var importedKeyArray;

        ImportModel.findOne({user: userId}, function (err, importedData) {
            if (err) {
                return next(err);
            }

            importedKeyArray = _.values(importedData.result);

            res.status(200).send(importedKeyArray);
        });
    };

};

module.exports = Module;
