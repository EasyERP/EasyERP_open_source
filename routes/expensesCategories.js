var express = require('express');
var router = express.Router();
var Handler = require('../handlers/expensesCategories');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new Handler(models);

    router.use(authStackMiddleware);

    router.get('/', handler.get);
    router.get('/getAll', handler.getAll);
    /* router.get('/getForDd', handler.getForDd);*/

    router.patch('/:id', handler.update);

    router.post('/', handler.create);

    router.delete('/:id', handler.remove);

    return router;
};

