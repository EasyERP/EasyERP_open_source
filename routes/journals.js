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

    router.get('/', accessStackMiddleware, _journalHandler.getForView);
    router.get('/getForDd', _journalHandler.getForDd);
    router.get('/getByAccount', _journalHandler.getByAccount);

    router.post('/', accessStackMiddleware, _journalHandler.create);
    router.patch('/', accessStackMiddleware, _journalHandler.putchBulk);

    router.delete('/:id', accessStackMiddleware, _journalHandler.remove);
    router.delete('/', accessStackMiddleware, _journalHandler.bulkRemove);

    return router;
};
