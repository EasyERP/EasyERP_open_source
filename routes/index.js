require('pmx').init();

module.exports = function (app, mainDb) {
    'use strict';

    // var newrelic = require('newrelic');
    var events = require('events');
    var event = new events.EventEmitter();
    var logWriter = require('../helpers/logWriter');
    var RESPONSES = require('../constants/responses');
    var fs = require('fs');
    var dbsNames = app.get('dbsNames');
    var dbsObject = mainDb.dbsObject;
    var models = require('../helpers/models.js')(dbsObject);
    var productRouter = require('./product')(models);
    var orderRouter = require('./order')(models, event);
    var invoiceRouter = require('./invoice')(models, event);
    var proformaRouter = require('./proforma')(models, event);
    var supplierRouter = require('./supplier')(models);
    var quotationRouter = require('./quotation')(models, event);
    var destinationRouter = require('./destination')(models);
    var incotermRouter = require('./incoterm')(models);
    var weeklySchedulerRouter = require('./weeklyScheduler')(models);
    var payrollComponentTypesRouter = require('./payrollComponentTypes')(models);
    var invoicingControlRouter = require('./invoicingControl')(models);
    var paymentTermRouter = require('./paymentTerm')(models);
    var deliverToTermRouter = require('./deliverTo')(models);
    var workflowRouter = require('./workflow')(models, event);
    var paymentRouter = require('./payment')(models, event);
    var paymentMethodRouter = require('./paymentMethod')(models);
    var periodRouter = require('./period')(models);
    //var importDataRouter = require('./importData')(models);
    var projectRouter = require('./project')(models, event);
    var employeeRouter = require('./employee')(event, models);
    var applicationRouter = require('./application')(event, models);
    var projectMemberRouter = require('./projectMember')(models, event);
    var departmentRouter = require('./department')(models, event);
    var revenueRouter = require('./revenue')(models);
    var wTrackRouter = require('./wTrack')(event, models);
    var salaryRouter = require('./salary')(event, models);
    var opportunityRouter = require('./opportunity')(models, event);
    var leadsRouter = require('./leads')(models, event);
    var jobPositionRouter = require('./jobPosition')(models);
    var holidayRouter = require('./holiday')(event, models);
    var monthHoursRouter = require('./monthHours')(event, models);
    var vacationRouter = require('./vacation')(event, models);
    var bonusTypeRouter = require('./bonusType')(models);
    var dashboardRouter = require('./dashboard')(models);
    var expensesInvoiceRouter = require('./expensesInvoice')(models, event);
    var dividendInvoiceRouter = require('./dividendInvoice')(models, event);
    var filterRouter = require('./filter')(models);
    var productCategoriesRouter = require('./productCategories')(models, event);
    var customersRouter = require('./customers')(models, event);
    var personsRouter = require('./person')(models, event);
    var capacityRouter = require('./capacity')(models);
    var payRollRouter = require('./payroll')(models);
    var importFileRouter = require('./importFile')(models);
    var paymentTypeRouter = require('./paymentType')(models);
    var payrollExprnsesRouter = require('./payrollExprnses')(models);
    var jobsRouter = require('./jobs')(models, event);
    var chartOfAccountRouter = require('./chartOfAccount')(models);
    var currencyRouter = require('./currency')(models);
    var prPositionRouter = require('./projectPosition')(models);
    var journalRouter = require('./journals')(models, event);
    var salaryReportRouter = require('./salaryReport')(models);
    var userRouter = require('./user')(event, models);
    var campaignRouter = require('./campaign')(models);
    var degreesRouter = require('./degrees')(models);
    var profilesRouter = require('./profiles')(models);
    var tasksRouter = require('./tasks')(models, event);
    var journalEntriesRouter = require('./journalEntries')(models, event);

    var logger = require('../helpers/logger');

    var async = require('async');

    var requestHandler;

    app.set('logger', logger);

    // requestHandler = require('../requestHandler.js')(app, event, mainDb);

    app.get('/', function (req, res, next) {
        res.sendfile('index.html');
    });

    app.use('/filter', filterRouter);
    app.use('/product', productRouter);
    app.use('/orders', orderRouter);
    app.use('/invoices', invoiceRouter);
    app.use('/proforma', proformaRouter);
    app.use('/expensesInvoice', expensesInvoiceRouter);
    app.use('/dividendInvoice', dividendInvoiceRouter);
    app.use('/supplier', supplierRouter);
    app.use('/quotations', quotationRouter);
    app.use('/destination', destinationRouter);
    app.use('/incoterm', incotermRouter);
    app.use('/invoicingControl', invoicingControlRouter);
    app.use('/paymentTerm', paymentTermRouter);
    app.use('/deliverTo', deliverToTermRouter);
    app.use('/weeklyScheduler', weeklySchedulerRouter);
    app.use('/payrollComponentTypes', payrollComponentTypesRouter);
    app.use('/workflows', workflowRouter);
    app.use('/payment', paymentRouter);
    app.use('/period', periodRouter);
    app.use('/paymentMethod', paymentMethodRouter);
    //app.use('/importData', importDataRouter);
    app.use('/importFile', importFileRouter);
    app.use('/wTrack', wTrackRouter);
    app.use('/projects', projectRouter);
    app.use('/employees', employeeRouter);
    app.use('/applications', applicationRouter);
    app.use('/departments', departmentRouter);
    app.use('/revenue', revenueRouter);
    app.use('/salaryReport', salaryReportRouter);
    app.use('/opportunities', opportunityRouter);
    app.use('/leads', leadsRouter);
    app.use('/jobPositions', jobPositionRouter);
    app.use('/holiday', holidayRouter);
    app.use('/vacation', vacationRouter);
    app.use('/monthHours', monthHoursRouter);
    app.use('/bonusType', bonusTypeRouter);
    app.use('/dashboard', dashboardRouter);
    app.use('/category', productCategoriesRouter);
    app.use('/customers', customersRouter);
    app.use('/companies', customersRouter);
    app.use('/persons', personsRouter);
    app.use('/capacity', capacityRouter);
    app.use('/payroll', payRollRouter);
    app.use('/jobs', jobsRouter);
    app.use('/paymentType', paymentTypeRouter);
    app.use('/payrollExprnses', payrollExprnsesRouter);
    app.use('/chartOfAccount', chartOfAccountRouter);
    app.use('/currency', currencyRouter);
    app.use('/projectPosition', prPositionRouter);
    app.use('/projectMember', projectMemberRouter);
    app.use('/journals', journalRouter);
    app.use('/journalEntries', journalEntriesRouter);
    app.use('/campaigns', campaignRouter);
    app.use('/degrees', degreesRouter);
    app.use('/profiles', profilesRouter);
    app.use('/tasks', tasksRouter);
    app.get('/getDBS', function (req, res) {
        res.send(200, {dbsNames: dbsNames});
    });

    app.get('/currentDb', function (req, res, next) {
        if (req.session && req.session.lastDb) {
            res.status(200).send(req.session.lastDb);
        } else {
            res.status(401).send();
        }
    });

    app.get('/account/authenticated', function (req, res, next) {
        if (req.session && req.session.loggedIn) {
            res.send(200);
        } else {
            res.send(401);
        }
    });

   /* app.get('/getModules', function (req, res) {
        requestHandler.getModules(req, res);
    });
*/
    app.get('/download/:path', function (req, res) {
        var path = req.param('path');
        
        res.download(path);
    });

    app.get('/logout', function (req, res, next) {
        if (req.session) {
            req.session.destroy(function () {
            });

        }
        res.clearCookie('lastDb');
        res.redirect('/#login');
    });

    app.use('/users', userRouter);

    app.get('/:id', function (req, res, next) {
        var id = req.param('id');
        if (!isNaN(parseFloat(id))) {
            requestHandler.redirectFromModuleId(req, res, id);
        } else {
            next();
        }
    });

    app.get('/clean', function (req, res, next) {
        var dbId = req.session.lastDb;
        var db = dbsObject[dbId];
        var collections = ['Project', 'wTrack', 'Invoice', 'Quotation', 'Payment', 'jobs', 'savedFilters', 'payOut'];
        var collection;

        async.each(collections, function (colName, cb) {
            collection = db.collection(colName);
            collection.drop(function (err, reply) {
                if (err) {
                    return cb(err);
                }

                cb();
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send('droped');
        });
    });

    function notFound(req, res, next) {
        res.status(404);

        if (req.accepts('html')) {
            return res.send(RESPONSES.PAGE_NOT_FOUND);
        }

        if (req.accepts('json')) {
            return res.json({error: RESPONSES.PAGE_NOT_FOUND});
        }

        res.type('txt');
        res.send(RESPONSES.PAGE_NOT_FOUND);

    }

    function errorHandler(err, req, res, next) {
        var status = err.status || 500;

        if (process.env.NODE_ENV === 'production') {
            if (status === 401) {
                logWriter.log('', err.message + '\n' + err.message)
            }
            res.status(status).send({error: err.message});
        } else {
            res.status(status).send({error: err.message + '\n' + err.stack});
            logger.error(err.message + '\n' + err.stack);
        }
    }

    // requestHandler.initScheduler();

    app.use(notFound);
    app.use(errorHandler);
};
