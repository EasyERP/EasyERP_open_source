module.exports = (function () {
    var mongoose = require('mongoose');
    var magentoSchema = mongoose.Schema({
        oauthConsumerKey   : {type: String, default: ''},
        oauthConsumerSecret: {type: String, default: ''},
        oauthVerifier      : {type: String, default: ''},
        storeBaseUrl       : {type: String, default: ''}
    }, {collection: 'magentoConnections'});

    mongoose.model('magentoConnection', magentoSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.magentoConnections = magentoSchema;
})();