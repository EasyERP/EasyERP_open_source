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
//var dbObject = mongoose.createConnection('erp.thinkmobiles.com', 'production', 27017, connectOptions);

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
        isOpportunitie: false,
        customer      : {$ne: null}
    }, function (error, res) {
        if (error) {
            return console.dir(error);
        }

        async.eachLimit(res, 20, function (data, cb) {
            data = data.toJSON();
            if (data.customer) {
                Customer.findById(data.customer, function (err, customer) {
                    if (err) {
                        return cb(err);
                    }

                    if (customer && (customer.type === 'Company')) {
                        Opportunitie.findByIdAndUpdate(data._id, {
                            $set: {
                                company: customer._id,
                                customer : null
                            }
                        }, function (err) {
                            if (err) {
                                return cb(err);
                            }
                            cb();
                        });
                    } else {
                        cb();
                    }
                });
            } else {
                cb();
            }


        }, function (err, res) {
            if (err) {
                console.log(err);
            }
            console.log('good');
        });
    });
});



