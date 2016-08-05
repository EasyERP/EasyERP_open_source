var mongoose = require('mongoose');
var Module = function (models) {
    'use strict';

    var ImportSchema = mongoose.Schemas.Imports;
    var PersonSchema = mongoose.Schemas.Customer;
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

        for (var i in mappedFields) {
            saveObj[i] = saveItemArray[mappedFields[i]];
        }

        return saveObj;
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

            if (importedData) {
                importedKeyArray = _.values(importedData.result);

                mappedObj = splitFields(personKeysArray, importedKeyArray);
            }

            res.status(200).send(mappedObj || {});
        });
    };

    function parse(data, callback) {
        var insertObj = {};
        var arrayKeys = task.arrayKeys;

        Object.keys(data).forEach(function (key) {
            var val = data[key];

            if (val && arrayKeys && arrayKeys[keysAliases[key]] === true) {
                if (typeof val == 'number') {
                    var arr = [];
                    arr.push(val);
                    val = arr;
                } else {
                    val = val.split(',');
                }
            }

            if (val) {
                insertObj[keysAliases[key]] = val;
            }
        });
        callback(null, insertObj);
    }

    function findAndReplaceObjectId(obj, callback) {
        var findCollection;
        var collection;
        var schema;
        var Model;
        var replaceObj = obj;
        var objectIdKeyList = task.objectIdList;

        if (objectIdKeyList) {

            async.each(Object.keys(objectIdKeyList), function (key, cb) {
                    var val = obj[key];
                    var objID = [];
                    var length;

                    findCollection = importMap[objectIdKeyList[key]];

                    if (val && findCollection) {
                        collection = findCollection.collection;
                        schema = mongoose.Schemas[findCollection.schema];
                        Model = models.get(req.session.lastDb, collection, schema);

                        if (Array.isArray(val)) {
                            length = val.length;

                            if (length > 0) {
                                async.each(Object.keys(val), function (index, calb) {
                                        Model.findOne({'ID': val[index]}, function (err, mod) {

                                            if (err) {
                                                calb(err);
                                            } else {
                                                if (mod) {
                                                    objID.push(mod._id);
                                                    calb();
                                                } else {
                                                    error = new Error('ID = ' + val[index] + ' (' + key + ') not exist in BD');
                                                    error.status = 400;
                                                    calb(error);
                                                }
                                            }
                                        });
                                    },
                                    function (err) {
                                        if (!err) {
                                            replaceObj[key] = objID;
                                            cb();
                                        } else {
                                            cb(err);
                                        }
                                    });
                            } else {
                                cb();
                            }
                        } else {
                            Model.findOne({'ID': val}, function (err, mod) {
                                if (err) {
                                    return cb(err);
                                }

                                if (!mod) {
                                    error = new Error('ID = ' + val + ' (' + key + ') not exist in BD');
                                    error.status = 400;

                                    return cb(error);
                                }

                                replaceObj[key] = mod._id;
                                cb();
                            });
                        }
                    } else {
                        cb();
                    }
                },

                function (err) {
                    if (!err) {
                        callback(null, replaceObj);
                    } else {
                        callback(err);
                    }
                });
        } else {
            callback(null, replaceObj);
        }
    }

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
                if (err){
                    return next(err);
                }

                res.status(200).send();
            });
        });
    };

};

module.exports = Module;
