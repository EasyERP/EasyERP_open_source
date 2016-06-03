module.exports = (function () {
    var mongoose = require('mongoose');

    var holidaySchema = new mongoose.Schema({
        ID         : Number,
        date       : Date,
        year       : Number,
        week       : Number,
        day        : Number,
        dateByMonth: Number,
        comment    : String

    }, {collection: 'Holiday'});

    mongoose.model('Holiday', holidaySchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Holiday = holidaySchema;
})();
