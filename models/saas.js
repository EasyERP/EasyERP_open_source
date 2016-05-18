/**
 * Created by Roman on 05.04.2015.
 */
module.exports = (function () {
    var mongoose = require('mongoose');

    var SaasSchema = mongoose.Schema({
        _id: String,
        registrationDate: {type: Date, default: Date.now},
        ip: String,
        geo: JSON,
        url: {type: String, default: 'localhost'},
        DBname: {type: String, default: ''},
        /*pass: {type: String, default: ''},
         user: {type: String, default: ''},*/
        users: [{
            registrationDate: {type: Date, default: Date.now},
            pass: {type: String, default: ''},
            user: {type: String, default: ''},
            forgotToken: {type: String, default: ''}
        }]
    }, {collection: 'SaasDbs'});

    mongoose.model('Saas', SaasSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Saas'] = SaasSchema;
})();