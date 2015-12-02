var express = require('express');
var router = express.Router();
var journalHandler = require('../handlers/journal');
var journalEntryHandler = require('../handlers/journalEntry');

module.exports = function (models) {
    var _journalHandler = new journalHandler(models);
    var _journalEntryHandler = new journalEntryHandler(models);

    router.get('/:viewType', _journalHandler.getForView);
    router.post('/', _journalHandler.create);
    router.post('/journalEntry', _journalEntryHandler.create);
    router.delete('/:id', _journalHandler.remove);
    //router.patch('/', handler.putchBulk);

    return router;
};