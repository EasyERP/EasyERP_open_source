var mongoose = require('mongoose');
require('../../models/index.js');
var accountTypesSchema = mongoose.Schemas.accountTypes;
var chartOfAccountSchema = mongoose.Schemas.chartOfAccount;
var chartOfAccountSchemaOld = mongoose.Schemas.chartOfAccountOld;
var ObjectId = mongoose.Schema.Types.ObjectId;

var chartAccountSchemaOld = mongoose.Schema({
    code   : {type: Number},
    account: {type: String, default: ''},
    name   : {type: String, default: ''},
    type   : {type: String, default: ''},

    payMethod: {type: ObjectId, ref: 'PaymentMethod', default: null},

    editedBy: {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date}
    },

    createdBy: {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date, default: Date.now}
    }
}, {collection: 'chartOfAccount'});

mongoose.model('chartOfAccountOld', chartAccountSchemaOld);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas.chartOfAccountOld = chartAccountSchemaOld;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'production');
//var dbObject = mongoose.createConnection('erp.thinkmobiles.com', 'production', 27017, connectOptions);

var accountTypes = dbObject.model('accountTypes', accountTypesSchema);
var chartOfAccount = dbObject.model('chartOfAccount', chartOfAccountSchema);
var chartOfAccountOld = dbObject.model('chartOfAccountOld', chartOfAccountSchemaOld);
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
  /*  chartOfAccountOld.find({}, function (err, result) {
     if (err) {
     return console.log(err);
     }

     result.forEach(function (el) {
     chartOfAccountOld.update({_id: el._id}, {$set: {type: el.type ? el.type.trim() : null}}, function () {

     })
     });
     });*/
    chartOfAccountOld.aggregate([{
        $group: {
            _id: '$type',
            ids: {$addToSet: '$_id'}
        }
    }], function (err, result) {
        if (err) {
            return console.log(err);
        }

        result.forEach(function (el) {
            var body = {name: el._id.trim()};

            var newItem = new accountTypes(body);
            newItem.save({name: el._id}, function (err, result) {
                if (err) {
                    return console.log(err);
                }

                chartOfAccount.update({_id: {$in: el.ids}}, {$set: {type: result._id}}, {multi: true}, function (err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log('updated');
                });
            });
        });

    });
});




