/**
 * Created by liliy on 13.06.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var TransferSchema = mongoose.Schemas.Transfer;

var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

// var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);
var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);

var Module = dbObject.model('transfer', TransferSchema);

Module.find({transferKey: {$exists: false}}, function (err, transfers) {
    if (err) {
        return console.log(err);
    }

    transfers.forEach(function (transfer) {
        var transferKey = new Date(transfer.date);

        transferKey = transferKey.valueOf();

        Module.findById(transfer._id, {transferKey: transferKey}, function (err, _transfer) {
            if (err) {
                return console.error(err);
            }

            console.log('updated');
        });
    });
});

