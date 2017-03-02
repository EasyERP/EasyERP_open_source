var mongoose = require('mongoose');
require('../../models/index.js');
var ModuleSchema = mongoose.Schemas.Profile;

var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);
// var dbObject = mongoose.createConnection('erp.thinkmobiles.com', 'production', 27017, connectOptions);

var Module = dbObject.model('Profile', ModuleSchema);

Module.find({}, {profileAccess: 1}, function (err, profiles) {
    if (err) {
        return console.error(err);
    }

    profiles.forEach(function (profile) {
        var modules = [];
        var duplicates = {};

        profile.profileAccess.forEach(function (access) {
            if (!duplicates[access.module]) {
                duplicates[access.module] = access;
                modules.push(access);
            } else {
                console.log(access.module);
            }
        });

        Module.findByIdAndUpdate(profile._id, {$set: {profileAccess: modules}}, function (err, updated) {
            if (err) {
                return console.error(err);
            }

            console.dir('--- updated ---', profile._id);
        });
    });

    console.log(' ---- DONE ----');
});

