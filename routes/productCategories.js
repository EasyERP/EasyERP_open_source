/**
 * Created by Roman on 13.05.2015.
 */

var express = require('express');
var router = express.Router();
var CategoryHandler = require('../handlers/productCategories');

module.exports = function (models) {
    var handler = new CategoryHandler(models);

    router.get('/', handler.getForDd);
    router.post('/', handler.create);

    return router;
};