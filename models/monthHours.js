/**
 * Created by Liliya on 23.06.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var monthHoursSchema;

    monthHoursSchema = mongoose.Schema({
        ID: Number,
        month: {type: Number},
        hours: {type: Number},
        year: {type: Number},
        expenseCoefficient: {type: Number},
        fixedExpense: {type: Number},
        idleBudget: {type: Number, default: 0},
        vacationBudget: {type: Number, default: 0},
        adminBudget: {type: Number, default: 0},
        adminSalaryBudget: {type: Number, default: 0},
        estimatedHours: {type: Number, default: 0},
        actualHours: {type: Number, default: 0},
        overheadRate: {type: Number, default: 0}
    }, {collection: 'MonthHours'});

    mongoose.model('MonthHours', monthHoursSchema);

    if(!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['MonthHours'] = monthHoursSchema;
})();
