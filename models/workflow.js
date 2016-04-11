/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var workflowSchema = mongoose.Schema({
        wId: String,
        wName: String,
        status: String,
        name: String,
        sequence: Number,
        visible: {type: Boolean, default: true}
    }, {collection: 'workflows'});

    mongoose.model('workflows', workflowSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['workflow'] = workflowSchema;
})();