/**
 * Created by Roman on 21.05.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;


    var paymentSchema = new Schema({
        _id: String,
        neme: String
    }, {collection: 'PaymentMethod'});

    mongoose.model('PaymentMethod', paymentSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['PaymentMethod'] = paymentSchema;
})();