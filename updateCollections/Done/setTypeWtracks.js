// to set all wTracks _type
var mongoose = require('mongoose');
var wTrackSchema;
var dbObject;
var wTrack;

require('../../models/index.js');

wTrackSchema = mongoose.Schemas['wTrack'];
dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

wTrack = dbObject.model("wTrack", wTrackSchema);

wTrack.update({}, {$set : {_type : 'ordinary'}}, {multi: true}, function (err) {
    if (err) {
        console.log(err);
    }

    console.log('updated');
});


