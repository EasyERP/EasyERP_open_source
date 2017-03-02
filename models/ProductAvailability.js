module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var AvailabilitySchema = mongoose.Schema({
        product      : {type: ObjectId, ref: 'Product', default: null},
        warehouse    : {type: ObjectId, ref: 'warehouse', default: null},
        location     : {type: ObjectId, ref: 'location', default: null},
        goodsInNote  : {type: ObjectId, ref: 'goodsInNotes', default: null},
        cost         : {type: Number, default: 0},
        onHand       : {type: Number, default: 0},
        goodsOutNotes: [{
            goodsNoteId: {type: ObjectId, ref: 'goodsOutNotes', default: null},
            quantity   : {type: Number, default: 0}
        }],

        isJob    : {type: Boolean, default: false},
        orderRows: [{
            orderRowId: {type: ObjectId, ref: 'orderRows', default: null},
            quantity  : {type: Number, default: 0}
        }],

        creationDate: {type: Date, default: Date.now},
        archived    : {type: Boolean, default: false}
    }, {collection: 'productsAvailability'});

    mongoose.model('productsAvailability', AvailabilitySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.productsAvailability = AvailabilitySchema;
})();
