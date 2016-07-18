var express = require('express');
var router = express.Router();
var ProductHandler = require('../handlers/product');
var authStackMiddleware = require('../helpers/checkAuth');
var MODULES = require('../constants/modules');

module.exports = function (models) {
    var handler = new ProductHandler(models);
    var moduleId = MODULES.PRODUCT;
    var accessStackMiddleware = require('../helpers/access')(moduleId, models);

    router.use(authStackMiddleware);
    router.use(accessStackMiddleware);


    /**
     *@api {get} /products/ Request Products
     *
     * @apiVersion 0.0.1
     * @apiName getProducts
     * @apiGroup Product
     *
     * @apiParam (?Field=value) {Boolean} balanceVisible=true
     * @apiParam (?Field=value) {Boolean} forSales=true
     * @apiParam (?Field=value) {Boolean} isPaid=true
     * @apiParam (?Field=value) {Boolean} paidAndNotApproved=true
     * @apiParam (?Field=value) {Boolean} notAddItem=true
     *
     * @apiSuccess {Object} Productss
     * @apiSuccessExample Success-Response:
HTTP/1.1 200 OK
{
    "success": [
        {
            "_id": "5540d528dacb551c24000003",
            "__v": 0,
            "editedBy": {
                "date": "2015-10-30T14:18:42.379Z",
                "user": "52203e707d4dba8813000003"
            },
            "createdBy": {
                "date": "2015-04-29T12:57:12.785Z",
                "user": null
            },
            "creationDate": "2015-04-29T12:57:12.785Z",
            "groups": {
                "group": [],
                "users": [],
                "owner": "560c099da5d4a2e20ba5068b"
            },
            "whoCanRW": "everyOne",
            "workflow": null,
            "accounting": {
                "category": {
                    "name": "",
                    "_id": null
                }
            },
            "info": {
                "description": "",
                "barcode": "",
                "isActive": true,
                "salePrice": 0,
                "productType": "Service"
            },
            "name": "IT services",
            "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
            "canBePurchased": true,
            "eventSubscription": true,
            "canBeExpensed": true,
            "canBeSold": true,
            "wTrack": null
        },
        ...
    ]
}
     */
    router.get('/', handler.getForView);
    router.get('/getProductsAlphabet', handler.getProductsAlphabet);
    router.get('/getProductsTypeForDd', handler.getProductsTypeForDd);
    router.get('/totalCollectionLength', handler.totalCollectionLength);
    router.get('/getProductsImages', handler.getProductsImages);
    // router.get('/exportToXlsx',handler.exportToXlsx);
    // router.get('/exportToCsv',handler.exportToCsv);
   
    router.post('/', handler.create);
    /* router.post('/uploadProductFiles', multipartMiddleware, handler.uploadProductFiles);*/// FixMe
    router.patch('/:_id', handler.productsUpdateOnlySelectedFields);
   
    router.delete('/:_id', handler.removeProduct);

    return router;
};
