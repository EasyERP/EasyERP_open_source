var express = require('express');
var router = express.Router();
var opportunityHandler = require('../handlers/opportunity');

module.exports = function (models) {
    var handler = new opportunityHandler(models);

    /**
     * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/Opportunities/form/:id`
     *
     * This __method__ allows get all opportunities for `form` viewType.
     * @method Opportunities/form/:id
     * @for Opportunity
     * @namespace EasyERP
     */

    /**
     * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/Opportunities/kanban`
     *
     * This __method__ allows get all opportunities for `kanban` viewType.
     * @method Opportunities/kanban
     * @for Opportunity
     * @namespace EasyERP
     */

    /**
     * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/Opportunities/list`
     *
     * This __method__ allows get all opportunities for `list` viewType.
     *
     *#### Response example:
     *        {"data":[{
     *        "_id":"5350db18c3406b2c09000033",
     *        "__v":0,
     *        "attachments":[],
     *        "notes":[],
     *        "convertedDate":"2014-04-18T07:58:16.145Z",
     *        "isConverted":false,
     *        "source":"",
     *        "campaign":"",
     *        "editedBy":{
     *            "date":"2014-04-18T07:58:16.145Z",
     *            "user":{
     *                "_id":"52203e707d4dba8813000003",
     *                "login":"admin"
     *                }
     *            },
     *        "createdBy":{
     *            "date":"2014-04-18T07:58:16.145Z",
     *            "user":{
     *                "_id":"52203e707d4dba8813000003",
     *                "login":"admin"
     *                }
     *            },
     *        "sequence":3,
     *        "groups":{
     *            "group":[],
     *            "users":[],
     *            "owner":"52203e707d4dba8813000003"
     *            },
     *        "whoCanRW":"everyOne",
     *        "workflow":{
     *            "_id":"528cdcb4f3f67bc40b000006",
     *            "name":"New",
     *            "status":"New"
     *            },
     *        "reffered":"",
     *        "optout":false,
     *        "active":true,
     *        "color":"#4d5a75",
     *        "categories":{
     *            "name":"",
     *            "id":""
     *            },
     *        "priority":"P3",
     *        "expectedClosing":"2014-04-24T22:00:00.000Z",
     *        "nextAction":{
     *            "date":"2014-04-17T22:00:00.000Z",
     *            "desc":""
     *            },
     *        "internalNotes":"Applications where the whole universe has been hand drawn on paper sheets and then animated using the stop motion.",
     *        "salesTeam":"5256a08a77285cfc06000009",
     *        "salesPerson":null,
     *        "func":"",
     *        "phones":{
     *            "fax":"",
     *            "phone":"",
     *             "mobile":""
     *            },
     *        "email":"",
     *        "contactName":{
     *            "last":"",
     *            "first":""
     *            },
     *        "address":{
     *            "country":"USA",
     *            "zip":"",
     *            "state":"WA",
     *            "city":"Seattle",
     *            "street":""
     *            },
     *        "customer":{
     *            "_id":"5303bc0fae122c781b0000c2",
     *            "name":{
     *                "last":"Finn",
     *                "first":"Aaron"
     *            },
     *            "fullName":"Aaron Finn",
     *            "id":"5303bc0fae122c781b0000c2"
     *            },
     *        "company":null,
     *        "tempCompanyField":"",
     *        "creationDate":"2014-04-18T07:58:16.145Z",
     *        "expectedRevenue":{
     *            "currency":"$",
     *            "progress":0,
     *            "value":7000
     *            },
     *        "name":"Wildy Jimi",
     *        "isOpportunitie":true
     *        }]}
     *
     * @method Opportunities/list
     * @for Opportunity
     * @namespace EasyERP
     */
    router.get('/getFilterValues', handler.getFilterValues);
    router.get('/:viewType', handler.getByViewType);

    return router;
};