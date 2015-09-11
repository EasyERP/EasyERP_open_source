module.exports = (function () {
    var mongoose = require('mongoose');

    var hoursCashSchema = new mongoose.Schema({
        dateField: {type: String, default: ''},
        result: JSON

    }, {collection: 'HoursCashes'});

    mongoose.model('HoursCash', hoursCashSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['HoursCashes'] = hoursCashSchema;
})();