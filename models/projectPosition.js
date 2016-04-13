module.exports = (function () {
    var mongoose = require('mongoose');

    var projectPositionSchema = mongoose.Schema({
        name     : {type: String, default: ''}
    }, {collection: 'projectPositions'});

    mongoose.model('projectPosition', projectPositionSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['projectPosition'] = projectPositionSchema;
})();