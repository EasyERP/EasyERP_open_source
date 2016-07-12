module.exports = (function () {
    var mongoose = require('mongoose');

    var payrollComponentTypeSchema = new mongoose.Schema({
        name: {type: String, default: ''},
        type: {
            type   : String,
            default: 'earnings',
            enum   : ['earnings', 'deductions']
        },

        description: {type: String, default: ''},
        formula    : {type: Array, default: []},
        minRange   : Number,
        maxRange   : Number
    }, {collection: 'payrollComponentTypes'});

    mongoose.model('payrollComponentType', payrollComponentTypeSchema);
    mongoose.Schemas.payrollComponentType = payrollComponentTypeSchema;
})();
