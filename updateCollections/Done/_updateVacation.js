/**
 * Created by lilya on 21/12/15.
 */
/**
 * Created by liliya on 9/1/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../../models/index.js');
var async = require('async');

var vacationSchema = mongoose.Schema({
    ID: Number,
    employee: {
        _id: {type: ObjectId, ref: 'Employees', default: null},
        name: String
    },
    department: {
        _id: {type: ObjectId, ref: 'Department', default: null},
        name: String
    },
    vacations: {},
    month: Number,
    year: Number,
    vacArray: Array
}, {collection: 'Vacation'});

mongoose.model('VacationOld', vacationSchema);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas['VacationOld'] = vacationSchema;


var VacationSchema = mongoose.Schemas['Vacation'];
var VacationSchemaOld = mongoose.Schemas['VacationOld'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Vacation = dbObject.model("Vacation", VacationSchema);
var VacationOld = dbObject.model("VacationNew", VacationSchemaOld);

var query = VacationOld.find().lean();

query.exec(function (error, _res) {
    if (error) {
        return console.dir(error);
    }

    async.eachLimit(_res, 100, function (vac, callback) {
        var objectToSave = {};

        objectToSave.employee = vac.employee._id ? vac.employee._id : null;
        objectToSave.department = vac.department._id ? vac.department._id : null;

        Vacation.update({_id: vac._id}, objectToSave, callback);
    }, function (err) {
        if (err) {
            return console.dir(err);
        }

        console.dir('Good');
    })
});
