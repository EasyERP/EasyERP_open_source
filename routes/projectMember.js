var ProjectMemberHandler = require('../handlers/projectMembers');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new ProjectMemberHandler(models, event);

    var moduleId = MODULES.EMPLOYEES;
    var accessStackMiddleWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleWare);

    router.post('/', handler.create);
    router.get('/', handler.getList);
    router.patch('/', handler.patchM);
    router.delete('/:id', handler.remove);

    return router;
};
