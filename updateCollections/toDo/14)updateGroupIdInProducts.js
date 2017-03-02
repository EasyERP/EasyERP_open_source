require('../../models/index.js');

var mongoose = require('mongoose');
var ProductSchema = mongoose.Schemas.Products;
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

var Product;

var dbObject = mongoose.createConnection('localhost', 'CRM');
dbsObject[dbName] = dbObject;
models = require('../../helpers/models')(dbsObject);
Product = models.get(dbName, 'Product', ProductSchema);

Product.find({$or: [{groupId: null}, {groupId: {$exists: false}}]}).exec(function (err, result) {
    if (err) {
        return console.log(err);
    }

    result.forEach(function (el) {
        var groupId = el._id.toString();

        Product.findByIdAndUpdate(el._id, {$set: {groupId: groupId}}, function () {

        });
    });

    console.log('good');
});
