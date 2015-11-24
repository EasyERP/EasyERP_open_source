/**
 * Created by Roman on 04.05.2015.
 */

module.exports = (function () {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Schema.Types.ObjectId;
    var Schema = mongoose.Schema;

    var payments = {
        _id    : false,
        id     : false,
        total  : {type: Number, default: 0},
        unTaxed: {type: Number, default: 0},
        taxes  : {type: Number, default: 0}
    };

    var products = {
        _id          : false,
        id           : false,
        scheduledDate: {type: Date},
        quantity     : {type: Number, default: 1},
        taxes        : {type: Number},
        subTotal     : Number,
        unitPrice    : Number,
        product      : {type: ObjectId, ref: 'Product', default: null},
        description  : {type: String, default: ''},
        jobs: {type: ObjectId, ref: "jobs", default: null}
    };

    var quotationSchema = new Schema({
        forSales      : {type: Boolean, default: true},
        type          : {type: String, default: 'Not Ordered', enum: ['Not Ordered', 'Ordered', 'Not Invoiced', 'Invoiced']},
        isOrder       : {type: Boolean, default: false},
        supplier      : {
            _id: {type: ObjectId, ref: 'Customers', default: null},
            name: {type: String, default: ''}
        },
        project       : {
            _id: {type: ObjectId, ref: 'Project', default: null},
            projectmanager: {
                _id: {type: ObjectId, ref: 'Employees', default: null},
                name: {type: String, default: ''}
            },
            projectName: {type: String, default: ''}
        },
        deliverTo     : {type: ObjectId, ref: 'DeliverTo', default: null},
        orderDate     : {type: Date, default: Date.now},
        expectedDate  : Date,
        name          : {type: String, default: 'PO', unique: true},
        destination   : {type: ObjectId, ref: 'Destination', default: null},
        incoterm      : {type: ObjectId, ref: 'Incoterm', default: null},
        invoiceControl: {type: ObjectId, ref: 'InvoicingControl', default: null},
        invoiceRecived: {type: Boolean, default: false},
        paymentTerm   : {type: ObjectId, ref: 'PaymentTerm', default: null},
        paymentInfo   : payments,
        products      : [products],
        workflow      : {
            _id: {type: ObjectId, ref: 'workflows', default: null},
            name: {type: String, default: ''}
        },
        whoCanRW      : {type: String, enum: ['owner', 'group', 'everyOne'], default: 'everyOne'},
        groups        : {
            owner: {type: ObjectId, ref: 'Users', default: null},
            users: [{type: ObjectId, ref: 'Users', default: null}],
            group: [{type: ObjectId, ref: 'Department', default: null}]
        },
        creationDate  : {type: Date, default: Date.now},
        createdBy     : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        },
        editedBy      : {
            user: {type: ObjectId, ref: 'Users', default: null},
            date: {type: Date, default: Date.now}
        }
    }, {collection: 'Quotation'});

    mongoose.model('Quotation', quotationSchema);

    quotationSchema.pre('save', function (next) {
        var quotation = this;
        var db = quotation.db.db;

        db.collection('settings').findOneAndUpdate({
                dbName: db.databaseName,
                name  : 'quotation'
            },
            //[['name', 1]],
            {
                $inc: {seq: 1}
            },
            {
                returnOriginal: false,
                upsert: true
            },
            function (err, rate) {
                if (err) {
                    return next(err);
                }
                // quotation.name = 'PO' + rate.seq; //it was working before mongoose and mongo update
                quotation.name = 'PO' + rate.value.seq;

                next();
            });
    });

    if (!mongoose.Schemas) {
        mongoose.Schemas = {};
    }

    mongoose.Schemas['Quotation'] = quotationSchema;
})();