var mongoose = require('mongoose');

var User = function (event, models) {
    "use strict";
    var crypto = require('crypto');
    var userSchema = mongoose.Schemas.User;
    var savedFiltersSchema = mongoose.Schemas.savedFilters;
    var constants = require('../constants/responses');

    var validator = require('../helpers/validator');
    var logger = require('../helpers/logger');

    function checkIfUserLoginUnique(req, login, cb) {
        models.get(req.session.lastDb, 'Users', userSchema).find({login: login}, function (error, doc) {
            if (error) {
                return cb(error);
            }

            if (doc.length > 0) {
                if (doc[0].login === login) {
                    cb();
                }
            } else if (doc.length === 0) {
                cb(null, true);
            }
        });
    }

    function updateUser(req, res, next) {
        var data = req.body;
        var query = {};
        var key = data.key;
        var deleteId = data.deleteId;
        var byDefault = data.byDefault;
        var viewType = data.viewType;
        var _id = req.session.uId;
        var id;
        var SavedFilters = models.get(req.session.lastDb, 'savedFilters', savedFiltersSchema);
        var filterModel = new SavedFilters();
        var newSavedFilters;

        function updateThisUser(_id, query) {
            var saveChanges = function () {
                models.get(req.session.lastDb, 'Users', userSchema).findByIdAndUpdate(_id, query, {new: true}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    req.session.kanbanSettings = result.kanbanSettings;

                    if (data.profile && (result._id === req.session.uId)) {
                        res.status(200).send({success: result, logout: true});
                    } else {
                        res.status(200).send({success: result});
                    }
                });
            };

            if (query.$set && query.$set.login) {
                checkIfUserLoginUnique(req, query.$set.login, function (err, resp) {
                    if (err) {
                        return next(err);
                    }

                    if (resp) {
                        saveChanges();
                    } else {
                        err = new Error("An user with the same Login already exists");
                        err.status = 400;

                        next(err);
                    }
                });
            } else {
                saveChanges();
            }

        }

        if (data.changePass) {
            query = {$set: data};

            return updateThisUser(_id, query);
        }
        if (data.deleteId) {
            SavedFilters.findByIdAndRemove(deleteId, function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    id = result.get('_id');
                    query = {
                        $pull: {
                            'savedFilters': {
                                _id      : deleteId,
                                byDefault: byDefault,
                                viewType : viewType
                            }
                        }
                    };

                    updateThisUser(_id, query);
                }
            });
            return;
        }
        if (data.filter && data.key) {

            filterModel.contentView = key;
            filterModel.filter = data.filter;

            byDefault = data.useByDefault;
            viewType = data.viewType;
            newSavedFilters = [];

            filterModel.save(function (err, result) {
                if (err) {
                    return console.log('error save filter');
                }

                if (result) {
                    id = result.get('_id');

                    if (byDefault) {
                        models.get(req.session.lastDb, 'Users', userSchema).findById(_id, {savedFilters: 1}, function (err, result) {
                            var savedFilters;

                            if (err) {
                                return next(err);
                            }
                            savedFilters = result.toJSON().savedFilters || [];

                            savedFilters.forEach(function (filter) {
                                if (filter.byDefault === byDefault) {
                                    filter.byDefault = '';
                                }
                            });

                            savedFilters.push({
                                _id      : id,
                                byDefault: byDefault,
                                viewType : viewType
                            });

                            query = {$set: {'savedFilters': savedFilters}};

                            updateThisUser(_id, query);
                        });
                    } else {
                        newSavedFilters = {
                            _id      : id,
                            byDefault: byDefault,
                            viewType : viewType
                        };

                        query = {$push: {'savedFilters': newSavedFilters}};

                        updateThisUser(_id, query);
                    }

                }
            });
            return;
        }

        query = {$set: data};
        updateThisUser(_id, query);
    }

    /**
     * __Type__ `POST`
     *
     * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/login`
     *
     * This __method__ allows to login.
     * @example {
         *     dbId: "CRM",
         *     login: "Alex"
         *     pass: "777777"
         * }
     * @method login
     * @property {JSON} Object - Object with data for login (like in example)
     * @instance
     */
    this.login = function (req, res, next) {
        var data = req.body;
        var UserModel = models.get(data.dbId, 'Users', userSchema);
        var err;
        var queryObject;

        if ((data.login || data.email) && data.pass) {
            queryObject = {
                $or: [
                    {
                        login: {$regex: data.login, $options: 'i'}
                    }, {
                        email: {$regex: data.login, $options: 'i'}
                    }
                ]
            };
            UserModel.findOne(queryObject, {login: 1, pass: 1}, function (err, _user) {
                var shaSum = crypto.createHash('sha256');
                var lastAccess;

                shaSum.update(data.pass);

                if (err) {
                    return next(err);
                }

                if (!_user || !_user._id || _user.pass !== shaSum.digest('hex')) {
                    err = new Error(constants.BAD_REQUEST);
                    err.status = 400;

                    return next(err);
                }

                req.session.loggedIn = true;
                req.session.uId = _user._id;
                req.session.uName = _user.login;
                req.session.lastDb = data.dbId;
                req.session.kanbanSettings = _user.kanbanSettings;

                lastAccess = new Date();
                req.session.lastAccess = lastAccess;

                UserModel.findByIdAndUpdate(_user._id, {$set: {lastAccess: lastAccess}}, {new: true}, function (err) {
                    if (err) {
                        logger.error(err);
                    }
                });

                res.send(200);
            });
        } else {
            err = new Error(constants.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }
    };

    /**
     * __Type__ `POST`
     *
     * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Users`
     *
     * This __method__ allows to create __User__
     * @example  Object for request: {
	     *    "pass" : "777777",
	     *    "email" : "Alex@mail.com",
		 *    "login" : "Alex",
         *    "imageSrc" : ""
         *   }
     *
     * @example Response example: {
         *      "success":"A new User crate success",
         *      "id":"55df03676774745332000005"
         *     }
     * @method Users
     * @property {JSON} Object - Object with data to create User (like in example)
     * @instance
     */
    this.create = function(req, res, next){
        var UserModel = models.get(req.session.lastDb, 'Users', userSchema);
        var body = req.body;
        var shaSum = crypto.createHash('sha256');
        var err;
        var user;

        if(!validator.validUserBody(body)){
            err = new Error();
            err.status = 404;

            return next(err);
        }

        body = validator.parseUserBody(body);
        shaSum.update(body.pass);
        body.pass = shaSum.digest('hex');

        user = new UserModel(body);
        user.save(function (err, user) {
            if (err) {
                return next(err);
            }

            res.status(201).send({success: 'A new User crate success', id: user._id});
        });
    };

    this.putchModel = function (req, res, next) {
        var options = {};
        var data = req.body;
        var _id = req.session.uId;
        var shaSum;
        var _oldPass;

        if (req.body.oldpass && req.body.pass) {
            options.changePass = true;
        }

        if (options && options.changePass) {
            shaSum = crypto.createHash('sha256');
            shaSum.update(data.pass);
            data.pass = shaSum.digest('hex');
            models.get(req.session.lastDb, 'Users', userSchema).findById(_id, function (err, result) {

                if (err) {
                    return next(err);
                }

                shaSum = crypto.createHash('sha256');
                shaSum.update(data.oldpass);
                _oldPass = shaSum.digest('hex');

                if (result.pass === _oldPass) {
                    delete data.oldpass;

                    updateUser(req, res, next);
                } else {
                    err = new Error("Incorrect Old Pass");
                    err.status = 400;
                    next(err);
                }
            });
        } else {
            updateUser(req, res, next);
        }
    };

    this.remove = function(req, res, next){
        var id = req.params.id;
        var err;

        if (req.session.uId === id) {
            err = new Error('You cannot delete current user');
            err.status = 403;

            return next(err);
        }

        models.get(req.session.lastDb, 'Users', userSchema).remove({_id: id}, function (err) {
            if (err) {
                return next(err);

            }

            res.status(200).send({success: 'User remove success'});
        });
    };

    this.getByProfile = function(req, res, next){
        var profileId = req.params.id;
        var response = {};
        var UserModel = models.get(req.session.lastDb, 'Users', userSchema);

        UserModel.find({profile: profileId}, {_id: 0, login: 1}, function (err, result) {
            if (err) {
                return next(err);
            }

            response.count = result.length;
            response.data = result.map(function (item) {
                return item.login;
            });
            response.isOwnProfile = response.data.indexOf(req.session.uName) !== -1;

            res.status(200).send(response);
        });
    };
};

module.exports = User;