var mongoose = require('mongoose');
require('../../models/index.js');
var ObjectId = mongoose.Types.ObjectId;

var accountsCategorySchema = mongoose.Schemas.accountsCategory;
var chartOfAccountSchema = mongoose.Schemas.chartOfAccount;

var dbObject = mongoose.createConnection('localhost', 'CRM');
var accountsCategory = dbObject.model('accountsCategory', accountsCategorySchema);
var chartOfAccount = dbObject.model('chartOfAccount', chartOfAccountSchema);

var bodyCharts = [{
    "_id"     : ObjectId("565eb53a6aa50532e5df0bc8"),
    "code"    : 100000,
    "account" : "Fixed Asset Account",
    "type"    : ObjectId("57da4d62713d3fe825f074b2"),
    "name"    : "100000 Fixed Asset Account",
    "editedBy": {
        "date": "2015-12-02T14:19:59.504Z",
        "user": ObjectId("52203e707d4dba8813000003")
    },
    "category": ObjectId("5810c75b2b225158086d7f82"),
    "parent"  : ObjectId("5810c75b2b225158086d7f82")
}, {
    "_id"     : ObjectId("565eb53a6aa50532e5df0bc9"),
    "code"    : 101200,
    "account" : "Account Receivable",
    "type"    : ObjectId("57da4d62713d3fe825f074b6"),
    "name"    : "101200 Account Receivable",
    "editedBy": {
        "date": "2016-05-06T10:04:35.796Z",
        "user": ObjectId("563f673270bbc2b740ce89ae")
    },
    "category": ObjectId("5810c75b2b225158086d7f80")
},
    {
        "_id"      : ObjectId("565eb53a6aa50532e5df0bca"),
        "code"     : 101400,
        "account"  : "Erste USD",
        "type"     : ObjectId("57da4d62713d3fe825f074ae"),
        "name"     : "101400 Erste USD",
        "editedBy" : {
            "date": "2015-12-02T14:19:59.502Z",
            "user": ObjectId("52203e707d4dba8813000003")
        },
        "payMethod": ObjectId("565c5433385ea8b670ff499e"),
        "category" : ObjectId("5810c75b2b225158086d7f81")
    },
    {
        "_id"      : ObjectId("565eb53a6aa50532e5df0bcb"),
        "code"     : 101402,
        "account"  : "Ukrsibbank USD ThinkMobiles",
        "type"     : ObjectId("57da4d62713d3fe825f074ae"),
        "name"     : "101402 Ukrsibbank USD ThinkMobiles",
        "payMethod": ObjectId("565c5d9adf6d008a7a6abb09"),
        "category" : ObjectId("5810c75b2b225158086d7f81")
    },
    {
        "_id"      : ObjectId("565eb53a6aa50532e5df0bcc"),
        "code"     : 101401,
        "account"  : "Ukrsibbank EUR ThinkMobiles",
        "type"     : ObjectId("57da4d62713d3fe825f074ae"),
        "name"     : "101401 Ukrsibbank EUR ThinkMobiles",
        "editedBy" : {
            "date": "2016-07-08T12:09:21.029Z",
            "user": null
        },
        "payMethod": ObjectId("565c5d9adf6d008a7a6abb0a"),
        "category" : ObjectId("5810c75b2b225158086d7f81")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bcd"),
        "code"    : 101403,
        "account" : "Ukrsibbank UAH ThinkMobiles",
        "type"    : ObjectId("57da4d62713d3fe825f074ae"),
        "name"    : "101403 Ukrsibbank UAH ThinkMobiles",
        "category": ObjectId("5810c75b2b225158086d7f81")
    },
    {
        "_id"      : ObjectId("565eb53a6aa50532e5df0bce"),
        "code"     : 101404,
        "account"  : "Ukrsibbank USD YTS",
        "type"     : ObjectId("57da4d62713d3fe825f074ae"),
        "name"     : "101404 Ukrsibbank USD YTS",
        "payMethod": ObjectId("565c6059b8078e097eee955a"),
        "category" : ObjectId("5810c75b2b225158086d7f81")
    },
    {
        "_id"      : ObjectId("565eb53a6aa50532e5df0bcf"),
        "code"     : 101405,
        "account"  : "Ukrsibbank UAH YTS",
        "type"     : ObjectId("57da4d62713d3fe825f074ae"),
        "name"     : "101405 Ukrsibbank UAH YTS",
        "payMethod": ObjectId("565c6059b8078e097eee955b"),
        "category" : ObjectId("5810c75b2b225158086d7f81")
    },
    {
        "_id"      : ObjectId("565eb53a6aa50532e5df0bd0"),
        "code"     : 101406,
        "account"  : "Payoneer USD",
        "type"     : ObjectId("57da4d62713d3fe825f074ae"),
        "name"     : "101406 Payoneer USD",
        "payMethod": ObjectId("555cc981532aebbc4a8baf36"),
        "category" : ObjectId("5810c75b2b225158086d7f81")
    },
    {
        "_id"      : ObjectId("565eb53a6aa50532e5df0bd1"),
        "code"     : 101407,
        "account"  : "UniCreditBank USD",
        "type"     : ObjectId("57da4d62713d3fe825f074ae"),
        "name"     : "101407 UniCreditBank USD",
        "payMethod": ObjectId("565c6059b8078e097eee955c"),
        "category" : ObjectId("5810c75b2b225158086d7f81")
    },
    {
        "_id"      : ObjectId("565eb53a6aa50532e5df0bd2"),
        "code"     : 101500,
        "account"  : "Cash USD",
        "type"     : ObjectId("57da4d62713d3fe825f074ae"),
        "name"     : "101500 Cash USD",
        "payMethod": ObjectId("565c610f618d81c97e786eee"),
        "category" : ObjectId("5810c75b2b225158086d7f81")
    },
    {
        "_id"      : ObjectId("565eb53a6aa50532e5df0bd3"),
        "code"     : 101501,
        "account"  : "Cash UAH",
        "type"     : ObjectId("57da4d62713d3fe825f074ae"),
        "name"     : "101501 Cash UAH",
        "payMethod": ObjectId("565c610f618d81c97e786eef"),
        "category" : ObjectId("5810c75b2b225158086d7f81")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bd4"),
        "code"    : 101700,
        "account" : "Liquidity Transfers",
        "type"    : ObjectId("57da4d62713d3fe825f074b6"),
        "name"    : "101700 Liquidity Transfers",
        "category": ObjectId("5810c75b2b225158086d7f80")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bd5"),
        "code"    : 101600,
        "account" : "Opening Income Account",
        "type"    : ObjectId("57da4d62713d3fe825f074b3"),
        "name"    : "101600 Opening Income Account",
        "category": ObjectId("5810c75b2b225158086d7f85")
    },
    {
        "_id"      : ObjectId("565eb53a6aa50532e5df0bd6"),
        "code"     : 101401,
        "account"  : "Erste EUR",
        "type"     : ObjectId("57da4d62713d3fe825f074b6"),
        "name"     : "101401 Erste EUR",
        "payMethod": ObjectId("565c5b62bc6a01997710e02c"),
        "editedBy" : {
            "date": "2016-05-06T12:33:40.687Z",
            "user": ObjectId("563f673270bbc2b740ce89ae")
        },
        "category" : ObjectId("5810c75b2b225158086d7f80")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bd7"),
        "code"    : 102000,
        "account" : "Non-current assets",
        "type"    : ObjectId("57da4d62713d3fe825f074bc"),
        "name"    : "102000 Non-current assets",
        "category": ObjectId("5810c75b2b225158086d7f84"),
        "parent"  : ObjectId("5810c75b2b225158086d7f84")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bd8"),
        "code"    : 103000,
        "account" : "Prepayments",
        "type"    : ObjectId("57da4d62713d3fe825f074ba"),
        "name"    : "103000 Prepayments",
        "category": ObjectId("5810c75b2b225158086d7f86")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bd9"),
        "code"    : 104000,
        "account" : "Finished Goods",
        "type"    : ObjectId("57da4d62713d3fe825f074b7"),
        "name"    : "104000 Finished Goods",
        "category": ObjectId("5810c75b2b225158086d7f87")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bda"),
        "code"    : 104001,
        "account" : "Work In Process",
        "type"    : ObjectId("57da4d62713d3fe825f074b7"),
        "name"    : "104001 Work In Process",
        "category": ObjectId("5810c75b2b225158086d7f87")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bdb"),
        "code"    : 111000,
        "account" : "Unearned  Service Revenue",
        "type"    : ObjectId("57da4d62713d3fe825f074bd"),
        "name"    : "111000 Unearned  Service Revenue",
        "editedBy": {
            "date": "2016-05-06T12:33:40.687Z",
            "user": ObjectId("563f673270bbc2b740ce89ae")
        },
        "category": ObjectId("5810c75b2b225158086d7f88")
    }, {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bdc"),
        "code"    : 111100,
        "account" : "Account Payable",
        "type"    : ObjectId("57da4d62713d3fe825f074bd"),
        "name"    : "111100 Account Payable",
        "editedBy": {
            "date": "2016-05-06T12:33:40.686Z",
            "user": ObjectId("563f673270bbc2b740ce89ae")
        },
        "category": ObjectId("5810c75b2b225158086d7f88")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bdd"),
        "code"    : 111200,
        "account" : "Tax Received",
        "type"    : ObjectId("57da4d62713d3fe825f074bd"),
        "name"    : "111200 Tax Received",
        "category": ObjectId("5810c75b2b225158086d7f88")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bde"),
        "code"    : 111300,
        "account" : "Reserve and Profit/Loss Account",
        "type"    : ObjectId("57da4d62713d3fe825f074bd"),
        "name"    : "111300 Reserve and Profit/Loss Account",
        "category": ObjectId("5810c75b2b225158086d7f88")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bdf"),
        "code"    : 112000,
        "account" : "Non-current Liabilities",
        "type"    : ObjectId("57da4d62713d3fe825f074be"),
        "name"    : "112000 Non-current Liabilities",
        "category": ObjectId("5810c75b2b225158086d7f8a")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0be0"),
        "code"    : 200000,
        "account" : "Product Sales",
        "type"    : ObjectId("57da4d62713d3fe825f074bb"),
        "name"    : "200000 Product Sales",
        "category": ObjectId("5810c75b2b225158086d7f83")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0be1"),
        "code"    : 201000,
        "account" : "Foreign Exchange Gain",
        "type"    : ObjectId("57da4d62713d3fe825f074bb"),
        "name"    : "201000 Foreign Exchange Gain",
        "category": ObjectId("5810c75b2b225158086d7f83")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0be2"),
        "code"    : 210000,
        "account" : "Cost of Goods Sold",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "210000 Cost of Goods Sold",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0be3"),
        "code"    : 211000,
        "account" : "Foreign Exchange Loss",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "211000 Foreign Exchange Loss",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0be4"),
        "code"    : 212100,
        "account" : "Salary Expenses",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212100 Salary Expenses",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0be5"),
        "code"    : 212200,
        "account" : "Purchase of Equipments",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212200 Purchase of Equipments",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0be6"),
        "code"    : 212300,
        "account" : "Bank Fees",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212300 Bank Fees",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0be7"),
        "code"    : 212400,
        "account" : "Selling And Marketing",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212400 Selling And Marketing",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0be8"),
        "code"    : 212401,
        "account" : "Software&cloud",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212401 Software&cloud",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0be9"),
        "code"    : 212500,
        "account" : "Office Supply",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212500 Office Supply",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bea"),
        "code"    : 212500,
        "account" : "Office Furniture",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212500 Office Furniture",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0beb"),
        "code"    : 212600,
        "account" : "Rent&Utilities",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212600 Rent&Utilities",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bec"),
        "code"    : 212700,
        "account" : "Hardware",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212700 Hardware",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bed"),
        "code"    : 212800,
        "account" : "Admin Salary Expenses",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212800 Admin Salary Expenses",
        "editedBy": {
            "date": "2016-04-15T08:15:30.560Z",
            "user": ObjectId("52203e707d4dba8813000003")
        },
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bee"),
        "code"    : 212801,
        "account" : "Outsource",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212801 Outsource",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bef"),
        "code"    : 212802,
        "account" : "Events/meetings",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212802 Events/meetings",
        "category": ObjectId("5810c75b2b225158086d7f89")
    }, {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bf0"),
        "code"    : 212803,
        "account" : "Events/meetings",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "212803 Events/meetings",
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bf1"),
        "code"    : 220000,
        "account" : "Admin Expenses",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "220000 Admin Expenses",
        "editedBy": {
            "date": "2016-04-15T08:16:13.478Z",
            "user": ObjectId("52203e707d4dba8813000003")
        },
        "category": ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bf2"),
        "code"    : 300100,
        "account" : "Capital",
        "type"    : ObjectId("57da4d62713d3fe825f074b9"),
        "name"    : "300100 Capital",
        "category": ObjectId("5810c75b2b225158086d7f7f")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0bf3"),
        "code"    : 300200,
        "account" : "Retained Earnings",
        "type"    : ObjectId("57da4d62713d3fe825f074b9"),
        "name"    : "300200 Retained Earnings",
        "editedBy": {
            "date": "2016-04-15T08:15:56.524Z",
            "user": ObjectId("52203e707d4dba8813000003")
        },
        "category": ObjectId("5810c75b2b225158086d7f7f")
    },
    {
        "_id"        : ObjectId("56c4444eb81fd51e19207f3e"),
        "createdBy"  : {
            "date": "2016-02-17T09:58:38.810Z",
            "user": null
        },
        "editedBy"   : {
            "date": "2016-05-06T10:04:35.796Z",
            "user": ObjectId("563f673270bbc2b740ce89ae")
        },
        "payMethod"  : null,
        "type"       : ObjectId("57da4d62713d3fe825f074bd"),
        "account"    : "Salary Payable",
        "__v"        : 0,
        "code"       : 111101,
        "accountType": "Credit",
        "name"       : "111101 Salary Payable",
        "category"   : ObjectId("5810c75b2b225158086d7f88")
    },
    {
        "_id"        : ObjectId("56c9d4c7c3b88f6d64490fb4"),
        "code"       : 212102,
        "createdBy"  : {
            "date": "2016-02-21T15:16:23.022Z",
            "user": null
        },
        "editedBy"   : {
            "date": "2016-02-23T14:50:12.960Z",
            "user": ObjectId("52203e707d4dba8813000003")
        },
        "payMethod"  : null,
        "type"       : ObjectId("57da4d62713d3fe825f074b5"),
        "account"    : "Vacation & Holiday Expense",
        "__v"        : 0,
        "accountType": "Credit",
        "name"       : "212102 Vacation & Holiday Expense",
        "category"   : ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"        : ObjectId("56c9d555c3b88f6d64490fb5"),
        "code"       : 212103,
        "createdBy"  : {
            "date": "2016-02-21T15:18:45.244Z",
            "user": null
        },
        "editedBy"   : {
            "date": "2016-05-06T10:04:35.795Z",
            "user": ObjectId("563f673270bbc2b740ce89ae")
        },
        "payMethod"  : null,
        "type"       : ObjectId("57da4d62713d3fe825f074bd"),
        "account"    : "Salary Overtime Paybale",
        "__v"        : 0,
        "accountType": "Credit",
        "name"       : "212103 Salary Overtime Paybale",
        "category"   : ObjectId("5810c75b2b225158086d7f88")
    },
    {
        "_id"        : ObjectId("56cc6b62541812c071973569"),
        "code"       : 212104,
        "accountType": "Credit",
        "createdBy"  : {
            "date": "2016-02-23T14:23:30.848Z",
            "user": null
        },
        "editedBy"   : {
            "date": "2016-07-01T14:10:54.472Z",
            "user": null
        },
        "payMethod"  : null,
        "type"       : ObjectId("57da4d62713d3fe825f074b5"),
        "name"       : "212104 Idle Time Expenses",
        "account"    : "Idle Time Expenses",
        "__v"        : 0,
        "category"   : ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"        : ObjectId("56cc6bf2541812c07197356a"),
        "code"       : 212110,
        "accountType": "Credit",
        "createdBy"  : {
            "date": "2016-02-23T14:25:54.728Z",
            "user": null
        },
        "editedBy"   : {
            "date": "2016-07-01T14:18:01.361Z",
            "user": null
        },
        "payMethod"  : null,
        "type"       : ObjectId("57da4d62713d3fe825f074b5"),
        "name"       : "212110 Total  Expenses",
        "account"    : "Total  Expenses",
        "__v"        : 0,
        "category"   : ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"      : ObjectId("56f538149c85020807b4001f"),
        "code"     : 400000,
        "createdBy": {
            "date": "2016-03-25T13:07:32.320Z",
            "user": null
        },
        "editedBy" : {
            "user": null
        },
        "payMethod": null,
        "type"     : ObjectId("57da4d62713d3fe825f074b0"),
        "name"     : "400000 Income Summary",
        "account"  : "Income Summary",
        "__v"      : 0,
        "category" : ObjectId("5810c75b2b225158086d7f7e")
    },
    {
        "_id"      : ObjectId("572346da8ba4fd1330062723"),
        "code"     : 700300,
        "createdBy": {
            "date": "Fri May 06 2016 06:01:49 GMT+0000 (Всесвітній координований час)",
            "user": null
        },
        "editedBy" : {
            "date": "2016-05-06T12:41:41.127Z",
            "user": ObjectId("563f673270bbc2b740ce89ae")
        },
        "payMethod": null,
        "type"     : ObjectId("57da4d62713d3fe825f074bd"),
        "name"     : "700300 Dividends Payable",
        "account"  : "Dividends Payable",
        "__v"      : 0,
        "category" : ObjectId("5810c75b2b225158086d7f88")
    },
    {
        "_id"      : ObjectId("577679ee832a51132161e03a"),
        "code"     : 212105,
        "createdBy": {
            "date": "2016-07-01T14:10:54.336Z",
            "user": null
        },
        "editedBy" : {
            "date": "2016-07-01T14:12:35.703Z",
            "user": null
        },
        "payMethod": null,
        "type"     : ObjectId("57da4d62713d3fe825f074b5"),
        "name"     : "212105    Marketing Expenses",
        "account"  : "   Marketing Expenses",
        "__v"      : 0,
        "category" : ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"      : ObjectId("57767b99ca7bd4d021041d32"),
        "code"     : 212111,
        "createdBy": {
            "date": "2016-07-01T14:18:01.040Z",
            "user": null
        },
        "editedBy" : {
            "user": null
        },
        "payMethod": null,
        "type"     : ObjectId("57da4d62713d3fe825f074b5"),
        "name"     : "212111  R&D Expenses",
        "account"  : " R&D Expenses",
        "__v"      : 0,
        "category" : ObjectId("5810c75b2b225158086d7f89")
    },
    {
        "_id"      : ObjectId("577f98244b90ec163f270f1b"),
        "code"     : 101408,
        "createdBy": {
            "date": "2016-07-08T12:10:12.852Z",
            "user": null
        },
        "editedBy" : {
            "user": null
        },
        "payMethod": null,
        "type"     : ObjectId("57da4d62713d3fe825f074ae"),
        "name"     : "101408  PrivatBank USD",
        "account"  : " PrivatBank USD",
        "__v"      : 0,
        "category" : ObjectId("5810c75b2b225158086d7f81")
    },
    {
        "_id"      : ObjectId("577f983b5dc67c373fced537"),
        "code"     : 101409,
        "createdBy": {
            "date": "2016-07-08T12:10:35.296Z",
            "user": null
        },
        "editedBy" : {
            "user": null
        },
        "payMethod": null,
        "type"     : ObjectId("57da4d62713d3fe825f074ae"),
        "name"     : "101409  PrivatBank EUR",
        "account"  : " PrivatBank EUR",
        "__v"      : 0,
        "category" : ObjectId("5810c75b2b225158086d7f81")
    },
    {
        "_id"      : ObjectId("5788b4be52adaf4c49e4b51c"),
        "code"     : 104002,
        "createdBy": {
            "date": "2016-07-15T10:02:38.331Z",
            "user": null
        },
        "editedBy" : {
            "user": null
        },
        "payMethod": null,
        "type"     : ObjectId("57da4d62713d3fe825f074b7"),
        "name"     : "104002 Inventory",
        "account"  : "Inventory",
        "__v"      : 0,
        "category" : ObjectId("5810c75b2b225158086d7f87")
    },
    {
        "_id"       : ObjectId("58073e4e49519eac0c535a08"),
        "code"      : 111400,
        "createdBy" : {
            "date": "2016-10-27T08:33:20.832Z",
            "user": null
        },
        "editedBy"  : {
            "user": null
        },
        "payMethod" : null,
        "budgeted"  : false,
        "category"  : ObjectId("5810c75b2b225158086d7f88"),
        "subAccount": null,
        "name"      : "111400 Stock received not Invoiced",
        "account"   : "Stock received not Invoiced",
        "__v"       : 0
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0b15"),
        "code"    : 201001,
        "account" : "Unrealized Exchange Gain",
        "type"    : ObjectId("57da4d62713d3fe825f074bb"),
        "name"    : "201001 Unrealized Exchange Gain",
        "category": ObjectId("5810c75b2b225158086d7f83")
    },
    {
        "_id"     : ObjectId("565eb53a6aa50532e5df0b16"),
        "code"    : 211001,
        "account" : "Unrealized Exchange Loss",
        "type"    : ObjectId("57da4d62713d3fe825f074b5"),
        "name"    : "211001 Unrealized Exchange Loss",
        "category": ObjectId("5810c75b2b225158086d7f89")
    }
];

