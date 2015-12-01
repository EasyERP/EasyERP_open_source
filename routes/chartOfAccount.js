var express = require('express');
var router = express.Router();
var chartOfAccountHandler = require('../handlers/chartOfAccount');

module.exports = function (models) {
    var handler = new chartOfAccountHandler(models);

    router.get('/', handler.getForView);

    return router;
};