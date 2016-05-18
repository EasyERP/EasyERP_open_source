/**
 * Created by Roman on 13.05.2015.
 */
/**
 * Created by Roman on 13.05.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');

    var PaymentTermSchema = mongoose.Schema({
        name: String
    }, { collection: 'paymentTerms' });

    mongoose.model('PaymentTerm', PaymentTermSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['PaymentTerm'] = PaymentTermSchema;
})();