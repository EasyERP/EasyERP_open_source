var Department = function (event, models) {
    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter.js');
    var DepartmentSchema = mongoose.Schemas['Department'];

    var CONSTANTS = require('../constants/mainConstants');

    function create(req, data, res) {
        try {
            if (!data) {
                logWriter.log('JobPosition.create Incorrect Incoming Data');
                res.send(400, {error: 'JobPosition.create Incorrect Incoming Data'});
                return;
            } else {
                models.get(req.session.lastDb, 'Department', DepartmentSchema).find({departmentName: data.departmentName}, function (error, doc) {
                    if (error) {
                        console.log(error);
                        logWriter.log("Department.js create Department.find ");
                        res.send(500, {error: 'Department.create find error'});
                    }
                    if (doc.length > 0) {
                        res.send(400, {error: 'An Department with the same Name already exists'});
                    }
                    else {
                        if (doc.length === 0) {
                            saveToDb(data);
                        }
                    }
                });
            }
            function saveToDb(data) {
                try {
                    var _department = new models.get(req.session.lastDb, 'Department', DepartmentSchema)();

                    if (data.departmentName) {
                        _department.departmentName = data.departmentName;
                    }
                    if (data.uId) {
                        _department.createdBy.user = data.uId;
                    }
                    if (data.users && data.users.length > 0) {
                        _department.users = data.users;
                    }
                    if (data.parentDepartment) {
                        _department.parentDepartment = data.parentDepartment;
                    }
                    if (data.departmentManager) {
                        _department.departmentManager = data.departmentManager;

                    }
                    if (data.nestingLevel) {
                        _department.nestingLevel = data.nestingLevel;

                    }
                    if (data.sequence) {
                        _department.sequence = data.sequence;

                    }
                    _department.save(function (err, result) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Department.js saveDepartmentToDb _department.save" + err);
                            res.send(500, {error: 'Department.save BD error'});
                        } else {
                            res.send(201, {success: 'A new Department create success', id: result._id});
                        }
                    });
                }
                catch (error) {
                    console.log(error);
                    logWriter.log("Department.js saveDepartmentToDb " + error);
                    res.send(500, {error: 'Department.save  error'});
                }
            }
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Department.js  create " + exception);
            res.send(500, {error: 'Department.save  error'});
        }
    };

    function getDepartmentById(req, id, res) {
        var query = models.get(req.session.lastDb, 'Department', DepartmentSchema).findById(id);
        query.populate('departmentManager parentDepartment').
            populate('createdBy.user').
            populate('users').
            populate('editedBy.user');
        query.exec(function (err, responce) {
            if (err) {
                console.log(err);
                logWriter.log('JobPosition.js get job.find' + err);
                res.send(500, {error: "Can't find JobPosition"});
            } else {
                res.send(responce);
            }
        });
    }


    function getForDd(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, 'Department', DepartmentSchema).find();
        query.select('_id departmentName nestingLevel parentDepartment');
        query.sort({departmentName: 1});
        query.exec(function (err, departments) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js getDepartments Department.find " + err);
                response.send(500, {error: "Can't find Department"});
            } else {
                res['data'] = departments;
                response.send(res);
            }
        });
    };

    function getAllChildIds(req, id, callback, trueCallback) {
        models.get(req.session.lastDb, 'Department', DepartmentSchema).find({parentDepartment: id}).exec(function (err, result) {
            var n = 0;
            if (result.length != 0) {
                result.forEach(function (item) {
                    callback(item._id);
                    getAllChildIds(req, item._id, callback, function () {
                        n++;
                        if (n == result.length) {
                            trueCallback();
                        }
                    });
                });
            } else {
                trueCallback();
            }
        });
    }

    function getForEditDd(req, id, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, 'Department', DepartmentSchema).find({});
        query.select('_id departmentName nestingLevel parentDepartment');
        query.sort({departmentName: 1});
        query.exec(function (err, departments) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js getDepartments Department.find " + err);
                response.send(500, {error: "Can't find Department"});
            } else {
                var ids = [id];
                getAllChildIds(req, id, function (id) {
                    ids.push(id.toString())
                }, function () {
                    var result = [];
                    for (var i = 0; i < departments.length; i++) {
                        if (ids.indexOf(departments[i]._id.toString()) == -1) {
                            result.push(departments[i]);
                        }
                    }
                    res['data'] = result;
                    response.send(res);
                });
            }
        });
    };

    function get(req, response) {
        var res = {};
        res['data'] = [];

        var query = models.get(req.session.lastDb, 'Department', DepartmentSchema).find({});

        query.select('_id departmentName');
        query.sort({departmentName: 1});
        query.exec(function (err, departments) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js getDepartments Department.find " + err);
                response.send(500, {error: "Can't find Department"});
            } else {
                res['data'] = departments;

                response.send(res);
            }
        });
    };

    function getCustomDepartment(req, data, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, 'Department', DepartmentSchema).find({});
        query.populate("parentDepartment", "departmentName _id");
        query.populate("departmentManager", "name _id");
        query.populate("users", "login _id");
        query.sort({nestingLevel: 1, sequence: -1});
        query.exec(function (err, departments) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js getDepartments Department.find " + err);
                response.send(500, {error: "Can't find Department"});
            } else {
                res['data'] = departments;

                response.send(res);
            }
        });
    };

    function updateNestingLevel(req, id, nestingLevel, callback) {
        models.get(req.session.lastDb, 'Department', DepartmentSchema).find({parentDepartment: id}).exec(function (err, result) {
            var n = 0;
            if (result.length != 0) {
                result.forEach(function (item) {
                    n++;

                    models.get(req.session.lastDb, 'Department', DepartmentSchema).findByIdAndUpdate(item._id, {nestingLevel: nestingLevel + 1}, {new: true}, function (err, res) {
                        if (result.length == n) {
                            updateNestingLevel(req, res._id, res.nestingLevel + 1, function () {
                                callback();
                            });
                        } else {
                            updateNestingLevel(req, res._id, res.nestingLevel + 1);
                        }
                    });
                });
            } else {
                if (callback) callback();
            }
        });
    }

    function updateSequence(model, sequenceField, start, end, parentDepartmentStart, parentDepartmentEnd, isCreate, isDelete, callback) {
        var query;
        var objFind = {};
        var objChange = {};
        if (parentDepartmentStart == parentDepartmentEnd) {//on one workflow

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
                query.exec(function (err, res) {
                    if (callback) callback((inc == -1) ? end : start);
                });
            } else {
                if (isCreate) {
                    query = model.count({"parentDepartment": parentDepartmentStart}).exec(function (err, res) {
                        if (callback) callback(res);
                    });
                }
                if (isDelete) {
                    objChange = {};
                    objFind = {"parentDepartment": parentDepartmentStart};
                    objFind[sequenceField] = {$gt: start};
                    objChange[sequenceField] = -1;
                    query = model.update(objFind, {$inc: objChange}, {multi: true});
                    query.exec(function (err, res) {
                        if (callback) callback(res);
                    });
                }
            }
        } else {//between workflow
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
            query.exec(function (err, res) {
                if (callback) callback(end);
            });


        }
    }

    function update(req, _id, data, res) {
        var dbName = req.session.lastDb;
        var EmployeeSchema;
        var EmployeeModel;

        try {
            delete data._id;
            delete data.createdBy;
            if (data.users && data.users[0] && data.users[0]._id) {
                data.users = data.users.map(function (item) {
                    return item._id;
                });
            }
            models.get(req.session.lastDb, 'Department', DepartmentSchema).find({departmentName: data.departmentName}, function (error, doc) {

                if (error) {
                    console.log(error);
                    logWriter.log("Department.js update Department.find ");
                    res.send(500, {error: 'Department.update find error'});
                } else if (doc.length > 0 && doc[0]._id.toString() !== _id) {
                    console.log(doc);
                    res.send(400, {error: 'An Department with the same Name already exists'});
                } else if (data.sequenceStart) {
                    updateSequence(models.get(req.session.lastDb, "Department", DepartmentSchema), "sequence", data.sequenceStart, data.sequence, data.parentDepartmentStart, data.parentDepartment, false, false, function (sequence) {
                        data.sequence = sequence;
                        models.get(req.session.lastDb, 'Department', DepartmentSchema).findByIdAndUpdate({_id: _id}, data, {new: true}, function (err, result) {

                            if (err) {
                                console.log(err);
                                logWriter.log("Department.js update Department.update " + err);
                                res.send(500, {error: "Can't update Department"});
                            } else {

                                if (data.isAllUpdate) {
                                    updateNestingLevel(req, _id, data.nestingLevel, function () {
                                        res.send(200, {success: 'Department updated success'});
                                    });
                                } else {
                                    res.send(200, {success: 'Department updated success'});

                                    if ((dbName === CONSTANTS.WTRACK_DB_NAME) || (dbName === "production") || (dbName === "development")) {
                                        EmployeeSchema = mongoose.Schemas['Employee'];
                                        EmployeeModel = models.get(dbName, 'Employee', EmployeeSchema);

                                        event.emit('updateName', _id, EmployeeModel, 'department._id', 'department.name', result.departmentName);
                                    }
                                }
                            }
                        });
                    });
                } else {
                    models.get(req.session.lastDb, 'Department', DepartmentSchema).findByIdAndUpdate({_id: _id}, data, {new: true}, function (err, result) {
                        if (err) {
                            console.log(err);
                            logWriter.log("Department.js update Department.update " + err);
                            res.send(500, {error: "Can't update Department"});
                        } else {

                            if (data.isAllUpdate) {
                                updateNestingLevel(req, _id, data.nestingLevel, function () {
                                    res.send(200, {success: 'Department updated success'});
                                });
                            } else {
                                res.send(200, {success: 'Department updated success'});

                                if ((dbName === CONSTANTS.WTRACK_DB_NAME) || (dbName === "production") || (dbName === "development")) {
                                    EmployeeSchema = mongoose.Schemas['Employee'];
                                    EmployeeModel = models.get(dbName, 'Employee', EmployeeSchema);

                                    event.emit('updateName', _id, EmployeeModel, 'department._id', 'department.name', result.departmentName);
                                }
                            }
                        }
                    });

                }
            })
        }
        catch (exception) {
            console.log(exception);
            logWriter.log("Department.js update " + exception);
            res.send(500, { error: 'Department updated error' });
        }
    }

    function removeAllChild(req, arrId, callback) {
        if (arrId.length > 0) {
            models.get(req.session.lastDb, 'Department', DepartmentSchema).find({parentDepartment: {$in: arrId}}, {_id: 1}, function (err, res) {
                models.get(req.session.lastDb, 'Department', DepartmentSchema).find({parentDepartment: {$in: arrId}}, {multi: true}).remove().exec(function (err, result) {
                    arrId = res.map(function (item) {
                        return item._id;
                    });
                    removeAllChild(req, arrId, callback);
                });

            });
        } else {
            if (callback) callback();
        }
    }

    function remove(req, _id, res) {
        models.get(req.session.lastDb, 'Department', DepartmentSchema).remove({_id: _id}, function (err, result) {
            if (err) {
                console.log(err);
                logWriter.log("Department.js remove department.remove " + err);
                res.send(500, {error: "Can't remove Department"});
            } else {
                removeAllChild(req, [_id].objectID(), function () {
                    res.send(200, {success: 'Department removed'});
                });
            }
        });
    };


    return {

        create             : create,
        getDepartmentById  : getDepartmentById,
        getForDd           : getForDd,
        getForEditDd       : getForEditDd,
        get                : get,
        getCustomDepartment: getCustomDepartment,
        update             : update,
        remove             : remove
    };
};

module.exports = Department;
