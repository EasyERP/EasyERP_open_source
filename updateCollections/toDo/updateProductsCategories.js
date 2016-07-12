var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var _ = require('lodash');
var async;
var dbObject;


require('../../models/index.js');

var ProductsCategoriesSchema = mongoose.Schemas.ProductCategory;
var ProductsSchema = mongoose.Schemas.Products;

async = require('async');
var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
dbObject = mongoose.createConnection('46.4.78.3', 'CRM', 27017/*, connectOptions*/);
dbObject.on('error', function (err) {
    console.error(err);
});
dbObject.once('open', function callback() {
    console.log('Connection to production is success');
});

var ProductCategories = dbObject.model('jobs', ProductsCategoriesSchema);
var Product = dbObject.model('jobs', ProductsSchema);
var category = {
    _id : '564591f9624e48551dfe3b23',
    name: 'All'
};
var productCategories;
var productsCount;


ProductCategories.find({_id: {$ne: ObjectId('564591f9624e48551dfe3b23')}}, {_id: 1}, function (err, result) {

    productCategories = _.pluck(result, '_id');

    async.each(productCategories, function (cat, cb) {
        ProductCategories.update({_id: cat}, {$set: {productsCount: 0, child: []}}, {multi: true}, cb);
    }, function (err) {
        console.log('Parent Categories Updated!');


    });
});




async.waterfall([
    function(wCb){
        ProductCategories.find({_id: {$ne: ObjectId('564591f9624e48551dfe3b23')}}, {_id: 1}, function (err, result) {

            productCategories = _.pluck(result, '_id');

            async.each(productCategories, function (cat, cb) {
                ProductCategories.update({_id: cat}, {$set: {productsCount: 0, child: []}}, {multi: true}, cb);
            }, function (err) {
                console.log('Parent Categories Updated!');

                wCb(null, productCategories);
            });
        });
    },

    function (productCategories, wCb) {
        Product.count({}, function (err, count) {
            wCb(null, productCategories, count);
        });
    }
], function(err, result){
    var child = result[0];
    var productsCount = result[1];

    Product.findOneAndUpdate({_id: ObjectId('564591f9624e48551dfe3b23')}, {$set: {child: child, productsCount: productsCount}}, function(){
       console.log('DONE!');
    });
});




