module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var goodsOutNoteSchema = new mongoose.Schema({
        warehouse  : {type: ObjectId, ref: 'warehouse', default: null},
        releaseDate : Date,
        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        salesOrderRowId  : [{type: ObjectId, ref: 'orderRows', default: null}],
        quantity  : Number,
        name: {type: String, default: ''}
    }, {collection: 'GoodsOutNote'});

    mongoose.model('GoodsOutNote', goodsOutNoteSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.GoodsOutNote = goodsOutNoteSchema;
})();
