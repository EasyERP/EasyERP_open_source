module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var CategorySchema = mongoose.Schema({
        name: { type: String, default: 'All' },
        fullName: { type: String, default: 'All' },
        parent: { type: ObjectId, ref: 'ProductCategory', default: null },
        users: [{ type: ObjectId, ref: 'Users', default: null }],
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date }
        },
        nestingLevel: { type: Number, default: 0 },
        sequence: { type: Number, default: 0 }
    }, { collection: 'ProductCategories' });

    mongoose.model('ProductCategory', CategorySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['ProductCategory'] = CategorySchema;
})();