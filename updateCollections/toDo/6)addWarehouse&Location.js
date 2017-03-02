var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

require('../../models/index.js');

var warehouseSchema = mongoose.Schemas.warehouse;
var locationSchema = mongoose.Schemas.locations;
var proceListSchema = mongoose.Schemas.PriceLists;

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

var Warehouse = dbObject.model("warehouse", warehouseSchema);
var Location = dbObject.model("location", locationSchema);
var PriceList = dbObject.model("PriceList", proceListSchema);

var warehouse;
var body = {
    "_id"      : ObjectId("57dfc6ea6066337b771e99e2"),
    "createdBy": {
        "date": new Date(),
        "user": null
    },
    "updatedBy": {
        "date": new Date(),
        "user": null
    },
    "main"     : true,
    "isOwn"    : true,
    "address"  : {},
    "name"     : "Main Warehouse",
    "__v"      : 0,
    "account"  : ObjectId("5788b4be52adaf4c49e4b51c")
};

var locationBody = {
    "_id"      : ObjectId("57dfc7076066337b771e99e4"),
    "updatedBy": {
        "date": new Date(),
        "user": null
    },
    "createdBy": {
        "date": new Date(),
        "user": null
    },
    "zone"     : null,
    "warehouse": ObjectId("57dfc6ea6066337b771e99e2"),
    "groupingD": "0",
    "groupingC": "0",
    "groupingB": "0",
    "groupingA": "0",
    "name"     : "0.0.0.0"
};

var priceLists = [{
    _id          : ObjectId("58109ae869b3249417f74bae"),
    priceListCode: 'PL1',
    name         : 'Default Costs',
    currency     : ObjectId("565eab29aeb95fa9c0f9df2d"),
    cost         : true
}, {
    _id          : ObjectId("58109ae869b3249417f74baf"),
    priceListCode: 'PL2',
    name         : 'Sale Prices',
    currency     : ObjectId("565eab29aeb95fa9c0f9df2d"),
    cost         : false
}];

var location;

Warehouse.remove({}, function (err) {
    if (err) {
        return console.log(err);
    }

    warehouse = new Warehouse(body);
    warehouse.save(function (err, success) {
        if (err) {
            return console.error(err);
        }

        Location.remove({}, function (err) {

            location = new Location(locationBody);
            location.save(function (err, successLocation) {
                if (err) {
                    return console.error(err);
                }

                PriceList.remove({}, function (err) {
                    if (err) {
                        return console.error(err);
                    }

                    PriceList.collection.insertMany(priceLists, function (err, result) {
                        if (err) {
                            return console.error(err);
                        }

                        console.log(success + successLocation + result);
                    });
                });

            });

        });
    });
});


