/**
 * Created by Roman on 20.05.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var Schema = mongoose.Schema;


    var paymentSchema = new Schema({
        invoice: {type: ObjectId, ref: 'Invoice', default: null},
        supplier: {type: ObjectId, ref: 'Customers', default: null},
        paidAmount: {type: Number, default: 0},
        paymentMethod: {type: ObjectId, ref: 'PaymentMethod', default: null},
        date: {type: Date, default: Date.now},
        name: {type: String, default: 'PP', unique: true},
        period: {type: ObjectId, ref: 'Destination', default: null},
        incoterm: {type: ObjectId, ref: 'Incoterm', default: null},
        paymentRef: {type: String, default: ''},
        differenceAmount: {type: Number, default: 0},
        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'Payment'});

    mongoose.model('Payment', paymentSchema);

    paymentSchema.pre('save', function (next) {
        var payment = this;
        var db = quotation.db.db;

        db.collection('settings').findAndModify({
                dbName: db.databaseName,
                name: 'payment'
            },
            [['name', 1]],
            {
                $inc: {seq: 1}
            },
            {
                new: true
            },
            function (err, rate) {
                if (err) {
                    return next(err);
                }

                payment.name += rate.seq;

                next()
            });
    });

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Payment'] = paymentSchema;
})();