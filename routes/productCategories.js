var express = require('express');
var router = express.Router();
var CategoryHandler = require('../handlers/productCategories');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models, event) {
    var handler = new CategoryHandler(models, event);

    var moduleId = MODULES.PRODUCTSETTINGS;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);
    var accessDeleteStackMiddleware = require('../helpers/checkDelete');

    function accessDeleteStackMiddlewareFunction(req, res, next) {
        accessDeleteStackMiddleware(req, res, next, models, 'productCategories', event);
    }

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);


    /**
     *@api {get} /category/ Request ProductCategories
     *
     * @apiVersion 0.0.1
     * @apiName getProductCategories
     * @apiGroup Product Categories
     *
     * @apiSuccess {Object} ProductCategories
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "data": [
        {
          "_id": "564591f9624e48551dfe3b23",
          "__v": 0,
          "sequence": 0,
          "nestingLevel": null,
          "editedBy": {
            "date": "2016-07-15T12:33:53.024Z",
            "user": "52203e707d4dba8813000003"
          },
          "createdBy": {
            "date": "2015-11-13T07:32:09.792Z",
            "user": "52203e707d4dba8813000003"
          },
          "users": [

          ],
          "parent": null,
          "fullName": "All",
          "name": "All"
        },
         ...
      ]
}
     */
    router.get('/', handler.getForDd);

    /**
     *@api {get} /category/getExpenses/ Request Expenses
     *
     * @apiVersion 0.0.1
     * @apiName getExpenses
     * @apiGroup Product Categories
     *
     * @apiSuccess {Object} Expenses
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
[
     {
         "_id": "5645925f624e48551dfe3b26",
         "__v": 0,
         "sequence": 4,
         "nestingLevel": 1,
         "editedBy": {
             "date": "2016-07-15T12:44:29.554Z",
             "user": "52203e707d4dba8813000003"
         },
         "createdBy": {
             "date": "2015-11-13T07:33:51.900Z",
             "user": "52203e707d4dba8813000003"
         },
         "users": [],
         "parent": {
             "_id": "56459202624e48551dfe3b24",
             "__v": 0,
             "sequence": 0,
             "nestingLevel": null,
             "editedBy": {
                 "date": "2016-07-15T12:44:29.553Z",
                 "user": "52203e707d4dba8813000003"
             },
             "createdBy": {
                 "date": "2015-11-13T07:32:18.495Z",
                 "user": "52203e707d4dba8813000003"
             },
             "users": [],
             "parent": "564591f9624e48551dfe3b23",
             "fullName": "All / Expenses",
             "name": "Expenses"
         },
         "fullName": "All / Expenses / Bonus Card",
         "name": "Bonus Card"
     },
     ...
]
     */
    router.get('/getExpenses', handler.getExpenses);
    router.get('/posterity/:id', handler.getProsterityForAncestor);
    router.get('/:id', handler.getById);

    /**
     *@api {get} /category/:id Request ProductCategory
     *
     * @apiVersion 0.0.1
     * @apiName getProductCategory
     * @apiGroup Product Categories
     *
     * @apiParam {String} id Unique id of ProductCategory
     *
     * @apiSuccess {Object} ProductCategory
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "_id": "5645925f624e48551dfe3b26",
      "__v": 0,
      "sequence": 4,
      "nestingLevel": 1,
      "editedBy": {
        "date": "2016-07-15T12:34:44.553Z",
        "user": "52203e707d4dba8813000003"
      },
      "createdBy": {
        "date": "2015-11-13T07:33:51.900Z",
        "user": "52203e707d4dba8813000003"
      },
      "users": [

      ],
      "parent": {
        "_id": "56459202624e48551dfe3b24",
        "__v": 0,
        "sequence": 0,
        "nestingLevel": null,
        "editedBy": {
          "date": "2016-07-15T12:34:44.548Z",
          "user": "52203e707d4dba8813000003"
        },
        "createdBy": {
          "date": "2015-11-13T07:32:18.495Z",
          "user": "52203e707d4dba8813000003"
        },
        "users": [

        ],
        "parent": "564591f9624e48551dfe3b23",
        "fullName": "All / Expenses",
        "name": "Expenses"
      },
      "fullName": "All / Expenses / Bonus Card",
      "name": "Bonus Card"
}
     */
   // router.get('/:id', handler.getForDd);

    /**
     *@api {post} /category/ Request for creating new ProductCategory
     *
     * @apiVersion 0.0.1
     * @apiName createProductCategory
     * @apiGroup Product Categories
     *
     * @apiParamExample {json} Request-Example:
{
    "name": "Test Department",
    "parent": "564591f9624e48551dfe3b23",
    "nestingLevel": null,
    "sequence": 0,
    "fullName": "All / Test Department"
}
     *
     * @apiSuccess {Object} NewProductCategory
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
      "__v": 0,
      "_id": "5788dc525e61536b10965959",
      "sequence": 0,
      "nestingLevel": null,
      "editedBy": {
        "date": "2016-07-15T12:51:30.980Z",
        "user": "52203e707d4dba8813000003"
      },
      "createdBy": {
        "date": "2016-07-15T12:51:30.980Z",
        "user": "52203e707d4dba8813000003"
      },
      "users": [

      ],
      "parent": "564591f9624e48551dfe3b23",
      "fullName": "All / Test Department",
      "name": "Test Department"
}
     */
    router.post('/', handler.create);

    /**
     *@api {put} /category/:id Request for updating ProductCategory
     *
     * @apiVersion 0.0.1
     * @apiName updateProductCategory
     * @apiGroup Product Categories
     *
     * @apiParam {String} id Unique id of ProductCategory
     * @apiParamExample {json} Request-Example:
{
      "validate": false,
      "_id": "5788dc525e61536b10965959",
      "__v": 0,
      "sequence": 0,
      "nestingLevel": 2,
      "editedBy": {
        "date": "2016-07-15T12:51:30.980Z",
        "user": "52203e707d4dba8813000003"
      },
      "createdBy": {
        "date": "2016-07-15T12:51:30.980Z",
        "user": "52203e707d4dba8813000003"
      },
      "users": [

      ],
      "parent": "5645925f624e48551dfe3b26",
      "fullName": "All / Test Department / Test Department",
      "name": "Test Department"
}
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":"Category updated success"
}
     */
    router.put('/:id', handler.update);

    /**
     *@api {delete} /category/:id Request for deleting ProductCategory
     *
     * @apiVersion 0.0.1
     * @apiName deleteProductCategory
     * @apiGroup Product Categories
     *
     * @apiParam {String} id Unique id of ProductCategory
     *
     * @apiSuccess {Object} Status
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success":"Category was removed"
}
     */
    router.delete('/:id', accessDeleteStackMiddlewareFunction, handler.remove);

    return router;
};
