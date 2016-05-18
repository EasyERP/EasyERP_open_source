module.exports = (function () {
    var mongoose = require('mongoose');


    var vacationCacheSchema = mongoose.Schema({
        _id: { type: Number, default: 1 },
        data: JSON
    }, { collection: 'vacationCache' });

    mongoose.model('vacationCache', vacationCacheSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['vacationCache'] = vacationCacheSchema;
})();