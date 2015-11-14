module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var payRollSchema = new mongoose.Schema({
        ID        : Number,
        employee  : {
            _id : {type: ObjectId, ref: 'Employees', default: null},
            name: String
        },
        year      : Number,
        month     : Number,
        dataKey   : Number,
        calc      : Number,
        paid      : Number,
        diff      : Number,

        type: {
            _id: {type: ObjectId, ref: "ProductCategories", default: null},
            name: String
        }
    }, {collection: 'PayRoll'});

    payRollSchema.set('toJSON', {virtuals: true});

    mongoose.model('PayRoll', payRollSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['PayRoll'] = payRollSchema;
})();