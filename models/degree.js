module.exports = (function () {
    var mongoose = require('mongoose');
    var degreesSchema = mongoose.Schema({
        _id : {type: String, default: ''},
        name: {type: String, default: ''}
    }, {collection: 'Degrees'});

    mongoose.model('Degrees', degreesSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Degree = degreesSchema;
})();
