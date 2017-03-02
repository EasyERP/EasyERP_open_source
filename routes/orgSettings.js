var express = require('express');
var router = express.Router();
var OrgSettingsHandler = require('../handlers/orgSettings');
var authStackMiddleware = require('../helpers/checkAuth');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (models) {
    var handler = new OrgSettingsHandler(models);

    router.use(authStackMiddleware);

    router.get('/', handler.getSettings);

    router.put('/:id', handler.update);

    router.post('/', handler.create);
    router.post('/sendMailFromHelp', multipartMiddleware, handler.sendMessageFromHelp);
    router.patch('/:id', handler.update);

    router.delete('/:id', handler.remove);

    return router;
};
