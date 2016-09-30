module.exports = (function () {
    var mongoose = require('mongoose');

    var CustomDashboardSchema = mongoose.Schema({
        name       : {type: String, default: 'empty'},
        created    : {type: Date, default: Date.now},
        rows       : {type: Number, default: 4},
        columns    : {type: Number, default: 9},
        description: {type: String},
        charts     : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref : 'CustomChart'
            }
        ]
    }, {collection: 'CustomDashboard'});

    mongoose.model('CustomDashboard', CustomDashboardSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.CustomDashboard = CustomDashboardSchema;
})();
