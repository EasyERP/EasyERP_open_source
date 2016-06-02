var mongoose = require('mongoose');
var chartOfAccountSchema = mongoose.Schemas.chartOfAccount;
var async = require('async');

var Chart = function (models) {
    var access = require('../Modules/additions/access.js')(models);

    this.create = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);
        var body = req.body;
        var newModel;

        if (!body.code || !body.account) {
            return res.status(400).send();
        }

        body.name = body.code + ' ' + body.account;
        newModel = new Model(body);

        newModel.save(function (err, model) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: model});
        });
    };

    this.getForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);
        var data = req.query;
        var sort = data.sort ? data.sort : {_id: 1};

        Model.find({}).sort(sort).exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.putchBulk = function (req, res, next) {
        var body = req.body;
        var uId;
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);

        async.each(body, function (data, cb) {
            var id = data._id;

            data.editedBy = {
                user: uId,
                date: new Date().toISOString()
            };
            delete data._id;
            //data.name = data.code + ' ' + data.account;

            Model.findByIdAndUpdate(id, {$set: data}, {new: true}, function (err, model) {
                if (err) {
                    return cb(err);
                }

                cb();
            });
        }, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'updated'});
        });
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);

        Model.findByIdAndRemove(id, function (err, removed) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: removed});
        });
    };

    this.getForDd = function (req, res, next) {
        var query;
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);

        query = Model.find();

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

};

module.exports = Chart;
