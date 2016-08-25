var mongoose = require('mongoose');
var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);
//var url = 'mongodb://144.76.56.111:28017/pavlodb';
var async = require('async');

var modules = dbObject.collection('modules');
var profiles = dbObject.collection('Profile');

function childModule(callback) {
    var module = {
        _id     : 109,
        mname   : 'Payments',
        href    : 'purchasePayments',
        sequence: 108,
        parrent : 54,
        link    : true,
        visible : true
    };

    var q = async.queue(function (module, callback) {
        modules.insertOne(module, callback);
    }, 1000);

    q.drain = function () {
        callback(null, module);
    };

    q.push([module], function () {
        console.log('finished process');
    });
};

function profileUpdater(child, callback) {
    var i;

    var childInsert = {
        "module": child._id,
        "access": {
            "del"      : true,
            "editWrite": true,
            "read"     : true
        }
    };

    var q = async.queue(function (profile, callback) {
        if (profile) {
            console.log('profile = ' + profile._id);
            profiles.findOneAndUpdate({_id: profile._id}, {$push: {profileAccess: {$each: [childInsert]}}}, callback);
        }
    }, 1000);

    q.drain = function () {
        callback(null, 'done');
    };

    var cursor = profiles.find()

    cursor.each(function (err, profile) {
        if (err) {
            return callback(err);
        }
        if (profile) {
            q.push(profile, function () {
                console.log('finished ' + profile._id);
            });
        }
    });
};

async.waterfall([childModule, profileUpdater], function (err, res) {
    if (err) {

        return console.log(err);
    }
    console.log(res);

})
