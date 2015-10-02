
require('pmx').init();

var express = require('express');
var router = express.Router();
var wTrackHandler = require('../handlers/dashboard');

module.exports = function (models) {
    var handler = new wTrackHandler(models);

    router.get('/vacation', handler.composeForVacation);
    //router.get('/vacation', handler.getFromCache);
    router.get('/hr', handler.composeForHr);

    return router;
};