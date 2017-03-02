/**
 * Created by liliy on 18.08.2016.
 */
var countries = [
    {"name": "Afghanistan", "code": "AF"},

];

var mongoose = require('mongoose');
var async = require('async');
var isoWeekYearComposer = require('../../helpers/isoWeekYearComposer');
require('../../models/index.js');
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'sergey', 28017, connectOptions);
//var dbObject = mongoose.createConnection('localhost', 'production');

var newCOuntries = [];

countries.forEach(function (el) {
    el._id = el.name;
    newCOuntries.push(el);
});

dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var pTypeSchema;
    var pType;

    pTypeSchema = mongoose.Schemas.countries;

    pType = dbObject.model('org', pTypeSchema);

    pType.collection.insertMany(newCOuntries, function () {
        console.log('good');
    });
});



