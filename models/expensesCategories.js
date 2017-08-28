module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var CategorySchema = mongoose.Schema({
        name     : {type: String, default: 'All'},
        fullName : {type: String, default: 'All'},
        parent   : {type: ObjectId, ref: 'expensesCategory', default: null},
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

        account      : {type: ObjectId, ref: 'chartOfAccount', default: null},
        nestingLevel : {type: Number, default: 0},
        sequence     : {type: Number, default: 0},
        main         : {type: Boolean, default: false},
        removable    : {type: Boolean, default: true},
        productsCount: {type: Number, default: 0},
        classIcon    : {type: String, default: ''}
    }, {collection: 'expensesCategories'});

    mongoose.model('expensesCategory', CategorySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.expensesCategory = CategorySchema;
})();

