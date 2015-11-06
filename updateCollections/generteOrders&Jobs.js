/**
 * Created by liliya on 22.10.15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
require('../models/index.js');
var async = require('async');
var QuotationSchema = mongoose.Schemas['Quotation'];
var InvoiceSchema = mongoose.Schemas['Invoice'];
var JobsSchema = mongoose.Schemas['jobs'];
var ProjectSchema = mongoose.Schemas['Project'];
var objectId = mongoose.Types.ObjectId;
var CONSTANTS = require('../constants/mainConstants');

var productService = CONSTANTS.PRODUCRSERVICE;

var wTrackSchema = mongoose.Schema({
    ID: Number,
    dateByWeek: Number,
    dateByMonth: Number,
    project: {
        _id: {
            type: ObjectId, ref: 'Project', default: null
        },
        projectName: String,
        projectmanager: {
            _id: {type: ObjectId, ref: 'Project', default: null},
            name: String
        },
        workflow: {
            _id: {type: ObjectId, ref: 'workflows', default: null},
            name: String,
            status: String
        },
        customer: {
            _id: {type: ObjectId, ref: 'Customers', default: null},
            name: String
        },
        bonus: [{
            employeeId: {
                type: ObjectId,
                ref: 'Employees'
            },
            bonusId: {
                type: ObjectId,
                ref: 'bonusType'
            },
            startDate: Date,
            startWeek: Number,
            startYear: Number,
            endDate: Date,
            endWeek: Number,
            endYear: Number
        }]
    },
    employee: {
        _id: {type: ObjectId, ref: 'Employees', default: null},
        name: String
    },
    department: {
        _id: {type: ObjectId, ref: 'Department', default: null},
        departmentName: String
    },
    year: Number,
    month: Number,
    week: Number,
    1: {type: Number, default: 0},
    2: {type: Number, default: 0},
    3: {type: Number, default: 0},
    4: {type: Number, default: 0},
    5: {type: Number, default: 0},
    6: {type: Number, default: 0},
    7: {type: Number, default: 0},
    worked: Number,
    rate: Number,
    revenue: {type: Number, /*get: getPrice,*/ set: setPrice, default: 0},
    cost: {type: Number, /*get: getPrice,*/ set: setPrice},
    amount: {type: Number, /*get: getPrice,*/ set: setPrice, default: 0},
    isPaid: {type: Boolean, default: false},
    invoice: {type: ObjectId, ref: 'Invoice', default: null},
    info: {
        productType: {type: String, ref: 'productTypes', default: 'wTrack'},
        salePrice: {type: Number, default: 100, set: setPrice}
    },
    whoCanRW: {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
    groups: {
        owner: {type: ObjectId, ref: 'Users', default: null},
        users: [{type: ObjectId, ref: 'Users', default: null}],
        group: [{type: ObjectId, ref: 'Department', default: null}]
    },
    editedBy: {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date}
    },
    createdBy: {
        user: {type: ObjectId, ref: 'Users', default: null},
        date: {type: Date, default: Date.now}
    }
}, {collection: 'wTrack'});

function setPrice(num) {
    return num * 100;
}

wTrackSchema.set('toJSON', {getters: true});

mongoose.model('wTrackOld', wTrackSchema);

if (!mongoose.Schemas) {
    mongoose.Schemas = {};
}

mongoose.Schemas['wTrackOld'] = wTrackSchema;


var WTrackSchema = mongoose.Schemas['wTrack'];
var WTrackSchemaOld = mongoose.Schemas['wTrackOld'];

var dbObject = mongoose.createConnection('localhost', 'production');
dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to weTrack is success");
});

var wTrack = dbObject.model("wTrack", WTrackSchema);
var wTrackOld = dbObject.model("wTrackOld", WTrackSchemaOld);

var Quotation = dbObject.model("Quotation", QuotationSchema);
var Invoice = dbObject.model("wTrackInvoice", InvoiceSchema);
var Job = dbObject.model("jobs", JobsSchema);
var Project = dbObject.model("Project", ProjectSchema);

var waterfallTasks = [getInvoices, createJobs];

async.waterfall(waterfallTasks, function(err, result){
  console.log('success');

    Job.aggregate([
        {
          $group: {
              _id: "$project",
              jobIds: {$addToSet: '$_id'}
          }
        }
    ], function(err, result){
        if (err) {
            return console.log(err);
        }

        result.forEach(function(res){

            var projectId = res._id;
            var jobIds = res.jobIds;

            Project.findByIdAndUpdate(projectId, {$set : {budget: {}}}, function(err, result){
                if (err){
                    console.log(err);
                }
                console.log('ok');
            });

        })
    })

});

function getInvoices(pCb){
    var query = Invoice.find({invoiceType: "wTrack"}).lean();

    query.exec(function(err, result){
        if (err){
            pCb(err)
        }

        pCb(null, result);
    });
}

function createJobs(invoiceArr, pcb){

    var invoices = invoiceArr;
    var invoiceCount = invoices.length;

    invoiceArr.forEach(function(invoice){
        var wTracks = [];
        var invoiceProducts = invoice.products;
        var projectId = invoice.project._id;
        var projectName = invoice.project.name;
        var supplier = invoice.supplier;
        var orderDate = invoice.invoiceDate;
        var projectmanager = invoice.salesPerson;
        var paymentInfo = invoice.paymentInfo;
        var jobName = invoice.project.name.concat(invoice.name);
        var paymentInfo = {
            total: paymentInfo.total / 100,
            unTaxed: paymentInfo.unTaxed / 100,
            taxes: paymentInfo.taxes / 100
        };
        var data = {};
        var quotationData = {};

        invoiceProducts.forEach(function(product){
            wTracks.push(product.product);
        });

        data = {
            name: jobName,
            workflow: {
                _id: objectId("56337c675d49d8d6537832ea"),
                name: "Finished"
            },
            type: "Invoice",
            wTracks: wTracks,
            project: projectId
        };

       var newJob = new Job(data);

        newJob.save(function (err, job) {
            if (err) {
                return pcb(err);
            }

            var jobId = job.toJSON()._id;
            var jobName = job.get('name');

            var jobForwTrack = {
                _id: objectId(jobId),
                name: jobName
            };

            wTracks.forEach(function(wTrackId){
                wTrack.findByIdAndUpdate(objectId(wTrackId), {$set : {jobs: jobForwTrack}}, function(err, result){
                    if (err){
                        console.log(err);
                    }
                });
            });

            quotationData = {
                forSales: true,
                isOrder: true,
                supplier: supplier,
                project: {
                    _id: projectId,
                    projectName: projectName,
                    projectmanager: projectmanager
                },
                orderDate: orderDate,
                name: "SO-" + projectName,
                invoiceReceived: true,
                paymentInfo: paymentInfo,
                products: [{
                    scheduledDate: orderDate,
                    taxes: 150,
                    subTotal: 1150,
                    unitPrice: 1000,
                    product: objectId(productService)
                }],
                workflow: {
                    _id: objectId( "55647b962e4aa3804a765ec6"),
                    name: "Done"
                }
            };


            quotationData.products[0].jobs = jobId;

            var newQuotation = new Quotation(quotationData);

            newQuotation.save(function (err, quotation) {
                if (err) {
                    return pcb(err);
                }

                pcb(null, {job: job, quotation: quotation})
            });

        });



    });

}
