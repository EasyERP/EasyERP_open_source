/**
 * Created by liliya on 22.10.15.
 */
var mongoose = require('mongoose');
var async = require('async');

var Jobs = function (models, event) {
    var JobsSchema = mongoose.Schemas['jobs'];
    var wTrackSchema = mongoose.Schemas['wTrack'];
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
    }

    this.getData = function (req, res, next) {
        var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
        var queryObject = {};

        var data = req.query;
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

        query = JobsModel.find(queryObject);

        query
            .populate('project');

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result)
        })

    },

        this.getForDD = function (req, res, next) {
        var pId = req.query.projectId;
        var query = models.get(req.session.lastDb, 'jobs', JobsSchema);

        //TODO type

        query.find({/*type: "Empty",*/ project: objectId(pId)}, {
            name: 1,
            _id: 1,
            "budget.budgetTotal.revenueSum": 1
        }, function (err, jobs) {
            if (err) {
                return next(err);
            }
            res.status(200).send(jobs);

        });
    },

        this.remove = function (req, res, next) {
            var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
            var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

            var data = req.body;
            var id = data._id;

            JobsModel.findByIdAndRemove(id, function (err, result) {
                if (err) {
                    return next(err);
                }

                var jobId = result.get('_id');
                var projectId = result.get('project');

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
                        event.emit('updateProjectDetails', {req: req, _id: projectId});
                    });


                });

                res.status(200).send(result)
            })
        },

        this.update = function (req, res, next) {
            var JobsModel = models.get(req.session.lastDb, 'jobs', JobsSchema);
            var wTrack = models.get(req.session.lastDb, 'wTrack', wTrackSchema);

            var data = req.body;
            var id = data._id;
            if (id) {
                var query;
                var updatewTracks = false;

                if (data.workflowId) {
                    query = {workflow: {_id: data.workflowId, name: data.workflowName}};
                } else if (data.name) {
                    query = {name: data.name};
                    updatewTracks = true;
                }

                delete data._id;

                JobsModel.findByIdAndUpdate(id, query, {new: true}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    var jobId = result.get('_id');
                    var jobName = result.get('name');

                    if (updatewTracks) {
                        wTrack.update({"jobs._id": jobId}, {$set: {"jobs.name": jobName}}, {multi: true}, function (err, result) {
                            if (err) {
                                return next(err);
                            }

                            console.log('updated wTracks');
                        })
                    }

                    res.status(200).send(result)
                })
            } else if (data.products && data.products.length) {
                var products = JSON.parse(data.products);
                var type = data.type;

                products.forEach(function (product) {

                    JobsModel.findByIdAndUpdate(product.jobs, {type: type}, {new: true}, function (err, result) {
                        if (err) {
                            return next(err);
                        }

                    });

                });

            }
        }


};

module.exports = Jobs;
