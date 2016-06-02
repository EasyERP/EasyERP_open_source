var projectMemberHandler = require('../handlers/projectMembers');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new projectMemberHandler(models, event);

    var moduleId = MODULES.EMPLOYEES;
    var accessStackMiddlWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddlWare);

    router.post('/', handler.create);
    router.get('/', handler.getList);
    router.patch('/', handler.patchM);
    router.delete('/:id', handler.remove);

    return router;
};