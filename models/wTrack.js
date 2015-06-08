/**
 * Created by Roman on 05.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');

    var wTrackSchema = mongoose.Schema({
        ID: Number,
        project: { type: ObjectId, ref: 'Project', default: null },
        customer: { type: ObjectId, ref: 'Customers', default: null },
        employee: { type: ObjectId, ref: 'Employees', default: null },
        department: { type: ObjectId, ref: 'Department', default: null },
        year: Number,
        month: Number,
        week: Number,
        1: Number,
        2: Number,
        3: Number,
        4: Number,
        5: Number,
        6: Number,
        7: Number,
        worked: Number,
        rate: Number,
        revenue: Number,
        cost: Number,
        order: { type: ObjectId, ref: 'Quotation', default: null }
    }, {collection: 'wTrack'});

    mongoose.model('wTrack', wTrackSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['wTrack'] = wTrackSchema;
})();