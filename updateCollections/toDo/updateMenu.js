var mongoose = require('mongoose');
require('../../models/index.js');
var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('45.32.152.113', 'liveErp', 27017, connectOptions);
// var dbObject = mongoose.createConnection('localhost', 'production');

dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var moduleSchema = mongoose.Schemas.module;

    var modules = dbObject.model('modules', moduleSchema);

    modules.findByIdAndUpdate({_id: 95}, {
        $set: {
            href    : 'proforma',
            sequence: 0,
            parrent : 54,
            visible : true
        }
    }, function (err, result) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });
});



