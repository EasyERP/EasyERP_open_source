var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var _ = require('lodash');
var async;
var dbObject;

require('../../models/index.js');

var ProductsCategoriesSchema = mongoose.Schemas.ProductCategory;
var ProductsSchema = mongoose.Schemas.Products;
var productCategoryId = require('../../constants/mainConstants').DEFAULT_PRODUCT_CATEGORY_ID;

async = require('async');
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
dbObject = mongoose.createConnection('144.76.56.111', 'micheldb', 28017);
dbObject.on('error', function (err) {
    console.error(err);
});
dbObject.once('open', function callback() {
    console.log('Connection to production is success');
});

var ProductCategories = dbObject.model('ProductCategory', ProductsCategoriesSchema);
var Product = dbObject.model('Product', ProductsSchema);
var category = {
    _id : productCategoryId,
    name: 'All'
};
var productCategories;
var productsCount;

async.waterfall([
    function (wCb) {
        var productCategoryModel;
        var productCategory = {
            _id          : ObjectId(productCategoryId),
            integrationId: '2'
        };

        productCategoryModel = new ProductCategories(productCategory);

        ProductCategories.findById(productCategoryId, function (err, results) {
            if (err) {
                return console.log(err);
            }

            if (results) {
                ProductCategories.findByIdAndUpdate(productCategoryId, productCategory, function (err, model) {
                    if (err) {
                        console.log(err);
                    }

                    wCb();
                    console.log('All category is created!');
                });
            } else {
                productCategoryModel.save(function (err, model) {
                    if (err) {
                        console.log(err);
                    }

                    wCb();
                    console.log('All category is created!');
                });
            }
        });

    },

    function (wCb) {
        ProductCategories.find({_id: {$ne: ObjectId(productCategoryId)}}, {_id: 1}, function (err, result) {

            productCategories = _.pluck(result, '_id');

            async.each(productCategories, function (cat, cb) {
                ProductCategories.update({_id: cat}, {$set: {productsCount: 0, child: []}}, {multi: true}, cb);
            }, function (err) {

                if (err) {
                    console.error(err);
                    return;
                }

                console.log('Child Categories Updated!');

                wCb(null, productCategories);
            });
        });
    },

    function (productCategories, wCb) {
        Product.count({}, function (err, count) {
            wCb(null, {productCategories: productCategories, count: count});
        });
    }
], function (err, result) {
    var child = result.productCategories;
    var productsCount = result.count;

    Product.findOneAndUpdate({_id: ObjectId(productCategoryId)}, {
        $set: {
            child        : child,
            productsCount: productsCount
        }
    }, function (err) {
        if (err) {
            console.error(err);
        }

        console.log('DONE!');
    });
});




