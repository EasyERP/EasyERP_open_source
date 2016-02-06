//var Languages = function (models) {
//    var mongoose = require('mongoose');
//    var logWriter = require('../helpers/logWriter.js');
//    var LanguageSchema = mongoose.Schemas['language'];
//
//    function getForDd(req, response) {
//        var res = {};
//        res.data = [];
//        var query = models.get(req.session.lastDb, 'languages', LanguageSchema).find({});
//        query.exec(function (err, languages) {
//            if (err) {
//                console.log(err);
//                logWriter.log("Sources.js getForDd find " + err);
//                response.send(500, { error: "Can't find Language" });
//            } else {
//                res.data = languages;
//                response.send(res);
//            }
//        });
//    };
//
//    return {
//        getForDd: getForDd
//    };
//};
//
//module.exports = Languages;
