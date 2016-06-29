var mongoose = require('mongoose');
var Module = function (models, event) {
    'use strict';

    var DepartmentSchema = mongoose.Schemas.Department;
    var exportDecorator = require('../helpers/exporter/exportDecorator');
    var exportMap = require('../helpers/csvMap').Department;

    /* exportDecorator.addExportFunctionsToHandler(this, function (req) {
     return models.get(req.session.lastDb, 'Department', DepartmentSchema)
     }, exportMap, 'Department');*/

    this.getForDD = function (req, res, next) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);
        var query = req.query;
        var matchQuery = {};
        if (query.devDepartments) {
            matchQuery.isDevelopment = true;
        }

        Department
            .find(matchQuery)
            .select('_id name departmentManager')
            .sort({name: 1})
            .lean()
            .exec(function (err, departments) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: departments});
            });
    };

    function get(req, res, next) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);
        var query = Department.find({});

        query.select('_id name nestingLevel');
        query.sort({name: 1});
        query.exec(function (err, departments) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: departments});

        });
    }

    this.get = function (req, res, next) {
        get(req, res, next);
    };

    this.create = function (req, res, next) {
        var dbName = req.session.lastDb;
        var Department = models.get(dbName, 'Department', DepartmentSchema);
        var body = req.body;
        var department;

        Department.find({name: body.name}, function (err, result) {
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
                    event.emit('recollectVacationDash', {dbName: dbName});
                });
            }
        });
    };

    function getById(req, res, next) {
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
    }

    this.getById = function (req, res, next) {
        getById(req, res, next);
    };

    function getCustomDepartment(req, res, next) {
        var Department = models.get(req.session.lastDb, 'Department', DepartmentSchema);

        Department
            .find({})
            .populate('parentDepartment', 'name _id')
            .populate('departmentManager', 'name _id')
            .populate('users', 'login _id')
            .sort({nestingLevel: 1, sequence: -1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
    }

    this.getCustomDepartment = function (req, res, next) {
        getCustomDepartment(req, res, next);
    };

    this.getByViewType = function (req, res, next) {
        var query = req.query;
        var viewType = query.viewType;
        var id = req.query.id;

        if (id && id.length >= 24) {
            getById(req, res, next);
            return false;
        }

        switch (viewType) {
            case 'form':
                getById(req, res, next);
                break;
            case 'list':
                getCustomDepartment(req, res, next);
                break;
            default:
                getCustomDepartment(req, res, next);
                break;
        }
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
        var id = req.query.id;

        Department
            .find({}, {name: 1, nestingLevel: 1, parentDepartment: 1})
            .sort({name: 1})
            .lean()
            .exec(function (err, departments) {
                var ids;

                if (err) {
                    return next(err);
                }

                ids = [id];
                getAllChildIds(req, id, function (id) {
                    ids.push(id.toString());
                }, function () {
                    var result = [];
                    var i;

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
        var inc;
        var c;
        if (parentDepartmentStart === parentDepartmentEnd) {

            if (!(isCreate || isDelete)) {
                inc = -1;
                if (start > end) {
                    inc = 1;
                    c = end;
                    end = start;
                    start = c;
                } else {
                    end -= 1;
                }
                objChange = {};
                objFind = {parentDepartment: parentDepartmentStart};
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
                    query = model.count({parentDepartment: parentDepartmentStart}).exec(function (err, res) {
                        if (callback) {
                            callback(res);
                        }
                    });
                }
                if (isDelete) {
                    objChange = {};
                    objFind = {parentDepartment: parentDepartmentStart};
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
            objFind = {parentDepartment: parentDepartmentStart};
            objFind[sequenceField] = {$gte: start};
            objChange[sequenceField] = -1;
            query = model.update(objFind, {$inc: objChange}, {multi: true});
            query.exec();
            objFind = {parentDepartment: parentDepartmentEnd};
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
        var dbName = req.session.lastDb;
        var Department = models.get(dbName, 'Department', DepartmentSchema);
        var data = req.body;
        var _id = req.params.id;

        delete data._id;
        delete data.createdBy;

        if (data.users && data.users[0] && data.users[0]._id) {
            data.users = data.users.map(function (item) {
                return item._id;
            });
        }

        Department.find({name: data.name}, function (err, doc) {
            if (err) {
                return next(err);
            }

            if (doc.length > 0 && doc[0]._id.toString() !== _id) {
                res.status(400).send({error: 'An Department with the same Name already exists'});
            } else if (data.sequenceStart) {
                updateSequence(Department, 'sequence', data.sequenceStart, data.sequence, data.parentDepartmentStart, data.parentDepartment, false, false, function (sequence) {
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
                        event.emit('recollectVacationDash', {dbName: dbName});
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
                    event.emit('recollectVacationDash', {dbName: dbName});
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

module.exports = Module;
