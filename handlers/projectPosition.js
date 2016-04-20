var mongoose = require('mongoose');

var Currency = function (models) {
    var projectPositionSchema = mongoose.Schemas['projectPosition'];

    this.getForDd = function (req, res, next) {

        var query = models.get(req.session.lastDb, 'projectPosition', projectPositionSchema).find();

        query.select('_id name');
        query.sort({'name': 1});
        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }
            res.status(200).send({data: result});
        });
    }


};

module.exports = Currency;