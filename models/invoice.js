/**
 * Created by ANDREY on 29.04.2015.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var invoiceSchema = new mongoose.Schema({

        customerInvoice: { type: ObjectId, ref: 'Customers', default: null },
        fiscalPosition: { type: String, default: null },
        sourceDocument: { type: String, default: null },
        customerInvoiceNumber: { type: String, default: null },
        paymentReference: { type: String, default: null },

        invoiceDate: { type: Date, default: Date.now },
        dueDate: { type: Date, default: Date.now },
        account: { type: String, default: null },
        journal: { type: String, default: null }

    }, { collection: 'Invoice' });

    mongoose.model('Invoice', invoiceSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Invoice'] = invoiceSchema;
})();