var express = require('express');
var router = express.Router();
var opportunityHandler = require('../handlers/opportunity');

module.exports = function (models) {
    var handler = new opportunityHandler(models);

    router.get('/getFilterValues', handler.getFilterValues);
    router.get('/:viewType', handler.getByViewType);
    router.post('addLeadTM', handler.addNewLeadFromSite);
    return router;
};