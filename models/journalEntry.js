module.exports = (function () {

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var Schema = mongoose.Schema({
        date     : {type: Date, default: Date.now},
        type     : {type: String, default: ""},
        journal  : {type: ObjectId, ref: 'journal', default: null, require: true},
        account  : {type: ObjectId, ref: 'chartOfAccount', default: null},
        currency : {
            name: {type: String, default: 'USD'},
            rate: {type: Number, default: 1}
        },
        createdBy: {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date}
        },
        debit    : {type: Number, default: 0},
        credit   : {type: Number, default: 0}

    });

    mongoose.model('journalEntry', Schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['journalEntry'] = Schema;
})();