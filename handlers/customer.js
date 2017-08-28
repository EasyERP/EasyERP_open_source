var mongoose = require('mongoose');
var async = require('async');

var Module = function (models, event) {
    'use strict';

    var CustomerSchema = mongoose.Schemas.Customer;
    var OpportunitySchema = mongoose.Schemas.Opportunities;
    var TasksSchema = mongoose.Schemas.DealTasks;

    var _ = require('../node_modules/underscore');
    var CONSTANTS = require('../constants/mainConstants');
    var RESPONSES = require('../constants/responses');
    var objectId = mongoose.Types.ObjectId;
    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var pageHelper = require('../helpers/pageHelper');
    var path = require('path');
    var fs = require('fs');
    var exporter = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').Customers;
    var FilterMapper = require('../helpers/filterMapper');
    var filterMapper = new FilterMapper();
    var HistoryWriter = require('../helpers/historyWriter.js');
    var historyWriter = new HistoryWriter(models);

    var HistoryService = require('../services/history.js')(models);

    var Uploader = require('../services/fileStorage/index');
    var uploader = new Uploader();

    var projectAfterLookup = {
        type                       : 1,
        isOwn                      : 1,
        name                       : 1,
        dateBirth                  : 1,
        email                      : 1,
        company                    : {$arrayElemAt: ['$company', 0]},
        timezone                   : 1,
        'address.street'           : 1,
        'address.city'             : 1,
        'address.state'            : 1,
        'address.zip'              : 1,
        'address.country'          : 1,
        website                    : 1,
        jobPosition                : 1,
        skype                      : 1,
        'phones.phone'             : 1,
        'phones.mobile'            : 1,
        'phones.fax'               : 1,
        title                      : 1,
        'salesPurchases.isCustomer': 1,
        'salesPurchases.isSupplier': 1,
        social                     : 1,
        'createdBy.user'           : {$arrayElemAt: ['$createdBy.user', 0]},
        'createdBy.date'           : 1,
        'editedBy.user'            : {$arrayElemAt: ['$editedBy.user', 0]},
        'editedBy.date'            : 1
    };

    var projectCustomer = {
        type                       : 1,
        isOwn                      : 1,
        name                       : 1,
        dateBirth                  : 1,
        email                      : 1,
        company                    : '$company.name.first',
        timezone                   : 1,
        address                    : 1,
        website                    : 1,
        jobPosition                : 1,
        skype                      : 1,
        phones                     : 1,
        title                      : 1,
        'salesPurchases.isCustomer': 1,
        'salesPurchases.isSupplier': 1,
        social                     : 1,
        'createdBy.user'           : '$createdBy.user.login',
        'createdBy.date'           : 1,
        'editedBy.user'            : '$editedBy.user.login',
        'editedBy.date'            : 1
    };

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
        query.sort({name: 1});
        query.exec(function (err, suppliers) {
            if (err) {
                next(err);
            } else {
                res.status(200).send({data: suppliers});
            }
        });
    };

    this.getFilterValues = function (req, res, next) {
        var Customers = models.get(req.session.lastDb, 'Customers', CustomerSchema);

        Customers.aggregate([
            {
                $group: {
                    _id : null,
                    name: {
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
                    case 'country':
                        result[0][key] = {
                            displayName: 'Country',
                            values     : _.sortBy(value, function (num) {
                                return num;
                            })
                        };
                        break;
                    // skip default
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
         *        '_id': '55b92ad521e4b7c40f00060c',
         *        'ID': 1,
         *        'dateBirth': null,
         *        'companyInfo': {
         *            'size': null,
         *            'industry': null
         *        },
         *        'editedBy': {
         *            'date': '2015-08-18T13:38:34.988Z',
         *            'user': {
         *                '_id': '52203e707d4dba8813000003',
         *                'login': 'admin',
         *                'id': '52203e707d4dba8813000003'
         *            }
         *        },
         *        'createdBy': {
         *            'date': '2015-07-29T19:34:45.989Z',
         *            'user': {
         *                '_id': '52203e707d4dba8813000003',
         *                'login': 'admin',
         *                'id': '52203e707d4dba8813000003'
         *            }
         *        },
         *        'history': [],
         *        'attachments': [],
         *        'notes': [],
         *        'groups': {
         *            'group': [],
         *            'users': [],
         *            'owner': '55ba28c8d79a3a3439000016'
         *        },
         *        'whoCanRW': 'everyOne',
         *        'social': {
         *            'LI': '',
         *            'FB': ''
         *        },
         *        'color': '#4d5a75',
         *        'relatedUser': null,
         *        'salesPurchases': {
         *            'receiveMessages': 0,
         *            'language': '',
         *            'reference': '',
         *            'active': false,
         *            'implementedBy': null,
         *            'salesTeam': null,
         *            'salesPerson': null,
         *            'isSupplier': false,
         *            'isCustomer': true
         *        },
         *        'title': '',
         *        'internalNotes': '',
         *        'contacts': [],
         *        'phones': {
         *            'fax': '',
         *            'mobile': '',
         *            'phone': ''
         *        },
         *        'skype': '',
         *        'jobPosition': null,
         *        'website': '',
         *        'address': {
         *            'country': '',
         *            'zip': '',
         *            'state': '',
         *            'city': '',
         *            'street': ''
         *        },
         *        'timezone': 'UTC',
         *        'department': null,
         *        'company': null,
         *        'email': '',
         *        'imageSrc': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC',
         *        'name': {
         *            'last': 'Blinov',
         *            'first': 'Alexey'
         *        },
         *        'isOwn': false,
         *        'type': 'Person',
         *        'fullName': 'Alexey Blinov',
         *        'id': '55b92ad521e4b7c40f00060c'
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
        var skip;

        count = count > CONSTANTS.MAX_COUNT ? CONSTANTS.MAX_COUNT : count;
        skip = (page - 1) > 0 ? (page - 1) * count : 0;

        queryObject.type = type;

        Model
            .find(queryObject)
            .skip(skip)
            .limit(count)
            .populate('company')
            .populate('department')
            .populate('salesPurchases.salesPerson', '_id name')
            .populate('salesPurchases.salesTeam', '_id name')
            .populate('createdBy.user', 'login')
            .populate('editedBy.user', 'login')
            .exec(function (err, customers) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(customers);
            });
    };

    function getData(req, customer, cb) {
        var dbName = req.session.lastDb;
        var TasksModel = models.get(dbName, 'DealTasks', TasksSchema);
        var Opportunity = models.get(dbName, 'Opportunities', OpportunitySchema);
        var Customers = models.get(dbName, 'Customers', CustomerSchema);
        var parallelTasks;

        customer.opportunities = [];
        customer.contacts = [];

        function getContactsByCompany(parallelCb) {

            Customers
                .find({$or: [{company: customer._id}]})
                .sort({'name.first': 1})
                .exec(function (err, contacts) {
                    if (err) {
                        return parallelCb(err);
                    }

                    customer.contacts = contacts;

                    parallelCb(null, customer);
                });
        }

        function getOppByCustomer(parallelCb) {

            Opportunity
                .find({$or: [{company: customer._id}, {customer: customer._id}]})
                .populate('salesPerson', 'name')
                .populate('workflow', 'name')
                .sort({'name.first': 1})
                .exec(function (err, opps) {
                    if (err) {
                        return parallelCb(err);
                    }

                    customer.opportunities = opps;

                    parallelCb(null, customer);
                });
        }

        parallelTasks = [getOppByCustomer];

        if (customer.type === 'Company') {
            parallelTasks.push(getContactsByCompany);
        }

        async.parallel(parallelTasks, function (err, result) {
            var opps = customer.opportunities.map(function (elem) {
                return elem._id;
            });

            var contacts = customer.contacts.map(function (elem) {
                return elem._id;
            });

            var ids = [customer._id].concat(opps, contacts);

            var historyOptions = {
                dbName : dbName,
                id     : {$in: ids},
                forNote: true
            };

            var parallelTasks;

            function getHistoryNotes(parallelCb) {
                HistoryService.getHistoryForTrackedObject(historyOptions, function (err, history) {
                    var notes;
                    if (err) {
                        return parallelCb(err);
                    }

                    notes = history.map(function (elem) {
                        var name;

                        switch (elem.collectionName) {
                            case 'Opportunities' :
                                name = _.find(customer.opportunities, function (opp) {
                                    return (opp._id.toJSON() === elem.contentId.toJSON());
                                });

                                name = name ? 'opportunity ' + name.name : '';
                                break;

                            case 'Persons' :
                                name = _.find(customer.contacts, function (contact) {
                                    return (contact._id.toJSON() === elem.contentId.toJSON());
                                });

                                name = name ? 'contact ' + name.fullName : '';
                                break;

                            // skip default
                        }

                        return {
                            date   : elem.date,
                            history: elem,
                            user   : elem.editedBy,
                            name   : name
                        };
                    });

                    parallelCb(null, notes);

                });
            }

            function getTask(parallelCb) {

                var findObject = {};
                var resDate;

                if (customer.type === 'Company') {
                    findObject.company = customer._id;
                    resDate = 'companyDate';
                } else {
                    findObject.contact = customer._id;
                    resDate = 'contactDate';
                }
                TasksModel.find(findObject)
                    .populate('deal', '_id name')
                    .populate('company', '_id name imageSrc')
                    .populate('contact', '_id name imageSrc')
                    .populate('category')
                    .populate('editedBy.user', '_id login')
                    .populate('assignedTo', '_id name fullName imageSrc')
                    .populate('workflow')
                    .exec(function (err, res) {
                        if (err) {
                            return parallelCb(err);
                        }
                        res = res.map(function (elem) {
                            return {
                                date: elem[resDate],
                                task: elem,
                                _id : elem._id,
                                user: elem.editedBy.user
                            };
                        });
                        parallelCb(null, res);
                    });
            }

            parallelTasks = [getTask, getHistoryNotes];

            async.parallel(parallelTasks, function (err, results) {

                if (err) {
                    cb(err);
                }

                if (customer && customer.notes) {
                    customer.notes = customer.notes.concat(results[0], results[1]);
                    customer.notes = _.map(customer.notes, function (el) {
                        el.date = new Date(el.date);

                        return el;
                    });
                    customer.notes = _.sortBy(customer.notes, 'date');
                }

                cb(null, customer);
            });

        });
    }

    function getCustomers(req, res, next) {
        var Customers = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var query = req.query;
        var type = query.type;
        var queryObject = {};

        if (type) {
            queryObject.type = type;
        }

        if (query && query.id) {
            queryObject._id = objectId(query.id);
        }

        if (query && query.isSupplier) {
            queryObject['salesPurchases.isSupplier'] = true;
        }

        if (query && query.isCustomer) {
            queryObject['salesPurchases.isCustomer'] = true;
        }

        Customers
            .find(queryObject)
            .sort({'name.first': 1})
            .exec(function (err, customers) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: customers});
            });

    }

    this.getCustomers = function (req, res, next) {
        getCustomers(req, res, next);
    };

    this.getFilterPersonsForMiniView = function (req, res, next) {
        var Customers = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var optionsObject = {};
        var data = req.query;
        var accessRollSearcher;
        var contentSearcher;
        var waterfallTasks;
        var skip = ((parseInt(data.page || 1, 10) - 1) * parseInt(data.count || 100, 10));
        var limit = parseInt(data.count, 10) || 100;
        var mid = parseInt(req.headers.mid, 10) || 49;

        optionsObject.$and = [];

        if (data.letter) {
            optionsObject.$and.push({type: 'Person'});
            optionsObject.$and.push({'name.last': new RegExp('^[' + data.letter.toLowerCase() + data.letter.toUpperCase() + '].*')});
        } else {
            optionsObject.$and.push({type: 'Person'});
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Customers, cb);
        };

        contentSearcher = function (ids, cb) {
            var queryObject = {};
            var query;

            queryObject.$and = [];

            if (optionsObject.$and.length) {
                queryObject.$and.push(optionsObject);
            }

            queryObject.$and.push({_id: {$in: ids}});

            query = Customers.find(queryObject);

            if (data.onlyCount && data.onlyCount.toString().toLowerCase() === 'true') {

                query.count(function (err, result) {
                    if (err) {
                        cb(err);
                    }

                    cb(null, {listLength: result});
                });
            } else {

                if (data && data.status && data.status.length > 0) {
                    query.where('workflow').in(data.status);

                }
                query
                    .select('_id name email phones.mobile')
                    .skip(skip)
                    .limit(limit)
                    .sort({'name.first': 1})
                    .exec(function (err, _res) {
                        if (err) {
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
    };

    this.getCustomersImages = function (req, res, next) {
        var Customers = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var data = req.query;
        var optionsObject = {_id: {$in: data.ids}};
        var contentType = data.contentType;

        switch (contentType) {
            case ('Persons'):
                optionsObject.type = 'Person';
                break;
            case ('Companies'):
                optionsObject.type = 'Company';
                break;
            case ('ownCompanies'):
                optionsObject.type = 'Company';
                optionsObject.isOwn = true;
                break;
            // skip default
        }
        if (data && data.ids) {
            Customers.find(optionsObject, {_id: 1, imageSrc: 1}, function (err, response) {
                if (err) {
                    return next(err);
                }

                res.send(200, {data: response});
            });
        } else {
            res.send(200, {data: []});
        }

    };

    this.create = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Customers = models.get(dbName, 'Customers', CustomerSchema);
        var body = req.body;
        var person = new Customers(body);

        person.createdBy.user = req.session.uId;
        person.editedBy.user = req.session.uId;
        person.createdBy.date = new Date();
        person.editedBy.date = new Date();

        person.save(function (err, result) {
            var historyOptions;

            if (err) {
                return next(err);
            }

            historyOptions = {
                dbName     : dbName,
                contentType: result.type,
                data       : result.toJSON(),
                contentId  : result._id
            };

            HistoryService.addEntry(historyOptions, function () {
                getData(req, result.toJSON(), function (err, customer) {
                    if (err) {
                        return next(err);
                    }
                    res.status(201).send({
                        success: 'A new Person crate success',
                        id     : customer._id,
                        type   : customer.type
                    });
                });
            });

        });
    };

    this.getCompaniesForDd = function (req, res, next) {
        var Customers = models.get(req.session.lastDb, 'Customers', CustomerSchema);

        Customers.find({
            type: 'Company'
        }, {'name.first': 1}).sort({'name.first': 1}).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    function getById(req, res, next) {
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
        var id = req.query.id || req.params.id;

        Model
            .findById(id)
            .populate('company')
            .populate('salesPurchases.salesPerson', '_id name fullName')
            .populate('salesPurchases.salesTeam', '_id name')
            .populate('salesPurchases.implementedBy', '_id name fullName')
            .populate('groups.users', '_id login')
            .populate('groups.group', '_id name')
            .populate('groups.owner', '_id login')
            .populate('createdBy.user', '_id login')
            .populate('editedBy.user', '_id login')
            .exec(function (err, customer) {
                if (err) {
                    return next(err);
                }
                getData(req, customer.toJSON(), function (err, customer) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(customer);
                });

            });
    }

    function getFilterCustomers(req, res, next) {
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var data = req.query;
        var quickSearch = data.quickSearch;
        var contentType = data.contentType;
        var viewType = data.viewType;
        var optionsObject = {};
        var filter = data.filter || {};
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var waterfallTasks;
        var keySort;
        var sort;
        var accessRollSearcher;
        var contentSearcher;
        var parallelTasks;
        var query = {};
        var countQuery;
        var getData;
        var getTotal;
        var quickArray;
        var regExpArray = [];

        if (quickSearch) {
            quickArray = quickSearch.split(' ');

            quickArray.forEach(function (str) {
                regExpArray.push(new RegExp(str, 'ig'));
            });
        }

        if (filter && typeof filter === 'object') {
            optionsObject = filterMapper.mapFilter(filter, {contentType: contentType});

            if (filter && filter.services) {
                if (filter.services.value.indexOf('isCustomer') !== -1) {
                    optionsObject['salesPurchases.isCustomer'] = true;
                }
                if (filter.services.value.indexOf('isSupplier') !== -1) {
                    optionsObject['salesPurchases.isSupplier'] = true;
                }
            }

            delete optionsObject.services;
        }

        if (data.sort) {
            keySort = Object.keys(data.sort)[0];
            data.sort[keySort] = parseInt(data.sort[keySort], 10);
            sort = data.sort;
        } else {
            sort = {'editedBy.date': -1};
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Model, cb);
        };

        contentSearcher = function (ids, cb) {
            var queryObject = {};

            if (optionsObject) {
                queryObject.$and = [];
                queryObject.$and.push(optionsObject);
            }

            if (contentType === 'Persons') {
                queryObject.$and.push({type: 'Person'});
            } else if (contentType === 'Companies') {
                queryObject.$and.push({type: 'Company'});
            }

            queryObject.$and.push({_id: {$in: ids}});

            if (quickSearch) {
                queryObject.$or = [
                    {
                        'name.first': {$in: regExpArray}
                    },
                    {
                        'name.last': {$in: regExpArray}
                    }
                ];
            }

            function queryBuilder(contentType, viewType) {
                var query = Model.find(queryObject);

                switch (contentType) {
                    case ('Persons'):
                        switch (viewType) {
                            case ('list'):
                                query.sort(sort);
                                query.select('_id createdBy magentoId editedBy salesPurchases address.country email name fullName phones.phone')
                                    .populate('createdBy.user', 'login')
                                    .populate('channel', 'channelName')
                                    .populate('editedBy.user', 'login');
                                break;
                            case ('thumbnails'):
                                query.sort(sort);
                                query.select('_id name email magentoId address.country salesPurchases fullName company')
                                    .populate('company', '_id name')
                                    .populate('channel', 'channelName');
                                break;
                            // skip default
                        }
                        break;
                    case ('Companies'):
                        switch (viewType) {
                            case ('list'):
                                query.sort(sort);
                                query.select('_id editedBy createdBy salesPurchases name fullName email phones.phone phones.mobile address.country')
                                    .populate('salesPurchases.salesPerson', '_id name')
                                    .populate('salesPurchases.salesTeam', '_id name')
                                    .populate('channel', 'channelName')
                                    .populate('createdBy.user', 'login')
                                    .populate('editedBy.user', 'login');
                                break;
                            case ('thumbnails'):
                                query.sort(sort);
                                query.select('_id name fullName company address.country salesPurchases')
                                    .populate('channel', 'channelName')
                                    .populate('company', '_id name address');
                                break;
                            // skip default
                        }
                        break;
                    case ('ownCompanies'):
                        switch (viewType) {
                            case ('list'):
                                query.sort(sort);
                                query.populate('salesPurchases.salesPerson', '_id name')
                                    .populate('salesPurchases.salesTeam', '_id name')
                                    .populate('createdBy.user')
                                    .populate('editedBy.user');
                                break;
                            case ('thumbnails'):
                                query.sort(sort);
                                query.select('_id name fullName company')
                                    .populate('company', '_id name address');

                                break;
                            // skip default
                        }
                        break;
                    // skip default
                }

                return query;
            }

            query = queryBuilder(contentType, viewType);
            countQuery = queryBuilder(contentType, viewType);

            getTotal = function (pCb) {

                countQuery.count(function (err, _res) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, _res);
                });
            };

            getData = function (pCb) {
                query.skip(skip).limit(limit).exec(function (err, _res) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, _res);
                });
            };

            parallelTasks = [getTotal, getData];

            async.parallel(parallelTasks, function (err, result) {
                var count;
                var response = {};

                if (err) {
                    return cb(err);
                }

                count = result[0] || 0;

                response.total = count;
                response.data = result[1];

                cb(null, response);
            });

        };
        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });

    }

    this.getById = function (req, res, next) {
        getById(req, res, next);
    };

    this.getByViewType = function (req, res, next) {
        var query = req.query;
        var viewType = query.viewType;
        var id = req.query.id;

        if (id && id.length >= 24) {
            getById(req, res, next);
            return false;
        }

        switch (viewType) {
            case 'form':
                getById(req, res, next);
                break;
            case 'list':
                getFilterCustomers(req, res, next);
                break;
            case 'thumbnails':
                getFilterCustomers(req, res, next);
                break;
            default:
                getCustomers(req, res, next);
                break;
        }
    };

    this.update = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var _id = req.params.id;
        var remove = req.headers.remove;
        var data = req.body;
        var obj;
        var i;

        if (data.notes && data.notes.length !== 0 && !remove) {
            obj = data.notes[data.notes.length - 1];
            obj._id = mongoose.Types.ObjectId();
            obj.date = new Date();
            if (!obj.user) {
                obj.user = {};
                obj.user._id = req.session.uId;
                obj.user.login = req.session.uName;
            }
            data.notes[data.notes.length - 1] = obj;
        }

        // for re-converting date in actual format
        if (data.notes && data.notes.length) {
            i = 0;

            for (i; i < data.notes; i++) {
                data.notes[i].date = new Date(data.notes[i].date);
            }
        }

        data.editedBy = {
            user: req.session.uId
        };
        data.createdBy = {
            date: new Date(req.body.createdBy.date)
        };

        Model.findByIdAndUpdate(_id, data, {new: true}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.uploadFile = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var headers = req.headers;
        var id = headers.modelid || 'empty';
        var addNote = headers.addnote;
        var contentType = headers.modelname || 'persons';
        var files = req.files && req.files.attachfile ? req.files.attachfile : null;
        var dir;
        var err;

        contentType = contentType.toLowerCase();
        dir = path.join(contentType, id);

        if (!files) {
            err = new Error(RESPONSES.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }

        uploader.postFile(dir, files, {userId: req.session.uName}, function (err, file) {
            var notes = [];

            if (err) {
                return next(err);
            }

            if (addNote) {
                notes = file.map(function (elem) {
                    return {
                        _id       : mongoose.Types.ObjectId(),
                        attachment: {
                            name    : elem.name,
                            shortPas: elem.shortPas
                        },
                        user: {
                            _id  : req.session.uId,
                            login: req.session.uName
                        },
                        date: new Date()
                    };
                });
            }

            Model.findByIdAndUpdate(id, {
                $push: {
                    attachments: {$each: file},
                    notes      : {$each: notes}
                }
            }, {new: true}, function (err, response) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Customers updated success', data: response});
            });
        });
    };

    this.udateOnlySelectedFields = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Model = models.get(dbName, 'Customers', CustomerSchema);
        var data = req.body;
        var _id = req.params.id;
        var fileName = data.fileName;
        var updateObject;
        var newDirname;
        var obj;
        var i;

        if (data.notes && data.notes.length !== 0) {
            obj = data.notes[data.notes.length - 1];

            if (!obj._id) {
                obj._id = mongoose.Types.ObjectId();
            }
            // obj.date = new Date();

            if (!obj.user) {
                obj.user = {};
                obj.user._id = req.session.uId;
                obj.user.login = req.session.uName;
            }
            data.notes[data.notes.length - 1] = obj;
        }

        // for re-converting date in actual format
        if (data.notes && data.notes.length) {
            i = 0;

            for (i; i < data.notes; i++) {
                data.notes[i].date = new Date(data.notes[i].date);
            }
        }

        updateObject = data;

        updateObject.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };

        Model.findByIdAndUpdate(_id, {$set: updateObject}, {new: true}, function (err, result) {
            var os = require('os');
            var osType = (os.type().split('_')[0]);
            var path;
            var dir;
            var resJson;
            var historyOptions;
            if (err) {
                return next(err);
            }

            result.populate('salesPurchases.salesPerson', function (err) {

                if (err) {
                    return next(err);
                }

                if (fileName) {

                    switch (osType) {
                        case 'Windows':
                            newDirname = __dirname.replace('\\Modules', '');
                            while (newDirname.indexOf('\\') !== -1) {
                                newDirname = newDirname.replace('\\', '\/');
                            }
                            path = newDirname + '\/uploads\/' + _id + '\/' + fileName;
                            dir = newDirname + '\/uploads\/' + _id;
                            break;
                        case 'Linux':
                            newDirname = __dirname.replace('/Modules', '');
                            while (newDirname.indexOf('\\') !== -1) {
                                newDirname = newDirname.replace('\\', '\/');
                            }
                            path = newDirname + '\/uploads\/' + _id + '\/' + fileName;
                            dir = newDirname + '\/uploads\/' + _id;
                            break;
                        // skip default
                    }

                    fs.unlink(path, function () {
                        fs.readdir(dir, function (err, files) {
                            if (files && files.length === 0) {
                                fs.rmdir(dir, function () {
                                });
                            }
                        });
                    });

                }
                event.emit('editModel', {id: result._id, currentUser: req.session.uId});

                historyOptions = {
                    contentType: result.type,
                    data       : data,
                    dbName     : dbName,
                    contentId  : result._id
                };

                HistoryService.addEntry(historyOptions, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    if (result && result.length) {
                        resJson = result[0];
                    } else {
                        resJson = result;
                    }

                    getData(req, resJson, function (err, customer) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(customer);
                    });
                });
            });
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
                optionsObject.$and.push({type: 'Person'});
                searchName = '$name.last';
                break;
            case ('Companies'):
                optionsObject.$and.push({type: 'Company'});
                searchName = '$name.first';
                break;
            case ('ownCompanies'):
                optionsObject.$and.push({type: 'Company'});
                optionsObject.$and.push({isOwn: true});
                searchName = '$name.first';
                break;
            // skip default
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
                            _id  : 1,
                            later: {$substr: [searchName, 0, 1]}
                        }
                    },
                    {
                        $group: {_id: '$later'}
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
        var dbName = req.session.lastDb;
        var Model = models.get(dbName, 'Customers', CustomerSchema);
        var Opportunity = models.get(dbName, 'Opportunities', OpportunitySchema);
        var _id = req.params.id;
        var deleteHistory = req.query.deleteHistory;

        Model.findByIdAndRemove({_id: _id}, function (err, response) {
            var findObject = {};
            var updateObject = {};
            if (err) {
                return next(err);
            }

            if (response.type === 'Company') {
                findObject.company = _id;
                updateObject.company = null;
            } else {
                findObject.customer = _id;
                updateObject.customer = null;
            }

            Opportunity.update(findObject, {$set: updateObject}, {multi: true}, function (err) {
                if (err) {
                    return next(err);
                }
                if (deleteHistory) {
                    HistoryService.deleteHistory({contentId: _id, dbName: dbName});
                }

                res.status(200).send({success: 'customer removed'});
            });

        });
    };

    this.bulkRemove = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Model = models.get(dbName, 'Customers', CustomerSchema);
        var body = req.body || {ids: []};
        var deleteHistory = req.query.deleteHistory;
        var ids = body.ids;

        Model.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }
            if (deleteHistory) {
                HistoryService.deleteHistory({contentId: {$in: ids}, dbName: dbName});
            }

            res.status(200).send(removed);
        });
    };

    this.exportToXlsx = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);

        var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
        var type = req.query.type;
        var filterObj = {};
        var options;

        if (filter && typeof filter === 'object') {
            filterObj = filterMapper.mapFilter(filter, {contentType: 'Customers'});

            if (filter && filter.services) {
                if (filter.services.value.indexOf('isCustomer') !== -1) {
                    filterObj['salesPurchases.isCustomer'] = true;
                }
                if (filter.services.value.indexOf('isSupplier') !== -1) {
                    filterObj['salesPurchases.isSupplier'] = true;
                }
            }

            delete filterObj.services;
        }

        filterObj.type = type === 'Persons' ? 'Person' : 'Company';

        options = {
            res         : res,
            next        : next,
            Model       : Model,
            map         : exportMap,
            returnResult: true,
            fileName    : type || 'Customer'
        };

        function lookupForCustomers(cb) {
            var query = [];

            query.push({$match: filterObj}, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'createdBy.user',
                    foreignField: '_id',
                    as          : 'createdBy.user'
                }
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'editedBy.user',
                    foreignField: '_id',
                    as          : 'editedBy.user'
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'company',
                    foreignField: '_id',
                    as          : 'company'
                }
            }, {
                $project: projectAfterLookup
            }, {
                $project: projectCustomer
            });

            options.query = query;
            options.cb = cb;

            exporter.exportToXlsx(options);
        }

        async.parallel([lookupForCustomers], function (err, result) {
            var resultArray = result[0];

            exporter.exportToXlsx({
                res        : res,
                next       : next,
                Model      : Model,
                resultArray: resultArray,
                map        : exportMap,
                fileName   : type || 'Customer'
            });
        });

    };

    this.exportToCsv = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);

        var filter = req.query.filter ? JSON.parse(req.query.filter) : JSON.stringify({});
        var type = req.query.type;
        var filterObj = {};
        var options;

        if (filter && typeof filter === 'object') {
            filterObj = filterMapper.mapFilter(filter, {contentType: 'Customers'});

            if (filter && filter.services) {
                if (filter.services.value.indexOf('isCustomer') !== -1) {
                    filterObj['salesPurchases.isCustomer'] = true;
                }
                if (filter.services.value.indexOf('isSupplier') !== -1) {
                    filterObj['salesPurchases.isSupplier'] = true;
                }
            }

            delete filterObj.services;
        }

        filterObj.type = type === 'Persons' ? 'Person' : 'Company';

        options = {
            res         : res,
            next        : next,
            Model       : Model,
            map         : exportMap,
            returnResult: true,
            fileName    : type || 'Customer'
        };

        function lookupForCustomers(cb) {
            var query = [];

            query.push({$match: filterObj}, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'createdBy.user',
                    foreignField: '_id',
                    as          : 'createdBy.user'
                }
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'editedBy.user',
                    foreignField: '_id',
                    as          : 'editedBy.user'
                }
            }, {
                $lookup: {
                    from        : 'Customers',
                    localField  : 'company',
                    foreignField: '_id',
                    as          : 'company'
                }
            }, {
                $project: projectAfterLookup
            }, {
                $project: projectCustomer
            });

            options.query = query;
            options.cb = cb;

            exporter.exportToCsv(options);
        }

        async.parallel([lookupForCustomers], function (err, result) {
            var resultArray = result[0];

            exporter.exportToCsv({
                res        : res,
                next       : next,
                Model      : Model,
                resultArray: resultArray,
                map        : exportMap,
                fileName   : type || 'Customer'
            });
        });

    };

};

module.exports = Module;
