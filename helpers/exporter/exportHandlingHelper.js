var csv = require('fast-csv');
var fs = require('fs');
var arrayToXlsx = require('../exporter/arrayToXlsx');
/**
 *
 * @param handler object to insert method
 * @param getModel function(req) that will return specified model
 * @param map object with all model properties and their names
 */

var addExportToCsvFunctionToHandler = function (handler, getModel, map, fileName) {
    handler['exportToCsv'] = function (req, res, next) {
        var Model = getModel(req);
        var query;
        var filter = req.body;
        var value;
        var project = {};

        for (var key in map) {
            value = map[key];
            //todo remove some properties from map according to filter
            project[value] = '$' + key;
        }

        query = Model.aggregate({$project: project}, function (err, response) {
            var writableStream;
            if (err) {
                return next(err);
            }

            var writableStream = fs.createWriteStream(fileName + ".csv");
            writableStream.on('finish', function () {
                console.log('done');
                res.sendfile('my.csv', {}, {});
            });
            csv
                .write(response, {headers: true})
                .pipe(ws);

        });
        query.exec();
    }
};

var addExportToXlsxFunctionToHandler = function (handler, getModel, map, fileName) {
    handler['exportToXlsx'] = function (req, res, next) {
        var Model = getModel(req);
        var query;
        var filter = req.body;
        var value;
        var project = {};
        var headers = [];
        for (var key in map) {

            value = map[key];
            headers.push(value);
            //todo remove some properties from map according to filter
            project[value] = '$' + key;
        }
        project._id = 0;
        query = Model.aggregate({$project: project}, function (err, response) {

            if (err) {
                return next(err);
            }

            //todo map objectId to string

            try {
                arrayToXlsx.writeFile(fileName + '.xlsx', response, {sheetName: "data", headers: headers});
            }
            catch (ex) {
                res.status(500).send();
            }

            res.status(200).send();
        });
        query.exec();
    }
};

exports.addExportToCsvFunctionToHandler = addExportToCsvFunctionToHandler;
exports.addExportToXlsxFunctionToHandler = addExportToXlsxFunctionToHandler;
exports.addExportFunctionsToHandler = function (handler, getModel, map, fileName) {
    addExportToCsvFunctionToHandler(handler, getModel, map, fileName);
    addExportToXlsxFunctionToHandler(handler, getModel, map, fileName);
}