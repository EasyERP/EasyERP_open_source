var mongoose = require('mongoose');
var Module = function (models) {
    'use strict';

    var jobPositionSchema = mongoose.Schemas.JobPosition;
    var jobTypeSchema = mongoose.Schemas.jobType;
    var employeeSchema = mongoose.Schemas.Employee;
    var accessRoll = require('../helpers/accessRollHelper.js')(models);
    var async = require('async');
    var objectId = mongoose.Types.ObjectId;

    var _ = require('../node_modules/underscore');
    var pageHelper = require('../helpers/pageHelper');

    this.getFilterValues = function (req, res, next) {
        var JobPosition = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);

        JobPosition.aggregate([{
            $group: {
                _id       : null,
                'Job name': {
                    $addToSet: '$name'
                },

                'Total forecasted employees': {
                    $addToSet: '$totalForecastedEmployees'
                },

                'Current number of employees': {
                    $addToSet: '$numberOfEmployees'
                },

                'Expected in recruitment': {
                    $addToSet: '$expectedRecruitment'
                }
            }
        }], function (err, result) {
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
                    case 'Total forecasted employees':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num;
                        });
                        break;
                    case 'Current number of employees':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num;
                        });
                        break;
                    case 'Expected in recruitment':
                        result[0][key] = _.sortBy(value, function (num) {
                            return num;
                        });
                        break;
                    // skip default;
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

    function getById(req, res, next) {
        var JobPosition = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var id = req.query.id;

        JobPosition
            .findById(id)
            .populate('department', 'name _id')
            .populate('workflow', 'name _id')
            .populate('createdBy.user')
            .populate('editedBy.user')
            .populate('groups.users')
            .populate('groups.group')
            .populate('groups.owner', '_id login')
            .exec(function (err, response) {
                if (err) {
                    return next(err);
                }

                Employee.aggregate([{
                    $match: {
                        jobPosition: objectId(id)
                    }
                }], function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    response.numberOfEmployees = result.length;
                    response.totalForecastedEmployees = response.expectedRecruitment + result.length;

                    res.status(200).send(response);
                });
            });
    }

    function getFilterJobPositions(req, res, next) {
        var JobPosition = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);
        var Employee = models.get(req.session.lastDb, 'Employees', employeeSchema);
        var sort = req.query.sort || {};
        var data = req.query;
        var parallelTasks;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var skip = paginationObject.skip;
        var getCount;
        var getData;
        var i;
        var keysSort;
        var key;

        getCount = function (pCb) {
            JobPosition
                .find({})
                .populate('createdBy.user')
                .populate('editedBy.user')
                .populate('department', '_id name')
                .populate('workflow', 'name _id status')
                .count(function (err, result) {
                    if (err) {
                        return pCb(err);
                    }

                    pCb(null, result);
                });
        };

        getData = function (pCb) {
            JobPosition
                .find({})
                .populate('createdBy.user')
                .populate('editedBy.user')
                .populate('department', '_id name')
                .populate('workflow', 'name _id status')
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(function (err, result) {
                    if (err) {
                        return pCb(err);
                    }
                    async.each(result, function (jp, cb) {
                        Employee.find({jobPosition: jp._id}).count(function (err, count) {
                            if (err) {
                                return cb(err);
                            }

                            jp.numberOfEmployees = count;
                            jp.totalForecastedEmployees = count + jp.expectedRecruitment;
                            cb();
                        });
                    }, function (err) {
                        if (err) {
                            return pCb(err);
                        }
                        function compareSort(personA, personB) {
                            if (sort[key] === '1') {
                                return personA[key] - personB[key];
                            }
                            return personB[key] - personA[key];
                        }


                        keysSort = Object.keys(sort);

                        for (i = keysSort.length - 1; i >= 0; i--) {
                            key = keysSort[i];
                            if (result.length && typeof result[0][key] === 'number') {
                                result.sort(compareSort);
                            }
                        }

                        pCb(null, result);
                    });
                });
        };

        parallelTasks = [getCount, getData];

        async.parallel(parallelTasks, function (err, result) {
            var count;
            var response = {};

            if (err) {
                return next(err);
            }

            count = result[0] || 0;

            response.total = count;
            response.data = result[1];

            res.status(200).send(response);
        });
    }

    this.getByViewType = function (req, res, next) {
        var query = req.query;
        var viewType = query.viewType;
        var id = query.id;

        if (id && id.length >= 24) {
            getById(req, res, next);
            return false;
        }

        switch (viewType) {
            case 'form':
                getById(req, res, next);
                break;
            default:
                getFilterJobPositions(req, res, next);
                break;
        }
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

                res.status(201).send({success: 'A new JobPosition create success', id: result._id});
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

        if (isNaN(data.totalForecastedEmployees)) {
            data.totalForecastedEmployees = 0;
        }

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

    this.bulkRemove = function (req, res, next) {
        var JobPosition = models.get(req.session.lastDb, 'JobPosition', jobPositionSchema);
        var body = req.body || {ids: []};
        var ids = body.ids;

        JobPosition.remove({_id: {$in: ids}}, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send(removed);
        });
    };
};

module.exports = Module;
