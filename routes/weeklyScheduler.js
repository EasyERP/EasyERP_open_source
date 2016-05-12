var express = require('express');
var router = express.Router();
var WeeklySchedulerHandler = require('../handlers/weeklyScheduler');

module.exports = function (models) {
    var handler = new WeeklySchedulerHandler(models);

    router.get('/:viewType', function (req, res, next) {
        var viewType = req.params.viewType;
        switch (viewType) {
            case "form":
                handler.getInvoiceById(req, res, next);
                break;
            default:
                handler.getForView(req, res, next);
        }
    });

    return router;
};
