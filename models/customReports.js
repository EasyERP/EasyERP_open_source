module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var CustomReportsSchema = mongoose.Schema({
        name        : {type: String, default: 'Report'},
        recentDate  : {type: Date, default: Date.now},
        description : {type: String},
        publicAccess: {type: Boolean, default: true},
        createdBy   : {
            date: {type: Date, default: Date.now},
            user: {type: ObjectId, ref: 'Users', default: null}
        },

        editedBy: {
            date: {type: Date, default: Date.now},
            user: {type: ObjectId, ref: 'Users', default: null}
        },

        dateRange: {
            from: {type: Date, default: Date.now},
            to  : {type: Date, default: Date.now}
        },

        reportType    : {type: String, default: ''},
        reportCategory: {type: String, default: ''},

        columnOrder: [{type: Number}],

        rows: [{
            type: 'String'
        }]
    }, {collection: 'CustomReport'});

    mongoose.model('CustomReport', CustomReportsSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.CustomReports = CustomReportsSchema;
})();
