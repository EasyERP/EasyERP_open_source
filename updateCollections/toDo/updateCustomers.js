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

var dbObject = mongoose.createConnection('144.76.56.111', 'sergey', 28017, connectOptions);
//var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var customerSchema;
    var Customer;

    console.log("Connection to db is success");

    customerSchema = mongoose.Schemas.Customer;

    Customer = dbObject.model('Customer', customerSchema);
    Customer.update({}, {$set : {isHidden : false}}, {multi : true},
    function (err, res){
        if (err){
            console.log(err);
        }

        console.log('Good');
    })
});



