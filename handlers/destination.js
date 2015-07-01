/**
 * Created by Roman on 13.05.2015.
 */
var mongoose = require('mongoose');
var Destination = function (models) {
    var access = require("../Modules/additions/access.js")(models);
    var DestinationSchema = mongoose.Schemas['Destination'];

    this.getForDd = function (req, res, next) {
        var Destination = models.get(req.session.lastDb, 'Destination', DestinationSchema);

        Destination.find(function (err, destinations) {
            if (err) {
               return next(err);
            }
            res.status(200).send({data: destinations})
        });
    };

};

module.exports = Destination;