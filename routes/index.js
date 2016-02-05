require('pmx').init();

module.exports = function (app, mainDb) {
    'use strict';

    //var newrelic = require('newrelic');
    var events = require('events');
    var event = new events.EventEmitter();
    var logWriter = require('../helpers/logWriter');
    var RESPONSES = require('../constants/responses');
    var fs = require("fs");
    var multipart = require('connect-multiparty');
    var multipartMiddleware = multipart();
    var mongoose = mainDb.mongoose;
    var dbsNames = app.get('dbsNames');
    var dbsObject = mainDb.dbsObject;
    var models = require("../models.js")(dbsObject);
    var productRouter = require('./product')(models);
    var orderRouter = require('./order')(models, event);
    var invoiceRouter = require('./invoice')(models, event);
    var supplierRouter = require('./supplier')(models);
    var quotationRouter = require('./quotation')(models, event);
    var destinationRouter = require('./destination')(models);
    var incotermRouter = require('./incoterm')(models);
    var invoicingControlRouter = require('./invoicingControl')(models);
    var paymentTermRouter = require('./paymentTerm')(models);
    var deliverToTermRouter = require('./deliverTo')(models);
    var workflowRouter = require('./workflow')(models);
    var paymentRouter = require('./payment')(models, event);
    var paymentMethodRouter = require('./paymentMethod')(models);
    var periodRouter = require('./period')(models);
    var importDataRouter = require('./importData')(models);
    var projectRouter = require('./project')(models);
    var employeeRouter = require('./employee')(event, models);
    var applicationRouter = require('./application')(event, models);
    var departmentRouter = require('./department')(models);
    var departmentRouter = require('./department')(models);
    var revenueRouter = require('./revenue')(models);
    var wTrackRouter = require('./wTrack')(event, models);
    var salaryRouter = require('./salary')(event, models);
    var opportunityRouter = require('./opportunity')(models, event);
    var leadsRouter = require('./leads')(models, event);
    var taskRouter = require('./task')(models);
    var jobPositionRouter = require('./jobPosition')(models);
    var holidayRouter = require('./holiday')(event, models);
    var monthHoursRouter = require('./monthHours')(event, models);
    var vacationRouter = require('./vacation')(event, models);
    var bonusTypeRouter = require('./bonusType')(models);
    var dashboardRouter = require('./dashboard')(models);
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
    var journalRouter = require('./journal')(models);
    var salaryReportRouter = require('./salaryReport')(models);
    var userRouter = require('./user')(event, models);
    var campaignRouter = require('./campaign')(models);
    var degreesRouter = require('./degrees')(models);

    var logger = require('../helpers/logger');

    var async = require('async');

    var requestHandler;

    /*var winston = require('winston');
    var logger = new (winston.Logger)({
        transports       : [
            new (winston.transports.Console)({
                json     : false,
                timestamp: true
            }),
            new (winston.transports.File)({
                name: 'infoFile',
                filename: 'info.log',
                level: 'info',
                json     : false,
                maxsize: 1024 * 1024 * 10
            }),
            new (winston.transports.File)({
                name: 'errorFile',
                filename: 'error.log',
                json     : false,
                level: 'error',
                maxsize: 1024 * 1024 * 10
            })
        ],
        exceptionHandlers: [
            new (winston.transports.Console)({
                json     : false,
                timestamp: true
            }),
            new winston.transports.File({
                filename: 'exceptions.log',
                json    : false
            })
        ],
        exitOnError      : false
    });*/

    app.set('logger', logger);

    requestHandler = require("../requestHandler.js")(app, event, mainDb);

    app.get('/', function (req, res, next) {
        res.sendfile('index.html');
    });

    app.use('/filter', filterRouter);
    app.use('/product', productRouter);
    app.use('/order', orderRouter);
    app.use('/invoice', invoiceRouter);
    app.use('/supplier', supplierRouter);
    app.use('/quotation', quotationRouter);
    app.use('/destination', destinationRouter);
    app.use('/incoterm', incotermRouter);
    app.use('/invoicingControl', invoicingControlRouter);
    app.use('/paymentTerm', paymentTermRouter);
    app.use('/deliverTo', deliverToTermRouter);
    app.use('/workflow', workflowRouter);
    app.use('/payment', paymentRouter);
    app.use('/period', periodRouter);
    app.use('/paymentMethod', paymentMethodRouter);
    app.use('/importData', importDataRouter);
    app.use('/importFile', importFileRouter);
    app.use('/wTrack', wTrackRouter);
    app.use('/project', projectRouter);
    app.use('/employees', employeeRouter);
    app.use('/applications', applicationRouter);
    app.use('/departments', departmentRouter);
    app.use('/revenue', revenueRouter);
    app.use('/salaryReport', salaryReportRouter);
    app.use('/opportunities', opportunityRouter);
    app.use('/leads', leadsRouter);
    app.use('/task', taskRouter);
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
    app.use('/journal', journalRouter);
    app.use('/campaigns', campaignRouter);
    app.use('/degrees', degreesRouter);
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

    app.get('/getModules', function (req, res) {
        requestHandler.getModules(req, res);
    });

    app.post('/uploadFiles', multipartMiddleware, function (req, res, next) {
        var os = require("os");
        var osType = (os.type().split('_')[0]);
        var dir;
        switch (osType) {
            case "Windows":
            {
                dir = __dirname + "\\uploads\\";
            }
                break;
            case "Linux":
            {
                dir = __dirname + "\/uploads\/";
            }
        }
        fs.readdir(dir, function (err, files) {
            if (err) {
                fs.mkdir(dir, function (errr) {
                    if (!errr) {
                        dir += req.headers.id;
                    }
                    fs.mkdir(dir, function (errr) {
                        if (!errr) {
                            uploadFileArray(req, res, function (files) {
                                requestHandler.uploadFile(req, res, req.headers.id, files);
                            });
                        }
                    });
                });
            } else {
                dir += req.headers.id;
                fs.readdir(dir, function (err, files) {
                    if (err) {
                        fs.mkdir(dir, function (errr) {
                            if (!errr) {
                                uploadFileArray(req, res, function (files) {
                                    requestHandler.uploadFile(req, res, req.headers.id, files);
                                });
                            }
                        });
                    } else {
                        uploadFileArray(req, res, function (files) {
                            requestHandler.uploadFile(req, res, req.headers.id, files);
                        });
                    }
                });
            }
        });
    });

    app.get('/download/:path', function (req, res) {
        var path = req.param('path');
        res.download(__dirname + path);
    });

    function uploadFileArray(req, res, callback) {
        var files = [];
        if (req.files && req.files.attachfile && !req.files.attachfile.length) {
            req.files.attachfile = [req.files.attachfile];
        }
        var path;
        var os = require("os");
        var osType = (os.type().split('_')[0]);

        req.files.attachfile.forEach(function (item) {
            var localPath;
            switch (osType) {
                case "Windows":
                {
                    localPath = __dirname + "\\uploads\\" + req.headers.id;
                }
                    break;
                case "Linux":
                {
                    localPath = __dirname + "\/uploads\/" + req.headers.id;
                }
            }
            fs.readdir(localPath, function (err, files) {
                if (!err) {
                    var k = '';
                    var maxK = 0;
                    var checkIs = false;
                    var attachfileName = item.name.slice(0, item.name.lastIndexOf('.'));
                    files.forEach(function (fileName) {
                        if (fileName == item.name) {
                            k = 1;
                            checkIs = true;
                        } else {
                            if ((fileName.indexOf(attachfileName) === 0) &&
                                (fileName.lastIndexOf(attachfileName) === 0) &&
                                (fileName.lastIndexOf(').') !== -1) &&
                                (fileName.lastIndexOf('(') !== -1) &&
                                (fileName.lastIndexOf('(') < fileName.lastIndexOf(').')) &&
                                (attachfileName.length == fileName.lastIndexOf('('))) {
                                var intVal = fileName.slice(fileName.lastIndexOf('(') + 1, fileName.lastIndexOf(').'));
                                k = parseInt(intVal) + 1;
                            }
                        }
                        if (maxK < k) {
                            maxK = k;
                        }
                    });
                    if (!(maxK == 0) && checkIs) {
                        item.name = attachfileName + '(' + maxK + ')' + item.name.slice(item.name.lastIndexOf('.'));
                    }
                }
            });

            fs.readFile(item.path, function (err, data) {
                var shortPas;
                switch (osType) {
                    case "Windows":
                    {
                        path = __dirname + "\\uploads\\" + req.headers.id + "\\" + item.name;
                        shortPas = "\\uploads\\" + req.headers.id + "\\" + item.name;
                    }
                        break;
                    case "Linux":
                    {
                        path = __dirname + "\/uploads\/" + req.headers.id + "\/" + item.name;
                        shortPas = "\/uploads\/" + req.headers.id + "\/" + item.name;
                    }
                }
                fs.writeFile(path, data, function (err) {
                    if (!err) {
                        var file = {};
                        file._id = mongoose.Types.ObjectId();
                        file.name = item.name;
                        file.shortPas = encodeURIComponent(shortPas);
                        if (item.size >= 1024) {
                            file.size = (Math.round(item.size / 1024 / 1024 * 1000) / 1000) + '&nbsp;Mb';
                        }
                        else {
                            file.size = (Math.round(item.size / 1024 * 1000) / 1000) + '&nbsp;Kb';
                        }
                        file.uploadDate = new Date();
                        file.uploaderName = req.session.uName;
                        files.push(file);

                        if (files.length == req.files.attachfile.length) {
                            if (callback) {
                                callback(files);
                            }
                        }
                    } else {
                        console.log(err);
                        res.send(500);
                    }

                });
            });
        });

    }

    app.post('/uploadApplicationFiles', multipartMiddleware, function (req, res, next) {
        var os = require("os");
        var osType = (os.type().split('_')[0]);
        var dir;
        switch (osType) {
            case "Windows":
            {
                dir = __dirname + "\\uploads\\";
            }
                break;
            case "Linux":
            {
                dir = __dirname + "\/uploads\/";
            }
        }
        fs.readdir(dir, function (err, files) {
            if (err) {
                fs.mkdir(dir, function (errr) {
                    if (!errr) {
                        dir += req.headers.id;
                    }
                    fs.mkdir(dir, function (errr) {
                        if (!errr) {
                            uploadFileArray(req, res, function (files) {
                                requestHandler.uploadApplicationFile(req, res, req.headers.id, files);
                            });
                        }
                    });
                });
            } else {
                dir += req.headers.id;
                fs.readdir(dir, function (err, files) {
                    if (err) {
                        fs.mkdir(dir, function (errr) {
                            if (!errr) {
                                uploadFileArray(req, res, function (files) {
                                    requestHandler.uploadApplicationFile(req, res, req.headers.id, files);
                                });
                            }
                        });
                    } else {
                        uploadFileArray(req, res, function (files) {
                            requestHandler.uploadApplicationFile(req, res, req.headers.id, files);
                        });
                    }
                });
            }
        });
    });

    //app.post('/uploadEmployeesFiles', multipartMiddleware, function (req, res, next) {
    //    var os = require("os");
    //    var osType = (os.type().split('_')[0]);
    //    var dir;
    //    switch (osType) {
    //        case "Windows":
    //        {
    //            dir = __dirname + "\\uploads\\";
    //        }
    //            break;
    //        case "Linux":
    //        {
    //            dir = __dirname + "\/uploads\/";
    //        }
    //    }
    //    fs.readdir(dir, function (err, files) {
    //        if (err) {
    //            fs.mkdir(dir, function (errr) {
    //                if (!errr) {
    //                    dir += req.headers.id;
    //                }
    //                fs.mkdir(dir, function (errr) {
    //                    if (!errr) {
    //                        uploadFileArray(req, res, function (files) {
    //                            requestHandler.uploadEmployeesFile(req, res, req.headers.id, files);
    //                        });
    //                    }
    //                });
    //            });
    //        } else {
    //            dir += req.headers.id;
    //            fs.readdir(dir, function (err, files) {
    //                if (err) {
    //                    fs.mkdir(dir, function (errr) {
    //                        if (!errr) {
    //                            uploadFileArray(req, res, function (files) {
    //                                requestHandler.uploadEmployeesFile(req, res, req.headers.id, files);
    //                            });
    //                        }
    //                    });
    //                } else {
    //                    uploadFileArray(req, res, function (files) {
    //                        requestHandler.uploadEmployeesFile(req, res, req.headers.id, files);
    //                    });
    //                }
    //            });
    //        }
    //    });
    //});

    app.post('/uploadProjectsFiles', multipartMiddleware, function (req, res, next) {
        var os = require("os");
        var osType = (os.type().split('_')[0]);
        var dir;
        switch (osType) {
            case "Windows":
            {
                dir = __dirname + "\\uploads\\";
            }
                break;
            case "Linux":
            {
                dir = __dirname + "\/uploads\/";
            }
        }
        fs.readdir(dir, function (err, files) {
            if (err) {
                fs.mkdir(dir, function (errr) {
                    if (!errr) {
                        dir += req.headers.id;
                    }
                    fs.mkdir(dir, function (errr) {
                        if (!errr) {
                            uploadFileArray(req, res, function (files) {
                                requestHandler.uploadProjectsFiles(req, res, req.headers.id, files);
                            });
                        }
                    });
                });
            } else {
                dir += req.headers.id;
                fs.readdir(dir, function (err, files) {
                    if (err) {
                        fs.mkdir(dir, function (errr) {
                            if (!errr) {
                                uploadFileArray(req, res, function (files) {
                                    requestHandler.uploadProjectsFiles(req, res, req.headers.id, files);
                                });
                            }
                        });
                    } else {
                        uploadFileArray(req, res, function (files) {
                            requestHandler.uploadProjectsFiles(req, res, req.headers.id, files);
                        });
                    }
                });
            }
        });
    });

    app.post('/uploadTasksFiles', multipartMiddleware, function (req, res, next) {
        var os = require("os");
        var osType = (os.type().split('_')[0]);
        var dir;
        switch (osType) {
            case "Windows":
            {
                dir = __dirname + "\\uploads\\";
            }
                break;
            case "Linux":
            {
                dir = __dirname + "\/uploads\/";
            }
        }
        fs.readdir(dir, function (err, files) {
            if (err) {
                fs.mkdir(dir, function (errr) {
                    if (!errr) {
                        dir += req.headers.id;
                    }
                    fs.mkdir(dir, function (errr) {
                        if (!errr) {
                            uploadFileArray(req, res, function (files) {
                                requestHandler.uploadTasksFiles(req, res, req.headers.id, files);
                            });
                        }
                    });
                });
            } else {
                dir += req.headers.id;
                fs.readdir(dir, function (err, files) {
                    if (err) {
                        fs.mkdir(dir, function (errr) {
                            if (!errr) {
                                uploadFileArray(req, res, function (files) {
                                    requestHandler.uploadTasksFiles(req, res, req.headers.id, files);
                                });
                            }
                        });
                    } else {
                        uploadFileArray(req, res, function (files) {
                            requestHandler.uploadTasksFiles(req, res, req.headers.id, files);
                        });
                    }
                });
            }
        });
    });

    app.post('/uploadOpportunitiesFiles', multipartMiddleware, function (req, res, next) {
        var os = require("os");
        var osType = (os.type().split('_')[0]);
        var dir;
        switch (osType) {
            case "Windows":
            {
                dir = __dirname + "\\uploads\\";
            }
                break;
            case "Linux":
            {
                dir = __dirname + "\/uploads\/";
            }
        }

        fs.readdir(dir, function (err, files) {
            if (err) {
                fs.mkdir(dir, function (errr) {
                    if (!errr) {
                        dir += req.headers.id;
                    }
                    fs.mkdir(dir, function (errr) {
                        if (!errr) {
                            uploadFileArray(req, res, function (files) {
                                requestHandler.uploadOpportunitiesFiles(req, res, req.headers.id, files);
                            });
                        }
                    });
                });
            } else {
                dir += req.headers.id;
                fs.readdir(dir, function (err, files) {
                    if (err) {
                        fs.mkdir(dir, function (errr) {
                            if (!errr) {
                                uploadFileArray(req, res, function (files) {
                                    requestHandler.uploadOpportunitiesFiles(req, res, req.headers.id, files);
                                });
                            }
                        });
                    } else {
                        uploadFileArray(req, res, function (files) {
                            requestHandler.uploadOpportunitiesFiles(req, res, req.headers.id, files);
                        });
                    }
                });
            }
        });
    });

    app.get('/logout', function (req, res, next) {
        if (req.session) {
            req.session.destroy(function () {
            });

        }
        res.clearCookie('lastDb');
        res.redirect('/#login');
    });

    /*app.post('/login', function (req, res, next) {
        requestHandler.login(req, res, next);
    });*/

    /*app.post('/Users', function (req, res) {
        var data = {};
        data.user = req.body;
        requestHandler.createUser(req, res, data);
    });*/

    app.get('/UserWithProfile', function (req, res) {
        var id = req.param('_id');
        requestHandler.getAllUserWithProfile(req, id, res);
    });

    app.get('/Users', function (req, res) {
        var data = {};
        data.page = req.param('page');
        data.count = req.param('count');
        requestHandler.getUsers(req, res, data);
    });

    app.get('/currentUser', function (req, res) {
        requestHandler.currentUser(req, res);
    });

    app.post('/currentUser', function (req, res) {
        var data = {};
        if (req.body.oldpass && req.body.pass) {
            data.changePass = true;
        }
        requestHandler.updateCurrentUser(req, res, data);
    });

    app.patch('/currentUser', function (req, res) {
        var data = {};
        if (req.body) {
            data.savedFilters = req.body;
        }

        requestHandler.updateCurrentUser(req, res, data);
    });

    app.use('/users', userRouter);
    app.use('/currentUser', userRouter);

   /* app.patch('/currentUser/:_id', function (req, res) {
        var data = {};
        if (req.body.oldpass && req.body.pass) {
            data.changePass = true;
        }
        requestHandler.updateCurrentUser(req, res, data);
    });*/

    app.get('/UsersForDd', function (req, res) {
        requestHandler.getUsersForDd(req, res);
    });

    app.get('/Users/:viewType', function (req, res) {
        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }
        var viewType = req.params.viewType;
        switch (viewType) {
            case "form":
                requestHandler.getUserById(req, res, data);
                break;
            default:
                requestHandler.getFilterUsers(req, res);
                break;
        }
    });

    app.patch('/Users/:_id', function (req, res) {
        var data = {};
        var id = req.param('_id');
        data.user = req.body;
        requestHandler.updateUser(req, res, id, data);
    });

    /*app.delete('/Users/:_id', function (req, res) {
        var id = req.param('_id');
        requestHandler.removeUser(req, res, id);
    });*/

    app.post('/Profiles', function (req, res) {
        var data = {};
        data.profile = req.body;
        requestHandler.createProfile(req, res, data);
    });

    app.get('/Profiles', function (req, res) {
        requestHandler.getProfile(req, res);
    });

    app.get('/ProfilesForDd', function (req, res) {
        requestHandler.getProfileForDd(req, res);
    });

    app.put('/Profiles/:_id', function (req, res) {
        var data = {};
        var id = req.param('_id');
        data.profile = req.body;
        requestHandler.updateProfile(req, res, id, data);
    });

    app.delete('/Profiles/:_id', function (req, res) {
        var id = req.param('_id');
        requestHandler.removeProfile(req, res, id);
    });

