var mongoose = require('mongoose');
require('../../models/index.js');
var ObjectId = mongoose.Types.ObjectId;
var defaultProductType = require('../../constants/mainConstants').DEFAULT_PRODUCT_TYPE_ID;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'CRM');
dbObject.on('error', console.error.bind(console, 'connection error:'));

dbObject.once('open', function callback() {
    var productTypesSchema = mongoose.Schemas.productTypes;

    var productTypes = dbObject.model('productTypes', productTypesSchema);

    var body = {
        "_id"         : ObjectId(defaultProductType),
        "name"        : "Default",
        "creationDate": "2016-12-05T09:58:34.407Z",
        "options"     : [],
        "__v"         : 0
    };

    var model = new productTypes(body);

    model.save(function (err, model) {
        if (err) {
            return console.log(err);
        }

        console.log(model);
    });
});
