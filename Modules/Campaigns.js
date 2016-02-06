//var Campaigns = function (models) {
//    var mongoose = require('mongoose');
//    var logWriter = require('../helpers/logWriter.js');
//    var campaignSchema = mongoose.Schemas['Campaign'];
//
//    function getForDd (req, response) {
//        var res = {};
//        res['data'] = [];
//        var query = models.get(req.session.lastDb, 'campaigns', campaignSchema).find({});
//        query.exec(function (err, campaigns) {
//            if (err) {
//                logWriter.log("Sources.js getForDd find " + err);
//                response.send(500, {error: "Can't find Sources"});
//            } else {
//
//                res['data'] = campaigns;
//                response.send(res);
//            }
//        });
//    };
//
//
//    return {
//        getForDd: getForDd
//    };
//};
//module.exports = Campaigns;
