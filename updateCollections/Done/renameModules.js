/**
 * Created by liliy on 13.06.2016.
 */
var mongoose = require('mongoose');
require('../../models/index.js');
var async = require('async');

var ModuleSchema = mongoose.Schemas.modules;

var connectOptions = {
    user: 'easyErp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};

var dbObject = mongoose.createConnection('localhost', 'production', 27017, connectOptions);

//var dbObject = mongoose.createConnection('localhost', 'production');

var Module = dbObject.model("modules", ModuleSchema);

var parallelTasks = [function (cb) {
    Module.update({href: 'Quotation'}, {href: "Quotations", mname: "Quotations"}, cb);
}, function (cb) {
    Module.update({href: 'salesQuotation'}, {href: "salesQuotations", mname: "Quotations"}, cb);
}, function (cb) {
    Module.update({href: 'salesOrder'}, {href: "salesOrders", mname: "Orders"}, cb);
}, function (cb) {
    Module.update({href: 'salesInvoice'}, {href: "salesInvoices", mname: "Invoices"}, cb);
}, function (cb) {
    Module.update({href: 'Invoice'}, {href: "Invoices", mname: "Invoices"}, cb);
}, function (cb) {
    Module.update({href: 'Order'}, {href: "Orders", mname: "Orders"}, cb);
}];

async.parallel(parallelTasks, function (err) {
    if (err) {
        console.log(err);
    }
    console.log('Good');
});
