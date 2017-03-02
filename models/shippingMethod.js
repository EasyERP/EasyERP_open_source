module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var shippingMethodSchema = new mongoose.Schema({
        name     : {type: String, default: ''},
        code     : {type: String, default: ''},
        price    : {type: Number, default: 0},
        countries: [String],
        breaks   : [Number],
        breakType: {type: String, default: ''},
        account  : {type: ObjectId, ref: 'chartOfAccount', default: null}
    }, {collection: 'shippingMethod'});

    mongoose.model('shippingMethod', shippingMethodSchema);
    mongoose.Schemas.shippingMethod = shippingMethodSchema;
})();
