var csv = require('fast-csv');
var fs = require('fs');
var arrayToXlsx = require('../exporter/arrayToXlsx');
var async = require('async');


var createProjection = function (map, options) {
    var project = {};
    var properties = options.properties;
    var arrayToAdd = options.putHeadersTo;
    var addHeaders = !!arrayToAdd;
    var value;

    for (var key in map) {
        value = map[key];
        if (addHeaders) {
            arrayToAdd.push(value);
        }
        //todo remove some properties from map according to {properties}
        project[value] = '$' + key;
    }
    return project;
};

/**
 * @param {Object} handler - object to insert exportToCsv method
 * @param {Function) getModel - function(req) that will return specified model
 * @param {Object} map - object with all model properties and their names
 * @param {string fileName - name that will be used for export file, without extension
 */
var addExportToCsvFunctionToHandler = function (handler, getModel, map, fileName) {
    handler['exportToCsv'] = function (req, res, next) {
        var Model = getModel(req);
        var body = req.body;

        var propertiesToDisplay = body.properties;
        var type = body.type;

        var project = createProjection(map.aliases, {properties: propertiesToDisplay});
        var nameOfFile = fileName ? fileName : type ? type : 'data';
        var formatters = map.formatters;
        var writeCsv = function (array) {
            var writableStream = fs.createWriteStream(nameOfFile + ".csv");

            writableStream.on('finish', function () {
                res.download(nameOfFile + ".csv", nameOfFile + ".csv", function (err) {
                    if (err) {
                        return next(err);
                    }

                    fs.unlink(nameOfFile + '.csv', function (err) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('done');
                        }
                    });
                });
            });

            csv
                .write(array, {headers: Object.keys(project)})
                .pipe(writableStream);

        };

        Model.aggregate({$match: type ? {type: type} : {}}, {$project: project}, function (err, response) {
            if (err) {
                return next(err);
            }

            if (formatters) {
                async.each(response, function (item, callback) {

                    var keys = Object.keys(formatters);

                    for (var i = keys.length - 1; i >= 0; i--) {
                        var key = keys[i];
                        item[key] = formatters[key](item[key]);
                    }

                    callback();

                }, function (err) {
                    if (err) {
                        return next(err);
                    }
                    writeCsv(response);
                });
            } else {
                writeCsv(response);
            }

        });
    }
};

/**
 * @param {Object} handler - object to insert exportToXlsx method
 * @param {Function) getModel - function(req) that will return specified model
 * @param {Object} map - object with all model properties and their names
 * @param {string} fileName - name that will be used for export file, without extension
 */
var addExportToXlsxFunctionToHandler = function (handler, getModel, map, fileName) {
    handler['exportToXlsx'] = function (req, res, next) {
        var Model = getModel(req);
        var filter = req.body;
        var type = req.query.type;
        var headersArray = [];
        var project = createProjection(map.aliases, {filter: filter, putHeadersTo: headersArray});
        var formatters = map.formatters;
        var nameOfFile = fileName ? fileName : type ? type : 'data';

        var writeXlsx = function (array) {
            arrayToXlsx.writeFile(nameOfFile + '.xlsx', array, {
                sheetName : "data",
                headers   : headersArray,
                attributes: headersArray
            });

            res.download(nameOfFile + '.xlsx', nameOfFile + '.xlsx', function (err) {
                if (err) {
                    return next(err);
                }

                fs.unlink(nameOfFile + '.xlsx', function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('done');
                    }
                });
            })

        };


        Model.aggregate({$match: type ? {type: type} : {}}, {$project: project}, function (err, response) {

            if (err) {
                return next(err);
            }
            if (formatters) {
                async.each(response, function (item, callback) {

                    var keys = Object.keys(formatters);

                    for (var i = keys.length - 1; i >= 0; i--) {
                        var key = keys[i];
                        item[key] = formatters[key](item[key]);
                    }

                    callback();

                }, function (err) {
                    if (err) {
                        return next(err);
                    }
                    writeXlsx(response);
                });
            } else {
                writeXlsx(response);
            }



        });
    }
};

exports.addExportToCsvFunctionToHandler = addExportToCsvFunctionToHandler;
exports.addExportToXlsxFunctionToHandler = addExportToXlsxFunctionToHandler;

/**
 *
 * Inserts export methods to specific handler object
 * @param {Object} handler - object to insert exportToXlsx and exportToCsv methods
 * @param {Function) getModel - function(req) that will return specified model
 * @param {Object} map - object with all model properties and their names
 * @param {string} [fileName] - name that will be used for export file, without extension. Otherwise will be used "type" from request query, if exist or "data"
 */
exports.addExportFunctionsToHandler = function (handler, getModel, map, fileName) {
    addExportToCsvFunctionToHandler(handler, getModel, map, fileName);
    addExportToXlsxFunctionToHandler(handler, getModel, map, fileName);
};