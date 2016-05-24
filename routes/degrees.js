/**
 * Created by liliy on 04.02.2016.
 */
/**
 * Created by liliy on 04.02.2016.
 */
var express = require('express');
var router = express.Router();
var Handler = require('../handlers/degrees');

module.exports = function (models) {
    'use strict';
    var handler = new Handler(models);

    router.get('/', handler.getDegrees);
    router.put('/:id', handler.update);
    router.post('/', handler.create);
    router.delete('/:id', handler.remove);


    return router;
};