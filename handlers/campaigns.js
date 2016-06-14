var mongoose = require('mongoose');

var Module = function (models) {
    'use strict';
    var campaignSchema = mongoose.Schemas.Campaign;

    this.getForDd = function (req, res, next) {
        var Campaigns = models.get(req.session.lastDb, 'campaigns', campaignSchema);

        Campaigns.find({}, function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };
};

module.exports = Module;
