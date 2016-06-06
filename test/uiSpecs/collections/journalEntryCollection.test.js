define([
    'collections/journalEntry/filterCollection',
    'chai'
], function (JournalEntryCollection, chai) {
    'use strict';
    var expect = chai.expect;

    describe('JournalEntryCollection', function () {
        var mainSpy;
        var server;
        var journalEntryCollection;
        var fakeJournal = [
            {
                _id           : "572b5a78c7389cfa5172a6af",
                debit         : 13300,
                sourceDocument: {
                    model  : "Invoice",
                    _id    : {
                        _id             : "568bb6af7c0383e04c60e892",
                        _type           : "wTrackInvoice",
                        __v             : 0,
                        project         : "55b92ad621e4b7c40f00068c",
                        products        : [
                            {
                                subTotal   : 13300,
                                unitPrice  : 13300,
                                taxes      : 0,
                                jobs       : "568bb6047c0383e04c60e88b",
                                description: "",
                                product    : "5540d528dacb551c24000003",
                                quantity   : 19
                            }
                        ],
                        editedBy        : {
                            date: "2016-03-14T07:55:20.865Z",
                            user: "55bf144765cda0810b000005"
                        },
                        createdBy       : {
                            date: "2016-01-05T12:27:04.595Z",
                            user: "55bf144765cda0810b000005"
                        },
                        creationDate    : "2016-01-05T12:27:04.595Z",
                        groups          : {
                            group: [],
                            users: [],
                            owner: "560c099da5d4a2e20ba5068b"
                        },
                        whoCanRW        : "everyOne",
                        workflow        : "55647d982e4aa3804a765ecb",
                        payments        : [
                            "56e66e6d3d5bc25541857e14"
                        ],
                        paymentInfo     : {
                            taxes  : 0,
                            unTaxed: 13300,
                            balance: 0,
                            total  : 13300
                        },
                        paymentTerms    : null,
                        salesPerson     : "55b92ad221e4b7c40f000063",
                        currency        : {
                            _id : "565eab29aeb95fa9c0f9df2d",
                            rate: 1
                        },
                        journal         : "565ef6ba270f53d02ee71d65",
                        invoiceDate     : "2016-01-01T04:00:00.000Z",
                        paymentReference: "PO651",
                        sourceDocument  : "568bb6987c0383e04c60e891",
                        supplier        : "55b92ad521e4b7c40f000621",
                        forSales        : true,
                        name            : "26780540",
                        dueDate         : "2016-01-15T04:00:00.000Z",
                        paymentDate     : "2016-01-08T04:00:00.000Z",
                        approved        : true,
                        reconcile       : true,
                        attachments     : [],
                        removable       : false
                    },
                    subject: {
                        _id           : "55b92ad521e4b7c40f000621",
                        ID            : 22,
                        companyInfo   : {
                            size    : null,
                            industry: null
                        },
                        editedBy      : {
                            date: "2015-07-29T19:34:45.999Z",
                            user: "52203e707d4dba8813000003"
                        },
                        createdBy     : {
                            date: "2015-07-29T19:34:45.999Z",
                            user: "52203e707d4dba8813000003"
                        },
                        history       : [],
                        attachments   : [],
                        notes         : [],
                        groups        : {
                            group: [],
                            users: [],
                            owner: null
                        },
                        whoCanRW      : "everyOne",
                        social        : {
                            LI: "",
                            FB: ""
                        },
                        color         : "#4d5a75",
                        relatedUser   : null,
                        salesPurchases: {
                            receiveMessages: 0,
                            language       : "English",
                            reference      : "",
                            active         : true,
                            implementedBy  : null,
                            salesTeam      : null,
                            salesPerson    : null,
                            isSupplier     : false,
                            isCustomer     : true
                        },
                        title         : "",
                        internalNotes : "",
                        contacts      : [],
                        phones        : {
                            fax   : "",
                            mobile: "",
                            phone : ""
                        },
                        skype         : "",
                        jobPosition   : "",
                        website       : "",
                        address       : {
                            country: null,
                            zip    : "",
                            state  : "",
                            city   : "",
                            street : ""
                        },
                        timezone      : "UTC",
                        department    : null,
                        company       : null,
                        email         : "",
                        imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        name          : {
                            last : "",
                            first: "Mike Allstar"
                        },
                        isOwn         : false,
                        type          : "Person",
                        __v           : 0
                    },
                    name   : "26780540"
                },
                currency      : {
                    rate: 1,
                    name: "USD"
                },
                account       : {
                    _id     : "565eb53a6aa50532e5df0bc9",
                    code    : 101200,
                    account : "Account Receivable",
                    type    : "Receivable",
                    name    : "101200 Account Receivable",
                    editedBy: {
                        date: "2015-12-02T14:21:11.878Z",
                        user: "52203e707d4dba8813000003"
                    }
                },
                journal       : {
                    name         : "Invoice Journal",
                    creditAccount: {
                        _id    : "565eb53a6aa50532e5df0be0",
                        code   : 200000,
                        account: "Product Sales",
                        type   : "Income",
                        name   : "200000 Product Sales"
                    },
                    debitAccount : {
                        _id     : "565eb53a6aa50532e5df0bc9",
                        code    : 101200,
                        account : "Account Receivable",
                        type    : "Receivable",
                        name    : "101200 Account Receivable",
                        editedBy: {
                            date: "2015-12-02T14:21:11.878Z",
                            user: "52203e707d4dba8813000003"
                        }
                    }
                },
                date          : "2016-01-01T04:00:00.000Z"
            },
            {
                _id           : "572b5a78c7389cfa5172a549",
                debit         : 14400,
                sourceDocument: {
                    model  : "Invoice",
                    _id    : {
                        _id             : "568a4fce3cce9254776f2b44",
                        _type           : "wTrackInvoice",
                        __v             : 0,
                        project         : "55b92ad621e4b7c40f000672",
                        products        : [
                            {
                                unitPrice  : 7200,
                                subTotal   : 7200,
                                taxes      : 0,
                                jobs       : "568a3ce63cce9254776f2b36",
                                description: "",
                                product    : "5540d528dacb551c24000003",
                                quantity   : 8
                            },
                            {
                                unitPrice  : 7200,
                                subTotal   : 7200,
                                taxes      : 0,
                                jobs       : "568a3cb63cce9254776f2b34",
                                description: "",
                                product    : "5540d528dacb551c24000003",
                                quantity   : 8
                            }
                        ],
                        editedBy        : {
                            date: "2016-01-05T12:16:46.819Z",
                            user: "55bf144765cda0810b000005"
                        },
                        createdBy       : {
                            date: "2016-01-04T10:55:21.506Z",
                            user: "52203e707d4dba8813000003"
                        },
                        creationDate    : "2016-01-04T10:55:21.506Z",
                        groups          : {
                            group: [],
                            users: [],
                            owner: "560c099da5d4a2e20ba5068b"
                        },
                        whoCanRW        : "everyOne",
                        workflow        : "55647d982e4aa3804a765ecb",
                        payments        : [
                            "568bb4377c0383e04c60e880"
                        ],
                        paymentInfo     : {
                            taxes  : 0,
                            unTaxed: 14400,
                            balance: 0,
                            total  : 14400
                        },
                        paymentTerms    : null,
                        salesPerson     : "55b92ad221e4b7c40f000063",
                        currency        : {
                            _id : "565eab29aeb95fa9c0f9df2d",
                            rate: 1
                        },
                        journal         : "565ef6ba270f53d02ee71d65",
                        invoiceDate     : "2016-01-03T04:00:00.000Z",
                        paymentReference: "PO647",
                        sourceDocument  : "568a4f993cce9254776f2b43",
                        supplier        : "55b92ad521e4b7c40f000621",
                        forSales        : true,
                        name            : "26662835",
                        dueDate         : "2016-01-18T23:00:00.000Z",
                        paymentDate     : "2016-01-04T04:00:00.000Z",
                        approved        : true,
                        reconcile       : true,
                        attachments     : [],
                        removable       : false
                    },
                    subject: {
                        _id           : "55b92ad521e4b7c40f000621",
                        ID            : 22,
                        companyInfo   : {
                            size    : null,
                            industry: null
                        },
                        editedBy      : {
                            date: "2015-07-29T19:34:45.999Z",
                            user: "52203e707d4dba8813000003"
                        },
                        createdBy     : {
                            date: "2015-07-29T19:34:45.999Z",
                            user: "52203e707d4dba8813000003"
                        },
                        history       : [],
                        attachments   : [],
                        notes         : [],
                        groups        : {
                            group: [],
                            users: [],
                            owner: null
                        },
                        whoCanRW      : "everyOne",
                        social        : {
                            LI: "",
                            FB: ""
                        },
                        color         : "#4d5a75",
                        relatedUser   : null,
                        salesPurchases: {
                            receiveMessages: 0,
                            language       : "English",
                            reference      : "",
                            active         : true,
                            implementedBy  : null,
                            salesTeam      : null,
                            salesPerson    : null,
                            isSupplier     : false,
                            isCustomer     : true
                        },
                        title         : "",
                        internalNotes : "",
                        contacts      : [],
                        phones        : {
                            fax   : "",
                            mobile: "",
                            phone : ""
                        },
                        skype         : "",
                        jobPosition   : "",
                        website       : "",
                        address       : {
                            country: null,
                            zip    : "",
                            state  : "",
                            city   : "",
                            street : ""
                        },
                        timezone      : "UTC",
                        department    : null,
                        company       : null,
                        email         : "",
                        imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        name          : {
                            last : "",
                            first: "Mike Allstar"
                        },
                        isOwn         : false,
                        type          : "Person",
                        __v           : 0
                    },
                    name   : "26662835"
                },
                currency      : {
                    rate: 1,
                    name: "USD"
                },
                account       : {
                    _id     : "565eb53a6aa50532e5df0bc9",
                    code    : 101200,
                    account : "Account Receivable",
                    type    : "Receivable",
                    name    : "101200 Account Receivable",
                    editedBy: {
                        date: "2015-12-02T14:21:11.878Z",
                        user: "52203e707d4dba8813000003"
                    }
                },
                journal       : {
                    name         : "Invoice Journal",
                    creditAccount: {
                        _id    : "565eb53a6aa50532e5df0be0",
                        code   : 200000,
                        account: "Product Sales",
                        type   : "Income",
                        name   : "200000 Product Sales"
                    },
                    debitAccount : {
                        _id     : "565eb53a6aa50532e5df0bc9",
                        code    : 101200,
                        account : "Account Receivable",
                        type    : "Receivable",
                        name    : "101200 Account Receivable",
                        editedBy: {
                            date: "2015-12-02T14:21:11.878Z",
                            user: "52203e707d4dba8813000003"
                        }
                    }
                },
                date          : "2016-01-03T04:00:00.000Z"
            },
            {
                _id           : "572b5a77c7389cfa5172a3b1",
                debit         : 432000,
                sourceDocument: {
                    model  : "Invoice",
                    _id    : {
                        _id             : "56a15c402208b3af4a527286",
                        _type           : "wTrackInvoice",
                        __v             : 0,
                        project         : "55b92ad621e4b7c40f00067f",
                        products        : [
                            {
                                subTotal   : 432000,
                                unitPrice  : 432000,
                                taxes      : 0,
                                jobs       : "5661f62225e5eb511510bb41",
                                description: "",
                                product    : "5540d528dacb551c24000003",
                                quantity   : 256
                            }
                        ],
                        editedBy        : {
                            date: "2016-02-12T09:38:12.564Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        createdBy       : {
                            date: "2016-01-21T22:31:14.602Z",
                            user: "563f673270bbc2b740ce89ae"
                        },
                        creationDate    : "2016-01-21T22:31:14.602Z",
                        groups          : {
                            group: [],
                            users: [],
                            owner: "560c099da5d4a2e20ba5068b"
                        },
                        whoCanRW        : "everyOne",
                        workflow        : "55647d982e4aa3804a765ecb",
                        payments        : [
                            "56bda818dfd8a81466e2f50a"
                        ],
                        paymentInfo     : {
                            taxes  : 0,
                            unTaxed: 432000,
                            balance: 0,
                            total  : 432000
                        },
                        paymentTerms    : null,
                        salesPerson     : "55b92ad221e4b7c40f00004a",
                        currency        : {
                            _id : "565eab29aeb95fa9c0f9df2d",
                            rate: 1
                        },
                        journal         : "565ef6ba270f53d02ee71d65",
                        invoiceDate     : "2016-01-03T04:00:00.000Z",
                        paymentReference: "PO701",
                        sourceDocument  : "56a15c322208b3af4a527285",
                        supplier        : "55b92ad621e4b7c40f000624",
                        forSales        : true,
                        name            : "A0104012016",
                        dueDate         : "2016-01-17T04:00:00.000Z",
                        paymentDate     : "2016-01-10T04:00:00.000Z",
                        approved        : true,
                        reconcile       : true,
                        attachments     : [],
                        removable       : false
                    },
                    subject: {
                        _id           : "55b92ad621e4b7c40f000624",
                        ID            : 37,
                        companyInfo   : {
                            size    : null,
                            industry: null
                        },
                        editedBy      : {
                            date: "2015-07-29T19:34:46.000Z",
                            user: "52203e707d4dba8813000003"
                        },
                        createdBy     : {
                            date: "2015-07-29T19:34:46.000Z",
                            user: "52203e707d4dba8813000003"
                        },
                        history       : [],
                        attachments   : [],
                        notes         : [],
                        groups        : {
                            group: [],
                            users: [],
                            owner: null
                        },
                        whoCanRW      : "everyOne",
                        social        : {
                            LI: "",
                            FB: ""
                        },
                        color         : "#4d5a75",
                        relatedUser   : null,
                        salesPurchases: {
                            receiveMessages: 0,
                            language       : "English",
                            reference      : "",
                            active         : true,
                            implementedBy  : null,
                            salesTeam      : null,
                            salesPerson    : null,
                            isSupplier     : false,
                            isCustomer     : true
                        },
                        title         : "",
                        internalNotes : "",
                        contacts      : [],
                        phones        : {
                            fax   : "",
                            mobile: "",
                            phone : ""
                        },
                        skype         : "",
                        jobPosition   : "",
                        website       : "",
                        address       : {
                            country: "France",
                            zip    : "",
                            state  : "",
                            city   : "",
                            street : ""
                        },
                        timezone      : "UTC",
                        department    : null,
                        company       : null,
                        email         : "",
                        imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        name          : {
                            last : "",
                            first: "Giroptic"
                        },
                        isOwn         : false,
                        type          : "Person",
                        __v           : 0
                    },
                    name   : "A0104012016"
                },
                currency      : {
                    rate: 1,
                    name: "USD"
                },
                account       : {
                    _id     : "565eb53a6aa50532e5df0bc9",
                    code    : 101200,
                    account : "Account Receivable",
                    type    : "Receivable",
                    name    : "101200 Account Receivable",
                    editedBy: {
                        date: "2015-12-02T14:21:11.878Z",
                        user: "52203e707d4dba8813000003"
                    }
                },
                journal       : {
                    name         : "Invoice Journal",
                    creditAccount: {
                        _id    : "565eb53a6aa50532e5df0be0",
                        code   : 200000,
                        account: "Product Sales",
                        type   : "Income",
                        name   : "200000 Product Sales"
                    },
                    debitAccount : {
                        _id     : "565eb53a6aa50532e5df0bc9",
                        code    : 101200,
                        account : "Account Receivable",
                        type    : "Receivable",
                        name    : "101200 Account Receivable",
                        editedBy: {
                            date: "2015-12-02T14:21:11.878Z",
                            user: "52203e707d4dba8813000003"
                        }
                    }
                },
                date          : "2016-01-03T04:00:00.000Z"
            }
        ];

        before(function () {
            server = sinon.fakeServer.create();
            mainSpy = sinon.spy(App, 'render');
        });

        after(function () {
            server.restore();
            mainSpy.restore();
        });

        it('Try to create collection', function (done) {
            var journalUrl = new RegExp('/journalEntries/list', 'i');

            server.respondWith('GET', journalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournal)]);
            journalEntryCollection = new JournalEntryCollection({
                viewType: 'list',
                success : function () {
                    done();
                },
                error   : function (collection, response) {
                    done(response);
                }
            });
            server.respond();

            expect(journalEntryCollection.toJSON().length).to.be.equals(3);
        });

        it('Try to create collection with error', function (done) {
            var journalUrl = new RegExp('/journalEntries/list', 'i');

            server.respondWith('GET', journalUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournal)]);
            journalEntryCollection = new JournalEntryCollection({
                viewType: 'list',
                success : function () {
                    done();
                },
                error   : function (collection, response) {
                    done(response);
                }
            });
            server.respond();

            expect(window.location.hash).to.be.equals('#login');
        });

        it('Try to showMore collection', function () {
            var journalUrl = new RegExp('/journalEntries/list', 'i');

            server.respondWith('GET', journalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournal)]);
            journalEntryCollection.showMore({
                page       : 1,
                count      : 2,
                viewType   : 'list',
                contentType: 'JournalEntry'
            });
            server.respond();

            expect(journalEntryCollection.toJSON().length).to.be.equals(3);
        });

        it('Try to showMore collection', function () {
            var spyResponse;
            var journalUrl = new RegExp('/journalEntries/list', 'i');

            server.respondWith('GET', journalUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournal)]);
            journalEntryCollection.showMore();
            server.respond();

            spyResponse = mainSpy.args[0][0];
            expect(spyResponse).to.have.property('type', 'error');
            expect(spyResponse).to.have.property('message', 'Some Error.');
        });

    });
});
