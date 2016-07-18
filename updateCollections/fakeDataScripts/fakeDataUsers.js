var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');
var crypto = require('crypto');

var UsersSchema = mongoose.Schemas.User;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'production'/*, 28017, connectOptions*/);

//var dbObject = mongoose.createConnection('localhost', 'production');
var User = dbObject.model('Users', UsersSchema);

var query = User.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }
    var i = 0;

    async.eachLimit(_res, 100, function (emp, callback) {
        var objectToSave = {};
        var shaSum = crypto.createHash('sha256');
        shaSum.update('111111');
        objectToSave.pass = shaSum.digest('hex');
        objectToSave.login = "pupkin" + i;
        objectToSave.email = "pupkin" + i + "@thinkmobiles.com";

        i++;


        User.update({_id: emp._id}, objectToSave, callback);
        i++;
    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    });
});



