/**
 * Created by lilya on 27/11/15.
 */

module.exports = (function () {

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var chartAccountSchema = mongoose.Schema({

        code      : {type: Number},
        account  : {type: String, default: ""},
        type     : {type: String, default: ""},
        payMethod: {type: ObjectId, ref: 'PaymentMethod', default: null},
        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date}
        },
        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        }

    }, {collection: 'chartOfAccount'});

    mongoose.model('chartOfAccount', chartAccountSchema);

    //for DropDown
    chartAccountSchema
        .virtual('name')
        .get(function () {
            return this.code + ' ' + this.account;
        });

    chartAccountSchema.set('toJSON', {virtuals: true});

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['chartOfAccount'] = chartAccountSchema;
})();