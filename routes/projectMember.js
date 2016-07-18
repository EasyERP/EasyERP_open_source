var ProjectMemberHandler = require('../handlers/projectMembers');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new ProjectMemberHandler(models, event);

    var moduleId = MODULES.EMPLOYEES;
    var accessStackMiddleWare = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleWare);

    /**
     *@api {get} /projectMember/ Request ProjectMember
     *
     * @apiVersion 0.0.1
     * @apiName getProjectMember
     * @apiGroup Project Member
     *
     * @apiParam (?Field=value) {Boolean} showMore=true
     * @apiParam (?Field=value) {Boolean} reset=true
     * @apiParam (?Field=value) {String} project Unique id of Project
     *
     * @apiSuccess {Object} ProjectMember
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
[
     {
         "_id": "5719d7a2b45f39a40eb1724d",
         "projectId": "55b92ad621e4b7c40f000686",
         "employeeId": {
             "_id": "55b92ad221e4b7c40f00005f",
             "name": {
                 "last": "Voloshchuk",
                 "first": "Peter"
             },
             "fullName": "Peter Voloshchuk",
             "id": "55b92ad221e4b7c40f00005f"
         },
         "bonusId": {
             "_id": "55b92ad521e4b7c40f000608",
             "isPercent": true,
             "value": 8,
             "name": "Sales/Usual 8%"
         },
         "projectPositionId": {
             "_id": "570e9a75785753b3f1d9c86e",
             "name": "Sales manager"
         },
         "startDate": null,
         "endDate": null,
         "__v": 0
     }
]
     */
    router.get('/', handler.getList);

    /**
     *@api {post} /projectMember/ Request for creating new ProjectMember
     *
     * @apiVersion 0.0.1
     * @apiName createProjectMember
     * @apiGroup Project Member
     *
     * @apiParamExample {json} Request-Example:
{
    "startDate": null,
    "endDate": null,
    "projectId": "55b92ad621e4b7c40f000686",
    "projectPositionId": "570e9a75785753b3f1d9c870",
    "employeeId": "55b92ad221e4b7c40f000044",
    "bonusId": null
}
     *
     * @apiSuccess {Object} newProjectMember
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "__v": 0,
      "startDate": null,
      "endDate": null,
      "projectId": "55b92ad621e4b7c40f000686",
      "projectPositionId": {
        "_id": "570e9a75785753b3f1d9c870",
        "name": "Marketer"
      },
      "employeeId": {
        "_id": "55b92ad221e4b7c40f000044",
        "name": {
          "last": "Devezenko",
          "first": "Alex"
        },
        "fullName": "Alex Devezenko",
        "id": "55b92ad221e4b7c40f000044"
      },
      "bonusId": null,
      "_id": "57879c513dbafc3d439548e8"
}
     */
    router.post('/', handler.create);

    /**
     *@api {patch} /projectMember/ Request for partly updating ProjectMember
     *
     * @apiVersion 0.0.1
     * @apiName updateProjectMember
     * @apiGroup Project Member
     *
     * @apiParamExample {json} Request-Example:
[
    {
        "endDate": "2016-07-10T20:59:59.999Z",
        "_id": "57879c513dbafc3d439548e8"
    }
]
     *
     * @apiSuccess {Object} status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":"updated"
}
     */
    router.patch('/', handler.patchM);

    /**
     *@api {delete} /projectMember/:id Request for deleting ProjectMember
     *
     * @apiVersion 0.0.1
     * @apiName deleteProjectMember
     * @apiGroup Project Member
     *
     * @apiParam {String} id Unique id of ProjectMember
     *
     * @apiSuccess {Object} SuccessDeletedProjectMember
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "success": {
            "_id": "57879c513dbafc3d439548e8",
            "startDate": null,
            "endDate": "2016-07-10T20:59:59.999Z",
            "projectId": "55b92ad621e4b7c40f000686",
            "projectPositionId": "570e9a75785753b3f1d9c870",
            "employeeId": "55b92ad221e4b7c40f000044",
            "bonusId": null,
            "__v": 0
      }
}
     */
    router.delete('/:id', handler.remove);

    return router;
};
