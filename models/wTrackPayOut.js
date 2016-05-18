/**
 * Created by soundstorm on 26.08.15.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var Schema = mongoose.Schema;

    var paymentSchema = new Schema({
        ID              : Number,
        forSale         : {type: Boolean, default: false},
        supplier        : {
            _id     : {type: ObjectId, ref: 'Employees', default: null},
            fullName: String
        },
        paidAmount      : {type: Number, default: 0, set: setPrice},
        name            : {type: String, default: '', unique: true},
        date            : {type: Date, default: Date.now},
        paymentRef      : {type: String, default: ''},
        workflow        : {type: String, enum: ['Draft', 'Paid'], default: 'Draft'},
        differenceAmount: {type: Number, default: 0, set: setPrice},
        whoCanRW        : {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        month           : {type: Number},
        year            : {type: Number},
        bonus           : {type: Boolean, default: true},

        groups: {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },

        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'Payment'});

    mongoose.model('wTrackPayOut', paymentSchema);
    paymentSchema.pre('save', function (next) {
        var payment = this;

        payment.name = new Date().valueOf();
        next();
    });

    function setPrice(num) {
        return num * 100;
    }

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['wTrackPayOut'] = paymentSchema;
})();