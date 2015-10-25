/**
 * Created by liliya on 22.10.15.
 */
var express = require('express');
var router = express.Router();
var jobsHandler = require('../handlers/jobs');

module.exports = function (models) {
    var handler = new jobsHandler(models);

    router.get('/', handler.getData);
    router.get('/getForDD', handler.getForDD);
    router.post('/update', handler.update);

    return router;
};