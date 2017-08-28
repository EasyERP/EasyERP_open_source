var mongoose = require('mongoose');

var User = function (event, models) {
    'use strict';
    var _ = require('lodash');
    var crypto = require('crypto');
    var async = require('async');
    var userSchema = mongoose.Schemas.User;
    var savedFiltersSchema = mongoose.Schemas.savedFilters;
    var constants = require('../constants/responses');
    var REQ_EXP_CONSTANTS = require('../constants/reqularExpressions');
    var mainConstants = require('../constants/mainConstants');
    var pageHelper = require('../helpers/pageHelper');
    var Mailer = require('../helpers/mailer');
    var mailer = new Mailer();
    var validator = require('../helpers/validator');
    var logger = require('../helpers/logger');
    var tracker = require('../helpers/tracker.js');
    var ObjectId = mongoose.Types.ObjectId;
    var geoip = require('geoip-lite');

    var UserService = require('../services/user')(models);
    var EmployeeService = require('../services/employee')(models);

    function checkIfUserLoginUnique(req, login, cb, db) {
        var db = db || req.session.lastDb;
        models.get(db, 'Users', userSchema).find({login: login}, function (error, doc) {
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

    function loginFacebook(configs, options, cb) {
        var userId = configs.userId;
        var dbId = configs.dbId;

        UserService.findOne({
                dbName: dbId,
                query : {
                    $or: [{
                        'facebook.userId': userId
                    }, {
                        login: options.login
                    }, {
                        email: options.email
                    }]
                }
            },
            function (err, user) {
                if (err) {
                    return cb(err);
                }

                if (user) {
                    return cb(null, user);
                }

                UserService.create({
                    login            : options.login,
                    email            : options.email,
                    contactName      : options.contactName,
                    'facebook.userId': userId,
                    profile          : '1387275598000',
                    dbName           : dbId,
                    stopEmailing     : true
                }, cb);
            }
        );
    }

    function loginGoogle(configs, options, cb) {
        var userId = configs.userId;
        var dbId = configs.dbId;

        UserService.findOne({
                dbName: dbId,
                query : {
                    $or: [{
                        'google.userId': userId
                    }, {
                        login: options.login
                    }, {
                        email: options.email
                    }]
                }
            },
            function (err, user) {
                if (err) {
                    return cb(err);
                }

                if (user) {
                    return cb(null, user);
                }

                UserService.create({
                    login          : options.login,
                    email          : options.email,
                    contactName    : options.contactName,
                    'google.userId': userId,
                    profile        : '1387275598000',
                    dbName         : dbId,
                    stopEmailing   : true
                }, cb);
            }
        );
    }

    function loginLinkedin(configs, options, cb) {
        var userId = configs.userId;
        var profileUrl = configs.profileUrl;
        var dbId = configs.dbId;
        var country = configs.country;

        UserService.findOne({
            dbName: dbId,
            query : {
                $or: [{
                    'linkedin.userId': userId
                }, {
                    login: options.login
                }, {
                    email: options.email
                }]
            }
        }, function (err, user) {
            if (err) {
                return cb(err);
            }

            if (user) {
                return cb(null, user);
            }

            UserService.create({
                login                : options.login,
                email                : options.email,
                contactName          : options.contactName,
                'linkedin.userId'    : userId,
                'linkenin.profileUrl': profileUrl,
                'linkenin.country'   : country,
                profile              : '1387275598000',
                dbName               : dbId,
                stopEmailing         : true
            }, cb);
        });
    }

    this.loginSocial = function (req, res, next) {
        var body = req.body;
        var userId = body.userId;
        var flag = body.flag;
        var dbId = body.dbId;
        var email = body.email;
        var login = body.login;
        var session = req.session;
        var first = body.first;
        var last = body.last;
        var UserModel = models.get(dbId, 'Users', userSchema);
        var ip = req.heades ? req.headers['x-real-ip'] : req.ip;
        var profileUrl;
        var country;

        function cb(err, result) {
            if (err) {
                return next(err);
            }

            createSession({
                session  : session,
                _user    : result,
                UserModel: UserModel,
                data     : {
                    login      : login,
                    email      : email,
                    dbId       : dbId,
                    contactName: {
                        first: first,
                        last : last
                    }
                },
                ip       : ip
            }, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send();
            });
        }

        switch (flag) {
            case 'google': {
                loginGoogle({
                    userId: userId,
                    dbId  : dbId
                }, {
                    login       : login,
                    contactName : {
                        first: first,
                        last : last
                    },
                    email       : email,
                    stopEmailing: false
                }, cb);

                break;
            }
            case 'facebook': {
                loginFacebook({
                    userId: userId,
                    dbId  : dbId
                }, {
                    login       : login,
                    contactName : {
                        first: first,
                        last : last
                    },
                    email       : email,
                    stopEmailing: false
                }, cb);

                break;
            }
            case 'linkedin': {
                profileUrl = body.profileUrl;
                country = body.country;

                loginLinkedin({
                    userId    : userId,
                    dbId      : dbId,
                    profileUrl: profileUrl,
                    country   : country
                }, {
                    login       : login,
                    contactName : {
                        first: first,
                        last : last
                    },
                    email       : email,
                    stopEmailing: false
                }, cb);

                break;
            }
        }
    };

    function updateUser(req, res, next) {
        var data = req.body;
        var query = {};
        var newFilter = data.newFilter;
        var deleteFilter = data.deleteFilter;
        var byDefaultUpdate = data.byDefault;
        var _id = req.session.uId;
        var id = req.params.id;
        var SavedFilters = models.get(req.session.lastDb, 'savedFilters', savedFiltersSchema);
        var waterFallTasks = [saveFilter, getUpdateFilterQuery];

        function saveFilter(callback) {
            var filterModel = new SavedFilters();

            filterModel.name = newFilter.name;
            filterModel.filter = newFilter.filter;

            filterModel.save(function (err, result) {
                var customError;

                if (err) {
                    customError = new Error();
                    customError.status = 400;
                    customError.message = 'Filter hasn\'t been saved';

                    return callback(customError);
                }

                callback(null, result);
            });
        }

        function getUpdateFilterQuery(filterModel, callback) {
            var byDefault;
            var contentType;
            var newSavedFilters;

            if (filterModel && typeof filterModel !== 'function') {
                byDefault = newFilter.useByDefault;
                contentType = newFilter.key;
            } else {
                callback = filterModel;
                contentType = byDefaultUpdate.contentType;
            }

            if (byDefault || byDefaultUpdate) {
                models
                    .get(req.session.lastDb, 'Users', userSchema)
                    .findById(_id, {savedFilters: 1}, function (err, result) {
                        var savedFilters = result.toJSON().savedFilters || [];

                        if (err) {
                            return callback(err);
                        }

                        savedFilters = _.map(savedFilters, function (element) {
                            if (element.contentType === contentType) {
                                element.byDefault = (byDefaultUpdate && byDefaultUpdate._id === element._id.toString()) ? byDefaultUpdate.byDefault : false;
                            }

                            return element;
                        });

                        if (!byDefaultUpdate) {
                            savedFilters.push({
                                _id        : filterModel.get('id'),
                                byDefault  : byDefault,
                                contentType: contentType
                            });
                        }

                        return callback(null, {$set: {savedFilters: savedFilters}});
                    });
            } else {
                newSavedFilters = {
                    _id        : filterModel.get('id'),
                    byDefault  : byDefault,
                    contentType: contentType
                };

                return callback(null, {$push: {savedFilters: newSavedFilters}});
            }
        };

        function updateThisUser(_id, query) {
            var saveChanges = function () {
                models
                    .get(req.session.lastDb, 'Users', userSchema)
                    .findByIdAndUpdate(_id, query, {new: true}, function (err, result) {
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
                        err = new Error('An user with the same Login already exists');
                        err.status = 400;

                        next(err);
                    }
                });
            } else {
                saveChanges();
            }

        }

        if (id && _id !== id) {
            _id = id;
        }

        if (data.changePass) {
            query = {$set: data};

            return updateThisUser(_id, query);
        }

        if (deleteFilter) {
            SavedFilters.findByIdAndRemove(deleteFilter.id, function (err, result) {
                var customError;

                if (err) {
                    customError = new Error();
                    customError.status = 400;
                    customError.message = 'Filter hasn\'t been delete!';

                    return next(customError);
                }

                query = {
                    $pull: {
                        savedFilters: deleteFilter
                    }
                };

                updateThisUser(_id, query);
            });
            return;
        }
        if (newFilter) {
            async.waterfall(waterFallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                updateThisUser(_id, result);
            });

            return;
        }

        if (byDefaultUpdate) {
            waterFallTasks.shift();

            async.waterfall(waterFallTasks, function (err, result) {
                if (err) {
                    return next(err);
                }

                updateThisUser(_id, result);
            });

            return;
        }

        query = {$set: data};
        updateThisUser(_id, query);
    }

    function findUsers(Model, filterObject, sortObject, data, cb) {
        var queryObject = {};
        var query = Model.find(queryObject, filterObject);
        var count;
        var page;

        query.populate('profile');

        if (sortObject) {
            query.sort(sortObject);
        }

        if (data.page && data.count) {
            count = parseInt(data.count, 10);
            page = parseInt(data.page, 10);

            if (isNaN(count)) {
                count = mainConstants.COUNT_PER_PAGE;
            }
            if (isNaN(page)) {
                page = 1;
            }

            query.skip((page - 1) * count).limit(count);
        }

        query.exec(cb);
    }

    /**
     * __Type__ `POST`
     *
     * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/login`
     *
     * This __method__ allows to login.
     * @example {
         *     dbId: 'CRM',
         *     login: 'Alex'
         *     pass: '777777'
         * }
     * @method login
     * @property {JSON} Object - Object with data for login (like in example)
     * @instance
     */

    function createSession(options, cb) {
        var session = options.session;
        var _user = options._user;
        var UserModel = options.UserModel;
        var data = options.data;
        var ip = options.ip;
        var checkPass = options.checkPass;
        var geo = geoip.lookup(ip);
        var shaSum = crypto.createHash('sha256');
        var lastAccess;
        var err;

        shaSum.update(data.pass || '');

        if (err) {
            return cb(err);
        }

        if (!_user || !_user._id || (checkPass && _user.pass !== shaSum.digest('hex'))) {
            err = new Error(constants.INCORRECT);
            err.status = 400;

            tracker.track({
                name       : 'production:login:error',
                status     : 301,
                registrType: process.env.SERVER_TYPE,
                server     : process.env.SERVER_PLATFORM,
                ip         : ip,
                country    : (geo) ? geo.country : '',
                city       : (geo) ? geo.city : '',
                region     : geo ? geo.region : '',
                email      : _user ? _user.email : '', // bug on keymetrics
                login      : _user ? _user.login : '',
                mobilePhone: _user ? _user.mobilePhone : '',
                message    : err.message
            });

            return cb(err);
        }

        if (data.rememberMe === 'true') {
            session.rememberMe = true;
        } else {
            delete session.rememberMe;
            session.cookie.expires = false;
        }

        session.loggedIn = true;
        session.uId = _user._id;
        session.uName = _user.login;
        session.lastDb = data.dbId;
        session.profileId = _user.profile;
        session.kanbanSettings = _user.kanbanSettings;

        lastAccess = new Date();
        session.lastAccess = lastAccess;

        UserModel.findByIdAndUpdate(_user._id, {$set: {lastAccess: lastAccess}}, {new: true}, function (err, user) {
            if (err) {
                logger.error(err);
            }
        });

        cb();

        tracker.track({
            name       : 'production:login:success',
            status     : 301,
            registrType: process.env.SERVER_TYPE,
            server     : process.env.SERVER_PLATFORM,
            ip         : ip,
            country    : (geo) ? geo.country : '',
            city       : (geo) ? geo.city : '',
            region     : geo ? geo.region : '',
            login      : _user.login,
            email      : _user.email,
            mobilePhone: _user ? _user.mobilePhone : '',
            message    : 'loggedIn'
        });
    }

    this.login = function (req, res, next) {
        var data = req.body;
        var UserModel = models.get(data.dbId, 'Users', userSchema);
        var login = data.login || data.email;
        var ip = req.headers ? req.headers['x-real-ip'] : req.ip;
        var err;
        var queryObject;

        ip = ip || '127.0.0.1';

        if (login && data.pass) {
            queryObject = {
                $or: [
                    {
                        login: login
                    }, {
                        email: login
                    }
                ]
            };

            UserModel.findOne(queryObject, {
                login         : 1,
                pass          : 1,
                kanbanSettings: 1,
                profile       : 1,
                email         : 1
            }, function (err, _user) {
                var session = req.session;

                createSession({
                    session  : session,
                    _user    : _user,
                    UserModel: UserModel,
                    data     : data,
                    ip       : ip,
                    checkPass: true
                }, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.send(200);
                });
            });
        } else {
            err = new Error(constants.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }
    };

    this.forgotPassword = function (req, res, next) {
        var data = req.body;
        var UserModel = models.get(data.dbId, 'Users', userSchema);
        var login = data.login || data.email;
        var err;
        var queryObject;

        if (!login) {
            err = new Error(constants.BAD_REQUEST);
            err.status = 400;

            return next(err);
        }

        queryObject = {
            $or: [
                {
                    login: login
                }, {
                    email: login
                }
            ]
        };

        function findUser(waterfallCb) {
            UserModel.findOne(queryObject, {login: 1, email: 1}, function (err, _user) {
                if (err) {
                    return waterfallCb(err);
                }

                if (!_user || !_user._id || !_user.email) {
                    err = new Error(constants.NOT_REGISTERED);
                    err.status = 400;

                    return waterfallCb(err);
                }

                waterfallCb(null, _user);
            });
        }

        function paswordGenerator(_user, waterfallCb) {
            crypto.randomBytes(6, function (err, buffer) {
                var token = buffer.toString('hex');

                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, token, _user);
            });
        }

        function sendMail(token, _user, waterfallCb) {
            mailer.forgotPassword({
                email   : _user.email,
                dateBase: data.dbId,
                password: token
            }, function (err, sent) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, token, _user);
            });
        }

        function updateUser(token, _user, waterfallCb) {
            var shaSum = crypto.createHash('sha256');

            shaSum.update(token);
            token = shaSum.digest('hex');

            UserModel.findByIdAndUpdate(_user._id, {$set: {pass: token}}, {new: true}, function (err, user) {
                if (err) {
                    return waterfallCb(err);
                }

                waterfallCb(null, user);
            });
        }

        async.waterfall([findUser, paswordGenerator, sendMail, updateUser], function (err) {
            if (err) {
                return next(err);
            }

            res.status(200).send();
        });
    };

    /**
     * __Type__ `POST`
     *
     * Base ___url___ for build __requests__ is `http:/192.168.88.133:8089/Users`
     *
     * This __method__ allows to create __User__
     * @example  Object for request: {
	     *    'pass' : '777777',
	     *    'email' : 'Alex@mail.com',
		 *    'login' : 'Alex',
         *    'imageSrc' : ''
         *   }
     *
     * @example Response example: {
         *      'success':'A new User crate success',
         *      'id':'55df03676774745332000005'
         *     }
     * @method Users
     * @property {JSON} Object - Object with data to create User (like in example)
     * @instance
     */
    this.create = function (req, res, next) {
        var body = req.body;
        var err;

        if (!validator.validUserBody(body)) {
            err = new Error();
            err.status = 404;

            return next(err);
        }

        body = validator.parseUserBody(body);
        body.dbName = req.session.lastDb;

        body.stopEmailing = true;

        UserService.create(body, function (err, user) {
            if (err) {
                return next(err);
            }

            res.status(201).send({success: 'A new User crate success', id: user._id});
        });
    };

    this.verify = function (req, res, next) {
        var query = req.query;
        var token = query.token;
        var userDbName = query.db;
        var err;

        UserService.findOneAndUpdate({'credentials.verify_token': token}, {$set: {'credentials.verify_token': ''}}, {dbName: userDbName}, function (err, result) {
            if (err || (result && result.credentials && result.credentials.verify_token)) {
                err = new Error('This token is not valid!');
                err.status = 400;

                return next(err);
            }

            res.redirect('/#login');
        });
    };

    this.createWithVerify = function (req, res, next) {
        var passReqExp = REQ_EXP_CONSTANTS.password;
        var body = req.body;
        var pass = body.pass;
        var err;

        /*if (!validator.validNewUserBody(body)) {
         err = new Error('User did not pass validation');
         err.status = 404;

         return next(err);
         }*/

        if (!!body.email.match(pass)) {
            return next(new Error(constants.IDENTICAL_EMAIL_AND_PASSWORD));
        }

        if (!passReqExp.test(pass)) {
            return next(new Error(constants.WEAK_PASS));
        }

        body = validator.parseUserBody(body);
        body.dbName = body.dbId;

        checkIfUserLoginUnique(req, body.login, function (err, result) {
            if (err) {
                return next(err);
            }

            if (result) {
                body.contactName = {
                    first: body.first,
                    last : body.last
                };

                UserService.createWithVerify(body, function (err, user) {
                    if (err) {
                        return next(err);
                    }

                    res.status(201).send({success: 'A new User create success', id: user._id});
                });
            } else {
                err = new Error(constants.IS_ALREADY_USED);
                err.status = 400;

                next(err);
            }
        }, body.dbId);
    };

    this.putchModel = function (req, res, next) {
        var options = {};
        var data = req.body;
        var _id = req.session.uId;
        var id = req.params.id;
        var UserModel = models.get(req.session.lastDb, 'Users', userSchema);
        var shaSum;
        var _oldPass;

        _id = (id && _id !== id) ? id : _id;

        if (req.body.oldpass && req.body.pass) {
            options.changePass = true;
        }

        if (options && options.changePass) {
            shaSum = crypto.createHash('sha256');

            if (!REQ_EXP_CONSTANTS.password.test(req.body.pass)) {
                return next(new Error(constants.WEAK_PASS));
            }

            shaSum.update(data.pass);
            data.pass = shaSum.digest('hex');

            UserModel.findById(_id, function (err, result) {
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
                    err = new Error('Incorrect Old Pass');
                    err.status = 400;
                    next(err);
                }
            });
        } else {
            updateUser(req, res, next);
        }
    };

    this.remove = function (req, res, next) {
        var id = req.params.id;
        var dbName = req.session.lastDb;
        var err;

        if (req.session.uId === id) {
            err = new Error('You cannot delete current user');
            err.status = 403;

            return next(err);
        }

        UserService.findByIdAndRemove(id, {
            dbName: dbName
        }, function (err, _user) {
            var _id;

            if (err) {
                return next(err);

            }

            if (_user && _user.relatedEmployee) {
                _id = _user.relatedEmployee;

                EmployeeService.findByIdAndUpdate(_id, {$set: {relatedUser: null}}, {
                    dbName: dbName
                }, function (err, _employee) {
                    if (err) {
                        return next(err);

                    }

                    res.status(200).send({success: 'User remove success'});
                });
            } else {
                res.status(200).send({success: 'User remove success'});
            }
        });
    };

    this.bulkRemove = function (req, res, next) {
        var body = req.body || {ids: []};
        var dbName = req.session.lastDb;
        var ids = body.ids;

        UserService.findAndRemove({_id: {$in: ids}}, {
            dbName: dbName
        }, function (err) {
            if (err) {
                return next(err);
            }

            EmployeeService.findAndUpdate({
                relatedUser: {
                    $in: ids
                }
            }, {
                $set: {
                    relatedUser: null
                }
            }, {

                dbName: dbName,
                multi : true
            }, function (err, updated) {
                if (err) {
                    return next(err);

                }

                res.status(200).send({success: 'User remove success'});
            });
        });
    };

    this.getByProfile = function (req, res, next) {
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

    this.getForDd = function (req, res, next) {
        // ToDo in feature add count for pagination
        var response = {};
        var data = req.query;
        var UserModel = models.get(req.session.lastDb, 'Users', userSchema);

        findUsers(UserModel, {login: 1, email: 1}, {login: 1}, data, function (err, users) {
            if (err) {
                return next(err);
            }

            response.data = users;
            res.status(200).send(response);
        });
    };

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
    /* this.getAll = function (req, res, next) {
     var response = {};
     var data = req.query;
     var UserModel = models.get(req.session.lastDb, 'Users', userSchema);

     findUsers(UserModel, {__v: 0, pass: 0}, {login: 1}, data, function (err, result) {
     if (err) {
     return next(err);
     }

     response.data = result;
     res.status(200).send(response);
     });
     };*/

    this.getAll = function (req, res, next) {
        var response = {};
        var data = req.query;
        var paginationObject = pageHelper(data);
        var limit = paginationObject.limit;
        var sort;
        var skip = paginationObject.skip;
        var UserModel = models.get(req.session.lastDb, 'Users', userSchema);
        var key;
        var aggregateQuery;

        if (data.sort) {
            key = Object.keys(data.sort)[0];
            data.sort[key] = parseInt(data.sort[key], 10);

            sort = data.sort;
        } else {
            sort = {
                lastAccess: -1
            };
        }

        aggregateQuery = [
            {
                $lookup: {
                    from        : 'Employees',
                    localField  : 'relatedEmployee',
                    foreignField: '_id',
                    as          : 'relatedEmployee'
                }
            },
            {
                $project: {
                    kanbanSettings : 1,
                    credentials    : 1,
                    email          : 1,
                    login          : 1,
                    imageSrc       : 1,
                    lastAccess     : 1,
                    savedFilters   : 1,
                    total          : 1,
                    profile        : 1,
                    relatedEmployee: {$arrayElemAt: ['$relatedEmployee', 0]}
                }
            },
            {
                $lookup: {
                    from        : 'Department',
                    localField  : 'relatedEmployee.department',
                    foreignField: '_id',
                    as          : 'department'
                }
            },
            {
                $project: {
                    kanbanSettings: 1,
                    credentials   : 1,
                    email         : 1,
                    login         : 1,
                    imageSrc      : 1,
                    lastAccess    : 1,
                    savedFilters  : 1,
                    total         : 1,
                    profile       : 1,
                    department    : {$arrayElemAt: ['$department', 0]}
                }
            },
            {
                $project: {
                    kanbanSettings: 1,
                    credentials   : 1,
                    email         : 1,
                    login         : 1,
                    imageSrc      : 1,
                    lastAccess    : 1,
                    savedFilters  : 1,
                    total         : 1,
                    profile       : 1,
                    department    : '$department.name'
                }
            }, {
                $lookup: {
                    from        : 'Profile',
                    localField  : 'profile',
                    foreignField: '_id',
                    as          : 'profile'
                }
            },
            {
                $group: {
                    _id  : null,
                    total: {$sum: 1},
                    root : {$push: '$$ROOT'}
                }
            },
            {
                $unwind: '$root'
            },
            {
                $project: {
                    _id           : '$root._id',
                    kanbanSettings: '$root.kanbanSettings',
                    credentials   : '$root.credentials',
                    email         : '$root.email',
                    login         : '$root.login',
                    imageSrc      : '$root.imageSrc',
                    lastAccess    : '$root.lastAccess',
                    savedFilters  : '$root.savedFilters',
                    department    : '$root.department',
                    total         : 1,
                    profile       : {
                        $arrayElemAt: ['$root.profile', 0]
                    }
                }
            },
            {
                $sort: sort
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }

        ];

        UserModel.aggregate(aggregateQuery, function (err, result) {
            var count;
            var firstElement;

            if (err) {
                return next(err);
            }

            firstElement = result[0];
            count = firstElement && firstElement.total ? firstElement.total : 0;

            response.total = count;
            response.data = result;

            res.status(200).send(response);
        });
    };

    this.getById = function (req, res, next) {
        var id = req.params.id || req.session.uId;
        var UserModel = models.get(req.session.lastDb, 'Users', userSchema);
        var query;

        var pipeLine = [];

        pipeLine.push({
            $match: {
                _id: ObjectId(id)
            }
        });

        pipeLine.push({
            $lookup: {
                from        : 'Profile',
                localField  : 'profile',
                foreignField: '_id',
                as          : 'profile'
            }
        });

        pipeLine.push({
            $lookup: {
                from        : 'Employees',
                localField  : 'relatedEmployee',
                foreignField: '_id',
                as          : 'relatedEmployee'
            }
        });

        pipeLine.push({
            $project: {
                _id            : '$_id',
                imageSrc       : '$imageSrc',
                login          : '$login',
                email          : '$email',
                kanbanSettings : '$kanbanSettings',
                lastAccess     : '$lastAccess',
                credentials    : '$credentials',
                profile        : {$arrayElemAt: ['$profile', 0]},
                relatedEmployee: {$arrayElemAt: ['$relatedEmployee', 0]},
                savedFilters   : '$savedFilters',
                imports        : '$imports',
                mobilePhone    : '$mobilePhone',
                favorite       : '$favorite',
                website        : '$website',
                company        : '$company'
            }
        });

        pipeLine.push({
            $project: {
                _id           : '$_id',
                imageSrc      : '$imageSrc',
                login         : '$login',
                email         : '$email',
                kanbanSettings: '$kanbanSettings',
                lastAccess    : '$lastAccess',
                credentials   : '$credentials',
                favorite      : '$favorite',
                mobilePhone   : '$mobilePhone',
                website       : '$website',
                company       : '$company',

                profile: {
                    _id          : '$profile._id',
                    profileName  : '$profile.profileName',
                    profileAccess: '$profile.profileAccess'
                },

                relatedEmployee: {
                    _id     : '$relatedEmployee._id',
                    imageSrc: '$relatedEmployee.imageSrc',
                    name    : '$relatedEmployee.name',
                    fullName: '$relatedEmployee.fullName'
                },

                savedFilters: '$savedFilters',
                imports     : '$imports'
            }
        });

        pipeLine.push({
            $unwind: {
                path                      : '$savedFilters',
                preserveNullAndEmptyArrays: true
            }
        });

        pipeLine.push({
            $lookup: {
                from        : 'savedFilters',
                localField  : 'savedFilters._id',
                foreignField: '_id',
                as          : 'savedFilters._id'
            }
        });

        pipeLine.push({
            $project: {
                _id            : '$_id',
                imageSrc       : '$imageSrc',
                login          : '$login',
                email          : '$email',
                kanbanSettings : '$kanbanSettings',
                lastAccess     : '$lastAccess',
                credentials    : '$credentials',
                profile        : '$profile',
                relatedEmployee: '$relatedEmployee',
                favorite       : '$favorite',
                mobilePhone    : '$mobilePhone',
                website        : '$website',
                company        : '$company',
                savedFilters   : {
                    _id        : {$arrayElemAt: ['$savedFilters._id', 0]},
                    byDefault  : '$savedFilters.byDefault',
                    contentType: '$savedFilters.contentType'
                },

                imports: '$imports'
            }
        });

        pipeLine.push({
            $group: {
                _id: {
                    _id        : '$_id',
                    contentType: '$savedFilters.contentType'
                },

                imageSrc       : {$first: '$imageSrc'},
                login          : {$first: '$login'},
                email          : {$first: '$email'},
                kanbanSettings : {$first: '$kanbanSettings'},
                lastAccess     : {$first: '$lastAccess'},
                credentials    : {$first: '$credentials'},
                profile        : {$first: '$profile'},
                relatedEmployee: {$first: '$relatedEmployee'},
                mobilePhone    : {$first: '$mobilePhone'},
                favorite       : {$first: '$favorite'},
                website        : {$first: '$website'},
                company        : {$first: '$company'},
                savedFilters   : {
                    $addToSet: {
                        _id      : '$savedFilters._id._id',
                        name     : '$savedFilters._id.name',
                        filters  : '$savedFilters._id.filter',
                        byDefault: '$savedFilters.byDefault'
                    }
                },

                imports: {$first: '$imports'}
            }
        });

        pipeLine.push({
            $group: {
                _id            : '$_id._id',
                imageSrc       : {$first: '$imageSrc'},
                login          : {$first: '$login'},
                email          : {$first: '$email'},
                kanbanSettings : {$first: '$kanbanSettings'},
                lastAccess     : {$first: '$lastAccess'},
                credentials    : {$first: '$credentials'},
                profile        : {$first: '$profile'},
                relatedEmployee: {$first: '$relatedEmployee'},
                mobilePhone    : {$first: '$mobilePhone'},
                favorite       : {$first: '$favorite'},
                website        : {$first: '$website'},
                company        : {$first: '$company'},
                savedFilters   : {
                    $addToSet: {
                        contentType: '$_id.contentType',
                        filter     : '$savedFilters'
                    }
                },

                imports: {$first: '$imports'}
            }
        });

        UserModel
            .aggregate(pipeLine)
            .exec(function (err, result) {
                var savedFilters;

                if (err) {
                    return next(err);
                }

                result = result[0];

                savedFilters = result && result.savedFilters ? result.savedFilters : []; // bug on keymetrics

                savedFilters = _.groupBy(savedFilters, 'contentType');

                if (result) {
                    delete result.savedFilters;
                }

                res.status(200).send({user: result, savedFilters: savedFilters});
            });
    };

    this.totalCollectionLength = function (req, res, next) {
        var response = {};
        var query = models.get(req.session.lastDb, 'Users', userSchema).find({}, {__v: 0, pass: 0});

        query.exec(function (err, result) {
            if (err) {
                return next(err);
            }

            response.count = result.length;
            res.status(200).send(response);
        });
    };
};

module.exports = User;
