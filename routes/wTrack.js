

var express = require('express');
var router = express.Router();
var wTrackHandler = require('../handlers/wTrack');

module.exports = function (event, models) {
    var handler = new wTrackHandler(event, models);

    router.get('/getForProjects', handler.getForProjects);
    router.get('/exportToXlsx',handler.exportToXlsx);
    router.get('/exportToCsv',handler.exportToCsv);
    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/:viewType', handler.getByViewType);
    router.post('/', handler.create);
    router.post('/generateWTrack', handler.generateWTrack);
    router.delete('/:id', handler.remove);
    router.patch('/', handler.putchBulk);
    router.patch('/:id', handler.putchModel);
   /* router.put('/:id', handler.updateModel);*/

    return router;
};