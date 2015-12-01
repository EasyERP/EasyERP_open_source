/**
 * Created by liliya on 22.10.15.
 */
var mongoose = require('mongoose');
var async = require('async');
var _ = require('../node_modules/underscore');

var Jobs = function (models, event) {
    var JobsSchema = mongoose.Schemas['jobs'];
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var QuotationSchema = mongoose.Schemas['Quotation'];
    var access = require("../Modules/additions/access.js")(models);
    var objectId = mongoose.Types.ObjectId;

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;

        for (var filterName in filter) {
            condition = filter[filterName]['value'];
            key = filter[filterName]['key'];

            switch (filterName) {
                case 'project':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
            }

            return resArray;
        }
    };

    this.create = function(req, res, next){
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var data = req.body;
        var project = req.headers.project;
        var jobName = req.headers.jobname;
        var newModel;
        var jobId;
        var projectId;

        data.name = jobName;
        data.project = objectId(project);
        data.workflow = {
            _id : objectId("56337c705d49d8d6537832eb"),
                name: "In Progress"
        };
        data.type = "Not Quoted";
        data.wTracks = [];

        newModel = new JobsModel(data);

        newModel.save(function (err, model) {
            if (err) {
                return next(err);
            }

            jobId = model._id;
            projectId = model.project;

            if (projectId){
                event.emit('updateProjectDetails', {req: req, _id: projectId, jobId: jobId});
                event.emit('recollectProjectInfo');
            }

            res.status(200).send({success: model});
        });
    };

    this.getData = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var Quotation = models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var queryObject = {};

        var data = req.query;
        var joinWithQuotation = data.joinWithQuotation && data.joinWithQuotation === "true" ? true : false;
        var sort = data.sort ? data.sort : {"budget.budgetTotal.costSum": -1};
        var query;

        var filter = data ? data.filter : {};


        if (data ? data.project : null) {
            filter['project'] = {};
            filter['project']['key'] = 'project';
            filter['project']['value'] = objectId(data.project);
        }


        if (filter && typeof filter === 'object') {
            if (filter.condition === 'or') {
                queryObject['$or'] = caseFilter(filter);
            } else {
                queryObject['$and'] = caseFilter(filter);
            }
        }

        query = JobsModel.find(queryObject).sort(sort);
        if (!joinWithQuotation) {
            query
                .populate('project')
                .populate('invoice._id')
                .populate('quotation._id')
                .exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result)
                })
        } else {
            query
                .populate('project')
                .populate('invoice._id')
                .populate('quotation._id')
                .exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result)

                    //Quotation.find({}, {products: 1, paymentInfo: 1}, function (err, quots) {
                    //    if (err) {
                    //        return next(err);
                    //    }
                    //
                    //    async.each(result, function (job, cb) {
                    //        async.each(quots, function (quotation) {
                    //            quotation.products.forEach(function (product) {
                    //                if (product.jobs && product.jobs.toString() === job._id.toString()) {
                    //                    job._doc.quotation = quotation.paymentInfo.total;
                    //                }
                    //            });
                    //        });
                    //        cb();
                    //    }, function () {
                    //        res.status(200).send(result)
                    //    })
                    //
                    //});
                })
        }


    };

    this.getForDD = function (req, res, next) {
        var pId = req.query.projectId;
        var query = models.get(req.session.lastDb, 'jobs', JobsSchema);

        query.find({type: "Not Quoted", project: objectId(pId)}, {
            name                           : 1,
            _id                            : 1,
            "budget.budgetTotal.revenueSum": 1
        }, function (err, jobs) {
            if (err) {
                return next(err);
            }
            res.status(200).send(jobs);

        });
    };

    this.remove = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

        var data = req.body;
        var id = data._id;

        JobsModel.findByIdAndRemove(id, function (err, result) {
            var jobId;
            var projectId;

            if (err) {
                return next(err);
            }

            jobId = result.get('_id');
            projectId = result.get('project');

            wTrack.find({"jobs._id": jobId}, function (err, result) {
                if (err) {
                    return next(err);
                }

                async.each(result, function (wTrackEl, cb) {
                    var _id = wTrackEl.get('_id');

                    wTrack.findByIdAndRemove(_id, function (err, r) {
                        cb();
                    });
                }, function () {
                    console.log('wTracks removed');
                    if (projectId) {
                        event.emit('updateProjectDetails', {req: req, _id: projectId});
                    }
                });


            });

            res.status(200).send(result)
        })
    };

    this.update = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);
        var project;

        var data = req.body;
        var id = data._id;
        var query;
        var updatewTracks;
        var products;
        var type;

        if (id) {
            if (data.workflowId) {
                query = {workflow: {_id: data.workflowId, name: data.workflowName}};
            } else if (data.name) {
                query = {name: data.name};
                updatewTracks = true;
            } else if (data.type) {
                query = {type: data.type};
            }

            delete data._id;

            JobsModel.findByIdAndUpdate(id, query, {new: true}, function (err, result) {
                var jobId;
                var jobName;

                if (err) {
                    return next(err);
                }

                jobId = result.get('_id');
                jobName = result.get('name');

                if (updatewTracks) {
                    wTrack.update({"jobs._id": jobId}, {$set: {"jobs.name": jobName}}, {multi: true}, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        console.log('updated wTracks');
                    })
                }

                res.status(200).send(result)
            });
        } else if (data.products && data.products.length) {
            products = JSON.parse(data.products);
            type = data.type;

            async.each(products, function (product, cb) {

                JobsModel.findByIdAndUpdate(product.jobs, {type: type}, {new: true}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    project = result.get('project');

                    cb();
                });

            }, function () {
                if (project) {
                    event.emit('fetchJobsCollection', {project: project});
                }
            });
        }
    }

    this.getJobsForDashboard = function (req, res, next) {

    }
};

module.exports = Jobs;
