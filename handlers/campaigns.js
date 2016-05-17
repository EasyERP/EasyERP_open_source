/**
 * Created by liliy on 04.02.2016.
 */
var mongoose = require('mongoose');

var Campaigns = function (models) {
    'use strict';
    var campaignSchema = mongoose.Schemas.Campaign;


    this.getForDd = function (req, res, next) {
        var Campaigns = models.get(req.session.lastDb, 'campaigns', campaignSchema);

        Campaigns.find({}, function(err, result){
            if (err){
                return next(err);
            }

            res.status(200).send({data: result});
        });
    };
};

module.exports = Campaigns;