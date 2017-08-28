module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var billOfMaterialSchema = mongoose.Schema({
        name   : {type: String, unique: true, default: 'BM'},
        product: {type: ObjectId, ref: 'Product', default: null},

        routing: {type: ObjectId, ref: 'routing', default: null},

        isComponent: {
            type: Boolean, default: false
        },

        quantity: {
            type: Number, default: 0
        },

        description: {type: String, default: ''},

        components: [
            {
                component: {type: ObjectId, ref: 'Product', default: null},
                quantity : {type: Number, default: 0},
                info     : {type: String, default: ''}
            }
        ],

        creationDate: {type: Date, default: Date.now}

    }, {collection: 'billsOfMaterials'});

    mongoose.model('billOfMaterials', billOfMaterialSchema);

    function setName(next) {
        var quotation = this;
        var db = quotation.db.db;
        var prefix = 'BM';

        db.collection('settings').findOneAndUpdate({
            dbName: db.databaseName,
            name  : prefix
        }, {
            $inc: {seq: 1}
        }, {
            returnOriginal: false,
            upsert        : true
        }, function (err, rate) {
            if (err) {
                return next(err);
            }

            quotation.name = prefix + '_' + rate.value.seq;

            next();
        });
    }

    billOfMaterialSchema.pre('save', setName);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.billOfMaterialSchema = billOfMaterialSchema;
})();
