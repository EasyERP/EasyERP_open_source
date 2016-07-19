var express = require('express');
var router = express.Router();
var Handler = require('../handlers/campaigns');

module.exports = function (models) {
    'use strict';
    var handler = new Handler(models);

/**
 *@api {get} /Campaigns/ Request Campaigns for dropDown
 *
 * @apiVersion 0.0.1
 * @apiName getCampaigns
 * @apiGroup Campaign
 *
 * @apiSuccess {Object} Campaigns
 * @apiSuccessExample Success-Response:
HTTP/1.1 304 Not Modified
{
    "data": [
        {
            "_id": "cpc",
            "__v": 0,
            "sequence": 0,
            "name": "cpc"
        },
        {
            "_id": "email",
            "attachments": [
            
            ],
            "sequence": 0,
            "name": "Email"
        },
        {
            "_id": "newsletter",
            "attachments": [
            
            ],
            "sequence": 0,
            "name": "Newsletter"
        },
        {
            "_id": "telesales",
            "attachments": [
            
            ],
            "sequence": 0,
            "name": "Telesales"
        },
        {
            "_id": "testmain",
            "__v": 0,
            "sequence": 0,
            "name": "testmain"
        },
        {
            "_id": "web",
            "attachments": [
            
            ],
            "sequence": 0,
            "name": "Web"
        }
    ]
}
 */

router.get('/', handler.getForDd);

return router;
};
