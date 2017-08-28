module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var ManufacturingOrderSchema = mongoose.Schema({
        source        : {type: ObjectId, ref: 'manufacturingOrder', default: null},
        billOfMaterial: {type: ObjectId, ref: 'billOfMaterials', default: null},
        availability  : {type: String, enum: ['1', '2', '3'], default: '1'},
        responsible   : {type: ObjectId, ref: 'Employees', default: null},
        product       : {type: ObjectId, ref: 'Product', default: null},
        routing       : {type: ObjectId, ref: 'routing', default: null},
        //reference        : {type: ObjectId, /*ref: 'routing',*/ default: null}, // ?
        quantity      : {type: Number, default: 0},
        deadlineStart : {type: Date, default: Date.now},
        name          : {type: String, unique: true, default: 'MO'},
        warehouse     : {type: ObjectId, ref: 'warehouse', default: null},
        warehouseTo   : {type: ObjectId, ref: 'warehouse', default: null},
        workflow      : {type: ObjectId, ref: 'workflows', default: null},
        createdBy     : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        status: {
            allocateStatus: {type: String, default: 'NOR', enum: ['NOR', 'NOT', 'NOA', 'ALL']},
            fulfillStatus : {type: String, default: 'NOR', enum: ['NOR', 'NOT', 'NOA', 'ALL']},
            shippingStatus: {type: String, default: 'NOR', enum: ['NOR', 'NOT', 'NOA', 'ALL']}
        },

        editedBy: {
            user: {
                type: ObjectId,
                ref : 'Users', default: null
            },

            date: {type: Date, default: Date.now}
        }
    }, {collection: 'manufacturingOrder'});

    mongoose.model('manufacturingOrder', ManufacturingOrderSchema);

    function setName(next) {
        var quotation = this;
        var db = quotation.db.db;
        var prefix = 'MO';

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

    ManufacturingOrderSchema.pre('save', setName);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.manufacturingOrder = ManufacturingOrderSchema;
})();
