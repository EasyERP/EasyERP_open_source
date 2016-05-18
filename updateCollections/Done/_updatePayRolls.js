/**
 * Created by lilya on 17/12/15.
 */
/**
 * Created by lilya on 10/11/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../../models/index.js');
var async = require('async');

var payRollSchema = new mongoose.Schema({
    ID      : Number,
    employee: {
        _id : {type: ObjectId, ref: 'Employees', default: null},
        name: String
    },
    year    : Number,
    month   : Number,
    dataKey : Number,
    calc    : Number,
    paid    : Number,
    diff    : Number,

    type  : {
        _id : {type: ObjectId, ref: "ProductCategories", default: null},
        name: String
    },
    date  : {type: Date, default: null},
    status: {type: Boolean, default: false}
}, {collection: 'PayRoll'});

payRollSchema.set('toJSON', {virtuals: true});

mongoose.model('PayRollOld', payRollSchema);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas['PayRollOld'] = payRollSchema;

var PayRollSchema = mongoose.Schemas['PayRoll'];
var PayRollSchemaOld = mongoose.Schemas['PayRollOld'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var PayRoll = dbObject.model("PayRoll", PayRollSchema);
var PayRollOld = dbObject.model("PayRollOld", PayRollSchemaOld);

var query = PayRollOld.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.each(_res, function (rayRoll, callback) {
        var objectToSave = {};
        var _id = rayRoll._id;

        if (rayRoll) {
            objectToSave = {
                type   : rayRoll.type ? rayRoll.type._id : null,
                employee: rayRoll.employee._id
            };

        }

        PayRoll.update({_id: _id}, {$set: {type: rayRoll.type ? rayRoll.type._id : null, employee: rayRoll.employee._id }}, function(err, result){
            callback(err, result)
        });

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    })
});

