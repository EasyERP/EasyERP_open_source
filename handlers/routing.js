var mongoose = require('mongoose');
var async = require('async');
var ObjectId = mongoose.Types.ObjectId;

var Handler = function (models, event) {
    'use strict';

    var routingSchema = mongoose.Schemas.routing;
    var billOfMaterialSchema = mongoose.Schemas.billOfMaterial;

    this.getById = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var routing = models.get(db, 'routing', routingSchema);
        var id = req.params.id;
        var query = {};
        var err;

        if (!id) {
            err = new Error();
            err.message = 'Id not found';

            return next(err);
        }

        query = {
            _id: ObjectId(id)
        };

        routing.aggregate([{
            $match: query
        }, {
            $unwind: {
                path                      : '$steps',
                preserveNullAndEmptyArrays: true

            }
        }, {
            $lookup: {
                from        : 'workCentres',
                localField  : 'steps.workCentre',
                foreignField: '_id',
                as          : 'steps.workCentreObject'
            }
        }, {
            $unwind: {
                path                      : '$steps.workCentreObject',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $group: {
                _id  : {name: '$name', _id: '$_id'},
                steps: {$push: '$steps'}
            }
        }, {
            $project: {
                _id  : '$_id._id',
                name : '$_id.name',
                steps: 1
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result[0]);
        });
    };

    this.getForDD = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var routing = models.get(db, 'routing', routingSchema);

        routing.aggregate([{
            $unwind: {
                path                      : '$steps',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'workCentres',
                localField  : 'steps.workCentre',
                foreignField: '_id',
                as          : 'steps.workCentreObject'
            }
        }, {
            $unwind: {
                path                      : '$steps.workCentreObject',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $group: {
                _id      : {name: '$name', _id: '$_id'},
                steps    : {$push: '$steps'},
                createdBy: {$first: '$createdBy'}

            }
        }, {
            $project: {
                _id      : '$_id._id',
                name     : '$_id.name',
                steps    : 1,
                createdBy: 1
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
                name            : 1,
                steps           : 1,
                'createdBy.date': 1,
                'createdBy.user': {$arrayElemAt: ['$createdBy.user', 0]}
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.getNamesForBillComponents = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var routing = models.get(db, 'routing', routingSchema);

        routing.aggregate([
            {
                $project: {
                    name: 1,
                }
            }], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.create = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var Routing = models.get(db, 'routing', routingSchema);
        var data = req.body;
        var routing;

        data.createdBy = {
            user: req.session.uId
        };

        data.editedBy = {
            user: req.session.uId
        };

        routing = new Routing(data);
        routing.save(function (error, result) {
            if (error) {
                return next(error);
            }

            res.status(200).send(result);
        });
    };

    this.update = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var routing = models.get(db, 'routing', routingSchema);
        var body = req.body;
        var id = req.params.id;
        var err;

        if (!id) {
            err = new Error();
            err.status = 404;
            err.message = 'Id not found';

            return next(err);
        }

        routing.findByIdAndUpdate(id, body, {}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.remove = function (req, res, next) {
        var db = req.session.lastDb || 'CRM';
        var routing = models.get(db, 'routing', routingSchema);
        var billOfMaterials = models.get(db, 'billOfMaterials', billOfMaterialSchema);
        var ids = req.query.id ? [req.query.id] : req.body.ids;
        var err;

        if (!ids) {
            err = new Error();
            err.status = 404;
            err.message = 'Id not found';

            return next(err);
        }

        async.each(ids, function (id, cb) {
            billOfMaterials.count({routing: id}, function (err, count) {
                if (err) {
                    return cb(err);
                }

                if (!count) {
                    routing.remove({_id: id}, cb);
                } else {
                    cb();
                }
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: true});
        });
    };
};

module.exports = Handler;
