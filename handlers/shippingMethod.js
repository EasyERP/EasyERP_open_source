var ShippingMethod = function (models) {

    var shippingMethodService = require('../services/shippingMethod')(models);

    this.create = function (req, res, next) {
        var body = req.body;

        shippingMethodService.create({body: body, dbName: req.session.lastDb}, function (err, result) {
            if (err) {
                return next(err);
            }
            
            res.status(200).send(result);
        });

    };

    this.getAll = function (req, res, next) {
        var options = {};
        shippingMethodService.getForDd({dbName: req.session.lastDb, options: options}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.getForDd = function (req, res, next) {
        var options = {
            _id : 1,
            name: 1
        };
        shippingMethodService.getForDd({dbName: req.session.lastDb, options: options}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    };

    this.update = function (req, res, next) {
        var id = req.params.id;
        var body = req.body || {};

        shippingMethodService.update({id: id, body: body, dbName: req.session.lastDb}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;

        shippingMethodService.remove({id: id, dbName: req.session.lastDb}, function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send(result);
        });
    };
};

module.exports = ShippingMethod;
