module.exports = (function () {
    var mongoose = require('mongoose');

    var scheduledPaySchema = mongoose.Schema({
        name: {type: String, default: ''}
    }, {collection: 'scheduledPays'});

    mongoose.model('scheduledPay', scheduledPaySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.scheduledPay = scheduledPaySchema;
})();
