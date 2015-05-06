/**
 * Created by Roman on 04.05.2015.
 */

/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');
var Customers = function (models) {
    var access = require("../Modules/additions/access.js")(models);

    var CustomerSchema = mongoose.Schemas['Customer'];

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
};

module.exports = Customers;