//-----------------END----Users--and Profiles-----------------------------------------------

//-----------------------------getTotalLength---------------------------------------------
    app.get('/totalCollectionLength/:contentType', function (req, res, next) {
        switch (req.params.contentType) {
            //case ('Persons'):
            //    requestHandler.customerTotalCollectionLength(req, res);
            //    break;
            //case ('Companies'):
            //    requestHandler.customerTotalCollectionLength(req, res);
            //    break;
            //case ('ownCompanies'):
            //    requestHandler.customerTotalCollectionLength(req, res);
            //    break;
            case ('Projects'):
                requestHandler.projectsTotalCollectionLength(req, res);
                break;
            case ('Tasks'):
                requestHandler.projectsTotalCollectionLength(req, res);
                break;
            //case ('Leads'):
            //    requestHandler.opportunitiesTotalCollectionLength(req, res);
            //    break;
            //case ('Opportunities'):
            //    requestHandler.opportunitiesTotalCollectionLength(req, res);
            //    break;
            //case ('Employees'):
            //    requestHandler.employeesTotalCollectionLength(req, res);
            //    break;
            //case ('Applications'):
            //    requestHandler.employeesTotalCollectionLength(req, res);
            //    break;
            //case ('JobPositions'):
            //    requestHandler.jobPositionsTotalCollectionLength(req, res);
            //    break;
            case ('Users'):
                requestHandler.usersTotalCollectionLength(req, res);
                break;
            default:
                next();
        }
    });
