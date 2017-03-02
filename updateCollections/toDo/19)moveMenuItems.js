var mongoose = require('mongoose');
require('../../models/index.js');

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'CRM', 28017);
dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var moduleSchema = mongoose.Schemas.module;

    var modules = dbObject.model('modules', moduleSchema);

    modules.update({_id: 29}, {$set: {parrent: 141, mname: 'CRM', visible: false}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 78}, {$set: {visible: false}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 107}, {$set: {visible: false}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 68}, {$set: {visible: false}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 78}, {$set: {mname: 'Products Configuration'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 36}, {$set: {visible: false}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 100}, {$set: {visible: false}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 140}, {$set: {parrent: 141, mname: 'Stock Detail', sequence: 25}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });
});
