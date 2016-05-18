/**
 * Created by lilya on 10/11/15.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var PaymentTypeSchema = mongoose.Schema({
        name: String

    }, { collection: 'PaymentType' });

    mongoose.model('PaymentType', PaymentTypeSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['PaymentType'] = PaymentTypeSchema;
})();