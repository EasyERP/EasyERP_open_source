/**
 * Created by Roman on 04.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');


    var birthdaysSchema = mongoose.Schema({
        _id: { type: Number, default: 1 },
        date: Date,
        currentEmployees: {
            weekly: Array,
            nextweek:Array,
            monthly: Array
        }
    }, { collection: 'birthdays' });

    mongoose.model('birthdays', birthdaysSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.birthday = birthdaysSchema;
})();