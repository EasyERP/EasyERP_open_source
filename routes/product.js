/**
 * Created by Roman on 29.04.2015.
 */
var express = require('express');
var router = express.Router();
var ProductHandler = require('../handlers/product');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models) {
    var handler = new ProductHandler(models);

    router.get('/', handler.getAll);
    router.get('/getProductsAlphabet', handler.getProductsAlphabet);
    router.get('/getProductsTypeForDd', handler.getProductsTypeForDd);
    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/:viewType', handler.getForView);
    router.post('/', handler.create);
    /*app.post('/uploadEmployeesFiles', multipartMiddleware, function (req, res, next) {
        var os = require("os");
        var osType = (os.type().split('_')[0]);
        var dir;
        switch (osType) {
            case "Windows":
            {
                dir = __dirname + "\\uploads\\";
            }
                break;
            case "Linux":
            {
                dir = __dirname + "\/uploads\/";
            }
        }
        fs.readdir(dir, function (err, files) {
            if (err) {
                fs.mkdir(dir, function (errr) {
                    if (!errr)
                        dir += req.headers.id;
                    fs.mkdir(dir, function (errr) {
                        if (!errr)
                            uploadFileArray(req, res, function (files) {
                                handler.uploadProductFile(req, res, req.headers.id, files);
                            });
                    });
                });
            } else {
                dir += req.headers.id;
                fs.readdir(dir, function (err, files) {
                    if (err) {
                        fs.mkdir(dir, function (errr) {
                            if (!errr)
                                uploadFileArray(req, res, function (files) {
                                    handler.uploadProductFile(req, res, req.headers.id, files);
                                });
                        });
                    } else {
                        uploadFileArray(req, res, function (files) {
                            requestHandler.uploadEmployeesFile(req, res, req.headers.id, files);
                        });
                    }
                });
            }
        });
    });*/

    return router;
};