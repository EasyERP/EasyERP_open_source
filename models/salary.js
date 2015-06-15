/**
 * Created by soundstorm on 15.06.15.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;

    var salarySchema = new mongoose.Schema({
        ID: Number,
        employee: { type: ObjectId, ref: 'Employees', default: null },
        monthRate: {
            year: '',
            month: Number,
            baseSalary: Number,
            hourlyWithExpense: Number
        },
        calc: {
            salary: Number,
            onCash: Number,
            onCard: Number,
            onBonus: Number
        },
        paid: {
            onCash: Number,
            onCard: Number,
            onBonus: Number
        },
        diff: {
            onCash: Number,
            onCard: Number,
            onBonus: Number
        }
    }, {collection: 'Salary'});

    salarySchema.set('toJSON', {virtuals: true});

    mongoose.model('Salary', salarySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Salary'] = salarySchema;
})();