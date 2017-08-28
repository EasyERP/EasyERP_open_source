var express = require('express');
var router = express.Router();
var JournalHandler = require('../handlers/journal');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var _journalHandler = new JournalHandler(models, event);
    var moduleId = MODULES.JOURNAL;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'journal', event);
    }

    router.use(authStackMiddleware);

    router.get('/', accessStackMiddleware, _journalHandler.getForView);
    /**
     *@api {get} /journals/ Request Journals
     *
     * @apiVersion 0.0.1
     * @apiName getJournals
     * @apiGroup Journals
     *
     * @apiParam (?Field=value) {String} viewType="list" Type of View
     * @apiParam (?Field=value) {Number} page=1 Number of page
     * @apiParam (?Field=value) {Number} count=100 Count of journals which will show
     * @apiParam (?Field=value) {String} contentType="journal" Type of content
     *
     * @apiSuccess {Object} Journals
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "total": 26,
    "data": [
    {
      "_id": "565ef6ba270f53d02ee71d65",
      "name": "Invoice Journal",
      "__v": 0,
      "creditAccount": {
        "_id": "565eb53a6aa50532e5df0be0",
        "name": "200000 Product Sales"
      },
      "debitAccount": {
        "_id": "565eb53a6aa50532e5df0bc9",
        "name": "101200 Account Receivable"
      },
      "editedBy": {
        "user": null
      },
      "createdBy": {
        "date": "2015-12-02T13:48:42.607Z",
        "user": null
      },
      "description": "",
      "currency": {
        "name": "USD"
      },
      "transaction": "invoice",
      "type": "",
      "date": "2015-12-02T13:48:42.607Z"
    },
    ...
    ]
}
     */
    router.get('/', _journalHandler.getForView);

    /**
     *@api {get} /journals/getForDd/ Request Journals for dropDown
     *
     * @apiVersion 0.0.1
     * @apiName getJournalsForDD
     * @apiGroup Journals
     *
     * @apiSuccess {Object} JournalsForDD
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "data": [
    {
      "_id": "57035ffd21f9b0c4313d414e",
      "name": "Adjustment before invoice"
    },
    {
      "_id": "56f3fac93fb451104c75a477",
      "name": "Admin Salary Expenses"
    },
    ...
    ]
}
     */
    router.get('/getForDd', _journalHandler.getForDd);

    /**
     *@api {get} /journals/writeOff/ Request WriteOff
     *
     * @apiVersion 0.0.1
     * @apiName getWriteOff
     * @apiGroup Journals
     *
     * @apiSuccess {Object} WriteOff
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "data": [
        {
            "_id": "57767a427134263421caa841",
            "name": "Write off / Overhead"
        },
        {
            "_id": "57767be5ca7bd4d021041d34",
            "name": "Write off / R&D"
        }
    ]
}
     */
    router.get('/writeOff', _journalHandler.getWriteOff);
    router.get('/getByAccount', _journalHandler.getByAccount);

    router.post('/', accessStackMiddleware, _journalHandler.create);
    router.patch('/', accessStackMiddleware, _journalHandler.putchBulk);
    /**
     *@api {post} /journals/ Request for creating new Journal
     *
     * @apiVersion 0.0.1
     * @apiName createNewJournal
     * @apiGroup Journals
     *
     * @apiParamExample {json} Request-Example:
{
    "name": "jour",
    "transaction": "Invoice",
    "debitAccount": "565eb53a6aa50532e5df0bca",
    "creditAccount": "565eb53a6aa50532e5df0bc8"
}
     *
     * @apiSuccess {Object} NewJournal Just created new journal
     * @apiSuccessExample Success-Response:
HTTP/1.1 201 Created
{
    "name": "Expenses Invoice Journal ",
    "transaction": "Invoice",
    "debitAccount": "565eb53a6aa50532e5df0bca",
    "creditAccount": "565eb53a6aa50532e5df0bca"
}
     */
    router.post('/', _journalHandler.create);

    /**
     *@api {patch} /journals/ Request for updating Journal
     *
     * @apiVersion 0.0.1
     * @apiName updateJournal
     * @apiGroup Journals
     *
     * @apiParamExample {json} Request-Example:
[
    {
        "name": "Invoice Journal ",
        "debitAccount": "565eb53a6aa50532e5df0bca",
        "_id": "565ef6ba270f53d02ee71d65"
    }
]
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":"updated"
}
     */
    router.patch('/', _journalHandler.putchBulk);

    router.delete('/:id', accessStackMiddleware, _journalHandler.remove);
    router.delete('/', accessStackMiddleware, accessDeleteStackMiddlewareFunction, _journalHandler.bulkRemove);
    router.delete('/:id', _journalHandler.remove);

    /**
     *@api {delete} /journals/ Request for deleting Journals
     *
     * @apiVersion 0.0.1
     * @apiName deleteJournals
     * @apiGroup Journals
     *
     * @apiParamExample {json} Request-Example:
{
    "contentType": "journal",
    "ids": [
        "56cc727e541812c07197356c",
        "56cc72a8541812c07197356e",
        "56cc72c4541812c071973570"
    ]
}
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "ok": 1,
    "n": 3
}
     */
    router.delete('/', accessDeleteStackMiddlewareFunction, _journalHandler.bulkRemove);

    return router;
};
