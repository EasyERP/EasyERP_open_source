var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = (function () {
    var Integrations = mongoose.Schema({
        ordersDate : {type: Date, default: new Date(0)},
        channelName: {type: String, default: ''},
        dbName     : {type: String, default: ''},
        type       : {type: String, default: ''},
        user       : {type: ObjectId, default: null, ref: 'Users'},
        username   : {type: String, default: ''},
        password   : {type: String, default: ''},

        baseUrl          : {type: String, default: ''},
        warehouseSettings: {
            warehouse: {type: ObjectId, default: null, ref: 'warehouse'},
            location : {type: ObjectId, default: null, ref: 'location'}
        },

        updateShippingStatus: {type: Boolean, default: false},
        updateShippingMethod: {type: Boolean, default: false},
        active              : {type: Boolean, default: false},
        token               : {type: String, default: ''},
        secret              : {type: String, default: ''},
        consumerKey         : {type: String, default: ''},
        consumerSecret      : {type: String, default: ''},
        priceList           : {type: ObjectId, default: null, ref: 'PriceList'},
        bankAccount         : {type: ObjectId, default: null, ref: 'PaymentMethod'},
        shippingMethod      : {
            _id : {type: Number, default: 0},
            name: {type: String, default: ''}
        },

        connected   : {type: Boolean, default: true},
        version     : {type: String, default: ''},
        lastSync    : {type: Date},
        webhooks    : [{type: String}],
        sharedSecret: {type: String, default: ''}
    }, {collection: 'integrations'});

    mongoose.model('integrations', Integrations);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    Integrations.index({baseUrl: 1, channelName: 1}, {unique: true});

    mongoose.Schemas.integrations = Integrations;
})();
