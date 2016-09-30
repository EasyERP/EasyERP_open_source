var express = require('express');
var router = express.Router();
var Handler = require('../handlers/accountTypes');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new Handler(models);
    
    router.get('/getForDD', authStackMiddleware, handler.getForDd);

    return router;
};
