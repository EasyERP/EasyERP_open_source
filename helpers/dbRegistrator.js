module.exports = function (mainDb, events, models) {
  var adminDB = mainDb.db.admin();
  var mongoose = require('mongoose');
  var UsersSchema = mongoose.Schemas.User;
  var CustomerSchema = mongoose.Schemas.Customer;
  var integrationsSchema = mongoose.Schemas.integrations;
  var async = require('async');
  var crypto = require('crypto');
  var SaasSchema = mongoose.Schemas.Saas;
  var Saas = mainDb.model('Saas', SaasSchema);
  var RESPONSES = require('../constants/responses');

  var cDb = function (req, targetDb, body, callback) {
    var userName = body.email || 'testUser';
    var email = body.email;
    var password = body.password || body.pass || '';
    var company = body.company;
    var contactName = body.contactName;
    var facebook = body.facebook;
    var linkedin = body.linkedin;
    var token = body.token;
    var shaSum = crypto.createHash('sha256');

    Saas.findOne({ 'users.user': email }, function (err, saasDb) {
      var adminDbConnection;
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

      adminDbConnection =  mongoose.createConnection('localhost', 'admin', {
        user: 'superAdmin',
        pass: process.env.DB_PASS,
        db: { native_parser: true }
      });
      adminDbConnection.once('open', function () {
        adminDbConnection.db.db('admin').command({
          copydb: 1,
          fromdb: 'liveErp',
          todb: targetDb
        }, function (err, result) {
          var dbConnection;

          if (err) {
            return callback(err);
          }
          dbConnection = mongoose.createConnection('localhost', targetDb);
          dbConnection.once('open', function () {
            dbConnection.db.db(targetDb).command({
              createUser: targetDb,
              pwd: targetDb,
              roles: [
                { role: "readWrite", db: targetDb }]
            }, function (err) {
              if (err) {
                return callback(err);
              }

              dbConnection = mongoose.createConnection('localhost', targetDb, {
                db: { native_parser: true },
                user: targetDb,
                pass: targetDb
              });//{ server: { poolSize: 2 } }
              dbConnection.once('open', function () {
                var UserModel = dbConnection.model('Users', UsersSchema);
                var CustomerModel = dbConnection.model('Customers', CustomerSchema);
                var Integrations = dbConnection.model('integrations', integrationsSchema);
                var consumers = require('./rmConsummers')(targetDb, events, models);

                global.rm.loadSubscribers(consumers);

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
                  var customer;

                  if (body.name) {
                    saveObject.name = body.name;
                  }
                  if (body.email) {
                    saveObject.email = body.email;
                  }
                  if (body.company) {
                    saveObject.company = body.company;
                  }

                  customer = new CustomerModel(saveObject);
                  customer.save(function (err, _customer) {
                    if (err) {
                      return callback(err);
                    }

                    callback(null, _customer);
                  });
                };

                dbConnection = mongoose.createConnection('localhost', targetDb, {
                  db: { native_parser: true },
                  user: targetDb,
                  pass: targetDb
                });//{ server: { poolSize: 2 } }
                dbConnection.once('open', function () {

                  UserModel.findOneAndUpdate({ login: 'superAdmin' }, {
                    login: userName,
                    email: email,
                    pass: password,
                    contactName: contactName,
                    facebook: facebook,
                    linkedin: linkedin,
                    'credentials.verify_token': token
                  }, function (err, _user) {
                    if (err) {
                      return callback(err);
                    }

                    Integrations.find({}, function (err, result) {
                      if (err) {
                        return callback(err);
                      }
                      async.each(result, function (el, cb) {
                        var id = el._id;
                        var newModel;

                        el = el.toJSON();

                        delete el._id;

                        el.dbName = targetDb;
                        newModel = new Integrations(el);

                        Integrations.findByIdAndRemove(id, function (err) {
                          if (err) {
                            return cb(err);
                          }

                          console.log(newModel);
                          newModel.save(function (err) {
                            if (err) {
                              return cb(err);
                            }

                            cb();
                          });
                        });
                      }, function (err) {
                        if (err) {
                          return callback(err);
                        }

                        dbConnection.db.collection('settings').update({ dbName: 'CRM' }, { $set: { dbName: targetDb } }, { multi: true }, function (err) {
                          if (err) {
                            return callback(err);
                          }

                          if (_user && _user._id) {
                            customerCreator({
                              name: {
                                first: company
                              }
                            }, _user, function (err, customer) {
                              if (err) {
                                return callback(err);
                              }

                              if (customer && customer._id) {
                                customerCreator({
                                  type: 'Person',
                                  email: email,
                                  accountName: targetDb,
                                  company: customer._id,

                                  name: {
                                    first: body.firstName,
                                    last: body.lastName
                                  }
                                }, _user, function (err, customer) {
                                  if (err) {
                                    return callback(err);
                                  }

                                  if (customer && customer._id) {
                                    req.session.loggedIn = true;
                                    req.session.lastDb = targetDb;
                                    req.session.uId = _user._id;
                                    req.session.uName = userName;
                                    req.session.kanbanSettings = _user.kanbanSettings;

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
                    });

                  });
                });
                dbConnection.on('error', function (error) {
                  dbConnection.close();
                  callback(error);
                  console.log('after create user error', error);
                });
              });
            });
          });
          dbConnection.on('error', function (error) {
            dbConnection.close();
            callback(error);
            console.log('after create user error', error);
          });
        });
      });
      adminDbConnection.on('error', function (error) {
        adminDbConnection.close();
        callback(error);
        console.log('after create user error', error);
      });
    });
  };

  return cDb;
};