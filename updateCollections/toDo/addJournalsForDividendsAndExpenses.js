var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
require('../../models/index.js');

var ISODate = Date;

var journalSchema = mongoose.Schemas.journal;
var chartOfAccountSchema = mongoose.Schemas.chartOfAccount;

var connectOptions = {
    user: 'easyerp',
    pass: '1q2w3e!@#',
    w   : 1,
    j   : true
};
var dbObject = mongoose.createConnection('144.76.56.111', 'maxdb', 28017, connectOptions);

dbObject.on('error', console.error.bind(console, 'connection error:'));
dbObject.once('open', function callback() {
    console.log("Connection to production is success");
});

var Journals = dbObject.model("journal", journalSchema);
var ChartOfAccount = dbObject.model("chartOfAccount", chartOfAccountSchema);

var newJournals = [
    {
        '_id' : ObjectId('572340e28ba4fd133006271e'),
        'name' : 'Expenses Invoice Journal',
        'creditAccount' : ObjectId('565eb53a6aa50532e5df0bdc'),
        'debitAccount' : ObjectId('565eb53a6aa50532e5df0bf1'),
        'editedBy' : {
            'user' : null
        },
        'createdBy' : {
            'date' : ISODate('2016-04-29T11:09:22.534Z'),
            'user' : null
        },
        'description' : '',
        'currency' : {
            'name' : 'USD'
        },
        'transaction' : 'Invoice',
        'type' : '',
        'date' : ISODate('2016-04-29T11:09:22.534Z'),
        '__v' : 0
    }, {
        '_id' : ObjectId('572341608ba4fd1330062720'),
        'name' : 'Expenses Invoice Payments',
        'creditAccount' : ObjectId('565eb53a6aa50532e5df0bd2'),
        'debitAccount' : ObjectId('565eb53a6aa50532e5df0bdc'),
        'editedBy' : {
            'user' : null
        },
        'createdBy' : {
            'date' : ISODate('2016-04-29T11:11:28.137Z'),
            'user' : null
        },
        'description' : '',
        'currency' : {
            'name' : 'USD'
        },
        'transaction' : 'Payment',
        'type' : '',
        'date' : ISODate('2016-04-29T11:11:28.137Z'),
        '__v' : 0
    }, {
        '_id' : ObjectId('572347d78ba4fd1330062726'),
        'name' : 'Dividend Invoice Journal',
        'creditAccount' : ObjectId('572346da8ba4fd1330062723'),
        'debitAccount' : ObjectId('565eb53a6aa50532e5df0bf3'),
        'editedBy' : {
            'user' : null
        },
        'createdBy' : {
            'date' : ISODate('2016-04-29T11:39:03.302Z'),
            'user' : null
        },
        'description' : '',
        'currency' : {
            'name' : 'USD'
        },
        'transaction' : 'Invoice',
        'type' : '',
        'date' : ISODate('2016-04-29T11:39:03.302Z'),
        '__v' : 0
    }, {
        '_id' : ObjectId('572348048ba4fd1330062728'),
        'name' : 'Dividend Invoice Payment',
        'creditAccount' : ObjectId('565eb53a6aa50532e5df0bd2'),
        'debitAccount' : ObjectId('572346da8ba4fd1330062723'),
        'editedBy' : {
            'user' : null
        },
        'createdBy' : {
            'date' : ISODate('2016-04-29T11:39:48.692Z'),
            'user' : null
        },
        'description' : '',
        'currency' : {
            'name' : 'USD'
        },
        'transaction' : 'Payment',
        'type' : '',
        'date' : ISODate('2016-04-29T11:39:48.692Z'),
        '__v' : 0
    }
];

var newAccount = {
    '_id' : ObjectId('572346da8ba4fd1330062723'),
    'code' : 777777,
    'createdBy' : {
        'date' : ISODate('2016-04-29T11:34:50.841Z'),
        'user' : null
    },
    'editedBy' : {
        'user' : null
    },
    'payMethod' : null,
    'type' : 'Payable',
    'name' : '777777 Dividends Payable',
    'account' : 'Dividends Payable',
    '__v' : 0
};



ChartOfAccount.collection.insert(newAccount, function (err, success) {
    if (err) {
        return console.error(err);
    }
    console.log(success);

    Journals.collection.insert(newJournals, function (err, success) {
        if (err) {
            return console.error(err);
        }
        console.log(success);
    });
});



