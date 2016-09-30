var express = require('express');
var router = express.Router();
var OrgSettingsHandler = require('../handlers/orgSettings');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new OrgSettingsHandler(models);

    router.use(authStackMiddleware);

    router.get('/', handler.getSettings);

    router.put('/:id', handler.update);

    router.post('/', handler.create);

    router.delete('/:id', handler.remove);

    return router;
};
