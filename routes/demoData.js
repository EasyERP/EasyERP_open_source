var express = require('express');
var router = express.Router();
var Handler = require('../handlers/saas');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (mainDb, models, event) {
    var handler = new Handler(mainDb, models, event);

    router.get('/', authStackMiddleware, handler.clearData);

    return router;
};