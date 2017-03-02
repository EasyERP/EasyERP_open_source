module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var price = {
        _id  : false,
        count: {type: Number, default: 0},
        price: {type: Number, default: 0}
    };

    var productPricesSchema = new mongoose.Schema({
        priceLists: {type: ObjectId, ref: 'PriceList', default: null},
        product   : {type: ObjectId, ref: 'Product', default: null},
        prices    : [price]
    }, {collection: 'ProductPrices'});

    mongoose.model('ProductPrice', productPricesSchema);
    mongoose.Schemas.ProductPrices = productPricesSchema;
})();
