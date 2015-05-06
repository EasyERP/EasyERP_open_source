/**
 * Created by Roman on 04.05.2015.
 */

var mongoose = require('mongoose');
var Quotation = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var QuotationSchema = mongoose.Schemas['Quotation'];

    this.create = function (req, res, next) {
        var Quotation =  models.get(req.session.lastDb, 'Quotation', QuotationSchema);
        var body = req.body;
        var quotation = new Quotation(body);

        quotation.save(function (err, product) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: product});
        });
    };

};

module.exports = Quotation;