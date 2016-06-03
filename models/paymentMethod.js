module.exports = (function () {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var paymentSchema = new Schema({
        name    : {type: String},
        account : {type: String},
        currency: {type: String},
        bank    : {type: String},
        owner   : {type: String, default: ''}
    }, {collection: 'PaymentMethod'});

    mongoose.model('PaymentMethod', paymentSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.PaymentMethod = paymentSchema;
})();
