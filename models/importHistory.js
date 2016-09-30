module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var importHistorySchema = mongoose.Schema({
        date: {
            type   : Date,
            default: Date.now
        },

        fileName: {
            type   : String,
            default: ''
        },

        filePath: {
            type   : String,
            default: ''
        },

        user: {
            type   : ObjectId,
            ref    : 'Users',
            default: null
        },

        type: {
            type   : String,
            default: ''
        },

        status: {
            type   : String,
            default: 'Finished'
        },

        reportFile: {
            type   : String,
            default: ''
        },

        reportFileName: {
            type   : String,
            default: ''
        }
    }, {collection: 'ImportHistories'});

    mongoose.model('ImportHistory', importHistorySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.ImportHistories = importHistorySchema;
})();
