var mongoose = require('mongoose');

var Customers = function (models) {
    /**
     * @module Customer
     */
    var access = require("../Modules/additions/access.js")(models);
    var CustomerSchema = mongoose.Schemas['Customer'];

    var _ = require('../node_modules/underscore');

    var CONSTANTS = require('../constants/mainConstants');

    var exportHandlingHelper = require('../helpers/exporter/exportHandlingHelper');
    var exportMap = require('../helpers/csvMap').Customers.aliases;
    exportHandlingHelper.addExportFunctionsToHandler(this, function (req) {
        return models.get(req.session.lastDb, 'Customer', CustomerSchema)
    }, exportMap);

    this.getSuppliersForDD = function (req, res, next) {
        /**
         * __Type__ `GET`
         *
         * This __method__ allows get _Suppliers_
         *
         * @example Request example:
         *         http://192.168.88.133:8089/supplier
         *
         * @method supplier
         * @instance
         */
        var query = models.get(req.session.lastDb, 'Customers', CustomerSchema).find();

        query.select('_id name ');
        query.where({'salesPurchases.isSupplier': true});
        query.sort({'name': 1});
        query.exec(function (err, suppliers) {
            if (err) {
                next(err);
            } else {
                res.status(200).send({data: suppliers});
            }
        });
    };

    this.getFilterValues = function (req, res, next) {
        var opportunity = models.get(req.session.lastDb, 'Customers', CustomerSchema);

        opportunity.aggregate([
            {
                $group: {
                    _id    : null,
                    name   : {
                        $addToSet: {
                            name: '$name.first',
                            _id : '$_id'
                        }
                    },
                    country: {
                        $addToSet: '$address.country'
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            _.map(result[0], function (value, key) {
                switch (key) {
                    case 'name':
                        result[0][key] = {
                            displayName: 'Name',
                            values     : _.sortBy(value, 'name')
                        };
                        break;
                    case  'country':
                        result[0][key] = {
                            displayName: 'Country',
                            values     : _.sortBy(value, function (num) {
                                return num
                            })
                        };
                        break;
                }
            });

            result[0]['services'] = {
                displayName: 'Services',
                values     : [{displayName: 'Supplier', _id: 'isSupplier'}, {
                    displayName: 'Customer',
                    _id        : 'isCustomer'
                }]
            };

            res.status(200).send(result);
        });
    };

    this.getAll = function (req, res, next) {
        /**
         * __Type__ `GET`
         *
         * Base ___url___ for build __requests__ is `http://192.168.88.133:8089/customers`
         *
         * This __method__ allows get all customers based on `type`. Type can be `Company` or `Person`.
         * @example Request example:
         *
         *         http://192.168.88.133:8089/customers
         *
         * @example Response example:
         * [
         *    {
         *        "_id": "55b92ad521e4b7c40f00060c",
         *        "ID": 1,
         *        "dateBirth": null,
         *        "companyInfo": {
         *            "size": null,
         *            "industry": null
         *        },
         *        "editedBy": {
         *            "date": "2015-08-18T13:38:34.988Z",
         *            "user": {
         *                "_id": "52203e707d4dba8813000003",
         *                "login": "admin",
         *                "id": "52203e707d4dba8813000003"
         *            }
         *        },
         *        "createdBy": {
         *            "date": "2015-07-29T19:34:45.989Z",
         *            "user": {
         *                "_id": "52203e707d4dba8813000003",
         *                "login": "admin",
         *                "id": "52203e707d4dba8813000003"
         *            }
         *        },
         *        "history": [],
         *        "attachments": [],
         *        "notes": [],
         *        "groups": {
         *            "group": [],
         *            "users": [],
         *            "owner": "55ba28c8d79a3a3439000016"
         *        },
         *        "whoCanRW": "everyOne",
         *        "social": {
         *            "LI": "",
         *            "FB": ""
         *        },
         *        "color": "#4d5a75",
         *        "relatedUser": null,
         *        "salesPurchases": {
         *            "receiveMessages": 0,
         *            "language": "",
         *            "reference": "",
         *            "active": false,
         *            "implementedBy": null,
         *            "salesTeam": null,
         *            "salesPerson": null,
         *            "isSupplier": false,
         *            "isCustomer": true
         *        },
         *        "title": "",
         *        "internalNotes": "",
         *        "contacts": [],
         *        "phones": {
         *            "fax": "",
         *            "mobile": "",
         *            "phone": ""
         *        },
         *        "skype": "",
         *        "jobPosition": null,
         *        "website": "",
         *        "address": {
         *            "country": "",
         *            "zip": "",
         *            "state": "",
         *            "city": "",
         *            "street": ""
         *        },
         *        "timezone": "UTC",
         *        "department": null,
         *        "company": null,
         *        "email": "",
         *        "imageSrc": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
         *        "name": {
         *            "last": "Blinov",
         *            "first": "Alexey"
         *        },
         *        "isOwn": false,
         *        "type": "Person",
         *        "fullName": "Alexey Blinov",
         *        "id": "55b92ad521e4b7c40f00060c"
         *        }
         *    ]
         * @method customers
         * @instance
         */

        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var query = req.query;
        var type = query.type || 'Person';
        var count = query.count || CONSTANTS.MOBILE_DEFAULT_COUNT_PER_LIST;
        var page = query.page || 1;
        var queryObject = {};

        var skip = (page - 1) * count;

        queryObject.type = type;

        access.getReadAccess(req, req.session.uId, 50, function (access) {
            if (access) {
                Model
                    .find(queryObject)
                    .skip(skip)
                    .limit(count)
                    .populate('company')
                    .populate('department')
                    .populate('salesPurchases.salesPerson', '_id name')
                    .populate('salesPurchases.salesTeam', '_id departmentName')
                    .populate('createdBy.user', 'login')
                    .populate('editedBy.user', 'login')
                    .exec(function (err, customers) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(customers);
                    });
            } else {
                res.send(403);
            }
        });
    };

    this.getById = function (req, res, next) {
        /**
         * __Type__ `GET`
         *
         * This __method__ allows get _Customer_ by _id
         *
         * @example Request example:
         *         http://192.168.88.133:8089/customers/55b92ad521e4b7c40f00061d
         *
         * @method customer
         * @param {String} id - Id of Customer
         * @instance
         */
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var id = req.params.id;

        access.getReadAccess(req, req.session.uId, 50, function (access) {
            if (access) {
                Model
                    .findById(id)
                    .populate('company')
                    .populate('department')
                    .populate('salesPurchases.salesPerson', '_id name')
                    .populate('salesPurchases.salesTeam', '_id departmentName')
                    .populate('createdBy.user', 'login')
                    .populate('editedBy.user', 'login')
                    .exec(function (err, customer) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(customer);
                    });
            } else {
                res.send(403);
            }
        });
    };

};

module.exports = Customers;