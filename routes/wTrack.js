var express = require('express');
var router = express.Router();
var WTrackHandler = require('../handlers/wTrack');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var handler = new WTrackHandler(event, models);
    var moduleId = MODULES.WTRACK;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware); // added generall check on auth

    router.get('/getForProjects', accessStackMiddleware, handler.getForProjects);
    // router.get('/exportToXlsx',handler.exportToXlsx);
    // router.get('/exportToCsv',handler.exportToCsv);
    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/dash', handler.getForDashVacation);
    router.get('/', accessStackMiddleware, handler.getByViewType);
    router.post('/', accessStackMiddleware, handler.create);
    router.post('/generateWTrack', accessStackMiddleware, handler.generateWTrack);
    router.delete('/:id', accessStackMiddleware, handler.remove);
    router.patch('/', accessStackMiddleware, handler.putchBulk);
    router.patch('/:id', accessStackMiddleware, handler.putchModel);
   /* router.put('/:id', handler.updateModel);*/

    return router;
};
