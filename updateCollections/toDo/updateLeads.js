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
            var dataComopany;
            var _Company;

            data = data.toJSON();

            function createPersonCustomer(company) {
                var _person;

                if (data.contactName && (data.contactName.first || data.contactName.last)) {
                    _person = {
                        name   : data.contactName,
                        email  : data.email,
                        phones : data.phones,
                        company: company._id,
                       /* social : data.social,*/
                        skype  : data.skype,

                        salesPurchases: {
                            isCustomer : true,
                            salesPerson: data.salesPerson
                        },

                        type     : 'Person',
                        isHidden : true
                    };

                    if (!company.adress){
                        _person.adress = data.adress;
                    }
                    Opportunitie.find({$and: [{$or: [{$and: [{'name.first': data.contactName.first}, {'name.last': data.contactName.last}]}, {_id: data.customer}]}, {type: 'Person'}]}, function (err, _persons) {
                        var _Person;

                        if (err) {
                            return cb(err);
                        }

                        if (_persons.length) {
                            Opportunitie.findByIdAndUpdate(data._id, {customer: _persons[0]._id}, cb);
                        } else {
                            _Person = new Customer(_person);

                            _Person.save(function (err, res) {
                                if (err) {
                                    return cb(err);
                                }
                                Opportunitie.findByIdAndUpdate(data._id, {customer: res._id}, cb);
                            });
                        }
                    });
                } else {
                    cb();
                }
            };

            if (data.tempCompanyField) {
                dataComopany = {
                    name: {
                        first: data.tempCompanyField,
                        last : ''
                    },

                    address: data.address,

                    salesPurchases: {
                        isCustomer : true,
                        salesPerson: data.salesPerson
                    },

                    type     : 'Company',
                    isHidden : true
                };

                Customer.find({$and: [{$or: [{'name.first': data.tempCompanyField}, {_id: data.customer}]}, {type: 'Company'}]}, function (err, companies) {
                    if (err) {
                        return cb(err);
                    }

                    if (companies.length) {
                        Opportunitie.findByIdAndUpdate(data._id, {
                            $set: {
                                company: companies[0]._id
                            }
                        }, function (err) {
                            if (err) {
                                return cb(err);
                            }
                            createPersonCustomer(companies[0].toJSON());
                        });

                    } else {
                        _Company = new Customer(dataComopany);
                        _Company.save(function (err, _res) {
                            if (err) {
                                return cb(err);
                            }

                            Opportunitie.findByIdAndUpdate(data._id, {
                                $set: {
                                    company: _res._id
                                }
                            }, function (err) {
                                if (err) {
                                    return cb(err);
                                }
                                createPersonCustomer(_res.toJSON());
                            });

                        });
                    }
                });

            } else {
                createPersonCustomer({});
            }
        }, function (err, res) {
            if (err) {
                console.log(err);
            }
            console.log('good');
        });
    });
});



