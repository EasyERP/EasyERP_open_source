var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

var Categories = function (models, event) {
    var CategorySchema = mongoose.Schemas.accountsCategory;
    var AccountsSchema = mongoose.Schemas.chartOfAccount;
    var objectId = mongoose.Types.ObjectId;
    var MAINCONSTANTS = require('../constants/mainConstants');

    function updateParentsCategory(req, newCategoryId, parentId, modifier, callback) {
        var AccountsCategory = models.get(req.session.lastDb, 'accountsCategory', CategorySchema);
        var id;
        var updateCriterior;

        if (modifier === 'add') {
            updateCriterior = {$addToSet: {child: newCategoryId}};
        } else {
            updateCriterior = {$pull: {child: newCategoryId}};
        }

        AccountsCategory.findOneAndUpdate({_id: parentId}, updateCriterior, function (err, result) {
            if (err) {
                return callback(err);
            }

            if (!result || !result.parent) {
                return callback(null);
            }

            id = result.parent;
            updateParentsCategory(req, newCategoryId, id, modifier, callback);
        });
    }

    this.get = function (req, res, next) {
        var AccountsCategory = models.get(req.session.lastDb, 'accountsCategory', CategorySchema);

        AccountsCategory
            .find({})
            .populate('parent', 'name')
            .sort({nestingLevel: 1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(result);
            });
    };

    this.getAll = function (req, res, next) {
        var AccountsCategory = models.get(req.session.lastDb, 'accountsCategory', CategorySchema);

        AccountsCategory
            .find()
            .populate('parent', 'name')
            .sort({nestingLevel: 1})
            .exec(function (err, result) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({data: result});
            });
    };

    this.create = function (req, res, next) {
        var AccountsCategory = models.get(req.session.lastDb, 'accountsCategory', CategorySchema);
        var body = req.body;
        var parentId = body.parent;
        var category;

        if (!Object.keys(body).length) {
            return res.status(400).send();
        }

        body.createdBy = {
            user: req.session.uId
        };

        body.editedBy = {
            user: req.session.uId
        };

        category = new AccountsCategory(body);

        category.save(function (err, category) {
            var newModelId;
            if (err) {
                return next(err);
            }

            newModelId = category._id;

            updateParentsCategory(req, newModelId, parentId, 'add', function () {
                if (err) {
                    return next(err);
                }

                AccountsCategory.findById(newModelId).populate('parent', 'name').exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
            });
        });
    };

    function updateNestingLevel(req, id, nestingLevel, callback) {
        var AccountsCategory = models.get(req.session.lastDb, 'accountsCategory', CategorySchema);

        AccountsCategory.find({parent: id}).exec(function (err, result) {
            var n = 0;
            if (result.length !== 0) {
                result.forEach(function (item) {
                    n++;

                    AccountsCategory.findByIdAndUpdate(item._id, {nestingLevel: nestingLevel + 1}, {new: true}, function (err, res) {
                        if (result.length === n) {
                            updateNestingLevel(req, res._id, res.nestingLevel + 1, function () {
                                if (callback) {
                                    callback();
                                }
                            });
                        } else {
                            updateNestingLevel(req, res._id, res.nestingLevel + 1);
                        }
                    });
                });
            } else {
                if (callback) {
                    callback();
                }
            }
        });
    }

    function updateFullName(id, Model, cb) {
        var fullName;
        var parrentFullName;

        Model
            .findById(id)
            .populate('parent')
            .exec(function (err, category) {

                if (!category) {
                    return cb();
                }

                parrentFullName = category && category.parent ? category.parent.fullName : null;

                if (parrentFullName) {
                    fullName = parrentFullName + ' / ' + category.name;
                } else {
                    fullName = category.name;
                }

                if (!err) {
                    Model.findByIdAndUpdate(id, {$set: {fullName: fullName}}, {new: true}, function (err, result) {
                        if (err) {
                            return cb(err);
                        }

                        async.each(category.child, function (el, callback) {
                            updateFullName(el, Model, callback);
                        }, function (err, result) {
                            if (err) {
                                return cb(err);
                            }

                            cb();
                        });
                    });
                }
            });
    }

    this.update = function (req, res, next) {
        var AccountsCategory = models.get(req.session.lastDb, 'accountsCategory', CategorySchema);
        var data = req.body;
        var _id = req.params.id;
        var parentId;
        var newParentId = data.parent;

        delete data.createdBy;

        AccountsCategory.findOneAndUpdate({_id: _id}, data, function (err, result) {
            if (err) {
                return next(err);
            }

            parentId = result.parent;

            console.log(data.isAllUpdate);

            if (!data.isAllUpdate) {
                AccountsCategory.findById(_id).populate('parent', 'name').exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
                return;
            }

            async.waterfall([
                function (cb) {
                    updateParentsCategory(req, _id, parentId, 'remove', cb);
                },

                function (cb) {
                    updateParentsCategory(req, _id, newParentId, 'add', cb);
                },

                function (cb) {
                    updateFullName(_id, AccountsCategory, cb);
                },
                function (cb) {
                    if (data.isAllUpdate) {
                        updateNestingLevel(req, _id, data.nestingLevel, cb);
                    } else {
                        cb();
                    }
                }
            ], function (err) {
                if (err) {
                    return next(err);
                }

                AccountsCategory.findById(_id).populate('parent', 'name').exec(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    res.status(200).send(result);
                });
            });
        });

    };

    this.remove = function (req, res, next) {
        var AccountsCategory = models.get(req.session.lastDb, 'accountsCategory', CategorySchema);
        var _id = req.param('id');
        var parentId;

        AccountsCategory.findById(_id, {productsCount: 1}, function (err, result) {
            if (err) {
                return next(err);
            }

            if (!result.productsCount) {
                AccountsCategory.findOneAndRemove({_id: _id}, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    parentId = result.parent;

                    updateParentsCategory(req, _id, parentId, 'remove', function () {
                        if (err) {
                            return next(err);
                        }

                        res.status(200).send(result);
                    });

                });
            } else {
                res.status(400).send({error: "You can't delete this Category until it has Charts of Account"});
            }
        });
    };

};

module.exports = Categories;
