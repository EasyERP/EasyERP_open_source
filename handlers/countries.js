var mongoose = require('mongoose');

var Countries = function (models) {
    var countriesSchema = mongoose.Schemas.countries;

    this.getForDd = function (req, res, next) {
        var query = models.get(req.session.lastDb, 'countries', countriesSchema).find();

        query
            .select('_id name code')
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    };
};

module.exports = Countries;
