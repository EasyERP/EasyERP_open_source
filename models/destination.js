/**
 * Created by Roman on 13.05.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');

    var DestinationSchema = mongoose.Schema({
        name: String
    }, { collection: 'Destination' });

    mongoose.model('Destination', DestinationSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Destination'] = DestinationSchema;
})();