var mongoose = require('mongoose');
var async = require('async');

var Module = function (models) {
    var warehouseSchema = mongoose.Schemas.warehouse;
    var locationSchema = mongoose.Schemas.locations;
    var zoneSchema = mongoose.Schemas.zones;
    var AvailabilitySchema = mongoose.Schemas.productsAvailability;

    function get(req, res, next) {
        var Model = models.get(req.session.lastDb, 'warehouse', warehouseSchema);
        var query = req.query && req.query._id ? req.query : {};

        Model.aggregate([{
            $match: query
        }, {
            $lookup: {
                from        : 'locations',
                localField  : '_id',
                foreignField: 'warehouse',
                as          : 'locations'
            }
        }, {
            $unwind: {
                path                      : '$locations',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'zones',
                localField  : 'locations.zone',
                foreignField: '_id',
                as          : 'locations.zone'
            }
        }, {
            $lookup: {
                from        : 'zones',
                localField  : '_id',
                foreignField: 'warehouse',
                as          : 'zones'
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
                account         : {$arrayElemAt: ['$account', 0]},
                'locations.zone': {$arrayElemAt: ['$locations.zone', 0]},
                'locations.name': 1,
                'locations._id' : 1,
                name            : 1,
                address         : 1,
                isOwn           : 1,
                main            : 1,
                zones           : 1,
                warehouseId     : '$_id'
            }
        }, {
            $group: {
                _id : '$locations.zone',
                root: {$push: '$$ROOT'}
            }
        }, {
            $unwind: '$root'
        }, {
            $group: {
                _id      : '$root.warehouseId',
                account  : {$first: '$root.account'},
                address  : {$first: '$root.address'},
                main     : {$first: '$root.main'},
                name     : {$first: '$root.name'},
                isOwn    : {$first: '$root.isOwn'},
                locations: {$addToSet: '$root.locations'},
                zones    : {$first: '$root.zones'}
            }
        }, {
            $sort: {
                main: -1
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }

            if (Object.keys(query).length) {
                return res.status(200).send(result && result.length ? result[0] : {});
            }

            res.status(200).send({data: result});
        });
    }

    this.get = get;

    this.getHierarchyWarehouse = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'warehouse', warehouseSchema);

        Model.aggregate([{
            $lookup: {
                from        : 'zones',
                localField  : '_id',
                foreignField: 'warehouse',
                as          : 'zones'
            }
        }, {
            $unwind: {
                path                      : '$zones',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from        : 'locations',
                localField  : 'zones._id',
                foreignField: 'zone',
                as          : 'locations'
            }
        }, {
            $project: {
                name            : 1,
                main            : 1,
                'locations._id' : 1,
                'locations.name': 1,
                zones           : 1
            }
        }, {
            $group: {
                _id  : '$_id',
                zones: {
                    $addToSet: {
                        name     : '$zones.name',
                        locations: '$locations'
                    }
                },

                name: {$first: '$name'},
                main: {$first: '$main'}
            }
        }], function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.getForDd = function (req, res, next) {
        var query = models.get(req.session.lastDb, 'warehouse', warehouseSchema);

        query
            .find({}, {name: 1, account: 1})
            .sort({main: -1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    };

    this.getForDdZone = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'zone', zoneSchema);
        var query = req.query || {};

        Model
            .find(query, {name: 1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    };

    this.getForDdLocation = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'location', locationSchema);
        var findObject = {};

        if (req.query) {
            findObject = req.query;
        }

        if (findObject.warehouse && findObject.warehouse.length !== 24) {
            return res.status(200).send({data: []});
        }

        Model.find(findObject, {name: 1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    };

    this.update = function (req, res, next) {
        var self = this;
        var Model = models.get(req.session.lastDb, 'warehouse', warehouseSchema);
        var id = req.params.id;
        var data = req.body;

        data.editeddBy = {
            user: req.session.uId,
            date: new Date()
        };

        if (data.main) {
            Model.update({_id: {$nin: [id]}}, {$set: {main: false}}, {multi: true}, function (err, result) {
                delete data._id;

                Model.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    if (result) {
                        req.query = {_id: result._id};
                    }

                    get(req, res, next);
                });
            });
        } else {
            delete data._id;

            Model.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, result) {
                if (err) {
                    return next(err);
                }

                if (result) {
                    req.query = {_id: result._id};
                }

                get(req, res, next);
            });
        }

    };

    this.updateLocation = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'location', locationSchema);
        var id = req.params.id;
        var data = req.body;

        data.editeddBy = {
            user: req.session.uId,
            date: new Date()
        };

        Model.findByIdAndUpdate(id, {$set: data}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.updateZone = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'zone', zoneSchema);
        var id = req.params.id;
        var data = req.body;

        data.editeddBy = {
            user: req.session.uId,
            date: new Date()
        };

        Model.findByIdAndUpdate(id, {$set: data}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.create = function (req, res, next) {
        var self = this;
        var Model = models.get(req.session.lastDb, 'warehouse', warehouseSchema);
        var LocationModel = models.get(req.session.lastDb, 'location', locationSchema);
        var body = req.body;
        var uId = req.session.uId;
        var locationBody = {
            groupingA: '0',
            groupingB: '0',
            groupingC: '0',
            groupingD: '0',
            name     : '0.0.0.0'
        };
        var item;

        function checkMain(wCb) {
            if (!body.main) {
                return wCb();
            }

            Model.update({main: true}, {main: false}, {multi: true, upsert: true}, function (err, result) {
                if (err) {
                    return wCb(err);
                }

                wCb();
            });
        }

        function createWarehouse(wCb) {
            Model.find({name: body.name}, function (err, result) {
                if (err) {
                    return wCb(err);
                }

                if (result && result.length) {
                    return res.status(400).send({error: 'Warehouse should be unique'});
                }

                item = new Model(body);

                item.save(function (err, result) {
                    if (err) {
                        return wCb(err);
                    }

                    Model.update({_id: {$nin: [result._id]}}, {$set: {main: false}}, {multi: true}, function (err, result) {

                    });

                    req.query = {_id: result._id};

                    locationBody.warehouse = result._id;

                    createLocation(LocationModel, locationBody, uId, function (err) {
                        if (err) {
                            return wCb(err);
                        }

                        wCb();
                    });
                });
            });
        }

        body.createdBy = {
            user: uId,
            date: new Date()
        };

        body.editedBy = {
            user: uId,
            date: new Date()
        };

        async.waterfall([checkMain, createWarehouse], function (err, result) {
            if (err) {
                return next(err);
            }

            get(req, res, next);
        });

    };

    function createLocation(Model, body, uId, callback) {
        var item;

        body.createdBy = {
            user: uId,
            date: new Date()
        };

        body.editedBy = {
            user: uId,
            date: new Date()
        };

        item = new Model(body);

        item.save(function (err, result) {
            if (err) {
                return callback(err);
            }

            Model.findById(result._id).populate('zone').exec(function (err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });

        });
    }

    this.createLocation = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'location', locationSchema);
        var body = req.body;

        createLocation(Model, body, req.session.uId, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.createZone = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'zone', zoneSchema);
        var body = req.body;
        var item;

        body.createdBy = {
            user: req.session.uId,
            date: new Date()
        };

        body.editedBy = {
            user: req.session.uId,
            date: new Date()
        };

        item = new Model(body);

        item.save(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.remove = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'warehouse', warehouseSchema);
        var productsAvailability = models.get(req.session.lastDb, 'productsAvailability', AvailabilitySchema);
        var id = req.params.id;

        productsAvailability.find({warehouse: id}, function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result.length) {
                Model.remove({_id: id}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
            } else {
                res.status(400).send({error: 'You can delete only empty Warehouse. Please, remove products first'});

            }
        });

    };

    this.removeLocation = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'location', locationSchema);
        var id = req.params.id;

        Model.remove({_id: id}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.removeZone = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'zone', zoneSchema);
        var Location = models.get(req.session.lastDb, 'location', locationSchema);

        var id = req.params.id;

        Model.remove({_id: id}, function (err, result) {
            if (err) {
                return next(err);
            }

            Location.update({zone: id}, {$set: {zone: null}}, {multi: true}, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });

        });
    };
};

module.exports = Module;
