module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var payRollSchema = new mongoose.Schema({
        ID: Number,
        employee: {
            _id: {type: ObjectId, ref: 'Employees', default: null},
            name: String
        },
        year: Number,
        month: Number,
        baseSalary: Number,
        calc: {
            salary: Number,
            onCash: Number,
            onCard: Number
        },
        paid: {
            onCash: Number,
            onCard: Number
        },
        diff: {
            onCash: Number,
            onCard: Number,
            total: Number
        }
    }, {collection: 'Salary'});

    payRollSchema.set('toJSON', {virtuals: true});

    mongoose.model('Salary', payRollSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['PayRoll'] = payRollSchema;
})();