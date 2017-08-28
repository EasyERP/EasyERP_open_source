'use strict';
require('pmx').init();

module.exports = function (app, mainDb) {
    var event = require('../helpers/eventstHandler')(app, mainDb);
    var RESPONSES = require('../constants/responses');
    var CONSTANTS = require('../constants/mainConstants');
    var _ = require('../public/js/libs/underscore-min.map.1.6.0.js');
    var fs = require('fs');
    var dbsNames = app.get('dbsNames');
    var dbsObject = mainDb.dbsObject;
    var models = require('../helpers/models.js')(dbsObject);
    var productRouter = require('./product')(models, event);
    var orderRouter = require('./order')(models, event);
    var ordersRouter = require('./orders')(models, event);
    var invoicesRouter = require('./invoices')(models, event);
    var invoiceRouter = require('./invoice')(models, event);
    var proformaRouter = require('./proforma')(models, event);
    var supplierRouter = require('./supplier')(models);
    var quotationRouter = require('./quotation')(models, event);
    var destinationRouter = require('./destination')(models);
    var goodsInRouter = require('./goodsIn')(models, event);
    var incotermRouter = require('./incoterm')(models);
    var weeklySchedulerRouter = require('./weeklyScheduler')(models);
    var scheduledPayRouter = require('./scheduledPay')(models);
    var payrollComponentTypesRouter = require('./payrollComponentTypes')(models);
    var invoicingControlRouter = require('./invoicingControl')(models);
    var paymentTermRouter = require('./paymentTerm')(models);
    var deliverToTermRouter = require('./deliverTo')(models);
    var workflowRouter = require('./workflow')(models, event);
    var paymentRouter = require('./payment')(models, event);
    var paymentMethodRouter = require('./paymentMethod')(models, event);
    var periodRouter = require('./period')(models);
    var projectRouter = require('./project')(models, event);
    var employeeRouter = require('./employee')(event, models);
    var nationalityRouter = require('./nationality')(event, models);
    var languageRouter = require('./language')(event, models);
    var applicationRouter = require('./application')(event, models);
    var projectMemberRouter = require('./projectMember')(models, event);
    var departmentRouter = require('./department')(models, event);
    var revenueRouter = require('./revenue')(models);
    var wTrackRouter = require('./wTrack')(event, models);
    var opportunityRouter = require('./opportunity')(models, event);
    var leadsRouter = require('./leads')(models, event);
    var jobPositionRouter = require('./jobPosition')(models, event);
    var holidayRouter = require('./holiday')(event, models);
    var modulesRouter = require('./modules')(models);
    var monthHoursRouter = require('./monthHours')(event, models);
    var vacationRouter = require('./vacation')(event, models);
    var bonusTypeRouter = require('./bonusType')(models, event);
    var dashboardRouter = require('./dashboard')(models);
    var expensesInvoiceRouter = require('./expensesInvoice')(models, event);
    var dividendInvoiceRouter = require('./dividendInvoice')(models, event);
    var filterRouter = require('./filter')(models);
    var industryRouter = require('./industry')(models);
    var productCategoriesRouter = require('./productCategories')(models, event);
    var customersRouter = require('./customers')(models, event);
    var goodsOutRouter = require('./goodsOut')(models, event);
    var purchaseOrdersRouter = require('./purchaseOrders')(models, event);
    var ratesRouter = require('./rates')(models, event);
    var shippingMethodRouter = require('./shippingMethod')(models, event);
    var workCentresRouter = require('./workCentres')(models, event);
    var routingRouter = require('./routing')(models, event);
    var manufacturingOrderRouter = require('./manufacturingOrder')(models, event);

    var personsRouter = require('./person')(models, event);
    var capacityRouter = require('./capacity')(models);
    var payRollRouter = require('./payroll')(models);
    var importFileRouter = require('./importFile')(models);
    var paymentTypeRouter = require('./paymentType')(models);
    var payrollExprnsesRouter = require('./payrollExprnses')(models);
    var jobsRouter = require('./jobs')(models, event);
    var chartOfAccountRouter = require('./chartOfAccount')(models, event);
    var currencyRouter = require('./currency')(models);
    var prPositionRouter = require('./projectPosition')(models);
    var journalRouter = require('./journals')(models, event);
    var salaryReportRouter = require('./salaryReport')(models);
    var userRouter = require('./user')(event, models, mainDb);
    var campaignRouter = require('./campaign')(models);
    var orgSettingsRouter = require('./orgSettings')(models);
    var degreesRouter = require('./degrees')(models);
    var profilesRouter = require('./profiles')(models);
    var tasksRouter = require('./tasks')(models, event);
    var tagRouter = require('./tags')(models, event);
    var dealTasksRouter = require('./dealTasks')(models, event);
    var journalEntriesRouter = require('./journalEntries')(models, event);
    var writeOffRouter = require('./writeOff')(models, event);
    var payrollStructureTypesRouter = require('./payrollStructureTypes')(models);
    var cashTransferRouter = require('./cashTransfer')(models, event);
    var countriesRouter = require('./countries')(models);
    var contractJobsRouter = require('./contractJobs')(models);
    var projectsDashboardRouter = require('./projectsDashboard')(models);
    var followersRouter = require('./followers')(models);
    var accountTypesRouter = require('./accountTypes')(models);
    var warehouseRouter = require('./warehouse')(models, event);
    var accountsCategoriesRouter = require('./accountsCategories')(models);
    var priceListRouter = require('./priceList')(models);
    var integrationRouter = require('./integration')(models, event);
    var purchaseInvoicesRouter = require('./purchaseInvoices')(models, event);
    var stockTransactionRouter = require('./stockTransaction')(models, event);
    var stockInventoryRouter = require('./stockInventory')(models, event);
    var channelRouter = require('./channel')(models, event);
    var taxSettingsRouter = require('./taxSettings')(models, event);
    var reportsRouter = require('./reports')(models, event);
    var imagesRouter = require('./images')(models, event);
    var stockReturnsRouter = require('./stockReturns')(models, event);
    var expensesCategoriesRouter = require('./expensesCategories')(models, event);
    var customReportRouter = require('./customReports')(models);
    var demoDataRouter = require('./demoData')(mainDb, models, event);
    var webHooksRouter = require('./webHooks')(models);
    var syncLogsRouter = require('./syncLogs')(models);
    var billOfMaterials = require('./billOfMaterials')(models);

    var customChartRouter = require('./customChart')(models);
    var customDashboardRouter = require('./dashboards')(models);
    var logger = require('../helpers/logger');
    var tracker = require('../helpers/tracker.js');
    var geoip = require('geoip-lite');
    var subdomainParser = require('../helpers/subdomain.js');
    var exportToPdf = require('../helpers/pdfExtractor');
    var async = require('async');
    var redisStore = require('../helpers/redisClient');
    var MagentoConnector = require('../helpers/magentoConnector.js');
    var geoip = require('geoip-lite');
    var apiKey = 'a548ba44867cc5ffa30217683ce466f6';
    var getResponse = new require('getresponse-nodejs-api')(apiKey);

    var magento = new MagentoConnector(models);

    var sessionValidator = function (req, res, next) {
        var session = req.session;
        var month = 2678400000;

        if (session) {
            if (session.rememberMe) {
                session.cookie.maxAge = month;
            } else {
                session.cookie.maxAge = CONSTANTS.SESSION_TTL;
            }
        }

        next();
    };

    var tempFileCleaner = function (req, res, next) {
        res.on('finish', function () {
            if (req.files) {
                Object.keys(req.files).forEach(function (file) {
                    fs.unlink(req.files[file].path, function (err) {
                        if (err) {
                            logger.error(err);
                        }
                    });
                });
            }
        });

        next();
    };
    var instance = parseInt(process.env.NODE_APP_INSTANCE, 10) || 0;
    var brokerType = instance === 0 ? 'consumer' : 'publisher';
    var rmOptions = {
        host    : process.env.RABBITMQ_HOST,
        port    : process.env.RABBITMQ_PORT,
        login   : process.env.RABBITMQ_USER,
        password: process.env.RABBITMQ_PASSWORD
    };
    var syncHelper;
    var RM;
    var rm;

    if (!parseInt(process.env.NODE_APP_INSTANCE, 10)) {
        brokerType = 'polymorph';
    }

    console.log('brokerType', brokerType);
    console.log('NODE_APP_INSTANCE', process.env.NODE_APP_INSTANCE);

    RM = require('../helpers/rm')(dbsNames, event, models);
    rm = new RM({
        brokerType: brokerType
    });

    // rm.connect(rmOptions);

    global.rm = rm;

    syncHelper = require('../helpers/sync')(rm, models, event);

    console.log('\x1b[32m%s\x1b[0m', '=====================================================');
    console.log('\x1b[32m%s\x1b[0m', '           Server start in ' + brokerType + ' mode');
    console.log('\x1b[32m%s\x1b[0m', '=====================================================');

    require('../helpers/arrayExtender');
    require('../helpers/stringExtender');

    app.use(sessionValidator);
    app.use(tempFileCleaner);

    app.set('logger', logger);

    // requestHandler = require('../requestHandler.js')(app, event, mainDb);
    app.get('/', function (req, res, next) {
        res.sendfile('index.html');
    });

    app.use('/filter', filterRouter);
    app.use('/products', productRouter);
    app.use('/orders', orderRouter);
    app.use('/invoices', invoiceRouter);
    app.use('/invoice', invoicesRouter);
    app.use('/proforma', proformaRouter);
    app.use('/expensesInvoice', expensesInvoiceRouter);
    app.use('/dividendInvoice', dividendInvoiceRouter);
    app.use('/supplier', supplierRouter);
    app.use('/quotations', quotationRouter);
    app.use('/destination', destinationRouter);
    app.use('/incoterm', incotermRouter);
    app.use('/invoicingControl', invoicingControlRouter);
    app.use('/order', ordersRouter);
    app.use('/goodsOutNotes', goodsOutRouter);
    app.use('/goodsInNotes', goodsInRouter);
    app.use('/stockTransactions', stockTransactionRouter);
    app.use('/stockInventory', stockInventoryRouter);
    app.use('/paymentTerm', paymentTermRouter);
    app.use('/deliverTo', deliverToTermRouter);
    app.use('/weeklyScheduler', weeklySchedulerRouter);
    app.use('/scheduledPay', scheduledPayRouter);
    app.use('/payrollComponentTypes', payrollComponentTypesRouter);
    app.use('/workflows', workflowRouter);
    app.use('/payments', paymentRouter);
    app.use('/period', periodRouter);
    app.use('/organizationSettings', orgSettingsRouter);
    app.use('/paymentMethod', paymentMethodRouter);
    app.use('/importFile', importFileRouter);
    app.use('/wTrack', wTrackRouter);
    app.use('/projects', projectRouter);
    app.use('/employees', employeeRouter);
    app.use('/nationality', nationalityRouter);
    app.use('/language', languageRouter);
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
    app.use('/modules', modulesRouter);
    app.use('/bonusType', bonusTypeRouter);
    app.use('/industry', industryRouter);
    app.use('/dashboard', dashboardRouter);
    app.use('/dealTasks', dealTasksRouter);
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
    app.use('/tags', tagRouter);
    app.use('/users', userRouter);
    app.use('/writeOff', writeOffRouter);
    app.use('/payrollStructureTypes', payrollStructureTypesRouter);
    app.use('/cashTransfer', cashTransferRouter);
    app.use('/countries', countriesRouter);
    app.use('/contractJobs', contractJobsRouter);
    app.use('/projectsDashboard', projectsDashboardRouter);
    app.use('/followers', followersRouter);
    app.use('/customChart', customChartRouter);
    app.use('/dashboards', customDashboardRouter);
    app.use('/accountTypes', accountTypesRouter);
    app.use('/warehouse', warehouseRouter);
    app.use('/accountsCategories', accountsCategoriesRouter);
    app.use('/priceList', priceListRouter);
    app.use('/purchaseOrders', purchaseOrdersRouter);
    app.use('/purchaseInvoices', purchaseInvoicesRouter);
    app.use('/channels', channelRouter);
    app.use('/taxSettings', taxSettingsRouter);
    app.use('/rates', ratesRouter);
    app.use('/reports', reportsRouter);
    app.use('/shippingMethod', shippingMethodRouter);
    app.use('/image', imagesRouter);
    app.use('/stockReturns', stockReturnsRouter);
    app.use('/expensesCategories', expensesCategoriesRouter);
    app.use('/clearDemoData', demoDataRouter);
    app.use('/syncLogs', syncLogsRouter);
    app.use('/manufacturingOrders', manufacturingOrderRouter);
    app.use('/workCentre', workCentresRouter);
    app.use('/routing', routingRouter);
    app.use('/billOfMaterials', billOfMaterials);

    app.use('/webhooks', webHooksRouter);

    // <editor-fold desc="Integration">
    app.use('/integration', integrationRouter);
    // </editor-fold>

    /**
     *@api {get} /getDBS/ Request DBS
     *
     * @apiVersion 0.0.1
     * @apiName getDBS
     * @apiGroup Index File
     *
     * @apiSuccess {String} DBS
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     {
         "dbsNames": {
             "sergey": {
                 "DBname": "sergey",
                 "url": "144.76.56.111"
             },
             "pavlodb": {
                 "DBname": "pavlodb",
                 "url": "144.76.56.111"
             },
             "romadb": {
                 "DBname": "romadb",
                 "url": "144.76.56.111"
             },
             "vasyadb": {
                 "DBname": "vasyadb",
                 "url": "144.76.56.111"
             },
             "fabio_lunardi": {
                 "DBname": "fabio_lunardi",
                 "url": "144.76.56.111"
             },
             "alexKhutor": {
                 "DBname": "alexKhutor",
                 "url": "144.76.56.111"
             },
             "lilyadb": {
                 "DBname": "lilyadb",
                 "url": "144.76.56.111"
             },
             "micheldb": {
                 "DBname": "micheldb",
                 "url": "144.76.56.111"
             },
             "alex": {
                 "DBname": "alex",
                 "url": "144.76.56.111"
             }
         }
     }
     */
    app.get('/getDBS', function (req, res) {
        res.send(200, {dbsNames: dbsNames});
    });

    app.post('/exportToPdf', exportToPdf.post);
    app.get('/exportToPdf', exportToPdf.get);

    /**
     *@api {get} /currentDb/ Request CurrentDb
     *
     * @apiVersion 0.0.1
     * @apiName getCurrentDb
     * @apiGroup Index File
     *
     * @apiSuccess {String} CurrentDb
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     "vasyadb"
     */
    app.get('/currentDb', function (req, res, next) {
        if (req.session && req.session.lastDb) {
            res.status(200).send(req.session.lastDb);
        } else {
            res.status(401).send();
        }
    });

    /**
     *@api {get} /account/authenticated/ Request for checking authentication
     *
     * @apiVersion 0.0.1
     * @apiName getAuthStatus
     * @apiGroup Index File
     *
     * @apiSuccess {String} AuthStatus
     * @apiSuccessExample Success-Response:
     HTTP/1.1 200 OK
     "OK"
     */
    app.get('/account/authenticated', function (req, res, next) {
        if (req.session && req.session.loggedIn) {
            res.send(200);
        } else {
            res.send(401);
        }
    });

    app.get('/download/:path', function (req, res) {
        var path = req.param('path');

        res.download(path);
    });

    app.get('/logout', function (req, res, next) {
        var session = req.session;

        if (session) {
            session.destroy(function (err) {
                if (err) {
                    return next(err);
                }
            });

        }

        res.clearCookie('lastDb');
        res.redirect('/#login');
    });

    app.get('/clearCashStorage', function (req, res, next) {
        redisStore.removeAllStorages(function (err) {
            if (err) {
                return next(err);
            }

            mainDb.collection('sessions').remove(function (err) {
                if (err) {
                    return next(err);
                }
            });

            event.emit('clearAllCashedData');
            res.status(200).send({success: 'All cash cleaned success'});
        });
    });

    app.post('/consumer', magento.getConsumerKeyAndSecret);
    app.get('/callback', magento.getOAuthAccessToken);

    app.get('/sync', syncHelper.syncAll);

    app.get('/addToSync', syncHelper.getToSync);

    app.post('/track', function (req, res) {
        var RegExp = /production|test_demo/;
        var body = req.body;
        var ip = req.headers ? req.headers['x-real-ip'] : req.ip;
        var geo = geoip.lookup(ip);
        var sendLetter = false;

        function mapper(body) {
            body.ip = ip;
            body.country = (!body.country && geo) ? geo.country : '';
            body.city = (!body.city && geo) ? geo.city : '';
            body.region = (!body.region && geo) ? geo.region : '';

            body.registrType = process.env.SERVER_TYPE;
            body.server = process.env.SERVER_PLATFORM;

            if (body.name === 'close' || body.name === 'sessionEnd') {
                sendLetter = true;
            }
        }

        ip = ip || '127.0.0.1';

        if (body instanceof Array) {
            body.map(mapper);
        } else {
            mapper(body);
        }

        res.status(200).send();

        if (!RegExp.test(process.env.SERVER_TYPE)) {
            tracker.track(body);
        }
    });

    app.get('/stopserver', function () {
        process.exit(1);
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
            res.status(status).send({error: err.message});
        } else {
            res.status(status).send({error: err.message + '\n' + err.stack});
        }

        if (status !== 401) {
            logger.error(err.message + '\n' + err.stack);
        }
    }

    app.use(notFound);
    app.use(errorHandler);
};
