var mongoose = require('mongoose');
var Opportunity = function (models) {

    var access = require("../Modules/additions/access.js")(models);
    var _ = require('../node_modules/underscore');
    var rewriteAccess = require('../helpers/rewriteAccess');
    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter.js');
    var opportunitiesSchema = mongoose.Schemas['Opportunitie'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var validator = require('validator');

    var EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.addNewLeadFromSite = function (req, res, next) {
        var db = 'production';
        var Opportunitie = models.get(db, 'Opportunitie', opportunitiesSchema);

        var body = req.body;
        var name = body.name ? validator.escape(body.name) : '';
        var email = body.email ? validator.escape(body.email) : '';
        var message = body.message ? validator.escape(body.message) : '';
        var utm_medium = body.utm_medium ? validator.escape(body.utm_medium) : '';
        var utm_source = body.utm_source ? validator.escape(body.utm_source) : '';
        var utm_term = body.utm_term ? validator.escape(body.utm_term) : '';
        var utm_campaign = body.utm_campaign ? validator.escape(body.utm_campaign) : '';
        var isEmailValid = EMAIL_REGEXP.test(email);

        var waterfallTasks = [getCampaignSource, createLead];

        function getCampaignSource(callback) {
            var sourceSchema = mongoose.Schemas['sources'];
            var campaignSchema = mongoose.Schemas['campaign'];
            var Source = models.get(db, 'sources', sourceSchema);
            var Campaign = models.get(db, 'campaign', campaignSchema);
            var parralelTasks = {};
            var sourceModel;
            var campaignModel;

            if (utm_source) {
                parralelTasks.source = function (parallelCB) {
                    Source.findOne({_id: utm_source}, function (err, result) {
                        if (err) {
                            return parallelCB(err);
                        }

                        if (result) {
                            return parallelCB(null, result);
                        }

                        sourceModel = new Source({_id: utm_source, name: utm_source});

                        sourceModel.save(function (err, sourceResult) {
                            if (err) {
                                return parallelCB(err);
                            }
                            parallelCB(null, sourceResult);
                        })
                    })
                }
            }

            if (utm_medium) {
                parralelTasks.campaign = function (parallelCB) {
                    var loverCampaign = utm_medium.toLowerCase();

                    Campaign.findOne({_id: loverCampaign}, function (err, result) {
                        if (err) {
                            return parallelCB(err);
                        }

                        if (result) {
                            return parallelCB(null, result);
                        }

                        campaignModel = new Campaign({_id: loverCampaign, name: utm_medium});

                        campaignModel.save(function (err, campaignResult) {
                            if (err) {
                                return parallelCB(err);
                            }
                            parallelCB(null, campaignResult);
                        })
                    })
                }
            }

            async.parallel(parralelTasks, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            })

        }

        function createLead(result, callback) {
            var saveObject;
            var campaign = '';
            var source = '';
            var leadModel;
            var contactName = {
                first: name,
                last : ''
            };

            var messageString = 'message:' + message;
            var utm_termString = '\nutm_term: ' + utm_term;
            var utm_campaignString = '\nutm_campaign: ' + utm_campaign;

            var internalNotes = '';

            if (message) {
                internalNotes += messageString;
            }

            if (utm_term) {
                internalNotes += utm_termString;
            }

            if (utm_campaign) {
                internalNotes += utm_campaignString;
            }

            if (result.campaign && result.campaign._id) {
                campaign = result.campaign._id;
            }
            if (result.source && result.source._id) {
                source = result.source._id;
            }

            saveObject = {
                name          : name,
                email         : email,
                contactName   : contactName,
                campaign      : campaign,
                source        : source,
                internalNotes : internalNotes,
                isOpportunitie: false
            };

            leadModel = new Opportunitie(saveObject);

            leadModel.save(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        }

        if (isEmailValid) {
            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    res.status(400).send();
                }

                res.status(200).send('Lead created');
            })
        } else {
            res.status(400).send();
        }
    };

    function ConvertType(array, type) {
        if (type === 'integer') {
            for (var i = array.length - 1; i >= 0; i--) {
                array[i] = parseInt(array[i]);
            }
        }
    }

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
                case 'contactName':
                    filtrElement.contactName = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'workflow':
                    filtrElement.workflow = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'source':
                    filtrElement.source = {$in: condition};
                    resArray.push(filtrElement);
                    break;
            }
        }
        return resArray;
    }

    this.getByViewType = function (req, res, next) {
        var viewType = req.params.viewType;

        switch (viewType) {
            case "list":
                getFilter(req, res, next);
                break;
            case "form":
                getById(req, res, next);
                break;
            case "kanban":
                getForKanban(req, res, next);
        }
    };

    /**
     * Properties in __Opportunities__ are same as in __Leads__.
     *
     * Just choose __true__ or __false__ in `isOpportunitie` field.
     *
     * @module Opportunity
     */
    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/totalCollectionLength/Opportunities`
     *
     * This __method__ allows get count of opportunities.
     *
     * @example
     *     {
     *         "count": 15
     *     }
     *
     * @method totalCollectionLength
     * @param {String} Opportunities - Content Type
     * @instance
     */
    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/Opportunities/form/:id`
     *
     * This __method__ allows get all opportunities for `form` viewType.
     * @method Opportunities
     * @param {String} form - View type
     * @param {String} id - Id of Opportunity
     * @instance
     */

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/Opportunities/kanban`
     *
     * This __method__ allows get all opportunities for `kanban` viewType.
     * @method Opportunities
     * @param {String} kanban - View type
     * @instance
     */

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/Opportunities/list`
     *
     * This __method__ allows get all opportunities for `list` viewType.
     *
     * @example
     *        {"data":[{
     *        "_id":"5374c180503e85ec0e00000d",
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
     *        "name":"Teavana",
     *        "isOpportunitie":true
     *        }]}
     *
     * @method Opportunities
     * @param {String} list - View type
     * @instance
     */

    function getFilter(req, res, next) {
        var Opportunities = models.get(req.session.lastDb, "Opportunities", opportunitiesSchema);
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        var filterObj = {};
        var optionsObject = {};
        var data = req.query;
        var filter = data.filter;
        var query;
        var sort;
        var mid;

        var count = data.count ? data.count : 100;
        var page = data.page;
        var skip = (page - 1) > 0 ? (page - 1) * count : 0;

        if (data.sort) {
            sort = data.sort;
        } else {
            sort = {"editedBy.date": -1};
        }

        optionsObject['$and'] = [];
        filterObj['$and'] = [];

        filterObj['$and'].push(caseFilter(filter));

        switch (data.contentType) {
            case ('Opportunities'):
                mid = 25;
                optionsObject['$and'].push({'isOpportunitie': true});

                if (data && data.filter) {
                    optionsObject['$and'].push(filterObj);
                }
                break;
            case ('Leads'):
                mid = 24;
                optionsObject['$and'].push({'isOpportunitie': false});

                if (data.filter.isConverted) {
                    optionsObject['isConverted'] = true;
                    optionsObject['isOpportunitie'] = true;
                }
                if (filterObj['$and'].length) {
                    optionsObject['$and'].push(filterObj);
                }
                break;
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };
        contentIdsSearcher = function (deps, waterfallCallback) {
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $and: [
                    optionsObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };

            Opportunities.aggregate(
                {
                    $match: matchQuery
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (opportunitiesIds, waterfallCallback) {
            var queryObject = {_id: {$in: opportunitiesIds}};

            query = Opportunities
                .find(queryObject)
                .limit(count)
                .skip(skip)
                .sort(sort)
                .lean();

            switch (data.contentType) {
                case ('Opportunities'):
                {
                    query.populate('customer', 'name').
                        populate('workflow', '_id name status').
                        populate('salesPerson', 'name').
                        populate('createdBy.user', 'login').
                        populate('editedBy.user', 'login');
                }
                    break;
                case ('Leads'):
                {
                    query.select("_id createdBy editedBy name workflow contactName phones campaign source email contactName").
                        populate('company', 'name').
                        populate('workflow', "name status").
                        populate('createdBy.user', 'login').
                        populate('editedBy.user', 'login');
                }
                    break;
            }

            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        access.getEditWritAccess(req, req.session.uId, mid, function (access) {
            if (!access) {
                return res.status(403).send();
            }

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
        });
    }

    this.getFilterValues = function (req, res, next) {
        var opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);

        opportunity.aggregate([
            {
                $group: {
                    _id               : null,
                    Name              : {
                        $addToSet: '$name'
                    },
                    'Creation date'   : {
                        $addToSet: '$creationDate'
                    },
                    /* 'Next action': {
                     $addToSet: '$nextAction.desc'
                     },*/
                    'Expected revenue': {
                        $addToSet: '$expectedRevenue.value'
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            _.map(result[0], function (value, key) {
                switch (key) {
                    case 'Name':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num
                        });
                        break;
                    case  'Expected revenue':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num
                        });
                        break;
                    case  'Next action':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num
                        });
                        break;

                }
            });

            res.status(200).send(result);
        });
    };

    function getForKanban(req, res, next) {
        var Opportunities = models.get(req.session.lastDb, "Opportunities", opportunitiesSchema);
        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        var or;
        var filterObj = {};
        var optionsObject = {};
        var data = req.query;
        var filter = data.filter;
        var query;

        optionsObject['$and'] = [];
        filterObj['$or'] = [];
        or = filterObj['$or'];

        optionsObject['$and'].push({'isOpportunitie': true});

        if (data && data.filter) {
            optionsObject['$and'].push(filterObj);
        }

        caseFilter(filter, or);

        if (!or.length) {
            delete filterObj['$or']
        }

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };
        contentIdsSearcher = function (deps, waterfallCallback) {
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $and: [
                    optionsObject,
                    {
                        $or: whoCanRw
                    }
                ]
            };

            Opportunities.aggregate(
                {
                    $match: matchQuery
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (opportunitiesIds, waterfallCallback) {
            var queryObject = {_id: {$in: opportunitiesIds}};

            query = Opportunities
                .find(queryObject)
                .populate('customer', 'name').
                populate('salesPerson', 'name').
                populate('workflow', '_id').
                sort({'sequence': -1}).
                limit(req.session.kanbanSettings.opportunities.countPerPage);

            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        access.getEditWritAccess(req, req.session.uId, 25, function (access) {
            if (!access) {
                return res.status(403).send();
            }

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({
                    data      : result,
                    workflowId: data.workflowId,
                    fold      : (req.session.kanbanSettings.opportunities.foldWorkflows && req.session.kanbanSettings.opportunities.foldWorkflows.indexOf(data.workflowId.toString()) !== -1)
                });
            });
        });
    }

    function getById(req, res, next) {
        var id = req.query.id;
        var Opportunities = models.get(req.session.lastDb, "Opportunities", opportunitiesSchema);

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Department", DepartmentSchema).aggregate(
                {
                    $match: {
                        users: objectId(req.session.uId)
                    }
                }, {
                    $project: {
                        _id: 1
                    }
                },

                waterfallCallback);
        };

        contentIdsSearcher = function (deps, waterfallCallback) {
            var everyOne = rewriteAccess.everyOne();
            var owner = rewriteAccess.owner(req.session.uId);
            var group = rewriteAccess.group(req.session.uId, deps);
            var whoCanRw = [everyOne, owner, group];
            var matchQuery = {
                $or: whoCanRw
            };

            Opportunities.aggregate(
                {
                    $match: matchQuery
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (opportunitiesIds, waterfallCallback) {
            var queryObject = {_id: id};
            var query;

            query = Opportunities.findOne(queryObject);

            query.populate('company customer salesPerson salesTeam workflow')
                .populate('groups.users')
                .populate('groups.group')
                .populate('createdBy.user')
                .populate('editedBy.user')
                .populate('groups.owner', '_id login');

            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    }

    /**
     * @module Leads
     */
    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/192.168.88.122:8089/totalCollectionLength/Leads`
     *
     * This __method__ allows get count of Leads.
     *
     * @example {
     *         "count": 35
     *     }
     *
     * @method totalCollectionLength
     * @param {String} Leads - Content type
     * @instance
     */
    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/192.168.88.122:8089/Leads/form/:id`
     *
     * This __method__ allows get all Leads for `form` viewType.
     * @method Leads
     * @param {String} form - View type
     * @param {String} id - Id of Lead
     * @instance
     */

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/192.168.88.122:8089/Leads/kanban`
     *
     * This __method__ allows get all Leads for `kanban` viewType.
     * @method Leads
     * @param {String} kanban - View type
     * @instance
     */

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http://192.168.88.122:8089/Leads/list`
     *
     * This __method__ allows get all Leads for `list` viewType.
     *
     * @example
     *        {"data":[{
     *        "_id":"5374c181503e85ec0e000010",
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
     *        "isOpportunitie":false
     *        }]}
     *
     * @method Leads
     * @param {String} list - View type
     * @instance
     */
};

module.exports = Opportunity;