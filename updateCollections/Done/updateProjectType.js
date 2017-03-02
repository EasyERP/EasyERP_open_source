var mongoose = require('mongoose');
var async = require('async');
var isoWeekYearComposer = require('../../helpers/isoWeekYearComposer');
require('../../models/index.js');
var connectOptions = {
    user: 'easyEp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);
var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var pTypeSchema;
    var pType;

    pTypeSchema = mongoose.Schemas.projectType;

    pType = dbObject.model('projectType', pTypeSchema);

    pType.findByIdAndRemove({
        _id : 'mixed'
    }, function (error, res) {
        if (error) {
            return console.dir(error);
        }
        console.log('Removed');
    });
});



