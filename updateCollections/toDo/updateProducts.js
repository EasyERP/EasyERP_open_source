var mongoose = require('mongoose');
var async;
var dbObject;


require('../../models/index.js');

var ProductsSchema = mongoose.Schemas.Products;
async = require('async');
var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
//dbObject = mongoose.createConnection('46.4.78.3', 'CRM', 27017/*, connectOptions*/);
dbObject = mongoose.createConnection('144.76.56.111', 'alexKhutor', 28017, connectOptions);
dbObject.on('error', function (err) {
    console.error(err);
});
dbObject.once('open', function callback() {
    console.log('Connection to production is success');
});

var Product = dbObject.model('Product', ProductsSchema);
var category = {
    _id: '564591f9624e48551dfe3b23',
    name: 'All'
};

Product.update({}, {$set: {'accounting.category': category}}, {multi: true}).exec(function () {
    console.log('good');

});

