var express = require('express');
var router = express.Router();
var ProfilesHandler = require('../handlers/profiles');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    'use strict';
    var moduleId = MODULES.PROFILES;
    var handler = new ProfilesHandler(models);
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    /**
     * @api {get} /profiles/ Request Profiles
     *
     * @apiVersion 0.0.1
     * @apiName getProfiles
     * @apiGroup Profiles
     *
     * @apiParam (Field=value) {Number} mid=39
     *
     * @apiSuccess {Object} Profiles
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
          "data": [
            {
              "_id": 1438768659000,
              "__v": 0,
              "profileAccess": [
                {
                  "module": {
                    "_id": 1,
                    "__v": 0,
                    "attachments": [

                    ],
                    "link": false,
                    "mname": "Settings",
                    "parrent": null,
                    "sequence": 1000,
                    "visible": true,
                    "ancestors": [

                    ],
                    "href": "Settings"
                  },
                  "_id": "52b0254ead08de381e000002",
                  "access": {
                    "del": false,
                    "editWrite": false,
                    "read": false
                  }
                },
                ...
                ],
                profileDescription": "test",
                "profileName": "test"
              },
              ...
            ]
          }
     */
    router.get('/', authStackMiddleware, accessStackMiddleware, handler.getProfile);

    /**
     * @api {get} /profiles/forDd Request ProfilesForDD
     *
     * @apiVersion 0.0.1
     * @apiName getProfilesForDD
     * @apiGroup Profiles
     *
     * @apiSuccess {Object} ProfilesForDD
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
    "data": [
        {
            "_id": 1438768659000,
            "profileName": "Finance"
        },
        {
            "_id": 1438158808000,
            "profileName": "HR"
        },
        {
            "_id": 1463489263000,
            "profileName": "LeadGen"
        },
        {
            "_id": 1445088919000,
            "profileName": "Marketing"
        },
        {
            "_id": 1444991193000,
            "profileName": "PM"
        },
        {
            "_id": 1438158771000,
            "profileName": "SalesAccount"
        },
        {
            "_id": 1438325949000,
            "profileName": "Usual"
        },
        {
            "_id": 1387275598000,
            "profileName": "admin"
        },
        {
            "_id": 1387275504000,
            "profileName": "banned"
        },
        {
            "_id": 1445089150000,
            "profileName": "test"
        }
    ]
}
     */
    router.get('/forDd', authStackMiddleware, accessStackMiddleware, handler.getProfileForDd);

    router.post('/', authStackMiddleware, accessStackMiddleware, handler.createProfile);
    router.put('/:_id', authStackMiddleware, accessStackMiddleware, handler.updateProfile);
   
    router.delete('/:_id', authStackMiddleware, accessStackMiddleware, handler.removeProfile);

    return router;
};
