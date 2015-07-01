var Source = function (models) {
    var mongoose = require('mongoose');
    var SourceSchema = mongoose.Schemas['source'];
    var logWriter = require('../helpers/logWriter.js');

    function getForDd(req, response) {
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, 'sources', SourceSchema).find({});
        query.exec(function (err, sources) {
            if (err) {
                logWriter.log("Sources.js getForDd find " + err);
                response.send(500, { error: "Can't find Sources" });
            } else {
                res['data'] = sources;
                response.send(res);
            }
        });
    };
    
    return {
        getForDd: getForDd
    };
};

module.exports = Source;
