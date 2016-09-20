module.exports = (function () {

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var extend = require('mongoose-schema-extend');

    var Schema = mongoose.Schema;
    var journalEntriesSchema = new Schema({
        date    : {type: Date, default: Date.now},
        type    : {type: String, default: ''},
        journal : {type: ObjectId, ref: 'journal', default: null, require: true},
        account : {type: ObjectId, ref: 'chartOfAccount', default: null},
        currency: {
            name: {type: String, default: 'USD'},
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

        debit : {type: Number, default: 0},
        credit: {type: Number, default: 0}
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
