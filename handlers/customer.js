var mongoose = require('mongoose');

var Customers = function (models, event) {
    /**
     * @module Customer
     */
    'use strict';

    var access = require("../Modules/additions/access.js")(models);
    var CustomerSchema = mongoose.Schemas.Customer;
    var _ = require('../node_modules/underscore');
    var CONSTANTS = require('../constants/mainConstants');
    var exportDecorator = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').Customers;
    var accessRoll = require("../helpers/accessRollHelper.js")(models);
    var async = require('async');
    var fs = require('fs');

    exportDecorator.addExportFunctionsToHandler(this, function (req) {
        return models.get(req.session.lastDb, 'Customer', CustomerSchema);
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

    this.getTotalCount = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var data = req.query;
        var optionsObject = {};
        var filter = data.filter || {};
        var waterfallTasks;
        var mid = req.header.mid || 50;
        var accessRollSearcher;
        var contentSearcher;
        var query = {};
        var response = {};

        response.showMore = false;

        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                optionsObject.$or = caseFilter(filter);
            } else {
                optionsObject.$and = caseFilter(filter);
            }
        }

        access.getEditWritAccess(req, req.session.uId, mid, function (access) {
            if (access) {

                accessRollSearcher = function (cb) {
                    accessRoll(req, Model, cb);
                };

                contentSearcher = function (ids, cb) {
                    var queryObject = {};

                    queryObject.$and = [];

                    if (optionsObject.$and.length) {
                        queryObject.$and.push(optionsObject);
                    }

                    queryObject.$and.push({_id: {$in: ids}});

                    query = Model.find(queryObject);

                    query.count(function (err, _res) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, _res);
                    });

                };
                waterfallTasks = [accessRollSearcher, contentSearcher];

                async.waterfall(waterfallTasks, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    if (data.currentNumber && data.currentNumber < result) {
                        response.showMore = true;
                    }

                    response.count = result;

                    res.status(200).send(response);
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.getFilterValues = function (req, res, next) {
        var Customers = models.get(req.session.lastDb, 'Customers', CustomerSchema);

        Customers.aggregate([
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
                                return num;
                            })
                        };
                        break;
                }
            });

            result[0].services = {
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

    this.getCustomers = function (req, res, next) {
        var Customers = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var query = req.query;
        var type = query.type || 'Person';
        var count = query.count || 100;
        var page = query.page || 1;
        var queryObject = {};

        var skip = (page - 1) * count;

        queryObject.type = type;

        access.getReadAccess(req, req.session.uId, 50, function (access) {
            if (access) {
                Customers
                    .find(queryObject)
                    .skip(skip)
                    .limit(count)
                    .sort({"editedBy.date": 1})
                    .exec(function (err, customers) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({data: customers});
                    });
            } else {
                res.send(403);
            }
        });
    };

    this.getFilterPersonsForMiniView = function (req, res, next) {
        var Customers = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var optionsObject = {};
        var data = req.query;
        var accessRollSearcher;
        var contentSearcher;
        var waterfallTasks;

        optionsObject.$and = [];

        if (data.letter) {
            optionsObject.$and.push({type: 'Person'});
            optionsObject.$and.push({'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*')});
        } else {
            optionsObject.$and.push({type: 'Person'});
        }

        access.getEditWritAccess(req, req.session.uId, mid, function (access) {
            if (access) {

                accessRollSearcher = function (cb) {
                    accessRoll(req, Model, cb);
                };

                contentSearcher = function (ids, cb) {
                    var queryObject = {};

                    queryObject.$and = [];

                    if (optionsObject.$and.length) {
                        queryObject.$and.push(optionsObject);
                    }

                    queryObject.$and.push({_id: {$in: ids}});

                    var query = Customers.find(queryObject);

                    if (data.onlyCount.toString().toLowerCase() === "true") {

                        query.count(function(err, res){
                            if (err){
                                cb(err);
                            }

                            cb(null, {listLength: res});
                        });
                    } else {

                        if (data && data.status && data.status.length > 0) {
                            query.where('workflow').in(data.status);

                        }
                        query
                            .select("_id name email phones.mobile")
                            .skip((data.page - 1) * data.count)
                            .limit(data.count)
                            .sort({"name.first": 1})
                            .exec(function (err, _res) {
                            if (err){
                                cb(err);
                            }
                                cb(null, {data: _res});
                        });
                    }
                };

                waterfallTasks = [accessRollSearcher, contentSearcher];
                async.waterfall(waterfallTasks, function (err, result) {
                    if (err) {
                        return next(err);
                    }


                    res.status(200).send(result);
                });
            } else {
                res.status(403).send();
            }
        });

    };

    this.getCustomersImages = function (req, res, next) {
        var Customers = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var data = req.query;
        var optionsObject = {_id: {$in: data.ids}};

        var contentType = data.contentType;
        switch (contentType) {
            case ('Persons'):
            {
                optionsObject.type = 'Person';
            }
                break;
            case ('Companies'):
            {
                optionsObject.type = 'Company';
            }
                break;
            case ('ownCompanies'):
            {
                optionsObject.type = 'Company';
                optionsObject.isOwn = true;
            }
                break;
        }

        Customers.find(optionsObject, {_id: 1, imageSrc: 1}, function (err, response) {
            if (err) {
                return next(err);
            }

            res.send(200, {data: response});
        });
    };

    this.create = function (req, res, next) {
        var Customers = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var body = req.body;
        var person = new Customers(body);

        person.createdBy.user = req.session.uId;
        person.editedBy.user = req.session.uId;
        person.createdBy.date = new Date();
        person.editedBy.date = new Date();

        person.save(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(201).send({success: 'A new Person crate success', id: result._id});
        });
    };

    this.getCompaniesForDd = function (req, res, next) {
        var Customers = models.get(req.session.lastDb, 'Customers', CustomerSchema);

        Customers.find({type: 'Company'}, {'name.first': 1}).sort({"name.first": 1}).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
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
        var id = req.query.id;
        var mid = req.headers.mid || 50;

        access.getReadAccess(req, req.session.uId, mid, function (access) {
            if (access) {
                Model
                    .findById(id)
                    .populate('company', '_id name')
                    .populate('department')
                    .populate('salesPurchases.salesPerson', '_id name fullName')
                    .populate('salesPurchases.salesTeam', '_id departmentName')
                    .populate('salesPurchases.implementedBy', '_id name fullName')
                    .populate('createdBy.user', 'login')
                    .populate('editedBy.user', 'login')
                    .populate('groups.users', '_id login')
                    .populate('groups.group', '_id departmentName')
                    .populate('groups.owner', '_id login')
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

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;
        var filterName;

        for (filterName in filter) {
            condition = filter[filterName].value;
            key = filter[filterName].key;

            switch (filterName) {
                case 'country':
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'name':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'letter':
                    filtrElement['name.first'] = new RegExp('^[' + filter.letter.toLowerCase() + filter.letter.toUpperCase() + '].*');
                    resArray.push(filtrElement);
                    break;
                case 'services':
                    if (condition.indexOf('isCustomer') !== -1) {
                        filtrElement['salesPurchases.isCustomer'] = true;
                        resArray.push(filtrElement);
                    }
                    if (condition.indexOf('isSupplier') !== -1) {
                        filtrElement['salesPurchases.isSupplier'] = true;
                        resArray.push(filtrElement);
                    }
                    break;
            }
        }

        return resArray;
    }

    this.getFilterCustomers = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var data = req.query;
        var contentType = data.contentType;
        var viewType = data.viewType;
        var optionsObject = {};
        var filter = data.filter || {};
        var skip = ((parseInt(data.page || 1, 10) - 1) * parseInt(data.count, 10));
        var limit = parseInt(data.count, 10);
        var waterfallTasks;
        var keySort;
        var sort;
        var mid = req.header.mid || 50;
        var accessRollSearcher;
        var contentSearcher;
        var query = {};

        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                optionsObject.$or = caseFilter(filter);
            } else {
                optionsObject.$and = caseFilter(filter);
            }
        }

        if (data.sort) {
            keySort = Object.keys(data.sort)[0];
            data.sort[keySort] = parseInt(data.sort[keySort], 10);
            sort = data.sort;
        } else {
            sort = {"editedBy.date": -1};
        }

        access.getEditWritAccess(req, req.session.uId, mid, function (access) {
            if (access) {

                accessRollSearcher = function (cb) {
                    accessRoll(req, Model, cb);
                };

                contentSearcher = function (ids, cb) {
                    var queryObject = {};

                    queryObject.$and = [];

                    if (optionsObject.$and.length) {
                        queryObject.$and.push(optionsObject);
                    }

                    if (contentType === 'Persons') {
                        queryObject.$and.push({type: 'Person'});
                    } else if (contentType === 'Companies') {
                        queryObject.$and.push({type: 'Company'});
                    }

                    queryObject.$and.push({_id: {$in: ids}});

                    query = Model.find(queryObject);

                    switch (contentType) {
                        case ('Persons'):
                            switch (viewType) {
                                case ('list'):
                                {
                                    query.sort(sort);

                                    query
                                        .select("_id createdBy editedBy address.country email name phones.phone")
                                        .populate('createdBy.user', 'login')
                                        .populate('editedBy.user', 'login');
                                }
                                    break;
                                case ('thumbnails'):
                                {
                                    query
                                        .select("_id name email company")
                                        .populate('company', '_id name')
                                        .populate('department', '_id departmentName')
                                        .populate('createdBy.user')
                                        .populate('editedBy.user');
                                }
                                    break;
                            }
                            break;
                        case ('Companies'):
                            switch (viewType) {
                                case ('list'):
                                {
                                    query.sort(sort);

                                    query
                                        .select("_id editedBy createdBy salesPurchases name email phones.phone address.country")
                                        .populate('salesPurchases.salesPerson', '_id name')
                                        .populate('salesPurchases.salesTeam', '_id departmentName')
                                        .populate('createdBy.user', 'login')
                                        .populate('editedBy.user', 'login');
                                }
                                    break;
                                case ('thumbnails'):
                                {
                                    query
                                        .select("_id name address")
                                        .populate('createdBy.user')
                                        .populate('editedBy.user');
                                }
                                    break;

                            }
                            break;
                        case ('ownCompanies'):
                            switch (viewType) {
                                case ('list'):
                                {
                                    query
                                        .populate('salesPurchases.salesPerson', '_id name')
                                        .populate('salesPurchases.salesTeam', '_id departmentName')
                                        .populate('createdBy.user')
                                        .populate('editedBy.user');
                                }
                                    break;
                                case ('thumbnails'):
                                {
                                    query
                                        .select("_id name")
                                        .populate('company', '_id name address')
                                        .populate('createdBy.user')
                                        .populate('editedBy.user');
                                }
                                    break;
                            }
                            break;
                    }

                    query.skip(skip).limit(limit).exec(function (err, _res) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, _res);
                    });

                };
                waterfallTasks = [accessRollSearcher, contentSearcher];

                async.waterfall(waterfallTasks, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({data: result});
                });
            } else {
                res.status(403).send();
            }
        });

    };

    this.update = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var _id = req.params.id;
        var remove = req.headers.remove;
        var data = req.body;
        var mid = req.headers.mid;
        var obj;

        if (data.notes && data.notes.length !== 0 && !remove) {
            obj = data.notes[data.notes.length - 1];
            obj._id = mongoose.Types.ObjectId();
            obj.date = new Date();
            data.notes[data.notes.length - 1] = obj;
        }
        access.getEditWritAccess(req, req.session.uId, mid, function (access) {
            if (access) {

                Model.findByIdAndUpdate(_id, data, {new: true}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.udateOnlySelectedFields = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var data = req.body;
        var _id = req.params.id;
        var fileName = data.fileName;
        var updateObject;
        var mid = req.headers.mid;

        if (data.notes && data.notes.length !== 0) {
            var obj = data.notes[data.notes.length - 1];

            if (!obj._id) {
                obj._id = mongoose.Types.ObjectId();
            }
            obj.date = new Date();

            if (!obj.author) {
                obj.author = req.session.uName;
            }
            data.notes[data.notes.length - 1] = obj;
        }

        updateObject = data;

        updateObject.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };
        access.getEditWritAccess(req, req.session.uId, mid, function (access) {
            if (access) {

                Model.findByIdAndUpdate(_id, {$set: updateObject}, {new: true}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    if (fileName) {
                        var os = require("os");
                        var osType = (os.type().split('_')[0]);
                        var path;
                        var dir;
                        switch (osType) {
                            case "Windows":
                            {
                                var newDirname = __dirname.replace("\\Modules", "");
                                while (newDirname.indexOf("\\") !== -1) {
                                    newDirname = newDirname.replace("\\", "\/");
                                }
                                path = newDirname + "\/uploads\/" + _id + "\/" + fileName;
                                dir = newDirname + "\/uploads\/" + _id;
                            }
                                break;
                            case "Linux":
                            {
                                var newDirname = __dirname.replace("/Modules", "");
                                while (newDirname.indexOf("\\") !== -1) {
                                    newDirname = newDirname.replace("\\", "\/");
                                }
                                path = newDirname + "\/uploads\/" + _id + "\/" + fileName;
                                dir = newDirname + "\/uploads\/" + _id;
                            }
                        }

                        fs.unlink(path, function (err) {
                            fs.readdir(dir, function (err, files) {
                                if (files && files.length === 0) {
                                    fs.rmdir(dir, function () {
                                    });
                                }
                            });
                        });

                    }
                    res.status(200).send({success: 'Customer updated', notes: result.notes});
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.getCompaniesAlphabet = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var contentType = req.query.contentType;
        var optionsObject = {};
        var searchName;
        var waterfallTasks;
        var contentSearcher;
        var accessRollSearcher;

        optionsObject.$and = [];

        switch (contentType) {
            case ('Persons'):
            {
                optionsObject.$and.push({type: 'Person'});
                searchName = "$name.last";
            }
                break;
            case ('Companies'):
            {
                optionsObject.$and.push({type: 'Company'});
                searchName = "$name.first";
            }
                break;
            case ('ownCompanies'):
            {
                optionsObject.$and.push({type: 'Company'});
                optionsObject.$and.push({isOwn: true});
                searchName = "$name.first";
            }
                break;
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Model, cb);
        };

        contentSearcher = function (ids, cb) {
            var queryObject = {};

            queryObject.$and = [];

            if (optionsObject.$and.length) {
                queryObject.$and.push(optionsObject);
            }

            queryObject.$and.push({_id: {$in: ids}});

            Model
                .aggregate([
                    {
                        $match: queryObject
                    }, {
                        $project: {
                            _id   : 1,
                            letter: {$substr: [searchName, 0, 1]}
                        }
                    }, {
                        $group: {_id: "$letter"}
                    }], cb);

        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.remove = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var mid = req.headers.mid || 50;
        var _id = req.params.id;

        access.getEditWritAccess(req, req.session.uId, mid, function (access) {
            if (access) {
                Model.remove({_id: _id}, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: 'customer removed'});
                });
            } else {
                res.status(403).send();
            }
        });
    };

};

module.exports = Customers;