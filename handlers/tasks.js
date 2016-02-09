var mongoose = require('mongoose');

var Tasks = function (models) {
    "use strict";
    var access = require("../Modules/additions/access.js")(models);
    var validator = require('../helpers/validator');


    var events = require('events');
    var event = new events.EventEmitter();
    var project = require("../Modules/Projects.js")(models, event);

    this.createTask = function (req, res, next) {
        project.createTask(req, res);
    };

    this.taskUpdateOnlySelectedFields = function (req, res, next) {
        var id = req.param('_id');
        project.taskUpdateOnlySelectedFields(req, id, req.body, res);
    };

    this.getTasks = function (req, res, next) {
        var data = req.query;
        var viewType = req.params.viewType;
        switch (viewType) {
            case "form":
                project.getTaskById(req, data, res);
                break;
            case "list":
                project.getTasksForList(req, data, res);
                break;
            case "kanban":
                project.getTasksForKanban(req, data, res);
                break;
        };
    };

    this.removeTask = function (req, res, next) {
        var id = req.param('_id');
        project.removeTask(req, id, res);
    };

    this.getTasksPriority = function (req, res, next) {
        project.getTasksPriority(req, res);
    };

    this.getLengthByWorkflows = function(req, res, next) {
        var options = {};
        for (var i in req.query) {
            options[i] = req.query[i];
        }
        project.getCollectionLengthByWorkflows(req, options, res);
    }

    //ToDo refactor and move this to helpers (and pull out from everywhere)
    event.on('updateSequence', function (model, sequenceField, start, end, workflowStart, workflowEnd, isCreate, isDelete, callback) {
        var query;
        var objFind = {};
        var objChange = {};
        if (workflowStart == workflowEnd) {//on one workflow

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
                objFind = {"workflow": workflowStart};
                objFind[sequenceField] = {$gte: start, $lte: end};
                objChange[sequenceField] = inc;
                query = model.update(objFind, {$inc: objChange}, {multi: true});
                query.exec(function (err, res) {
                    if (callback) {
                        callback((inc == -1) ? end : start);
                    }
                });
            } else {
                if (isCreate) {
                    query = model.count({"workflow": workflowStart}).exec(function (err, res) {
                        if (callback) {
                            callback(res);
                        }
                    });
                }
                if (isDelete) {
                    objChange = {};
                    objFind = {"workflow": workflowStart};
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
        } else {//between workflow
            objChange = {};
            objFind = {"workflow": workflowStart};
            objFind[sequenceField] = {$gte: start};
            objChange[sequenceField] = -1;
            query = model.update(objFind, {$inc: objChange}, {multi: true});
            query.exec();
            objFind = {"workflow": workflowEnd};
            objFind[sequenceField] = {$gte: end};
            objChange[sequenceField] = 1;
            query = model.update(objFind, {$inc: objChange}, {multi: true});
            query.exec(function (err, res) {
                if (callback) {
                    callback(end);
                }
            });

        }
    });

};

module.exports = Tasks;