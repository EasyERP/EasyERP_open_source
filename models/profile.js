module.exports = (function () {
    var mongoose = require('mongoose');

    var ProfileSchema = mongoose.Schema({
        ID                : Number,
        _id               : Number,
        profileName       : {type: String, default: 'emptyProfile'},
        profileDescription: {type: String, default: 'No description'},
        profileAccess     : [{
            module: {type: Number, ref: "modules"},
            access: {
                read     : {type: Boolean, default: false},
                editWrite: {type: Boolean, default: false},
                del      : {type: Boolean, default: false}
            }
        }]

    }, {collection: 'Profile'});

    mongoose.model('Profile', ProfileSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Profile'] = ProfileSchema;
})();