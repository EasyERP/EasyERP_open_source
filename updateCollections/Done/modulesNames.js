var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var ModuleSchema = mongoose.Schemas.modules;

var connectOptions = {
    //user: 'easyErp',
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

//var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);

var dbObject = mongoose.createConnection('144.76.56.111', 'micheldb', 28017, connectOptions);

//var dbObject = mongoose.createConnection('localhost', 'production');

var Module = dbObject.model('modules', ModuleSchema);

var parallelTasks = [function (cb) {
    Module.update({_id: 73}, {mname: 'Dashboard'}, cb);
}, function (cb) {
    Module.update({_id: 83}, {mname: 'Chart Of Account'}, cb);
}, function (cb) {
    Module.update({_id: 91}, {mname: 'Profit And Loss'}, cb);
}, function (cb) {
    Module.update({_id: 72}, {mname: 'Bonus Type'}, cb);
}, function (cb) {
    Module.update({_id: 98}, {mname: 'Expenses Payments'}, cb);
}, function (cb) {
    Module.update({_id: 84}, {mname: 'Product Categories'}, cb);
}, function (cb) {
    Module.update({_id: 102}, {mname: 'Dividend Payments'}, cb);
}, function (cb) {
    Module.update({_id: 103}, {mname: 'Employee'}, cb);
}, function (cb) {
    Module.update({_id: 74}, {mname: 'HR Dashboard'}, cb);
}, function (cb) {
    Module.update({_id: 60}, {mname: 'Payout'}, cb);
}, function (cb) {
    Module.update({_id: 97}, {mname: 'Expenses'}, cb);
}, function (cb) {
    Module.update({_id: 70}, {mname: 'Vacations'}, cb);
}, function (cb) {
    Module.update({_id: 75}, {mname: 'Time Card'}, cb);
}];

async.parallel(parallelTasks, function (err) {
    if (err) {
        console.log(err);
    }
    console.log('Good');
});
