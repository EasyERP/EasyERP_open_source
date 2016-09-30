module.exports = (function () {
    var mongoose = require('mongoose');

    var DeliverToSchema = mongoose.Schema({
        code: String,
        name: String
    }, {collection: 'deliverTo'});

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.model('DeliverTo', DeliverToSchema);
    mongoose.Schemas.DeliverTo = DeliverToSchema;
})();

