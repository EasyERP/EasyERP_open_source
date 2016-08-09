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

var dbObject = mongoose.createConnection('144.76.56.111', 'pavlodb', 28017, connectOptions);
//var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);

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

    Opportunitie.find({
        isOpportunitie: false
    }, function (error, res) {
        if (error) {
            return console.dir(error);
        }

        async.eachLimit(res, 20, function (data, cb) {
            var updateObject;

            data = data.toJSON();

            Customer.find({
                    'name.first': data.contactName.first,
                    'name.last': data.contactName.last,
                    isHidden   : false
                }, function (err, person) {
                    if (err) {
                        return cb(err);
                    }

                    if (!person.length) {
                        Customer.find({'name.last': data.contactName.last, isHidden: false}, function (err, company) {
                            if (err) {
                                return cb(err);
                            }

                            if (company.length) {
                                Opportunitie.findByIdAndUpdate(data._id, {
                                    $set: {
                                        customer: data.company,
                                        company : null
                                    }
                                }, function (err) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    cb();
                                });
                            } else {

                                Opportunitie.findByIdAndUpdate(data._id, {
                                    $set: {
                                        customer: null,
                                        company : null
                                    }
                                }, function (err) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    cb();
                                });
                            }
                        })

                    } else {
                        cb();
                    }

                }
            );

        }, function (err, res) {
            if (err) {
                console.log(err);
            }
            console.log('good');
        });
    });
});



