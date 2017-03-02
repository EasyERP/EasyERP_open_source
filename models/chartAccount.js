module.exports = (function () {

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var chartAccountSchema = mongoose.Schema({
        code      : {type: Number},
        account   : {type: String, default: ''},
        name      : {type: String, default: ''},
        subAccount: {type: ObjectId, ref: 'chartOfAccount', default: null},
        category  : {type: ObjectId, ref: 'accountsCategory', default: null},
        budgeted  : {type: Boolean, default: false},

        payMethod: {type: ObjectId, ref: 'PaymentMethod', default: null},

        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date}
        },

        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'chartOfAccount'});

    mongoose.model('chartOfAccount', chartAccountSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.chartOfAccount = chartAccountSchema;
})();
