var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var wTrackSchema = mongoose.Schemas['wTrack'];


var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var wTrack = dbObject.model("wTrack", wTrackSchema);


wTrack.update({}, {$set : {_type : 'ordinary'}}, {multi: true}, function (err, response) {
    if (err) {
        console.log(err);
    }

    console.log('updated');
});


