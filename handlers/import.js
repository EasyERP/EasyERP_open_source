var mongoose = require('mongoose');
var Module = function (models) {
    'use strict';

    var ImportSchema = mongoose.Schemas.Imports;
    var UserSchema = mongoose.Schemas.User;
    var PersonSchema = mongoose.Schemas.Customer;

    var schemaObj = {
        Customers    : mongoose.Schemas.Customer,
        Opportunities: mongoose.Schemas.Opportunitie
    };

    var async = require('async');
    var mapObject = require('../public/js/constants/importMapping');
    var moment = require('../public/js/libs/moment/moment');
    var _ = require('lodash');
    var arrayKeys = {
        'groups.users': true,
        'groups.group': true
    };

    function toOneCase(item) {
        item = item.toLowerCase();
        item = item.replace(/[-+=_() !@#$%^&*`{}\[\]:;.,|\\]/g, '');

        return item;
    }

    function comparing(item1, item2) {
        var changedItem1 = toOneCase(item1);
        var changedItem2 = toOneCase(item2);

        if (changedItem1.indexOf(changedItem2) >= 0 || changedItem2.indexOf(changedItem1) >= 0 || changedItem1 === changedItem2) {
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

                if (firstArr[j] && (comparing(secondArr[i], firstArr[j]))) {
                    result[secondArr[i]] = firstArr[j];
                    firstArr[j] = null;

                    isChanged = !isChanged;
                    break;
                }
            }

            if (!isChanged) {
                result[secondArr[i]] = '';
            }
        }

        return {
            result  : result,
            unMapped: firstArr
        };
    }

    function mapImportFileds(importObj, fieldsArray) {
        var mappedFields = {};

        for (var i in importObj) {

            if (importObj[i] !== '') {
                mappedFields[importObj[i]] = fieldsArray.indexOf(i);
            }
        }

        return mappedFields;
    }

    function prepareSaveObject(mappedFields, saveItemArray) {
        var saveObj = {};
        var val;
        var arr;

        for (var i in mappedFields) {
            val = saveItemArray[mappedFields[i]];
            arr = [];

            if (val && arrayKeys && arrayKeys[mappedFields[i]] === true) {
                if (typeof +val === 'number') {
                    arr.push(val);
                    val = arr;
                } else {
                    val = val.split(',');
                }
            }

            if (val) {
                if (!isNaN(+val)) {
                    saveObj[i] = +val;
                } else if (val === 'false') {
                    saveObj[i] = false;
                } else if (val === 'true') {
                    saveObj[i] = true;
                } else {
                    saveObj[i] = val;
                }
            }

        }

        return saveObj;
    }

    this.getImportMapObject = function (req, res, next) {
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var userId = req.session.uId;
        var query = req.query;
        var type = query.type || 'Customers';
        var personKeysArray = mapObject[type].slice();
        var mappedObj;
        var unmappedResult = {};
        var mappedResult = {};
        var findObj = {
            user: userId
        };

        if (query.timeStamp) {
            findObj.timeStamp = query.timeStamp;
        }

        ImportModel.findOne(findObj, function (err, importedData) {
            if (err) {
                return next(err);
            }

            if (importedData) {
                mappedObj = splitFields(personKeysArray, importedData.result);
            }

            mappedObj.unMapped = _.compact(mappedObj.unMapped);
            unmappedResult[type] = mappedObj.unMapped;

            mappedResult[type] = mappedObj.result;

            res.status(200).send({
                mappedObj  : mappedResult,
                unmappedObj: unmappedResult
            });
        });
    };

    this.getForPreview = function (req, res, next) {
        var query = req.query;
        var timeStamp = +query.timeStamp;
        var userId = req.session.uId;
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var UserModel = models.get(req.session.lastDb, 'Users', UserSchema);
        var criteria = {user: userId};
        var titleArray;
        var mappedFields;
        var resultArray = [];
        var map;
        var type;
        var result;

        if (timeStamp) {
            criteria.timeStamp = timeStamp;
        }

        UserModel.findOne({_id: userId}, {imports: 1}, function (err, userModel) {
            if (err) {
                return next(err);
            }

            map = userModel.imports && userModel.imports.map;
            type = map.type;
            result = map.result;

            ImportModel
                .find(criteria)
                .limit(6)
                .exec(function (err, importData) {
                    if (err) {
                        return next(err);
                    }

                    if (!importData.length) {
                        res.status(404).send({result: 'Imported data not found'});
                        return;
                    }

                    titleArray = importData.shift().result;

                    mappedFields = mapImportFileds(result, titleArray);

                    async.each(importData, function (importItem, cb) {
                        var saveObj;
                        var importItemObj = importItem.toJSON().result;


                        saveObj = prepareSaveObject(mappedFields, importItemObj);
                        resultArray.push(saveObj);
                        cb();

                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({
                            result: resultArray,
                            keys  : _.values(result),
                            type  : type
                        });
                    });

                });
        });

    };

    this.saveImportedData = function (req, res, next) {
        var data = req.body;
        var userId = req.session.uId;
        var ImportModel = models.get(req.session.lastDb, 'Imports', ImportSchema);
        var PersonModel = models.get(req.session.lastDb, 'Customers', PersonSchema);
        var titleArray;
        var mappedFields;

        ImportModel.find({user: userId}, function (err, importData) {
            if (err) {
                return next(err);
            }

            if (!importData.length) {
                res.status(404).send({result: 'Imported data not found'});
                return;
            }

            titleArray = importData.shift().result;

            mappedFields = mapImportFileds(data, titleArray);

            async.each(importData, function (importItem, cb) {
                var saveModel;
                var saveObj;
                var importItemObj = importItem.toJSON().result;


                saveObj = prepareSaveObject(mappedFields, importItemObj);

                saveModel = new PersonModel(saveObj);

                saveModel.save(cb);
            }, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send();
            });
        });
    };

};

module.exports = Module;
