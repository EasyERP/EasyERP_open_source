'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

var Categories = function (models, event) {
    var CategorySchema = mongoose.Schemas.ProductCategory;
    var ProductsSchema = mongoose.Schemas.Products;
    var objectId = mongoose.Types.ObjectId;
    var MAINCONSTANTS = require('../constants/mainConstants');

    this.getExpenses = function (req, res, next) {
        var ProductCategory = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);

        var parentId = MAINCONSTANTS.EXPENSESCAREGORY;

        ProductCategory
            .find({parent: objectId(parentId)})
            .sort({
                fullName    : 1,
                nestingLevel: 1,
                sequence    : 1
            })
            .populate('parent')
            .exec(function (err, categories) {
                if (err) {
                    return next(err);
                }
                res.status(200).send(categories);
            });

    };

    function getCategoryById(options, callback) {
        var lastDb = options.lastDb;
        var ProductCategory = models.get(lastDb, 'ProductCategory', CategorySchema);
        var id = options.id;

        /*
        if (id && id.length < 24) { //TODO: to be discussed
            return res.status(400).send();
        }
        */

        ProductCategory
            .findById(id)
            .populate('parent')
            .populate('debitAccount', 'name')
            .populate('creditAccount', 'name')
            .populate('taxesAccount', 'name')
            .populate('bankExpensesAccount', 'name')
            .populate('otherIncome', 'name')
            .populate('otherLoss', 'name')
            .exec(function (err, category) {
                if (err) {
                    return callback(err);
                }

                callback(null, category);
            });
    }

    function getById(req, res, next) {
        var id = req.query.id || req.params.id;
        var lastDb = req.session.lastDb;
        var options = {
            id    : id,
            lastDb: lastDb
        };

        if (id && id.length < 24) {
            return res.status(400).send();
        }

        getCategoryById(options, function (err, category) {
            if (err) {
                return next(err);
            }

            res.status(200).send(category);
        });
    }

    function getCategories(options, req, res, next, cb) {
        var ProductCategory = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);
        var isChild = options.isChild || false;
        var parentId = options.parentId || '';
        var forParent = options.forParent;
        var matchObj = {};
        var pipeLine = [];

        if (isChild) {
            matchObj = {parent: objectId(parentId)};
        } else if (forParent) {
            matchObj = {parent: null};
        } else {
            matchObj = {};
        }
        pipeLine = [{
            $match: matchObj
        }];
        if (isChild) {
            pipeLine.push({
                $lookup: {
                    from        : 'ProductCategories',
                    localField  : '_id',
                    foreignField: 'parent',
                    as          : 'ch'
                }
            });
        }
        ProductCategory.aggregate(pipeLine, function (err, response) {
            if (err) {
                return next(err);
            }

            return cb(err, response);
        });
    }

    this.getForDd = function (req, res, next) {
        var Product = models.get(req.session.lastDb, 'Product', ProductsSchema);
        var ProductCategory = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);
        var parentId = req.query.parentId;
        var isChild = req.query.isChild || false;
        var forParent = req.query.forParent;
        var options = {};

        if (req.query.id || req.params.id) {
            return getById(req, res, next);
        }

        options = {
            parentId : parentId,
            isChild  : isChild,
            forParent: forParent
        };

        Product.aggregate([{
            $project: {
                categories: '$info.categories'
            }
        }, {
            $unwind: {
                path                      : '$categories',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $group: {
                _id  : '$categories',
                count: {$sum: 1}
            }
        }], function (err, categoriesCount) {
            if (err) {
                return next(err);
            }

            getCategories(options, req, res, next, function (err, categories) {
                if (err) {
                    return next(err);
                }

                categories = categories.map(function (el) {
                    var count = _.find(categoriesCount, function (catCount) {
                        return catCount && catCount._id ? catCount._id.toString() === el._id.toString() : null;
                    });

                    el.productsCount = count ? count.count : 0;

                    return el;
                });
                res.status(200).send({data: categories});
            });
        });
    };

    this.getById = function (req, res, next) {
        getById(req, res, next);
    };

    this.getProsterityForAncestor = function (req, res, next) {
        var ProductCategory = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);
        var id = req.params.id;

        ProductCategory
            .find({
                ancestors: {
                    $elemMatch: {$eq: id}
                }
            }, {_id: 1}, function (err, result) {
                var ids = [];

                if (err) {
                    return next(err);
                }

                if (result && result.length) {
                    ids = _.pluck(result, '_id');
                }

                ids.push(id);

                res.status(200).send(ids);
            });
    };

    function updateParentsCategory(req, newCategoryId, parentId, modifier, callback) {
        var ProductCategory = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);
        var id;
        var updateCriterior;

        if (modifier === 'add') {
            updateCriterior = {$addToSet: {child: newCategoryId}};
        } else {
            updateCriterior = {$pull: {child: newCategoryId}};
        }

        ProductCategory.findOneAndUpdate({_id: parentId}, updateCriterior, function (err, result) {
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

    this.create = function (req, res, next) {
        var lastDb = req.session.lastDb;
        var ProductCategory = models.get(lastDb, 'ProductCategory', CategorySchema);
        var body = req.body;
        var parentId = body.parent;

        if (!Object.keys(body).length) {
            return res.status(400).send();
        }

        body.createdBy = {
            user: req.session.uId
        };
        body.editedBy = {
            user: req.session.uId
        };

        async.waterfall([

            // create the new category:
            function (cb) {
                var categoryModel = new ProductCategory(body);

                categoryModel.save(function (err, category) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, category);
                });
            },

            // update the parent category (if need):
            function (category, cb) {
                var newModelId;

                if (!body.parent) { // do not update the parent
                    return cb(null, category);
                }

                newModelId = category._id;
                updateParentsCategory(req, newModelId, parentId, 'add', function (err) { // TODO: do not use req !!!
                    if (err) {
                        return cb(err);
                    }

                    cb(null, category);
                });
            },

            // retrieve the created category:
            function (category, cb) {
                var _options = {
                    lastDb: lastDb,
                    id    : category._id
                };

                getCategoryById(_options, function (err, createdCategory) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, createdCategory);
                });
            }

        ], function (err, category) {
            if (err) {
                return next(err);
            }

            res.status(201).send(category);
        });
    };

    function updateNestingLevel(req, id, nestingLevel, callback) {
        var ProductCategory = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);

        ProductCategory.find({parent: id}).exec(function (err, result) {
            var n = 0;
            if (result.length !== 0) {
                result.forEach(function (item) {
                    n++;

                    ProductCategory.findByIdAndUpdate(item._id, {nestingLevel: nestingLevel + 1}, {new: true}, function (err, res) {
                        if (result.length === n) {
                            updateNestingLevel(req, res._id, res.nestingLevel + 1, function () {
                                callback();
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

    function updateSequence(model, sequenceField, start, end, parentDepartmentStart, parentDepartmentEnd, isCreate, isDelete, callback) {
        var query;
        var objFind = {};
        var objChange = {};
        var inc = -1;
        var c;

        if (parentDepartmentStart === parentDepartmentEnd) {// on one workflow

            if (!(isCreate || isDelete)) {

                if (start > end) {
                    inc = 1;
                    c = end;
                    end = start;
                    start = c;
                } else {
                    end -= 1;
                }
                objChange = {};
                objFind = {parent: parentDepartmentStart};
                objFind[sequenceField] = {$gte: start, $lte: end};
                objChange[sequenceField] = inc;
                query = model.update(objFind, {$inc: objChange}, {multi: true});
                query.exec(function (err, res) {
                    if (callback) {
                        callback((inc === -1) ? end : start);
                    }
                });
            } else {
                if (isCreate) {
                    query = model.count({parent: parentDepartmentStart}).exec(function (err, res) {
                        if (callback) {
                            callback(res);
                        }
                    });
                }
                if (isDelete) {
                    objChange = {};
                    objFind = {parent: parentDepartmentStart};
                    objFind[sequenceField] = {$gt: start};
                    objChange[sequenceField] = -1;
                    query = model.update(objFind, {$inc: objChange}, {multi: true});
                    query.exec(function (err, res) {
                        if (callback) {
                            callback(res);
                        }
                    });
                }
            }
        } else {// nbetween workflow
            objChange = {};
            objFind = {parent: parentDepartmentStart};
            objFind[sequenceField] = {$gte: start};
            objChange[sequenceField] = -1;
            query = model.update(objFind, {$inc: objChange}, {multi: true});
            query.exec();
            objFind = {parent: parentDepartmentEnd};
            objFind[sequenceField] = {$gte: end};
            objChange[sequenceField] = 1;
            query = model.update(objFind, {$inc: objChange}, {multi: true});
            query.exec(function () {
                if (callback) {
                    callback(end);
                }
            });

        }
    }

    function updateFullName(id, Model, cb) {
        var fullName;
        var parrentFullName;

        Model
            .findById(id)
            .populate('parent')
            .exec(function (err, category) {
                parrentFullName = category && category.parent ? category.parent.fullName : null;

                if (parrentFullName) {
                    fullName = parrentFullName + ' / ' + category.name;
                } else {
                    fullName = category.name;
                }

                if (!err) {
                    Model.findByIdAndUpdate(id, {$set: {fullName: fullName}}, {new: true}, cb);
                }
            });
    }

    this.update = function (req, res, next) {
        var ProductCategory = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);
        var data = req.body;
        var _id = req.params.id;
        var parentId;
        var newParentId = data.parent;

        delete data.createdBy;

        ProductCategory.findOneAndUpdate({_id: _id}, data, function (err, result) {
            if (err) {
                return next(err);
            }

            parentId = result.parent;

            if (!data.isChangedLevel) {
                res.send(200, {success: 'Category updated success'});
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
                    updateFullName(_id, ProductCategory, cb);
                }
            ], function (err) {
                if (err) {
                    return next(err);
                }

                getById(req, res, next);
                //res.send(200, {success: 'Category updated success'});
            });
        });

    };

    /*this.update = function (req, res, next) {
     var ProductCategory = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);
     var data = req.body;
     var _id = req.params.id;
     var parentId;
     var newParentId = data.parent;

     delete data.createdBy;

     if (data.users && data.users[0] && data.users[0]._id) {
     data.users = data.users.map(function (item) {
     return item._id;
     });
     }

     if (data.sequenceStart) {
     updateSequence(ProductCategory, 'sequence', data.sequenceStart, data.sequence, data.parentCategoryStart, data.parent, false, false, function (sequence) {
     data.sequence = sequence;
     ProductCategory.findByIdAndUpdate(_id, data, {new: true}, function (err, result) {

     if (err) {
     next(err);
     } else {
     parentId = result.parent;
     // ToDo update fullName
     ProductCategory.populate(result, {path: 'parent'}, function (err, result) {
     if (err) {
     return next(err);
     }
     if (data.isAllUpdate) {
     async.waterfall([
     function (cb) {
     updateNestingLevel(req, _id, data.nestingLevel, cb);
     },

     function(cb) {
     updateParentsCategory(req, _id, parentId, 'remove', cb);
     },

     function(cb) {
     updateParentsCategory(req, _id, newParentId, 'remove', cb);
     },
     ], function (err) {
     if (err){
     return next(err);
     }

     res.send(200, {success: 'Category updated success'});
     });

     } else {
     res.send(200, {success: 'Category updated success'});
     }

     updateFullName(_id, ProductCategory, function () {
     console.log('fullName was updated');
     });

     });
     }
     });
     });
     } else {
     ProductCategory.findByIdAndUpdate(_id, data, {new: true}, function (err, result) {
     ProductCategory.populate(result, {path: 'parent'}, function (err, result) {
     if (err) {
     console.log(err);
     }
     });

     updateFullName(_id, ProductCategory, function () {
     console.log('fullName was updated');
     });

     if (err) {
     return next(err);
     }
     if (data.isAllUpdate) {
     updateNestingLevel(req, _id, data.nestingLevel, function () {
     res.send(200, {success: 'Category updated success'});
     });
     } else {
     res.send(200, {success: 'Category updated success'});
     }

     });
     }
     };*/

    function removeAllChild(req, id, callback) {
        var ProductCategory = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);
        var Product = models.get(req.session.lastDb, 'Product', ProductsSchema);

        ProductCategory.find({
            $or: [
                {ancestors: {$elemMatch: {$eq: id}}},
                {_id: id}
            ]
        }, {_id: 1}, function (err, result) {
            var ids;

            if (err) {
                return callback(err);
            }

            ids = _.pluck(result, '_id');

            function deleteCategories(parCb) {
                ProductCategory.remove({_id: {$in: ids}}, function (err) {
                    if (err) {
                        return parCb(err);
                    }

                    parCb(null);
                });
            }

            function deleteProducts(parCb) {
                Product.remove({'accounting.category._id': {$in: ids}}, function (err) {
                    if (err) {
                        return parCb(err);
                    }

                    parCb(null);
                });
            }

            async
                .parallel([deleteCategories, deleteProducts], function (err) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null);
                });
        });
    }

    this.remove = function (req, res, next) {
        var ProductCategory = models.get(req.session.lastDb, 'ProductCategory', CategorySchema);
        var _id = req.param('id');

        async.waterfall([

            // remove the model:
            function (cb) {

                ProductCategory.findOneAndRemove({_id: _id}, function (err, category) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, category);
                });
            },

            // update the parent:
            function (category, cb) {
                var parentId = category.parent;

                updateParentsCategory(req, _id, parentId, 'remove', function (err) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, category);
                });
            },

            // remove the sub categories:
            function (category, cb) {
                ProductCategory.remove({parent: _id}, function (err) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, category);
                });
            }

        ], function (err, result) {
            if (err) {
                return next(err);
            }

            res.status(200).send(result);
        });
    };

};

module.exports = Categories;
