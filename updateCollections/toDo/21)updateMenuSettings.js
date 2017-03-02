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

    modules.update({_id: {$in: [132, 135]}}, {$set: {visible: false}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 136}, {$set: {sequence: 0, mname: 'General'}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 140}, {$set: {mname: 'Stock Details'}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 119}, {$set: {sequence: 4}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 104}, {$set: {sequence: 8}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });
    modules.update({_id: 137}, {$set: {sequence: 12, mname: 'Products Configurations'}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 133}, {$set: {sequence: 20, mname: 'Integrations'}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 103}, {
        $set: {
            sequence: 16,
            mname   : 'Employees Details'
        }
    }, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });



    modules.update({_id: 51}, {$set: {sequence: 24, mname: 'Access Profiles'}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 7}, {$set: {sequence: 32, mname: 'System Users'}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 15}, {$set: {sequence: 40}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 44}, {$set: {sequence: 48}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });
    modules.update({_id: 127}, {$set: {visible: false}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });
    modules.update({_id: 126}, {$set: {visible: false}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });
    modules.update({_id: 84}, {$set: {visible: false}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });
});
