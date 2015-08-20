/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');

var Customers = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var CustomerSchema = mongoose.Schemas['Customer'];

    var _ = require('../node_modules/underscore');

    var CONSTANTS = require('../constants/mainConstants');

    this.getSuppliersForDD = function (req, res, next) {
        var query = models.get(req.session.lastDb, 'Customers', CustomerSchema).find();

        query.select('_id name ');
        query.where({'salesPurchases.isSupplier': true});
        query.sort({'name': 1});
        query.exec(function (err, suppliers) {
            if (err) {
                next(err);
            } else {
                res.status(200).send({data: suppliers});
            }
        });
    };

    this.getFilterValues = function (req, res, next) {
        var opportunity = models.get(req.session.lastDb, 'Customers', CustomerSchema);

        opportunity.aggregate([
            {
                $group: {
                    _id: null,
                    name: {
                        $addToSet: {
                            name: '$name.first',
                            _id: '$_id'
                        }
                    },
                    country: {
                        $addToSet: '$address.country'
                    }
                }
            }
        ], function (err, result) {
            if (err) {
                return next(err);
            }
            _.map(result[0], function (value, key) {
                switch (key) {
                    case 'name':
                        result[0][key] = {
                            displayName: 'Name',
                            values: _.sortBy(value, 'name')
                        };
                        break;
                    case  'country':
                        result[0][key] = {
                            displayName: 'Country',
                            values: _.sortBy(value, function (num) {
                                return num
                            })
                        };
                        break;
                }
            });

            result[0]['services'] = {
                displayName: 'Services',
                values: [{displayName: 'Supplier', _id: 'isSupplier'}, {displayName: 'Customer', _id: 'isCustomer'}]
            };

            res.status(200).send(result);
        });
    };

    this.getAll = function (req, res, next) {

        /**
         * @api {get} /customers/:id Request User information
         * @apiName GetUser
         * @apiGroup User
         *
         * @apiParam {Number} id Users unique ID.
         *
         * @apiSuccess {String} firstname Firstname of the User.
         * @apiSuccess {String} lastname  Lastname of the User.
         */
        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var query = req.query;
        var type = query.type || 'Person';
        var count = query.count || CONSTANTS.MOBILE_DEFAULT_COUNT_PER_LIST;
        var page = query.page || 1;
        var queryObject = {};

        var skip = (page - 1) * count;

        queryObject.type = type;

        access.getReadAccess(req, req.session.uId, 50, function (access) {
            if (access) {
                Model
                    .find(queryObject)
                    .skip(skip)
                    .limit(count)
                    .populate('company')
                    .populate('department')
                    .populate('salesPurchases.salesPerson', '_id name')
                    .populate('salesPurchases.salesTeam', '_id departmentName')
                    .populate('createdBy.user', 'login')
                    .populate('editedBy.user', 'login')
                    .exec(function (err, customers) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(customers);
                    });
            } else {
                res.send(403);
            }
        });
    };

    this.getById = function (req, res, next) {

        var Model = models.get(req.session.lastDb, 'Customers', CustomerSchema);
        var id = req.params.id;

        access.getReadAccess(req, req.session.uId, 50, function (access) {
            if (access) {
                Model
                    .findById(id)
                    .populate('company')
                    .populate('department')
                    .populate('salesPurchases.salesPerson', '_id name')
                    .populate('salesPurchases.salesTeam', '_id departmentName')
                    .populate('createdBy.user', 'login')
                    .populate('editedBy.user', 'login')
                    .exec(function (err, customer) {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(customer);
                    });
            } else {
                res.send(403);
            }
        });
    };


};

module.exports = Customers;