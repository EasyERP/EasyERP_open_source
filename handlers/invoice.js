/**
 * Created by ANDREY on 29.04.2015.
 */

var mongoose = require('mongoose');
var Invoice = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var InvoiceSchema = mongoose.Schemas['Invoice'];

    this.create = function (req, res, next) {
        var Invoice =  models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var body = req.body;
        var invoice = new Invoice(body);

        invoice.save(function (err, invoice) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: invoice});
        });
    };

    this.getAll = function (req, res, next) {
        var Invoice =  models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var query = {};

        Invoice.find(query, function (err, invoice) {
            if (err) {
                return next(err);
            }
            res.status(200).send({success: invoice});
        });
    };

    this.getForView = function (req, response) {

        var res = {};
        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        };

        var count = req.query.count ? req.query.count : 50;
        var page = req.query.page;
        var skip = (page-1)>0 ? (page-1)*count : 0;

        var query = models.get(req.session.lastDb, "Invoice", InvoiceSchema).find();

        if (data.sort) {
            query.sort(data.sort)
        };

        if (data && data.filter && data.filter.workflow) {
            data.filter.workflow = data.filter.workflow.map(function (item) {
                return item === "null" ? null : item;
            });

            if (data && data.filter && data.filter.workflow) {
                query.where('workflow').in(data.filter.workflow);
            } else if (data && (!data.newCollection || data.newCollection === 'false')) {
                query.where('workflow').in([]);
            }
        }

        if (data && data.filter && data.filter.workflow) {
            query.where('workflow').in(data.filter.workflow);
        } else if (data && (!data.newCollection || data.newCollection === 'false')) {
            query.where('workflow').in([]);
        }
        query.populate('customerInvoice', 'name');

        query.skip(skip).limit(count).exec(function (error, _res) {
                if (error) {
                    response.send(500, {error: "Can't find Invoice"});
                }
            response.status(200).send({success: _res});
        });
            }

    this.getInvoiceById = function (req, res/*, data*/) {
        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
         }

        /*if (req.session && req.session.loggedIn && req.session.lastDb) {
            access.getReadAccess(req, req.session.uId, 56, function (access) {
                if (access) {
                    getById(req, data.id, res);
                } else {
                    res.send(403);
                }
            });

        } else {
            res.send(401);
        }*/
        getById(req, data.id, res);
    };

    function getById (req, id, response) {
        var query = models.get(req.session.lastDb, "Invoice", InvoiceSchema).findById(id);
        query.populate('customerInvoice','name');

        query.exec(function (err, result) {
            if (err) {
                console.log(err)
            } else {
                response.send(result);
            }
        });
    };

    this.removeInvoice = function(req, res, id) {

        models.get(req.session.lastDb, "Invoice", InvoiceSchema).findByIdAndRemove(id, function (err, result) {
            if (err) {
                console.log(err);
                res.send(500, {error: "Can't remove Invoice"});
            } else {
                //if (result && result.isOpportunitie) {
                //    event.emit('updateSequence', models.get(req.session.lastDb, "Opportunities", opportunitiesSchema), "sequence", result.sequence, 0, result.workflow, result.workflow, false, true);
                //}
                res.send(200, {success: 'Invoice removed'});
            }
        });
    };

    this.totalCollectionLength = function (req, response, next) {
        var res = {};
        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }
        res['showMore'] = false;

        var optionsObject = {};

        var Invoice =  models.get(req.session.lastDb, 'Invoice', InvoiceSchema);
        var query = optionsObject;
        var count = req.query.count ? req.query.count : 50;
        var page = req.query.page;
        var skip = (page-1)>0 ? (page-1)*count : 0;

        Invoice.find(query).limit(count).skip(skip).exec(function (err, invoice) {
            if (err) {
                return next(err);
            }

            res['count'] = invoice.length;
            response.status(200).send(res);
        });
    };

};

module.exports = Invoice;