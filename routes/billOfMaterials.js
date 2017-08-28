var express = require('express');
var router = express.Router();
var BillOfMaterialsHandler = require('../handlers/billOfMaterials');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new BillOfMaterialsHandler(models, event);
    var moduleId = MODULES.ORDERS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);

    router.post('/', accessStackMiddleware, handler.create);

    router.get('/', accessStackMiddleware, handler.getBillOfMaterials);

    router.get('/byProduct', accessStackMiddleware, handler.getByProductId);

    router.get('/:id', accessStackMiddleware, handler.getById);

    router.patch('/:id',accessStackMiddleware,handler.update);

    router.delete('/',accessStackMiddleware,handler.delete);


    return router;
};
