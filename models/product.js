module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var product = {
        _id     : {type: ObjectId},
        quantity: {type: Number, default: 0}
    };

    var productSchema = new mongoose.Schema({
        isBundle         : {type: Boolean, default: false},
        isVariant        : {type: Boolean, default: false},
        groupId          : {type: String, default: null},
        // wTrack           : {type: String, ref: 'wTrack', default: null},
        job              : {type: ObjectId, ref: 'jobs', default: null},
        canBeSold        : {type: Boolean, default: true},
        canBeExpensed    : {type: Boolean, default: true},
        eventSubscription: {type: Boolean, default: true},
        canBePurchased   : {type: Boolean, default: true},
        sourceDocument   : {type: ObjectId, ref: 'ProductImages', default: null},
        imageSrc         : {
            type   : ObjectId,
            ref    : 'Images',
            default: null
        },

        //bundlesProducts: {type: Array, default: []},

        name: {type: String, default: ''},

        info: {
            productType: {type: ObjectId, ref: 'productTypes', default: null},
            isActive   : {type: Boolean, default: true},
            barcode    : {type: String, default: ''},
            description: {type: String, default: ''},
            brand      : {type: ObjectId, ref: 'Brand', default: null},
            categories : [{type: ObjectId, ref: 'ProductCategory'}],
            SKU        : {type: String, default: null},
            UPC        : {type: String, default: null},
            ISBN       : {type: String, default: null},
            EAN        : {type: String, default: null}
        },

        inventory: {
            weight: {type: Number, default: 0},

            size: {
                length   : {type: Number, default: 0},
                width    : {type: Number, default: 0},
                height   : {type: Number, default: 0},
                dimension: {type: String, default: 'cm'}
            },

            warehouseMsg : {type: String, default: ''},
            minStockLevel: {type: Number, default: 0}
        },

        variants: [{type: ObjectId, ref: 'ProductOptionsValues', default: null}],

        bundles: [product],

        workflow: {type: ObjectId, ref: 'workflows', default: null},
        whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},

        groups: {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },

        creationDate: {type: Date, default: Date.now},

        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        externalId: {type: String, default: ''},

        attachments: {type: Array, default: []},

        ID: Number
    }, {collection: 'Products'});

    mongoose.model('Product', productSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Products = productSchema;
})();
