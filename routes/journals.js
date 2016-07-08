var express = require('express');
var router = express.Router();
var JournalHandler = require('../handlers/journal');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _journalHandler = new JournalHandler(models, event);
    var moduleId = MODULES.JOURNAL;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    router.get('/', _journalHandler.getForView);
    router.get('/getForDd', _journalHandler.getForDd);
    router.get('/writeOff', _journalHandler.getWriteOff);

    router.post('/', _journalHandler.create);
    router.patch('/', _journalHandler.putchBulk);

    router.delete('/:id', _journalHandler.remove);
    router.delete('/', _journalHandler.bulkRemove);

    return router;
};
