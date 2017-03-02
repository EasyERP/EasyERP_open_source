module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var locationsSchema = new mongoose.Schema({
        name     : {type: String, default: ''},
        groupingA: {type: String, default: ''},
        groupingB: {type: String, default: ''},
        groupingC: {type: String, default: ''},
        groupingD: {type: String, default: ''},
        warehouse: {type: ObjectId, ref: 'warehouse', default: null},
        zone     : {type: ObjectId, ref: 'zone', default: null},
        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'locations'});

    mongoose.model('location', locationsSchema);
    mongoose.Schemas.locations = locationsSchema;
})();
