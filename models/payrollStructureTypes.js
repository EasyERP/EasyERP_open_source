module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var payrollStructureTypesSchema = mongoose.Schema({
        name      : {type: String, default: ''},
        earnings  : {type: Array, default: []},
        deductions: {type: Array, default: []}
    }, {collection: 'payrollStructureTypes'});

    mongoose.model('payrollStructureTypes', payrollStructureTypesSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.payrollStructureTypes = payrollStructureTypesSchema;
})();
