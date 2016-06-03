module.exports = (function () {
    var mongoose = require('mongoose');

    var DestinationSchema = mongoose.Schema({
        name: String
    }, {collection: 'Destination'});

    mongoose.model('Destination', DestinationSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Destination = DestinationSchema;
})();
