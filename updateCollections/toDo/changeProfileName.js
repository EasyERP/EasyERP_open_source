var mongoose = require('mongoose');
require('../../models/index.js');

var ProfileSchema = mongoose.Schemas.Profile;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);

//var dbObject = mongoose.createConnection('localhost', 'production');

var Profile = dbObject.model('Profile', ProfileSchema);

var query = Profile.findByIdAndUpdate('1387275504000', {profileName: 'banned'});

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }
    console.dir('Good');

});