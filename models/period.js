/**
 * Created by Roman on 21.05.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;


    var periodSchema = new Schema({
        _id: String,
        neme: String
    }, {collection: 'Period'});

    mongoose.model('Period', periodSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Period'] = periodSchema;
})();