//------------------------END--getTotalLength---------------------------------------------

//----------------------Accounts----------------------------------------------------------------

    //app.get('/getPersonsForDd', function (req, res) {
    //    requestHandler.getPersonsForDd(req, res);
    //});

    //app.get('/getPersonAlphabet', function (req, res) {
    //    requestHandler.getCustomersAlphabet(req, res);
    //});

    //app.get('/getPersonsForMiniView', function (req, res) {
    //    var data = {};
    //    for (var i in req.query) {
    //        data[i] = req.query[i];
    //    }
    //    requestHandler.getFilterPersonsForMiniView(req, res, data);
    //
    //});

//--------------------------Customers----------------------------------------------------------

    //app.get('/Customer', function (req, res) {
    //    var data = {};
    //    for (var i in req.query) {
    //        data[i] = req.query[i];
    //    }
    //    requestHandler.getCustomer(req, res, data);
    //});

//Get images for persons or companies or owncompanies
//    app.get('/getCustomersImages', function (req, res) {
//        requestHandler.getCustomersImages(req, res);
//    });

//----------------------------Persons---------------------------------------------------------

    //app.post('/Persons', function (req, res) {
    //    var data = {};
    //    data.person = req.body;
    //    requestHandler.createPerson(req, res, data);
    //});

    //app.get('/Persons/:viewType', function (req, res) {
    //    var data = {};
    //    for (var i in req.query) {
    //        data[i] = req.query[i];
    //    }
    //    var viewType = req.params.viewType;
    //    switch (viewType) {
    //        case "form":
    //            requestHandler.getPersonById(req, res, data);
    //            break;
    //        default:
    //            requestHandler.getFilterCustomers(req, res);
    //            break;
    //    }
    //});

    //app.put('/Persons/:_id', function (req, res) {
    //    var data = {};
    //    var id = req.params._id;
    //    var remove = req.headers.remove;
    //
    //    data.person = req.body;
    //    requestHandler.updatePerson(req, res, id, data, remove);
    //});

    //app.patch('/Persons/:_id', function (req, res) {
    //    var id = req.params._id;
    //
    //    requestHandler.personUpdateOnlySelectedFields(req, res, id, req.body);
    //});

    //app.delete('/Persons/:_id', function (req, res) {
    //    var id = req.param('_id');
    //    requestHandler.removePerson(req, res, id);
    //});

