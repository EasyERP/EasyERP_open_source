var mongoose = require('mongoose');
var Opportunity = function (models, event) {
    'use strict';
    var access = require('../Modules/additions/access.js')(models);
    var _ = require('../node_modules/underscore');
    var rewriteAccess = require('../helpers/rewriteAccess');
    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var logWriter = require('../helpers/logWriter.js');
    var opportunitiesSchema = mongoose.Schemas.Opportunitie;
    var DepartmentSchema = mongoose.Schemas['Department'];
    var CustomerSchema = mongoose.Schemas.Customer;
    var WorkflowSchema = mongoose.Schemas.workflow;
    var prioritySchema = mongoose.Schemas.Priority;
    var async = require('async');
    var validator = require('validator');
    var CONSTANTS = require('../constants/mainConstants.js');
    var pageHelper = require('../helpers/pageHelper');
    var fs = require('fs');
    var objectId = mongoose.Types.ObjectId;

    var Mailer = require('../helpers/mailer');
    var mailer = new Mailer();
    var EmployeeSchema = mongoose.Schemas.Employee;
    var HistoryWriter = require('../helpers/historyWriter.js');
    var historyWriter = new HistoryWriter(models);

    var EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    function validBody(body) {
        if (body.name) {
            return true;
        }

        return false;
    }

    function sendEmailToAssigned(req, opportunity) {

        var mailOptions;
        var Employee;

        Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);

        Employee.findById(opportunity.salesPerson, {}, function (err, modelEmployee) {

            var workEmail;
            var employee;
            var opportunityName;
            var opportunityDescription;
            var isOpportunity;

            if (err) {
                res.send(500, {error: 'email send to assigned error'});
            }

            workEmail = modelEmployee.get('workEmail');
            employee = modelEmployee.get('name');

            opportunityName = opportunity.name || '';
            opportunityDescription = opportunity.internalNotes || '';
            isOpportunity = opportunity.isOpportunitie ? 'Opportunity' : 'Lead';

            if (workEmail) {
                mailOptions = {
                    to                    : workEmail,
                    isOpportunity         : isOpportunity,
                    employee              : employee,
                    opportunityName       : opportunityName,
                    opportunityDescription: opportunityDescription
                };

                mailer.sendAssignedToLead(mailOptions, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('email was send to ' + workEmail);
                });
            } else {
                console.log('employee have not work email');
            }
        });
    }

    this.addNewLeadFromSite = function (req, res, next) {
        //var db = 'production';
        //var Opportunitie = models.get(db, 'Opportunitie', opportunitiesSchema);
        var db = req.session.lastDb;
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);

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
                        });
                    });
                }
            }

            async.parallel(parralelTasks, function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });

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
                isOpportunitie: false,
                workflow      : CONSTANTS.LEAD_DRAFT
            };

            leadModel = new Opportunity(saveObject);

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

                res.status(200).send({success: 'Lead created', id: result._id});
            });
        } else {
            res.status(400).send();
        }
    };

    this.remove = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var id = req.params.id;

        Opportunity.findByIdAndRemove(id, function (err, result) {
            if (err) {
                return next(err);
            }

            if (result && result.isOpportunitie) {
                event.emit('updateSequence', Opportunity, 'sequence', result.sequence, 0, result.workflow, result.workflow, false, true);
            }

            res.status(200).send({success: 'Opportunities removed'});
        });
    };

    this.getLengthByWorkflows = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var waterfallTasks;
        var accessRollSearcher;
        var contentSearcher;
        var data = {};

        data['showMore'] = false;

        accessRollSearcher = function (cb) {
            accessRoll(req, Opportunity, cb);
        };

        contentSearcher = function (opportunitiesIds, waterfallCallback) {
            var queryObject = {};
            queryObject.$and = [];
            queryObject.$and.push({_id: {$in: opportunitiesIds}});
            queryObject.$and.push({isOpportunitie: true});

            Opportunity.aggregate([
                {
                    $match: queryObject
                }, {
                    $project: {
                        _id     : 1,
                        workflow: 1
                    }
                },
                {
                    $group: {
                        _id  : '$workflow',
                        count: {$sum: 1}
                    }
                }], waterfallCallback);
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, responseOpportunities) {
            if (err) {
                return next(err);
            }

            responseOpportunities.forEach(function (object) {
                if (object.count > req.session.kanbanSettings.opportunities.countPerPage) {
                    data.showMore = true;
                }
            });
            data.arrayOfObjects = responseOpportunities;
            res.status(200).send(data);
        });
    };

    this.opportunitiesForMiniView = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var data = req.query;
        var accessRollSearcher;
        var contentSearcher;
        var waterfallTasks;
        var arrOr = [];
        var query;

        if (data.person) {
            arrOr.push({'customer': objectId(data.person)});
        }
        if (data.company) {
            arrOr.push({'customer': objectId(data.company)});
            arrOr.push({'company': objectId(data.company)});
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Opportunity, cb);
        };

        contentSearcher = function (opportunitiesIds, waterfallCallback) {
            var queryObject = {};
            queryObject.$and = [];
            queryObject.$and.push({_id: {$in: opportunitiesIds}});
            queryObject.$and.push({isOpportunitie: true});

            if (arrOr.length) {
                queryObject.$and.push({$or: arrOr});
            }

            query = Opportunity.find(queryObject);

            waterfallCallback(null, query);
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, query) {
            if (err) {
                return next(err);
            }

            if (data && data.onlyCount && data.onlyCount.toString().toLowerCase() === 'true') {
                query.count(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({listLength: result});
                });

            } else {
                if (data && data.status && data.status.length > 0) {
                    query.where('workflow').in(data.status);
                }
                query
                    .select('_id name expectedRevenue.currency expectedRevenue.value nextAction.date workflow');

                query
                    .populate('workflow', 'name')
                    .skip((data.page - 1) * data.count)
                    .limit(data.count);

                query.exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({listLength: result.length, data: result});
                });
            }

        });
    };

    this.update = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var data = req.body;
        var _id = req.params._id;

        data.toBeConvert = req.headers.toBeConvert;

        if (data.workflowForList || data.workflowForKanban) {
            data = {
                $set: {
                    workflow: data.workflow
                }
            };
        }

        event.emit('updateSequence', Opportunity, 'sequence', 0, 0, data.workflow, data.workflow, true, false, function (sequence) {
            if (!data.info) {
                data.info = {};
            }
            data.sequence = sequence;
            Opportunity.findByIdAndUpdate(_id, data, {new: true}, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'Opportunities updated success', result: result});

            });
        });
    };

    this.updateOnlySelectedFields = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var data = req.body;
        var _id = req.params.id;
        var newDirname;
        var fileName = data.fileName;
        delete data.fileName;

        data.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };

        if (data.workflow && data.sequenceStart && data.workflowStart) {
            if (data.sequence === -1) {
                event.emit('updateSequence', Opportunity, 'sequence', data.sequenceStart, data.sequence, data.workflowStart, data.workflowStart, false, true, function (sequence) {
                    event.emit('updateSequence', Opportunity, 'sequence', data.sequenceStart, data.sequence, data.workflow, data.workflow, true, false, function (sequence) {
                        data.sequence = sequence;
                        if (data.workflow === data.workflowStart) {
                            data.sequence -= 1;
                        }

                        Opportunity.findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            res.status(200).send({success: 'Opportunities updated', sequence: result.sequence});
                        });

                    });
                });
            } else {
                event.emit('updateSequence', Opportunity, 'sequence', data.sequenceStart, data.sequence, data.workflowStart, data.workflow, false, false, function (sequence) {
                    delete data.sequenceStart;
                    delete data.workflowStart;
                    data.info = {};
                    data.sequence = sequence;

                    Opportunity.findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({success: 'Opportunities updated'});
                    });
                });
            }
        } else {
            var query = (data.jobkey) ? {$and: [{name: data.name}, {jobkey: data.jobkey}]} : {name: data.name};
            Opportunity.find(query, function (err, doc) {
                if (err) {
                    return next(err);
                }

                if (data.notes && data.notes.length != 0) {
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

                Opportunity.findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err, result) {
                    if (!err) {
                        if (fileName) {
                            var os = require('os');
                            var osType = (os.type().split('_')[0]);
                            var path;
                            var dir;
                            switch (osType) {
                                case 'Windows':
                                {
                                    newDirname = __dirname.replace('\\Modules', '');
                                    while (newDirname.indexOf('\\') !== -1) {
                                        newDirname = newDirname.replace('\\', '\/');
                                    }
                                    path = newDirname + '\/uploads\/' + _id + '\/' + fileName;
                                    dir = newDirname + '\/uploads\/' + _id;
                                }
                                    break;
                                case 'Linux':
                                {
                                    newDirname = __dirname.replace('/Modules', '');
                                    while (newDirname.indexOf('\\') !== -1) {
                                        newDirname = newDirname.replace('\\', '\/');
                                    }
                                    path = newDirname + '\/uploads\/' + _id + '\/' + fileName;
                                    dir = newDirname + '\/uploads\/' + _id;
                                }
                            }

                            fs.unlink(path, function (err) {
                                console.log(err);
                                fs.readdir(dir, function (err, files) {
                                    if (files && files.length === 0) {
                                        fs.rmdir(dir, function () {
                                        });
                                    }
                                });
                            });

                        }
                        res.status(200).send({
                            success : 'Opportunities updated',
                            notes   : result.notes,
                            sequence: result.sequence
                        });
                    }
                });
            });

        }

    };

    this.totalCollectionLength = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var data = req.query;
        var optionsObject = {};
        var contentSearcher;
        var accessRollSearcher;
        var waterfallTasks;
        var query;
        var resp = {};
        var contentType = req.query.contentType;

        optionsObject.$and = [];

        resp.showMore = false;

        switch (contentType) {
            case ('Opportunities'):
                optionsObject.$and.push({'isOpportunitie': true});
                break;
            case ('Leads'):
                optionsObject.$and.push({'isOpportunitie': false});

                if (data.filter && data.filter.isConverted) {
                    optionsObject.$and.push({'isOpportunitie': true});
                    optionsObject.$and.push({'isConverted': true});
                }
                break;
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Opportunity, cb);
        };

        contentSearcher = function (opportunitiesIds, waterfallCallback) {
            var queryObject = {};
            queryObject.$and = [];
            queryObject.$and.push({_id: {$in: opportunitiesIds}});

            if (optionsObject.$and.length) {
                queryObject.$and.push(optionsObject);
            }

            query = Opportunity.count(queryObject);

            query.exec(waterfallCallback);
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            resp.count = result;

            res.status(200).send(resp);
        });

    };

    this.create = function (req, res, next) {
        try {
            var data = req.body;
            var err;

            var savetoDb = function (data) {
                try {
                    var _opportunitie = new models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema)();
                    _opportunitie.isOpportunitie = data.isOpportunitie || false;
                    if (data.name) {
                        _opportunitie.name = data.name;
                    }
                    if (data.jobkey) {
                        _opportunitie.jobkey = data.jobkey;
                    }
                    if (data.color) {
                        _opportunitie.color = data.color;
                    }
                    if (data.expectedRevenue) {
                        if (data.expectedRevenue.value) {
                            _opportunitie.expectedRevenue.value = data.expectedRevenue.value;
                        }
                        if (data.expectedRevenue.progress) {
                            _opportunitie.expectedRevenue.progress = data.expectedRevenue.progress;
                        }
                        if (data.expectedRevenue.currency) {
                            _opportunitie.expectedRevenue.currency = data.expectedRevenue.currency;
                        }
                    }
                    if (data.creationDate) {
                        _opportunitie.creationDate = data.creationDate;
                    }
                    if (data.company) {
                        if (data.company.id) {
                            _opportunitie.company = data.company.id;
                        } else if (data.company.name) {
                            _opportunitie.tempCompanyField = data.company.name;
                        }
                    }
                    if (data.customer) {
                        _opportunitie.customer = data.customer;
                    }
                    if (data.address) {
                        if (data.address.street) {
                            _opportunitie.address.street = data.address.street;
                        }
                        if (data.address.city) {
                            _opportunitie.address.city = data.address.city;
                        }
                        if (data.address.state) {
                            _opportunitie.address.state = data.address.state;
                        }
                        if (data.address.zip) {
                            _opportunitie.address.zip = data.address.zip;
                        }
                        if (data.address.country) {
                            _opportunitie.address.country = data.address.country;
                        }
                    }
                    if (data.contactName) {
                        if (data.contactName.first) {
                            _opportunitie.contactName.first = data.contactName.first;
                        }
                        if (data.contactName.last) {
                            _opportunitie.contactName.last = data.contactName.last;
                        }
                    }
                    if (data.email) {
                        _opportunitie.email = data.email;
                    }
                    if (data.phones) {
                        if (data.phones.phone) {
                            _opportunitie.phones.phone = data.phones.phone;
                        }
                        if (data.phones.mobile) {
                            _opportunitie.phones.mobile = data.phones.mobile;
                        }
                        if (data.fax) {
                            _opportunitie.phones.fax = data.phones.fax;
                        }
                    }
                    if (data.func) {
                        _opportunitie.func = data.func;
                    }
                    if (data.salesPerson) {
                        _opportunitie.salesPerson = data.salesPerson;
                    }
                    if (data.salesTeam) {
                        _opportunitie.salesTeam = data.salesTeam;
                    }
                    if (data.internalNotes) {
                        _opportunitie.internalNotes = data.internalNotes;
                    }
                    if (data.nextAction) {
                        if (data.nextAction.desc) {
                            _opportunitie.nextAction.desc = data.nextAction.desc;
                        }
                        if (data.nextAction.date) {
                            _opportunitie.nextAction.date = new Date(data.nextAction.date);
                        }
                    }
                    if (data.expectedClosing) {
                        _opportunitie.expectedClosing = new Date(data.expectedClosing);
                    }
                    if (data.priority) {
                        if (data.priority) {
                            _opportunitie.priority = data.priority;
                        }
                    }
                    if (data.categories) {
                        if (data.categories._id) {
                            _opportunitie.categories.id = data.categories._id;
                        }
                        if (data.categories.name) {
                            _opportunitie.categories.name = data.categories.name;
                        }
                    }
                    if (data.groups) {
                        _opportunitie.groups = data.groups;
                    }
                    if (data.whoCanRW) {
                        _opportunitie.whoCanRW = data.whoCanRW;
                    }
                    if (data.info) {
                        if (data.StartDate) {
                            _opportunitie.StartDate = data.StartDate;
                        }
                        if (data.EndDate) {
                            _opportunitie.EndDate = data.EndDate;
                        }
                        if (data.sequence) {
                            _opportunitie.sequence = data.sequence;
                        }
                        if (data.parent) {
                            _opportunitie.parent = data.parent;
                        }

                    }
                    if (data.workflow) {
                        _opportunitie.workflow = data.workflow;
                    }
                    if (data.active) {
                        _opportunitie.active = data.active;
                    }
                    if (data.optout) {
                        _opportunitie.optout = data.optout;
                    }
                    if (data.reffered) {
                        _opportunitie.reffered = data.reffered;
                    }
                    if (data.uId) {
                        _opportunitie.createdBy.user = data.uId;
                        //uId for edited by field on creation
                        _opportunitie.editedBy.user = data.uId;
                    }
                    if (data.campaign) {
                        _opportunitie.campaign = data.campaign;
                    }
                    if (data.source) {
                        _opportunitie.source = data.source;
                    }
                    event.emit('updateSequence', models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema), 'sequence', 0, 0, _opportunitie.workflow, _opportunitie.workflow, true, false, function (sequence) {
                        _opportunitie.sequence = sequence;
                        _opportunitie.save(function (err, result) {
                            var historyOptions;
                            if (err) {
                                return next(err);
                            } else {

                                historyOptions = {
                                    contentType: result.isOpportunitie ? 'opportunitie' : 'lead',
                                    data       : data,
                                    req        : req,
                                    contentId  : result._id
                                };

                                historyWriter.addEntry(historyOptions);

                                res.status(201).send({
                                    success: 'A new Opportunities create success',
                                    id     : result._id
                                });

                                // send email to _opportunitie.salesPerson
                                if (_opportunitie.salesPerson) {
                                    sendEmailToAssigned(req, _opportunitie);
                                }
                            }
                        });
                    });
                } catch (error) {
                    return next(err);
                }
            };

            if (!validBody(data)) {
                err = new Error();
                err.status = 404;

                return next(err);
            }

            if (!data) {
                logWriter.log('Opprtunities.create Incorrect Incoming Data');
                res.status(400).send({error: 'Opprtunities.create Incorrect Incoming Data'});
                return;
            }
            savetoDb(data);

        } catch (exception) {
            return next(exception);
        }

    };

    /*  this.create = function (req, res, next) {
     var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
     var body = req.body;
     var opportunity;
     var err;

     if (!validBody(body)) {
     err = new Error();
     err.status = 404;

     return next(err);
     }
     if (body.company) {
     if (body.company.id) {
     body.company = body.company.id;
     } else if (body.company.name) {
     body.tempCompanyField = body.company.name;
     body.company = null;
     }
     }
     opportunity = new Opportunity(body);

     event.emit('updateSequence', Opportunity, 'sequence', 0, 0, opportunity.workflow, opportunity.workflow, true, false, function (sequence) {
     opportunity.sequence = sequence;

     opportunity.save(function (err, result) {
     if (err) {
     return next(err);
     }

     res.status(201).send({success: 'A new Opportunities create success', id: result._id});
     });
     });
     };*/

    this.getLeadsForChart = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var data = {};

        data.source = req.param('source');
        data.dataRange = req.param('dataRange');
        data.dataItem = req.param('dataItem');

        if (!data.dataRange) {
            data.dataRange = 365;
        }
        if (!data.dataItem) {
            data.dataItem = 'M';
        }
        switch (data.dataItem) {
            case 'M':
                data.dataItem = '$month';
                break;
            case 'W':
                data.dataItem = '$week';
                break;
            case 'D':
                data.dataItem = '$dayOfYear';
                break;
            case 'DW':
                data.dataItem = '$dayOfWeek';
                break;
            case 'DM':
                data.dataItem = '$dayOfMonth';
                break;

        }
        if (data.source) {

            var c = new Date() - data.dataRange * 24 * 60 * 60 * 1000;
            var a = new Date(c);
            Opportunity.aggregate({
                $match: {
                    $and: [{
                        createdBy: {$ne: null},
                        source   : {$ne: ''},
                        $or      : [{isConverted: true}, {isOpportunitie: false}]
                    }, {'createdBy.date': {$gte: a}}]
                }
            }, {
                $group: {
                    _id  : {source: '$source', isOpportunitie: '$isOpportunitie'},
                    count: {$sum: 1}
                }
            }, {
                $project: {
                    'source': '$_id.source',
                    count   : 1,
                    'isOpp' : '$_id.isOpportunitie',
                    _id     : 0
                }
            }).exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});

            });
        } else {
            var myItem = {};
            myItem.$project = {isOpportunitie: 1, convertedDate: 1};
            myItem.$project.dateBy = {};
            myItem.$project.dateBy[data.dataItem] = '$convertedDate';
            if (data.dataItem === '$dayOfYear') {
                myItem.$project.year = {};
                myItem.$project.year.$year = '$convertedDate';
            }
            var c = new Date() - data.dataRange * 24 * 60 * 60 * 1000;
            var a = new Date(c);
            Opportunity.aggregate(
                {
                    $match: {
                        $and: [{
                            createdBy: {$ne: null},
                            $or      : [{isConverted: true}, {isOpportunitie: false}]
                        },
                            {
                                'createdBy.date': {$gte: a}
                            }]
                    }
                },
                myItem,
                {
                    $group: {
                        _id  : {dateBy: '$dateBy', isOpportunitie: '$isOpportunitie', year: '$year'},
                        count: {$sum: 1},
                        date : {$push: '$convertedDate'}
                    }
                },
                {
                    $project: {
                        'source': '$_id.dateBy',
                        count   : 1,
                        date    : 1,
                        year    : '$_id.year',
                        'isOpp' : '$_id.isOpportunitie',
                        _id     : 0
                    }
                },
                {
                    $sort: {year: 1, source: 1}
                }
            ).exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.send({data: result});
            });
        }
    };

    this.updateLead = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var Customer = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);
        var data = req.body;
        var _id = req.params.id;

        var historyOptions = {
            contentType: 'lead',
            data       : data,
            req        : req,
            contentId  : _id
        };

        historyWriter.addEntry(historyOptions);

        function updateOpp() {
            var createPersonCustomer = function (company) {
                if (data.contactName && (data.contactName.first || data.contactName.last)) {
                    var _person = {
                        name          : data.contactName,
                        email         : data.email,
                        phones        : data.phones,
                        company       : company._id,
                        salesPurchases: {
                            isCustomer : true,
                            salesPerson: data.salesPerson
                        },
                        type          : 'Person',
                        createdBy     : {user: req.session.uId}
                    };
                    Opportunity.find({$and: [{'name.first': data.contactName.first}, {'name.last': data.contactName.last}]}, function (err, _persons) {
                        if (err) {
                            return next(err);
                        }

                        if (_persons.length > 0) {
                            if (_persons[0].salesPurchases && !_persons[0].salesPurchases.isCustomer) {
                                Customer.update({_id: _persons[0]._id}, {$set: {'salesPurchases.isCustomer': true}}, function (err) {
                                    if (err) {
                                        return next(err);
                                    }
                                });
                            }
                        } else {
                            var _Person = new Customer(_person);

                            _Person.save(function (err) {
                                if (err) {
                                    return next(err);
                                }
                            });
                        }
                    });
                }
            };

            if (data.company && data.company._id) {
                data.company = data.company._id;
            } else if (data.company) {
                data.tempCompanyField = data.company;
                delete data.company;
            } else {
                delete data.company;
            }
            if (data.groups && data.groups.group) {
                data.groups.group.forEach(function (group, index) {
                    if (group._id) {
                        data.groups.group[index] = objectId(group._id.toString());
                    }
                });
            }
            if (data.groups && data.groups.users) {
                data.groups.users.forEach(function (user, index) {
                    if (user._id) {
                        data.groups.users[index] = objectId(user._id.toString());
                    }
                });
            }

            event.emit('updateSequence', Opportunity, 'sequence', 0, 0, data.workflow, data.workflow, true, false, function (sequence) {
                data.sequence = sequence;

                Opportunity.findById(_id, function (err, oldOpportunity) {
                    Opportunity.findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        if (data.createCustomer) {
                            if (data.tempCompanyField) {
                                var _company = {
                                    name          : {
                                        first: data.tempCompanyField,
                                        last : ''
                                    },
                                    address       : data.address,
                                    salesPurchases: {
                                        isCustomer : true,
                                        salesPerson: data.salesPerson
                                    },
                                    type          : 'Company',
                                    createdBy     : {user: req.session.uId}
                                };

                                Customer.find({'name.first': data.tempCompanyField}, function (err, companies) {
                                    if (err) {
                                        return next(err);
                                    }

                                    if (companies.length > 0) {
                                        if (companies[0].salesPurchases && !companies[0].salesPurchases.isCustomer) {
                                            Customer.update({_id: companies[0]._id}, {$set: {'salesPurchases.isCustomer': true}}, function (err, success) {
                                                if (success) {
                                                    createPersonCustomer(companies[0]);
                                                }
                                            });
                                        }
                                    } else {
                                        var _Company = new Customer(_company);
                                        _Company.save(function (err, _res) {
                                            if (err) {
                                                return next(err);
                                            }

                                            Opportunity.update({_id: _id}, {
                                                $set: {
                                                    company : _res._id,
                                                    customer: _res._id
                                                }
                                            }, function (err) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            });
                                            createPersonCustomer(_res);
                                        });
                                    }
                                });

                            } else {
                                createPersonCustomer({});
                            }
                        }

                        // send email to assigned when update Lead
                        if (result.salesPerson) {
                            if (oldOpportunity.salesPerson) {
                                if (result.salesPerson.toString() !== oldOpportunity.salesPerson.toString()) {
                                    sendEmailToAssigned(req, result);
                                }
                            } else {
                                sendEmailToAssigned(req, result);
                            }
                        }

                        res.status(200).send({success: 'Opportunities updated success', result: result});
                    });
                });
            });
        }

        delete data._id;
        delete data.createdBy;

        if (data.isOpportunitie && data.isConverted) {
            Workflow.find({wId: 'Opportunities'}).sort({sequence: 1}).exec(function (err, _workflow) {
                if (_workflow.length !== 0) {
                    data.workflow = _workflow[_workflow.length - 1]._id;
                }
                updateOpp();
            });
        } else {
            updateOpp();
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
        var viewType = req.query.viewType;

        switch (viewType) {
            case 'list':
                getFilter(req, res, next);
                break;
            case 'form':
                getById(req, res, next);
                break;
            case 'kanban':
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
     *         'count': 15
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
     *        {'data':[{
     *        '_id':'5374c180503e85ec0e00000d',
     *        '__v':0,
     *        'attachments':[],
     *        'notes':[],
     *        'convertedDate':'2014-04-18T07:58:16.145Z',
     *        'isConverted':false,
     *        'source':'',
     *        'campaign':'',
     *        'editedBy':{
     *            'date':'2014-04-18T07:58:16.145Z',
     *            'user':{
     *                '_id':'52203e707d4dba8813000003',
     *                'login':'admin'
     *                }
     *            },
     *        'createdBy':{
     *            'date':'2014-04-18T07:58:16.145Z',
     *            'user':{
     *                '_id':'52203e707d4dba8813000003',
     *                'login':'admin'
     *                }
     *            },
     *        'sequence':3,
     *        'groups':{
     *            'group':[],
     *            'users':[],
     *            'owner':'52203e707d4dba8813000003'
     *            },
     *        'whoCanRW':'everyOne',
     *        'workflow':{
     *            '_id':'528cdcb4f3f67bc40b000006',
     *            'name':'New',
     *            'status':'New'
     *            },
     *        'reffered':'',
     *        'optout':false,
     *        'active':true,
     *        'color':'#4d5a75',
     *        'categories':{
     *            'name':'',
     *            'id':''
     *            },
     *        'priority':'P3',
     *        'expectedClosing':'2014-04-24T22:00:00.000Z',
     *        'nextAction':{
     *            'date':'2014-04-17T22:00:00.000Z',
     *            'desc':''
     *            },
     *        'internalNotes':'Applications where the whole universe has been hand drawn on paper sheets and then animated using the stop motion.',
     *        'salesTeam':'5256a08a77285cfc06000009',
     *        'salesPerson':null,
     *        'func':'',
     *        'phones':{
     *            'fax':'',
     *            'phone':'',
     *             'mobile':''
     *            },
     *        'email':'',
     *        'contactName':{
     *            'last':'',
     *            'first':''
     *            },
     *        'address':{
     *            'country':'USA',
     *            'zip':'',
     *            'state':'WA',
     *            'city':'Seattle',
     *            'street':''
     *            },
     *        'customer':{
     *            '_id':'5303bc0fae122c781b0000c2',
     *            'name':{
     *                'last':'Finn',
     *                'first':'Aaron'
     *            },
     *            'fullName':'Aaron Finn',
     *            'id':'5303bc0fae122c781b0000c2'
     *            },
     *        'company':null,
     *        'tempCompanyField':'',
     *        'creationDate':'2014-04-18T07:58:16.145Z',
     *        'expectedRevenue':{
     *            'currency':'$',
     *            'progress':0,
     *            'value':7000
     *            },
     *        'name':'Teavana',
     *        'isOpportunitie':true
     *        }]}
     *
     * @method Opportunities
     * @param {String} list - View type
     * @instance
     */

    function caseFilterOpp(data) {

        var filter = {};
        var tempObj = {};
        var query = {};
        var ids;

        query['$or'] = [];
        filter['$and'] = [];

        for (var key in data) {
            ids = [];

            if (key !== 'workflowId') {

                if (key === 'contactName') {

                    tempObj.contactName = {$in: data[key].value};

                } else if (key === 'source') {

                    tempObj.source = {$in: data[key].value};

                } else {

                    data[key].value.forEach(function (id) {
                        if (id !== 'Empty') {
                            ids.push(objectId(id));
                        } else {
                            tempObj[data[key].key] = {$exists: false};
                            query['$or'].push(tempObj);
                            tempObj = {};
                        }
                    });

                    tempObj[data[key].key] = {$in: ids};
                }

                query['$or'].push(tempObj);
                tempObj = {};
            }

            if (query['$or'].length) {
                filter['$and'].push(query);

                query = {};
                query['$or'] = [];
            }

        }

        return filter;
    }

    function getFilter(req, res, next) {
        var Opportunities = models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema);
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var accessRollSearcher;
        var contentSearcher;
        var waterfallTasks;
        var filterObj = {};
        var optionsObject = [];
        var filter = data.filter || {};
        var key;

        if (filter) {
            filterObj = caseFilterOpp(filter);
        }

        switch (data.contentType) {

            case ('Opportunities'):
                optionsObject.push({'isOpportunitie': true});
                if (data && data.filter) {
                    optionsObject.push(filterObj);
                }
                break;

            case ('Leads'):
                optionsObject.push({'isOpportunitie': false});
                if (data && data.filter) {
                    optionsObject.push(filterObj);
                }
                break;
        }

        accessRollSearcher = function (cb) {
            accessRoll(req, Opportunities, cb);
        };

        contentSearcher = function (opportunitiesIds, waterfallCallback) {
            var aggregateQuery = [
                {
                    $match: {
                        $or: [{_id: {$in: opportunitiesIds}}]
                    }
                }];

            var query = models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema);

            switch (data.contentType) {

                case ('Opportunities'):
                {
                    aggregateQuery.push({
                        $lookup: {
                            from        : 'Customers',
                            localField  : 'customer',
                            foreignField: '_id',
                            as          : 'customer'
                        }
                    });

                }
                    break;
                case ('Leads'):
                {

                    aggregateQuery.push({
                        $lookup: {
                            from        : 'Customers',
                            localField  : 'company',
                            foreignField: '_id',
                            as          : 'customer'
                        }
                    });

                }
                    break;
            }

            aggregateQuery.push({
                    $lookup: {
                        from        : 'Employees',
                        localField  : 'salesPerson',
                        foreignField: '_id',
                        as          : 'salesPerson'
                    }
                },
                {
                    $lookup: {
                        from        : 'workflows',
                        localField  : 'workflow',
                        foreignField: '_id',
                        as          : 'workflow'
                    }
                },
                {
                    $lookup: {
                        from        : 'Users',
                        localField  : 'createdBy.user',
                        foreignField: '_id',
                        as          : 'createdBy.user'
                    }
                },
                {
                    $lookup: {
                        from        : 'Users',
                        localField  : 'editedBy.user',
                        foreignField: '_id',
                        as          : 'editedBy.user'
                    }
                },
                {
                    $project: {
                        'contactName'    : {$concat: ['$contactName.first', ' ', '$contactName.last']},
                        'customer'       : {$arrayElemAt: ['$customer', 0]},
                        'salesPerson'    : {$arrayElemAt: ['$salesPerson', 0]},
                        'workflow'       : {$arrayElemAt: ['$workflow', 0]},
                        'createdBy.user' : {$arrayElemAt: ['$createdBy.user', 0]},
                        'editedBy.user'  : {$arrayElemAt: ['$editedBy.user', 0]},
                        'createdBy.date' : 1,
                        'editedBy.date'  : 1,
                        'creationDate'   : 1,
                        'isOpportunitie' : 1,
                        'name'           : 1,
                        'expectedRevenue': 1,
                        'attachments'    : 1,
                        'notes'          : 1,
                        'convertedDate'  : 1,
                        'isConverted'    : 1,
                        'source'         : 1,
                        'campaign'       : 1,
                        'sequence'       : 1,
                        'reffered'       : 1,
                        'optout'         : 1,
                        'active'         : 1,
                        'color'          : 1,
                        'categories'     : 1,
                        'priority'       : 1,
                        'expectedClosing': 1,
                        'nextAction'     : 1,
                        'internalNotes'  : 1,
                        'phones'         : 1,
                        'email'          : 1,
                        'address'        : 1,
                        'company'        : 1
                    }
                },
                {
                    $match: {
                        $and: optionsObject
                    }
                });

            aggregateQuery.push({
                $group: {
                    _id  : null,
                    total: {$sum: 1},
                    root : {$push: '$$ROOT'}
                }
            }, {
                $unwind: '$root'
            }, {
                $project: {
                    '_id'             : '$root._id',
                    'contactName'     : '$root.contactName',
                    'customer.name'   : '$root.customer.name',
                    'salesPerson.name': '$root.salesPerson.name',
                    'workflow'        : '$root.workflow',
                    'createdBy.user'  : '$root.createdBy.user.login',
                    'editedBy.user'   : '$root.editedBy.user.login',
                    'createdBy.date'  : '$root.createdBy.date',
                    'editedBy.date'   : '$root.editedBy.date',
                    'creationDate'    : '$root.creationDate',
                    'isOpportunitie'  : '$root.isOpportunitie',
                    'name'            : '$root.name',
                    'expectedRevenue' : '$root.expectedRevenue',
                    'attachments'     : '$root.attachments',
                    'notes'           : '$root.notes',
                    'convertedDate'   : '$root.convertedDate',
                    'isConverted'     : '$root.isConverted',
                    'source'          : '$root.source',
                    'campaign'        : '$root.campaign',
                    'sequence'        : '$root.sequence',
                    'reffered'        : '$root.reffered',
                    'optout'          : '$root.optout',
                    'active'          : '$root.active',
                    'color'           : '$root.color',
                    'categories'      : '$root.categories',
                    'priority'        : '$root.priority',
                    'expectedClosing' : '$root.expectedClosing',
                    'nextAction'      : '$root.nextAction',
                    'internalNotes'   : '$root.internalNotes',
                    'phones'          : '$root.phones',
                    'email'           : '$root.email',
                    'address'         : '$root.address',
                    'company'         : '$root.company',
                    'total'             : 1
                }
            });

            if (data.sort) {
                key = Object.keys(data.sort)[0];
                req.query.sort[key] = parseInt(data.sort[key], 10);

                aggregateQuery.push({
                    $sort: data.sort
                });
            } else {
                aggregateQuery.push({
                    $sort: {'editedBy.date': -1}
                });
            }

            aggregateQuery.push({
                    $skip: skip
                },
                {
                    $limit: limit
                });

            query.aggregate(aggregateQuery).exec(waterfallCallback);

        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            var count;
            var firstElement;
            var response = {};

            if (err) {
                return next(err);
            }

            firstElement = result[0];
            count = firstElement && firstElement.total ? firstElement.total : 0;

            response.total = count;
            response.data = result;
            
            res.status(200).send(response);
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
        var Opportunities = models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema);
        var contentSearcher;
        var waterfallTasks;
        var accessRollSearcher;

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

        accessRollSearcher = function (cb) {
            accessRoll(req, Opportunities, cb);
        };

        contentSearcher = function (opportunitiesIds, waterfallCallback) {
            var queryObject = {};
            queryObject.$and = [];
            queryObject.$and.push({_id: {$in: opportunitiesIds}});

            if (optionsObject.$and.length) {
                queryObject.$and.push(optionsObject);
            }
            queryObject.$and.push({workflow: data.workflowId});

            query = Opportunities
                .find(queryObject)
                .populate('customer', 'name')
                .populate('salesPerson', 'name')
                .populate('workflow', '_id')
                .sort({'sequence': -1})
                .limit(req.session.kanbanSettings.opportunities.countPerPage);

            query.exec(waterfallCallback);
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

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
    }

    function getById(req, res, next) {
        var id = req.query.id;
        var Opportunities = models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema);
        var query;

        query = Opportunities.findById({_id: id});

        query.populate('company customer salesPerson salesTeam workflow')
            .populate('groups.users')
            .populate('groups.group')
            .populate('createdBy.user')
            .populate('editedBy.user')
            .populate('groups.owner', '_id login');

        query.exec(function (err, result) {
            var historyOptions = {
                req: req,
                id : result._id
            };

            if (err) {
                return next(err);
            }

            historyWriter.getHistoryForTrackedObject(historyOptions, function (err, history) {
                if (err) {
                    return console.log(err);
                }
                result = result.toJSON();
                result.history = history;
                res.status(200).send(result);
            });

        });
    }

    this.getLeadsPriority = function (req, res, next) {
        var response = {};
        response['data'] = [];
        models.get(req.session.lastDb, 'Priority', prioritySchema).find({type: 'Leads'}, function (err, _priority) {
            if (err) {
                return next(err);
            } else {
                response['data'] = _priority;
                res.send(response);
            }
        });
    };

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
     *         'count': 35
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
     *        {'data':[{
     *        '_id':'5374c181503e85ec0e000010',
     *        '__v':0,
     *        'attachments':[],
     *        'notes':[],
     *        'convertedDate':'2014-04-18T07:58:16.145Z',
     *        'isConverted':false,
     *        'source':'',
     *        'campaign':'',
     *        'editedBy':{
     *            'date':'2014-04-18T07:58:16.145Z',
     *            'user':{
     *                '_id':'52203e707d4dba8813000003',
     *                'login':'admin'
     *                }
     *            },
     *        'createdBy':{
     *            'date':'2014-04-18T07:58:16.145Z',
     *            'user':{
     *                '_id':'52203e707d4dba8813000003',
     *                'login':'admin'
     *                }
     *            },
     *        'sequence':3,
     *        'groups':{
     *            'group':[],
     *            'users':[],
     *            'owner':'52203e707d4dba8813000003'
     *            },
     *        'whoCanRW':'everyOne',
     *        'workflow':{
     *            '_id':'528cdcb4f3f67bc40b000006',
     *            'name':'New',
     *            'status':'New'
     *            },
     *        'reffered':'',
     *        'optout':false,
     *        'active':true,
     *        'color':'#4d5a75',
     *        'categories':{
     *            'name':'',
     *            'id':''
     *            },
     *        'priority':'P3',
     *        'expectedClosing':'2014-04-24T22:00:00.000Z',
     *        'nextAction':{
     *            'date':'2014-04-17T22:00:00.000Z',
     *            'desc':''
     *            },
     *        'internalNotes':'Applications where the whole universe has been hand drawn on paper sheets and then animated using the stop motion.',
     *        'salesTeam':'5256a08a77285cfc06000009',
     *        'salesPerson':null,
     *        'func':'',
     *        'phones':{
     *            'fax':'',
     *            'phone':'',
     *             'mobile':''
     *            },
     *        'email':'',
     *        'contactName':{
     *            'last':'',
     *            'first':''
     *            },
     *        'address':{
     *            'country':'USA',
     *            'zip':'',
     *            'state':'WA',
     *            'city':'Seattle',
     *            'street':''
     *            },
     *        'customer':{
     *            '_id':'5303bc0fae122c781b0000c2',
     *            'name':{
     *                'last':'Finn',
     *                'first':'Aaron'
     *            },
     *            'fullName':'Aaron Finn',
     *            'id':'5303bc0fae122c781b0000c2'
     *            },
     *        'company':null,
     *        'tempCompanyField':'',
     *        'creationDate':'2014-04-18T07:58:16.145Z',
     *        'expectedRevenue':{
     *            'currency':'$',
     *            'progress':0,
     *            'value':7000
     *            },
     *        'name':'Wildy Jimi',
     *        'isOpportunitie':false
     *        }]}
     *
     * @method Leads
     * @param {String} list - View type
     * @instance
     */
}

module.exports = Opportunity;