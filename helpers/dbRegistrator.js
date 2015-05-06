/**
 * Created by Roman on 02.04.2015.
 */
module.exports = function (mainDb) {
    var adminDB = mainDb.db.admin();
    var mongoose = require('mongoose');
    var UsersSchema = mongoose.Schemas['User'];
    var CustomerSchema = mongoose.Schemas['Customer'];
    var async = require('async');
    var crypto = require('crypto');
    var SaasSchema = mongoose.Schemas['Saas'];
    var Saas = mainDb.model('Saas', SaasSchema);
    var RESPONSES = require('../constants/responses');

    var cDb = function (req, targetDb, body, callback) {
        var userName = body.userName || 'testUser';
        var email = body.email;
        var password = body.password;
        var company = body.company;
        var shaSum = crypto.createHash('sha256');

        Saas.findOne({'users.user': email}, function (err, saasDb) {
            if (err) {
                return callback(err);
            }
            if (saasDb && saasDb.id) {
                err = new Error(RESPONSES.IS_ALREADY_USED);
                err.status = 400;
                return callback(err);
            }

            shaSum.update(password);
            password = shaSum.digest('hex');

            console.log('Request for new db ' + targetDb);
            adminDB.command({
                copydb: 1,
                fromdb: "liveErp",
                todb: targetDb
            }, function (err, result) {
                var dbConnection;

                if (err) {
                    return callback(err);
                }

                dbConnection = mongoose.createConnection('localhost', targetDb, {server: {poolSize: 3}});//{ server: { poolSize: 2 } }
                dbConnection.once('open', function () {
                    var UserModel = dbConnection.model('Users', UsersSchema);
                    var CustomerModel = dbConnection.model('Customers', CustomerSchema);

                    var customerCreator = function (body, user, callback) {
                        var type = body.type || 'Company';
                        var saveObject = {
                            type: type,
                            isOwn: true,
                            name: {
                                first: body.name
                            },
                            groups: {
                                owner: user._id
                            },
                            createdBy: {
                                user: user._id
                            },
                            editedBy: {
                                user: user._id
                            }
                        };

                        if (body.name) {
                            saveObject.name = body.name;
                        }
                        if (body.email) {
                            saveObject.email = body.email;
                        }
                        if (body.company) {
                            saveObject.company = body.company;
                        }

                        var customer = new CustomerModel(saveObject);

                        customer.save(callback);
                    };

                    UserModel.findOneAndUpdate({login: 'superAdmin'}, {
                        login: userName,
                        email: email,
                        pass: password
                    }, function (err, _user) {
                        if (err) {
                            callback(err);
                        } else if (_user && _user._id) {
                            customerCreator({
                                name: {
                                    first: company
                                }
                            }, _user, function (err, customer) {
                                if (err) {
                                    return callback(err);
                                } else if (customer && customer._id) {
                                    customerCreator({
                                        type: 'Person',
                                        name: {
                                            first: body.firstName,
                                            last: body.lastName
                                        },
                                        email: email,
                                        accountName: targetDb,
                                        company: customer._id
                                    }, _user, function (err, customer) {
                                        if (err) {
                                            return callback(err);
                                        } else if (customer && customer._id) {
                                            req.session.loggedIn = true;
                                            req.session.lastDb = targetDb;
                                            req.session.uId = _user._id;
                                            req.session.uName = userName;

                                            callback(null, dbConnection);
                                        } else {
                                            err = new Error('Can\'t find User');
                                            callback(err);
                                        }
                                    });
                                } else {
                                    err = new Error('Can\'t find Company');
                                    callback(err);
                                }
                            });
                        } else {
                            err = new Error('Can\'t find User');
                            callback(err);
                        }
                    });
                });
                dbConnection.on('error', function (error) {
                    callback(error);
                });
            });

        });
    };

    return cDb;
};