module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var channelLinksSchema = new mongoose.Schema({
        product     : {type: ObjectId, ref: 'Product', default: null},
        linkId      : {type: String, default: null},
        channel     : {type: ObjectId, ref: 'integrations', default: null},
        priceList   : {type: ObjectId, ref: 'PriceList', default: null},
        creationDate: {type: Date, default: Date.now}
    }, {collection: 'channelLinks'});

    mongoose.model('channelLinks', channelLinksSchema);
    mongoose.Schemas.channelLinks = channelLinksSchema;
})();
