var Module = function (models, event) {
    'use strict';

    var mongoose = require('mongoose');
    var objectId = mongoose.Types.ObjectId;
    var BillOfMaterialsSchema = mongoose.Schemas.billOfMaterialSchema;

    var async = require('async');
    var _ = require('../node_modules/underscore');
    var moment = require('../public/js/libs/moment/moment');

    this.create = function (req, res, next) {
        var db = req.session.lastDb;
        var BillOfMaterials = models.get(db, 'billOfMaterials', BillOfMaterialsSchema);
        var body = req.body;
        var components = body.components;
        var data;
        var billOfMaterials;

        var productId = body.product ? objectId(body.product) : null;
        var routing = body.routing ? objectId(body.routing) : null;
        var isComponent = body.isComponent ? JSON.parse(body.isComponent) : false;
        var quantity = body.quantity ? body.quantity - 0 : 0;
        var name = body.name ? body.name : '';

        components.map(function (_component) {
            _component.component = _component.component ? objectId(_component.component) : null;
            _component.quantity = _component.quantity ? _component.quantity - 0 : 0;
        });

        data = {
            name       : name,
            product    : productId,
            routing    : routing,
            isComponent: isComponent,
            quantity   : quantity,
            description: body.description,
            components : components
        };

        billOfMaterials = new BillOfMaterials(data);

        billOfMaterials.save(function (err, _billOfMaterials) {
            if (err) {
                return next(err);
            }

            res.status(201).send(_billOfMaterials);
        });

    };

    this.getBillOfMaterials = function (req, res, next) {
        var db = req.session.lastDb;
        var query = req.query;
        var matchQuery = {};
        var sortObject = {};
        var keys;
        var BillOfMaterials = models.get(db, 'billOfMaterials', BillOfMaterialsSchema);
        var pipelines;
        var filter = query.filter;

        if (filter && filter.name) {
            matchQuery.name = {
                $in: filter.name.value
            };
        }

        if (filter && filter.product) {
            matchQuery.product = {
                $in: []
            };

            filter.product.value.forEach(function (el) {
                matchQuery.product.$in.push(objectId(el));
            });
        }

        if (filter && filter.description) {
            matchQuery.description = {
                $in: filter.description.value
            }
        }

        if (filter && filter.routing) {
            matchQuery.routing = {
                $in: []
            };

            filter.routing.value.forEach(function (el) {
                matchQuery.routing.$in.push(objectId(el));
            });
        }

        if (filter && filter.quantity) {
            matchQuery.quantity = {
                $in: []
            };

            filter.quantity.value.forEach(function (el) {
                matchQuery.quantity.$in.push(parseFloat(el));
            });
        }

        pipelines = [
            {
                $match: matchQuery
            },
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
                    isComponent: 1,
                    quantity   : 1,
                    description: 1,
                    name       : 1
                }
            },
            {
                $project: {
                    product    : '$product.name',
                    routing    : '$routing.name',
                    isComponent: 1,
                    quantity   : 1,
                    description: 1,
                    name       : 1
                }
            }
        ];

        if (query.sort) {
            keys = Object.keys(query.sort);

            keys.forEach(function (key) {
                sortObject[key] = parseInt(query.sort[key], 10);
            });

            pipelines.push({
                $sort: sortObject
            });
        }

        BillOfMaterials.aggregate(pipelines).exec(function (err, _billOfMaterials) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: _billOfMaterials});
        });
    };

    this.getById = function (req, res, next) {
        var db = req.session.lastDb;
        var BillOfMaterials = models.get(db, 'billOfMaterials', BillOfMaterialsSchema);
        var id = req.params.id;
        var pipelines = [
            {
                $match: {
                    _id: objectId(id)
                }
            },
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
                    isComponent: 1,
                    quantity   : 1,
                    description: 1,
                    components : 1,
                    name       : 1
                }
            },
            {
                $unwind: '$components'
            },
            {
                $lookup: {
                    from        : 'Products',
                    localField  : 'components.component',
                    foreignField: '_id',
                    as          : 'component'
                }
            },
            {
                $project: {
                    component        : {$arrayElemAt: ['$component', 0]},
                    quantityComponent: '$components.quantity',
                    infoComponent    : '$components.info',
                    isComponent      : 1,
                    quantity         : 1,
                    description      : 1,
                    components       : 1,
                    name             : 1,
                    product          : '$product.name',
                    productId        : '$product._id',
                    routing          : '$routing.name'
                }
            },
            {
                $group: {
                    _id       : '$_id',
                    components: {
                        $push: {
                            component  : '$component.name',
                            componentId: '$component._id',
                            quantity   : '$quantityComponent',
                            info       : '$infoComponent'
                        }
                    },

                    product    : {$first: '$product'},
                    productId  : {$first: '$productId'},
                    routing    : {$first: '$routing'},
                    isComponent: {$first: '$isComponent'},
                    quantity   : {$first: '$quantity'},
                    description: {$first: '$description'},
                    name       : {$first: '$name'}
                }
            }
        ];

        BillOfMaterials.aggregate(pipelines).exec(function (err, _billOfMaterials) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: _billOfMaterials[0]});
        });
    };

    this.update = function (req, res, next) {
        var db = req.session.lastDb;
        var BillOfMaterials = models.get(db, 'billOfMaterials', BillOfMaterialsSchema);
        var id = req.params.id;
        var body = req.body;

        BillOfMaterials.findByIdAndUpdate(id, body, function (err, model) {
            if (err) {
                return next(err);
            }
            res.status(200).send(model);
        });
    };

    this.getByProductId = function (req, res, next) {
        var db = req.session.lastDb;
        var BillOfMaterials = models.get(db, 'billOfMaterials', BillOfMaterialsSchema);
        var id = req.query._id;
        var warehouse = req.query.warehouse;
        var err;

        if (!warehouse) {
            err = new Error();

            err.message = 'No warehouse was found';

            return next(err);
        }

        BillOfMaterials.aggregate([
            {
                $match: {
                    product: objectId(id)
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
                    from        : 'routing',
                    localField  : 'routing',
                    foreignField: '_id',
                    as          : 'routing'
                }
            }, {
                $unwind: {
                    path                      : '$components',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $lookup: {
                    from        : 'productsAvailability',
                    localField  : 'components.component',
                    foreignField: 'product',
                    as          : 'components.availability'
                }
            }, {
                $project: {
                    components: {
                        component   : 1,
                        quantity    : 1,
                        info        : 1,
                        availability: {
                            $filter: {
                                input: '$components.availability',
                                as   : 'item',
                                cond : {$eq: ['$$item.warehouse', objectId(warehouse)]}
                            }
                        }
                    },

                    creationDate: 1,
                    description : 1,
                    isComponent : 1,
                    name        : 1,
                    product     : 1,
                    quantity    : 1,
                    routing     : 1
                }
            }, {
                $lookup: {
                    from        : 'Products',
                    localField  : 'components.component',
                    foreignField: '_id',
                    as          : 'component'
                }
            }, {
                $project: {
                    component           : {$arrayElemAt: ['$component', 0]},
                    product             : {$arrayElemAt: ['$product', 0]},
                    routing             : {$arrayElemAt: ['$routing', 0]},
                    availabilityQuantity: {$sum: '$components.availability.onHand'},
                    quantityComponent   : '$components.quantity',
                    infoComponent       : '$components.info',
                    _id                 : 1,
                    quantity            : 1,
                    isComponent         : 1,
                    description         : 1,
                    name                : 1
                }
            }, {
                $group: {
                    _id       : '$_id',
                    components: {
                        $push: {
                            orderRow : '$orderRow',
                            component: '$component',
                            quantity : '$quantityComponent',
                            info     : '$infoComponent',
                            onHand   : {$sum: '$availabilityQuantity'}
                        }
                    },

                    product    : {$first: '$product'},
                    routing    : {$first: '$routing'},
                    isComponent: {$first: '$isComponent'},
                    quantity   : {$first: '$quantity'},
                    description: {$first: '$description'},
                    name       : {$first: '$name'}
                }
            }
        ]).exec(function (err, _billOfMaterials) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: _billOfMaterials});
        });
    };

    this.delete = function (req, res, next) {
        var body = req.body || {ids: []};
        var db = req.session.lastDb;
        var ids = body.ids;

        async.each(ids, function (id, eachCb) {
            remove(db, id, function (err) {
                if (err) {
                    return eachCb(err);
                }

                eachCb(null);
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Removed success'});
        });
    };

    function remove(dbName, id, callback) {
        var BillOfMaterials = models.get(dbName, 'billOfMaterials', BillOfMaterialsSchema);
        var options = {
            _id: id
        };

        BillOfMaterials.findOneAndRemove(options, function (err, result) {
            if (err) {
                return callback(err);
            }

            callback(null);
        });
    }

};

module.exports = Module;
