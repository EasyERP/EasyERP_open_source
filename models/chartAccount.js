/**
 * Created by lilya on 27/11/15.
 */

module.exports = (function () {

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var chartAccountSchema = mongoose.Schema({

        code     : {type: Number},
        account  : {type: String, default: ""},
        name     : {type: String, default: ""},
        type     : {type: String, default: ""},
        payMethod: {type: ObjectId, ref: 'PaymentMethod', default: null},
        editedBy : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date}
        },
        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        accountType: {type: String, enum: ['Debit', 'Credit'], default: "Debit"}

    }, {collection: 'chartOfAccount'});

    mongoose.model('chartOfAccount', chartAccountSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['chartOfAccount'] = chartAccountSchema;
})();