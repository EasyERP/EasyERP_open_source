module.exports = (function () {
    var mongoose = require('mongoose');

    var payrollStructureTypesSchema = mongoose.Schema({
        name     : {type: String, default: ''},
        earning  : {type: Array, default: []},
        deduction: {type: Array, default: []}
    }, {collection: 'payrollStructureTypes'});

    mongoose.model('payrollStructureTypes', payrollStructureTypesSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.payrollStructureTypes = payrollStructureTypesSchema;
})();
