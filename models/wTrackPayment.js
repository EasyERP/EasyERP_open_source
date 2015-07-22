/**
 * Created by Roman on 20.05.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var Schema = mongoose.Schema;


    var paymentSchema = new Schema({
        ID: Number,
        forSale:{type: Boolean, default: true},
        invoice: {
            _id: {type: ObjectId, ref: 'Invoice', default: null},
            name: String,
            assigned: {
                _id: String,
                name: String
            }
        },
        supplier: {
            _id: {type: ObjectId, ref: 'Customers', default: null},
            fullName: String
        },
        paidAmount: {type: Number, default: 0, set: setPrice},
        paymentMethod: {
            _id: {type: ObjectId, ref: 'PaymentMethod', default: null},
            name: String
        },
        date: {type: Date, default: Date.now},
        name: {type: String, default: '', unique: true},
        period: {type: ObjectId, ref: 'Destination', default: null},
        paymentRef: {type: String, default: ''},
        workflow: {type: String, enum: ['Draft', 'Paid'], default: 'Draft'},
        differenceAmount: {type: Number, default: 0, set: setPrice},
        whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        month: {type: Number},
        year:  {type: Number},
        bonus: {type: Boolean},

        groups: {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },

        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'Payment'});

    mongoose.model('wTrackPayment', paymentSchema);

    paymentSchema.pre('save', function (next) {
        var payment = this;
        var db = payment.db.db;

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

                payment.name += '_' + rate.seq;

                next()
            });
    });

    paymentSchema.post('save', function (doc) {
        var payment = this;
        var db = payment.db.db;

        db.collection('Invoice').findAndModify({
                _id: doc.invoice._id
            },
            [['name', 1]],
            {
                $set: {paymentDate: new Date()}
            },
            null,
            function (err) {
                if (err) {
                    return console.error('An error was occurred during updating %s', doc.invoice);
                }

                console.log('Invoice %s was updated success', doc.invoice);
            });
    });

    function setPrice(num) {
        return num * 100;
    }

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['wTrackPayment'] = paymentSchema;
})();