module.exports = (function () {
    var mongoose = require('mongoose');
    var moduleSchema = mongoose.Schema({
        ID       : Number,
        _id      : Number,
        mname    : String,
        href     : {type: String, default: ''},
        ancestors: [Number],
        users    : {},
        parrent  : Number,
        sequence : Number,
        link     : Boolean,
        visible  : Boolean,
        single   : {type: Boolean, default: false}
    }, {collection: 'modules'});

    mongoose.model('modules', moduleSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.module = moduleSchema;
})();
