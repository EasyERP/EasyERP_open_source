module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var CategorySchema = mongoose.Schema({
        name     : {type: String, default: 'All'},
        fullName : {type: String, default: 'All'},
        parent   : {type: ObjectId, ref: 'ProductCategory', default: null},
        child    : [{type: ObjectId, default: null}],
        users    : [{type: ObjectId, ref: 'Users', default: null}],
        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        channel            : {type: ObjectId, ref: 'integrations', default: null},
        integrationId      : {type: String, default: ''},
        nestingLevel       : {type: Number, default: 0},
        sequence           : {type: Number, default: 0},
        main               : {type: Boolean, default: false},
        taxesAccount       : {type: ObjectId, ref: 'chartOfAccount', default: null},
        debitAccount       : {type: ObjectId, ref: 'chartOfAccount', default: null},
        creditAccount      : {type: ObjectId, ref: 'chartOfAccount', default: null},
        bankExpensesAccount: {type: ObjectId, ref: 'chartOfAccount', default: null},
        otherIncome        : {type: ObjectId, ref: 'chartOfAccount', default: null},
        otherLoss          : {type: ObjectId, ref: 'chartOfAccount', default: null}
    }, {collection: 'ProductCategories'});

    mongoose.model('ProductCategory', CategorySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.ProductCategory = CategorySchema;
})();