var body = [{
    "_id"          : ObjectId("584e47953d2d06b40d2e9dc0"),
    "productsCount": 0,
    "removable"    : false,
    "main"         : false,
    "sequence"     : 0,
    "nestingLevel" : 1,
    "editedBy"     : {
        "date": "2016-12-12T06:45:41.456Z",
        "user": ObjectId("5797555d10343a8c275f3e70")
    },
    "createdBy"    : {
        "date": "2016-12-12T06:45:41.456Z",
        "user": ObjectId("5797555d10343a8c275f3e70")
    },
    "users"        : [],
    "child"        : [
        ObjectId("5810c75b2b225158086d7f8a"),
        ObjectId("5810c75b2b225158086d7f88")
    ],
    "parent"       : null,
    "fullName"     : "Liabilities",
    "name"         : "Liabilities",
    "__v"          : 0
}, {
    __v          : 0,
    _id          : ObjectId("584aa1e84881bdc437c60828"),
    child        : [ObjectId("5810c75b2b225158086d7f82"), ObjectId("5810c75b2b225158086d7f80"), ObjectId("5810c75b2b225158086d7f84"), ObjectId('5810c75b2b225158086d7f87'), ObjectId("5810c75b2b225158086d7f81")],
    createdBy    : {date: "2016-12-09T12:22:00.065Z", user: "5797555d10343a8c275f3e70"},
    editedBy     : {date: "2016-12-09T12:22:00.065Z", user: "5797555d10343a8c275f3e70"},
    fullName     : "Assets",
    main         : false,
    name         : "Assets",
    nestingLevel : 1,
    parent       : null,
    productsCount: 0,
    removable    : false,
    sequence     : 0,
    users        : []
}, {
    "_id"          : ObjectId("5810c75b2b225158086d7f7e"),
    "productsCount": 2,
    "removable"    : false,
    "main"         : false,
    "sequence"     : 0,
    "nestingLevel" : 0,
    "editedBy"     : {
        "date": "2016-10-26T15:10:19.904Z",
        "user": null
    },
    "createdBy"    : {
        "date": "2016-10-26T15:10:19.904Z",
        "user": null
    },
    "users"        : [],
    "child"        : [],
    "parent"       : null,
    "fullName"     : "Income Summary",
    "name"         : "Income Summary",
    "__v"          : 0
},
    {
        "_id"          : ObjectId("5810c75b2b225158086d7f7f"),
        "productsCount": 2,
        "removable"    : false,
        "main"         : false,
        "sequence"     : 1,
        "nestingLevel" : 0,
        "editedBy"     : {
            "date": "2016-10-26T15:10:19.913Z",
            "user": null
        },
        "createdBy"    : {
            "date": "2016-10-26T15:10:19.913Z",
            "user": null
        },
        "users"        : [],
        "child"        : [],
        "parent"       : null,
        "fullName"     : "Equity",
        "name"         : "Equity",
        "__v"          : 0
    },
    {
        "_id"          : ObjectId("5810c75b2b225158086d7f82"),
        "productsCount": 1,
        "removable"    : false,
        "main"         : false,
        "sequence"     : 1,
        "nestingLevel" : 1,
        "editedBy"     : {
            "date": "2016-10-26T15:10:19.917Z",
            "user": null
        },
        "createdBy"    : {
            "date": "2016-10-26T15:10:19.917Z",
            "user": null
        },
        "users"        : [],
        "child"        : [],
        "parent"       : ObjectId("584aa1e84881bdc437c60828"),
        "fullName"     : "Assets / Fixed Assets",
        "name"         : "Fixed Assets",
        "__v"          : 0
    },
    {
        "_id"          : ObjectId("5810c75b2b225158086d7f84"),
        "productsCount": 1,
        "removable"    : false,
        "main"         : false,
        "sequence"     : 2,
        "nestingLevel" : 1,
        "editedBy"     : {
            "date": "2016-10-26T15:10:19.918Z",
            "user": null
        },
        "createdBy"    : {
            "date": "2016-10-26T15:10:19.918Z",
            "user": null
        },
        "users"        : [],
        "child"        : [],
        "parent"       : ObjectId("584aa1e84881bdc437c60828"),
        "fullName"     : "Assets / Non-current Assets",
        "name"         : "Non-current Assets",
        "__v"          : 0
    },
    {
        "_id"          : ObjectId("5810c75b2b225158086d7f80"),
        "productsCount": 3,
        "removable"    : false,
        "main"         : false,
        "sequence"     : 3,
        "nestingLevel" : 2,
        "editedBy"     : {
            "date": "2016-10-26T15:10:19.915Z",
            "user": null
        },
        "createdBy"    : {
            "date": "2016-10-26T15:10:19.915Z",
            "user": null
        },
        "users"        : [],
        "child"        : [
            ObjectId("5810c75b2b225158086d7f81"),
            ObjectId("5810c75b2b225158086d7f87")
        ],
        "parent"       : ObjectId("584aa1e84881bdc437c60828"),
        "fullName"     : "Assets / Current Assets",
        "name"         : "Current Assets",
        "__v"          : 0
    },
    {
        "_id"          : ObjectId("5810c75b2b225158086d7f89"),
        "productsCount": 21,
        "removable"    : false,
        "main"         : false,
        "sequence"     : 0,
        "nestingLevel" : 0,
        "editedBy"     : {
            "date": "2016-10-26T15:10:19.927Z",
            "user": null
        },
        "createdBy"    : {
            "date": "2016-10-26T15:10:19.926Z",
            "user": null
        },
        "users"        : [],
        "child"        : [],
        "parent"       : null,
        "fullName"     : "Expenses",
        "name"         : "Expenses",
        "__v"          : 0
    },
    {
        "_id"          : ObjectId("5810c75b2b225158086d7f85"),
        "productsCount": 1,
        "removable"    : false,
        "main"         : false,
        "sequence"     : 0,
        "nestingLevel" : 0,
        "editedBy"     : {
            "date": "2016-10-26T15:10:19.919Z",
            "user": null
        },
        "createdBy"    : {
            "date": "2016-10-26T15:10:19.919Z",
            "user": null
        },
        "users"        : [],
        "child"        : [],
        "parent"       : null,
        "fullName"     : "Other Income",
        "name"         : "Other Income",
        "__v"          : 0
    },
    {
        "_id"          : ObjectId("5810c75b2b225158086d7f81"),
        "productsCount": 12,
        "removable"    : false,
        "main"         : false,
        "sequence"     : 4,
        "nestingLevel" : 3,
        "editedBy"     : {
            "date": "2016-10-26T15:10:19.916Z",
            "user": null
        },
        "createdBy"    : {
            "date": "2016-10-26T15:10:19.916Z",
            "user": null
        },
        "users"        : [],
        "child"        : [],
        "parent"       : ObjectId("5810c75b2b225158086d7f80"),
        "fullName"     : "Assets / Current Assets / Bank and Cash",
        "name"         : "Bank and Cash",
        "__v"          : 0
    },
    {
        "_id"          : ObjectId("5810c75b2b225158086d7f87"),
        "productsCount": 3,
        "removable"    : false,
        "main"         : false,
        "sequence"     : 5,
        "nestingLevel" : 3,
        "editedBy"     : {
            "date": "2016-10-26T15:10:19.924Z",
            "user": null
        },
        "createdBy"    : {
            "date": "2016-10-26T15:10:19.924Z",
            "user": null
        },
        "users"        : [],
        "child"        : [],
        "parent"       : ObjectId("5810c75b2b225158086d7f80"),
        "fullName"     : "Assets / Current Assets / Inventory",
        "name"         : "Inventory",
        "__v"          : 0
    },
    {
        "_id"          : ObjectId("5810c75b2b225158086d7f83"),
        "productsCount": 2,
        "removable"    : false,
        "main"         : false,
        "sequence"     : 0,
        "nestingLevel" : 0,
        "editedBy"     : {
            "date": "2016-10-26T15:10:19.918Z",
            "user": null
        },
        "createdBy"    : {
            "date": "2016-10-26T15:10:19.918Z",
            "user": null
        },
        "users"        : [],
        "child"        : [],
        "parent"       : null,
        "fullName"     : "Income",
        "name"         : "Income",
        "__v"          : 0
    },
    {
        "_id"          : ObjectId("5810c75b2b225158086d7f86"),
        "productsCount": 1,
        "removable"    : false,
        "main"         : false,
        "sequence"     : 0,
        "nestingLevel" : 0,
        "editedBy"     : {
            "date": "2016-10-26T15:10:19.920Z",
            "user": null
        },
        "createdBy"    : {
            "date": "2016-10-26T15:10:19.920Z",
            "user": null
        },
        "users"        : [],
        "child"        : [],
        "parent"       : null,
        "fullName"     : "Prepayments",
        "name"         : "Prepayments",
        "__v"          : 0
    },
    {
        "_id"          : ObjectId("5810c75b2b225158086d7f88"),
        "productsCount": 7,
        "removable"    : false,
        "main"         : false,
        "sequence"     : 0,
        "nestingLevel" : 1,
        "editedBy"     : {
            "date": "2016-10-26T15:10:19.926Z",
            "user": null
        },
        "createdBy"    : {
            "date": "2016-10-26T15:10:19.926Z",
            "user": null
        },
        "users"        : [],
        "child"        : [],
        "parent"       : ObjectId("584e47953d2d06b40d2e9dc0"),
        "fullName"     : "Liabilities / Current Liabilities",
        "name"         : "Current Liabilities",
        "__v"          : 0
    },
    {
        "_id"          : ObjectId("5810c75b2b225158086d7f8a"),
        "productsCount": 1,
        "removable"    : false,
        "main"         : false,
        "sequence"     : 0,
        "nestingLevel" : 1,
        "editedBy"     : {
            "date": "2016-10-26T15:10:19.927Z",
            "user": null
        },
        "createdBy"    : {
            "date": "2016-10-26T15:10:19.927Z",
            "user": null
        },
        "users"        : [],
        "child"        : [],
        "parent"       : ObjectId("584e47953d2d06b40d2e9dc0"),
        "fullName"     : "Liabilities / Non-current Liabilities",
        "name"         : "Non-current Liabilities",
        "__v"          : 0
    }];

accountsCategory.remove({}, function () {
    accountsCategory.collection.insertMany(body, function (err, saved) {
        if (err) {
            return console.log(err);
        }
        console.log(saved);
    });
});

chartOfAccount.remove({}, function () {
    chartOfAccount.collection.insertMany(bodyCharts, function (err, saved) {
        if (err) {
            return console.log(err);
        }
        console.log(saved);
    });
});





