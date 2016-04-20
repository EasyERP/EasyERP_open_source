var projectMemberHandler = require('../handlers/projectMembers');
var express = require('express');
var router = express.Router();

module.exports = function (models, event) {
    var handler = new projectMemberHandler(models, event);

    router.post('/', handler.create);
    router.get('/', handler.getList);
    router.patch('/', handler.patchM);
    router.delete('/:id', handler.remove);

    return router;
};