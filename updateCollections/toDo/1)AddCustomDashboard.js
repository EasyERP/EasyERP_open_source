require('../../models/index.js');

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CustomDashboardSchema = mongoose.Schemas.CustomDashboard;
var CustomChartSchema = mongoose.Schemas.CustomChart;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('144.76.56.111', 'CRM', 28017);

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var CustomDashboard = dbObject.model("CustomDashboard", CustomDashboardSchema);
var CustomChart = dbObject.model('CustomChart', CustomChartSchema);

var dash = {
    "_id"        : ObjectId("582bfabf5a43a4bc2524bf09"),
    "description": "",
    "charts"     : [
        ObjectId("582d617bb11d8d9405a196b1"),
        ObjectId("582d617bb11d8d9405a196b2"),
        ObjectId("582d617bb11d8d9405a196b3"),
        ObjectId("582d617bb11d8d9405a196b4"),
        ObjectId("582d617bb11d8d9405a196b5"),
        ObjectId("582d617bb11d8d9405a196b6"),
        ObjectId("582d617bb11d8d9405a196b8"),
        ObjectId("582d617bb11d8d9405a196b7"),
        ObjectId("582d617bb11d8d9405a196b9"),
        ObjectId("582d617bb11d8d9405a196be"),
        ObjectId("582d617bb11d8d9405a196ba"),
        ObjectId("582d617bb11d8d9405a196bc"),
        ObjectId("582d617bb11d8d9405a196bd"),
        ObjectId("582e9affd3b21a202767aad4")
    ],
    "columns"    : 12,
    "rows"       : 3,
    "created"    : new Date("2016-11-16T06:20:47.548Z"),
    "name"       : "Dashboard"
};

var charts = [{
    "_id"       : ObjectId("582d617bb11d8d9405a196ba"),
    "dataHeight": 2,
    "dataWidth" : 3,
    "indexY"    : 1,
    "indexX"    : 9,
    "nameId"    : "chart",
    "name"      : "Past Due Sales Invoices",
    "type"      : "table",
    "dataset"   : "pastDueInvoices",
    "forSales"  : true,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582d617bb11d8d9405a196bc"),
    "dataHeight": 2,
    "dataWidth" : 3,
    "indexY"    : 1,
    "indexX"    : 6,
    "nameId"    : "chart",
    "name"      : "Costs By Country",
    "type"      : "donut",
    "dataset"   : "purchaseRevenueByCountry",
    "forSales"  : false,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582d617bb11d8d9405a196bd"),
    "dataHeight": 2,
    "dataWidth" : 3,
    "indexY"    : 1,
    "indexX"    : 6,
    "nameId"    : "chart",
    "name"      : "Revenue By Country",
    "type"      : "donut",
    "dataset"   : "revenueByCountry",
    "forSales"  : true,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582e9affd3b21a202767aad4"),
    "dataHeight": 2,
    "dataWidth" : 3,
    "indexY"    : 1,
    "indexX"    : 9,
    "nameId"    : "chart",
    "name"      : "Past Due Purchase Invoices",
    "type"      : "table",
    "dataset"   : "pastDuePurchaseInvoices",
    "forSales"  : false,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582d617bb11d8d9405a196b1"),
    "dataHeight": 1,
    "dataWidth" : 6,
    "indexY"    : 0,
    "indexX"    : 6,
    "nameId"    : "chart",
    "name"      : "Sales Invoices",
    "type"      : "overview",
    "dataset"   : "totalSalesRevenue",
    "forSales"  : true,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582d617bb11d8d9405a196b2"),
    "dataHeight": 2,
    "dataWidth" : 3,
    "indexY"    : 1,
    "indexX"    : 0,
    "nameId"    : "chart",
    "name"      : "Revenue By Sales Manager",
    "type"      : "horizontalBar",
    "dataset"   : "revenueBySales",
    "forSales"  : true,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582d617bb11d8d9405a196b3"),
    "dataHeight": 2,
    "dataWidth" : 3,
    "indexY"    : 1,
    "indexX"    : 0,
    "nameId"    : "chart",
    "name"      : "Sales Invoices",
    "type"      : "table",
    "dataset"   : "totalSalesRevenue",
    "forSales"  : true,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582d617bb11d8d9405a196b4"),
    "dataHeight": 2,
    "dataWidth" : 3,
    "indexY"    : 1,
    "indexX"    : 3,
    "nameId"    : "chart",
    "name"      : "Revenue By Customer",
    "type"      : "donut",
    "dataset"   : "revenueByCustomer",
    "forSales"  : true,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582d617bb11d8d9405a196b5"),
    "dataHeight": 1,
    "dataWidth" : 6,
    "indexY"    : 0,
    "indexX"    : 0,
    "nameId"    : "chart",
    "name"      : "Purchase Orders",
    "type"      : "overview",
    "dataset"   : "purchaseOrders",
    "forSales"  : false,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582d617bb11d8d9405a196b6"),
    "dataHeight": 1,
    "dataWidth" : 6,
    "indexY"    : 0,
    "indexX"    : 6,
    "nameId"    : "chart",
    "name"      : "Purchase Invoices",
    "type"      : "overview",
    "dataset"   : "totalPurchaseRevenue",
    "forSales"  : false,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582d617bb11d8d9405a196b7"),
    "dataHeight": 2,
    "dataWidth" : 3,
    "indexY"    : 1,
    "indexX"    : 0,
    "nameId"    : "chart",
    "name"      : "Purchase Invoices",
    "type"      : "table",
    "dataset"   : "totalPurchaseRevenue",
    "forSales"  : false,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582d617bb11d8d9405a196b8"),
    "dataHeight": 2,
    "dataWidth" : 4,
    "indexY"    : 4,
    "indexX"    : 4,
    "nameId"    : "chart",
    "name"      : "Costs By Sales Manager",
    "type"      : "horizontalBar",
    "dataset"   : "purchaseRevenueBySales",
    "forSales"  : false,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582d617bb11d8d9405a196b9"),
    "dataHeight": 2,
    "dataWidth" : 3,
    "indexY"    : 1,
    "indexX"    : 3,
    "nameId"    : "chart",
    "name"      : "Costs By Supplier",
    "type"      : "donut",
    "dataset"   : "purchaseRevenueByCustomer",
    "forSales"  : false,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}, {
    "_id"       : ObjectId("582d617bb11d8d9405a196be"),
    "dataHeight": 1,
    "dataWidth" : 6,
    "indexY"    : 0,
    "indexX"    : 0,
    "nameId"    : "chart",
    "name"      : "Sales Orders",
    "type"      : "overview",
    "dataset"   : "orders",
    "forSales"  : true,
    "startDate" : "01, Nov 2016",
    "endDate"   : "22, Nov 2016",
    "dashboard" : ObjectId("582bfabf5a43a4bc2524bf09")
}

];

CustomChart.collection.insertMany(charts, function (err, inserter) {
    if (err) {
        return console.log(err);
    }

    console.log(inserter);
});

CustomDashboard.collection.insert(dash, function (err, inserter) {
    if (err) {
        return console.log(err);
    }

    console.log(inserter);
});

