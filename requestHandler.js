require('pmx').init();

var requestHandler = function (event, mainDb) {
    var dbsObject = mainDb.dbsObject;
    var mongoose = require('mongoose');
    var async = require('async');
    var _ = require('./node_modules/underscore');
    var logWriter = require("./Modules/additions/logWriter.js")();
    var models = require("./models.js")(dbsObject);
    var department = require("./Modules/Department.js")(event, models);
    var users = require("./Modules/Users.js")(mainDb, models);
    var profile = require("./Modules/Profile.js")(models);
    var access = require("./Modules/additions/access.js")(models);
    var employee = require("./Modules/Employees.js")(event, models);
    var customer = require("./Modules/Customers.js")(event, models);
    var workflow = require("./Modules/Workflow.js")(models, event);
    var project = require("./Modules/Projects.js")(models, event);
    var jobPosition = require("./Modules/JobPosition.js")(event, models);
    var degrees = require("./Modules/Degrees.js")(models);
    var campaigns = require("./Modules/Campaigns.js")(models);
    var opportunities = require("./Modules/Opportunities.js")(models, event);
    var modules = require("./Modules/Module.js")(models);
    var sources = require("./Modules/Sources.js")(models);
    var languages = require("./Modules/Languages.js")(models);
    var jobType = require("./Modules/JobType.js")(models);
    var nationality = require("./Modules/Nationality.js")(models);
    var birthdays = require("./Modules/Birthdays.js")(models, event);

    var tasksSchema = mongoose.Schemas['Task'];
    var projectSchema = mongoose.Schemas['Project'];
    var employeeSchema = mongoose.Schemas['Employee'];
    var jobPositionSchema = mongoose.Schemas['JobPosition'];
    var opportunitiesSchema = mongoose.Schemas['Opportunitie'];
    var userSchema = mongoose.Schemas['User'];
    var HoursCashesSchema = mongoose.Schemas['HoursCashes'];
    var wTrackSchema = mongoose.Schemas['wTrack'];
    var SalarySchema = mongoose.Schemas['Salary'];
    var MonthHoursSchema = mongoose.Schemas['MonthHours'];
    var ObjectId = mongoose.Types.ObjectId;


    //binding for remove Workflow
    event.on('removeWorkflow', function (req, wId, id) {
        var query;
        switch (wId) {
            case "Opportunities":
            case "Leads":
                query = models.get(req.session.lastDb, "Opportunities", opportunitiesSchema);
                break;
            case "Projects":
                query = models.get(req.session.lastDb, "Project", projectSchema);
                break;
            case "Tasks":
                query = models.get(req.session.lastDb, "Tasks", tasksSchema);
                break;
            case "Applications":
                query = models.get(req.session.lastDb, "Employees", employeeSchema);
                break;
            case "Jobpositions":
                query = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);
                break;

        }
        if (query) {
            query.update({workflow: id}, {workflow: null}, {multi: true}).exec(function (err, result) {
                if (err) {
                    console.log(err);
                    logWriter.log("Removed workflow update " + err);
                }
            });
        }
    });

    event.on('dropHoursCashes', function (req) {
        var HoursCashes = models.get(req.session.lastDb, 'HoursCashes', HoursCashesSchema);

        HoursCashes.remove({}, function (err, result) {
            if (err) {
                return next(err);
            }

            console.log('HoursCashes removed');
        });

    });

    event.on('updateCost', function (params) {
        var update = _.debounce(updateWTrack, 500);

        update();

        function updateWTrack (){
            var req = params.req;
            var year = params.year;
            var month = params.month;
            var fixedExpense = params.fixedExpense;
            var expenseCoefficient = params.expenseCoefficient;
            var hours = params.hours;

            var monthFromSalary = params.monthFromSalary;
            var yearFromSalary = params.yearFromSalary;
            var waterfallTasks = [getWTracks, getBaseSalary];
            var wTrack = models.get(req.session.lastDb, "wTrack", wTrackSchema);
            var monthHours = models.get(req.session.lastDb, "MonthHours", MonthHoursSchema);

            if (monthFromSalary && yearFromSalary) {
                year = parseInt(yearFromSalary);
                month = parseInt(monthFromSalary);
            }

            async.waterfall(waterfallTasks, function (err, result) {
                var baseSalary;

                if (err) {
                    return console.log(err);
                }

                baseSalary = result;

                baseSalary.forEach(function (object) {
                    var key = Object.keys(object)[0];

                    wTrack
                        .find({
                            month: month,
                            year: year,
                            'employee._id': ObjectId(key)
                        }, {
                            worked: 1,
                            revenue: 1,
                            'employee._id': 1,
                            _id: 1
                        }, function (err, result) {
                            if (err) {
                                return console.log(err);
                            }

                            if (monthFromSalary && yearFromSalary) {
                                var query = monthHours.find({month: month, year: year}).lean();

                                query.exec(function (err, monthHour) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    if (monthHour[0]) {
                                        fixedExpense = parseInt(monthHour[0].fixedExpense);
                                        expenseCoefficient = parseFloat(monthHour[0].expenseCoefficient);
                                        hours = parseInt(monthHour[0].hours);
                                    } else {
                                        fixedExpense = 0;
                                        expenseCoefficient = 0;
                                        hours = 1;
                                    }


                                    result.forEach(function (element) {
                                        var id = element._id;
                                        var calc = ((((object[key] * expenseCoefficient) + fixedExpense) / hours) * element.worked).toFixed(2);

                                        wTrack.findByIdAndUpdate(id, {
                                            $set: {
                                                cost: parseFloat(calc) * 100
                                            }
                                        }, {
                                            new: true
                                        }, function (err, result) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        });

                                    });
                                });
                            } else {
                                result.forEach(function (element) {
                                    var id = element._id;
                                    var calc = ((((object[key] * expenseCoefficient) + fixedExpense) / hours) * element.worked).toFixed(2);
                                    var profit = parseFloat(element.revenue) - parseFloat(calc) * 100;

                                    wTrack.findByIdAndUpdate(id, {
                                        $set: {
                                            cost: parseFloat(calc) * 100,
                                            profit: profit
                                        }
                                    }, {
                                        new: true
                                    }, function (err, result) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });

                                });
                            }


                        });
                });
            });

            function getWTracks(cb) {
                wTrack.aggregate([{
                    $match: {
                        year: year,
                        month: month
                    }
                }, {
                    $group: {
                        _id: '$employee._id'
                    }
                }], function (err, wTracks) {
                    var result;

                    if (err) {
                        return cb(err);
                    }

                    result = _.pluck(wTracks, '_id');
                    cb(null, result)
                });
            };

            function getBaseSalary(result, cb) {
                var Salary = models.get(req.session.lastDb, 'Salary', SalarySchema);
                var query = Salary
                    .find(
                    {
                        'employee._id': {$in: result},
                        month: month,
                        year: year
                    }, {
                        baseSalary: 1,
                        'employee._id': 1
                    })
                    .lean();
                query.exec(function (err, salary) {
                    if (err) {
                        return cb(err);
                    }
                    var result = _.map(salary, function (element) {
                        var obj = {};

                        obj[element.employee._id] = element.baseSalary;
                        return obj;
                    });

                    cb(null, result)
                });
            };
        };
    });


    //if name was updated, need update related wTrack, or other models

    event.on('updateName', function (id, targetModel, searchField, fieldName, fieldValue, fieldInArray) {
        //fieldInArray(bool) added for update values in array. If true then fieldName contains .$.
        var sercObject = {};
        var updateObject = {};

        sercObject[searchField] = id;

        if (fieldInArray) {
            updateObject['$set'] = {};
            updateObject['$set'][fieldName] = fieldValue;
        } else {
            updateObject[fieldName] = fieldValue;
        }

        targetModel.update(sercObject, updateObject, {multi: true}, function (err) {
            if (err) {
                logWriter.log('requestHandler_eventEmiter_updateName', err.message);
            }
        });
    });
    //binding for Sequence
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
                    if (callback) callback((inc == -1) ? end : start);
                });
            } else {
                if (isCreate) {
                    query = model.count({"workflow": workflowStart}).exec(function (err, res) {
                        if (callback) callback(res);
                    });
                }
                if (isDelete) {
                    objChange = {};
                    objFind = {"workflow": workflowStart};
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
                if (callback) callback(end);
            });


        }
    });

    Array.prototype.objectID = function () {

        var _arrayOfID = [];
        var objectId = mongoose.Types.ObjectId;
        for (var i = 0; i < this.length; i++) {
            if (this[i] && typeof this[i] == 'object' && this[i].hasOwnProperty('_id')) {
                _arrayOfID.push(this[i]._id);
            } else {
                if (typeof this[i] == 'string' && this[i].length === 24) {
                    _arrayOfID.push(objectId(this[i]));
                }
                if (this[i] === null || this[i] === 'null') {
                    _arrayOfID.push(null);
                }

            }
        }
        return _arrayOfID;
    };

    Array.prototype.getShowmore = function (countPerPage) {
        var showMore = false;
        for (var i = 0; i < this.length; i++) {
            if (this[i].count > countPerPage) {
                showMore = true;
            }
        }
        return showMore;
    };

    function getModules(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            models.get(req.session.lastDb, 'Users', userSchema).findById(req.session.uId, function (err, _user) {
                if (_user) {
                    modules.get(req, _user.profile, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function redirectFromModuleId(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            models.get(req.session.lastDb, 'Users', userSchema).findById(req.session.uId, function (err, _user) {
                if (_user) {
                    modules.redirectToUrl(req, _user.profile, res, id);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function login(req, res, next) {
        users.login(req, res, next);
    };

    // Get users Total count
    function usersTotalCollectionLength(req, res) {
        users.getTotalCount(req, res);
    }

    function createUser(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 7, function (access) {
                if (access) {
                    users.createUser(req, data.user, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getUsers(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            users.getUsers(req, res, data);
        } else {
            res.send(401);
        }
    };

    function getAllUserWithProfile(req, id, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            users.getAllUserWithProfile(req, id, res);
        } else {
            res.send(401);
        }
    };

    function currentUser(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            users.getUserById(req, req.session.uId, res);
        } else {
            res.send(401);
        }
    };

    function getUsersForDd(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            users.getUsersForDd(req, res);
        } else {
            res.send(401);
        }
    };

    // Get users for list
    function getFilterUsers(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 7, function (access) {
                if (access) {
                    users.getFilter(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getUserById(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 7, function (access) {
                if (access) {
                    users.getUserById(req, data.id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function updateCurrentUser(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            /* access.getEditWritAccess(req, req.session.uId, 7, function (access) {
             if (access) {*/
            users.updateUser(req, req.session.uId, req.body, res, data);
            /* } else {
             res.send(403);
             }
             });*/
        } else {
            res.send(401);
        }
    };

    function updateUser(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 7, function (access) {
                if (access) {
                    users.updateUser(req, id, data.user, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function removeUser(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 7, function (access) {
                if (access) {
                    users.removeUser(req, id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    //---------------------Profile--------------------------------
    function createProfile(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 51, function (access) {
                if (access) {
                    profile.createProfile(req, data.profile, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getProfile(req, res) {
        try {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                access.getReadAccess(req, req.session.uId, 51, function (access) {
                    if (access) {
                        profile.getProfile(req, res);
                    } else {
                        res.send(403);
                    }
                });

            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            console.log("requestHandler.js  " + Exception);
        }
    };

    function getProfileForDd(req, res) {
        try {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                profile.getProfileForDd(req, res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            console.log("requestHandler.js  " + Exception);
        }
    };

    function updateProfile(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 51, function (access) {
                if (access) {
                    profile.updateProfile(req, id, data.profile, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function removeProfile(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 51, function (access) {
                if (access) {
                    profile.removeProfile(req, id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    //---------------Persons--------------------------------
    function getForDdByRelatedUser(req, res) {
        try {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                employee.getForDdByRelatedUser(req, req.session.uId, res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            errorLog("requestHandler.js  " + Exception);
        }
    };

    function Birthdays(req, res) {
        try {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                birthdays.get(req, res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            errorLog("requestHandler.js  " + Exception);
        }
    };

    function getPersonsForDd(req, res) {
        try {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                employee.getForDd(req, res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            errorLog("requestHandler.js  " + Exception);
        }
    };

    function getFilterPersonsForMiniView(req, res, data) {
        try {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                customer.getFilterPersonsForMiniView(req, res, data);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            errorLog("requestHandler.js  " + Exception);
        }
    };

    function getCustomer(req, res, data) {
        try {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                customer.getCustomers(req, res, data);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            errorLog("requestHandler.js  " + Exception);
            res.send(500, {error: Exception});
        }
    };

    function getPersonById(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 49, function (access) {
                if (access) {
                    customer.getPersonById(req, data.id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function createPerson(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 49, function (access) {
                if (access) {
                    data.person.uId = req.session.uId;
                    customer.create(req, data.person, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function updatePerson(req, res, id, data, remove) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 49, function (access) {
                if (access) {
                    data.person.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }
                    customer.update(req, id, remove, data.person, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };
    function personUpdateOnlySelectedFields(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 49, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    customer.updateOnlySelectedFields(req, id, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function uploadFile(req, res, id, file) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 49, function (access) {
                if (access) {
                    models.get(req.session.lastDb, "Customers", customer.schema).findByIdAndUpdate(id, {$push: {attachments: {$each: file}}}, function (err, response) {
                        if (err) {
                            res.send(401);
                        } else {
                            res.send(200, {success: 'Customers updated success', data: response});
                        }
                    });
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function removePerson(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 49, function (access) {
                if (access) {
                    customer.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };


    //---------------------Project--------------------------------
    function createProject(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.project.uId = req.session.uId;
                    project.create(req, data.project, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function updateOnlySelectedFields(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    project.updateOnlySelectedFields(req, id, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getProjectType(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            project.getProjectType(req, res);
        } else {
            res.send(401);
        }
    }

    function getProjects(req, res, data, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.uId = req.session.uId;
                    project.get(req, data, res, next);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };
    function getProjectPMForDashboard(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.getProjectPMForDashboard(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getProjectByEndDateForDashboard(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.getProjectByEndDateForDashboard(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getProjectStatusCountForDashboard(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.getProjectStatusCountForDashboard(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getProjectsForList(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.uId = req.session.uId;
                    project.getProjectsForList(req, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getProjectsById(req, res, data) {

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.getById(req, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getProjectsForDd(req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            project.getForDd(req, res, next);
        } else {
            res.send(401);
        }
    };

    function updateProject(req, res, id, data, remove) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    data.project.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }
                    project.update(req, id, data.project, res, remove);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function uploadProjectsFiles(req, res, id, file) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.update(req, id, {$push: {attachments: {$each: file}}}, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function removeProject(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    project.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    //---------------------Tasks-------------------------------
    function createTask(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    data.task.uId = req.session.uId;
                    project.createTask(req, data.task, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getTasksLengthByWorkflows(req, options, res) {
        project.getCollectionLengthByWorkflows(req, options, res);
    }

    function getTaskById(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    project.getTaskById(req, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

    };

    function getTasksForList(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    project.getTasksForList(req, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

    };

    function getTasksForKanban(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    project.getTasksForKanban(req, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

    };

    function removeTask(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    project.removeTask(req, id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function updateTask(req, res, id, data, remove) {
        var date = Date.now();
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    data.task['editedBy'] = {
                        user: req.session.uId,
                        date: date
                    };
                    project.updateTask(req, id, data.task, res, remove);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function taskUpdateOnlySelectedFields(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    project.taskUpdateOnlySelectedFields(req, id, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function uploadTasksFiles(req, res, id, file) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 40, function (access) {
                if (access) {
                    project.addAtachments(req, id, {$push: {attachments: {$each: file}}}, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getTasksPriority(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            project.getTasksPriority(req, res);
        } else {
            res.send(401);
        }
    };

    //------------------Workflow---------------------------------

    function getRelatedStatus(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            workflow.getRelatedStatus(req, res, data);
        } else {
            res.send(401);
        }
    };

    function getWorkflow(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            /*access.getReadAccess(req, req.session.uId, 44, function (access) {
             if (access) {*/
            workflow.get(req, data, res);
            /* } else {
             res.send(403);
             }
             });*/
        } else {
            res.send(401);
        }
    };

    function getWorkflowsForDd(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            workflow.getWorkflowsForDd(req, data, res);
        } else {
            res.send(401);
        }
    };

    function createWorkflow(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 44, function (access) {
                if (access) {
                    workflow.create(req, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function updateWorkflow(req, res, _id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 44, function (access) {
                if (access) {
                    workflow.update(req, _id, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function updateWorkflowOnlySelectedField(req, res, _id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 44, function (access) {
                if (access) {
                    workflow.updateOnlySelectedFields(req, _id, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function removeWorkflow(req, res, _id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    workflow.remove(req, _id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    //---------------------Companies-------------------------------

    function getCompaniesForDd(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            customer.getCompaniesForDd(req, res);

        } else {
            res.send(401);
        }
    };

    function getCompanyById(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    customer.getCompanyById(req, data.id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function removeCompany(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    customer.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function createCompany(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.company.uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    customer.create(req, data.company, res);

                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function updateCompany(req, res, id, data, remove) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            var date = mongoose.Schema.Types.Date;
            data.company.editedBy = {
                user: req.session.uId,
                date: new Date().toISOString()
            }
            access.getEditWritAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    customer.update(req, id, remove, data.company, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };
    function companyUpdateOnlySelectedFields(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    customer.updateOnlySelectedFields(req, id, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    // Get  Persons or Companies or ownCompanies for list and thumbnail
    function getFilterCustomers(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 50, function (access) {
                if (access) {
                    customer.getFilterCustomers(req, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    // Get  Persons or Companies or ownCompanies images for thumbnails
    function getCustomersImages(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            /*access.getReadAccess(req, req.session.uId, 43, function (access) {
             if (access) {
             customer.getCustomersImages(req, res);
             } else {
             res.send(403);
             }
             });*/
            customer.getCustomersImages(req, res);
        } else {
            res.send(401);
        }
    };

    // Get Alphabet for Companies or ownCompanies or Persons
    function getCustomersAlphabet(req, res) {
        try {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                customer.getCustomersAlphabet(req, res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            console.log("requestHandler.js  " + Exception);
        }
    };

    //---------------------JobPosition--------------------------------

    // get  jobPositions Total count
    function jobPositionsTotalCollectionLength(req, res) {
        jobPosition.getTotalCount(req, res);
    }

    function createJobPosition(req, res, data) {

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.jobPosition.uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.create(req, data.jobPosition, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getJobType(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            jobType.getForDd(req, res);
        } else {
            res.send(401);
        }
    }

    function getNationality(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            nationality.getForDd(req, res);
        } else {
            res.send(401);
        }
    }

    function getJobPositionForDd(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            jobPosition.getJobPositionForDd(req, res);
        } else {
            res.send(401);
        }
    };

    // Get JobPosition for list
    function getFilterJobPosition(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 14, function (access) {
                if (access) {
                    // jobPosition.getFilter(req, res);
                    jobPosition.get(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getJobPositionById(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.getJobPositionById(req, data.id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }

    };

    function updateJobPosition(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.jobPosition.editedBy = {
                user: req.session.uId,
                date: new Date().toISOString()
            }
            access.getEditWritAccess(req, req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.update(req, id, data.jobPosition, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function removeJobPosition(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 14, function (access) {
                if (access) {
                    jobPosition.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    //---------------------Employee--------------------------------

    function employeesTotalCollectionLength(req, res) {
        employee.getTotalCount(req, res);
    }

    function createEmployee(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    data.employee.uId = req.session.uId;
                    employee.create(req, data.employee, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function uploadEmployeesFile(req, res, id, files) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    employee.addAtach(req, id, files, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    // get employee or Applications for list or thumbnails
    function getEmployeesFilter(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    employee.getFilter(req, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    // Get Employee form by employee id
    function getEmployeesById(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    employee.getById(req, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

    };

    function updateEmployees(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    data.employee.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };

                    employee.update(req, id, data.employee, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };
    function employeesUpdateOnlySelectedFields(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    employee.updateOnlySelectedFields(req, id, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function removeEmployees(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    employee.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };
    function getEmployeesAlphabet(req, res) {
        try {
            if (req.session && req.session.loggedIn && req.session.lastDb) {
                employee.getEmployeesAlphabet(req, res);
            } else {
                res.send(401);
            }
        }
        catch (Exception) {
            console.log("requestHandler.js  " + Exception);
        }
    };


    //---------------------Application--------------------------------
    function getApplicationsLengthByWorkflows(req, res) {
        employee.getCollectionLengthByWorkflows(req, res);
    }

    function createApplication(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 43, function (access) {
                if (access) {
                    data.employee.uId = req.session.uId;
                    employee.create(req, data.employee, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getApplicationById(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 43, function (access) {
                if (access) {
                    employee.getById(req, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getApplicationsForKanban(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 43, function (access) {
                if (access) {
                    employee.getApplicationsForKanban(req, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getEmployeesImages(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 42, function (access) {
                if (access) {
                    employee.getEmployeesImages(req, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function updateApplication(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 43, function (access) {
                if (access) {
                    data.employee.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    }

                    employee.update(req, id, data.employee, res);
                } else {
                    res.send(403);
                }
            })

        } else {
            res.send(401);
        }
    };

    function uploadApplicationFile(req, res, id, files) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 43, function (access) {
                if (access) {
                    employee.addAtach(req, id, files, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };
    function aplicationUpdateOnlySelectedFields(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 43, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    employee.updateOnlySelectedFields(req, id, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function removeApplication(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 43, function (access) {
                if (access) {
                    employee.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    //---------------------Department--------------------------------
    function createDepartment(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.department.uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 15, function (access) {
                if (access) {
                    department.create(req, data.department, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getDepartment(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 15, function (access) {
                if (access) {
                    department.get(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function updateDepartment(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.department.editedBy = {
                user: req.session.uId,
                date: new Date().toISOString()
            }
            access.getEditWritAccess(req, req.session.uId, 15, function (access) {
                if (access) {
                    department.update(req, id, data.department, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function removeDepartment(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 15, function (access) {
                if (access) {
                    department.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function getDepartmentForDd(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            department.getForDd(req, res);
        } else {
            res.send(401);
        }
    }

    function getDepartmentForEditDd(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            department.getForEditDd(req, id, res);
        } else {
            res.send(401);
        }
    }

    function getCustomDepartment(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 15, function (access) {
                if (access) {
                    department.getCustomDepartment(req, data, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    };

    function getDepartmentById(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 15, function (access) {
                if (access) {
                    department.getDepartmentById(req, data.id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }

    };

    //---------------------Deegree--------------------------------
    function createDegree(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            degrees.create(req, data.degree, res);
        } else {
            res.send(401);
        }
    }

    function getDegrees(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            degrees.get(req, res);
        } else {
            res.send(401);
        }
    }

    function updateDegree(req, res, id, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            degrees.update(req, id, data.degree, res);
        } else {
            res.send(401);
        }
    }

    function removeDegree(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            degrees.remove(req, id, res);
        } else {
            res.send(401);
        }
    }

    //-----------------Campaigns--------------------------------------
    function getCampaigns(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            campaigns.getForDd(req, res);
        } else {
            res.send(401);
        }
    }

    function getLeadsById(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.getById(req, data.id, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function createLead(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.lead.uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.create(req, data.lead, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function updateLead(req, res, id, data) {
        var date = Date.now();
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.lead['editedBy'] = {
                user: req.session.uId,
                date: date
            };
            access.getEditWritAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.updateLead(req, id, data.lead, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function removeLead(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function getLeadsForChart(req, res, data) {
        if (req.session && req.session.loggedIn) {
            access.getReadAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.getLeadsForChart(req, res, data);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    //-------------------Opportunities---------------------------

    // Get  Leads or Opportunities for List
    function getFilterOpportunities(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 24, function (access) {
                if (access) {
                    opportunities.getFilter(req, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    // Get  Leads or Opportunities total count
    function opportunitiesTotalCollectionLength(req, res) {
        opportunities.getTotalCount(req, res);
    }

    function getOpportunitiesLengthByWorkflows(req, res) {
        opportunities.getCollectionLengthByWorkflows(req, res);
    }

    function createOpportunitie(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.opportunitie.uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.create(req, data.opportunitie, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function getOpportunityById(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.getById(req, data.id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function getFilterOpportunitiesForMiniView(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.getFilterOpportunitiesForMiniView(req, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };


    function getFilterOpportunitiesForKanban(req, res, data) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.getFilterOpportunitiesForKanban(req, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function updateOpportunitie(req, res, id, data) {
        var date = Date.now();
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            data.opportunitie['editedBy'] = {
                user: req.session.uId,
                date: date
            };
            access.getEditWritAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.update(req, id, data.opportunitie, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function opportunitieUpdateOnlySelectedFields(req, res, id, data) {
        data = data.opportunitie;
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    data.editedBy = {
                        user: req.session.uId,
                        date: new Date().toISOString()
                    };
                    opportunities.updateOnlySelectedFields(req, id, data, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    }

    function removeOpportunitie(req, res, id) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, 25, function (access) {
                if (access) {
                    opportunities.remove(req, id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }
    }

    function uploadOpportunitiesFiles(req, res, id, file) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, 39, function (access) {
                if (access) {
                    opportunities.update(req, id, {$push: {attachments: {$each: file}}}, res);
                } else {
                    res.send(403);
                }
            });
        } else {
            res.send(401);
        }
    };

    function getSources(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            sources.getForDd(req, res);
        } else {
            res.send(401);
        }
    }

    function getLanguages(req, res) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            languages.getForDd(req, res);
        } else {
            res.send(401);
        }
    }

    // Get  Persons or Companies or ownCompanies total count
    function customerTotalCollectionLength(req, res) {
        customer.getTotalCount(req, res);
    }

    function projectsTotalCollectionLength(req, res) {
        project.getTotalCount(req, res);
    }

    return {

        mongoose: mongoose,
        getModules: getModules,
        redirectFromModuleId: redirectFromModuleId,

        login: login,
        createUser: createUser,
        usersTotalCollectionLength: usersTotalCollectionLength,
        getUsers: getUsers,
        getUsersForDd: getUsersForDd,
        getUserById: getUserById,
        getFilterUsers: getFilterUsers,
        getAllUserWithProfile: getAllUserWithProfile,
        updateUser: updateUser,
        removeUser: removeUser,
        currentUser: currentUser,
        updateCurrentUser: updateCurrentUser,

        getProfile: getProfile,
        getProfileForDd: getProfileForDd,
        createProfile: createProfile,
        updateProfile: updateProfile,
        removeProfile: removeProfile,

        createPerson: createPerson,
        getPersonById: getPersonById,
        updatePerson: updatePerson,
        removePerson: removePerson,
        uploadFile: uploadFile,
        getCustomer: getCustomer,
        getFilterPersonsForMiniView: getFilterPersonsForMiniView,
        personUpdateOnlySelectedFields: personUpdateOnlySelectedFields,

        projectsTotalCollectionLength: projectsTotalCollectionLength,//for Showmore and Lists
        getProjects: getProjects,//for Thumbnails
        getProjectsForList: getProjectsForList,
        getProjectsById: getProjectsById,//Used for Edit view
        getProjectsForDd: getProjectsForDd,
        createProject: createProject,
        updateProject: updateProject,
        uploadProjectsFiles: uploadProjectsFiles,
        removeProject: removeProject,
        getProjectPMForDashboard: getProjectPMForDashboard,
        getProjectStatusCountForDashboard: getProjectStatusCountForDashboard,
        getProjectByEndDateForDashboard: getProjectByEndDateForDashboard,
        updateOnlySelectedFields: updateOnlySelectedFields,
        taskUpdateOnlySelectedFields: taskUpdateOnlySelectedFields,
        getProjectType: getProjectType,

        createTask: createTask,
        getTasksLengthByWorkflows: getTasksLengthByWorkflows,
        getTaskById: getTaskById,
        getTasksForList: getTasksForList,
        getTasksForKanban: getTasksForKanban,
        updateTask: updateTask,
        uploadTasksFiles: uploadTasksFiles,
        removeTask: removeTask,
        getTasksPriority: getTasksPriority,

        getCompaniesForDd: getCompaniesForDd,
        getCompanyById: getCompanyById,
        removeCompany: removeCompany,
        createCompany: createCompany,
        updateCompany: updateCompany,
        companyUpdateOnlySelectedFields: companyUpdateOnlySelectedFields,
        getFilterCustomers: getFilterCustomers,
        getCustomersImages: getCustomersImages,
        getCustomersAlphabet: getCustomersAlphabet,

        getRelatedStatus: getRelatedStatus,
        getWorkflow: getWorkflow,
        createWorkflow: createWorkflow,
        updateWorkflow: updateWorkflow,
        getWorkflowsForDd: getWorkflowsForDd,
        removeWorkflow: removeWorkflow,
        updateWorkflowOnlySelectedField: updateWorkflowOnlySelectedField,

        jobPositionsTotalCollectionLength: jobPositionsTotalCollectionLength,
        createJobPosition: createJobPosition,
        updateJobPosition: updateJobPosition,
        removeJobPosition: removeJobPosition,
        getJobPositionById: getJobPositionById,
        getJobPositionForDd: getJobPositionForDd,

        createEmployee: createEmployee,
        getFilterJobPosition: getFilterJobPosition,
        getForDdByRelatedUser: getForDdByRelatedUser,
        getEmployeesById: getEmployeesById,
        removeEmployees: removeEmployees,
        updateEmployees: updateEmployees,
        getEmployeesAlphabet: getEmployeesAlphabet,
        getEmployeesImages: getEmployeesImages,

        Birthdays: Birthdays,

        getPersonsForDd: getPersonsForDd,
        getDepartmentForDd: getDepartmentForDd,

        getApplicationsLengthByWorkflows: getApplicationsLengthByWorkflows,
        createApplication: createApplication,
        removeApplication: removeApplication,
        updateApplication: updateApplication,
        uploadApplicationFile: uploadApplicationFile,
        aplicationUpdateOnlySelectedFields: aplicationUpdateOnlySelectedFields,
        employeesUpdateOnlySelectedFields: employeesUpdateOnlySelectedFields,

        getDepartment: getDepartment,
        createDepartment: createDepartment,
        updateDepartment: updateDepartment,
        removeDepartment: removeDepartment,
        getDepartmentById: getDepartmentById,
        getCustomDepartment: getCustomDepartment,
        getDepartmentForEditDd: getDepartmentForEditDd,
        createDegree: createDegree,
        getDegrees: getDegrees,
        updateDegree: updateDegree,
        removeDegree: removeDegree,

        getCampaigns: getCampaigns,
        employeesTotalCollectionLength: employeesTotalCollectionLength,
        getEmployeesFilter: getEmployeesFilter,
        uploadEmployeesFile: uploadEmployeesFile,
        getApplicationById: getApplicationById,
        getApplicationsForKanban: getApplicationsForKanban,

        createLead: createLead,
        updateLead: updateLead,
        removeLead: removeLead,
        getLeadsById: getLeadsById,
        getLeadsForChart: getLeadsForChart,

        opportunitiesTotalCollectionLength: opportunitiesTotalCollectionLength,
        getOpportunitiesLengthByWorkflows: getOpportunitiesLengthByWorkflows,
        createOpportunitie: createOpportunitie,
        getFilterOpportunities: getFilterOpportunities,
        getFilterOpportunitiesForMiniView: getFilterOpportunitiesForMiniView,
        getFilterOpportunitiesForKanban: getFilterOpportunitiesForKanban,
        getOpportunityById: getOpportunityById,
        updateOpportunitie: updateOpportunitie,
        removeOpportunitie: removeOpportunitie,
        opportunitieUpdateOnlySelectedFields: opportunitieUpdateOnlySelectedFields,
        uploadOpportunitiesFiles: uploadOpportunitiesFiles,

        getSources: getSources,
        getLanguages: getLanguages,
        getJobType: getJobType,
        getNationality: getNationality,
        customerTotalCollectionLength: customerTotalCollectionLength
    }
}
//---------EXPORTS----------------------------------------
module.exports = requestHandler;
