/**
 * Created by Liliya_Pikiner on 7/1/2015.
 */
var express = require('express');
var router = express.Router();

var bonusTypeHandler = require('../handlers/bonusType');

module.exports = function (models) {
    var handler = new bonusTypeHandler(models);
    router.get('/list', function (req, res) {
            handler.getList(req, res);
        }
    );

    router.get('/list/totalCollectionLength', handler.totalCollectionLength);
    router.post('/', handler.create);

    router.patch('/', handler.patchM);
    router.delete('/:_id', function (req, res) {
        var id = req.param('_id');
        handler.remove(req, res, id);
    });
    return router;
};