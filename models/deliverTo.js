/**
 * Created by Roman on 14.05.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');

    var DeliverToSchema = mongoose.Schema({
        code: String,
        name: String
    }, { collection: 'deliverTo' });

    mongoose.model('DeliverTo', DeliverToSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['DeliverTo'] = DeliverToSchema;
})();