module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var CustomDashboardSchema = mongoose.Schema({
        name        : {type: String, default: 'Dashboard'},
        recentDate  : {type: Date, default: Date.now},
        rows        : {type: Number, default: 4},
        columns     : {type: Number, default: 9},
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

        charts: [{type: ObjectId, ref: 'CustomChart'}]
    }, {collection: 'CustomDashboard'});

    mongoose.model('CustomDashboard', CustomDashboardSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.CustomDashboard = CustomDashboardSchema;
})();
