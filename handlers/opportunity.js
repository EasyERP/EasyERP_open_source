var mongoose = require('mongoose');
var Module = function (models, event) {
    'use strict';

    var opportunitiesSchema = mongoose.Schemas.Opportunitie;
    var CustomerSchema = mongoose.Schemas.Customer;
    var TasksSchema = mongoose.Schemas.DealTasks;
    var WorkflowSchema = mongoose.Schemas.workflow;
    var prioritySchema = mongoose.Schemas.Priority;
    var historySchema = mongoose.Schemas.History;
    var objectId = mongoose.Types.ObjectId;

    var _ = require('../node_modules/underscore');
    var moment = require('../public/js/libs/moment/moment');
    var rewriteAccess = require('../helpers/rewriteAccess');
    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var async = require('async');
    var validator = require('validator');
    var CONSTANTS = require('../constants/mainConstants.js');
    var RESPONSES = require('../constants/responses');
    var pageHelper = require('../helpers/pageHelper');
    var fs = require('fs');
    var Mailer = require('../helpers/mailer');
    var mailer = new Mailer();
    var EmployeeSchema = mongoose.Schemas.Employee;
    var HistoryWriter = require('../helpers/historyWriter.js');
    var historyWriter = new HistoryWriter(models);

    var FilterMapper = require('../helpers/filterMapper');

    var path = require('path');
    var Uploader = require('../services/fileStorage/index');
    var uploader = new Uploader();

    var EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    function validBody(body) {

        return body.name ? true : false;
    }

    this.getForDd = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var query = req.query;
        var isOpportunitie = query.isOpportunitie;
        var queryObject = {};

        if (isOpportunitie) {
            queryObject.isOpportunitie = isOpportunitie;
        }

        if (query && query.id) {
            queryObject._id = objectId(query.id);
        }

        Opportunity
            .find(queryObject)
            .sort({name: 1})
            .exec(function (err, opportunities) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: opportunities});
            });

    };

    function getTimeLine(req, model, cb) {
        var TasksSchema = models.get(req.session.lastDb, 'DealTasks', TasksSchema);
        var parallelTasks;

        var historyOptions = {
            req: req,
            id : model._id
        };

        function getHistoryNotes(parallelCb) {
            historyWriter.getHistoryForTrackedObject(historyOptions, function (err, history) {
                var notes;
                if (err) {
                    return parallelCb(err);
                }

                notes = history.map(function (elem) {
                    return {
                        date   : elem.date,
                        history: elem,
                        user   : elem.editedBy,
                        _id    : ''
                    };
                });

                parallelCb(null, notes);

            }, true);
        }

        function getTask(parallelCb) {
            TasksSchema.find({'deal': model._id})
                .populate('deal', '_id name')
                .populate('company', '_id name')
                .populate('contact', '_id name')
                .populate('editedBy.user', '_id login')
                .populate('assignedTo', '_id name fullName imageSrc')
                .populate('workflow')
                .exec(function (err, res) {
                    if (err) {
                        return parallelCb(err);
                    }
                    res = res.map(function (elem) {
                        return {
                            date: elem.dealDate,
                            task: elem,
                            _id : elem._id,
                            user: elem.editedBy.user
                        }
                    });
                    parallelCb(null, res);
                });
        }

        parallelTasks = [getTask, getHistoryNotes];

        async.parallel(parallelTasks, function (err, results) {

            model.notes = model.notes.concat(results[0], results[1]);
            model.notes = _.sortBy(model.notes, 'date');
            cb(null, model);
        });

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
                return console.log('email send to assigned error');
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
        var db = req.session.lastDb;
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);

        var body = req.body;
        var name = body.name ? validator.escape(body.name) : '';
        var email = body.email ? validator.escape(body.email) : '';
        var message = body.message ? validator.escape(body.message) : '';
        var utmMedium = body.utm_medium ? validator.escape(body.utm_medium) : '';
        var utmSource = body.utm_source ? validator.escape(body.utm_source) : 'Web Organic';
        var utmTerm = body.utm_term ? validator.escape(body.utm_term) : '';
        var utmCampaign = body.utm_campaign ? validator.escape(body.utm_campaign) : '';
        var isEmailValid = EMAIL_REGEXP.test(email);

        var waterfallTasks = [getCampaignSource, createLead];

        function getCampaignSource(callback) {
            var sourceSchema = mongoose.Schemas.sources;
            var campaignSchema = mongoose.Schemas.campaign;
            var Source = models.get(db, 'sources', sourceSchema);
            var Campaign = models.get(db, 'campaign', campaignSchema);
            var parralelTasks = {};
            var sourceModel;
            var campaignModel;

            if (utmSource) {
                parralelTasks.source = function (parallelCB) {
                    Source.findOne({_id: utmSource}, function (err, result) {
                        if (err) {
                            return parallelCB(err);
                        }

                        if (result) {
                            return parallelCB(null, result);
                        }

                        sourceModel = new Source({_id: utmSource, name: utmSource});

                        sourceModel.save(function (err, sourceResult) {
                            if (err) {
                                return parallelCB(err);
                            }
                            parallelCB(null, sourceResult);
                        });
                    });
                };
            }

            if (utmMedium) {
                parralelTasks.campaign = function (parallelCB) {
                    var loverCampaign = utmMedium.toLowerCase();

                    Campaign.findOne({_id: loverCampaign}, function (err, result) {
                        if (err) {
                            return parallelCB(err);
                        }

                        if (result) {
                            return parallelCB(null, result);
                        }

                        campaignModel = new Campaign({_id: loverCampaign, name: utmMedium});

                        campaignModel.save(function (err, campaignResult) {
                            if (err) {
                                return parallelCB(err);
                            }
                            parallelCB(null, campaignResult);
                        });
                    });
                };
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
            var utmTermString = '\nutm_term: ' + utmTerm;
            var utmCampaignString = '\nutm_campaign: ' + utmCampaign;

            var internalNotes = '';

            if (message) {
                internalNotes += messageString;
            }

            if (utmTerm) {
                internalNotes += utmTermString;
            }

            if (utmCampaign) {
                internalNotes += utmCampaignString;
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

    this.bulkRemove = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        async.each(ids, function (id, cb) {
            Opportunity.findByIdAndRemove(id, function (err, result) {
                if (err) {
                    return err(err);
                }

                if (result && result.isOpportunitie) {
                    event.emit('updateSequence', Opportunity, 'sequence', result.sequence, 0, result.workflow, result.workflow, false, true);
                }

                cb();
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
        });
    };

    this.getLengthByWorkflows = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var waterfallTasks;
        var accessRollSearcher;
        var contentSearcher;
        var data = {};

        data.showMore = false;

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
            arrOr.push({customer: objectId(data.person)});
        }

        if (data.company) {
            arrOr.push({customer: objectId(data.company)});
            arrOr.push({company: objectId(data.company)});
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

    this.uploadFile = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var headers = req.headers;
        var id = headers.modelid || 'empty';
        var contentType = headers.modelname || 'opportunities';
        var addNote = headers.addnote;
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
                        user      : {
                            _id  : req.session.uId,
                            login: req.session.uName
                        },
                        date      : new Date()
                    }
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

                res.status(200).send({success: 'Opportunity updated success', data: response});
            });
        });
    };

    this.updateOnlySelectedFields = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var data = req.body;
        var _id = req.params.id;
        var newDirname;
        var fileName = data.fileName;
        var query;
        var obj;

        delete data.fileName;

        data.editedBy = {
            user: req.session.uId,
            date: new Date().toISOString()
        };

        if (data.notes && data.notes.length !== 0) {
            obj = data.notes[data.notes.length - 1];

            if (!obj._id) {
                obj._id = mongoose.Types.ObjectId();
            }

            obj.date = new Date();

            if (!obj.user) {
                obj.user = {};
                obj.user._id = req.session.uId;
                obj.user.login = req.session.uName;
            }

            data.notes[data.notes.length - 1] = obj;
        }

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

                        var historyOptions;

                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({success: 'Opportunities updated'});
                    });
                });
            }
        } else {
            query = (data.jobkey) ? {$and: [{name: data.name}, {jobkey: data.jobkey}]} : {name: data.name};
            Opportunity.find(query, function (err) {

                if (err) {
                    return next(err);
                }

                Opportunity.findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err, result) {
                    var os = require('os');
                    var osType = (os.type().split('_')[0]);
                    var historyOptions;
                    var path;
                    var dir;

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
                            //skip default;
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
                    historyOptions = {
                        contentType: result.isOpportunitie ? 'opportunitie' : 'lead',
                        data       : data,
                        req        : req,
                        contentId  : result._id
                    };

                    historyWriter.addEntry(historyOptions, function () {
                        getTimeLine(req, result.toJSON(), function (err, model) {
                            res.status(200).send({
                                success : 'Opportunities updated',
                                notes   : model.notes,
                                sequence: model.sequence
                            });
                        });
                    });
                });
            });

        }

    };

    this.create = function (req, res, next) {
        try {
            var data = req.body;
            var err;

            var savetoDb = function (data) {
                var err;
                var noteObj;

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
                    if (data.notes && data.notes.length) {
                        noteObj = data.notes[0];

                        noteObj._id = mongoose.Types.ObjectId();
                        noteObj.date = new Date();
                        noteObj.author = req.session.uName;
                        _opportunitie.notes = data.notes;
                    }
                    if (data.company) {
                        _opportunitie.company = data.company;
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

                        _opportunitie.notes = [{
                            _id : mongoose.Types.ObjectId(),
                            date: new Date(),
                            user: {
                                _id  : req.session.uId,
                                login: req.session.uName
                            },
                            note: data.internalNotes
                        }];

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

                    if (data.campaign) {
                        _opportunitie.campaign = data.campaign;
                    }
                    if (data.source) {
                        _opportunitie.source = data.source;
                    }
                    if (data.skype) {
                        _opportunitie.skype = data.skype;
                    }
                    if (data.social && data.social.LI) {
                        if (!_opportunitie.social) {
                            _opportunitie.social = {};
                        }
                        _opportunitie.social.LI = data.social.LI;
                    }
                    if (data.social && data.social.FB) {
                        if (!_opportunitie.social) {
                            _opportunitie.social = {};
                        }
                        _opportunitie.social.FB = data.social.FB;
                    }

                    _opportunitie.createdBy.user = req.session.uId;
                    //uId for edited by field on creation
                    _opportunitie.editedBy.user = req.session.uId;

                    event.emit('updateSequence', models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema), 'sequence', 0, 0, _opportunitie.workflow, _opportunitie.workflow, true, false, function (sequence) {
                        _opportunitie.sequence = sequence;
                        _opportunitie.save(function (err, result) {
                            var historyOptions;
                            if (err) {
                                return next(err);
                            }

                            historyOptions = {
                                contentType: result.isOpportunitie ? 'opportunitie' : 'lead',
                                data       : result.toJSON(),
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
                err = new Error('Opprtunities.create Incorrect Incoming Data');
                err.status = 400;

                return next(err);
            }
            savetoDb(data);

        } catch (exception) {
            return next(exception);
        }

    };

    function getForChart(req, res, next) {
        var query = req.query;
        var starDate = query.startDay ? new Date(query.startDay) : null;
        var endDate = query.endDay ? new Date(query.endDay) : null;
        var Opportunities = models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema);
        var History = models.get(req.session.lastDb, 'History', historySchema);
        var stage = query.stage;
        var secondMatchObj = {};
        var matchObj = {
            $and: []
        };

        var historyMatchObjForAssignedTo = {
            $and: [{$and: [{changedField: 'salesPerson'}, {$or: [{contentType: 'opportunitie'}, {contentType: 'lead'}]}]}]
        };

        var historyMatchObj = {
            $and: [{changedField: 'salesPerson'}, {contentType: 'lead'}]
        };

        if (starDate && endDate) {
            matchObj.$and.push({
                creationDate: {
                    $gte: starDate,
                    $lte: endDate
                }
            });

            historyMatchObj.$and.push({
                date: {
                    $gte: starDate,
                    $lte: endDate
                }
            });

            historyMatchObjForAssignedTo.$and.push({
                date: {
                    $gte: starDate,
                    $lte: endDate
                }
            });
        }

        if (stage === 'Qualified' || stage === 'qualifiedFrom') {
            secondMatchObj = {'workflows.name': 'Qualified'};
        }

        async.parallel({
            assignedTo: function (parCb) {
                History.aggregate([
                    {
                        $match: historyMatchObjForAssignedTo
                    }, {
                        $lookup: {
                            from        : 'Opportunities',
                            localField  : 'contentId',
                            foreignField: '_id',
                            as          : 'lead'
                        }
                    }, {
                        $unwind: {
                            path: '$lead'
                        }
                    }, {
                        $lookup: {
                            from        : 'Employees',
                            localField  : 'lead.salesPerson',
                            foreignField: '_id',
                            as          : 'sales'
                        }
                    }, {
                        $project: {
                            date  : {$add: [{$multiply: [{$year: '$date'}, 10000]}, {$add: [{$multiply: [{$month: '$date'}, 100]}, {$dayOfMonth: '$date'}]}]},
                            isOpp : '$lead.isConverted',
                            dateBy: {$dayOfYear: '$date'}
                        }
                    }, {
                        $project: {
                            date  : 1,
                            isOpp : '$isOpp',
                            dateBy: '$dateBy'
                        }
                    }, {
                        $group: {
                            _id   : {date: '$date', isOpp: '$isOpp'},
                            count : {$sum: 1},
                            isOpp : {$first: '$isOpp'},
                            source: {$first: '$dateBy'}
                        }
                    }, {
                        $project: {_id: '$_id.date', isOpp: '$isOpp', count: '$count', sourse: '$source'}
                    }, {
                        $sort: {_id: -1}
                    }
                ], parCb);
            },

            createdBy: function (parCb) {
                Opportunities.aggregate([{
                    $match: matchObj
                }, {
                    $sort: {'createdBy.date': 1}
                }, {
                    $lookup: {
                        from        : 'workflows',
                        localField  : 'workflow',
                        foreignField: '_id',
                        as          : 'workflows'
                    }
                }, {
                    $unwind: {
                        path                      : '$workflows',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $project: {
                        date  : {$add: [{$multiply: [{$year: '$createdBy.date'}, 10000]}, {$add: [{$multiply: [{$month: '$createdBy.date'}, 100]}, {$dayOfMonth: '$createdBy.date'}]}]},
                        source: {$dayOfYear: '$createdBy.date'},
                        isOpp : '$isConverted'
                    }
                }, {
                    $group: {
                        _id   : {date: '$date', isOpp: '$isOpp'},
                        count : {$sum: 1},
                        source: {$first: '$source'}
                    }
                }, {$project: {_id: '$_id.date', isOpp: '$_id.isOpp', count: '$count', source: '$source'}}
                ], parCb);
            },

            leadsBySales: function (parCb) {
                History.aggregate([
                    {
                        $match: historyMatchObj
                    }, {
                        $lookup: {
                            from        : 'Opportunities',
                            localField  : 'contentId',
                            foreignField: '_id',
                            as          : 'lead'
                        }
                    }, {
                        $unwind: {
                            path                      : '$lead',
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from        : 'Employees',
                            localField  : 'lead.salesPerson',
                            foreignField: '_id',
                            as          : 'sales'
                        }
                    }, {
                        $unwind: {
                            path                      : '$sales',
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from        : 'workflows',
                            localField  : 'lead.workflow',
                            foreignField: '_id',
                            as          : 'workflows'
                        }
                    }, {
                        $unwind: {
                            path                      : '$workflows',
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $match: secondMatchObj
                    }, {
                        $project: {
                            date        : {$add: [{$multiply: [{$year: '$date'}, 10000]}, {$add: [{$multiply: [{$month: '$date'}, 100]}, {$dayOfMonth: '$date'}]}]},
                            'sales._id' : 1,
                            'sales.name': {$ifNull: ['$sales.name', 'Empty']},
                            isOpp       : '$lead.isOpportunitie',
                            dateBy      : {$dayOfYear: '$date'}
                        }
                    }, {
                        $project: {
                            date       : 1,
                            'sales._id': 1,
                            salesPerson: {$cond: [{$eq: ['$sales.name', 'Empty']}, 'Empty', {$concat: ['$sales.name.first', ' ', '$sales.name.last']}]},
                            isOpp      : '$isOpp',
                            dateBy     : '$dateBy'
                        }
                    }, {
                        $group: {
                            _id   : {sales: '$salesPerson'},
                            count : {$sum: 1},
                            dateBy: {$first: '$dateBy'},
                            isOpp : {$first: '$isOpp'}
                        }
                    }, {
                        $project: {
                            salesPerson: '$_id.sales',
                            count      : 1,
                            _id        : 0
                        }
                    }, {
                        $sort: {_id: -1}
                    }
                ], parCb);
            },

            leadsBySources: function (parCb) {
                History.aggregate([
                    {
                        $match: historyMatchObjForAssignedTo
                    }, {
                        $lookup: {
                            from        : 'Opportunities',
                            localField  : 'contentId',
                            foreignField: '_id',
                            as          : 'lead'
                        }
                    }, {
                        $unwind: {
                            path                      : '$lead',
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from        : 'workflows',
                            localField  : 'lead.workflow',
                            foreignField: '_id',
                            as          : 'workflows'
                        }
                    }, {
                        $unwind: {
                            path                      : '$workflows',
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $match: secondMatchObj
                    }, {
                        $project: {
                            date     : {$add: [{$multiply: [{$year: '$date'}, 10000]}, {$add: [{$multiply: [{$month: '$date'}, 100]}, {$dayOfMonth: '$date'}]}]},
                            isOpp    : '$lead.isConverted',
                            dateBy   : {$dayOfYear: '$date'},
                            createdBy: '$lead.createdBy'
                        }
                    }, {
                        $project: {
                            date     : 1,
                            isOpp    : '$isOpp',
                            dateBy   : '$dateBy',
                            createdBy: '$createdBy'
                        }
                    }, {
                        $group: {
                            _id   : '$createdBy.user',
                            count : {$sum: 1},
                            isOpp : {$first: '$isOpp'},
                            source: {$first: '$dateBy'}
                        }
                    }, {
                        $lookup: {
                            from        : 'Users',
                            localField  : '_id',
                            foreignField: '_id',
                            as          : 'user'
                        }
                    }, {
                        $unwind: {
                            path                      : '$user',
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $project: {_id: 0, count: '$count', salesPerson: '$user.login'}
                    }
                ], parCb);
            }
        }, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    }

    this.getLeadsForChart = function (req, res, next) {
        var data = req.query;
        var startDate = data.startDay ? new Date(data.startDay) : null;
        var endDate = data.endDay ? new Date(data.endDay) : null;
        var response = {};
        var type = data.type || 'sale';
        var myItem = {};
        var fromDateTicks;
        var fromDate;

        data.dataRange = data.dataRange || 365;
        data.dataItem = data.dataItem || 'M';

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

        if (type === 'source') {
            fromDateTicks = new Date() - data.dataRange * 24 * 60 * 60 * 1000;
            fromDate = new Date(fromDateTicks);

            models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema).aggregate({
                $match: {
                    $and: [{
                        createdBy: {$ne: null},
                        source   : {$ne: ''},
                        $or      : [{isConverted: true}, {isOpportunitie: false}]
                    }, {
                        'createdBy.date': {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }]
                }
            }, {
                $group: {
                    _id  : {source: '$source', isOpportunitie: '$isOpportunitie'},
                    count: {$sum: 1}
                }
            }, {
                $project: {
                    source: '$_id.source',
                    count : 1,
                    isOpp : '$_id.isOpportunitie',
                    _id   : 0
                }
            }).exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                response.data = result;
                res.send(response);
            });
        } else if (type === 'sale') {
            fromDateTicks = new Date() - data.dataRange * 24 * 60 * 60 * 1000;
            fromDate = new Date(fromDateTicks);
            models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema).aggregate({
                $match: {
                    $and: [{
                        createdBy: {$ne: null},
                        $or      : [{isConverted: true}, {isOpportunitie: false}]
                    }, {
                        'createdBy.date': {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }]
                }
            }, {
                $lookup: {
                    from        : 'Users',
                    localField  : 'createdBy.user',
                    foreignField: '_id',
                    as          : 'createdBy'
                }
            }, {
                $project: {
                    createdBy     : {$arrayElemAt: ['$createdBy', 0]},
                    count         : 1,
                    isOpportunitie: 1
                }
            }, {
                $group: {
                    _id  : {createdBy: '$createdBy.login', isOpportunitie: '$isOpportunitie'},
                    count: {$sum: 1}
                }
            }, {
                $project: {
                    source: '$_id.createdBy',
                    count : 1,
                    isOpp : '$_id.isOpportunitie',
                    _id   : 0
                }
            }).exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                response.data = result;
                res.send(response);
            });
        }
    };

    this.getOpportunitiesForChart = function (req, res, next) {
        var HISTORY_DATE = new Date(2016, 4, 24);
        var data = req.query;
        var type = data.type;
        var dateFormat;
        var now;
        var fromDateTicks;
        var fromDate;

        data.dataRange = parseInt(data.dataRange, 10) || 365;
        data.dataItem = data.dataItem || 'M';

        switch (data.dataItem) {
            case 'M':
                data.dataItem = '$month';
                dateFormat = {
                    year  : {$dateToString: {format: '%Y', date: '$date'}},
                    mounth: {$dateToString: {format: '%m', date: '$date'}}
                };
                break;
            case 'W':
                data.dataItem = '$week';
                dateFormat = {
                    year: {$dateToString: {format: '%Y', date: '$date'}},
                    week: {$dateToString: {format: '%U', date: '$date'}}
                };
                break;
            case 'D':
                data.dataItem = '$dayOfYear';
                dateFormat = {
                    year  : {$dateToString: {format: '%Y', date: '$date'}},
                    mounth: {$dateToString: {format: '%m', date: '$date'}},
                    day   : {$dateToString: {format: '%d', date: '$date'}}
                };
                break;
            case 'DW':
                data.dataItem = '$dayOfWeek';
                dateFormat = {
                    year  : {$dateToString: {format: '%Y', date: '$date'}},
                    mounth: {$dateToString: {format: '%m', date: '$date'}},
                    day   : {$dateToString: {format: '%d', date: '$date'}}
                };
                data.dataRange = 7;
                break;
            case 'DM':
                data.dataItem = '$dayOfMonth';
                dateFormat = {
                    year  : {$dateToString: {format: '%Y', date: '$date'}},
                    mounth: {$dateToString: {format: '%m', date: '$date'}},
                    day   : {$dateToString: {format: '%d', date: '$date'}}
                };
                break;
            //skip default;
        }

        if (type === 'date') {
            fromDateTicks = new Date() - data.dataRange * 24 * 60 * 60 * 1000;
            fromDate = new Date(fromDateTicks);

            async.waterfall([
                function (callback) {
                    models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        isConverted: false
                                    },
                                    {
                                        isOpportunitie: true
                                    },
                                    {
                                        'createdBy.date': {$gte: HISTORY_DATE}
                                    },
                                    {
                                        'createdBy.date': {$gte: fromDate}
                                    }
                                ]
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                ids: {$addToSet: '$_id'}
                            }
                        }
                    ).exec(function (err, result) {
                        if (err) {
                            return callback(err);
                        }

                        callback(null, result);
                    });
                },
                function (opportunities, callback) {
                    var ids;

                    if (!opportunities || !opportunities.length) {
                        return callback();
                    }

                    ids = opportunities[0].ids;

                    models.get(req.session.lastDb, 'History', historySchema).aggregate(
                        {
                            $match: {
                                $and: [
                                    {
                                        contentId: {$in: ids}
                                    },
                                    {
                                        changedField: 'workflow'
                                    }
                                ]
                            }
                        },
                        {
                            $group: {
                                _id      : '$contentId',
                                dates    : {$push: '$date'},
                                newValues: {$push: '$newValue'}
                            }
                        }, {
                            $project: {
                                _id     : 1,
                                date    : {$arrayElemAt: ['$dates', 0]},
                                newValue: {$arrayElemAt: ['$newValues', 0]}
                            }
                        }, {
                            $lookup: {
                                from        : 'workflows',
                                localField  : 'newValue',
                                foreignField: '_id',
                                as          : 'workflow'
                            }
                        }, {
                            $project: {
                                workflow: {$arrayElemAt: ['$workflow', 0]},
                                date    : dateFormat
                            }
                        }, {
                            $sort: {date: 1}
                        }, {
                            $group: {
                                _id  : {date: '$date', workflow: '$workflow'},
                                count: {$sum: 1}
                            }
                        }, {
                            $group: {
                                _id     : '$_id.date',
                                wonCount: {
                                    $sum: {
                                        $cond: {
                                            if: {
                                                $eq: ['$_id.workflow.name', 'Won']
                                            },

                                            then: '$count',
                                            else: 0
                                        }
                                    }
                                },

                                lostCount: {
                                    $sum: {
                                        $cond: {
                                            if: {
                                                $eq: ['$_id.workflow.name', 'Lost']
                                            },

                                            then: '$count',
                                            else: 0
                                        }
                                    }
                                },

                                inProgressCount: {
                                    $sum: {
                                        $cond: {
                                            if: {
                                                $or: [
                                                    {$eq: ['$_id.workflow.name', '% 25-50']},
                                                    {$eq: ['$_id.workflow.name', '% 50-75']},
                                                    {$eq: ['$_id.workflow.name', '% 75-100']}
                                                ]
                                            },

                                            then: '$count',
                                            else: 0
                                        }
                                    }
                                }
                            }
                        }, {
                            $sort: {
                                _id: 1
                            }
                        }
                    ).exec(function (err, result) {
                        if (err) {
                            return callback(err);
                        }

                        callback(null, result);
                    });
                }
            ], function (err, result) {
                if (err) {
                    return next(err);
                }

                res.send({data: result});
            });
        } else {
            fromDateTicks = Date.now() + data.dataRange * 24 * 60 * 60 * 1000;
            fromDate = new Date(fromDateTicks);
            now = new Date();

            models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema).aggregate(
                {
                    $match: {
                        $and: [
                            {
                                isOpportunitie: true
                            }, {
                                'nextAction.date': {$lte: fromDate}
                            }, {
                                'nextAction.date': {$gte: now}
                            }
                        ]
                    }
                }, {
                    $lookup: {
                        from        : 'workflows',
                        localField  : 'workflow',
                        foreignField: '_id',
                        as          : 'workflow'
                    }
                }, {
                    $lookup: {
                        from        : 'Employees',
                        localField  : 'salesPerson',
                        foreignField: '_id',
                        as          : 'salesPerson'
                    }
                }, {
                    $project: {
                        salesPerson: {$arrayElemAt: ['$salesPerson', 0]},
                        workflow   : {$arrayElemAt: ['$workflow', 0]},
                        name       : 1,
                        revenue    : '$expectedRevenue.value'
                    }
                }, {
                    $project: {
                        salesPerson: {$concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']},
                        workflow   : '$workflow.name',
                        revenue    : 1
                    }
                }, {
                    $group: {
                        _id  : {salesPerson: '$salesPerson', workflow: '$workflow'},
                        count: {$sum: 1},
                        sum  : {$sum: '$revenue'}
                    }
                }, {
                    $group: {
                        _id : '$_id.workflow',
                        data: {$push: {salesPerson: '$_id.salesPerson', count: '$count', sum: '$sum'}}
                    }
                }, {
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

    this.getOpportunitiesConversionForChart = function (req, res, next) {
        var data = req.query;
        var response = {};
        var fromDateTicks;
        var fromDate;

        data.dataRange = data.dataRange || 365;

        fromDateTicks = new Date() - data.dataRange * 24 * 60 * 60 * 1000;
        fromDate = new Date(fromDateTicks);

        models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema).aggregate(
            {
                $match: {
                    $and: [{
                        isOpportunitie: true
                    },
                        {'createdBy.date': {$gte: fromDate}}
                    ]
                }
            }, {
                $lookup: {
                    from        : 'workflows',
                    localField  : 'workflow',
                    foreignField: '_id',
                    as          : 'workflow'
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesPerson',
                    foreignField: '_id',
                    as          : 'salesPerson'
                }
            }, {
                $project: {
                    salesPerson: {$arrayElemAt: ['$salesPerson', 0]},
                    workflow   : {$arrayElemAt: ['$workflow', 0]},
                    revenue    : '$expectedRevenue.value'
                }
            }, {
                $project: {
                    salesPerson: {$concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']},
                    workflow   : '$workflow.name',
                    revenue    : 1
                }
            }, {
                $match: {
                    workflow: {$in: ['Won', 'Lost']},
                    revenue : {$gt: 0}
                }
            }, {
                $group: {
                    _id   : '$salesPerson',
                    wonSum: {
                        $sum: {
                            $cond: {
                                if: {
                                    $eq: ['$workflow', 'Won']
                                },

                                then: '$revenue',
                                else: 0
                            }
                        }
                    },

                    wonCount: {
                        $sum: {
                            $cond: {
                                if: {
                                    $eq: ['$workflow', 'Won']
                                },

                                then: 1,
                                else: 0
                            }
                        }
                    },

                    lostSum: {
                        $sum: {
                            $cond: {
                                if: {
                                    $eq: ['$workflow', 'Lost']
                                },

                                then: '$revenue',
                                else: 0
                            }
                        }
                    },

                    lostCount: {
                        $sum: {
                            $cond: {
                                if: {
                                    $eq: ['$workflow', 'Lost']
                                },

                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            }, {
                $project: {
                    sale     : '$_id',
                    wonSum   : 1,
                    wonCount : 1,
                    lostSum  : 1,
                    lostCount: 1

                }
            }
        ).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            response.data = result;
            res.send(response);
        });
    };

    this.getOpportunitiesAgingChart = function (req, res, next) {
        var response = {};
        var today = new Date();
        var millsInDay = 24 * 60 * 60 * 1000;
        var dateRanges = {
            '0-7': {
                to  : today,
                from: new Date(today - millsInDay * 7)
            },

            '8-15': {
                to  : new Date(today - millsInDay * 7),
                from: new Date(today - millsInDay * 15)
            },

            '16-30': {
                to  : new Date(today - millsInDay * 15),
                from: new Date(today - millsInDay * 30)
            },

            '31-60': {
                to  : new Date(today - millsInDay * 30),
                from: new Date(today - millsInDay * 60)
            },

            '61-120': {
                to  : new Date(today - millsInDay * 60),
                from: new Date(today - millsInDay * 120)
            }
        };

        models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema).aggregate(
            {
                $match: {
                    isOpportunitie: true
                }
            }, {
                $lookup: {
                    from        : 'workflows',
                    localField  : 'workflow',
                    foreignField: '_id',
                    as          : 'workflow'
                }
            }, {
                $project: {
                    workflow: {$arrayElemAt: ['$workflow', 0]},
                    date    : '$editedBy.date',
                    revenue : '$expectedRevenue.value'
                }
            }, {
                $project: {
                    workflow: '$workflow.name',
                    date    : 1,
                    revenue : 1
                }
            }, {
                $match: {
                    workflow: {$nin: ['Won', 'Lost']}
                }
            }, {
                $group: {
                    _id      : '$workflow',
                    '0-7_Sum': {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [{
                                        $gt: ['$date', dateRanges['0-7'].from]
                                    }]
                                },

                                then: '$revenue',
                                else: 0
                            }
                        }
                    },

                    '8-15_Sum': {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [{
                                        $gt: ['$date', dateRanges['8-15'].from]
                                    }, {
                                        $lte: ['$date', dateRanges['8-15'].to]
                                    }]
                                },

                                then: '$revenue',
                                else: 0
                            }
                        }
                    },

                    '16-30_Sum': {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [{
                                        $gt: ['$date', dateRanges['16-30'].from]
                                    }, {
                                        $lte: ['$date', dateRanges['16-30'].to]
                                    }]
                                },

                                then: '$revenue',
                                else: 0
                            }
                        }
                    },

                    '31-60_Sum': {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [{
                                        $gt: ['$date', dateRanges['31-60'].from]
                                    }, {
                                        $lte: ['$date', dateRanges['31-60'].to]
                                    }]
                                },

                                then: '$revenue',
                                else: 0
                            }
                        }
                    },

                    '61-120_Sum': {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [{
                                        $gt: ['$date', dateRanges['61-120'].from]
                                    }, {
                                        $lte: ['$date', dateRanges['61-120'].to]
                                    }]
                                },

                                then: '$revenue',
                                else: 0
                            }
                        }
                    },

                    '>120_Sum': {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [{
                                        $lte: ['$date', dateRanges['61-120'].from]
                                    }]
                                },

                                then: '$revenue',
                                else: 0
                            }
                        }
                    },

                    '0-7_Count': {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [{
                                        $gt: ['$date', dateRanges['0-7'].from]
                                    }]
                                },

                                then: 1,
                                else: 0
                            }
                        }
                    },

                    '8-15_Count': {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [{
                                        $gt: ['$date', dateRanges['8-15'].from]
                                    }, {
                                        $lte: ['$date', dateRanges['8-15'].to]
                                    }]
                                },

                                then: 1,
                                else: 0
                            }
                        }
                    },

                    '16-30_Count': {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [{
                                        $gt: ['$date', dateRanges['16-30'].from]
                                    }, {
                                        $lte: ['$date', dateRanges['16-30'].to]
                                    }]
                                },

                                then: 1,
                                else: 0
                            }
                        }
                    },

                    '31-60_Count': {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [{
                                        $gt: ['$date', dateRanges['31-60'].from]
                                    }, {
                                        $lte: ['$date', dateRanges['31-60'].to]
                                    }]
                                },

                                then: 1,
                                else: 0
                            }
                        }
                    },

                    '61-120_Count': {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [{
                                        $gt: ['$date', dateRanges['61-120'].from]
                                    }, {
                                        $lte: ['$date', dateRanges['61-120'].to]
                                    }]
                                },

                                then: 1,
                                else: 0
                            }
                        }
                    },

                    '>120_Count': {
                        $sum: {
                            $cond: {
                                if: {
                                    $and: [{
                                        $lte: ['$date', dateRanges['61-120'].from]
                                    }]
                                },

                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            }, {
                $project: {
                    workflow      : '$_id',
                    '0-7_Sum'     : 1,
                    '8-15_Sum'    : 1,
                    '16-30_Sum'   : 1,
                    '31-60_Sum'   : 1,
                    '61-120_Sum'  : 1,
                    '>120_Sum'    : 1,
                    '0-7_Count'   : 1,
                    '8-15_Count'  : 1,
                    '16-30_Count' : 1,
                    '31-60_Count' : 1,
                    '61-120_Count': 1,
                    '>120_Count'  : 1,
                    _id           : 0

                }
            }
        ).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            response.data = result;
            res.send(response);
        });
    };

    this.updateLead = function (req, res, next) {
        var Opportunity = models.get(req.session.lastDb, 'Opportunitie', opportunitiesSchema);
        var Customer = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);
        var remove = req.headers.remove;
        var data = req.body;
        var _id = req.params.id;
        var obj;

        var historyOptions = {
            contentType: 'lead',
            data       : data,
            req        : req,
            contentId  : _id
        };

        if (data.notes && data.notes.length !== 0 && !remove) {
            obj = data.notes[data.notes.length - 1];
            if (!obj._id) {
                obj._id = mongoose.Types.ObjectId();
            }
            obj.date = new Date();

            if (!obj.author) {
                obj.author = req.session.uName;
            }
            data.notes[data.notes.length - 1] = obj;
        }

        function updateOpp() {
            /* var createPersonCustomer = function (company) {
             var _person;
             if (data.contactName && (data.contactName.first || data.contactName.last)) {
             _person = {
             name   : data.contactName,
             email  : data.email,
             phones : data.phones,
             company: company._id,

             salesPurchases: {
             isCustomer : true,
             salesPerson: data.salesPerson
             },

             type     : 'Person',
             createdBy: {user: req.session.uId}
             };
             Opportunity.find({$and: [{'name.first': data.contactName.first}, {'name.last': data.contactName.last}]}, function (err, _persons) {
             var _Person;

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
             _Person = new Customer(_person);

             _Person.save(function (err) {
             if (err) {
             return next(err);
             }
             });
             }
             });
             }
             };
             */
            if (data.company) {
                data.company = data.company;
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

                    if (err) {
                        return next(err);
                    }

                    Opportunity.findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err, result) {
                        var updateCustomerArr = [];

                        if (err) {
                            return next(err);
                        }

                        historyWriter.addEntry(historyOptions, function () {
                            getTimeLine(req, result.toJSON(), function (err, model) {

                                if (data.isOpportunitie && data.isConverted) {
                                    if (result.company) {
                                        updateCustomerArr.push(result.company);
                                    }
                                    if (result.customer) {
                                        updateCustomerArr.push(result.customer);
                                    }

                                    if (updateCustomerArr.length) {
                                        Customer.update({
                                            _id: {$in: updateCustomerArr}
                                        }, {
                                            $set: {
                                                isHidden                   : false,
                                                'salesPurchases.isCustomer': true
                                            }
                                        }, {multi: true}, function (err, res) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        });
                                    }

                                    /*if (data.tempCompanyField) {
                                     _company = {
                                     name: {
                                     first: data.tempCompanyField,
                                     last : ''
                                     },

                                     address: data.address,

                                     salesPurchases: {
                                     isCustomer : true,
                                     salesPerson: data.salesPerson
                                     },

                                     type     : 'Company',
                                     createdBy: {user: req.session.uId}
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
                                     _Company = new Customer(_company);
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
                                     }*/
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

                                res.status(200).send({
                                    success: 'Opportunities updated success',
                                    result : result,
                                    notes  : model.notes
                                });
                            });
                        });

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

    /*function caseFilter(filter) {
     var condition;
     var resArray = [];
     var filtrElement = {};
     var key;
     var filterName;
     var i;
     var keys = Object.keys(filter);

     for (i = keys.length - 1; i >= 0; i--) {
     filterName = keys[i];
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
     }*/

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

    function getFilter(req, res, next) {
        var Opportunities = models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema);
        var data = req.query;
        var contentType = data.contentType;
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

        var filterMapper = new FilterMapper();

        if (filter) {
            filterObj = filterMapper.mapFilter(filter, contentType); // caseFilterOpp(filter);
        }

        switch (contentType) {

            case ('Opportunities'):
                optionsObject.push({isOpportunitie: true});
                break;

            case ('Leads'):
                optionsObject.push({isOpportunitie: false});
                break;
        }

        optionsObject.push(filterObj);

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

            aggregateQuery.push({
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesPerson',
                    foreignField: '_id',
                    as          : 'salesPerson'
                }
            }, {
                $lookup: {
                    from        : 'workflows',
                    localField  : 'workflow',
                    foreignField: '_id',
                    as          : 'workflow'
                }
            }, {
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
            });

            switch (contentType) {

                case ('Opportunities'):
                    aggregateQuery.push({
                        $match: {
                            $and: optionsObject
                        }
                    }, {
                        $lookup: {
                            from        : 'Customers',
                            localField  : 'customer',
                            foreignField: '_id',
                            as          : 'customer'
                        }
                    }, {
                        $project: {
                            creationDate    : 1,
                            name            : 1,
                            expectedRevenue : 1,
                            customer        : {$arrayElemAt: ['$customer', 0]},
                            nextAction      : 1,
                            sequence        : 1,
                            workflow        : {$arrayElemAt: ['$workflow', 0]},
                            salesPerson     : {$arrayElemAt: ['$salesPerson', 0]},
                            'createdBy.user': {$arrayElemAt: ['$createdBy.user', 0]},
                            'editedBy.user' : {$arrayElemAt: ['$editedBy.user', 0]},
                            'editedBy.date' : 1,
                            isOpportunitie  : 1
                        }
                    }, {
                        $group: {
                            _id  : null,
                            total: {$sum: 1},
                            root : {$push: '$$ROOT'}
                        }
                    }, {
                        $unwind: '$root'
                    }, {
                        $project: {
                            _id               : '$root._id',
                            creationDate      : '$root.creationDate',
                            name              : '$root.name',
                            expectedRevenue   : '$root.expectedRevenue',
                            customer          : '$root.customer',
                            nextAction        : '$root.nextAction',
                            sequence          : '$root.sequence',
                            'workflow._id'    : '$root.workflow._id',
                            'workflow.name'   : '$root.workflow.name',
                            'workflow.status' : '$root.workflow.status',
                            'salesPerson._id' : '$root.salesPerson._id',
                            'salesPerson.name': '$root.salesPerson.name',
                            'createdBy.user'  : '$root.createdBy.user.login',
                            'editedBy.user'   : '$root.editedBy.user.login',
                            'editedBy.date'   : '$root.editedBy.date',
                            total             : 1

                        }
                    });

                    break;
                case ('Leads'):

                    aggregateQuery.push({
                        $lookup: {
                            from        : 'Customers',
                            localField  : 'customer',
                            foreignField: '_id',
                            as          : 'customer'
                        }
                    }, {
                        $lookup: {
                            from        : 'Customers',
                            localField  : 'company',
                            foreignField: '_id',
                            as          : 'company'
                        }
                    }, {
                        $project: {
                            name            : 1,
                            customer        : {$arrayElemAt: ['$customer', 0]},
                            company         : {$arrayElemAt: ['$company', 0]},
                            salesPerson     : {$arrayElemAt: ['$salesPerson', 0]},
                            workflow        : {$arrayElemAt: ['$workflow', 0]},
                            'createdBy.user': {$arrayElemAt: ['$createdBy.user', 0]},
                            'editedBy.user' : {$arrayElemAt: ['$editedBy.user', 0]},
                            'createdBy.date': 1,
                            'editedBy.date' : 1,
                            source          : 1,
                            address         : 1,
                            skype           : 1,
                            social          : 1,
                            isOpportunitie  : 1
                        }
                    }, {
                        $match: {
                            $and: optionsObject
                        }
                    }, {
                        $group: {
                            _id  : null,
                            total: {$sum: 1},
                            root : {$push: '$$ROOT'}
                        }
                    }, {
                        $unwind: '$root'
                    }, {
                        $project: {
                            _id               : '$root._id',
                            contactName       : {$concat: ['$root.customer.name.first', ' ', '$root.customer.name.last']},
                            'salesPerson._id' : '$root.salesPerson._id',
                            'salesPerson.name': '$root.salesPerson.name',
                            'workflow._id'    : '$root.workflow._id',
                            'workflow.name'   : '$root.workflow.name',
                            'workflow.status' : '$root.workflow.status',
                            'createdBy.user'  : '$root.createdBy.user.login',
                            'createdBy.date'  : '$root.createdBy.date',
                            'editedBy.user'   : '$root.editedBy.user.login',
                            'editedBy.date'   : '$root.editedBy.date',
                            name              : '$root.name',
                            source            : '$root.source',
                            'address.country' : {$ifNull: ['$root.company.address.country', '$root.customer.address.country']},
                            skype             : '$root.customer.skype',
                            'social.LI'       : '$root.customer.social.LI',
                            total             : 1

                        }
                    });
                    break;
            }

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
            }, {
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

        opportunity.aggregate([{
            $group: {
                _id: null,

                Name: {
                    $addToSet: '$name'
                },

                'Creation date': {
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
                            return num;
                        });
                        break;
                    case 'Expected revenue':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num;
                        });
                        break;
                    case 'Next action':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num;
                        });
                        break;
                    // skip default;
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
        var filter = data.filter || {};
        var query;
        var filterMapper = new FilterMapper();

        optionsObject.$and = [];
        filterObj.$or = [];
        or = filterObj.$or;

        optionsObject.$and.push({isOpportunitie: true});

        if (data && filter) {
            /*or.push(filterMapper.mapFilter(filter, 'Opportunities'));
             optionsObject.$and.push(filterObj);*/

            optionsObject.$and.push(filterMapper.mapFilter(filter, 'Opportunities'));

            // caseFilter(filter, or);
        }

        /*if (!or.length) {
         delete filterObj.$or;
         }*/

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
                .find(queryObject, {
                    name           : 1,
                    sequence       : 1,
                    expectedRevenue: 1,
                    customer       : 1,
                    salesPerson    : 1,
                    nextAction     : 1,
                    workflow       : 1,
                    projectType    : 1,
                    tags           : 1,
                    attachments    : 1,
                    notes          : 1
                })
                .populate('customer', 'name')
                .populate('salesPerson', 'name')
                .populate('tags', 'color name')
                .populate('workflow', '_id')
                .sort({sequence: -1})
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
        var id = req.query.id || req.params.id;
        var Opportunities = models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema);
        var query;

        query = Opportunities.findById({_id: id}, {
            name            : 1,
            expectedRevenue : 1,
            customer        : 1,
            salesPerson     : 1,
            nextAction      : 1,
            expectedClosing : 1,
            isOpportunitie  : 1,
            priority        : 1,
            workflow        : 1,
            address         : 1,
            whoCanRW        : 1,
            groups          : 1,
            createdBy       : 1,
            phones          : 1,
            internalNotes   : 1,
            editedBy        : 1,
            notes           : 1,
            company         : 1,
            tempCompanyField: 1,
            contactName     : 1,
            email           : 1,
            campaign        : 1,
            source          : 1,
            social          : 1,
            skype           : 1,
            tags            : 1,
            attachments     : 1
        });

        query
            .populate('company')
            .populate('tags', 'name color')
            .populate('customer')
            .populate('salesPerson', 'name')
            .populate('workflow', 'name sequence')
            .populate('groups.users')
            .populate('groups.group')
            .populate('createdBy.user', 'login')
            .populate('editedBy.user', 'login')
            .populate('groups.owner', '_id login');

        query.exec(function (err, result) {

            if (err) {
                return next(err);
            }
            getTimeLine(req, result.toJSON(), function (err, model) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(model);
            });
        });
    }

    this.getById = function (req, res, next) {
        getById(req, res, next);
    };


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
                break;
            default:
                getForChart(req, res, next);
        }
    };

    this.getLeadsPriority = function (req, res, next) {
        var response = {};
        response.data = [];
        models.get(req.session.lastDb, 'Priority', prioritySchema).find({type: 'Leads'}, function (err, _priority) {
            if (err) {
                return next(err);
            }

            response.data = _priority;
            res.send(response);
        });
    };

    this.getFilteredOpportunities = function (req, res, next) {
        var Opportunities = models.get(req.session.lastDb, 'Opportunities', opportunitiesSchema);
        var contentSearcher;
        var waterfallTasks;
        var accessRollSearcher;

        var optionsObject = {};
        var data = req.query;
        var query;
        var days = data.days;
        var date = moment().subtract(days, 'days').calendar();

        optionsObject.$and = [];

        optionsObject.$and.push({isOpportunitie: true});

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
            queryObject.$and.push({creationDate: {$gte: date}});

            query = Opportunities
                .find(queryObject, {
                    name           : 1,
                    sequence       : 1,
                    expectedRevenue: 1,
                    customer       : 1,
                    salesPerson    : 1,
                    nextAction     : 1,
                    workflow       : 1,
                    projectType    : 1,
                    attachments    : 1,
                    notes          : 1
                })
                .populate('customer', 'name')
                .populate('salesPerson', 'name')
                .populate('workflow', '_id')
                .sort({sequence: -1})
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
};

module.exports = Module;
