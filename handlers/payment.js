

var mongoose = require('mongoose');
var async = require('async');
var WorkflowHandler = require('./workflow');
var _ = require('lodash');

var CONSTANTS = require('../constants/modules');
var MAINCONSTANTS = require('../constants/mainConstants');

function returnModuleId(req) {
    var body = req.body;
    var moduleId;

    /*    var isWtrack = req.session.lastDb === 'weTrack';

     if(isWtrack){
     moduleId = 61;
     } else {*/
    moduleId = !!body.forSales ? 61 : 60
    /*    }*/

    return moduleId;
}

var Payment = function (models) {
    var access = require("../Modules/additions/access.js")(models);

    var EmployeeSchema = mongoose.Schemas['Employee'];
    var wTrackPayOutSchema = mongoose.Schemas['wTrackPayOut'];
    var PaymentSchema = mongoose.Schemas['Payment'];
    var wTrackPaymentSchema = mongoose.Schemas['wTrackPayment'];
    var InvoiceSchema = mongoose.Schemas['Invoice'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var wTrackSchema = mongoose.Schemas['wTrack'];

    var objectId = mongoose.Types.ObjectId;
    var waterfallTasks;

    this.getAll = function (req, res, next) {
        //this temporary unused
        var isWtrack = req.session.lastDb === 'weTrack';
        var Payment;

        if (isWtrack) {
            Payment = models.get(req.session.lastDb, 'wTrackPayment', wTrackPaymentSchema);
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        var query = {};

        Payment.find(query, function (err, payments) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: payments});
        });
    };

    this.getForView = function (req, res, next) {
        var viewType = req.params.viewType;
        var forSale = req.params.byType === 'customers';
        var bonus = req.params.byType === 'supplier';

        switch (viewType) {
            case "list":
                getPaymentFilter(req, res, next, forSale, bonus);
                break;
        }
    };

    function getPaymentFilter(req, res, next, forSale, bonus) {
        var isWtrack = req.session.lastDb === 'weTrack';
        var Payment;
        var data = req.query;
        var filter = data.filter;

        var moduleId = returnModuleId(req);

        if (isWtrack) {
            if (moduleId === 61) {
                Payment = models.get(req.session.lastDb, 'wTrackPayment', wTrackPaymentSchema);
            } else {
                Payment = models.get(req.session.lastDb, 'wTrackPayOut', wTrackPayOutSchema);
            }
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

                    var optionsObject = {}; //{forSale: forSale};
                    var sort = {};
                    var count = req.query.count ? req.query.count : 100;
                    var page = req.query.page;
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if (req.query.sort) {
                        sort = req.query.sort;
                    } else {
                        sort = {"date": -1};
                    }

                    if (bonus) {
                        optionsObject.bonus = bonus;
                    }

                    optionsObject.$and = [];


                    if (filter && typeof filter === 'object') {
                        if (filter.condition === 'or') {
                            optionsObject['$or'] = caseFilter(filter);
                        } else {
                            optionsObject['$and'] = caseFilter(filter);
                        }
                    }
                    optionsObject.$and.push({forSale: forSale});

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
                        var arrOfObjectId = deps.objectID();

                        Payment.aggregate(
                            {
                                $match: {
                                    $and: [
                                        optionsObject,
                                        {
                                            $or: [
                                                {
                                                    $or: [
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.users': objectId(req.session.uId)}
                                                            ]
                                                        },
                                                        {
                                                            $and: [
                                                                {whoCanRW: 'group'},
                                                                {'groups.group': {$in: arrOfObjectId}}
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    $and: [
                                                        {whoCanRW: 'owner'},
                                                        {'groups.owner': objectId(req.session.uId)}
                                                    ]
                                                },
                                                {whoCanRW: "everyOne"}
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                            waterfallCallback
                        );
                    };

                    contentSearcher = function (paymentsIds, waterfallCallback) {
                        var query;

                        optionsObject._id = {$in: paymentsIds};

                        query = Payment.find(optionsObject).limit(count).skip(skip).sort(sort);

                        query
                            .populate('invoice._id', '_id name');
                        /*.populate('paymentMethod', '_id name');*/

                        query.exec(function (err, result) {
                            if (err) {
                                return waterfallCallback(err);
                            }

                            Employee.populate(result, {
                                path: 'invoice.salesPerson',
                                select: '_id name',
                                options: {lean: true}
                            }, function () {
                                waterfallCallback(null, result);
                            });
                        });
                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

                    async.waterfall(waterfallTasks, function (err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    this.createPayOut = function (req, res, next) {
        var body = req.body;

        var moduleId = returnModuleId(req);
        var isWtrack = req.session.lastDb === 'weTrack';

        var Payment;

        if (isWtrack) {
            Payment = models.get(req.session.lastDb, 'wTrackPayOut', wTrackPayOutSchema);
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
            if (access) {
                var payment = new Payment(body);

                payment.save(function (err, payment) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(payment);
                });

            } else {
                res.status(403).send();
            }
        });

    };

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;

        for (var filterName in filter){
            condition = filter[filterName]['value'];
            key = filter[filterName]['key'];

            switch (filterName) {
                case 'assigned':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'supplier':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'paymentMethod':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'workflow':
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'forSale':
                    condition = ConvertType(condition, 'boolean');
                    filtrElement[key] = condition;
                    resArray.push(filtrElement);
                    break;
            }
        };

        return resArray;
    };

    function ConvertType(element, type) {
        if (type === 'boolean') {
            if (element === 'true') {
                element = true;
            } else if (element === 'false') {
                element = false;
            }
        }

        return element;
    };

    this.create = function (req, res, next) {
        var body = req.body;
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var workflowHandler = new WorkflowHandler(models);
        var invoiceId = body.invoice._id;
        var DbName = req.session.lastDb;

        var moduleId = returnModuleId(req);

        var isWtrack = req.session.lastDb === 'weTrack';
        var Payment;

        if (isWtrack) {
            Payment = models.get(req.session.lastDb, 'wTrackPayment', wTrackPaymentSchema);
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        function fetchInvoice(waterfallCallback) {
            Invoice.findById(invoiceId, waterfallCallback);
        };

        function savePayment(invoice, waterfallCallback) {
            var payment = new Payment(body);

            //payment.paidAmount = invoice.paymentInfo ? invoice.paymentInfo.total : 0;
            payment.name = invoice.sourceDocument;
            payment.whoCanRW = invoice.whoCanRW;
            payment.groups = invoice.groups;
            payment.createdBy.user = req.session.uId;
            payment.editedBy.user = req.session.uId;

            payment.save(function (err, payment) {
                if (err) {
                    return waterfallCallback(err);
                }
                waterfallCallback(null, invoice, payment);
            });
        };

        function invoiceUpdater(invoice, payment, waterfallCallback) {
            var totalToPay = (invoice.paymentInfo) ? invoice.paymentInfo.balance : 0;
            var paid = payment.paidAmount;
            var isNotFullPaid;
            var wId = (DbName === MAINCONSTANTS.WTRACK_DB_NAME) ? 'Sales Invoice' : 'Purchase Invoice';
            var request = {
                query: {
                    wId: wId,
                    source: 'purchase',
                    targetSource: 'invoice'
                },
                session: req.session
            };

            totalToPay = parseFloat(totalToPay);
            paid = parseFloat(paid);

            isNotFullPaid = paid < totalToPay;

            if (isNotFullPaid) {
                request.query.status = 'In Progress';
                request.query.order = 1;
            } else {
                request.query.status = 'Done';
                request.query.order = 1;
            }

            workflowHandler.getFirstForConvert(request, function (err, workflow) {
                if (err) {
                    return waterfallCallback(err);
                }

                invoice.workflow = {
                    _id: workflow._id,
                    name: workflow.name,
                    status: workflow.status
                };
                invoice.paymentInfo.balance = (totalToPay - paid) / 100;
                invoice.paymentInfo.unTaxed += paid / 100;
                invoice.payments.push(payment._id);
                invoice.save(function (err, invoice) {
                    if (err) {
                        return waterfallCallback(err);
                    }

                    waterfallCallback(null, invoice, payment);
                });
            });
        };


        function updateWtrack(invoice, payment, waterfallCallback) {
            var paid = payment.paidAmount || 0;
            var wTrackIds = _.pluck(invoice.products, 'product');

            function updateWtrack(id, cb) {
                var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

                function wTrackFinder(innerWaterfallCb) {
                    wTrack.findById(id, function (err, wTrackDoc) {
                        if (err) {
                            return innerWaterfallCb(err);
                        }
                        innerWaterfallCb(null, wTrackDoc);
                    });
                };

                function wTrackUpdater(wTrackDoc, innerWaterfallCb) {
                    var wTrackAmount;
                    var revenue;
                    var differance;
                    var isPaid;
                    var amount;
                    var err;

                    if (!wTrackDoc) {
                        err = new Error('wTracks are missing');

                        return innerWaterfallCb(err);
                    }

                    if (!wTrackDoc.isPaid) {
                        revenue = wTrackDoc.revenue;
                        wTrackAmount = wTrackDoc.amount;
                        differance = wTrackAmount - revenue; //differance - negative value

                        if ((paid + differance) >= 0) {
                            differance = -differance;
                        } else {
                            differance = paid;
                        }

                        paid -= differance;
                        wTrackAmount += differance;
                        isPaid = revenue === wTrackAmount;

                        wTrackDoc.amount = wTrackAmount / 100;
                        wTrackDoc.isPaid = isPaid;
                        wTrackDoc.save(function (err, saved) {
                            if (err) {
                                return innerWaterfallCb(err);
                            }
                            innerWaterfallCb(null, payment);
                        });
                    } else {
                        innerWaterfallCb(null, payment);
                    }
                };

                async.waterfall([wTrackFinder, wTrackUpdater], cb);
            };

            if (!paid) {
                return waterfallCallback(null, payment);
            }

            async.eachSeries(wTrackIds, updateWtrack, function (err, result) {
                if (err) {
                    return waterfallCallback(err);
                }

                waterfallCallback(null, payment);
            });


        };

        waterfallTasks = [fetchInvoice, savePayment, invoiceUpdater];

        if (DbName === MAINCONSTANTS.WTRACK_DB_NAME) {
            waterfallTasks.push(updateWtrack);
        }

        access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
            if (access) {
                async.waterfall(waterfallTasks, function (err, response) {
                    if (err) {
                        return next(err);
                    }

                    res.status(201).send(response);
                });
            } else {
                res.status(403).send();
            }
        });
    };

    this.totalCollectionLength = function (req, res, next) {
        var forSale = req.params.byType === 'customers';
        var bonus = req.params.byType === 'supplier';

        var queryObject = {};
        var filter = req.query.filter;

        var departmentSearcher;
        var contentIdsSearcher;

        var contentSearcher;
        var waterfallTasks;

        var isWtrack = req.session.lastDb === 'weTrack';
        var Payment;

        if (isWtrack) {
            Payment = models.get(req.session.lastDb, 'wTrackPayment', wTrackPaymentSchema);
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        queryObject.$and = [];

        if (bonus) {
            queryObject.bonus = bonus;
        }

        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                queryObject['$or'] = caseFilter(filter);
            } else {
                queryObject['$and'] = caseFilter(filter);
            }
        }

        queryObject.$and.push({forSale: forSale});

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
            var arrOfObjectId = deps.objectID();

            models.get(req.session.lastDb, "Payment", PaymentSchema).aggregate(
                {
                    $match: {
                        $and: [
                            queryObject,
                            {
                                $or: [
                                    {
                                        $or: [
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.users': objectId(req.session.uId)}
                                                ]
                                            },
                                            {
                                                $and: [
                                                    {whoCanRW: 'group'},
                                                    {'groups.group': {$in: arrOfObjectId}}
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        $and: [
                                            {whoCanRW: 'owner'},
                                            {'groups.owner': objectId(req.session.uId)}
                                        ]
                                    },
                                    {whoCanRW: "everyOne"}
                                ]
                            }
                        ]
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                },
                waterfallCallback
            );
        };

        contentSearcher = function (paymentIds, waterfallCallback) {
            var query;

            query = Payment.find(queryObject);
            query.count(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result});
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;

        var Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);

        var moduleId = returnModuleId(req);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    async.each(body, function (data, cb) {
                        var id = data._id;

                        data.editedBy = {
                            user: uId,
                            date: new Date().toISOString()
                        };

                        if (moduleId === 60) {
                            delete data.paid;
                            delete data.differenceAmount;
                            delete data.paidAmount;
                        }

                        delete data._id;
                        Payment.findByIdAndUpdate(id, {$set: data}, cb);
                    }, function (err) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({success: 'updated'});
                    });
                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var isWtrack = req.session.lastDb === 'weTrack';
        var Payment;

        var moduleId = req.headers.mId || returnModuleId(req);

        if (isWtrack) {
            Payment = models.get(req.session.lastDb, 'wTrackPayment', wTrackPaymentSchema);
        } else {
            Payment = models.get(req.session.lastDb, 'Payment', PaymentSchema);
        }

        access.getDeleteAccess(req, req.session.uId, moduleId, function (access) {
            if (access) {
                Payment.remove({_id: id}, function (err, removed) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({success: removed});
                });
            } else {
                res.send(403);
            }
        });


    };

};

module.exports = Payment;