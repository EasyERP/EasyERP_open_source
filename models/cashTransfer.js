module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var cashTransferSchema = mongoose.Schema({
        ID           : Number,
        name         : {type: String, default: ''},
        date         : {type: Date, default: Date.now},
        amount       : {type: Number, default: 0},
        debitAccount : {type: ObjectId, ref: 'chartOfAccount', default: null},
        creditAccount: {type: ObjectId, ref: 'chartOfAccount', default: null},
        currency     : {
            _id : {type: String, ref: 'currency', default: null},
            rate: {type: Number, default: 1}
        }
    }, {collection: 'cashTransfer'});

    mongoose.model('cashTransfer', cashTransferSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    cashTransferSchema.pre('save', function (next) {
        var invoice = this;
        var db = invoice.db.db;

        db.collection('settings').findOneAndUpdate({
            dbName: db.databaseName,
            name  : 'cashTransfer'
        }, {
            $inc: {seq: 1}
        }, {
            returnOriginal: false,
            upsert        : true
        }, function (err, rate) {
            if (err) {
                return next(err);
            }
            invoice.name = 'CT' + rate.value.seq;

            next();
        });
    });

    cashTransferSchema.set('toJSON', {getters: true});

    mongoose.Schemas.cashTransfer = cashTransferSchema;

})();
