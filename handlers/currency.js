var mongoose = require('mongoose');

var Currency = function (models) {
    var CurrencySchema = mongoose.Schemas.Currency;

    this.getForDd = function (req, res, next) {
        var query = models.get(req.session.lastDb, 'currency', CurrencySchema).find();

        query
            .select('_id name sequence')
            .sort({sequence: 1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
    };
};

module.exports = Currency;
