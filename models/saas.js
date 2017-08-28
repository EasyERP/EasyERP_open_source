module.exports = (function () {
    var mongoose = require('mongoose');

    var SaasSchema = mongoose.Schema({
        _id             : String,
        registrationDate: {type: Date, default: Date.now},
        ip              : String,
        geo             : JSON,
        url             : {type: String, default: 'localhost'},
        DBname          : {type: String, default: ''},
        /* pass: {type: String, default: ''},
         user: {type: String, default: ''},*/
        users           : [{
            registrationDate: {type: Date, default: Date.now},
            pass            : {type: String, default: ''},
            user            : {type: String, default: ''},
            forgotToken     : {type: String, default: ''},
            mobilePhone: {type: String, default: ''},
            contactName     : {
                first: {type: String, default: ''},
                last : {type: String, default: ''}
            },

            facebook: {
                userId     : {type: String, default: ''},
                accessToken: {type: String, default: ''}
            },

            linkedin: {
                userId    : {type: String, default: ''},
                country   : {type: String, default: ''},
                profileUrl: {type: String, default: ''}
            },

            credentials: {
                verify_token: {type: String, default: ''}
            }
        }]
    }, {collection: 'SaasDbs'});

    mongoose.model('Saas', SaasSchema);

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas.Saas = SaasSchema;
})();
