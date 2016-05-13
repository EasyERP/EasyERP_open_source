var mongoose = require('mongoose');

var PayrollComponentType = function (models) {
    "use strict";

    var PayrollComponentTypesSchema = mongoose.Schemas.payrollComponentType;
    var access = require("../Modules/additions/access.js")(models);

    this.getForView = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 103;

        if (req.session && req.session.loggedIn && db) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                var PayrollComponentType = models.get(db, 'PayrollComponentType', PayrollComponentTypesSchema);
                var type = req.params.type;

                if (access) {

                    PayrollComponentType.find({type: type}, function(err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

    this.getForDd = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 103;

        if (req.session && req.session.loggedIn && db) {
            access.getReadAccess(req, req.session.uId, moduleId, function (access) {
                var PayrollComponentType = models.get(db, 'PayrollComponentType', PayrollComponentTypesSchema);

                if (access) {

                    PayrollComponentType.find({}, {name: 1}, function(err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send({data: result});
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

    this.create = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 103;

        if (req.session && req.session.loggedIn && db) {
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                var PayrollComponentType = models.get(db, 'PayrollComponentType', PayrollComponentTypesSchema);
                var PayrollComponentType;

                if (access) {

                    PayrollComponentType = new PayrollComponentType(req.body);
                    PayrollComponentType.save(function(err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

    this.delete = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 103;

        if (req.session && req.session.loggedIn && db) {
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                var PayrollComponentType = models.get(db, 'PayrollComponentType', PayrollComponentTypesSchema);
                var id = req.params.id;

                if (access) {

                    PayrollComponentType.findByIdAndRemove(id, function(err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

    this.update = function (req, res, next) {
        var db = req.session.lastDb;
        var moduleId = 103;

        if (req.session && req.session.loggedIn && db) {
            access.getEditWritAccess(req, req.session.uId, moduleId, function (access) {
                var PayrollComponentType = models.get(db, 'PayrollComponentType', PayrollComponentTypesSchema);
                var id = req.params.id;
                var data = req.body;

                if (access) {

                    PayrollComponentType.findByIdAndUpdate(id, data, function(err, result) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).send(result);
                    });

                } else {
                    res.status(403).send();
                }
            });

        } else {
            res.status(401).send();
        }
    };

};

module.exports = PayrollComponentType;