var mongoose = require('mongoose');
var Module = function (models) {
    'use strict';

    var ImportSchema = mongoose.Schemas.Imports;
    var async = require('async');
    var mapObject = require('../public/js/constants/importMapping');
    var moment = require('../public/js/libs/moment/moment');
    var _ = require('lodash');

    function toOneCase(item) {
        item = item.toLowerCase();
        item = item.replace(/[-+=_() !@#$%^&*`{}\[\]:;.,|\\]/g, '');

        return item;
    }

    function comparing(item1, item2) {

        if (toOneCase(item1) === toOneCase(item2)) {
            return true;
        }

        return false;
    }

    function splitFields(firstArr, secondArr) {
        var result = {};
        var isChanged;

        for (var i = 0; i < secondArr.length; i++) {
            isChanged = false;

            for (var j = 0; j < firstArr.length; j++) {
                if (comparing(secondArr[i], firstArr[j])) {
                    result[secondArr[i]] = firstArr[j];
                    isChanged = !isChanged;
                    break;
                }
            }

            if (!isChanged) {
                result[secondArr[i]] = '';
            }
        }

        return {
            result: result
        };
    }

    this.getImportMapObject = function (req, res, next) {
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var userId = req.session.uId;
        var importedKeyArray;
        var personKeysArray = mapObject.customers;
        var mappedObj;

        ImportModel.findOne({user: userId}, function (err, importedData) {
            if (err) {
                return next(err);
            }

            importedKeyArray = _.values(importedData.result);

            mappedObj = splitFields(personKeysArray, importedKeyArray);

            res.status(200).send(mappedObj);
        });
    };

};

module.exports = Module;
