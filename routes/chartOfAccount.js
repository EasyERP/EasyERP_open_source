/**
 * Created by lilya on 27/11/15.
 */
var express = require('express');
var router = express.Router();
var chartOfAccountHandler = require('../handlers/chartOfAccount');

module.exports = function (models) {
    var handler = new chartOfAccountHandler(models);

    router.get('/', handler.getForView);
    router.get('/getForDd', handler.getForDd);
    router.post('/', handler.create);
    router.delete('/:id', handler.remove);
    router.patch('/', handler.putchBulk);

    return router;
};