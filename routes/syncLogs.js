var express = require('express');
var router = express.Router();
var Handler = require('../handlers/syncLogs');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new Handler(models);

    router.use(authStackMiddleware);

    router.get('/', handler.getForDd);

    router.get('/getLast/:id', handler.getLastById);
    router.get('/getStats', handler.getStats);

    return router;
};
