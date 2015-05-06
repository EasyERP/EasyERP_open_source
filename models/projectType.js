/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');

    var projectTypeSchema = mongoose.Schema({
        _id: String,
        name: String
    }, { collection: 'projectType' });

    mongoose.model('projectType', projectTypeSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['projectType'] = projectTypeSchema;
})();