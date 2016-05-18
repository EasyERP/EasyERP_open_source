var mongoose = require('mongoose');

var Currency = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var CurrencySchema = mongoose.Schemas['Currency'];

    this.getForDd = function (req, res, next) {
        if (req.session && req.session.loggedIn && req.session.lastDb) {
            var query = models.get(req.session.lastDb, 'currency', CurrencySchema).find();

            query.select('_id name sequence');
            query.sort({'sequence': 1});
            query.exec(function (err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).send({data: result});
            });
        } else {
            res.status(401).send();
        }
    };
};

module.exports = Currency;