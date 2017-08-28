/*  TODO agregation validate for empty names    */
var Filters = function (models) {
    'use strict';

    var mongoose = require('mongoose');
    var _ = require('../node_modules/underscore');
    var objectId = mongoose.Types.ObjectId;
    var async = require('async');
    var CONSTANTS = require('../constants/mainConstants.js');
    var moment = require('../public/js/libs/moment/moment');
    var FILTER_CONSTANTS = require('../public/js/constants/filters');

    this.getProjectsDashboardFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var ProjectSchema = mongoose.Schemas.Project;
        var jobsSchema = mongoose.Schemas.jobs;
        var Project = models.get(lastDB, 'Project', ProjectSchema);
        var Jobs = models.get(lastDB, 'jobs', jobsSchema);
        var pipeLine;
        var aggregation;
        var pipeLineJobs;

        pipeLineJobs = [{
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $project: {
                workflow: {$arrayElemAt: ['$workflow', 0]},
                type    : 1
            }
        }, {
            $group: {
                _id: null,

                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                },

                type: {
                    $addToSet: {
                        _id : '$type',
                        name: '$type'
                    }
                }
            }
        }];

        pipeLine = [{
            $lookup: {
                from        : 'Customers',
                localField  : 'customer',
                foreignField: '_id',
                as          : 'customer'
            }
        }, {
            $project: {
                name    : 1,
                customer: {$arrayElemAt: ['$customer', 0]}
            }
        }, {
            $group: {
                _id: null,

                customer: {
                    $addToSet: {
                        _id : '$customer._id',
                        name: {$concat: ['$customer.name.first', ' ', '$customer.name.last']}
                    }
                },

                name: {
                    $addToSet: {
                        _id : '$_id',
                        name: '$name'
                    }
                }
            }
        }];

        aggregation = Project.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            Jobs.aggregate(pipeLineJobs, function (err, jobs) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(jobs.length ? _.extend(result, jobs[0]) : result);
            });
        });
    };

    this.getContarctJobsFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var jobsSchema = mongoose.Schemas.jobs;
        var Jobs = models.get(lastDB, 'jobs', jobsSchema);
        var pipeLine;
        var aggregation;

        pipeLine = [{
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $lookup: {
                from        : 'projectMembers',
                localField  : 'project',
                foreignField: 'projectId',
                as          : 'projectMembers'
            }
        }, {
            $lookup: {
                from        : 'Project',
                localField  : 'project',
                foreignField: '_id',
                as          : 'project'
            }
        }, {
            $project: {
                name           : 1,
                project        : {$arrayElemAt: ['$project', 0]},
                workflow       : {$arrayElemAt: ['$workflow', 0]},
                customer       : {$arrayElemAt: ['$customer', 0]},
                projectManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.PROJECTSMANAGER)]
                            }]
                        }
                    }
                },

                salesManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                            }]
                        }
                    }
                }
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'project.customer',
                foreignField: '_id',
                as          : 'customer'
            }
        }, {
            $project: {
                project        : 1,
                workflow       : 1,
                customer       : {$arrayElemAt: ['$customer', 0]},
                projectManagers: 1,
                salesManagers  : 1
            }
        }, {
            $unwind: {
                path                      : '$projectManagers',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $unwind: {
                path                      : '$salesManagers',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesManagers.employeeId',
                foreignField: '_id',
                as          : 'salesManager'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'projectManagers.employeeId',
                foreignField: '_id',
                as          : 'projectManager'
            }
        }, {
            $project: {
                project       : 1,
                workflow      : 1,
                customer      : 1,
                projectManager: {$arrayElemAt: ['$projectManager', 0]},
                salesManager  : {$arrayElemAt: ['$salesManager', 0]}
            }
        }, {
            $project: {
                project     : 1,
                workflow    : 1,
                customer    : 1,
                salesManager: {
                    _id : '$salesManager._id',
                    name: {
                        $concat: ['$salesManager.name.first', ' ', '$salesManager.name.last']
                    }
                },

                projectManager: {
                    _id : '$projectManager._id',
                    name: {
                        $concat: ['$projectManager.name.first', ' ', '$projectManager.name.last']
                    }
                }
            }
        }, {
            $group: {
                _id: null,

                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                },

                customer: {
                    $addToSet: {
                        _id : '$customer._id',
                        name: {
                            $concat: ['$customer.name.first', ' ', '$customer.name.last']
                        }
                    }
                },

                projectManager: {
                    $addToSet: {
                        _id: {
                            $cond: {
                                if  : {$eq: ['$projectManager.name', null]},
                                then: 'null',
                                else: '$projectManager._id'
                            }
                        },

                        name: {
                            $cond: {
                                if  : {$eq: ['$projectManager.name', null]},
                                then: 'Empty',
                                else: '$projectManager.name'
                            }
                        }
                    }
                },

                salesManager: {
                    $addToSet: {
                        _id: {
                            $cond: {
                                if  : {$eq: ['$salesManager.name', null]},
                                then: 'null',
                                else: '$salesManager._id'
                            }
                        },

                        name: {
                            $cond: {
                                if  : {$eq: ['$salesManager.name', null]},
                                then: 'Empty',
                                else: '$salesManager.name'
                            }
                        }
                    }
                },

                project: {
                    $addToSet: {
                        _id : '$project._id',
                        name: '$project.name'
                    }
                }
            }
        }
        ];

        aggregation = Jobs.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getEmployeesFilters = function (req, res, next) {
        var query = {isEmployee: true}; // = req.query ? req.query.filter || req.query : {};
        var lastDB = req.session.lastDb;
        var EmployeeSchema = mongoose.Schemas.Employee;
        var Employee = models.get(lastDB, 'Employee', EmployeeSchema);
        var pipeLine;
        var aggregation;

        pipeLine = [
            {
                $match: query
            }, {
                $lookup: {
                    from        : 'Department',
                    localField  : 'department',
                    foreignField: '_id',
                    as          : 'department'
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'manager',
                    foreignField: '_id',
                    as          : 'manager'
                }
            }, {
                $lookup: {
                    from        : 'JobPosition',
                    localField  : 'jobPosition',
                    foreignField: '_id',
                    as          : 'jobPosition'
                }
            }, {
                $project: {
                    department : {$arrayElemAt: ['$department', 0]},
                    manager    : {$arrayElemAt: ['$manager', 0]},
                    jobPosition: {$arrayElemAt: ['$jobPosition', 0]},
                    name       : 1
                }
            }, {
                $project: {
                    department    : 1,
                    'manager._id' : 1,
                    'manager.name': {
                        $concat: ['$manager.name.first', ' ', '$manager.name.last']
                    },

                    jobPosition: 1,
                    name       : {
                        $concat: ['$name.first', ' ', '$name.last']
                    }
                }
            }, {
                $group: {
                    _id        : null,
                    name       : {
                        $addToSet: {
                            _id : '$_id',
                            name: {$ifNull: ['$name', 'None']}
                        }
                    },
                    department : {
                        $addToSet: {
                            _id : '$department._id',
                            name: {$ifNull: ['$department.name', 'None']}
                        }
                    },
                    jobPosition: {
                        $addToSet: {
                            _id : '$jobPosition._id',
                            name: {
                                $ifNull: ['$jobPosition.name', 'None']
                            }
                        }
                    },
                    manager    : {
                        $addToSet: {
                            _id : '$manager._id',
                            name: {
                                $ifNull: ['$manager.name', 'None']
                            }
                        }
                    }
                }
            }];

        aggregation = Employee.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            result.filterInfo = FILTER_CONSTANTS.Employees;

            res.status(200).send(result);
        });
    };

    this.getDealsTasksFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var TaskSchema = mongoose.Schemas.DealTasks;
        var Task = models.get(lastDB, 'DealTasks', TaskSchema);
        var pipeLine;
        var aggregation;
        var notNullQuery = {$and: [{$ne: ['$$element.name', null]}, {$ne: ['$$element.name', '']}]};

        pipeLine = [{
            $lookup: {
                from        : 'Employees',
                localField  : 'assignedTo',
                foreignField: '_id',
                as          : 'assignedTo'
            }
        }, {
            $lookup: {
                from        : 'Opportunities',
                localField  : 'deal',
                foreignField: '_id',
                as          : 'deal'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        },
            {
                $lookup: {
                    from        : 'tags',
                    localField  : 'category',
                    foreignField: '_id',
                    as          : 'category'
                }
            }, {
                $project: {
                    description: 1,
                    workflow   : {$arrayElemAt: ['$workflow', 0]},
                    assignedTo : {$arrayElemAt: ['$assignedTo', 0]},
                    deal       : {$arrayElemAt: ['$deal', 0]},
                    category   : {$arrayElemAt: ['$category', 0]}
                }
            }, {
                $group: {
                    _id     : null,
                    deal    : {
                        $addToSet: {
                            _id : '$deal._id',
                            name: {$ifNull: ['$deal.name', '']}
                        }
                    },
                    category: {
                        $addToSet: {
                            _id : '$category._id',
                            name: {$ifNull: ['$category.name', '']}
                        }
                    },
                    name    : {
                        $addToSet: {
                            _id : '$_id',
                            name: '$description'
                        }
                    },

                    assignedTo: {
                        $addToSet: {
                            _id : '$assignedTo._id',
                            name: {
                                $ifNull: [{
                                    $concat: ['$assignedTo.name.first', ' ', '$assignedTo.name.last']
                                }, 'None']
                            }
                        }
                    },

                    workflow: {
                        $addToSet: {
                            _id : '$workflow._id',
                            name: {
                                $ifNull: ['$workflow.name', 'None']
                            }
                        }
                    }
                }
            }, {
                $project: {
                    deal      : {
                        $filter: {
                            input: '$deal',
                            as   : 'element',
                            cond : notNullQuery
                        }
                    },
                    category  : {
                        $filter: {
                            input: '$category',
                            as   : 'element',
                            cond : notNullQuery
                        }
                    },
                    name      : {
                        $filter: {
                            input: '$name',
                            as   : 'element',
                            cond : notNullQuery
                        }
                    },
                    assignedTo: {
                        $filter: {
                            input: '$assignedTo',
                            as   : 'element',
                            cond : notNullQuery
                        }
                    },
                    workflow  : {
                        $filter: {
                            input: '$workflow',
                            as   : 'element',
                            cond : notNullQuery
                        }
                    }
                }
            }];

        aggregation = Task.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};
            result.filterInfo = FILTER_CONSTANTS.DealTasks;

            res.status(200).send(result);
        });
    };

    this.getPersonFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var CustomerSchema = mongoose.Schemas.Customer;
        var Customer = models.get(lastDB, 'Customers', CustomerSchema);
        var aggregation;
        var pipeLine;
        var query = {type: 'Person'};
        var notNullQuery = {$and: [{$ne: ['$$element.name', null]}, {$ne: ['$$element.name', '']}]};

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'integrations',
                localField  : 'channel',
                foreignField: '_id',
                as          : 'channel'
            }
        }, {
            $project: {
                _id    : '$_id',
                name   : {$concat: ['$name.first', ' ', '$name.last']},
                address: '$address',
                channel: {$arrayElemAt: ['$channel', 0]}
            }
        }, {
            $group: {
                _id: null,

                name: {
                    $addToSet: {
                        _id : '$_id',
                        name: {
                            $cond: {
                                if: {
                                    $eq: ['$name', ' ']
                                },

                                then: 'None',
                                else: '$name'
                            }
                        }
                    }
                },

                channel: {
                    $addToSet: {
                        _id : '$channel._id',
                        name: '$channel.channelName'
                    }
                },

                country: {
                    $addToSet: {
                        _id: {
                            $cond: {
                                if: {
                                    $eq: ['$address.country', '']
                                },

                                then: 'None',
                                else: {$ifNull: ['$address.country', 'None']}
                            }
                        },

                        name: {
                            $cond: {
                                if: {
                                    $eq: ['$address.country', '']
                                },

                                then: 'None',
                                else: {$ifNull: ['$address.country', 'None']}
                            }
                        }
                    }
                }
            }
        }, {
            $project: {
                country: {
                    $filter: {
                        input: '$country',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },

                channel: {
                    $filter: {
                        input: '$channel',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },

                name: {
                    $filter: {
                        input: '$name',
                        as   : 'element',
                        cond : notNullQuery
                    }
                }
            }
        }];

        aggregation = Customer.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                result = result.length ? result[0] : {};

                result.services = [
                    {
                        name: 'Supplier',
                        _id : 'isSupplier'
                    }, {
                        name: 'Customer',
                        _id : 'isCustomer'
                    }];

                result.filterInfo = FILTER_CONSTANTS.Persons;

                res.status(200).send(result);
            }
        );
    };

    this.getCompaniesFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var CustomerSchema = mongoose.Schemas.Customer;
        var Customer = models.get(lastDB, 'Customers', CustomerSchema);
        var aggregation;
        var pipeLine;
        var query = {type: 'Company'};
        var notNullQuery = {$and: [{$ne: ['$$element.name', null]}, {$ne: ['$$element.name', '']}]};

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'integrations',
                localField  : 'channel',
                foreignField: '_id',
                as          : 'channel'
            }
        }, {
            $project: {
                _id    : '$_id',
                name   : {$concat: ['$name.first', ' ', '$name.last']},
                address: '$address',
                channel: {$arrayElemAt: ['$channel', 0]}
            }
        }, {
            $group: {
                _id: null,

                name: {
                    $addToSet: {
                        _id : '$_id',
                        name: {
                            $cond: {
                                if: {
                                    $eq: ['$name', ' ']
                                },

                                then: 'None',
                                else: '$name'
                            }
                        }
                    }
                },

                channel: {
                    $addToSet: {
                        _id : '$channel._id',
                        name: '$channel.channelName'
                    }
                },

                country: {
                    $addToSet: {
                        _id : '$address.country',
                        name: {$ifNull: ['$address.country', 'None']}
                    }
                }
            }
        }, {
            $project: {
                country: {
                    $filter: {
                        input: '$country',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },

                channel: {
                    $filter: {
                        input: '$channel',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },

                name: {
                    $filter: {
                        input: '$name',
                        as   : 'element',
                        cond : notNullQuery
                    }
                }
            }
        }];

        aggregation = Customer.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            result.services = [
                {
                    name: 'Supplier',
                    _id : 'isSupplier'
                }, {
                    name: 'Customer',
                    _id : 'isCustomer'
                }];

            result.filterInfo = FILTER_CONSTANTS.Companies;

            res.status(200).send(result);
        });
    };

    this.getApplicationFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var EmployeeSchema = mongoose.Schemas.Employee;
        var Employee = models.get(lastDB, 'Employee', EmployeeSchema);
        var query = {isEmployee: false};
        var pipeLine;
        var aggregation;

        pipeLine = [
            {
                $match: query
            }, {
                $lookup: {
                    from        : 'Department',
                    localField  : 'department',
                    foreignField: '_id',
                    as          : 'department'
                }
            }, {
                $lookup: {
                    from        : 'JobPosition',
                    localField  : 'jobPosition',
                    foreignField: '_id',
                    as          : 'jobPosition'
                }
            }, {
                $project: {
                    department : {$arrayElemAt: ['$department', 0]},
                    jobPosition: {$arrayElemAt: ['$jobPosition', 0]},
                    name       : 1
                }
            }, {
                $project: {
                    department : 1,
                    jobPosition: 1,
                    name       : {
                        $concat: ['$name.first', ' ', '$name.last']
                    }
                }
            }, {
                $group: {
                    _id: null,

                    name: {
                        $addToSet: {
                            _id : '$_id',
                            name: {$ifNull: ['$name', 'None']}
                        }
                    },

                    department: {
                        $addToSet: {
                            _id : '$department._id',
                            name: {$ifNull: ['$department.name', 'None']}
                        }
                    },

                    jobPosition: {
                        $addToSet: {
                            _id : '$jobPosition._id',
                            name: {
                                $ifNull: ['$jobPosition.name', 'None']
                            }
                        }
                    }
                }
            }];

        aggregation = Employee.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};
            result.filterInfo = FILTER_CONSTANTS.Applications;

            res.status(200).send(result);
        });
    };

    this.getProjectFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var ProjectSchema = mongoose.Schemas.Project;
        var Project = models.get(lastDB, 'Project', ProjectSchema);
        var pipeLine;
        var aggregation;

        pipeLine = [{
            $lookup: {
                from        : 'Customers',
                localField  : 'customer',
                foreignField: '_id',
                as          : 'customer'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $lookup: {
                from        : 'projectMembers',
                localField  : '_id',
                foreignField: 'projectId',
                as          : 'projectMembers'
            }
        }, {
            $project: {
                name           : 1,
                workflow       : {$arrayElemAt: ['$workflow', 0]},
                customer       : {$arrayElemAt: ['$customer', 0]},
                projectManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.PROJECTSMANAGER)]
                            }]
                        }
                    }
                },

                salesManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                            }]
                        }
                    }
                }
            }
        }, {
            $unwind: {
                path                      : '$projectManagers',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $unwind: {
                path                      : '$salesManagers',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesManagers.employeeId',
                foreignField: '_id',
                as          : 'salesManager'
            }
        }, {
            $project: {
                name           : 1,
                workflow       : 1,
                customer       : 1,
                projectManagers: 1,
                salesManager   : {$arrayElemAt: ['$salesManager', 0]}
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'projectManagers.employeeId',
                foreignField: '_id',
                as          : 'projectManager'
            }
        }, {
            $project: {
                name    : 1,
                workflow: 1,
                customer: 1,

                salesManager: {
                    _id : {$ifNull: ['$salesManager._id', 'None']},
                    name: {$concat: ['$salesManager.name.first', ' ', '$salesManager.name.last']}
                },

                projectManager: {$arrayElemAt: ['$projectManager', 0]}
            }
        }, {
            $project: {
                name          : 1,
                workflow      : 1,
                customer      : 1,
                salesManager  : 1,
                projectManager: {
                    _id : {$ifNull: ['$projectManager._id', 'None']},
                    name: {$concat: ['$projectManager.name.first', ' ', '$projectManager.name.last']}
                }
            }
        }, {
            $group: {
                _id: null,

                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                },

                customer: {
                    $addToSet: {
                        _id : '$customer._id',
                        name: {$concat: ['$customer.name.first', ' ', '$customer.name.last']}
                    }
                },

                projectManager: {
                    $addToSet: {
                        _id : '$projectManager._id',
                        name: {$ifNull: ['$projectManager.name', 'Empty']}
                    }
                },

                salesManager: {
                    $addToSet: {
                        _id : '$salesManager._id',
                        name: {$ifNull: ['$salesManager.name', 'Empty']}
                    }
                },

                name: {
                    $addToSet: {
                        _id : '$_id',
                        name: '$name'
                    }
                }
            }
        }];

        aggregation = Project.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getTasksFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var TaskSchema = mongoose.Schemas.Task;
        var Task = models.get(lastDB, 'Task', TaskSchema);
        var pipeLine;
        var aggregation;

        pipeLine = [{
            $lookup: {
                from        : 'Project',
                localField  : 'project',
                foreignField: '_id',
                as          : 'project'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'assignedTo',
                foreignField: '_id',
                as          : 'assignedTo'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $project: {
                summary   : 1,
                type      : 1,
                workflow  : {$arrayElemAt: ['$workflow', 0]},
                assignedTo: {$arrayElemAt: ['$assignedTo', 0]},
                project   : {$arrayElemAt: ['$project', 0]}
            }
        }, {
            $group: {
                _id    : null,
                project: {
                    $addToSet: {
                        _id : '$project._id',
                        name: '$project.name'
                    }
                },

                summary: {
                    $addToSet: {
                        _id : '$_id',
                        name: '$summary'
                    }
                },

                assignedTo: {
                    $addToSet: {
                        _id : '$assignedTo._id',
                        name: {
                            $ifNull: [{
                                $concat: ['$assignedTo.name.first', ' ', '$assignedTo.name.last']
                            }, 'None']
                        }
                    }
                },

                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: {
                            $ifNull: ['$workflow.name', 'None']
                        }
                    }
                },

                type: {
                    $addToSet: {
                        _id : '$type',
                        name: '$type'
                    }
                }
            }
        }];

        aggregation = Task.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getInvoiceFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var purchaseInvoicesSchema = mongoose.Schemas.purchaseInvoices;
        var Model = models.get(lastDB, 'purchaseInvoices', purchaseInvoicesSchema);
        var pipeLine;
        var aggregation;

        pipeLine = [{
            $match: {
                forSales: false,
                _type   : 'purchaseInvoices'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $project: {
                workflow: {$arrayElemAt: ['$workflow', 0]},
                supplier: {$arrayElemAt: ['$supplier', 0]}
            }
        }, {
            $group: {
                _id     : null,
                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                },
                supplier: {
                    $addToSet: {
                        _id : '$supplier._id',
                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        }
                    }
                }
            }
        }];

        aggregation = Model.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};
            result.filterInfo = FILTER_CONSTANTS.purchaseInvoices;

            res.status(200).send(result);
        });
    };

    this.getSalesInvoiceFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var wTrackInvoiceSchema = mongoose.Schemas.wTrackInvoice;
        var wTrackInvoice = models.get(lastDB, 'wTrackInvoice', wTrackInvoiceSchema);
        var pipeLine;
        var aggregation;
        var notNullQuery = {$and: [{$ne: ['$$element.name', null]}, {$ne: ['$$element.name', '']}]};

        pipeLine = [{
            $match: {
                forSales: true,
                _type   : 'wTrackInvoice'
            }
        }, {
            $lookup: {
                from        : 'projectMembers',
                localField  : 'project',
                foreignField: 'projectId',
                as          : 'projectMembers'
            }
        }, {
            $lookup: {
                from        : 'Project',
                localField  : 'project',
                foreignField: '_id',
                as          : 'project'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $project: {
                workflow: {$arrayElemAt: ['$workflow', 0]},
                supplier: {$arrayElemAt: ['$supplier', 0]},
                project : {$arrayElemAt: ['$project', 0]},

                salesManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]}
                    }
                }
            }
        }, {
            $unwind: {
                path                      : '$salesManagers',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesManagers.employeeId',
                foreignField: '_id',
                as          : 'salesManagers'
            }
        }, {
            $project: {
                workflow     : 1,
                supplier     : 1,
                salesManagers: {$arrayElemAt: ['$salesManagers', 0]},
                project      : 1
            }
        }, {
            $group: {
                _id     : null,
                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: {$ifNull: ['$workflow.name', '']}
                    }
                },

                project: {
                    $addToSet: {
                        _id : '$project._id',
                        name: {$ifNull: ['$project.name', '']}
                    }
                },

                salesPerson: {
                    $addToSet: {
                        _id : '$salesManagers._id',
                        name: {
                            $concat: ['$salesManagers.name.first', ' ', '$salesManagers.name.last']
                        }
                    }
                },

                supplier: {
                    $addToSet: {
                        _id : '$supplier._id',
                        name: {$concat: ['$supplier.name.first', ' ', '$supplier.name.last']}
                    }
                }
            }
        }, {
            $project: {
                salesPerson: {
                    $filter: {
                        input: '$salesPerson',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                supplier   : {
                    $filter: {
                        input: '$supplier',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                project    : {
                    $filter: {
                        input: '$project',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                workflow   : {
                    $filter: {
                        input: '$workflow',
                        as   : 'element',
                        cond : notNullQuery
                    }
                }
            }
        }];

        aggregation = wTrackInvoice.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};
            //result.filterInfo = FILTER_CONSTANTS.purchaseInvoices;

            res.status(200).send(result);
        });
    };

    this.getSalesInvoicesFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var InvoiceSchema = mongoose.Schemas.Invoices;
        var Proforma = models.get(lastDB, 'Invoices', InvoiceSchema);
        var pipeLine;
        var aggregation;
        var notNullQuery = {$and: [{$ne: ['$$element.name', null]}, {$ne: ['$$element.name', '']}]};

        pipeLine = [{
            $match: {
                forSales: true,
                _type   : 'Invoices'
            }
        }, {
            $lookup: {
                from        : 'projectMembers',
                localField  : 'project',
                foreignField: 'projectId',
                as          : 'projectMembers'
            }
        }, {
            $lookup: {
                from        : 'Project',
                localField  : 'project',
                foreignField: '_id',
                as          : 'project'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesPerson',
                foreignField: '_id',
                as          : 'salesPerson'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $project: {
                workflow     : {$arrayElemAt: ['$workflow', 0]},
                supplier     : {$arrayElemAt: ['$supplier', 0]},
                project      : {$arrayElemAt: ['$project', 0]},
                salesManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]}
                    }
                }
            }
        }, {
            $unwind: {
                path                      : '$salesManagers',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesManagers.employeeId',
                foreignField: '_id',
                as          : 'salesManagers'
            }
        }, {
            $project: {
                workflow     : 1,
                supplier     : 1,
                salesManagers: {$arrayElemAt: ['$salesManagers', 0]},
                project      : 1
            }
        }, {
            $group: {
                _id: null,

                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                },

                project: {
                    $addToSet: {
                        _id : '$project._id',
                        name: {$ifNull: ['$project.name', '']}
                    }
                },

                salesPerson: {
                    $addToSet: {
                        _id : '$salesManagers._id',
                        name: {
                            $concat: ['$salesManagers.name.first', ' ', '$salesManagers.name.last']
                        }
                    }
                },

                supplier: {
                    $addToSet: {
                        _id : '$supplier._id',
                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        }
                    }
                }
            }
        }, {
            $project: {
                salesPerson: {
                    $filter: {
                        input: '$salesPerson',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                supplier   : {
                    $filter: {
                        input: '$supplier',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                project    : {
                    $filter: {
                        input: '$project',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                workflow   : {
                    $filter: {
                        input: '$workflow',
                        as   : 'element',
                        cond : notNullQuery
                    }
                }
            }
        }];

        aggregation = Proforma.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};
            result.filterInfo = FILTER_CONSTANTS.salesInvoices;

            res.status(200).send(result);
        });
    };

    this.getCustomerPaymentsFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var customerPaymentsSchema = mongoose.Schemas.Payment;
        var customerPayments = models.get(lastDB, 'Payment', customerPaymentsSchema);
        var query = {forSale: true};
        var pipeLine;
        var aggregation;

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'Invoice',
                localField  : 'invoice',
                foreignField: '_id',
                as          : 'invoice'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $lookup: {
                from        : 'PaymentMethod',
                localField  : 'paymentMethod',
                foreignField: '_id',
                as          : 'paymentMethod'
            }
        }, {
            $project: {
                supplier     : {$arrayElemAt: ['$supplier', 0]},
                invoice      : {$arrayElemAt: ['$invoice', 0]},
                paymentMethod: {$arrayElemAt: ['$paymentMethod', 0]},
                name         : 1
            }
        }, {
            $lookup: {
                from        : 'projectMembers',
                localField  : 'invoice.project',
                foreignField: 'projectId',
                as          : 'projectMembers'
            }
        }, {
            $project: {
                supplier     : 1,
                salesmanagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]}
                    }
                },
                name         : 1,
                paymentMethod: 1
            }
        }, {
            $unwind: {
                path                      : '$salesmanagers',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesmanagers.employeeId',
                foreignField: '_id',
                as          : 'salesmanagers'
            }
        }, {
            $project: {
                supplier     : 1,
                salesmanager : {$arrayElemAt: ['$salesmanagers', 0]},
                paymentMethod: 1,
                name         : 1
            }
        }, {
            $group: {
                _id     : null,
                assigned: {
                    $addToSet: {
                        _id : '$salesmanager._id',
                        name: {
                            $concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']
                        }
                    }
                },

                supplier: {
                    $addToSet: {
                        _id : '$supplier._id',
                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        }
                    }
                },

                name: {
                    $addToSet: {
                        _id : '$_id',
                        name: '$name'
                    }
                },

                paymentMethod: {
                    $addToSet: {
                        _id : '$paymentMethod._id',
                        name: '$paymentMethod.name'
                    }
                }
            }
        }];

        aggregation = customerPayments.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            result.refund = [
                {
                    name: 'Payment',
                    _id : 'false'
                }, {
                    name: 'Refund',
                    _id : 'true'
                }];

            result.filterInfo = FILTER_CONSTANTS.customerPayments;

            res.status(200).send(result);
        });
    };

    this.getPurchasePaymentsFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var PaymentsSchema = mongoose.Schemas.purchasePayments;
        var Payments = models.get(lastDB, 'purchasePayments', PaymentsSchema);
        var query = {forSale: false};
        var pipeLine;
        var aggregation;

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'Invoice',
                localField  : 'invoice',
                foreignField: '_id',
                as          : 'invoice'
            }
        }, {
            $lookup: {
                from        : 'Order',
                localField  : 'order',
                foreignField: '_id',
                as          : 'order'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $lookup: {
                from        : 'PaymentMethod',
                localField  : 'paymentMethod',
                foreignField: '_id',
                as          : 'paymentMethod'
            }
        }, {
            $project: {
                supplier     : {$arrayElemAt: ['$supplier', 0]},
                invoice      : {$arrayElemAt: ['$invoice', 0]},
                order        : {$arrayElemAt: ['$order', 0]},
                paymentMethod: {$arrayElemAt: ['$paymentMethod', 0]},
                name         : 1
            }
        }, {
            $project: {
                salesPerson  : {$ifNull: ['$invoice.salesPerson', '$order.salesPerson']},
                paymentMethod: 1,
                supplier     : 1,
                name         : 1
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesPerson',
                foreignField: '_id',
                as          : 'salesPerson'
            }
        }, {
            $project: {
                paymentMethod: 1,
                supplier     : 1,
                name         : 1,
                salesPerson  : {$arrayElemAt: ['$salesPerson', 0]}
            }
        }, {
            $group: {
                _id     : null,
                assigned: {
                    $addToSet: {
                        _id : '$salesPerson._id',
                        name: {
                            $concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']
                        }
                    }
                },

                supplier: {
                    $addToSet: {
                        _id : '$supplier._id',
                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        }
                    }
                },

                name: {
                    $addToSet: {
                        _id : '$_id',
                        name: '$name'
                    }
                },

                paymentMethod: {
                    $addToSet: {
                        _id : '$paymentMethod._id',
                        name: '$paymentMethod.name'
                    }
                }
            }
        }];

        aggregation = Payments.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            result.refund = [
                {
                    name: 'Payment',
                    _id : 'false'
                }, {
                    name: 'Refund',
                    _id : 'true'
                }];

            result.filterInfo = FILTER_CONSTANTS.purchasePayments;

            res.status(200).send(result);
        });
    };

    this.getSupplierPaymentsFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var customerPaymentsSchema = mongoose.Schemas.Payment;
        var customerPayments = models.get(lastDB, 'Payment', customerPaymentsSchema);
        var query = {
            forSale: false,
            bonus  : true
        };
        var pipeLine;
        var aggregation;

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $project: {
                supplier  : {$arrayElemAt: ['$supplier', 0]},
                paymentRef: 1,
                year      : 1,
                month     : 1,
                workflow  : 1
            }
        }, {
            $project: {
                supplier  : 1,
                paymentRef: 1,
                year      : 1,
                month     : 1,
                workflow  : 1
            }
        }, {
            $group: {
                _id: null,

                supplier: {
                    $addToSet: {
                        _id: '$supplier._id',

                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        },

                        isEmployee: '$supplier.isEmployee'
                    }
                },

                paymentRef: {
                    $addToSet: {
                        _id : '$paymentRef',
                        name: {
                            $ifNull: ['$paymentRef', 'None']
                        }
                    }
                },

                year: {
                    $addToSet: {
                        _id : '$year',
                        name: {
                            $ifNull: ['$year', 'None']
                        }
                    }
                },

                month: {
                    $addToSet: {
                        _id : '$month',
                        name: {
                            $ifNull: ['$month', 'None']
                        }
                    }
                },

                workflow: {
                    $addToSet: {
                        _id : '$workflow',
                        name: {
                            $ifNull: ['$workflow', 'None']
                        }
                    }
                }
            }
        }];

        aggregation = customerPayments.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};
            //result.filterInfo = FILTER_CONSTANTS.supplierPayments;

            res.status(200).send(result);
        });
    };

    this.getProductsFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var ProductSchema = mongoose.Schemas.Products;
        var Product = models.get(lastDB, 'Products', ProductSchema);
        var pipeLine;
        var aggregation;

        pipeLine = [{
            $group: {
                _id: null,

                name: {
                    $addToSet: {
                        _id : '$_id',
                        name: '$name'
                    }
                }/*,

                 productType: {
                 $addToSet: {
                 _id : '$info.productType',
                 name: {
                 $ifNull: ['$info.productType', 'None']
                 }
                 }
                 }*/
            }
        }];

        aggregation = Product.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            result.hasJob = [
                {
                    name: 'True',
                    _id : 'True'
                }
            ];

            result.canBePurchased = [
                {
                    name: 'True',
                    _id : 'true'
                },
                {
                    name: 'False',
                    _id : 'false'
                }
            ];

            result.canBeSold = [
                {
                    name: 'True',
                    _id : 'true'
                },
                {
                    name: 'False',
                    _id : 'false'
                }
            ];

            result.canBeExpensed = [
                {
                    name: 'True',
                    _id : 'true'
                },
                {
                    name: 'False',
                    _id : 'false'
                }
            ];

            result.filterInfo = FILTER_CONSTANTS.Products;

            res.status(200).send(result);
        });
    };

    this.getQuotationFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var QuotationSchema = mongoose.Schemas.Quotation;
        var Quotation = models.get(lastDB, 'Quotation', QuotationSchema);
        var pipeLine;
        var aggregation;
        var query = {
            forSales: false,
            isOrder : false
        };
        var notNullQuery = {$and: [{$ne: ['$$element.name', null]}, {$ne: ['$$element.name', '']}]};

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $project: {
                workflow: {$arrayElemAt: ['$workflow', 0]},
                supplier: {$arrayElemAt: ['$supplier', 0]}
            }
        }, {
            $group: {
                _id     : null,
                supplier: {
                    $addToSet: {
                        _id : '$supplier._id',
                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        }
                    }
                },

                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                }
            }
        }, {
            $project: {
                supplier: {
                    $filter: {
                        input: '$supplier',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                workflow: {
                    $filter: {
                        input: '$workflow',
                        as   : 'element',
                        cond : notNullQuery
                    }
                }
            }
        }];

        aggregation = Quotation.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getSalesQuotationFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var QuotationSchema = mongoose.Schemas.Quotation;
        var Quotation = models.get(lastDB, 'Quotation', QuotationSchema);
        var pipeLine;
        var aggregation;
        var query = {
            forSales: true,
            isOrder : false
        };

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'projectMembers',
                localField  : 'project',
                foreignField: 'projectId',
                as          : 'projectMembers'
            }
        }, {
            $lookup: {
                from        : 'Project',
                localField  : 'project',
                foreignField: '_id',
                as          : 'project'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $project: {
                workflow     : {$arrayElemAt: ['$workflow', 0]},
                project      : {$arrayElemAt: ['$project', 0]},
                supplier     : {$arrayElemAt: ['$supplier', 0]},
                salesmanagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]}
                    }
                }
            }
        }, {
            $unwind: {
                path                      : '$salesmanagers',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesmanagers.employeeId',
                foreignField: '_id',
                as          : 'salesmanager'
            }
        }, {
            $project: {
                workflow    : 1,
                project     : 1,
                supplier    : 1,
                salesmanager: {$arrayElemAt: ['$salesmanager', 0]}
            }
        }, {
            $project: {
                workflow    : 1,
                project     : 1,
                supplier    : 1,
                salesmanager: {
                    _id : {$ifNull: ['$salesmanager._id', 'None']},
                    name: {
                        $concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']
                    }
                }
            }
        }, {
            $group: {
                _id: null,

                project: {
                    $addToSet: {
                        _id : '$project._id',
                        name: '$project.name'
                    }
                },

                supplier: {
                    $addToSet: {
                        _id : '$supplier._id',
                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        }
                    }
                },

                salesManager: {
                    $addToSet: {
                        _id : '$salesmanager._id',
                        name: {$ifNull: ['$salesmanager.name', 'Empty']}
                    }
                },

                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                }
            }
        }];

        aggregation = Quotation.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getOrderFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var OrderSchema = mongoose.Schemas.Order;
        var Order = models.get(lastDB, 'Order', OrderSchema);
        var pipeLine;
        var aggregation;
        var notNullQuery = {$and: [{$ne: ['$$element.name', null]}, {$ne: ['$$element.name', '']}]};

        var salesManagerMatch = {
            $and: [
                {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]},
                {
                    $or: [{
                        $and: [{
                            $eq: ['$$projectMember.startDate', null]
                        }, {
                            $eq: ['$$projectMember.endDate', null]
                        }]
                    }, {
                        $and: [{
                            $lte: ['$$projectMember.startDate', '$orderDate']
                        }, {
                            $eq: ['$$projectMember.endDate', null]
                        }]
                    }, {
                        $and: [{
                            $eq: ['$$projectMember.startDate', null]
                        }, {
                            $gte: ['$$projectMember.endDate', '$orderDate']
                        }]
                    }, {
                        $and: [{
                            $lte: ['$$projectMember.startDate', '$orderDate']
                        }, {
                            $gte: ['$$projectMember.endDate', '$orderDate']
                        }]
                    }]
                }]
        };

        pipeLine = [{
            $lookup: {
                from        : 'Employees',
                localField  : 'salesPerson',
                foreignField: '_id',
                as          : 'salesPerson'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $lookup: {
                from        : 'projectMembers',
                localField  : 'project',
                foreignField: 'projectId',
                as          : 'projectMembers'
            }
        }, {
            $lookup: {
                from        : 'integrations',
                localField  : 'channel',
                foreignField: '_id',
                as          : 'channel'
            }
        }, {
            $project: {
                workflow     : {$arrayElemAt: ['$workflow', 0]},
                supplier     : {$arrayElemAt: ['$supplier', 0]},
                channel      : {$arrayElemAt: ['$channel', 0]},
                salesManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : salesManagerMatch
                    }
                },

                salesPerson: {$arrayElemAt: ['$salesPerson', 0]},
                status     : 1,
                name       : 1
            }
        }, {
            $project: {
                salesManager: {$arrayElemAt: ['$salesManagers', 0]},
                workflow    : 1,
                channel     : 1,
                supplier    : 1,
                salesPerson : 1,
                status      : 1,
                name        : 1
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesManager.employeeId',
                foreignField: '_id',
                as          : 'salesManager'
            }
        }, {
            $project: {
                salesPerson: {$ifNull: ['$salesPerson', {$arrayElemAt: ['$salesManager', 0]}]},
                workflow   : 1,
                channel    : 1,
                supplier   : 1,
                status     : 1,
                name       : 1
            }
        }, {
            $group: {
                _id: null,

                name: {
                    $addToSet: {
                        _id : '$_id',
                        name: '$name'
                    }
                },

                supplier: {
                    $addToSet: {
                        _id : '$supplier._id',
                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        }
                    }
                },

                salesPerson: {
                    $addToSet: {
                        _id : '$salesPerson._id',
                        name: {
                            $concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']
                        }
                    }
                },

                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: {$ifNull: ['$workflow.name', '']}
                    }
                },

                allocationStatus: {
                    $addToSet: {
                        _id : '$status.allocateStatus',
                        name: {
                            $cond: {
                                if  : {$eq: ['$status.allocateStatus', 'ALL']}, then: {$literal: 'Allocated all'},
                                else: {
                                    $cond: {
                                        if  : {$eq: ['$status.allocateStatus', 'NOA']},
                                        then: {$literal: 'Partially allocated'}, else: {$literal: 'Not allocated'}
                                    }
                                }
                            }

                        }
                    }
                },

                fulfilledStatus: {
                    $addToSet: {
                        _id : '$status.fulfillStatus',
                        name: {
                            $cond: {
                                if  : {$eq: ['$status.fulfillStatus', 'ALL']}, then: {$literal: 'Fulfilled all'},
                                else: {
                                    $cond: {
                                        if  : {$eq: ['$status.fulfillStatus', 'NOA']},
                                        then: {$literal: 'Partially fulfilled'}, else: {$literal: 'Not fulfilled'}
                                    }
                                }
                            }
                        }
                    }
                },

                shippingStatus: {
                    $addToSet: {
                        _id : '$status.shippingStatus',
                        name: {
                            $cond: {
                                if  : {$eq: ['$status.shippingStatus', 'ALL']}, then: {$literal: 'Shipped all'},
                                else: {
                                    $cond: {
                                        if  : {$eq: ['$status.shippingStatus', 'NOA']},
                                        then: {$literal: 'Partially shipped'}, else: {$literal: 'Not shipped'}
                                    }
                                }
                            }
                        }
                    }
                },

                channel: {
                    $addToSet: {
                        _id : '$channel._id',
                        name: '$channel.channelName'
                    }
                }
            }
        }, {
            $project: {
                salesPerson: {
                    $filter: {
                        input: '$salesPerson',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },

                allocationStatus: {
                    $filter: {
                        input: '$allocationStatus',
                        as   : 'element',
                        cond : {$and: [{$ne: ['$$element._id', null]}, {$ne: ['$$element._id', '']}, {$ne: ['$$element._id', 'NOR']}]}
                    }
                },

                fulfilledStatus: {
                    $filter: {
                        input: '$fulfilledStatus',
                        as   : 'element',
                        cond : {$and: [{$ne: ['$$element._id', null]}, {$ne: ['$$element._id', '']}, {$ne: ['$$element._id', 'NOR']}]}
                    }
                },

                shippingStatus: {
                    $filter: {
                        input: '$shippingStatus',
                        as   : 'element',
                        cond : {$and: [{$ne: ['$$element._id', null]}, {$ne: ['$$element._id', '']}, {$ne: ['$$element._id', 'NOR']}]}
                    }
                },

                supplier: {
                    $filter: {
                        input: '$supplier',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },

                workflow: {
                    $filter: {
                        input: '$workflow',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },

                channel: {
                    $filter: {
                        input: '$channel',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },

                name: {
                    $filter: {
                        input: '$name',
                        as   : 'element',
                        cond : notNullQuery
                    }
                }
            }
        }];

        aggregation = Order.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};
            result.filterInfo = FILTER_CONSTANTS.order;

            res.status(200).send(result);
        });
    };

    this.getSalesOrdersFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var QuotationSchema = mongoose.Schemas.Quotation;
        var Quotation = models.get(lastDB, 'Quotation', QuotationSchema);
        var pipeLine;
        var aggregation;
        var query = {
            forSales: true,
            isOrder : true
        };
        var notNullQuery = {$and: [{$ne: ['$$element.name', null]}, {$ne: ['$$element.name', '']}]};

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'projectMembers',
                localField  : 'project',
                foreignField: 'projectId',
                as          : 'projectMembers'
            }
        }, {
            $lookup: {
                from        : 'Project',
                localField  : 'project',
                foreignField: '_id',
                as          : 'project'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $project: {
                workflow     : {$arrayElemAt: ['$workflow', 0]},
                project      : {$arrayElemAt: ['$project', 0]},
                supplier     : {$arrayElemAt: ['$supplier', 0]},
                salesmanagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]}
                    }
                }
            }
        }, {
            $unwind: {
                path                      : '$salesmanagers',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesmanagers.employeeId',
                foreignField: '_id',
                as          : 'salesmanager'
            }
        }, {
            $project: {
                workflow    : 1,
                project     : 1,
                supplier    : 1,
                salesmanager: {$arrayElemAt: ['$salesmanager', 0]}
            }
        }, {
            $group: {
                _id: null,

                project: {
                    $addToSet: {
                        _id : '$project._id',
                        name: {$ifNull: ['$project.name', '']}
                    }
                },

                supplier: {
                    $addToSet: {
                        _id : '$supplier._id',
                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        }
                    }
                },

                salesManager: {
                    $addToSet: {
                        _id : '$salesmanager._id',
                        name: {
                            $concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']
                        }
                    }
                },
                workflow    : {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: {$ifNull: ['$workflow.name', '']}
                    }
                }
            }
        }, {
            $project: {
                salesManager: {
                    $filter: {
                        input: '$salesManager',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                supplier    : {
                    $filter: {
                        input: '$supplier',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                project     : {
                    $filter: {
                        input: '$project',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                workflow    : {
                    $filter: {
                        input: '$workflow',
                        as   : 'element',
                        cond : notNullQuery
                    }
                }
            }
        }];

        aggregation = Quotation.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getOrdersFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var purchaseOrdersSchema = mongoose.Schemas.purchaseOrders;
        var Model = models.get(lastDB, 'purchaseOrders', purchaseOrdersSchema);
        var pipeLine;
        var aggregation;
        var query = {
            forSales: false,
            _type   : 'purchaseOrders'
        };
        var notNullQuery = {$and: [{$ne: ['$$element.name', null]}, {$ne: ['$$element.name', '']}]};

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $project: {
                workflow: {$arrayElemAt: ['$workflow', 0]},
                supplier: {$arrayElemAt: ['$supplier', 0]}
            }
        }, {
            $group: {
                _id: null,

                supplier: {
                    $addToSet: {
                        _id : '$supplier._id',
                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        }
                    }
                },

                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                }
            }
        }, {
            $project: {
                salesManager: {
                    $filter: {
                        input: '$salesManager',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                supplier    : {
                    $filter: {
                        input: '$supplier',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                project     : {
                    $filter: {
                        input: '$project',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                workflow    : {
                    $filter: {
                        input: '$workflow',
                        as   : 'element',
                        cond : notNullQuery
                    }
                }
            }
        }];

        aggregation = Model.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};
            result.filterInfo = FILTER_CONSTANTS.purchaseOrders;

            res.status(200).send(result);
        });
    };

    this.getLeadsFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var OpportunitiesSchema = mongoose.Schemas.Opportunitie;
        var Opportunities = models.get(lastDB, 'Opportunities', OpportunitiesSchema);
        var pipeLine;
        var aggregation;
        var query = {
            isOpportunitie: false
        };
        var notNullQuery = {$and: [{$ne: ['$$element.name', null]}, {$ne: ['$$element.name', '']}]};

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesPerson',
                foreignField: '_id',
                as          : 'salesPerson'
            }
        }, {
            $lookup: {
                from        : 'Users',
                localField  : 'createdBy.user',
                foreignField: '_id',
                as          : 'createdBy.user'
            }
        }, {
            $project: {
                workflow        : {$arrayElemAt: ['$workflow', 0]},
                source          : 1,
                contactName     : {$concat: ['$contactName.first', ' ', '$contactName.last']},
                salesPerson     : {$arrayElemAt: ['$salesPerson', 0]},
                'createdBy.user': {$arrayElemAt: ['$createdBy.user', 0]}
            }
        }, {
            $project: {
                workflow   : 1,
                source     : 1,
                contactName: 1,
                salesPerson: {
                    _id : '$salesPerson._id',
                    name: {$concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']}
                },

                createdBy: {
                    _id : {$ifNull: ['$createdBy.user._id', 'None']},
                    name: {$ifNull: ['$createdBy.user.login', 'None']}
                }
            }
        }, {
            $group: {
                _id        : null,
                contactName: {
                    $addToSet: {
                        _id : '$contactName',
                        name: {
                            $cond: {
                                if: {
                                    $eq: ['$contactName', ' ']
                                },

                                then: 'None',
                                else: '$contactName'
                            }
                        }
                    }
                },

                source: {
                    $addToSet: {
                        _id : '$source',
                        name: '$source'
                    }
                },

                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                },

                salesPerson: {
                    $addToSet: {
                        _id : '$salesPerson._id',
                        name: '$salesPerson.name'
                    }
                },

                createdBy: {
                    $addToSet: {
                        _id : '$createdBy._id',
                        name: '$createdBy.name'
                    }
                }
            }
        }, {
            $project: {
                workflow   : {
                    $filter: {
                        input: '$workflow',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                source     : {
                    $filter: {
                        input: '$source',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                contactName: {
                    $filter: {
                        input: '$contactName',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                salesPerson: {
                    $filter: {
                        input: '$salesPerson',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },
                createdBy  : 1
            }
        }];

        aggregation = Opportunities.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};
            result.filterInfo = FILTER_CONSTANTS.Leads;

            res.status(200).send(result);
        });
    };

    this.getOpportunitiesFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var OpportunitiesSchema = mongoose.Schemas.Opportunitie;
        var Opportunities = models.get(lastDB, 'Opportunities', OpportunitiesSchema);
        var pipeLine;
        var aggregation;
        var query = {
            isOpportunitie: true
        };
        var notNullQuery = {$and: [{$ne: ['$$element.name', null]}, {$ne: ['$$element.name', '']}]};

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'customer',
                foreignField: '_id',
                as          : 'customer'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesPerson',
                foreignField: '_id',
                as          : 'salesPerson'
            }
        }, {
            $project: {
                customer   : {$arrayElemAt: ['$customer', 0]},
                workflow   : {$arrayElemAt: ['$workflow', 0]},
                salesPerson: {$arrayElemAt: ['$salesPerson', 0]},
                name       : 1
            }
        }, {
            $group: {
                _id: null,

                customer: {
                    $addToSet: {
                        _id : '$customer._id',
                        name: {$concat: ['$customer.name.first', ' ', '$customer.name.last']}
                    }
                },

                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                },

                salesPerson: {
                    $addToSet: {
                        _id : '$salesPerson._id',
                        name: {$concat: ['$salesPerson.name.first', ' ', '$salesPerson.name.last']}
                    }
                },

                name: {
                    $addToSet: {
                        _id : '$_id',
                        name: '$name'
                    }
                }
            }
        }, {
            $project: {
                customer: {
                    $filter: {
                        input: '$customer',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },

                workflow: {
                    $filter: {
                        input: '$workflow',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },

                salesPerson: {
                    $filter: {
                        input: '$salesPerson',
                        as   : 'element',
                        cond : notNullQuery
                    }
                },

                name: 1
            }
        }];

        aggregation = Opportunities.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};
            result.filterInfo = FILTER_CONSTANTS.Opportunities;

            res.status(200).send(result);
        });
    };

    this.getSalaryReportFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var EmployeeSchema = mongoose.Schemas.Employee;
        var Employee = models.get(lastDB, 'Employee', EmployeeSchema);
        var pipeLine;
        var aggregation;

        pipeLine = [{
            $lookup: {
                from        : 'Department',
                localField  : 'department',
                foreignField: '_id',
                as          : 'department'
            }
        }, {
            $project: {
                department: {$arrayElemAt: ['$department', 0]},
                name      : 1,
                isEmployee: 1
            }
        }, {
            $project: {
                department: 1,
                name      : 1,
                isEmployee: 1
            }
        }, {
            $group: {
                _id     : null,
                employee: {
                    $addToSet: {
                        _id       : '$_id',
                        name      : {$concat: ['$name.first', ' ', '$name.last']},
                        isEmployee: '$isEmployee'
                    }
                },

                department: {
                    $addToSet: {
                        _id : '$department._id',
                        name: {$ifNull: ['$department.name', 'None']}
                    }
                }
            }
        }];

        aggregation = Employee.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            result.onlyEmployees = {
                _id : 'true',
                name: 'true'
            };

            res.status(200).send(result);
        });
    };

    this.getWtrackFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var wTrackSchema = mongoose.Schemas.wTrack;
        var WTrack = models.get(lastDB, 'wTrack', wTrackSchema);

        var pipeLine;
        var aggregation;

        pipeLine = [{
            $lookup: {
                from        : 'Project',
                localField  : 'project',
                foreignField: '_id',
                as          : 'project'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'employee',
                foreignField: '_id',
                as          : 'employee'
            }
        }, {
            $lookup: {
                from        : 'Department',
                localField  : 'department',
                foreignField: '_id',
                as          : 'department'
            }
        }, {
            $project: {
                project   : {$arrayElemAt: ['$project', 0]},
                employee  : {$arrayElemAt: ['$employee', 0]},
                department: {$arrayElemAt: ['$department', 0]},
                month     : 1,
                year      : 1,
                week      : 1,
                _type     : 1
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'project.customer',
                foreignField: '_id',
                as          : 'customer'
            }
        }, {
            $project: {
                customer  : {$arrayElemAt: ['$customer', 0]},
                project   : 1,
                employee  : 1,
                department: 1,
                month     : 1,
                year      : 1,
                week      : 1,
                _type     : 1
            }
        }, {
            $group: {
                _id : null,
                jobs: {
                    $addToSet: {
                        _id : '$jobs._id',
                        name: '$jobs.name'
                    }
                },

                project: {
                    $addToSet: {
                        _id : '$project._id',
                        name: '$project.name'
                    }
                },

                customer: {
                    $addToSet: {
                        _id : '$customer._id',
                        name: {
                            $concat: ['$customer.name.first', ' ', '$customer.name.last']
                        }
                    }
                },

                employee: {
                    $addToSet: {
                        _id: '$employee._id',

                        name: {
                            $concat: ['$employee.name.first', ' ', '$employee.name.last']
                        },

                        isEmployee: '$employee.isEmployee'
                    }
                },

                department: {
                    $addToSet: {
                        _id : '$department._id',
                        name: '$department.name'
                    }
                },

                year: {
                    $addToSet: {
                        _id : '$year',
                        name: '$year'
                    }
                },

                month: {
                    $addToSet: {
                        _id : '$month',
                        name: '$month'
                    }
                },

                week: {
                    $addToSet: {
                        _id : '$week',
                        name: '$week'
                    }
                },

                _type: {
                    $addToSet: {
                        _id : '$_type',
                        name: '$_type'
                    }
                }
            }
        }];

        aggregation = WTrack.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getExpensesInvoiceFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var ExpensesInvoiceSchema = mongoose.Schemas.expensesInvoice;
        var ExpensesInvoice = models.get(lastDB, 'expensesInvoice', ExpensesInvoiceSchema);
        var query = {
            forSales: false
        };
        var pipeLine;
        var aggregation;

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $project: {
                workflow: {$arrayElemAt: ['$workflow', 0]},
                supplier: {$arrayElemAt: ['$supplier', 0]}
            }
        }, {
            $group: {
                _id     : null,
                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                },

                supplier: {
                    $addToSet: {
                        _id : '$supplier._id',
                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        }
                    }
                }
            }
        }];

        aggregation = ExpensesInvoice.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getWriteOffFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var WriteOffSchema = mongoose.Schemas.writeOff;
        var WriteOff = models.get(lastDB, 'writeOff', WriteOffSchema);

        var pipeLine;
        var aggregation;

        pipeLine = [{
            $match: {_type: 'writeOff'}
        }, {
            $lookup: {
                from        : 'journals',
                localField  : 'journal',
                foreignField: '_id',
                as          : 'journal'
            }
        }, {
            $lookup: {
                from        : 'Project',
                localField  : 'project',
                foreignField: '_id',
                as          : 'project'
            }
        }, {
            $project: {
                project: {$arrayElemAt: ['$project', 0]},
                journal: {$arrayElemAt: ['$journal', 0]}
            }
        }, {
            $group: {
                _id    : null,
                journal: {
                    $addToSet: {
                        _id : '$journal._id',
                        name: '$journal.name'
                    }
                },

                project: {
                    $addToSet: {
                        _id : '$project._id',
                        name: '$project.name'
                    }
                }
            }
        }];

        aggregation = WriteOff.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getDividendInvoiceFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var DividendInvoiceSchema = mongoose.Schemas.dividendInvoice;
        var DividendInvoice = models.get(lastDB, 'dividendInvoice', DividendInvoiceSchema);
        var pipeLine;
        var aggregation;
        var query = {
            _type: 'dividendInvoice'
        };

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $project: {
                workflow: {$arrayElemAt: ['$workflow', 0]}
            }
        }, {
            $group: {
                _id     : null,
                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                }
            }
        }];

        aggregation = DividendInvoice.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getDashVacationFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var EmployeeSchema = mongoose.Schemas.Employee;
        var ProjectMembersSchema = mongoose.Schemas.ProjectMember;
        var ProjectSchema = mongoose.Schemas.Project;
        var Employee = models.get(lastDB, 'Employee', EmployeeSchema);
        var ProjectMember = models.get(lastDB, 'ProjectMember', ProjectMembersSchema);
        var Project = models.get(lastDB, 'Project', ProjectSchema);
        var pipeLine;
        var aggregation;
        var reqQuery = req.query || {};
        var filter = reqQuery.filter;
        var query;
        var startFilter;
        var startDate;
        var _startDate;
        var endDate;
        var _endDate;
        var dateRangeObject;
        var parallelTasks;

        function dateRange() {
            'use strict';
            var weeksArr = [];
            var startWeek = moment().isoWeek() - 1;
            var year = moment().isoWeekYear();
            var week;
            var i;

            for (i = 0; i <= 11; i++) {
                if (startWeek + i > 53) {
                    week = startWeek + i - 53;
                    weeksArr.push((year + 1) * 100 + week);
                } else {
                    week = startWeek + i;
                    weeksArr.push(year * 100 + week);
                }
            }

            weeksArr.sort();

            return {
                startDate: weeksArr[0],
                endDate  : weeksArr[weeksArr.length - 1]
            };
        }

        if (filter && filter.date && filter.date.value && filter.date.value.length) {
            _startDate = moment(new Date(filter.date.value[0]));
            _endDate = moment(new Date(filter.date.value[1]));
            startDate = _startDate.isoWeekYear() * 100 + _startDate.isoWeek();
            endDate = _endDate.isoWeekYear() * 100 + _endDate.isoWeek();
        }

        if (!startDate || !endDate) {
            dateRangeObject = dateRange();

            startDate = dateRangeObject.startDate;
            endDate = dateRangeObject.endDate;
        }

        query = {
            $or: [
                {
                    isEmployee: true
                }, {
                    $and: [{isEmployee: false}, {
                        lastFire: {
                            $ne : null,
                            $gte: startDate
                        }
                    }]
                }
            ]
        };

        function getSalesManagers(pCb) {
            ProjectMember.aggregate([{
                $match: {
                    projectPositionId: objectId(CONSTANTS.SALESMANAGER)
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'employeeId',
                    foreignField: '_id',
                    as          : 'salesManagers'
                }
            }, {
                $project: {
                    salesManagers: {$arrayElemAt: ['$salesManagers', 0]}
                }
            }, {
                $project: {
                    'salesManagers._id' : 1,
                    'salesManagers.name': {
                        $concat: ['$salesManagers.name.first', ' ', '$salesManagers.name.last']
                    }
                }

            }, {
                $group: {
                    _id : '$salesManagers._id',
                    name: {
                        $first: '$salesManagers.name'
                    }

                }

            }
            ], function (err, result) {
                if (err) {
                    return next(err);
                }

                if (!result.length) {
                    return pCb(null, result);
                }

                result.push({
                    _id : 'empty',
                    name: 'empty'
                });

                pCb(null, result);
            });

        }

        function getProjectTypes(pCb) {
            Project.aggregate([
                {
                    $group: {
                        _id : '$projecttype',
                        name: {
                            $first: '$projecttype'
                        }
                    }
                }
            ], function (err, result) {
                if (err) {
                    return next(err);
                }

                if (!result.length) {
                    return pCb(null, result);
                }

                pCb(null, result);
            });
        }

        function getEmployees(pCb) {
            pipeLine = [{
                $match: query
            }, {
                $lookup: {
                    from        : 'Department',
                    localField  : 'department',
                    foreignField: '_id',
                    as          : 'department'
                }
            }, {
                $project: {
                    name      : 1,
                    department: {$arrayElemAt: ['$department', 0]}
                }
            }, {
                $group: {
                    _id : null,
                    name: {
                        $addToSet: {
                            _id : '$_id',
                            name: {$concat: ['$name.first', ' ', '$name.last']}
                        }
                    },

                    department: {
                        $addToSet: {
                            _id : '$department._id',
                            name: {
                                $ifNull: ['$department.name', 'None']
                            }
                        }
                    }
                }
            }];

            aggregation = Employee.aggregate(pipeLine);

            aggregation.options = {
                allowDiskUse: true
            };

            aggregation.exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                if (!result.length) {
                    return pCb(null, result);
                }

                result = result[0];

                pCb(null, result);
            });
        }

        parallelTasks = [getEmployees, getSalesManagers, getProjectTypes];

        async.parallel(parallelTasks, function (err, result) {
            var sendFilterObject = result[0];

            sendFilterObject.salesManager = result[1];
            sendFilterObject.projecttype = result[2];

            res.status(200).send(sendFilterObject);
        });

    };

    this.getExpensesPaymentsFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var ExpensesInvoicePaymentSchema = mongoose.Schemas.ExpensesInvoicePayment;
        var ExpensesPayments = models.get(lastDB, 'expensesInvoicePayment', ExpensesInvoicePaymentSchema);

        var pipeLine;
        var aggregation;

        var query = {
            _type: 'expensesInvoicePayment'
        };

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $project: {
                supplier  : {$arrayElemAt: ['$supplier', 0]},
                paymentRef: 1,
                year      : 1,
                month     : 1,
                workflow  : 1
            }
        }, {
            $project: {
                supplier  : 1,
                paymentRef: 1,
                year      : 1,
                month     : 1,
                workflow  : 1
            }
        }, {
            $group: {
                _id: null,

                supplier: {
                    $addToSet: {
                        _id : '$supplier._id',
                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        },

                        isEmployee: '$supplier.isEmployee'
                    }
                },

                paymentRef: {
                    $addToSet: {
                        _id : '$paymentRef',
                        name: {
                            $ifNull: ['$paymentRef', 'None']
                        }
                    }
                },

                year: {
                    $addToSet: {
                        _id : '$year',
                        name: {
                            $ifNull: ['$year', 'None']
                        }
                    }
                },

                month: {
                    $addToSet: {
                        _id : '$month',
                        name: {
                            $ifNull: ['$month', 'None']
                        }
                    }
                },

                workflow: {
                    $addToSet: {
                        _id : '$workflow',
                        name: {
                            $ifNull: ['$workflow', 'None']
                        }
                    }
                }
            }
        }];

        aggregation = ExpensesPayments.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getDividendPaymentsFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var ExpensesInvoicePaymentSchema = mongoose.Schemas.ExpensesInvoicePayment;
        var ExpensesPayments = models.get(lastDB, 'expensesInvoicePayment', ExpensesInvoicePaymentSchema);

        var pipeLine;
        var aggregation;

        var query = {
            _type: 'dividendInvoicePayment'
        };

        pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'supplier',
                foreignField: '_id',
                as          : 'supplier'
            }
        }, {
            $project: {
                supplier  : {$arrayElemAt: ['$supplier', 0]},
                paymentRef: 1,
                year      : 1,
                month     : 1,
                workflow  : 1
            }
        }, {
            $project: {
                supplier  : 1,
                paymentRef: 1,
                year      : 1,
                month     : 1,
                workflow  : 1
            }
        }, {
            $group: {
                _id: null,

                supplier: {
                    $addToSet: {
                        _id: '$supplier._id',

                        name: {
                            $concat: ['$supplier.name.first', ' ', '$supplier.name.last']
                        },

                        isEmployee: '$supplier.isEmployee'
                    }
                },

                paymentRef: {
                    $addToSet: {
                        _id : '$paymentRef',
                        name: {
                            $ifNull: ['$paymentRef', 'None']
                        }
                    }
                },

                year: {
                    $addToSet: {
                        _id : '$year',
                        name: {
                            $ifNull: ['$year', 'None']
                        }
                    }
                },

                month: {
                    $addToSet: {
                        _id : '$month',
                        name: {
                            $ifNull: ['$month', 'None']
                        }
                    }
                },

                workflow: {
                    $addToSet: {
                        _id : '$workflow',
                        name: {
                            $ifNull: ['$workflow', 'None']
                        }
                    }
                }
            }
        }];

        aggregation = ExpensesPayments.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });

    };

    this.getPayRollFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var PayRollSchema = mongoose.Schemas.PayRoll;
        var PayRoll = models.get(lastDB, 'PayRoll', PayRollSchema);

        var pipeLine;
        var aggregation;

        pipeLine = [{
            $group: {
                _id: null,

                year: {
                    $addToSet: {
                        _id : '$year',
                        name: '$year'
                    }
                },

                month: {
                    $addToSet: {
                        _id : '$month',
                        name: '$month'
                    }
                },

                employee: {
                    $addToSet: '$employee'
                },

                dataKey: {
                    $addToSet: {
                        _id : '$dataKey',
                        name: '$dataKey'
                    }
                },

                type: {
                    $addToSet: {
                        _id : '$type._id',
                        name: '$type.name'
                    }
                }
            }
        }];

        aggregation = PayRoll.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            if (result.dataKey) {
                result.dataKey = _.map(result.dataKey, function (element) {
                    element.name = element.name ? element.name.toString() : '';

                    return {
                        _id : element._id,
                        name: element.name.substring(4, 6) + '/' + element.name.substring(0, 4)
                    };
                });
            }

            res.status(200).send(result);
        });
    };

    this.getDashJobsFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var JobsSchema = mongoose.Schemas.jobs;
        var Jobs = models.get(lastDB, 'jobs', JobsSchema);

        var pipeLine;
        var aggregation;

        pipeLine = [
            {
                $lookup: {
                    from        : 'projectMembers',
                    localField  : 'project',
                    foreignField: 'projectId',
                    as          : 'projectMembers'
                }
            }, {
                $lookup: {
                    from        : 'Project',
                    localField  : 'project',
                    foreignField: '_id',
                    as          : 'project'
                }
            }, {
                $lookup: {
                    from        : 'Invoice',
                    localField  : 'invoice',
                    foreignField: '_id',
                    as          : 'invoice'
                }
            }, {
                $lookup: {
                    from        : 'workflows',
                    localField  : 'workflow',
                    foreignField: '_id',
                    as          : 'workflow'
                }
            }, {
                $lookup: {
                    from        : 'Quotation',
                    localField  : 'quotation',
                    foreignField: '_id',
                    as          : 'quotation'
                }
            }, {
                $project: {
                    name         : 1,
                    workflow     : {$arrayElemAt: ['$workflow', 0]},
                    type         : 1,
                    wTracks      : 1,
                    project      : {$arrayElemAt: ['$project', 0]},
                    budget       : 1,
                    quotation    : {$arrayElemAt: ['$quotation', 0]},
                    invoice      : {$arrayElemAt: ['$invoice', 0]},
                    salesmanagers: {
                        $filter: {
                            input: '$projectMembers',
                            as   : 'projectMember',
                            cond : {$eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]}
                        }
                    }
                }
            }, {
                $unwind: {
                    path                      : '$salesmanagers',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'Payment',
                    localField  : 'invoice._id',
                    foreignField: 'invoice',
                    as          : 'payments'
                }
            }, {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'salesmanagers.employeeId',
                    foreignField: '_id',
                    as          : 'salesmanager'
                }
            }, {
                $project: {
                    order: {
                        $cond: {
                            if: {
                                $eq: ['$type', 'Not Ordered']
                            },

                            then: -1,
                            else: {
                                $cond: {
                                    if: {
                                        $eq: ['$type', 'Ordered']
                                    },

                                    then: 0,
                                    else: 1
                                }
                            }
                        }
                    },

                    name        : 1,
                    workflow    : 1,
                    type        : 1,
                    wTracks     : 1,
                    project     : 1,
                    budget      : 1,
                    quotation   : 1,
                    invoice     : 1,
                    salesmanager: {$arrayElemAt: ['$salesmanager', 0]},

                    payment: {
                        paid : {$sum: '$payments.paidAmount'},
                        count: {$size: '$payments'}
                    }
                }
            }, {
                $project: {
                    order       : 1,
                    name        : 1,
                    workflow    : 1,
                    type        : 1,
                    wTracks     : 1,
                    project     : 1,
                    budget      : 1,
                    quotation   : 1,
                    invoice     : 1,
                    salesmanager: 1,
                    payment     : 1
                }
            }, {
                $match: {
                    $or: [
                        {
                            'invoice._type': 'wTrackInvoice'
                        },
                        {quotation: {$exists: true}},
                        {type: 'Not Ordered'}
                    ]
                }
            }, {
                $group: {
                    _id: null,

                    type: {
                        $addToSet: {
                            _id : '$type',
                            name: '$type'
                        }
                    },

                    workflow: {
                        $addToSet: {
                            _id : '$workflow._id',
                            name: '$workflow.name'
                        }
                    },

                    project: {
                        $addToSet: {
                            _id : '$project._id',
                            name: '$project.name'
                        }
                    },

                    salesManager: {
                        $addToSet: {
                            _id : '$salesmanager._id',
                            name: {
                                $concat: ['$salesmanager.name.first', ' ', '$salesmanager.name.last']
                            }
                        }
                    },

                    paymentsCount: {
                        $addToSet: {
                            _id : '$payment.count',
                            name: '$payment.count'
                        }
                    }
                }
            }];

        aggregation = Jobs.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getJournalEntryFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var journalEntrySchema = mongoose.Schemas.journalEntry;
        var JournalEntry = models.get(lastDB, 'journalEntry', journalEntrySchema);
        var aggregation;
        var newArray = [];
        var pipeLine = [{
            $lookup: {
                from        : 'journals',
                localField  : 'journal',
                foreignField: '_id',
                as          : 'journal'
            }
        }, {
            $lookup: {
                from        : 'chartOfAccount',
                localField  : 'account',
                foreignField: '_id',
                as          : 'account'
            }
        }, {
            $project: {
                journal  : {$arrayElemAt: ['$journal', 0]},
                account  : {$arrayElemAt: ['$account', 0]},
                name     : '$sourceDocument.name',
                debit    : '$debit',
                credit   : '$credit',
                timestamp: 1
            }
        }, {
            $group: {
                _id: null,

                name: {
                    $addToSet: {
                        _id : '$name',
                        name: '$name'
                    }
                },

                journal: {
                    $addToSet: {
                        _id : '$journal._id',
                        name: '$journal.name'
                    }
                },

                account: {
                    $addToSet: {
                        _id : '$account._id',
                        name: '$account.name'
                    }
                },

                debit: {
                    $addToSet: {
                        _id : '$debit',
                        name: {$divide: ['$debit', 100]}
                    }
                },

                credit: {
                    $addToSet: {
                        _id : '$credit',
                        name: {$divide: ['$credit', 100]}
                    }
                },

                timestamp: {
                    $addToSet: {
                        _id : '$timestamp',
                        name: {$concat: ['JE_', '$timestamp']}
                    }
                }
            }
        }];

        aggregation = JournalEntry.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            result.debit = result.debit || [];
            result.credit = result.credit || [];

            newArray = result.debit.concat(result.credit);

            result.sum = newArray;

            res.status(200).send(result);
        });
    };

    this.getInventoryReportFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var journalEntrySchema = mongoose.Schemas.journalEntry;
        var JournalEntry = models.get(lastDB, 'journalEntry', journalEntrySchema);

        var query = {
            'sourceDocument.model': 'product',
            debit                 : {$gt: 0}
        };

        var pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'Products',
                localField  : 'sourceDocument._id',
                foreignField: '_id',
                as          : 'product'
            }
        }, {
            $project: {
                product: {$arrayElemAt: ['$product', 0]}
            }
        }, {
            $lookup: {
                from        : 'jobs',
                localField  : 'product.job',
                foreignField: '_id',
                as          : 'job'
            }
        }, {
            $project: {
                job: {$arrayElemAt: ['$job', 0]}
            }
        }, {
            $lookup: {
                from        : 'projectMembers',
                localField  : 'job.project',
                foreignField: 'projectId',
                as          : 'projectMembers'
            }
        }, {
            $lookup: {
                from        : 'Project',
                localField  : 'job.project',
                foreignField: '_id',
                as          : 'project'
            }
        }, {
            $project: {
                project      : {$arrayElemAt: ['$project', 0]},
                salesManagers: {
                    $filter: {
                        input: '$projectMembers',
                        as   : 'projectMember',
                        cond : {
                            $and: [{
                                $eq: ['$$projectMember.projectPositionId', objectId(CONSTANTS.SALESMANAGER)]
                            }, {
                                $eq: ['$$projectMember.endDate', null]
                            }]
                        }
                    }
                }
            }
        }, {
            $project: {
                salesManager: {$arrayElemAt: ['$salesManagers', 0]},
                project     : 1,
                type        : '$project.projecttype'
            }
        }, {
            $lookup: {
                from        : 'Employees',
                localField  : 'salesManager.employeeId',
                foreignField: '_id',
                as          : 'salesManager'
            }
        }, {
            $project: {
                project     : 1,
                type        : 1,
                salesManager: {$arrayElemAt: ['$salesManager', 0]}
            }
        }, {
            $group: {
                _id    : null,
                project: {
                    $addToSet: {
                        _id : '$project._id',
                        name: '$project.name'
                    }
                },

                type: {
                    $addToSet: {
                        _id : '$type',
                        name: '$type'
                    }
                },

                salesManager: {
                    $addToSet: {
                        _id : '$salesManager._id',
                        name: {
                            $concat: ['$salesManager.name.first', ' ', '$salesManager.name.last']
                        }
                    }
                }
            }
        }];
        var aggregation;

        aggregation = JournalEntry.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getGoodsOutNotesFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var GoodsOutSchema = mongoose.Schemas.GoodsOutNote;
        var GoodsOutNote = models.get(lastDB, 'GoodsOutNote', GoodsOutSchema);
        var aggregation;

        var query = {
            _type: 'GoodsOutNote'
        };

        var pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'warehouse',
                localField  : 'warehouse',
                foreignField: '_id',
                as          : 'warehouse'
            }
        }, {
            $lookup: {
                from        : 'Order',
                localField  : 'order',
                foreignField: '_id',
                as          : 'order'
            }
        }, {
            $project: {
                warehouse: {$arrayElemAt: ['$warehouse', 0]},
                order    : {$arrayElemAt: ['$order', 0]},
                status   : 1,
                name     : 1
            }
        }, {
            $lookup: {
                from        : 'Customers',
                localField  : 'order.supplier',
                foreignField: '_id',
                as          : 'customer'
            }
        }, {
            $lookup: {
                from        : 'workflows',
                localField  : 'order.workflow',
                foreignField: '_id',
                as          : 'workflow'
            }
        }, {
            $project: {
                order           : 1,
                status          : 1,
                name            : 1,
                'warehouse.name': '$warehouse.name',
                'warehouse._id' : '$warehouse._id',
                workflow        : {$arrayElemAt: ['$workflow', 0]},
                customer        : {$arrayElemAt: ['$customer', 0]}
            }
        }, {
            $group: {
                _id : null,
                name: {
                    $addToSet: {
                        _id : '$_id',
                        name: '$name'
                    }
                },

                warehouse: {
                    $addToSet: {
                        _id : '$warehouse._id',
                        name: '$warehouse.name'
                    }
                },

                workflow: {
                    $addToSet: {
                        _id : '$workflow._id',
                        name: '$workflow.name'
                    }
                },

                customer: {
                    $addToSet: {
                        _id : '$customer._id',
                        name: {
                            $concat: ['$customer.name.first', ' ', '$customer.name.last']
                        }
                    }
                }
            }
        }];

        aggregation = GoodsOutNote.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            result.status = [{
                name: 'Printed',
                _id : 'printed'
            }, {
                name: 'Picked',
                _id : 'picked'
            }, {
                name: 'Packed',
                _id : 'packed'
            }, {
                name: 'Shipped',
                _id : 'shipped'
            }, {
                name: 'Received',
                _id : 'received'
            }];

            result.filterInfo = FILTER_CONSTANTS.goodsOutNotes;

            res.status(200).send(result);
        });
    };

    this.getStockTransactionsFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var StockTransActionSchema = mongoose.Schemas.stockTransactions;
        var StockTransaction = models.get(lastDB, 'stockTransactions', StockTransActionSchema);
        var aggregation;

        var query = {
            _type: 'stockTransactions'
        };

        var pipeLine = [{
            $match: query
        }, {
            $lookup: {
                from        : 'warehouse',
                localField  : 'warehouse',
                foreignField: '_id',
                as          : 'warehouse'
            }
        }, {
            $lookup: {
                from        : 'warehouse',
                localField  : 'warehouseTo',
                foreignField: '_id',
                as          : 'warehouseTo'
            }
        }, {
            $project: {
                warehouse  : {$arrayElemAt: ['$warehouse', 0]},
                warehouseTo: {$arrayElemAt: ['$warehouseTo', 0]},
                status     : 1
            }
        }, {
            $project: {
                order             : 1,
                status            : 1,
                'warehouse.name'  : '$warehouse.name',
                'warehouse._id'   : '$warehouse._id',
                'warehouseTo.name': '$warehouseTo.name',
                'warehouseTo._id' : '$warehouseTo._id'
            }
        }, {
            $group: {
                _id        : null,
                warehouse  : {
                    $addToSet: {
                        _id : '$warehouse._id',
                        name: '$warehouse.name'
                    }
                },
                warehouseTo: {
                    $addToSet: {
                        _id : '$warehouseTo._id',
                        name: '$warehouseTo.name'
                    }
                }
            }
        }];

        aggregation = StockTransaction.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            result.status = [{
                name: 'Printed',
                _id : 'printed'
            }, {
                name: 'Packed',
                _id : 'packed'
            }, {
                name: 'Shipped',
                _id : 'shipped'
            }, {
                name: 'Received',
                _id : 'received'
            }];

            result.filterInfo = FILTER_CONSTANTS.stockTransactions;

            res.status(200).send(result);
        });
    };

    this.getProductsAvailabilityFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var AvailabilitySchema = mongoose.Schemas.productsAvailability;
        var Availability = models.get(lastDB, 'productsAvailability', AvailabilitySchema);
        var aggregation;

        var pipeLine = [{
            $match: {isJob: false}
        }, {
            $lookup: {
                from        : 'warehouse',
                localField  : 'warehouse',
                foreignField: '_id',
                as          : 'warehouse'
            }
        }, {
            $lookup: {
                from        : 'locations',
                localField  : 'location',
                foreignField: '_id',
                as          : 'location'
            }
        }, {
            $lookup: {
                from        : 'Products',
                localField  : 'product',
                foreignField: '_id',
                as          : 'product'
            }
        }, {
            $lookup: {
                from        : 'GoodsNote',
                localField  : 'goodsInNote',
                foreignField: '_id',
                as          : 'goodsInNote'
            }
        }, {
            $project: {
                warehouse  : {$arrayElemAt: ['$warehouse', 0]},
                location   : {$arrayElemAt: ['$location', 0]},
                product    : {$arrayElemAt: ['$product', 0]},
                goodsInNote: {$arrayElemAt: ['$goodsInNote', 0]},
                status     : 1
            }
        }, {
            $lookup: {
                from        : 'Order',
                localField  : 'goodsInNote.order',
                foreignField: '_id',
                as          : 'order'
            }
        }, {
            $project: {
                order           : {$arrayElemAt: ['$order', 0]},
                product         : 1,
                'location.name' : '$location.name',
                'location._id'  : '$location._id',
                'warehouse.name': '$warehouse.name',
                'warehouse._id' : '$warehouse._id'
            }
        }, {
            $project: {
                'order.name': '$order.name',
                'order._id' : '$order._id',
                product     : 1,
                location    : 1,
                warehouse   : 1
            }
        }, {
            $group: {
                _id      : null,
                warehouse: {
                    $addToSet: {
                        _id : '$warehouse._id',
                        name: '$warehouse.name'
                    }
                },
                location : {
                    $addToSet: {
                        _id : '$location._id',
                        name: '$location.name'
                    }
                },
                product  : {
                    $addToSet: {
                        _id : '$product.name',
                        name: '$product.name'
                    }
                },
                order    : {
                    $addToSet: {
                        _id : '$order._id',
                        name: '$order.name'
                    }
                },

                SKU: {
                    $addToSet: {
                        _id : '$product._id',
                        name: '$product.info.SKU'
                    }
                }
            }
        }];

        aggregation = Availability.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };

    this.getChartOfAccountFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var chartOfAccountSchema = mongoose.Schemas.chartOfAccount;
        var Model = models.get(lastDB, 'chartOfAccount', chartOfAccountSchema);
        var aggregation;

        var pipeLine = [{
            $lookup: {
                from        : 'accountsCategories',
                localField  : 'category',
                foreignField: '_id',
                as          : 'category'
            }
        }, {
            $lookup: {
                from        : 'PaymentMethod',
                localField  : '_id',
                foreignField: 'chartAccount',
                as          : 'payMethod'
            }
        }, {
            $project: {
                category : {$arrayElemAt: ['$category', 0]},
                code     : 1,
                account  : 1,
                payMethod: {$arrayElemAt: ['$payMethod', 0]}
            }
        }, {
            $group: {
                _id     : null,
                category: {
                    $addToSet: {
                        _id : '$category._id',
                        name: '$category.fullName'
                    }
                },

                account: {
                    $addToSet: {
                        _id : '$account',
                        name: '$account'
                    }
                },

                code: {
                    $addToSet: {
                        _id : '$code',
                        name: '$code'
                    }
                },

                currency: {
                    $addToSet: {
                        _id : {$ifNull: ['$payMethod.currency', 'None']},
                        name: {$ifNull: ['$payMethod.currency', 'None']}
                    }
                }
            }
        }];

        aggregation = Model.aggregate(pipeLine);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });

    };

    this.getBillOfMaterialsFilters = function (req, res, next) {
        var lastDB = req.session.lastDb;
        var billOfMaterialsSchema = mongoose.Schemas.billOfMaterialSchema;
        var Model = models.get(lastDB, 'billOfMaterials', billOfMaterialsSchema);
        var pipelines = [
            {
                $lookup: {
                    from        : 'Products',
                    localField  : 'product',
                    foreignField: '_id',
                    as          : 'product'
                }
            },
            {
                $lookup: {
                    from        : 'routing',
                    localField  : 'routing',
                    foreignField: '_id',
                    as          : 'routing'
                }
            },
            {
                $project: {
                    product    : {$arrayElemAt: ['$product', 0]},
                    routing    : {$arrayElemAt: ['$routing', 0]},
                    quantity   : 1,
                    description: 1,
                    name       : 1
                }
            },
            {
                $group: {
                    _id    : null,
                    name   : {
                        $addToSet: {
                            _id : '$name',
                            name: '$name'
                        }
                    },
                    product: {
                        $addToSet: {
                            _id : '$product._id',
                            name: '$product.name'
                        }
                    },

                    routing: {
                        $addToSet: {
                            _id : '$routing._id',
                            name: '$routing.name'
                        }
                    },

                    quantity: {
                        $addToSet: {
                            _id : '$quantity',
                            name: '$quantity'
                        }
                    },

                    description: {
                        $addToSet: {
                            _id : '$description',
                            name: '$description'
                        }
                    }
                }
            }
        ];
        var aggregation;

        aggregation = Model.aggregate(pipelines);

        aggregation.options = {
            allowDiskUse: true
        };

        aggregation.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            result = result.length ? result[0] : {};

            res.status(200).send(result);
        });
    };
};

module.exports = Filters;
