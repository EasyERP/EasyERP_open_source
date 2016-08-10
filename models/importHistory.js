module.exports = (function () {
    var mongoose = require('mongoose');

    var importHistorySchema = mongoose.Schema({
        date: {
            type: Date,
            default: Date.now
        },

        fileName: {
            type: String,
            default: ''
        },

        userName: {
            type: String,
            default: ''
        },

        type: {
            type: String,
            default: ''
        },

        status: {
            type: String,
            default: ''
        },

        reportFile: {
            type: String,
            default: ''
        }
    }, {collection: 'importHistory'});

    mongoose.model('importHistory', importHistorySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.importHistorySchema = importHistorySchema;
})();