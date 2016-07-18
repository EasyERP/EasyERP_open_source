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
HTTP/1.1 200 OK
{
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
HTTP/1.1 200 OK
{
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

    /**
     * @api {post} /profiles/ Request for creating new Profile
     *
     * @apiVersion 0.0.1
     * @apiName createProfile
     * @apiGroup Profiles
     *
     * @apiParamExample {json} Request-Example:
{
      "profileName": "Eduardo",
      "profileDescription": "",
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
      ]
}
     *
     * @apiSuccess {Object} createdProfile
     * @apiSuccessExample Success-Response:
HTTP/1.1 201 Created
{
      "success": "Profile Saved",
      "data": {
        "__v": 0,
        "_id": 1468587887000,
        "profileAccess": [
          {
            "module": 1,
            "_id": "52b0254ead08de381e000002",
            "access": {
              "del": false,
              "editWrite": false,
              "read": false
            }
          },
          ...
        ],
        "profileDescription": "",
        "profileName": "Eduardo"
      },
      "id": 1468587887000
}
     */
    router.post('/', authStackMiddleware, accessStackMiddleware, handler.createProfile);

    /**
     * @api {put} /profiles/:id Request for updating Profile
     *
     * @apiVersion 0.0.1
     * @apiName updateProfile
     * @apiGroup Profiles
     *
     * @apiParam {Number} id Unique id of Profile
     * @apiParamExample {json} Request-Example:
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
            "read": true
          }
        },
        ...
      ],
      "profileDescription": "No description",
      "profileName": "Finance"
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":"Profile updated"
}
     */
    router.put('/:_id', authStackMiddleware, accessStackMiddleware, handler.updateProfile);

    /**
     * @api {delete} /profiles/:id Request for deleting Profile
     *
     * @apiVersion 0.0.1
     * @apiName deleteProfile
     * @apiGroup Profiles
     *
     * @apiParam {Number} id Unique id of Profile
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":"Profile removed"
}
     */
    router.delete('/:_id', authStackMiddleware, accessStackMiddleware, handler.removeProfile);

    return router;
};
