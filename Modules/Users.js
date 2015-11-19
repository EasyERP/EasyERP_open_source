// JavaScript source code
/**
 * @module User
 */
var Users = function (mainDb, models) {

    var mongoose = require('mongoose');
    var logWriter = require('../helpers/logWriter.js');
    var crypto = require('crypto');
    var userSchema = mongoose.Schemas['User'];
    var savedFiltersSchema = mongoose.Schemas['savedFilters'];
    var dbsObject = mainDb.dbsObject;
    var RESPONSES = require('../constants/responses');
    var _ = require('lodash');

    function getAllUserWithProfile(req, id, response) {
        var res = {};
        var query = models.get(req.session.lastDb, 'Users', userSchema).find({profile: id}, {_id: 0, login: 1});
        query.exec(function (err, result) {
            if (!err) {
                res.count = result.length;
                res.data = result.map(function (item) {
                    return item.login;
                });
                res.isOwnProfile = res.data.indexOf(req.session.uName) != -1;
                response.send(res);
            } else {
                logWriter.log("JobPosition.js getTotalCount JobPositions.find " + err);
                response.send(500, {error: "Can't find JobPositions"});
            }
        });
    };

    function getTotalCount(req, response) {
        var res = {};
        var query = models.get(req.session.lastDb, 'Users', userSchema).find({}, {__v: 0, upass: 0});
        query.exec(function (err, result) {
            if (!err) {
                res['count'] = result.length;
                response.send(res);
            } else {
                logWriter.log("JobPosition.js getTotalCount JobPositions.find " + err);
                response.send(500, {error: "Can't find JobPositions"});
            }
        });
    };

    function checkIfUserLoginUnique(req,login, cb) {
        models.get(req.session.lastDb, 'Users', userSchema).find({login: login}, function (error, doc) {
            try {
                if (error) {
                    cb({error: error});
                    //logWriter.log('User.js create User.find' + error);
                    //result.send(500, {error: 'User.create find error'});
                }
                if (doc.length > 0) {
                    if (doc[0].login === login) {
                        cb({unique: false});
                        //result.send(400, {error: "An user with the same Login already exists"});
                    }
                }
                else if (doc.length === 0) {
                    cb({unique: true});
                }
            }

            catch (error) {
                cb({error: error});
                //logWriter.log("User.js. create Account.find " + error);
                //result.send(500, {error: 'User.create find error'});
            }
        });
    }

    function createUser(req, data, result) {
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
        try {
            var shaSum = crypto.createHash('sha256');

            if (!data) {
                logWriter.log('Person.create Incorrect Incoming Data');
                result.send(400, {error: 'User.create Incorrect Incoming Data'});
            } else {
                checkIfUserLoginUnique(req,data.login, function (res) {
                    if (res.unique) {
                        savetoBd(data);
                    }
                    else if (res.error) {
                        logWriter.log("User.js. create Account.find " + error);
                        result.send(500, {error: 'User.create find error'});
                    } else {
                        result.send(400, {error: "An user with the same Login already exists"});
                    }
                });
            }
            function savetoBd(data) {
                try {
                    var _user = new models.get(req.session.lastDb, 'Users', userSchema)();

                    if (data.profile) {
                        _user.profile = data.profile;
                    }
                    if (data.login) {
                        _user.login = data.login;
                    }
                    if (data.pass) {
                        shaSum.update(data.pass);
                        _user.pass = shaSum.digest('hex');
                    }

                    if (data.email) {
                        _user.email = data.email;
                    }

                    if (data.imageSrc) {
                        _user.imageSrc = data.imageSrc;
                    }

                    _user.save(function (err, result1) {
                        if (err) {
                            logWriter.log("User.js create savetoBd _user.save " + err);
                            result.send(500, {error: 'User.create save error'});
                        } else {
                            result.send(201, {success: 'A new User crate success', id: result1._id});
                        }
                    });

                }
                catch (error) {
                    logWriter.log("User.js create savetoBd" + error);
                    result.send(500, {error: 'User.create save error'});
                }
            }
        }
        catch (exception) {
            logWriter.log("User.js  " + exception);
            result.send(500, {error: 'User.create save error'});
        }
    }

    /**
     * __Type__ `GET`
     *
     * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/logout`
     *
     * This __method__ allows to logout.
     *
     * @method logout
     * @instance
     */
    function login(req, res, next) {
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
         * @property {JSON} Object - Object with data for logining (like in example)
         * @instance
         */
        var data = req.body;
        try {
            if (data) {
                if (data.login || data.email) {
                    models.get(data.dbId, 'Users', userSchema).findOne({$or: [{login: (data.login)/*.toLowerCase()*/}, {email: data.email}]}, function (err, _user) {
                        try {
                            if (_user && _user._id) {
                                var shaSum = crypto.createHash('sha256');
                                shaSum.update(data.pass);
                                if (((_user.login == data.login) || (_user.email == data.login)) && (_user.pass == shaSum.digest('hex'))) {
                                    req.session.loggedIn = true;
                                    req.session.uId = _user._id;
                                    req.session.uName = _user.login;
                                    req.session.lastDb = data.dbId;
                                    req.session.kanbanSettings = _user.kanbanSettings;
                                    var lastAccess = new Date();
                                    req.session.lastAccess = lastAccess;
                                    models.get(data.dbId, 'Users', userSchema).findByIdAndUpdate(_user._id, {$set: {lastAccess: lastAccess}}, {new: true}, function (err, result) {
                                        if (err) {
                                            logWriter.log("User.js. login User.findByIdAndUpdate " + err);
                                        }
                                    });
                                    res.send(200);
                                } else {
                                    res.send(400);
                                }
                            } else {
                                if (err) {
                                    logWriter.log("User.js. login User.find " + err);
                                }
                                res.send(500);
                            }
                        }
                        catch (error) {
                            logWriter.log("User.js. login User.find " + error);
                            res.send(500);
                        }
                    }); //End find method
                } else {
                    res.send(400, {error: "Incorect Incoming Data"});
                }
                //End Validating input data for login
            }
            else {
                res.send(400, {error: "Incorect Incoming Data"});
            }//End If data != null
        }
        catch (exception) {
            logWriter.log("Users.js  login" + exception);
            res.send(500);
        }
    }

    function getUsers(req, response, data) {
        /**
         * __Type__ `GET`
         *
         * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Users`
         *
         * This __method__ allows to get all Users.
         *
         * @method Users
         * @instance
         */
        var res = {};
        res['data'] = [];
        var query = models.get(req.session.lastDb, 'Users', userSchema).find({}, {__v: 0, upass: 0});
        query.populate('profile');
        query.sort({login: 1});
        if (data.page && data.count) {
            query.skip((data.page - 1) * data.count).limit(data.count);
        }
        query.exec(function (err, result) {
            if (err) {
                logWriter.log("Users.js get User.find " + err);
                response.send(500, {error: 'User get DB error'});
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    }

    function getUsersForDd(req, response) {
        var res = {};
        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }
        res['data'] = [];
        var query = models.get(req.session.lastDb, 'Users', userSchema).find();
        query.select("_id login");
        query.sort({login: 1});
        if (data.page && data.count) {
            query.skip((data.page - 1) * data.count).limit(data.count);
        }
        query.exec(function (err, result) {
            if (err) {
                logWriter.log("Users.js get User.find " + err);
                response.send(500, {error: 'User get DB error'});
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    }

    function getUserById(req, id, response) {
        var query = models.get(req.session.lastDb, 'Users', userSchema).findById(id);
        var key;
        var newUserResult = {};
        var savedFilters;

        query.populate('profile')
            .populate('RelatedEmployee', 'imageSrc name fullName')
            .populate('savedFilters._id');

        query.exec(function (err, result) {
            if (err) {
                logWriter.log("Users.js get User.find " + err);
                response.send(500, {error: 'User get DB error'});
            } else {
                if (result && result.toJSON().savedFilters) {
                    savedFilters = result.toJSON().savedFilters;
                    newUserResult = _.groupBy(savedFilters, '_id.contentView');
                }
                response.send({user: result, savedFilters: newUserResult});
            }
        });
    }

    function getFilter(req, response) {
        var res = {};
        res['data'] = [];
        var data = {};
        for (var i in req.query) {
            data[i] = req.query[i];
        }
        var query = models.get(req.session.lastDb, 'Users', userSchema).find({}, {__v: 0, upass: 0});
        if (data.sort) {
            query.sort(data.sort);
        } else {
            query.sort({"lastAccess": -1});
        }
        query.populate('profile');
        query.skip((data.page - 1) * data.count).limit(data.count);
        query.exec(function (err, result) {
            if (err) {
                logWriter.log("Users.js getFilter.find " + err);
                response.send(500, {error: "User get DB error"});
            } else {
                res['data'] = result;
                response.send(res);
            }
        });
    }

    function updateUser(req, _id, data, res, options) {
        try {
            if (options && options.changePass) {

                var shaSum = crypto.createHash('sha256');
                shaSum.update(data.pass);
                data.pass = shaSum.digest('hex');
                models.get(req.session.lastDb, 'Users', userSchema).findById(_id, function (err, result) {

                    if (err) {
                        logWriter.log("User.js update profile.update" + err);
                        res.send(500, {error: 'User.update BD error'});
                    } else {
                        var shaSum = crypto.createHash('sha256');
                        shaSum.update(data.oldpass);
                        var _oldPass = shaSum.digest('hex');
                        if (result.pass == _oldPass) {
                            delete data.oldpass;
                            updateUser();
                        } else {
                            logWriter.log("User.js update Incorect Old Pass");
                            res.send(500, {error: 'Incorect Old Pass'});
                        }
                    }
                });
            } else {
                updateUser();
            }

            function updateUser() {
                var query = {};
                var key = data.key;
                var deleteId = data.deleteId;
                var byDefault = data.byDefault;
                var viewType = data.viewType;
                var id;
                var savedFilters = models.get(req.session.lastDb, 'savedFilters', savedFiltersSchema);
                var filterModel = new savedFilters();

                if (data.changePass) {
                    query = {$set: data};

                    return updateThisUser(_id, query);
                }
                if (data.deleteId) {
                    savedFilters.findByIdAndRemove(deleteId, function (err, result) {
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

                    var byDefault = data.useByDefault;
                    var viewType = data.viewType;
                    var newSavedFilters = [];

                    filterModel.save(function (err, result) {
                        if (err) {
                            return console.log('error save filter');
                        }

                        if (result) {
                            id = result.get('_id');

                            if (byDefault) {
                                models.get(req.session.lastDb, 'Users', userSchema).findById(_id, {savedFilters: 1}, function (err, result) {
                                    if (err) {
                                        return next(err);
                                    }
                                    var savedFilters = result.toJSON().savedFilters ? result.toJSON().savedFilters : [];

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

                function updateThisUser(_id, query) {

                    checkIfUserLoginUnique(req,query.login, function (resp) {
                        if (resp.unique) {
                            models.get(req.session.lastDb, 'Users', userSchema).findByIdAndUpdate(_id, query, {new: true}, function (err, result) {
                                if (err) {
                                    return console.log(err);
                                }
                                req.session.kanbanSettings = result.kanbanSettings;
                                if (data.profile && (result._id == req.session.uId)) {
                                    res.status(200).send({success: result, logout: true});
                                } else {
                                    res.status(200).send({success: result});
                                }
                            });
                        } else if (resp.error) {
                            logWriter.log("User.js. create Account.find " + error);
                            result.send(500, {error: 'User.create find error'});
                        } else {
                            result.send(400, {error: "An user with the same Login already exists"});
                        }

                    })

                }

            }
        }

        catch
            (exception) {
            logWriter.log("Profile.js update " + exception);
            res.send(500, {error: 'User.update BD error'});
        }
    }

    function removeUser(req, _id, res) {
        if (req.session.uId == _id) {
            res.send(400, {error: 'You cannot delete current user'});
        }
        else {
            models.get(req.session.lastDb, 'Users', userSchema).remove({_id: _id}, function (err, result) {
                if (err) {
                    logWriter.log("Users.js remove user.remove " + err);
                    res.send(500, {error: 'User.remove BD error'});

                } else {
                    res.send(200, {success: 'User remove success'});
                }
            });
        }
    }

    return {
        getAllUserWithProfile: getAllUserWithProfile,

        getTotalCount: getTotalCount,

        createUser: createUser,

        login: login,

        getUsers: getUsers,

        getUserById: getUserById,

        getFilter: getFilter,

        getUsersForDd: getUsersForDd,

        updateUser: updateUser,

        removeUser: removeUser
    };
};

module.exports = Users;
