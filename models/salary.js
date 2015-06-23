/**
 * Created by soundstorm on 15.06.15.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var salarySchema = new mongoose.Schema({
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

    salarySchema.set('toJSON', {virtuals: true});

    mongoose.model('Salary', salarySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Salary'] = salarySchema;
})();