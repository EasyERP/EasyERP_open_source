var mongoose = require('mongoose');

var Module = function (models) {
    var accountTypesSchema = mongoose.Schemas.accountTypes;

    this.getForDd = function (req, res, next) {
        var query = models.get(req.session.lastDb, 'accountTypes', accountTypesSchema).find();

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

module.exports = Module;
