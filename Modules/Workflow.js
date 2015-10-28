var Workflow = function (models, event) {
    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter.js');
    var relatedStatusSchema = mongoose.Schemas['relatedStatus'];
    var workflowSchema = mongoose.Schemas['workflow'];

    var CONSTANTS = require('../constants/mainConstants');

    function updateSequence(model, sequenceField, start, end, wId, isCreate, isDelete, callback) {
        var query;
        var objFind = {};
        var objChange = {};

        if (!(isCreate || isDelete)) {
            var inc = -1;
            if (start > end) {
                inc = 1;
                var c = end;
                end = start;
                start = c;
            } else {
                end -= 1;
            }
            objChange = {};
            objFind = {"wId": wId};
            objFind[sequenceField] = {$gte: start, $lte: end};
            objChange[sequenceField] = inc;
            query = model.update(objFind, {$inc: objChange}, {multi: true});
            query.exec(function (err, res) {
                console.log(res);
                if (callback) callback((inc == -1) ? end : start);
            });
        } else {
            if (isCreate) {
                query = model.count({"wId": wId}).exec(function (err, res) {
                    if (callback) callback(res);
                });
            }
            if (isDelete) {
                objChange = {};
                objFind = {"wId": wId};
                objFind[sequenceField] = {$gt: start};
                objChange[sequenceField] = -1;
                query = model.update(objFind, {$inc: objChange}, {multi: true});
                query.exec(function (err, res) {
                    if (callback) callback(res);
                });
            }
        }

    }

    return {
        create: function (req, data, result) {
            try {
                if (data) {
                    models.get(req.session.lastDb, "workflows", workflowSchema).find({$and: [{wId: data._id}, {name: data.name}]}, function (err, workflows) {
                        if (err) {
                            console.log(err);
                            logWriter.log('WorkFlow.js create workflow.find ' + err);
                            result.send(400, {error: 'WorkFlow.js create workflow Incorrect Incoming Data'});
                            return;
                        } else {
                            if (workflows.length > 0) {
                                if (workflows[0].name === data.name) {
                                    result.send(400, {error: 'An Workflows with the same Name already exists'});
                                }
                            }
                            else if (workflows.length === 0) {
                                var _workflow = new models.get(req.session.lastDb, "workflows", workflowSchema)();
                                _workflow.wId = data._id;
                                _workflow.name = data.name;
                                _workflow.status = data.status;
                                updateSequence(models.get(req.session.lastDb, "workflows", workflowSchema), "sequence", 0, 0, data._id, true, false, function (sequence) {
                                    _workflow.sequence = sequence;
                                    _workflow.save(function (err, workfloww) {
                                        if (err) {
                                            console.log(err);
                                            logWriter.log('WorkFlow.js create workflow.find _workflow.save ' + err);
                                            result.send(500, {error: 'WorkFlow.js create save error'});
                                        } else {
                                            result.send(201, {
                                                success: 'A new WorkFlow crate success',
                                                createdModel: workfloww
                                            });
                                        }
                                    });
                                });
                            }
                        }
                    });
                }
            }
            catch (exception) {
                logWriter.log("Workflow.js  create " + exception);
            }
        },

        updateRefs: function (result, dbName, _id) {
            var ProjectSchema;
            var ProjectModel;

            if ((dbName === CONSTANTS.WTRACK_DB_NAME) || (dbName === 'production') || ((dbName === 'development'))) {
                ProjectSchema = mongoose.Schemas['Project'];
                ProjectModel = models.get(dbName, 'Project', ProjectSchema);

                event.emit('updateName', _id, ProjectModel, 'workflow._id', 'workflow.name', result.name);
            }
        },

        update: function (req, _id, data, result) {
            var dbName = req.session.lastDb;
            var self = this;

            try {
                if (data) {
                    models.get(req.session.lastDb, "workflows", workflowSchema).find({_id: _id}, function (err, workflows) {
                        models.get(req.session.lastDb, "workflows", workflowSchema).find({$and: [{wId: workflows[0].wId}, {name: data.name}]}, function (err, workflow) {
                            delete data._id;
                            if (workflow.length > 0 && workflow[0]._id != _id) {
                                if (workflow[0].name === data.name) {
                                    result.send(400, {error: 'An Workflows with the same Name already exists'});
                                }
                            }
                            else {
                                models.get(req.session.lastDb, "workflows", workflowSchema).findOneAndUpdate({_id: _id}, data, function (err, res) {
                                    if (err) {
                                        console.log(err);
                                        logWriter.log('WorkFlow.js update workflow.update ' + err);
                                        result.send(400, {error: 'WorkFlow.js update workflow error '});
                                        return;
                                    } else {
                                        result.send(200, {success: 'WorkFlow update success'});

                                        self.updateRefs(res, dbName, _id);
                                    }
                                });
                            }
                        });
                    });
                }
            }
            catch (exception) {
                logWriter.log("Workflow.js  create " + exception);
            }
        },
        updateOnlySelectedFields: function (req, _id, data, result) {
            try {
                if (data) {
                    updateSequence(models.get(req.session.lastDb, "workflows", workflowSchema), "sequence", data.sequenceStart, data.sequence, data.wId, false, false, function (sequence) {
                        data.sequence = sequence;
                        models.get(req.session.lastDb, "workflows", workflowSchema).findByIdAndUpdate(_id, {$set: data}, function (err, res) {
                            if (err) {
                                console.log(err);
                                logWriter.log('WorkFlow.js update workflow.update ' + err);
                                result.send(400, {error: 'WorkFlow.js update workflow error '});
                                return;
                            } else {
                                result.send(200, {success: 'WorkFlow update success'});
                            }
                        });
                    });
                }
            }
            catch (exception) {
                logWriter.log("Workflow.js  create " + exception);
            }
        },
        getWorkflowsForDd: function (req, data, response) {
            var res = {};
            res['data'] = [];
            var query = models.get(req.session.lastDb, "workflows", workflowSchema).find({wId: data.type.id});
            query.select('name wName');
            query.sort({'sequence': -1, "editedBy.date": -1});
            query.exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log('Workflow.js get workflow.find' + err);
                    response.send(500, {error: "Can't find Workflow"});
                } else {
                    res['data'] = result;
                    response.send(res);
                }
            });
        },

        get: function (req, data, response) {
            try {
                var res = {};
                res['data'] = [];
                if (data) {
                    var query = (data.id) ? {wId: data.id} : {};
                    if (data.name) query['name'] = data.name
                    var query2 = models.get(req.session.lastDb, "workflows", workflowSchema).find(query);
                    query2.sort({'sequence': -1, "editedBy.date": -1});
                    query2.exec(query, function (err, result) {
                        if (err) {
                            console.log(err);
                            logWriter.log('WorkFlow.js create workflow.find ' + err);
                            response.send(500, {error: "Can't find Workflow"});
                        } else {
                            res['data'] = result;
                            response.send(res);
                        }
                    });
                }
            }
            catch (exception) {
                console.log(exception);
                logWriter.log("Workflow.js  create " + exception);
                response.send(500, {error: "Can't find Workflow"});
            }
        },

        getContractEnd: function (req, data, response) {
            try {
                var res = {};
                res['data'] = [];
                if (data) {
                    var query = (data.id) ? {wId: data.id} : {};
                    if (data.name) query['name'] = data.name
                    var query2 = models.get(req.session.lastDb, "workflows", workflowSchema).find(query);
                    query2.sort({'sequence': 1});
                    query2.exec(query, function (err, result) {
                        if (err) {
                            console.log(err);
                            logWriter.log('WorkFlow.js create workflow.find ' + err);
                            response.send(500, {error: "Can't find Workflow"});
                        } else {
                            res['data'] = result;
                            response.send(res);
                        }
                    });
                }
            }
            catch (exception) {
                console.log(exception);
                logWriter.log("Workflow.js  create " + exception);
                response.send(500, {error: "Can't find Workflow"});
            }
        },

        getRelatedStatus: function (req, response, data) {
            try {
                var res = {};
                res['data'] = [];
                var queryObj = {type: null};
                models.get(req.session.lastDb, "relatedStatus", relatedStatusSchema).find({}, function (err, _statuses) {
                    if (err) {
                        console.log(err);
                        logWriter.log('WorkFlow.js getRelatedStatus ' + err);
                        response.send(500, {error: "Can't find relatedStatus "});
                    } else {
                        res['data'] = _statuses;
                        response.send(res);
                    }
                });
            }
            catch (exception) {
                console.log(exception);
                logWriter.log("Workflow.js  create " + exception);
                response.send(500, {error: "Can't find Workflow"});
            }
        },

        remove: function (req, _id, res) {
            models.get(req.session.lastDb, "workflows", workflowSchema).findByIdAndRemove(_id, function (err, workflow) {
                if (err) {
                    console.log(err);
                    logWriter.log("workflow.js remove workflow.remove " + err);
                    res.send(500, {error: "Can't remove Company"});
                } else {
                    event.emit('removeWorkflow', req, workflow.wId, workflow._id);
                    updateSequence(models.get(req.session.lastDb, "workflows", workflowSchema), "sequence", workflow.sequence, workflow.sequence, workflow.wId, false, true, function (sequence) {
                        res.send(200, {success: 'workflow removed'});
                    });
                }
            });
        }
    };
};

module.exports = Workflow;
