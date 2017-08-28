var csv = require('fast-csv');
var fs = require('fs');
var arrayToXlsx = require('../exporter/arrayToXlsx');
var async = require('async');
var path = require('path');

function createProjection(map, options) {
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

function exportToCsv(options) {
    var res = options.res;
    var next = options.next;
    var Model = options.Model;
    var query = options.query || [];
    var map = options.map;
    var fileName = options.fileName;
    var resultArray = options.resultArray;
    var headersArray = [];
    var project = createProjection(map.aliases, {putHeadersTo: headersArray});
    var formatters = map.formatters;
    var nameOfFile = fileName ? fileName : type ? type : 'data';
    var resultAggregate;
    var returnResult = options.returnResult;
    var cb = options.cb;

    query.push({$project: project});
    resultAggregate = Model.aggregate(query);

    var writeCsv = function (array) {
        var writableStream = fs.createWriteStream(nameOfFile + ".csv");

        writableStream.on('finish', function () {
            res.download(nameOfFile + ".csv", nameOfFile + ".csv", function (err) {
                if (err) {
                    return next(err);
                }

                fs.unlink(nameOfFile + '.csv', function (err) {
                    if (err) {
                        console.log(err);
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

    if (!resultArray) {
        resultAggregate.exec(function (err, response) {

            if (err) {
                return next(err);
            }

            if (returnResult) {
                return cb(null, response);
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
    } else {
        writeCsv(resultArray);
    }
};

/**
 * @param {Object} handler - object to insert exportToXlsx method
 * @param {Function) getModel - function(req) that will return specified model
 * @param {Object} map - object with all model properties and their names
 * @param {string} fileName - name that will be used for export file, without extension
 */
function exportToXlsx(options) {
    var res = options.res;
    var next = options.next;
    var Model = options.Model;
    var query = options.query || [];
    var map = options.map;
    var fileName = options.fileName;
    var resultArray = options.resultArray;
    var headersArray = [];
    var project = createProjection(map.aliases, {putHeadersTo: headersArray});
    var formatters = map.formatters;
    var type = options.type;
    var nameOfFile = fileName ? fileName : type ? type : 'data';
    var resultAggregate;
    var returnResult = options.returnResult;
    var cb = options.cb;

    query.push({$project: project});
    resultAggregate = Model.aggregate(query);

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
                    console.log(err);
                } else {
                    console.log('done');
                }
            });
        });

    };

    if (!resultArray) {
        resultAggregate.exec(function (err, response) {

            if (err) {
                return next(err);
            }

            if (returnResult) {
                return cb(null, response);
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
    } else {
        if (formatters) {
            async.each(resultArray, function (item, callback) {

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
                writeXlsx(resultArray);
            });
        } else {
            writeXlsx(resultArray);
        }
    }
}

function reportToXlsx(options) {
    var res = options.res;
    var next = options.next;
    var map = options.map;
    var attributes = options.attributes;
    var fileName = options.fileName;
    var resultArray = options.resultArray;
    var headersArray = map;

    var writeXlsx = function (array) {
        var pathToFile = path.join('exportFiles', fileName + '.xlsx');

        arrayToXlsx.writeFile(pathToFile, array, {
            sheetName : 'report',
            headers   : headersArray,
            attributes: attributes
        });

        //pathToFile = encodeURIComponent(pathToFile);
        //pathToFile = path.join('download', pathToFile);

        res.download(pathToFile, pathToFile, function (err) {
            if (err) {
                return next(err);
            }

            fs.unlink(pathToFile, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('done');
                }
            });
        });
    };

    writeXlsx(resultArray);
}

function reportToCSV(options) {
    var res = options.res;
    var next = options.next;
    var map = options.map;
    var attributes = options.attributes;
    var fileName = options.fileName;
    var resultArray = options.resultArray;
    var headersArray = map;

    var writeCsv = function (array) {
        var pathToFile = path.join('exportFiles', fileName + '.csv');
        var writableStream = fs.createWriteStream(pathToFile);

        writableStream.on('finish', function () {
            res.download(pathToFile, pathToFile, function (err) {
                if (err) {
                    return next(err);
                }

                fs.unlink(pathToFile, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('done');
                    }
                });
            });
        });

        csv
            .write(array, {headers: true})
            .pipe(writableStream);
    };

    writeCsv(resultArray);
}

exports.exportToCsv = exportToCsv;
exports.exportToXlsx = exportToXlsx;
exports.reportToXlsx = reportToXlsx;
exports.reportToCSV = reportToCSV;
//
///**
// *
// * Inserts export methods to specific handler object
// * @param {Object} handler - object to insert exportToXlsx and exportToCsv methods
// * @param {Function) getModel - function(req) that will return specified model
// * @param {Object} map - object with all model properties and their names
// * @param {string} [fileName] - name that will be used for export file, without extension. Otherwise will be used "type" from request query, if exist or "data"
// */
//exports.addExportFunctionsToHandler = function (options) {
//    exportToCsv(options);
//    exportToXlsx(options);
//};