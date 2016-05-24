var express = require('express');
var router = express.Router();
var jobsHandler = require('../handlers/jobs');

module.exports = function (models, event) {
    var handler = new jobsHandler(models, event);

    router.get('/', handler.getData);
    router.get('/getForOverview', handler.getForOverview);
    router.get('/getForDD', handler.getForDD);
    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/exportToXlsx/:filter', handler.exportToXlsx);
    router.post('/', handler.create);
    router.post('/update', handler.update);
    router.post('/remove', handler.remove);

    return router;
};