module.exports = (function () {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var paymentSchema = new Schema({
        name        : {type: String},
        account     : {type: String},
        chartAccount: {type: ObjectId, ref: 'chartOfAccount', default: null},
        currency    : {type: String},
        bank        : {type: String},
        owner       : {type: String, default: ''},
        fullName    : {type: String, default: ''},
        address     : {type: String, default: ''},
        swiftCode   : {type: String, default: ''}
    }, {collection: 'PaymentMethod'});

    mongoose.model('PaymentMethod', paymentSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.PaymentMethod = paymentSchema;
})();
