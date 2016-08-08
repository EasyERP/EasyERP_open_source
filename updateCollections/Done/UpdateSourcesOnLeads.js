var mongoose = require('mongoose');
require('../../models/index.js');

var ISODate = Date;

var SourceSchema = mongoose.Schemas.source;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'lilyadb', 28017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log('Connection to lilyadb is success');
});

var Source = dbObject.model('sources', SourceSchema);

var newSources = [{
    _id : 'Crowdmarketing',
    name: 'Crowdmarketing'
}, {
    _id : 'Professional Sites',
    name: 'Professional Sites'
}, {
    _id : 'Social Media',
    name: 'Social Media'
}, {
    _id : 'Outbound Cold Call',
    name: 'Outbound Cold Call'
}, {
    _id : 'Outbound Marketing Mailing',
    name: 'Outbound Marketing Mailing'
}, {
    _id : 'Outbound Job Search',
    name: 'Outbound Job Search'
}, {
    _id : 'Outbound LinkedIn',
    name: 'Outbound LinkedIn'
}];

Source.collection.insert(newSources, function (err, success) {
    if (err) {
        return console.error(err);
    }

    console.log(success);
});



