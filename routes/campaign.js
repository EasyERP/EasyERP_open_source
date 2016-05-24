/**
 * Created by liliy on 04.02.2016.
 */
var express = require('express');
var router = express.Router();
var Handler = require('../handlers/campaigns');

module.exports = function (models) {
    'use strict';
    var handler = new Handler(models);

    router.get('/', handler.getForDd);

    return router;
};