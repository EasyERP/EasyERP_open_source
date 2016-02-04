var mongoose = require('mongoose');
var Department = function (models) {
    'use strict';
    var access = require("../Modules/additions/access.js")(models);
    var DepartmentSchema = mongoose.Schemas.Department;

    var exportDecorator = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').Department;

    exportDecorator.addExportFunctionsToHandler(this, function (req) {
        return models.get(req.session.lastDb, 'Department', DepartmentSchema)
    }, exportMap, "Department");

    this.getForDD = function (req, res, next) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);

        Department
            .find()
            .select('_id departmentName nestingLevel parentDepartment')
            .sort({departmentName: 1})
            .lean()
            .exec(function (err, departments) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: departments});
            });
    };

    this.create = function (req, res, next) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);
        var body = req.body;
        var department;

        Department.find({departmentName: body.departmentName}, function (err, result) {
            if (err) {
                return next(err);
            }

            if (result.length) {
                res.status(400).send({error: 'An Department with the same Name already exists'});
            } else {
                department = new Department(body);

                department.save(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(201).send({success: 'A new Department create success', id: result._id});
                });
            }
        });
    };

    this.getById = function (req, res, next) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);
        var id = req.query.id;

        Department
            .findById(id)
            .populate('departmentManager parentDepartment')
            .populate('createdBy.user')
            .populate('users')
            .populate('editedBy.user')
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });
    };

    this.getCustomDepartment = function (req, res, next) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);

        Department
            .find({})
            .populate("parentDepartment", "departmentName _id")
            .populate("departmentManager", "name _id")
            .populate("users", "login _id")
            .sort({nestingLevel: 1, sequence: -1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
    };

    function getAllChildIds(req, id, callback, trueCallback) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);
        var n = 0;

        Department.find({parentDepartment: id}).exec(function (err, result) {
            if (result.length !== 0) {
                result.forEach(function (item) {
                    callback(item._id);
                    getAllChildIds(req, item._id, callback, function () {
                        n++;
                        if (n === result.length) {
                            trueCallback();
                        }
                    });
                });
            } else {
                trueCallback();
            }
        });
    }

    this.getDepartmentsForEditDd = function (req, res, next) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);
        var id = req.body.id;
        var ids;
        var i;

        Department
            .find({}, {departmentName: 1, nestingLevel: 1, parentDepartment: 1})
            .sort({departmentName: 1})
            .exec(function (err, departments) {
                if (err) {
                    return next(err);
                }

                ids = [id];
                getAllChildIds(req, id, function (id) {
                    ids.push(id.toString());
                }, function () {
                    var result = [];
                    for (i = 0; i < departments.length; i++) {
                        if (ids.indexOf(departments[i]._id.toString()) === -1) {
                            result.push(departments[i]);
                        }
                    }

                    res.status(200).send({data: result});
                });
            });
    };

    function updateSequence(model, sequenceField, start, end, parentDepartmentStart, parentDepartmentEnd, isCreate, isDelete, callback) {
        var query;
        var objFind = {};
        var objChange = {};
        if (parentDepartmentStart === parentDepartmentEnd) {

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
                objFind = {"parentDepartment": parentDepartmentStart};
                objFind[sequenceField] = {$gte: start, $lte: end};
                objChange[sequenceField] = inc;
                query = model.update(objFind, {$inc: objChange}, {multi: true});
                query.exec(function () {
                    if (callback) {
                        callback((inc === -1) ? end : start);
                    }
                });
            } else {
                if (isCreate) {
                    query = model.count({"parentDepartment": parentDepartmentStart}).exec(function (err, res) {
                        if (callback){
                            callback(res);
                        }
                    });
                }
                if (isDelete) {
                    objChange = {};
                    objFind = {"parentDepartment": parentDepartmentStart};
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
        } else {
            objChange = {};
            objFind = {"parentDepartment": parentDepartmentStart};
            objFind[sequenceField] = {$gte: start};
            objChange[sequenceField] = -1;
            query = model.update(objFind, {$inc: objChange}, {multi: true});
            query.exec();
            objFind = {"parentDepartment": parentDepartmentEnd};
            objFind[sequenceField] = {$gte: end};
            objChange[sequenceField] = 1;
            query = model.update(objFind, {$inc: objChange}, {multi: true});
            query.exec(function () {
                if (callback) {
                    callback(end);
                }
            });
        }
    }

    function updateNestingLevel(req, id, nestingLevel, callback) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);
        var n = 0;

        Department.find({parentDepartment: id}).exec(function (err, result) {
            if (result.length !== 0) {
                result.forEach(function (item) {
                    n++;

                    Department.findByIdAndUpdate(item._id, {nestingLevel: nestingLevel + 1}, {new: true}, function (err, res) {
                        if (result.length === n) {
                            updateNestingLevel(req, res._id, res.nestingLevel + 1, function () {
                                callback();
                            });
                        } else {
                            updateNestingLevel(req, res._id, res.nestingLevel + 1);
                        }
                    });
                });
            } else {
                if (callback) {
                    callback();
                }
            }
        });
    }

    this.update = function (req, res, next) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);
        var data = req.body;
        var _id = req.params.id;

        delete data._id;
        delete data.createdBy;

        if (data.users && data.users[0] && data.users[0]._id) {
            data.users = data.users.map(function (item) {
                return item._id;
            });
        }

        Department.find({departmentName: data.departmentName}, function (err, doc) {
            if (err) {
                return next(err);
            }

            if (doc.length > 0 && doc[0]._id.toString() !== _id) {
                res.status(400).send({error: 'An Department with the same Name already exists'});
            } else if (data.sequenceStart) {
                updateSequence(Department, "sequence", data.sequenceStart, data.sequence, data.parentDepartmentStart, data.parentDepartment, false, false, function (sequence) {
                    data.sequence = sequence;
                    Department.findByIdAndUpdate({_id: _id}, data, {new: true}, function (err) {
                        if (err) {
                            return next(err);
                        }

                        if (data.isAllUpdate) {
                            updateNestingLevel(req, _id, data.nestingLevel, function () {
                                res.status(200).send({success: 'Department updated success'});
                            });
                        } else {
                            res.status(200).send({success: 'Department updated success'});
                        }

                    });
                });
            } else {
                Department.findByIdAndUpdate({_id: _id}, data, {new: true}, function (err) {
                    if (err) {
                        return next(err);
                    }

                    if (data.isAllUpdate) {
                        updateNestingLevel(req, _id, data.nestingLevel, function () {
                            res.send(200, {success: 'Department updated success'});
                        });
                    } else {
                        res.status(200).send({success: 'Department updated success'});
                    }

                });
            }

        });
    };

    function removeAllChild(req, arrId, callback) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);

        if (arrId.length) {
            Department.find({parentDepartment: {$in: arrId}}, {_id: 1}, function (err, res) {
                if (err) {
                    if (callback) {
                        return callback(err);
                    }
                }

                Department.find({parentDepartment: {$in: arrId}}, {multi: true}).remove().exec(function () {
                    arrId = res.map(function (item) {
                        return item._id;
                    });
                    removeAllChild(req, arrId, callback);
                });

            });
        } else {
            if (callback) {
                callback();
            }
        }
    }

    this.remove = function (req, res, next) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);
        var id = req.params.id;

        Department.remove({_id: id}, function (err) {
            if (err) {
                return next(err);
            }
            removeAllChild(req, [id].objectID(), function () {
                res.status(200).send({success: 'Department removed'});
            });
        });
    };
};

module.exports = Department;