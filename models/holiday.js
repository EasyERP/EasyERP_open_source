/**
 * Created by soundstorm on 29.06.15.
 */
module.exports = (function () {
    var mongoose = require('mongoose');

    var holidaySchema = new mongoose.Schema({
        ID: Number,
        date: Date,
        month: Number,
        week: Number,
        comment: String

    }, {collection: 'Holiday'});

    mongoose.model('Holiday', holidaySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Holiday'] = holidaySchema;
})();