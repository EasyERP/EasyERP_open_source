module.exports = (function () {
    var mongoose = require('mongoose');
    var degreesSchema = mongoose.Schema({
        _id : {type: String, default: ''},
        name: {type: String, default: ''}
    }, {collection: 'Degrees'});

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.model('Degrees', degreesSchema);
    mongoose.Schemas.Degree = degreesSchema;
})();
