module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var importSchema = new mongoose.Schema({
        user     : {type: ObjectId, default: null, ref: 'Users'},
        date     : {type: Date, default: Date.now},
        result   : JSON,
        fileName : {type: String, default: ''},
        timeStamp: {type: Number}
    }, {collection: 'Imports'});

    mongoose.model('Import', importSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Imports = importSchema;
})();
