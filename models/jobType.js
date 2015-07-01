/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var jobTypeSchema = mongoose.Schema({
        _id: String,
        neme: String

    }, { collection: 'jobType' });

    mongoose.model('jobType', jobTypeSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['jobType'] = jobTypeSchema;
})();