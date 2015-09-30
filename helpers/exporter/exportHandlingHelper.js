//var csv = require('fast-csv');
var fs = require('fs');
var arrayToXlsx = require('../exporter/arrayToXlsx');

var createProjection = function (map, options) {
    var project = {};
    var filter = options.filter;
    var arrayToAdd = options.putHeadersTo;
    var addHeaders = !!arrayToAdd;
    var value;

    for (var key in map) {
        value = map[key];
        if (addHeaders) {
            arrayToAdd.push(value);
        }
        //todo remove some properties from map according to filter
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
        var filter = req.body;
        var type = req.query.type;
        var project = createProjection(map, {filter: filter});
        var nameOfFile = fileName ? fileName : type ? type : 'data';

        Model.aggregate({$match: type ? {type: type} : {}}, {$project: project}, function (err, response) {
            var writableStream;

            if (err) {
                return next(err);
            }

            writableStream = fs.createWriteStream(nameOfFile + ".csv");

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
                .write(response, {headers: Object.keys(project)})
                .pipe(writableStream);

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
        var project = createProjection(map, {filter: filter, putHeadersTo: headersArray});
        var nameOfFile = fileName ? fileName : type ? type : 'data';

        Model.aggregate({$match: type ? {type: type} : {}}, {$project: project}, function (err, response) {

            if (err) {
                return next(err);
            }
            //todo map objectId to string

            arrayToXlsx.writeFile(nameOfFile + '.xlsx', response, {
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