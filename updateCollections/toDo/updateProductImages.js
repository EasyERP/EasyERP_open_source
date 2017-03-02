var mongoose = require('mongoose');
var async = require('async');
var ObjectId = mongoose.Types.ObjectId;

require('../../models/index.js');

var ProductSchema = mongoose.Schemas.Products;
var ImagesSchema = mongoose.Schemas.Images;
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
var dbObject = mongoose.createConnection('144.76.56.111', 'alex', 28017);
var Products = dbObject.model('Products', ProductSchema);
var Images = dbObject.model('Images', ImagesSchema);
var images;

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log('Connection to production is success');
});

Products.aggregate([{$match: {imageSrc: {$exists: true}}}], function (err, result) {
    if (err) {
        return console.log(err);
    }

    console.log(result);

    if (!result || !result.length) {
        return console.log('products with imageSrc is not found');
    }

    async.each(result, function (product, eCb) {
        images = new Images({
            main    : true,
            imageSrc: product.imageSrc,
            product : product._id
        });

        images.save(function (err, res) {
            if (err) {
                eCb(err);
            }

            eCb();
        });
    }, function (err, res) {
        if (err) {
            return console.error(err);
        }

        console.log('product images has been updated');
    });
});
