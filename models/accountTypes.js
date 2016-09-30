module.exports = (function () {
    var mongoose = require('mongoose');

    var Schema = new mongoose.Schema({
        name    : {type: String, default: ''},
        sequence: {type: Number}
    }, {collection: 'accountTypes'});

    mongoose.model('accountTypes', Schema);
    mongoose.Schemas.accountTypes = Schema;
})();
