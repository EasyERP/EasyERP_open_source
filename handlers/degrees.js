/**
 * Created by liliy on 04.02.2016.
 */
var mongoose = require('mongoose');

var Degrees = function (models) {
    'use strict';
    var degreesSchema = mongoose.Schemas.Degree;

    this.create = function (req, res, next) {
        var Degree = models.get(req.session.lastDb, "Degrees", degreesSchema);
        var body = req.body;
        var degree;

        if (!body.name) {
            return res.status(404).send();
        }

        Degree.find({_id: body.name}, function (err, result) {
            if (err) {
                return next(err);
            }

            if (result.length) {
                res.status(404).send();
            } else {
                body._id = body.name;
                degree = new Degree(body);

                degree.save(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(201).send({success: 'A new Degree create success', id: result._id});
                });
            }
        });
    };

    this.getDegrees = function (req, res, next) {
        var Degree = models.get(req.session.lastDb, "Degrees", degreesSchema);

        Degree.find({}).sort({name: 1}).exec(function(err, result){
            if (err){
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };

    this.update = function (req, res, next) {
        var Degree = models.get(req.session.lastDb, "Degrees", degreesSchema);
        var data = req.body;
        var id = req.params.id;

        delete data._id;

        Degree.update({_id: id}, data, function (err){
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Degree updated'});
        });

    };

    this.remove = function (req, res, next) {
        var Degree = models.get(req.session.lastDb, "Degrees", degreesSchema);
        var id = req.params.id;

        Degree.remove({_id: id}, function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send({success: 'Degree removed'});
        });
    };

};

module.exports = Degrees;