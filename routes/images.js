var express = require('express');
var router = express.Router();
var ImagesHandler = require('../handlers/images');
var authStackMiddleware = require('../helpers/checkAuth');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new ImagesHandler(models, event);
    //var moduleId = MODULES.IMAGES;
    //var accessStackMiddleWare = require('../helpers/access')(moduleId, models);

    // router.use(authStackMiddleware);

    router.get('/avatar/:product/:id', handler.checkAsMain);

    router.post('/uploadFiles', multipartMiddleware, handler.uploadFiles);

    router.delete('/:id', handler.deleteImage);

    return router;
};
