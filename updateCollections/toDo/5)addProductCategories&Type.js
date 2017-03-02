var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

require('../../models/index.js');

var ProductsCategoriesSchema = mongoose.Schemas.ProductCategory;
var pTypeSchema = mongoose.Schemas.productTypes;
var productCategoryId = require('../../constants/mainConstants').DEFAULT_PRODUCT_CATEGORY_ID;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'CRM');

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var ProductCategory = dbObject.model("ProductCategory", ProductsCategoriesSchema);
var PType = dbObject.model('productTypes', pTypeSchema);
var pType;

var productCategory;
var body = {
    "_id"                : ObjectId(productCategoryId),
    "sequence"           : 0,
    "nestingLevel"       : 1,
    "editedBy"           : {
        "date": new Date(),
        "user": null
    },
    "createdBy"          : {
        "date": new Date(),
        "user": null
    },
    "users"              : [],
    "parent"             : null,
    "fullName"           : "All",
    "name"               : "All",
    "__v"                : 0,
    "productsCount"      : 0,
    "child"              : [],
    "main"               : false,
    "externalId"         : null,
    "taxesAccount"       : null,
    "debitAccount"       : null,
    "creditAccount"      : null,
    "bankExpensesAccount": null,
    "otherIncome"        : null,
    "otherLoss"          : null
};

var productTypeBody = {
    "_id"         : ObjectId("57f36a64da7737dc08729c66"),
    "name"        : "Service",
    "creationDate": new Date(),
    "options"     : []
};

ProductCategory.remove({}, function (err) {
    if (err) {
        return console.log(err);
    }

    productCategory = new ProductCategory(body);
    productCategory.save(function (err, success) {
        if (err) {
            return console.error(err);
        }

        PType.remove({}, function (err) {

            pType = new PType(productTypeBody);
            pType.save(function (err, successLocation) {
                if (err) {
                    return console.error(err);
                }

                console.log(success + successLocation);
            })

        });
    });
});


