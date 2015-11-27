/**
 * Created by lilya on 27/11/15.
 */
var mongoose = require('mongoose');
var chartOfAccountSchema = mongoose.Schemas['chartOfAccount'];

var _ = require('../node_modules/underscore');
var Chart = function (models) {

    this.getForView = function (req, res, next) {
        var Model = models.get(req.session.lastDb, 'chartOfAccount', chartOfAccountSchema);

        Model.find({}, function(err, result){
            if (err){
                return next(err);
            }

            res.status(200).send(result);
        });
    };
};

module.exports = Chart;