//---------------------------Projects--------------------------------------------------------

    app.get('/projectType', function (req, res) {
        requestHandler.getProjectType(req, res);
    });

    app.get('/Projects/form/:_id', function (req, res) {
        var data = {};
        data.id = req.params._id;
        requestHandler.getProjectsById(req, res, data);
    });

    app.get('/getProjectsForDd', requestHandler.getProjectsForDd);

    //app.get('/getProjectPMForDashboard', function (req, res) {
    //    requestHandler.getProjectPMForDashboard(req, res);
    //});
    app.get('/getProjectStatusCountForDashboard', function (req, res) {
        requestHandler.getProjectStatusCountForDashboard(req, res);
    });

    app.get('/getProjectByEndDateForDashboard', function (req, res) {
        requestHandler.getProjectByEndDateForDashboard(req, res);
    });

    app.post('/Projects', function (req, res) {
        var data = {};
        data.project = req.body;
        requestHandler.createProject(req, res, data);
    });

    app.patch('/Projects/:_id', function (req, res) {
        var id = req.param('_id');
        requestHandler.updateOnlySelectedFields(req, res, id, req.body);
    });

    app.put('/Projects/:_id', function (req, res) {
        var data = {};
        var id = req.param('_id');
        var remove = req.headers.remove;
        data.project = req.body;
        requestHandler.updateProject(req, res, id, data, remove);
    });
    app.delete('/Projects/:_id', function (req, res) {
        var id = req.params._id;
        requestHandler.removeProject(req, res, id);
    });

    app.get('/Projects/:viewType', function (req, res, next) {
        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }
        var viewType = req.params.viewType;
        switch (viewType) {
            case "form":
                requestHandler.getProjectsById(req, res, data);
                break;
            case "list":
                requestHandler.getProjectsForList(req, res, data);
                break;
            default:
                requestHandler.getProjects(req, res, data, next);
                break;
        }
    });

