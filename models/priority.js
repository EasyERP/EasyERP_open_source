/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');

    var prioritySchema = mongoose.Schema({
        _id: String,
        priority: String,
        type : String
    }, { collection: 'Priority' });

    mongoose.model('Priority', prioritySchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Priority'] = prioritySchema;
})();