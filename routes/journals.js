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

    /**
     *@api {post} /journals/ Request for creating new Journal
     *
     * @apiVersion 0.0.1
     * @apiName createNewJournal
     * @apiGroup Journals
     *
     * @apiParamExample {json} Request-Example:
     * {
          "name": "jour",
          "transaction": "Invoice",
          "debitAccount": "565eb53a6aa50532e5df0bca",
          "creditAccount": "565eb53a6aa50532e5df0bc8"
        }
     *
     * @apiSuccess {Object} NewJournal Just created new journal
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     {
        "name": "Expenses Invoice Journal ",
        "transaction": "Invoice",
        "debitAccount": "565eb53a6aa50532e5df0bca",
        "creditAccount": "565eb53a6aa50532e5df0bca"
    }
     */
    router.post('/', _journalHandler.create);
    router.patch('/', _journalHandler.putchBulk);

    router.delete('/:id', _journalHandler.remove);
    router.delete('/', _journalHandler.bulkRemove);

    return router;
};