//--------------Tasks----------------------------------------------------------
    app.get('/getTasksLengthByWorkflows', function (req, res) {
        var options = {};
        for (var i in req.query) {
            options[i] = req.query[i];
        }
        requestHandler.getTasksLengthByWorkflows(req, options, res);
    });

    app.post('/Tasks', function (req, res) {
        var data = {};
        data.task = req.body;
        requestHandler.createTask(req, res, data);
    });

    app.get('/Tasks/:viewType', function (req, res) {
        var data = req.query;
        var viewType = req.params.viewType;
        switch (viewType) {
            case "form":
                requestHandler.getTaskById(req, res, data);
                break;
            case "list":
                requestHandler.getTasksForList(req, res, data);
                break;
            case "kanban":
                requestHandler.getTasksForKanban(req, res, data);
                break;
        }
    });

    app.get('/Priority', function (req, res) {
        requestHandler.getTasksPriority(req, res);
    });

    app.put('/Tasks/:_id', function (req, res) {
        var data = {};
        var id = req.param('_id');
        data.task = req.body;
        var remove = req.headers.remove;
        requestHandler.updateTask(req, res, id, data, remove);
    });

    app.patch('/Tasks/:_id', function (req, res) {
        var id = req.param('_id');
        requestHandler.taskUpdateOnlySelectedFields(req, res, id, req.body);
    });

    app.delete('/Tasks/:_id', function (req, res) {
        var id = req.param('_id');
        requestHandler.removeTask(req, res, id);
    });

//------------------Workflows---------------------------------------------------

    app.get('/relatedStatus', function (req, res) {
        var data = {};
        data.type = req.param('type');
        requestHandler.getRelatedStatus(req, res, data);
    });

    app.get('/Workflows', function (req, res) {
        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }
        requestHandler.getWorkflow(req, res, data);
    });

    app.get('/WorkflowContractEnd', function (req, res) {
        var data = {};
        data.id = req.param('id');
        requestHandler.getWorkflowContractEnd(req, res, data);
    });

    app.get('/WorkflowsForDd', function (req, res) {
        var data = {};
        var type = {};
        type.id = req.param('id');
        data.type = type;
        requestHandler.getWorkflowsForDd(req, res, data);
    });

    app.get('/taskWorkflows', function (req, res) {
        var data = {};
        var type = {};
        data.mid = req.param('mid');
        type.id = "Task";
        data.type = type;
        requestHandler.getWorkflowsForDd(req, res, data);
    });

    app.get('/projectWorkflows', function (req, res) {
        var data = {};
        var type = {};
        type.name = 'project';
        type.id = "Project";
        data.type = type;
        requestHandler.getWorkflowsForDd(req, res, data);
    });

    app.post('/Workflows', function (req, res) {
        var data = {};
        data.mid = req.headers.mid;
        for (var i in req.body) {
            data[i] = req.body[i];
        }
        data._id = req.body.wId;
        requestHandler.createWorkflow(req, res, data);
    });

    app.put('/Workflows/:_id', function (req, res) {
        var data = {};
        var _id = req.param('_id');
        data.status = req.body.status;
        data.name = req.body.name;
        requestHandler.updateWorkflow(req, res, _id, data);
    });

    app.patch('/Workflows/:_id', function (req, res) {
        var data = {};
        var _id = req.param('_id');
        for (var i in req.body) {
            data[i] = req.body[i];
        }
        requestHandler.updateWorkflowOnlySelectedField(req, res, _id, data);
    });

    app.delete('/Workflows/:_id', function (req, res) {
        var _id = req.param('_id');
        requestHandler.removeWorkflow(req, res, _id);
    });
