

var mongoose = require('mongoose');
var WorkflowHandler = require('./workflow');
var RESPONSES = require('../constants/responses');

var Invoice = function (models, event) {
    var access = require("../Modules/additions/access.js")(models);
    var InvoiceSchema = mongoose.Schemas['Invoice'];
    var wTrackInvoiceSchema = mongoose.Schemas['wTrackInvoice'];
    var OrderSchema = mongoose.Schemas['Quotation'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var CustomerSchema = mongoose.Schemas['Customer'];
    var PaymentSchema = mongoose.Schemas['Payment'];
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var JobsSchema = mongoose.Schemas['jobs'];
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var workflowHandler = new WorkflowHandler(models);
    var moment = require('../public/js/libs/moment/moment');
    var _ = require('../node_modules/underscore');

     function checkDb(db){
         var validDbs = ["weTrack", "production", "development"];

         return validDbs.indexOf(db) !== -1;
    };

    this.create = function (req, res, next) {
        var isWtrack = checkDb(req.session.lastDb);
        var body = req.body;
        var Invoice;
        var invoice;

        if(isWtrack){
            Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
        } else {
            Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        }

        invoice = new Invoice(body);

        if (req.session.uId) {
            invoice.createdBy.user = req.session.uId;
            invoice.editedBy.user = req.session.uId;
        }

        invoice.save(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.receive = function (req, res, next) {
        var id = req.body.orderId;
        var forSales = req.body.forSales;
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var wTrackInvoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
        var Order = models.get(req.session.lastDb, 'Quotation', OrderSchema);
        var Company = models.get(req.session.lastDb, 'Customer', CustomerSchema);
        var request;
        var parallelTasks;
        var waterFallTasks;

        function fetchFirstWorkflow(callback) {
            if (forSales === "true") {
                request = {
                    query: {
                        wId: 'Sales Invoice',
                        source: 'purchase',
                        targetSource: 'invoice'
                    },
                    session: req.session
                };
            } else {
                request = {
                    query: {
                        wId: 'Purchase Invoice',
                        source: 'purchase',
                        targetSource: 'invoice'
                    },
                    session: req.session
                };
            }

            workflowHandler.getFirstForConvert(request, callback);
        }

        function findOrder(callback) {
            var query = Order.findById(id).lean();

            query//.populate('supplier', 'name')
                .populate('products.product')
                .populate('products.jobs');

            query.exec(callback)
        };

        function parallel(callback) {
            async.parallel(parallelTasks, callback);
        };

        function createInvoice(parallelResponse, callback) {
            var order;
            var workflow;
            var err;
            var invoice;
            var supplier;
            var company;
            var project;
            var type = "Invoice";
            var query;

            if (parallelResponse && parallelResponse.length) {
                order = parallelResponse[0];
                workflow = parallelResponse[1];
            } else {
                err = new Error(RESPONSES.BAD_REQUEST);
                err.status = 400;

                return callback(err);
            }

            delete order._id;

            if (forSales === "true"){
                invoice = new wTrackInvoice(order);
            } else {
                invoice = new Invoice(order);
            }


            if (req.session.uId) {
                invoice.createdBy.user = req.session.uId;
                invoice.editedBy.user = req.session.uId;
            }

            invoice.sourceDocument = order.name;
            invoice.paymentReference = order.name;
            invoice.workflow = {};
            invoice.workflow._id = workflow._id;
            invoice.workflow.name = workflow.name;
            invoice.workflow.status = workflow.status;
            invoice.paymentInfo.balance = order.paymentInfo.total;

            if (forSales === "true"){
                invoice.project.name = order.project.projectName;
            }


            supplier = order['supplier'];

            //if (supplier) {
            //    invoice.supplier.name = supplier.name.first + ' ' + supplier.name.last;
            //}

            if (forSales === "true") {
                invoice.salesPerson = {};
                invoice.salesPerson._id = order.project.projectmanager._id;
                invoice.salesPerson.name = order.project.projectmanager.name;

                invoice.save(callback);

                async.each(order.products, function (product, cb) {

                    JobsModel.findByIdAndUpdate(product.jobs, {type: type}, {new: true}, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        project = result.get('project');

                        cb();
                    });

                }, function(){
                    if (project){
                        event.emit('fetchJobsCollection', {project: project});
                    }
                });
            } else {
                query = Company.findById(invoice.supplier._id).lean();

                query.populate('salesPurchases.salesPerson', 'name');

                query.exec(function (err, result) {
                    if (err) {
                        callback(err)
                    }

                    if (result && result.salesPurchases.salesPerson) {
                        invoice.salesPerson = {};
                        invoice.salesPerson._id = result.salesPurchases.salesPerson._id;
                        invoice.salesPerson.name = result.salesPurchases.salesPerson.name.first + ' ' + result.salesPurchases.salesPerson.name.last;
                    }

                    invoice.save(callback);
                })

            }

        };

        parallelTasks = [findOrder, fetchFirstWorkflow];
        waterFallTasks = [parallel, createInvoice];

        async.waterfall(waterFallTasks, function (err, result) {
            if (err) {
                return next(err)
            }

            res.status(201).send(result);
        });

    };

    this.updateOnlySelected = function (req, res, next) {
        var id = req.params.id;
        var data = req.body;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 56, function (access) {
                if (access) {

                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };

                    var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);

                    Invoice.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, invoice) {
                        if (err) {
                            next(err);
                        } else {
                            res.status(200).send(invoice);
                        }
                    });

                } else {
                    res.status(403).send();
                }
            });
        } else {
            res.status(401).send();
        }
    };

    this.getAll = function (req, res, next) {
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var query = {};

        Invoice.find(query, function (err, invoices) {
            if (err) {
                return next(err);
            }
            res.status(200).send(invoices);
        });
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

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;

        for (var filterName in filter){
            condition = filter[filterName]['value'];
            key = filter[filterName]['key'];

            switch (filterName) {
                case 'project':
                    if (condition){
                        filtrElement[key] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                        break;
                    }
                case 'salesPerson':
                    if (condition){
                        filtrElement[key] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                        break;
                    }
                case 'supplier':
                    if (condition){
                        filtrElement[key] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                        break;
                    }
                case 'workflow':
                    if (condition){
                        filtrElement[key] = {$in: condition.objectID()};
                        resArray.push(filtrElement);
                        break;
                    }
                case 'forSales':
                    condition = ConvertType(condition, 'boolean');
                    filtrElement[key] = condition;
                    resArray.push(filtrElement);
                    break;
            }
        };

        return resArray;
    };

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 56;
        var forSales = req.query.forSales;

        if (checkDb(db)){
            moduleId = 64
        }

        if (req.session && req.session.loggedIn && db) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    var Invoice = models.get(db, 'Invoice', InvoiceSchema);

                    var query = req.query;
                    var queryObject = {};
                    var filter = query.filter;

                    var optionsObject = {};
                    var sort = {};
                    var count = query.count ? query.count : 100;
                    var page = query.page;
                    var skip = (page - 1) > 0 ? (page - 1) * count : 0;

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if (req.query.sort) {
                        sort = req.query.sort;
                        //} else {
                        //    sort = {"supplier": 1};
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
                        var arrOfObjectId = deps.objectID();

                        models.get(req.session.lastDb, "Invoice", InvoiceSchema).aggregate(
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

                    contentSearcher = function (invoicesIds, waterfallCallback) {
                        optionsObject.$and = [];
                        optionsObject.$and.push({_id: {$in: invoicesIds}});

                        if (filter && typeof filter === 'object') {
                            if (filter.condition === 'or') {
                                optionsObject['$or'] = caseFilter(filter);
                            } else {
                                optionsObject['$and'] = caseFilter(filter);
                            }
                        }

                        if (forSales){
                            optionsObject['$and'].push({forSales: true});
                        } else {
                            optionsObject['$and'].push({forSales: false});

                        }

                        var query = Invoice.find(optionsObject).limit(count).skip(skip).sort(sort);

                        query
                            //.populate('supplier', 'name _id').
                            //populate('salesPerson', 'name _id').
                            .populate('department', '_id departmentName').
                            populate('createdBy.user').
                            populate('editedBy.user').
                            populate('groups.users').
                            populate('groups.group').
                            populate('groups.owner', '_id login').
                            populate('products.jobs');/*.
                            //populate('project', '_id projectName').
                            populate('workflow._id', '-sequence');*/

                        query.lean().exec(waterfallCallback);
                    };

                    waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

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

        } else {
            res.status(401).send();
        }
    };

    this.getInvoiceById = function (req, res, next) {
        var isWtrack = checkDb(req.session.lastDb);
        var moduleId = 56;
        var data = {};

        for (var i in req.query) {
            data[i] = req.query[i];
        }

        var id = data.id;
        var forSales;

        if (isWtrack){
            moduleId = 64
        }

        if (data.forSales === 'false') {
            forSales = false;
        } else {
            forSales = true;
        }

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    var Invoice;
                    var optionsObject = {};

                    var departmentSearcher;
                    var contentIdsSearcher;
                    var contentSearcher;
                    var waterfallTasks;

                    if(isWtrack){
                        if (forSales){
                            Invoice = models.get(req.session.lastDb, 'wTrackInvoice', wTrackInvoiceSchema);
                        } else {
                            Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
                        }
                    } else {
                        Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
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
                        var arrOfObjectId = deps.objectID();

                        models.get(req.session.lastDb, "Invoice", InvoiceSchema).aggregate(
                            {
                                $match: {
                                    $and: [
                                        /*optionsObject,*/
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

                    contentSearcher = function (invoicesIds, waterfallCallback) {


                        optionsObject = {
                            _id: id,
                            forSales: forSales
                        };

                        var query = Invoice.findOne(optionsObject);

                        query.populate('products.product')
                            .populate('products.jobs')
                            .populate('payments', '_id name date paymentRef paidAmount')
                            .populate('department', '_id departmentName')
                            .populate('paymentTerms', '_id name')
                            .populate('createdBy.user')
                            .populate('editedBy.user')
                            .populate('groups.users')
                            .populate('groups.group')
                            .populate('groups.owner', '_id login');

                        query.lean().exec(waterfallCallback);
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

    this.removeInvoice = function (req, res, id, next) {
        var db = req.session.lastDb;
        var moduleId = 56;
        var paymentIds = [];
        var jobs  = [];
        var wTrackIds  = [];
        var invoiceDeleted;
        var Payment = models.get(db, "Payment", PaymentSchema);
        var wTrack = models.get(db, "wTrack", wTrackSchema);
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);

        if (checkDb(db)){
            moduleId = 64
        }

        if (req.session && req.session.loggedIn && db) {
            access.getDeleteAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {

                    models.get(db, "Invoice", InvoiceSchema).findByIdAndRemove(id, function (err, result) {
                        if (err) {
                           return next(err);
                        }

                        invoiceDeleted = result.toJSON();

                        async.each(invoiceDeleted.products, function (product) {
                            jobs.push(product.jobs);
                        });
                        async.each(invoiceDeleted.payments, function (payment) {
                            paymentIds.push(payment);
                        });

                        function paymentsRemove (){
                            async.each(paymentIds, function (id) {
                                Payment.findByIdAndRemove(id, function (err, result) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                   // console.log('success');
                                });
                            });
                        };

                        function jobsUpdateAndWTracks (){
                            var setData = {};
                            var array;

                            async.each(jobs, function (id) {
                                setData.editedBy = {
                                    user: req.session.uId,
                                    date: new Date().toISOString()
                                };

                                setData.type = "Order";

                                JobsModel.findByIdAndUpdate(id, setData, {new: true}, function (err, result) {
                                    if (err) {
                                        return console.log(err);
                                    }

                                    array = result ? result.wTracks : [];

                                    async.each(array, function (id) {
                                        setData.editedBy = {
                                            user: req.session.uId,
                                            date: new Date().toISOString()
                                        };

                                        setData.isPaid = false;
                                        setData.amount = 0;

                                        wTrack.findByIdAndUpdate(id, setData, {new: true}, function (err, result) {
                                            if (err) {
                                                return console.log(err);
                                            }
                                            //  console.log('success');
                                        });
                                    });
                                });
                            });
                        };

                        //function wTrackUpdate (){
                        //    var setData = {};
                        //
                        //    async.each(wTrackIds, function (id) {
                        //        setData.editedBy = {
                        //            user: req.session.uId,
                        //            date: new Date().toISOString()
                        //        };
                        //
                        //        setData.isPaid = false;
                        //        setData.amount = 0;
                        //
                        //        wTrack.findByIdAndUpdate(id, setData, function (err, result) {
                        //            if (err) {
                        //                return console.log(err);
                        //            }
                        //          //  console.log('success');
                        //        });
                        //    });
                        //};

                        async.parallel([paymentsRemove, jobsUpdateAndWTracks], function (err, result) {
                            if (err){
                                next(err)
                            }

                           // console.log('success');

                        });

                        res.status(200).send(result);
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }

    };

    this.updateInvoice = function (req, res, _id, data, next) {
        var db = req.session.lastDb;
        var moduleId = 56;

        if (checkDb(db)){
            moduleId = 64
        }

        if (req.session && req.session.loggedIn && db) {
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                if (access) {
                    var Invoice = models.get(db, 'Invoice', InvoiceSchema);
                    //data.editedBy = {
                    //    user: req.session.uId,
                    //    date: new Date().toISOString()
                    //}

                    //if (data.supplier && data.supplier._id) {
                    //    data.supplier = data.supplier._id;
                    //}

                    Invoice.findByIdAndUpdate(_id, data.invoice, {new: true}, function (err, result) {

                        if (err) {
                            next(err);
                        } else {
                            res.status(200).send(result);
                        }
                    })

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }

    };

    this.totalCollectionLength = function (req, res, next) {
        var data = req.query;
        var filter = data.filter;
        //var forSales = data.forSales;

        var optionsObject = {};
        var result = {};

        result['showMore'] = false;

        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);

        var departmentSearcher;
        var contentIdsSearcher;
        var contentSearcher;
        var waterfallTasks;

        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                optionsObject['$or'] = caseFilter(filter);
            } else {
                optionsObject['$and'] = caseFilter(filter);
            }
        }

        //if (forSales){
        //    optionsObject['$and'].push({forSales: false});
        //} else {
        //    optionsObject['$and'].push({forSales: true });
        //
        //}

        departmentSearcher = function (waterfallCallback) {
            models.get(req.session.lastDb, "Invoice", InvoiceSchema).aggregate(
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

            models.get(req.session.lastDb, "Invoice", InvoiceSchema).aggregate(
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

        contentSearcher = function (invoicesIds, waterfallCallback) {
            var query;
            var queryObject = ({_id: {$in: invoicesIds}});

            query = Invoice.find(queryObject);
            query.exec(waterfallCallback);
        };

        waterfallTasks = [departmentSearcher, contentIdsSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, invoice) {
            if (err) {
                return next(err);
            } else {

                result['count'] = invoice.length;
                res.status(200).send(result);
            }
        });
    };

    this.generateName = function (req, res, next) {
        var project = req.query.projectId;
        var currentDbName = req.session ? req.session.lastDb : null;
        var db = currentDbName ? models.connection(currentDbName) : null;
        var date = moment().format('DD/MM/YYYY');

        db.collection('settings').findOneAndUpdate({
                dbName: currentDbName,
                name: 'invoice',
                project: project
            },
            {
                $inc: {seq: 1}
            },
            {
                returnOriginal: false,
                upsert: true
            },
            function (err, rate) {
                var resultName;

                if (err) {
                    return next(err);
                }

                resultName = rate.value.seq + '-' + date;
                res.status(200).send(resultName) ;
            });
    };

    this.getFilterValues = function (req, res, next) {
        var EmployeeSchema = mongoose.Schemas['Employee'];
        var Invoice = models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);


        async.waterfall([
            function (cb) {
                Invoice
                    .aggregate([
                        {
                            $group:{
                                _id: null,
                                'Due date': {
                                    $addToSet: '$dueDate'
                                }/*,
                                'salesPerson': {
                                    $addToSet: '$salesPerson'
                                }*/
                            }
                        }
                    ], function (err, invoice) {
                        if (err) {
                            cb(err)

                        } else {
                            cb(null, invoice)
                        }

                    })
            }/*,
            function (invoice, cb) {
                Employee
                    .populate(invoice , {
                        path: 'salesPerson',
                        model: Employee,
                        select: 'name _id'
                    },
                    function (err, invoice) {
                        if (err) {
                            return cb(err)

                        }
                            cb(null, invoice)

                })
            }*/

        ], function (err, result) {
            if (err) {
               return next(err)
            }

            _.map(result[0], function(value, key) {
                switch (key) {
                    case 'salesPerson':
                        result[0][key] = _.sortBy(value, 'name');
                        break;;

                }
            });
            res.status(200).send(result)
        })
    };

};

module.exports = Invoice;