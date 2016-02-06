var mongoose = require('mongoose');
var workflows = function (models, event) {
    'use strict';
    var WorkflowSchema = mongoose.Schemas.workflow;
    var relatedStatusSchema = mongoose.Schemas.relatedStatus;
    var RESPONSES = require('../constants/responses.js');

    this.get = function (req, res, next) {
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);
        var data = req.query;
        var query = (data.id) ? {wId: data.id, visible: true} : {visible: true};

        if (data.name) {
            query.name = data.name;
        }

        Workflow.find(query).sort({'sequence': -1, "editedBy.date": -1}).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });

    };

    this.getWorkflowsForDd = function (req, res, next) {
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);
        var data = req.query;
        var query = Workflow.find({wId: data.id, visible: true});

        query.select('name wName');
        query.sort({'sequence': -1, "editedBy.date": -1});
        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });

    };

    this.getFirstForConvert = function (req, res, next) {
        var callback;
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);

        var queryObject = req.query;
        var wId = queryObject.wId;
        var status = queryObject.status || 'New';
        var order = queryObject.order || -1;
        var source = queryObject.source;
        var targetSource = queryObject.targetSource;
        var err;
        var query;

        if (arguments.length === 2 && typeof res === 'function') {
            callback = res;
        }

        if (!wId) {
            err = new Error(RESPONSES.BAD_REQUEST);
            err.status = 400;

            if (callback) {
                return callback(err);
            }

            return next(err);
        }

        query = {
            wId   : wId,
            status: status
        };

        if (source) {
            query.source = source;
        }
        if (targetSource) {
            query.targetSource = targetSource;
        }

        Workflow
            .findOne(query)
            .sort({sequence: order})
            .exec(function (err, workflow) {
                if (err) {
                    if (callback) {
                        return callback(err);
                    }
                    return next(err);
                }
                if (callback) {
                    return callback(null, workflow);
                }
                res.status(200).send(workflow);
            });
    };

    this.fetch = function (req, res, next) {
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);
        var queryObject = req.query;
        var wId = queryObject.wId;
        var order = queryObject.order || -1;
        var source = queryObject.source;
        var targetSource = queryObject.targetSource;

        var err;
        var query;

        if (!wId) {
            err = new Error(RESPONSES.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }

        query = {
            wId    : wId,
            visible: true
        };

        if (source) {
            query.source = source;
        }
        if (targetSource) {
            query.targetSource = targetSource;
        }

        Workflow
            .find(query)
            .sort({sequence: order})
            .exec(function (err, workflows) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(workflows);
            });
    };

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
                if (callback) {
                    callback((inc === -1) ? end : start);
                }
            });
        } else {
            if (isCreate) {
                query = model.count({"wId": wId}).exec(function (err, res) {
                    if (callback) {
                        callback(res);
                    }
                });
            }
            if (isDelete) {
                objChange = {};
                objFind = {"wId": wId};
                objFind[sequenceField] = {$gt: start};
                objChange[sequenceField] = -1;
                query = model.update(objFind, {$inc: objChange}, {multi: true});
                query.exec(function (err, res) {
                    if (callback) {
                        callback(res);
                    }
                });
            }
        }

    }

    this.create = function (req, res, next) {
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);
        var data = req.body;
        var err;
        var body;

        if (!data.name) {
            err = 404;
            return next(err);
        }

        Workflow.find({$and: [{wId: data._id}, {name: data.name}]}, function (err, workflows) {
            if (err) {
                return next(err);
            }

            if (workflows.length > 0) {
                if (workflows[0].name === data.name) {
                    res.status(400).send({error: 'An Workflows with the same Name already exists'});
                }
            } else {
                body = new Workflow();
                body.wId = data._id;
                body.name = data.name;
                body.status = data.status;
                updateSequence(Workflow, "sequence", 0, 0, data._id, true, false, function (sequence) {
                    body.sequence = sequence;

                    body.save(function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        res.status(201).send({success: 'A new WorkFlow crate success', createdModel: result});
                    });
                });
            }
        });
    };

    /*this.updateRefs = function (result, dbName, _id) {
     var ProjectSchema;
     var ProjectModel;

     if ((dbName === CONSTANTS.WTRACK_DB_NAME) || (dbName === "production") || (dbName === "development")) {
     ProjectSchema = mongoose.Schemas.Project;
     ProjectModel = models.get(dbName, 'Project', ProjectSchema);

     event.emit('updateName', _id, ProjectModel, 'workflow._id', 'workflow.name', result.name);
     }
     };*/

    this.updateWorkflow = function (req, res, next) {
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);
        var data = req.body;
        var _id = req.params.id;

        Workflow.find({_id: _id}, function (err, workflows) {
            if (err) {
                return next(err);
            }

            Workflow.find({$and: [{wId: workflows[0].wId}, {name: data.name}]}, function (err, workflow) {
                if (err) {
                    return next(err);
                }

                delete data._id;

                if (workflow.length > 0 && workflow[0]._id !== _id) {
                    if (workflow[0].name === data.name) {
                        res.status(400).send({error: 'An Workflows with the same Name already exists'});
                    }
                } else {
                    Workflow.findOneAndUpdate({_id: _id}, data, function (err) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send({success: 'WorkFlow update success'});

                        //self.updateRefs(res, dbName, _id);
                    });
                }
            });

        });
    };

    this.updateOnlySelectedFields = function (req, res, next) {
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);
        var data = req.body;
        var _id = req.params.id;

        updateSequence(Workflow, "sequence", data.sequenceStart, data.sequence, data.wId, false, false, function (sequence) {
            data.sequence = sequence;
            Workflow.findByIdAndUpdate(_id, {$set: data}, {new: true}, function (err, res) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: 'WorkFlow update success'});
            });
        });
    };

    this.remove = function (req, res, next) {
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);
        var _id = req.params.id;

        Workflow.findByIdAndRemove(_id, function (err, workflow) {
            if (err) {
                return next(err);
            }

            event.emit('removeWorkflow', req, workflow.wId, workflow._id);
            updateSequence(Workflow, "sequence", workflow.sequence, workflow.sequence, workflow.wId, false, true, function () {
                res.status(200).send({success: 'workflow removed'});
            });
        });

    };

    this.relatedStatus = function (req, res, next) {
        var relatedStatus = models.get(req.session.lastDb, "relatedStatus", relatedStatusSchema);

        relatedStatus.find({}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };
};

module.exports = workflows;