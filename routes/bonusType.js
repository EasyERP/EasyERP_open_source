var BonusTypeHandler = require('../handlers/bonusType');
var express = require('express');
var router = express.Router();
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new BonusTypeHandler(models);
    var moduleId = MODULES.BONUSTYPE;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);

    /**
     *@api {get} /applications/ Request Applications
     *
     * @apiVersion 0.0.1
     * @apiName getApplications
     * @apiGroup Applications
     *
     * @apiParam (?Field=value) {String} workflowId Workflow unique ID.
     * @apiParam (?Field=value) {String} viewType="kanban" Type of View.
     *
     * @apiSuccess {Object} Applications which belong to some workflow
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     {
"data": [
   {
       "_id": "56e6b7d7977124d34db5829c",
       "sequence": 0,
       "editedBy": {
           "date": "2016-07-04T14:48:13.217Z"
       },
       "workflow": {
           "_id": "528ce61bf3f67bc40b000019"
       },
       "jobPosition": {
           "_id": "566ee0c68453e8b464b70b72",
           "name": "Junior Ruby on Rails"
       },
       "name": {
           "last": "Bachynska",
           "first": "Roksana"
       },
       "fullName": "Roksana Bachynska",
       "id": "56e6b7d7977124d34db5829c"
   },
   ...
],
"workflowId": "528ce61bf3f67bc40b000019",
"time": 191,
"fold": false
}
     */
    router.get('/', handler.getList);
    router.get('/getForDD', handler.getForDD);

    router.post('/', handler.create);
    router.patch('/', handler.patchM);

    router.delete('/:_id', handler.remove);
    router.delete('/', handler.bulkRemove);

    return router;
};
