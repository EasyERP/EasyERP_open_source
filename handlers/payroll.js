var mongoose = require('mongoose');
var moment = require('../public/js/libs/moment/moment');
var PayRoll = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var PayRollSchema = mongoose.Schemas['PayRoll'];
    var DepartmentSchema = mongoose.Schemas['Department'];
    var _ = require('lodash');

    var async = require('async');
    var mapObject = require('../helpers/bodyMaper');
    var objectId = mongoose.Types.ObjectId;
    var mid = 66;

    function ConvertType(array, type) {
        if (type === 'integer') {
            for (var i = array.length - 1; i >= 0; i--) {
                array[i] = parseInt(array[i]);
            }
        } else if (type === 'boolean') {
            for (var i = array.length - 1; i >= 0; i--) {
                if (array[i] === 'true') {
                    array[i] = true;
                } else if (array[i] === 'false') {
                    array[i] = false;
                } else {
                    array[i] = null;
                }
            }
        }
    };

    function caseFilter(filter) {
        var condition;
        var resArray = [];
        var filtrElement = {};
        var key;

        for (var filterName in filter) {
            condition = filter[filterName]['value'];
            key = filter[filterName]['key'];

            switch (filterName) {
                case 'employee':
                    filtrElement[key] = {$in: condition.objectID()};
                    resArray.push(filtrElement);
                    break;
                case 'year':
                    ConvertType(condition, 'integer');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'month':
                    ConvertType(condition, 'integer');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
                case 'dataKey':
                    ConvertType(condition, 'integer');
                    filtrElement[key] = {$in: condition};
                    resArray.push(filtrElement);
                    break;
            }
        }
        ;

        return resArray;
    };

    this.create = function (req, res, next) {
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);
        var body = req.body;
        var payRollModel;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                body.createdBy = {
                    user: req.session.uId,
                    date: new Date().toISOString()
                };

                payRollModel = new PayRoll(mapObject(body));

                payRollModel.save(function (err, payRoll) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(payRoll);
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getDeleteAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                PayRoll.remove({_id: id}, function (err, payRoll) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(payRoll);
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.putchModel = function (req, res, next) {
        var data = mapObject(req.body);
        var id = req.params.id;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    return next(error);
                }

                data.editedBy = {
                    user: req.session.uId,
                    date: new Date().toISOString()
                };

                PayRoll.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, response) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: 'updated'});
                });

            });
        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            uId = req.session.uId;
            access.getEditWritAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    next(error);
                }

                async.each(body, function (data, cb) {
                    var id = data._id;

                    data.editedBy = {
                        user: uId,
                        date: new Date().toISOString()
                    };
                    delete data._id;

                    PayRoll.findByIdAndUpdate(id, {$set: data}, cb);
                }, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send({success: 'updated'});
                });
            });
        } else {
            res.status(401).send();
        }
    };

    this.getById = function (req, res, next) {
        var id = req.params.id;
        var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);

        var queryObject = {_id: id};
        var query;

        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    next(error);
                }

                query = Salary.findOne(queryObject);

                query.exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(result);
                });
            });
        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };

    this.getForView = function (req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, mid, function (access) {
                if (!access) {
                    error = new Error();
                    error.status = 403;

                    next(error);
                }

                var PayRoll = models.get(req.session.lastDb, 'PayRoll', PayRollSchema);
                var query = req.query;
                var filter = query.filter;
                var queryObject = {};
                var dataKeyQuery = PayRoll.findOne({$query: {}, $orderby: {dataKey: -1}});
                var waterfallTasks = [checkFilter, getResult, calcTotal];

                function checkFilter(callback) {
                    if (filter && filter.dataKey) {
                        return callback(null, filter);
                    }

                    dataKeyQuery.exec(function (err, model) {
                        if (err) {
                            return callback(err);
                        }

                        filter = {};

                        filter.dataKey = {
                            key  : 'dataKey',
                            value: [model.toJSON().dataKey]
                        }

                        return callback(null, filter);
                    })
                }

                function getResult(filter, callback) {
                    if (filter && typeof filter === 'object') {
                        if (filter.condition && filter.condition === 'or') {
                            queryObject['$or'] = caseFilter(filter);
                        } else {
                            queryObject['$and'] = caseFilter(filter);
                        }
                    }

                    query = PayRoll.find(queryObject);

                    query.exec(function (err, result) {
                        if (err) {
                            return callback(err);
                        }

                        callback(null, result);
                    });
                };

                function calcTotal(result, callback) {

                    function sum(numbers) {
                        return _.reduce(numbers, function (result, current) {
                            return result + parseFloat(current ? current : 0);
                        }, 0);
                    }

                    var total = _.chain(result)
                        .groupBy(function (model) {
                            return model.get('dataKey');
                        })
                        .map(function (value, key) {
                            return {
                                calc: {
                                    onCash: sum(_.pluck(value, "calc.onCash")),
                                    onCard: sum(_.pluck(value, "calc.onCard")),
                                    salary: sum(_.pluck(value, "baseSalary")),
                                },
                                paid: {
                                    onCash: sum(_.pluck(value, "paid.onCash")),
                                    onCard: sum(_.pluck(value, "paid.onCard")),
                                },
                                diff: {
                                    onCash: sum(_.pluck(value, "diff.onCash")),
                                    onCard: sum(_.pluck(value, "diff.onCard")),
                                    total : sum(_.pluck(value, "diff.total")),
                                }
                            }
                        })
                        .value()[0];

                    callback(null, {total: total, collection: result});
                }

                async.waterfall(waterfallTasks, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });


                /*if (query) {
                 if (query.employee) {
                 queryObject['employee._id'] = objectId(query.employee);
                 }
                 if (query.year) {
                 queryObject.year = query.year;
                 }
                 if (query.month) {
                 queryObject.month = query.month;
                 }
                 }*/

            });

        } else {
            error = new Error();
            error.status = 401;

            next(error);
        }
    };
};

module.exports = PayRoll;