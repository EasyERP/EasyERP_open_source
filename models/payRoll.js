module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var payRollSchema = new mongoose.Schema({
        ID        : Number,
        employee  : {type: ObjectId, ref: 'Employees', default: null},
        year      : Number,
        month     : Number,
        dataKey   : Number,
        earnings  : {type: Array, default: []},
        deductions: {type: Array, default: []},
        calc      : Number,
        paid      : Number,
        diff      : Number,
        date      : {type: Date, default: null},
        status    : {type: Boolean, default: false}
    }, {collection: 'PayRoll'});

    payRollSchema.set('toJSON', {virtuals: true});

    mongoose.model('PayRoll', payRollSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.PayRoll = payRollSchema;
})();
