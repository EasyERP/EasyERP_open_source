/**
 * Created by Roman on 04.05.2015.
 */

/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');
var Customers = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var _ = require('../node_modules/underscore');

    var CustomerSchema = mongoose.Schemas['Customer'];

    function BubbleSort(A) {
        var t;
        var n = A.length;
        for (var i = n; i--;) {
            for (var j = n-1; j--;) {
                if (A[j+1] < A[j]) {
                    t = A[j+1]; A[j+1] = A[j]; A[j] = t;
                }
            }
        }
        return A;
    };

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
                $group:{
                    _id: null,
                    name: {
                        $addToSet: '$name.first'
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
            _.map(result[0], function(value, key) {
                switch (key) {
                    case 'name':
                        result[0][key] = BubbleSort(value);
                        break;
                    case  'country':
                        result[0][key] = BubbleSort(value);
                        break;

                }
            });

            res.status(200).send(result);
        });
    }
};

module.exports = Customers;