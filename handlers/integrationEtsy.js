var _ = require('lodash');
var crypto = require('crypto');

var Module = function (models) {
    var oauth = require('../helpers/oauthTracker')(models);

    this.getShippingMethodsForDd = function (req, res, next) {
        var db = req.session.lastDb;
        var channel = req.query.channel;
        var IntegrationService = require('../services/integration')(models);

        IntegrationService.findOne({
            _id: channel
        }, {
            dbName: db
        }, function (err, response) {

            if (err) {
                return next(err);
            }
            oauth.get({
                uri: '/users/__SELF__/shipping/templates'
            }, response, function (err, data) {
                var results = data ? data.results : [];

                if (err) {
                    return next(err);
                }

                results = results.map(function (elem) {
                    return {
                        _id : elem.shipping_template_id,
                        name: elem.title
                    };
                });

                res.status(200).send({data: results});
            });
        });

    };
};

module.exports = Module;
