var express = require('express');
var router = express.Router();
var PayrollComponentTypesHandler = require('../handlers/payrollComponentTypes');
var authStackMiddleware = require('../helpers/checkAuth');

module.exports = function (models) {
    var handler = new PayrollComponentTypesHandler(models);
    var moduleId = 103;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);
    
    router.get('/forDd/:type', handler.getForDd);
    router.get('/:viewType', function (req, res, next) {
        var viewType = req.params.viewType;
        switch (viewType) {
            case 'form':
                handler.getById(req, res, next);
                break;
            default:
                handler.getForView(req, res, next);
        }
    });

    /**
     *@api {post} /payrollComponentTypes/ Request for creating new PayrollComponentTypes
     *
     * @apiVersion 0.0.1
     * @apiName createPayrollComponentTypes
     * @apiGroup Payroll Component Types
     *
     * @apiParamExample {json} Request-Example:
{
    "name": "PayrollEarningsType",
    "description": "",
    "type": "earnings"
}
     *
     * @apiSuccess {Object} PayrollComponentTypes
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "__v": 0,
    "_id": "5788c71e62c88999010ca7d0",
    "description": "",
    "type": "earnings",
    "name": "PayrollEarningsType"
}
     */
    router.post('/', handler.create);

    router.delete('/:id', handler.delete);

    /**
     *@api {patch} /payrollComponentTypes/:id Request for partly updating PayrollComponentType
     *
     * @apiVersion 0.0.1
     * @apiName updatePayrollComponentType
     * @apiGroup Payroll Component Types
     *
     * @apiParam {String} id Unique id of PayrollComponentType
     * @apiParamExample {json} Request-Example:
{
    "name": "PayrollEarningsType",
    "description": "It is comment",
    "type": "earnings"
}
     *
     * @apiSuccess {Object} updatedPayrollComponentType
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "_id": "5788c71e62c88999010ca7d0",
    "__v": 0,
    "description": "",
    "type": "earnings",
    "name": "PayrollEarningsType"
}
     */
    router.patch('/:id', handler.update);

    return router;
};