//-------------------Companies--------------------------------------------------

    //app.post('/Companies', function (req, res) {
    //    var data = {};
    //
    //    data.company = req.body;
    //    requestHandler.createCompany(req, res, data);
    //});
    //app.get('/CompaniesForDd', function (req, res) {
    //    requestHandler.getCompaniesForDd(req, res);
    //});

    //app.get('/Companies/:viewType', function (req, res) {
    //    var data = {};
    //    for (var i in req.query) {
    //        data[i] = req.query[i];
    //    }
    //    var viewType = req.params.viewType;
    //    switch (viewType) {
    //        case "form":
    //            requestHandler.getCompanyById(req, res, data);
    //            break;
    //        default:
    //            requestHandler.getFilterCustomers(req, res);
    //            break;
    //    }
    //});

    //app.put('/Companies/:_id', function (req, res) {
    //    var data = {};
    //    for (var i in req.query) {
    //        data[i] = req.query[i];
    //    }
    //    var id = req.param('_id');
    //    var remove = req.headers.remove;
    //
    //    data.mid = req.headers.mid;
    //    data.company = req.body;
    //
    //    if (data.company.salesPurchases.salesPerson && (typeof (data.company.salesPurchases.salesPerson) == 'object')) {
    //        data.company.salesPurchases.salesPerson = data.company.salesPurchases.salesPerson._id;
    //    }
    //    if (data.company.salesPurchases.salesTeam && (typeof (data.company.salesPurchases.salesTeam) == 'object')) {
    //        data.company.salesPurchases.salesTeam = data.company.salesPurchases.salesTeam._id;
    //    }
    //
    //    requestHandler.updateCompany(req, res, id, data, remove);
    //});

    //app.patch('/Companies/:_id', function (req, res) {
    //    var id = req.param('_id');
    //    requestHandler.companyUpdateOnlySelectedFields(req, res, id, req.body);
    //});

    //app.delete('/Companies/:_id', function (req, res) {
    //    var id = req.param('_id');
    //    requestHandler.removeCompany(req, res, id);
    //});

    //app.get('/getCompaniesAlphabet', function (req, res) {
    //    requestHandler.getCustomersAlphabet(req, res);
    //});

//------------------JobPositions---------------------------------------------------
//    app.get('/nationality', function (req, res) {
//        requestHandler.getNationality(req, res);
//    });

    //app.get('/jobType', function (req, res) {
    //    requestHandler.getJobType(req, res);
    //});

    //app.post('/JobPositions', function (req, res) {
    //    var data = {};
    //    data.jobPosition = req.body;
    //    requestHandler.createJobPosition(req, res, data);
    //});

    //app.get('/JobPositionForDd', function (req, res) {
    //    requestHandler.getJobPositionForDd(req, res);
    //});

    //app.get('/JobPositions/:viewType', function (req, res) {
    //    var data = {};
    //    for (var i in req.query) {
    //        data[i] = req.query[i];
    //    }
    //    var viewType = req.params.viewType;
    //    switch (viewType) {
    //        case "form":
    //            requestHandler.getJobPositionById(req, res, data);
    //            break;
    //        default:
    //            requestHandler.getFilterJobPosition(req, res);
    //            break;
    //    }
    //
    //});

    //app.patch('/JobPositions/:_id', function (req, res) {
    //    var data = {};
    //    var id = req.param('_id');
    //    data.jobPosition = req.body;
    //    requestHandler.updateJobPosition(req, res, id, data);
    //});

    //app.put('/JobPositions/:_id', function (req, res) {
    //    var data = {};
    //    var id = req.param('_id');
    //    data.jobPosition = req.body;
    //    requestHandler.updateJobPosition(req, res, id, data);
    //});

    //app.delete('/JobPositions/:_id', function (req, res) {
    //    var id = req.param('_id');
    //    requestHandler.removeJobPosition(req, res, id);
    //});

//------------------Departments---------------------------------------------------
//    app.get('/Departments', function (req, res) {
//        requestHandler.getDepartment(req, res);
//    });

    //app.get('/DepartmentsForDd', function (req, res) {
    //    requestHandler.getDepartmentForDd(req, res);
    //});

    //app.post('/Departments', function (req, res) {
    //    var data = {};
    //    data.department = req.body;
    //    requestHandler.createDepartment(req, res, data);
    //});

    //app.get('/Departments/:viewType', function (req, res) {
    //    var data = {};
    //    for (var i in req.query) {
    //        data[i] = req.query[i];
    //    }
    //    var viewType = req.params.viewType;
    //    switch (viewType) {
    //        case "form":
    //            requestHandler.getDepartmentById(req, res, data);
    //            break;
    //        default:
    //            requestHandler.getCustomDepartment(req, res, data);
    //            break;
    //    }
    //
    //});

    //app.put('/Departments/:_id', function (req, res) {
    //    var data = {};
    //    var id = req.param('_id');
    //    data.department = req.body;
    //    requestHandler.updateDepartment(req, res, id, data);
    //});

    //app.delete('/Departments/:_id', function (req, res) {
    //    var id = req.param('_id');
    //    requestHandler.removeDepartment(req, res, id);
    //});
    //app.get('/getDepartmentsForEditDd', function (req, res) {
    //    var id = req.param('id');
    //    requestHandler.getDepartmentForEditDd(req, res, id);
    //});

