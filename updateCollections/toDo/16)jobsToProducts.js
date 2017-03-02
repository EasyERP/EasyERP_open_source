require('../../models/index.js');

var mongoose = require('mongoose');
var async = require('async');
var JobsSchema = mongoose.Schemas.jobs;
var ProductSchema = mongoose.Schemas.Products;
var CategorySchema = mongoose.Schemas.ProductCategory;
var dbObject;
var models;
var dbName = 'production';
var dbsObject = {};
var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
var ProductService;
var AvailabilityService;
var JobsModel;
var Product;
var ProductCategory;
var productCategoryId = require('../../constants/mainConstants').DEFAULT_PRODUCT_CATEGORY_ID;

dbObject = mongoose.createConnection('localhost', 'CRM');
dbsObject[dbName] = dbObject;
models = require('../../helpers/models')(dbsObject);
ProductService = require('../../services/products')(models);
AvailabilityService = require('../../services/productAvailability')(models);
JobsModel = models.get(dbName, 'jobs', JobsSchema);
Product = models.get(dbName, 'Product', ProductSchema);
ProductCategory = models.get(dbName, 'ProductCategory', CategorySchema);

JobsModel.find({}).exec(function (err, result) {
    if (err) {
        return console.log(err);
    }

    async.each(result, function (job, cb) {
        var productType = '57f36a64da7737dc08729c66';
        var warehouse = '57dfc6ea6066337b771e99e2';
        var categoryIds = [productCategoryId];
        var body;

        body = {
            job      : job._id,
            warehouse: warehouse,
            name     : job.name,
            info     : {
                productType: productType,
                categories : categoryIds
            }
        };

        ProductService.createProduct({
            body  : body,
            dbName: dbName,
            uId   : '52203e707d4dba8813000003',
            model : Product
        }, function (err, product) {
            if (!err) {
                ProductCategory.update({_id: {$in: body.info.categories}}, {$inc: {productsCount: 1}}, {multi: true}, function (err) {
                    if (err) {
                        console.log(err);
                    }

                    AvailabilityService.createAvailabilityJob({
                        dbName   : dbName,
                        product  : product._id,
                        warehouse: warehouse
                    }, cb);
                });
            } else {
                cb();
            }
        });
    }, function () {
        console.log('good');
    });
});
