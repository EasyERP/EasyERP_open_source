var CustomDashboardHandler = require('../handlers/customDashboard');
var express = require('express');
var router = express.Router();

module.exports = function (models) {
    var handler = new CustomDashboardHandler(models);

    router.get('/', handler.getDashboards);
    router.get('/:id', handler.getById);
    router.post('/', handler.createDashboard);
    router.delete('/', handler.deleteDashboards);

    return router;
};