//------------------Employee---------------------------------------------------

    app.get('/Birthdays', function (req, res) {
        requestHandler.Birthdays(req, res);
    });

    //app.get('/getForDdByRelatedUser', function (req, res) {
    //    requestHandler.getForDdByRelatedUser(req, res);
    //});

    //app.get('/Employees/:viewType', function (req, res) {
    //    var data = {};
    //    for (var i in req.query) {
    //        data[i] = req.query[i];
    //    }
    //    var viewType = req.params.viewType;
    //    switch (viewType) {
    //        case "list":
    //            requestHandler.getEmployeesFilter(req, res);
    //            break;
    //        case "thumbnails":
    //            requestHandler.getEmployeesFilter(req, res);
    //            break;
    //        case "form":
    //            requestHandler.getEmployeesById(req, res);
    //            break;
    //    }
    //
    //});

    //app.post('/Employees', function (req, res) {
    //    var data = {};
    //    data.employee = req.body;
    //    requestHandler.createEmployee(req, res, data);
    //});

    //app.put('/Employees/:_id', function (req, res) {
    //    var data = {};
    //    var id = req.body._id;
    //    data.employee = req.body;
    //});

    //app.patch('/Employees/:_id', function (req, res) {
    //    var id = req.param('_id');
    //    requestHandler.employeesUpdateOnlySelectedFields(req, res, id, req.body);
    //});

    //app.delete('/Employees/:_id', function (req, res) {
    //    var id = req.param('_id');
    //    requestHandler.removeEmployees(req, res, id);
    //});

    //app.get('/getSalesPerson', function (req, res) {
    //    var data = {};
    //    requestHandler.getPersonsForDd(req, res, data);
    //});

    //app.get('/getSalesTeam', function (req, res) {
    //    requestHandler.getDepartmentForDd(req, res);
    //});

    //app.get('/getEmployeesAlphabet', function (req, res) {
    //    requestHandler.getEmployeesAlphabet(req, res);
    //});

    //app.get('/getEmployeesImages', function (req, res) {
    //    var data = {};
    //    data.ids = req.param('ids') || [];
    //    requestHandler.getEmployeesImages(req, res, data);
    //});

//------------------Applications---------------------------------------------------

    //app.get('/getApplicationsLengthByWorkflows', function (req, res) {
    //    requestHandler.getApplicationsLengthByWorkflows(req, res);
    //});

    //app.get('/Applications/:viewType', function (req, res) {
    //    var data = {};
    //    for (var i in req.query) {
    //        data[i] = req.query[i];
    //    }
    //    var viewType = req.params.viewType;
    //    switch (viewType) {
    //        case "form":
    //            requestHandler.getApplicationById(req, res, data);
    //            break;
    //        case "list":
    //            requestHandler.getEmployeesFilter(req, res);
    //            break;
    //        case "kanban":
    //            requestHandler.getApplicationsForKanban(req, res, data);
    //            break;
    //    }
    //
    //});

    //app.post('/Applications', function (req, res) {
    //    var data = {};
    //    data.employee = req.body;
    //    requestHandler.createApplication(req, res, data);
    //});

    //app.put('/Applications/:_id', function (req, res) {
    //    var data = {};
    //    var id = req.body._id;
    //    data.employee = req.body;
    //    requestHandler.updateApplication(req, res, id, data);
    //});

    //app.patch('/Applications/:_id', function (req, res) {
    //    var id = req.param('_id');
    //    requestHandler.aplicationUpdateOnlySelectedFields(req, res, id, req.body);
    //});

    //app.delete('/Applications/:_id', function (req, res) {
    //    var id = req.param('_id');
    //    requestHandler.removeApplication(req, res, id);
    //});

    //app.get('/Degrees', function (req, res) {
    //    requestHandler.getDegrees(req, res);
    //});

    //app.post('/Degrees', function (req, res) {
    //    var data = {};
    //    data.degree = req.body;
    //    requestHandler.createDegree(req, res, data);
    //});

    //app.put('/Degrees/:_id', function (req, res) {
    //    var data = {};
    //    var id = req.param('_id');
    //    data.degree = req.body;
    //    requestHandler.updateDegree(req, res, id, data);
    //});

    //app.delete('/Degrees/:_id', function (req, res) {
    //    var id = req.param('_id');
    //    requestHandler.removeDegree(req, res, id);
    //});

//----------------------campaign----------------------------------------------------------------
//    app.get('/Campaigns', function (req, res) {
//        requestHandler.getCampaigns(req, res);
//    });

    //app.get('/sources', function (req, res) {
    //    requestHandler.getSources(req, res);
    //});
    //app.get('/Languages', function (req, res) {
    //    requestHandler.getLanguages(req, res);
    //});

//----------------------Leads----------------------------------------------------------------
//    app.get('/LeadsForChart', function (req, res) {
//        var data = {};
//        data.source = req.param('source');
//        data.dataRange = req.param('dataRange');
//        data.dataItem = req.param('dataItem');
//        requestHandler.getLeadsForChart(req, res, data);
//    });

    //app.get('/Leads/:viewType', function (req, res) {
    //    var data = {};
    //    for (var i in req.query) {
    //        data[i] = req.query[i];
    //    }
    //    var viewType = req.params.viewType;
    //    switch (viewType) {
    //        case "form":
    //            requestHandler.getLeadsById(req, res, data);
    //            break;
    //        case "list":
    //            requestHandler.getFilterOpportunities(req, res);
    //            break;
    //    }
    //});

    //app.post('/Leads', function (req, res) {
    //    var data = {};
    //    data.lead = req.body;
    //    requestHandler.createLead(req, res, data);
    //});

    //app.put('/Leads/:_id', function (req, res) {
    //    var data = {};
    //    var id = req.param('_id');
    //    data.lead = req.body;
    //    requestHandler.updateLead(req, res, id, data);
    //});
    //app.patch('/Leads/:_id', function (req, res) {
    //    var data = {};
    //    var id = req.param('_id');
    //    data.lead = req.body;
    //    requestHandler.updateLead(req, res, id, data);
    //});

    //app.delete('/Leads/:_id', function (req, res) {
    //    var id = req.param('_id');
    //    requestHandler.removeLead(req, res, id);
    //});

