module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var CustomChartSchema = mongoose.Schema({
        name       : {type: String, default: 'empty'},
        dataHeight : {type: Number},
        dataWidth  : {type: Number},
        indexY     : {type: Number},
        indexX     : {type: Number},
        nameId     : {type: String},
        type       : {type: String},
        dataset    : {type: String},
        forSales   : {type: Boolean},
        colorScheme: {type: String},
        dashboard  : {type: ObjectId, ref: 'CustomDashboard'},
        startDate  : {type: String},
        endDate    : {type: String}
    }, {collection: 'CustomChart'});

    mongoose.model('CustomChart', CustomChartSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.CustomChart = CustomChartSchema;
})();
