/**
 * Created by lilya on 10/11/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../models/index.js');
var async = require('async');

var payRollSchema = new mongoose.Schema({
    ID        : Number,
    employee  : {
        _id : {type: ObjectId, ref: 'Employees', default: null},
        name: String
    },
    year      : Number,
    month     : Number,
    dataKey   : Number,
    baseSalary: Number,
    calc      : {
        salary: Number,
        onCash: Number,
        onCard: Number
    },
    paid      : {
        onCash: Number,
        onCard: Number
    },
    diff      : {
        onCash: Number,
        onCard: Number,
        total : Number
    }
}, {collection: 'PayRoll'});

payRollSchema.set('toJSON', {virtuals: true});

mongoose.model('PayRollOld', payRollSchema);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas['PayRollOld'] = payRollSchema;

var PayRollSchema =  mongoose.Schemas['PayRoll'];
var PayRollSchemaOld =  mongoose.Schemas['PayRollOld'];

var dbObject = mongoose.createConnection('78.46.185.131', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");
});

var PayRoll = dbObject.model("PayRoll", PayRollSchema);
var PayRollOld = dbObject.model("PayRollNew", PayRollSchemaOld);

var query = PayRollOld.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.each(_res, function (rayRoll, callback) {
        var objectToSave = {};
        var newPayRoll = rayRoll;
        var newModel;
        var _id = rayRoll._id;

        if (rayRoll) {
            objectToSave = {
                type: {
                    _id: "564592fbabb1c35728ad7d0f",
                    name: "Salary Cash"
                },
                calc: rayRoll.calc.onCash,
                paid: rayRoll.paid ? rayRoll.paid.onCash : 0,
                diff: rayRoll.diff.onCash
            };

            delete newPayRoll._id;
            delete newPayRoll.baseSalary;
            newPayRoll.type = {};
            newPayRoll.type._id =  "56459308abb1c35728ad7d10";
            newPayRoll.type.name = "Salary Card";
            newPayRoll.calc = rayRoll.calc.onCard;
            newPayRoll.paid = rayRoll.paid ? rayRoll.paid.onCard : 0;
            newPayRoll.diff = rayRoll.diff.onCard;
        }

        if (newPayRoll.calc){
            newModel = new PayRoll(newPayRoll);

            newModel.save(function(err, result){
                if (err){
                    console.log(err);
                }
            });
        }

        PayRoll.findByIdAndUpdate(_id, objectToSave, {new: true}, function(err, result){
            if (err){
                console.log(err);
            }
            callback();
        });

    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    })
});

