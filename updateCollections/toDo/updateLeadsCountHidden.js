var mongoose = require('mongoose');
var async = require('async');
var isoWeekYearComposer = require('../../helpers/isoWeekYearComposer');
require('../../models/index.js');
var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

//var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);
var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var opportunitySchema;
    var customerSchema;
    var Customer;
    var Opportunitie;

    console.log("Connection to db is success");

    opportunitySchema = mongoose.Schemas.Opportunitie;
    customerSchema = mongoose.Schemas.Customer;
    Opportunitie = dbObject.model('Opportunities', opportunitySchema);
    Customer = dbObject.model('Customer', customerSchema);
    var count = 0;

    Opportunitie.find({isOpportunitie: false, tempCompanyField: '', 'contactName.first': ''})
        .populate('customer')
        .populate('company')
        .exec(function (error, res) {
            if (error) {
                return console.dir(error);
            }

            res.forEach(function (elem) {
                if (elem.customer && elem.customer.isHidden) {
                    count++;
                }
                if (elem.company && elem.company.isHidden) {
                    count++;
                }
            });

            console.log(count);
        });
});



