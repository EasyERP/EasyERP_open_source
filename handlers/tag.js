var mongoose = require('mongoose');
var Module = function (models) {
    'use strict';

    var TagsSchema = mongoose.Schemas.Tags;
    var OpportunitySchema = mongoose.Schemas.Opportunities;

    this.getForDd = function (req, res, next) {
        var Tag = models.get(req.session.lastDb, 'tags', TagsSchema);

        Tag
            .find()
            .sort({name: 1})
            .lean()
            .exec(function (err, terms) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: terms});
            });
    };

    function updateOpportunities (req, id){
        var Opportunity = models.get(req.session.lastDb, 'tags', OpportunitySchema);

        Opportunity.update({'tags' : id}, {$pull : {tags: id}}, function (err){
            if (err){
                console.log(err);
            }
        });
    }

    this.getForList = function (req, res, next) {
        var Tag = models.get(req.session.lastDb, 'tags', TagsSchema);

        var type = req.query.type;

        Tag
            .find({type : type})
            .sort({name: 1})
            .exec(function (err, methods) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(methods);
            });
    };

    this.update = function (req, res, next) {
        var Tag = models.get(req.session.lastDb, 'tags', TagsSchema);
        var body = req.body;
        var id = req.params.id;

        Tag.findByIdAndUpdate(id, body, {new: true}, function (err, method) {
            if (err) {
                return next(err);
            }

            res.status(200).send(method);
        });
    };

    this.create = function (req, res, next) {
        var Tag = models.get(req.session.lastDb, 'tags', TagsSchema);
        var body = req.body;

        var payment = new Tag(body);

        payment.save(function (err, method) {
            if (err) {
                return next(err);
            }

            res.status(200).send(method);
        });
    };

    this.remove = function (req, res, next) {
        var Tag = models.get(req.session.lastDb, 'tags', TagsSchema);
        var id = req.params.id;

        Tag.findByIdAndRemove(id, function (err, method) {
            if (err) {
                return next(err);
            }

            updateOpportunities(req, id);

            res.status(200).send(method);
        });
    };

};

module.exports = Module;