//---------------------Opportunities---------------------
//    app.post('/Opportunities', function (req, res) {
//        var data = {};
//        data.opportunitie = req.body;
//        requestHandler.createOpportunitie(req, res, data);
//    });
//    app.get('/Opportunities/:viewType', function (req, res) {
//        var data = {};
//        for (var i in req.query) {
//            data[i] = req.query[i];
//        }
//        var viewType = req.params.viewType;
//        switch (viewType) {
//            case "form":
//                requestHandler.getOpportunityById(req, res, data);
//                break;
//            case "kanban":
//                requestHandler.getFilterOpportunitiesForKanban(req, res, data);
//                break;
//            default:
//                requestHandler.getFilterOpportunities(req, res);
//        }
//    });

    //app.get('/OpportunitiesForMiniView', function (req, res) {
    //    var data = {};
    //    for (var i in req.query) {
    //        data[i] = req.query[i];
    //    }
    //    requestHandler.getFilterOpportunitiesForMiniView(req, res, data);
    //
    //});

    //app.get('/getLengthByWorkflows', function (req, res) {
    //    requestHandler.getOpportunitiesLengthByWorkflows(req, res);
    //});

    //app.put('/Opportunities/:_id', function (req, res) {
    //    var data = {};
    //    var id = req.param('_id');
    //    data.toBeConvert = req.headers.toBeConvert;
    //    data.opportunitie = req.body;
    //    requestHandler.updateOpportunitie(req, res, id, data);
    //});

    //app.patch('/Opportunities/:_id', function (req, res) {
    //    var data = {};
    //    var id = req.param('_id');
    //    data.toBeConvert = req.headers.toBeConvert;
    //    data.opportunitie = req.body;
    //    requestHandler.opportunitieUpdateOnlySelectedFields(req, res, id, data);
    //});
    //app.delete('/Opportunities/:_id', function (req, res) {
    //    var id = req.param('_id');
    //    requestHandler.removeOpportunitie(req, res, id);
    //});
    app.get('/:id', function (req, res, next) {
        var id = req.param('id');
        if (!isNaN(parseFloat(id))) {
            requestHandler.redirectFromModuleId(req, res, id);
        } else {
            next();
        }
    });

    //ToDo remove it after test
   /* app.get('/unlinkWtracks', function (req, res, next) {
        require('..//models/index.js');

        var mongoose = require('mongoose');
        var ObjectId = mongoose.Schema.Types.ObjectId;
        var async = require('async');
        var _ = require('lodash');

        var WtrackSchema = mongoose.Schemas['wTrack'];
        var QuotationSchema = mongoose.Schemas['Quotation'];
        var JobSchema = mongoose.Schemas['jobs'];

        var dbObject = mongoose.createConnection('localhost', 'production');
        dbObject.on('error', console.error.bind(console, 'connection error:'));
        dbObject.once('open', function callback() {
            console.log("Connection to weTrack is success");
        });

        var Wtrack = dbObject.model("wTrack", WtrackSchema);
        var Quotation = dbObject.model("Quotation", QuotationSchema);
        var Job = dbObject.model("jobs", JobSchema);

        var query = Job
            .aggregate([{
                $lookup: {
                    from        : 'Quotation',
                    localField  : 'quotation',
                    foreignField: '_id',
                    as          : 'quotation'
                }
            }, {
                $project: {
                    payments : 1,
                    quotation: {$arrayElemAt: ["$quotation", 0]},
                    wTracks  : 1
                }
            }, {
                $unwind: {
                    path                      : '$wTracks',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'wTrack',
                    localField  : 'wTracks',
                    foreignField: '_id',
                    as          : 'wTracks'
                }
            }, {
                $project: {
                    payments : 1,
                    quotation: 1,
                    wTracks  : {$arrayElemAt: ["$wTracks", 0]}
                }
            }, {
                $group: {
                    _id       : '$_id',
                    totalHours: {$sum: '$wTracks.worked'},
                    root      : {
                        $push: {
                            wTracks  : '$wTracks',
                            quotation: '$quotation'
                        }
                    }
                }
            }, {
                $unwind: '$root'
            }, {
                $project: {
                    totalHours: 1,
                    _id       : '$root.wTracks._id',
                    oldRevenue: '$root.wTracks.revenue',
                    revenue   : {
                        $multiply: [{$divide: ['$root.wTracks.worked', '$totalHours']}, '$root.quotation.paymentInfo.total', 100]
                    }

                }
            }/!*, {
             $match: {
             revenue: null
             }
             }*!/]);

        query.exec(function (error, response) {
            if (error) {
                return console.dir(error);
            }

            async.each(response, function (foundObject, cb) {
                var revenue = foundObject.revenue || 0;
                var oldRevenue = foundObject.oldRevenue || 0;

                console.log(revenue);

                Wtrack.update({_id: foundObject._id}, {
                    $set: {
                        revenue   : revenue,
                        oldRevenue: oldRevenue
                    }
                }, function (err, updated) {
                    if (err) {
                        return cb(err);
                    }

                    cb();
                });
            }, function (err) {
                if (err) {
                    return next(err);
                }

                async.each(response, function (foundObject, cb) {
                    Wtrack.update({_id: foundObject._id}, {$unset: {rate: ''}}, function (err, updated) {
                        if (err) {
                            return cb(err);
                        }

                        cb();
                    });
                }, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: 'All updated'});
                });
            });
        });
    });*/

    app.get('/clean', function(req, res, next){
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
            if(err){
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

    };

    function errorHandler(err, req, res, next) {
        var status = err.status || 500;

        if (process.env.NODE_ENV === 'production') {
            if (status === 401) {
                logWriter.log('', err.message + '\n' + err.message);
                logger.error(err.message);
            }
            res.status(status).send({error: err.message});
        } else {
            res.status(status).send({error: err.message + '\n' + err.stack});
            logger.error(err.message + '\n' + err.stack);
        }
    };

    requestHandler.initScheduler();

    app.use(notFound);
    app.use(errorHandler);
};