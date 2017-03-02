module.exports = (function () {

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var extend = require('mongoose-schema-extend');

    var Schema = mongoose.Schema;
    var journalEntriesSchema = new Schema({
        date   : {type: Date, default: Date.now},
        type   : {type: String, default: ''},
        journal: {type: ObjectId, ref: 'journal', default: null},
        account: {type: ObjectId, ref: 'chartOfAccount', default: null},

        currency: {
            _id : {type: String, ref: 'currency', default: null},
            rate: {type: Number, default: 1}
        },

        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        editedBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },

        sourceDocument: {
            _id     : {type: ObjectId, default: null},
            model   : {type: String, default: 'Invoice'},
            employee: {type: ObjectId, default: null},
            name    : {type: String, default: ''}
        },

        debit    : {type: Number, default: 0},
        credit   : {type: Number, default: 0},
        debitFC  : {type: Number, default: 0},
        creditFC : {type: Number, default: 0},
        reversed : {type: Boolean, default: false},
        timestamp: {type: String}
    }, {collection: 'journalentries', discriminatorKey: '_type'});

    var manualEntrySchema = journalEntriesSchema.extend({});

    mongoose.model('journalEntry', journalEntriesSchema);
    mongoose.model('manualEntry', manualEntrySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.journalEntry = journalEntriesSchema;
    mongoose.Schemas.manualEntry = manualEntrySchema;
})();
