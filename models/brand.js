module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var BrandSchema = mongoose.Schema({
        name        : {type: String, default: 'default'},
        creationDate: {type: Date, default: Date.now}
    }, {collection: 'Brand'});

    mongoose.model('Brand', BrandSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Brand = BrandSchema;
})();
