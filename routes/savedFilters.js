/**
 * Created by liliya on 8/12/15.
 */
var express = require('express');
var router = express.Router();
var savedFiltersHandler = require('../handlers/savedFilters');

module.exports = function (models) {
    var handler = new savedFiltersHandler(models);

    router.get('/', handler.getSavedFilters);
    router.post('/', handler.addFilter);
    router.delete('/', handler.deleteFilter);


    return router;
};