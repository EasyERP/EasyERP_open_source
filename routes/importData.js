/**
 * Created by Roman on 27.05.2015.
 */
var async = require('async');
var express = require('express');
var router = express.Router();
var ImportHandler = require('../helpers/importer/importer');
var mongoose = require('mongoose');
var _ = require('lodash');
/*var multipart = require('connect-multiparty');
 var multipartMiddleware = multipart();*/
var tasks = require('../helpers/importer/map/').tmDevelopment;

module.exports = function (models) {
    var handler = ImportHandler({
        msSql: {
            user: 'thinkmobiles@wbje9y2n5u',
            password: '1q2w3e!@#',
            server: 'wbje9y2n5u.database.windows.net',
            database: 'ex_dev',

            options: {
                encrypt: true
            }
        }
    });

    function getAge(birthday) {
        var today = new Date();
        var years;
        if (birthday) {
            birthday = new Date(birthday);
            years = today.getFullYear() - birthday.getFullYear();

            birthday.setFullYear(today.getFullYear());

            if (today < birthday) {
                years--;
            }
            return (years < 0) ? 0 : years;
        }

        return 0;
    };

    function comparator(columnName, field) {
        var targetObject = _.find(field, function (fieldValue) {
            if (columnName === null || columnName === undefined) {
                columnName = 'null';
            }
            return fieldValue.value.toLowerCase() === columnName.toString().toLowerCase();
        });
        return targetObject ? targetObject.fieldValue : targetObject;
    };

    function queryBuilder(table) {
        return 'SELECT * FROM ' + table;
    };

    function salesImporter(req, tasks) {
        var projectSchema = tasks[3];
        var customerSchema = tasks[4];

        var ownerId = req.session ? req.session.uId : null;

        var customerCollection = customerSchema.collection;
        var projectCollection = projectSchema.collection;

        var ProjectSchema = projectCollection[projectCollection];
        var CustomerSchema = mongoose.Schemas[customerCollection];
        var EmployeeSchema = mongoose.Schemas['Employee'];
        var IndustrySchema = mongoose.Schemas['Industry'];
        var WorkflowSchema = mongoose.Schemas['workflow'];

        var Project = models.get(req.session.lastDb, projectCollection, ProjectSchema);
        var Customer = models.get(req.session.lastDb, customerCollection, CustomerSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', EmployeeSchema);
        var Industry = models.get(req.session.lastDb, 'Industry', IndustrySchema);
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);

        function importCustomer(customerSchema, seriesCb) {
            var query = queryBuilder(customerSchema.table);
            var waterfallTasks;

            function getData(callback) {
                handler.importData(query, callback);
            }

            function saverCustomer(fetchedArray, callback) {
                var model;
                var mongooseFields = Object.keys(customerSchema.aliases);

                async.eachLimit(fetchedArray, 100, function (fetchedCustomer, cb) {
                    var objectToSave = {};
                    var industryQuery;

                    for (var i = mongooseFields.length - 1; i >= 0; i--) {
                        var key = mongooseFields[i];
                        var msSqlKey = customerSchema.aliases[key];
                        var _comparator = customerSchema.comparator;

                        if (_comparator && msSqlKey in _comparator) {
                            fetchedCustomer[msSqlKey] = comparator(fetchedCustomer[msSqlKey], _comparator[msSqlKey]) || fetchedCustomer[msSqlKey];
                        }

                        objectToSave[key] = fetchedCustomer[msSqlKey];
                        objectToSave.createdBy = {
                            user: ownerId
                        };
                        objectToSave.editedBy = {
                            user: ownerId
                        }
                    }

                    if (fetchedCustomer) {
                        industryQuery = {
                            ID: fetchedCustomer['Industry']
                        };
                        Industry.findOne(industryQuery, {_id: 1}, function (err, industry) {
                            if (err) {
                                return cb(err);
                            }

                            objectToSave['companyInfo.industry'] = industry ? industry._id : industry;

                            model = new Customer(objectToSave);
                            model.save(function (err, customer) {
                                if (err) {
                                    console.error(err);
                                    return cb(err);
                                }
                                cb();
                            });
                        });

                    }
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, 'Completed');
                })
            }

            waterfallTasks = [getData, saverCustomer];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    seriesCb(err);
                }

                seriesCb(null, 'Complete')
            });
        };

        function customerImporter(callback) {
            importCustomer(customerSchema, callback);
        };

        function importProject(projectShema, seriesCb) {
            var query = queryBuilder(projectShema.table);
            var waterfallTasks;

            function getData(callback) {
                handler.importData(query, callback);
            }

            function fetchWorkflows(fetchedArray, callback) {
                var query = {
                    wId: 'Projects'
                };

                var projectionObject = {
                    status: 1,
                    _id: 1
                };

                Workflow.find(query, projectionObject, function (err, workflows) {
                    if (err) {
                        return callback(err);
                    }

                    workflows = _.groupBy(workflows, 'status');

                    callback(null, workflows, fetchedArray);
                });
            }

            function saverProject(workflows, fetchedArray, callback) {
                var model;

                var mongooseFields = Object.keys(projectShema.aliases);

                async.eachLimit(fetchedArray, 100, function (fetchedProject, cb) {
                    var objectToSave = {};
                    var customerQuery;
                    var employeeQuery;

                    for (var i = mongooseFields.length - 1; i >= 0; i--) {
                        var key = mongooseFields[i];
                        var msSqlKey = projectShema.aliases[key];

                        if (msSqlKey in projectShema.comparator) {
                            fetchedProject[msSqlKey] = comparator(fetchedProject[msSqlKey], projectShema.comparator[msSqlKey]);
                        }

                        if (key === 'workflow') {
                            objectToSave[key] = workflows[fetchedProject[msSqlKey]][0];
                        } else {
                            objectToSave[key] = fetchedProject[msSqlKey];
                        }
                        objectToSave.createdBy = {
                            user: ownerId
                        };
                        objectToSave.editedBy = {
                            user: ownerId
                        }
                    }

                    if (fetchedProject) {
                        employeeQuery = {
                            ID: fetchedProject['Assigned']
                        };
                        customerQuery = {
                            ID: fetchedProject['Company']
                        };

                        function customerFinder(callback) {
                            Customer.findOne(customerQuery, {_id: 1}, function (err, customer) {
                                if (err) {
                                    return callback(err);
                                }
                                callback(null, customer);
                            });
                        };

                        function employeeFinder(callback) {
                            Employee.findOne(employeeQuery, {_id: 1}, function (err, employee) {
                                if (err) {
                                    return callback(err);
                                }
                                callback(null, employee);
                            });
                        }

                        async.parallel({
                            customerResult: customerFinder,
                            employeeResult: employeeFinder
                        }, function (err, result) {
                            objectToSave.customer = result.customerResult ? result.customerResult._id : null;
                            objectToSave.projectmanager = result.employeeResult ? result.employeeResult._id : null;

                            model = new Project(objectToSave);
                            model.save(function (err, project) {
                                if (err) {
                                    console.error(err);
                                    return cb(err);
                                }
                                cb();
                            });
                        });
                    }
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, 'Completed');
                })
            }

            waterfallTasks = [getData, fetchWorkflows, saverProject];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    seriesCb(err);
                }

                seriesCb(null, 'Complete')
            });
        };

        function projectImporter(callback) {
            importProject(projectSchema, callback);
        };

        return [customerImporter, projectImporter];
    };

    function hrImporter(req, tasks) {
        var departmentShema = tasks[0];
        var jobPositionShema = tasks[1];
        var employeeShema = tasks[2];
        var ownerId = req.session ? req.session.uId : null;

        var jobPositionCollection = jobPositionShema.collection;
        var departmentCollection = departmentShema.collection;
        var employeeCollection = employeeShema.collection;

        var JobPositionSchema = mongoose.Schemas[jobPositionCollection];
        var DepartmentSchema = mongoose.Schemas[departmentCollection];
        var EmployeeSchema = mongoose.Schemas[employeeCollection];
        var WorkflowSchema = mongoose.Schemas['workflow'];

        var JobPosition = models.get(req.session.lastDb, jobPositionCollection, JobPositionSchema);
        var Department = models.get(req.session.lastDb, departmentCollection, DepartmentSchema);
        var Employee = models.get(req.session.lastDb, employeeCollection, EmployeeSchema);
        var Workflow = models.get(req.session.lastDb, 'workflows', WorkflowSchema);

        function importDepartment(departmentShema, seriesCb) {
            var query = queryBuilder(departmentShema.table);
            var waterfallTasks;

            function getData(callback) {
                handler.importData(query, callback);
            }

            function saverDepartment(fetchedArray, callback) {
                var model;
                var mongooseFields = Object.keys(departmentShema.aliases);

                async.eachLimit(fetchedArray, 100, function (fetchedDepartment, cb) {
                    var objectToSave = {};

                    for (var i = mongooseFields.length - 1; i >= 0; i--) {
                        var key = mongooseFields[i];
                        var msSqlKey = departmentShema.aliases[key];

                        objectToSave[key] = fetchedDepartment[msSqlKey];
                        objectToSave.createdBy = {
                            user: ownerId
                        };
                        objectToSave.editedBy = {
                            user: ownerId
                        }
                    }

                    if (fetchedDepartment) {
                        model = new Department(objectToSave);
                        model.save(cb);
                    }
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, 'Completed');
                })
            }

            waterfallTasks = [getData, saverDepartment];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    seriesCb(err);
                }

                seriesCb(null, 'Complete')
            });
        }

        function departmentImporter(callback) {
            importDepartment(departmentShema, callback);
        }

        function importJobPosition(jobPositionShema, seriesCb) {
            var query = queryBuilder(jobPositionShema.table);
            var waterfallTasks;

            function getData(callback) {
                handler.importData(query, callback);
            }

            function saverJobPosition(fetchedArray, callback) {
                var model;
                var mongooseFields = Object.keys(jobPositionShema.aliases);

                async.eachLimit(fetchedArray, 100, function (fetchedJobPosition, cb) {
                    var objectToSave = {};
                    var departmentQuery;

                    for (var i = mongooseFields.length - 1; i >= 0; i--) {
                        var key = mongooseFields[i];
                        var msSqlKey = jobPositionShema.aliases[key];

                        if (jobPositionShema.comparator && msSqlKey in jobPositionShema.comparator) {
                            fetchedJobPosition[msSqlKey] = comparator(fetchedJobPosition[msSqlKey], jobPositionShema.comparator[msSqlKey]);
                        }

                        objectToSave[key] = fetchedJobPosition[msSqlKey];
                        objectToSave.createdBy = {
                            user: ownerId
                        };
                        objectToSave.editedBy = {
                            user: ownerId
                        }
                    }

                    if (fetchedJobPosition) {
                        departmentQuery = {
                            ID: fetchedJobPosition['Department']
                        };
                        Department.findOne(departmentQuery, {_id: 1}, function (err, department) {
                            if (err) {
                                return cb(err);
                            }

                            objectToSave.department = department._id;

                            model = new JobPosition(objectToSave);
                            model.save(cb);
                        });
                    }
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, 'Completed');
                })
            }

            waterfallTasks = [getData, saverJobPosition];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    seriesCb(err);
                }

                seriesCb(null, 'Complete')
            });
        }

        function jobPositionImporter(callback) {
            importJobPosition(jobPositionShema, callback);
        }

        function importEmployee(employeeShema, workflow, seriesCb) {
            var query = queryBuilder(employeeShema.table);
            var waterfallTasks;

            workflow = workflow ? workflow._id : null;

            function getData(callback) {
                handler.importData(query, callback);
            }

            function saverEmployee(fetchedArray, callback) {
                var model;
                var mongooseFields = Object.keys(employeeShema.aliases);

                async.eachLimit(fetchedArray, 100, function (fetchedEmployee, cb) {
                    var objectToSave = {};
                    var departmentQuery;
                    var key;
                    var msSqlKey;

                    for (var i = mongooseFields.length - 1; i >= 0; i--) {
                        key = mongooseFields[i];
                        msSqlKey = employeeShema.aliases[key];

                        if (employeeShema.defaultValues) {
                            for (var defKey in employeeShema.defaultValues) {
                                objectToSave[defKey] = employeeShema.defaultValues[defKey];
                            }
                        }

                        if (employeeShema.comparator && msSqlKey in employeeShema.comparator) {
                            fetchedEmployee[msSqlKey] = comparator(fetchedEmployee[msSqlKey], employeeShema.comparator[msSqlKey]) || fetchedEmployee[msSqlKey];
                        }

                        if (key === 'dateBirth') {
                            objectToSave.age = getAge(fetchedEmployee[msSqlKey]);
                        }

                        if (key === 'isEmployee') {
                            if (fetchedEmployee[msSqlKey] === false) {
                                objectToSave.workflow = workflow;
                            }
                        }

                        objectToSave[key] = fetchedEmployee[msSqlKey];
                        objectToSave.createdBy = {
                            user: ownerId
                        };
                        objectToSave.editedBy = {
                            user: ownerId
                        }
                    }

                    if (fetchedEmployee) {
                        departmentQuery = {
                            ID: fetchedEmployee['Department']
                        };

                        jobPositionQuery = {
                            ID: fetchedEmployee['JobPosition']
                        };

                        function departmentFinder(callback) {
                            Department.findOne(departmentQuery, {_id: 1}, function (err, department) {
                                if (err) {
                                    return callback(err);
                                }
                                callback(null, department);
                            });
                        };

                        function jobPositionFinder(callback) {
                            JobPosition.findOne(jobPositionQuery, {_id: 1}, function (err, jobPosition) {
                                if (err) {
                                    return callback(err);
                                }
                                callback(null, jobPosition);
                            });
                        }

                        async.parallel({
                            department: departmentFinder,
                            jobPosition: jobPositionFinder
                        }, function (err, result) {
                            objectToSave.department = result.department ? result.department._id : null;
                            objectToSave.jobPosition = result.jobPosition ? result.jobPosition._id : null;

                            model = new Employee(objectToSave);
                            model.save(cb);
                        });
                    }
                }, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, 'Completed');
                })
            }

            waterfallTasks = [getData, saverEmployee];

            async.waterfall(waterfallTasks, function (err, result) {
                if (err) {
                    seriesCb(err);
                }

                seriesCb(null, 'Complete')
            });
        }

        function employeeImporter(callback) {
            Workflow
                .findOne({
                    wId: 'Applications',
                    status: "Cancelled"
                }, {_id: 1})
                .sort({sequence: -1})
                .exec(function (err, workflow) {
                    if (err) {
                        return callback(err);
                    }

                    importEmployee(employeeShema, workflow, callback);
                });
        }

        return [departmentImporter, jobPositionImporter, employeeImporter];
    }

    router.post('/', function (req, res, next) {
        var hrTasks = hrImporter(req, tasks);
        var salesTasks = salesImporter(req, tasks);
        var seriesTasks = hrTasks.concat(salesTasks);

        async.series(seriesTasks, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send('Imported success');
        });

    });

    return router;
};