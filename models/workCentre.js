module.exports = (function () {
    var mongoose = require('mongoose');
    var workCentreSchema = mongoose.Schema({
        name       : {type: String, required: true},
        description: {type: String, default: ''},
        costPerHour: {type: Number, default: 0},
        code       : {type: String, default: ''}
    }, {collection: 'workCentres'});

    mongoose.model('workCentre', workCentreSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.workCentre = workCentreSchema;
})();
