module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var zonesSchema = new mongoose.Schema({
        name     : {type: String, default: ''},
        warehouse: {type: ObjectId, ref: 'warehouse', default: null},
        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'zones'});

    mongoose.model('zone', zonesSchema);
    mongoose.Schemas.zones = zonesSchema;
})();
