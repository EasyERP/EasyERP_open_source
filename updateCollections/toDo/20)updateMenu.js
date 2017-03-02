var mongoose = require('mongoose');
require('../../models/index.js');

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'sergey', 28017);
dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var moduleSchema = mongoose.Schemas.module;

    var modules = dbObject.model('modules', moduleSchema);

    modules.update({_id: 131}, {$set: {mname: 'Transfers'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 86}, {$set: {mname: 'Journal Entries'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 83}, {$set: {mname: 'Chart of Accounts'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });


    modules.update({href: 'customerPayments'}, {$set: {parrent: 19, sequence: 35, mname: 'Payments'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.findByIdAndUpdate(123, {$set: {sequence: 30, visible: true}}, {new: true}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        console.log(result);
    });

    modules.findByIdAndUpdate(129, {$set: {sequence: 5}}, {new: true}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        console.log(result);
    });

    modules.findByIdAndUpdate(130, {$set: {sequence: 10}}, {new: true}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        console.log(result);
    });

    modules.findByIdAndUpdate(128, {$set: {sequence: 32}}, {new: true}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        console.log(result);
    });

    modules.findByIdAndUpdate(87, {$set: {visible: false}}, {new: true}, function (err, result) {
        if (err) {
            return console.log(err);
        }

        console.log(result);
    });

    modules.update({href: 'productType'}, {$set: {mname: 'Product Types'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({href: 'warehouse'}, {$set: {mname: 'Warehouse'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });
    modules.update({href: 'DividendInvoice'}, {$set: {mname: 'Dividend Declarations'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({href: 'settingsEmployee'}, {$set: {mname: 'Employees'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({mname: 'Purchase Invoices'}, {$set: {mname: 'Invoices'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({mname: 'Purchase Orders'}, {$set: {mname: 'Orders'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({mname: 'Price lists'}, {$set: {mname: 'Price Lists'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: {$in: [62, 63, 64, 57, 56, 55, 99, 95]}}, {$set: {visible: false}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: {$in: [127, 126, 58, 84]}}, {$set: {parrent: 122}}, {multi: true}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });

    modules.update({_id: 84}, {$set: {mname: 'Product Options'}}, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('good');
    });
});



