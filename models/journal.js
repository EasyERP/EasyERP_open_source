module.exports = (function () {

    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var Schema = mongoose.Schema({
        date  : {type: Date, default: Date.now},
        type     : {type: String, default: ""},
        transaction     : {type: String, default: "invoice"},
        currency: {
            name: {type: String, default: 'USD'},
            crossCourse: {type: Number, default: 1}
        },
        description: {type: String, default: ""},
        createdBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date, default: Date.now }
        },
        editedBy: {
            user: { type: ObjectId, ref: 'Users', default: null },
            date: { type: Date }
        },
        debitAccount: {type: ObjectId, ref: 'chartOfAccount', default: null},
        creditAccount: {type: ObjectId, ref: 'chartOfAccount', default: null}

    });

    mongoose.model('journal', Schema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['journal'] = Schema;
})();