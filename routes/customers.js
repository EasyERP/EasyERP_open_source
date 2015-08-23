var express = require('express');
var router = express.Router();
var CustomerHandler = require('../handlers/customer');

module.exports = function (models) {
    var handler = new CustomerHandler(models);

    function checkAuth(req, res, next){
        var error;

        if(!req.session || !req.session.loggedIn){
            error = new Error("Not Authorized");
            error.status = 401;

            return next(error);
        }
        next();
    }

    /**
     * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/customers`
     *
     * This __method__ allows get all customers based on `type`
     *#### Response example:
     *        {"data":
     *        [{
     *        "_id":"55ba0301d79a3a343900000d",
     *        "__v":0,
     *        "companyInfo":{
     *            "industry":null
     *            },
     *        "editedBy":{
     *            "date":"2015-07-30T10:57:05.119Z",
     *            "user":"55ba00e9d79a3a343900000c"
     *            },
     *        "createdBy":{
     *            "date":"2015-07-30T10:57:05.119Z",
     *            "user":"55ba00e9d79a3a343900000c"
     *            },
     *        "history":[],
     *        "attachments":[],
     *        "notes":[],
     *        "groups":{
     *            "group":[],
     *            "users":[],
     *            "owner":"55b9fbcdd79a3a3439000007"
     *            },
     *        "whoCanRW":"everyOne",
     *        "social":{
     *           "LI":"",
     *            "FB":""
     *            },
     *        "color":"#4d5a75",
     *        "relatedUser":null,
     *        "salesPurchases":{
     *            "receiveMessages":0,
     *            "language":"English",
     *            "reference":"",
     *            "active":false,
     *            "implementedBy":null,
     *            "salesTeam":null,
     *            "salesPerson":null,
     *            "isSupplier":false,
     *            "isCustomer":false
     *            },
     *        "title":"",
     *        "internalNotes":"",
     *        "contacts":[],
     *        "phones":{
     *            "fax":"",
     *            "mobile":"",
     *            "phone":""
     *            },
     *        "skype":"",
     *        "jobPosition":"",
     *        "website":"hashplay.net",
     *        "address":{
     *            "country":"United States",
     *            "zip":"94107",
     *            "state":"California",
     *            "city":"San Francisco",
     *            "street":"350 Townsend St. 755"
     *            },
     *        "timezone":"UTC",
     *        "department":null,
     *        "company":null,
     *        "email":"contact@hashplay.tv",
     *        "imageSrc":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
     *        "name":{
     *            "last":"",
     *            "first":"#Play"
     *            },
     *        "isOwn":false,
     *        "type":"Company",
     *        "fullName":"#Play ",
     *        "id":"55ba0301d79a3a343900000d"}
     *        ]}
     * @method customers/
     * @for Customer
     * @namespace EasyERP
     */


    router.get('/', checkAuth, handler.getAll);

    /**
     * This __method__ allows get customer by _id
     *
     * @method customers/:id
     * @for Customer
     * @namespace EasyERP
     */
    router.get('/:id', checkAuth, handler.getById);
    //router.post('/', handler.create);

    return router;
};