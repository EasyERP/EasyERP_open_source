module.exports = (function () {
    var mongoose = require('mongoose');

    var payrollComponentTypeSchema = new mongoose.Schema({
        name: {type: String, default: ''},
        type: {
            type   : String,
            default: 'earning',
            enum   : ['earning', 'deduction']
        },
        
        description: {type: String, default: ''},
        formula    : {type: Array, default: []}
    }, {collection: 'payrollComponentTypes'});

    mongoose.model('payrollComponentType', payrollComponentTypeSchema);
    mongoose.Schemas.payrollComponentType = payrollComponentTypeSchema;
})();
