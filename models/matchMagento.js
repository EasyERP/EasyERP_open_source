module.exports = (function () {
    var mongoose = require('mongoose');

    var matchSchema = mongoose.Schema({
        entity: {type: String, default: ''},
        type  : {type: String, default: ''},
        fields: {type: JSON, default: {}}
    }, {collection: 'matchMagento'});

    mongoose.model('matchMagento', matchSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.matchMagento = matchSchema;
})();
