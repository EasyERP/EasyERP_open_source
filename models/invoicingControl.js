/**
 * Created by Roman on 13.05.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');

    var InvoicingControlSchema = mongoose.Schema({
        name: String
    }, { collection: 'invoiceControl' });

    mongoose.model('InvoicingControl', InvoicingControlSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['InvoicingControl'] = InvoicingControlSchema;
})();