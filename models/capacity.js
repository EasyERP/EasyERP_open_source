module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var capacitySchema = new mongoose.Schema({
        ID           : Number,
        employee     : {
            _id : {type: ObjectId, ref: 'Employees', default: null},
            name: String
        },
        department   : {
            _id : {type: ObjectId, ref: 'Department', default: null},
            name: String
        },
        vacation     : {type: ObjectId, ref: 'Vacation', default: null},
        month        : Number,
        year         : Number,
        capacityArray: Array,
        capacityMonthTotal   : Number

    }, {collection: 'Capacity'});

    capacitySchema.set('toJSON', {virtuals: true});

    mongoose.model('Capacity', capacitySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Capacity'] = capacitySchema;
})();