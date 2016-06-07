var express = require('express');
var router = express.Router();
var journalHandler = require('../handlers/journal');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _journalHandler = new journalHandler(models, event);
    var moduleId = MODULES.JOURNAL;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/', _journalHandler.getForView);
    router.get('/getForDd', _journalHandler.getForDd);
    router.post('/', _journalHandler.create);
    router.delete('/:id', _journalHandler.remove);
    router.patch('/', _journalHandler.putchBulk);

    return router;
};
