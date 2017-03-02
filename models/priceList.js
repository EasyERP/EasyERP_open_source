module.exports = (function () {
    var mongoose = require('mongoose');

    var priceListsSchema = new mongoose.Schema({
        priceListCode: {type: String, default: null},
        name         : {type: 'String', default: null},
        currency     : {type: String, ref: 'currency', default: null},
        cost         : {type: Boolean, default: false}
    }, {collection: 'PriceLists'});

    mongoose.model('PriceList', priceListsSchema);
    mongoose.Schemas.PriceLists = priceListsSchema;
})();
