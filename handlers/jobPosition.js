var mongoose = require('mongoose');
var JobPosition = function (models) {
    'use strict';
    var accessRoll = require("../helpers/accessRollHelper.js")(models);
    var jobPositionSchema = mongoose.Schemas.JobPosition;
    var jobTypeSchema = mongoose.Schemas.jobType;
    var employeeSchema = mongoose.Schemas.Employee;
    var async = require('async');
    var objectId = mongoose.Types.ObjectId;

    var _ = require('../node_modules/underscore');

    this.getFilterValues = function (req, res, next) {
        var JobPosition = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);

        JobPosition.aggregate([
            {
                $group: {
                    _id                          : null,
                    'Job name'                   : {
                        $addToSet: '$name'
                    },
                    'Total forecasted employees' : {
                        $addToSet: '$totalForecastedEmployees'
                    },
                    'Current number of employees': {
                        $addToSet: '$numberOfEmployees'
                    },
                    'Expected in recruitment'    : {
                        $addToSet: '$expectedRecruitment'
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }

            _.map(result[0], function (value, key) {
                switch (key) {
                    case 'Job name':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num;
                        });
                        break;
                    case  'Total forecasted employees':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num;
                        });
                        break;
                    case  'Current number of employees':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num;
                        });
                        break;
                    case  'Expected in recruitment':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num;
                        });
                        break;

                }
            });

            res.status(200).send(result);
        });
    };

    this.getForDd = function (req, res, next) {
        var JobPosition = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);

        JobPosition.find({}, {name: 1}).sort({name: 1}).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.jobType = function (req, res, next) {
        var jobType = models.get(req.session.lastDb, 'jobType', jobTypeSchema);

        jobType.find({}, {name: 1}).sort({name: 1}).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.getById = function (req, res, next) {
        var JobPosition = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var id = req.query.id;

        JobPosition
            .findById(id)
            .populate("department", "departmentName _id")
            .populate("workflow", "name _id")
            .populate('createdBy.user')
            .populate('editedBy.user')
            .populate('groups.users')
            .populate('groups.group')
            .populate('groups.owner', '_id login')
            .exec(function (err, response) {
                if (err) {
                    return next(err);
                }

                Employee.aggregate(
                    {
                        $match: {
                            "jobPosition": objectId(id)
                        }
                    },
                    function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        response.numberOfEmployees = result.length;
                        response.totalForecastedEmployees = response.expectedRecruitment + result.length;
                        res.status(200).send(response);

                    }
                );
            });
    };

    this.getFilterJobPositions = function (req, res, next) {
        var JobPosition = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var sort = req.query.sort;
        var data = req.query;
        var i;

        function compareSort(personA, personB) {
            if (sort[i] === 1) {
                return personA[i] - personB[i];
            }

            return personB[i] - personA[i];
        }

        JobPosition
            .find({})
            .populate('createdBy.user')
            .populate('editedBy.user')
            .populate('department', '_id departmentName')
            .populate('workflow', 'name _id status')
            .sort(sort)
            .skip((data.page - 1) * data.count)
            .limit(data.count)
            .lean()
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                async.each(result, function (jp, cb) {
                    Employee.find({"jobPosition": jp._id}).count(function (err, count) {
                        if (err) {
                            return cb(err);
                        }
                        jp.numberOfEmployees = count;
                        jp.totalForecastedEmployees = count + jp.expectedRecruitment;
                        cb();
                    });
                }, function (err) {
                    if (err) {
                        return next(err);
                    }

                    for (i in sort) {
                        if (typeof result[0][i] === 'number') {
                            result.sort(compareSort);
                        }
                    }

                    res.status(200).send({data: result});
                });
            });
    };

    this.create = function (req, res, next) {
        var JobPosition = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);
        var body = req.body;
        var job;

        JobPosition.find({name: body.name}, function (err, doc) {
            if (err) {
                return next(err);
            }

            if (doc.length) {
                if (doc[0].name === body.name) {
                    return res.status(400).send({error: 'An jobPosition with the same Name already exists'});
                }
            }

            job = new JobPosition(body);

            job.save(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(201).send({success: {massage: 'A new JobPosition create success', id: result._id}});
            });
        });
    };

    this.update = function (req, res, next) {
        var JobPosition = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);
        var id = req.params.id;
        var data = req.body;

        delete data._id;
        delete data.createdBy;
        if (data.workflow === '528ce71ef3f67bc40b00001d') {
            ++data.expectedRecruitment;
        } else {
            if (data.workflow && data.expectedRecruitment !== 0) {
                --data.expectedRecruitment;
            }
        }
        data.numberOfEmployees = data.numberOfEmployees || 0;
        data.totalForecastedEmployees = data.expectedRecruitment + data.numberOfEmployees;

        if (data.department && data.department._id) {
            data.department = data.department._id;
        }

        if (data.workflow && data.workflow._id) {
            data.workflow = data.workflow._id;
        }

        JobPosition.findByIdAndUpdate(id, data, {new: true}, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'JobPosition updated success'});
        });
    };

    this.totalCollectionLength = function (req, res, next) {
        var JobPosition = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);
        var accessRollSearcher;
        var contentSearcher;
        var waterfallTasks;

        accessRollSearcher = function (cb) {
            accessRoll(req, JobPosition, cb);
        };

        contentSearcher = function (ids, cb) {
            var queryObject = {};

            queryObject.$and = [];

            queryObject.$and.push({_id: {$in: ids}});

            JobPosition.find(queryObject, cb);
        };

        waterfallTasks = [accessRollSearcher, contentSearcher];

        async.waterfall(waterfallTasks, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({count: result.length});
        });

    };

    this.remove = function (req, res, next) {
        var JobPosition = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);
        var id = req.params.id;

        JobPosition.remove({_id: id}, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'JobPosition removed'});
        });
    };
};

module.exports = JobPosition;