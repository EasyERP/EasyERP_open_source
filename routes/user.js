var express = require('express');
var router = express.Router();
var UserHandler = require('../handlers/user');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (event, models) {
    'use strict';
    var moduleId = MODULES.USERS;
    var handler = new UserHandler(event, models);
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getAll);
    router.get('/profiles/:id', authStackMiddleware, accessStackMiddleware, handler.getByProfile);

    /**
     *@api {get} /users/forDD Request UsersForDD
     *
     * @apiVersion 0.0.1
     * @apiName getUsersForDD
     * @apiGroup User
     *
     * @apiSuccess {Object} UsersForDD
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
          "data": [
            {
              "_id": "560c099da5d4a2e20ba5068b",
              "login": "AlexSvatuk"
            },
            {
              "_id": "55ba28c8d79a3a3439000016",
              "login": "AndrianaLemko"
            },
            ...
          ]
        }
     */
    router.get('/forDd', authStackMiddleware, handler.getForDd);
    router.get('/current', authStackMiddleware, handler.getById);
    router.get('/totalCollectionLength', authStackMiddleware, accessStackMiddleware, handler.totalCollectionLength);
    router.get('/:id', authStackMiddleware, handler.getById);

    router.post('/', authStackMiddleware, accessStackMiddleware, handler.create);
    router.post('/login', handler.login);
    router.post('/forgotPassword', handler.forgotPassword);
    router.post('/current', authStackMiddleware, accessStackMiddleware, handler.putchModel);
    router.patch('/:id', authStackMiddleware, accessStackMiddleware, handler.putchModel);
    router.patch('/current/:id', authStackMiddleware, accessStackMiddleware, handler.putchModel);

    router.delete('/:id', authStackMiddleware, accessStackMiddleware, handler.remove);
    router.delete('/', authStackMiddleware, accessStackMiddleware, handler.bulkRemove);

    return router;
};
