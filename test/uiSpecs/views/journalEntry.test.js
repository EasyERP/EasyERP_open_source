define([
    'Backbone',
    'Underscore',
    'modules',
    'text!fixtures/index.html',
    'collections/journalEntry/filterCollection',
    'views/main/MainView',
    'views/journalEntry/list/ListView',
    'views/journalEntry/TopBarView',
    'views/Filter/filterView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone, _, modules, fixtures, JournalEntryCollection, MainView, ListView, TopBarView, FilterView, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';
    var expect;

    var fakeJournalEntry = {
        total: 300,
        data : [
            {
                _id           : "574ed1073b7cc36e352711bc",
                debit         : 202500,
                sourceDocument: {
                    model  : "Invoice",
                    _id    : {
                        _id             : "572b00b3dce306912118afab",
                        _type           : "wTrackInvoice",
                        __v             : 0,
                        project         : "55b92ad621e4b7c40f000684",
                        products        : [
                            {
                                subTotal   : 202500,
                                unitPrice  : 202500,
                                taxes      : 0,
                                jobs       : "56e670e7dd81ed4e426c60ab",
                                description: "",
                                product    : "5540d528dacb551c24000003",
                                quantity   : 84
                            }
                        ],
                        emailed         : false,
                        approved        : true,
                        removable       : false,
                        invoiced        : false,
                        attachments     : [
                            {
                                _id         : "572b00b271d367e52185bd53",
                                name        : "Unibet November.pdf",
                                shortPas    : "%2Fuploads%2F572b00b3dce306912118afab%2FUnibet%20November.pdf",
                                size        : "0.047&nbsp;Mb",
                                uploadDate  : "2016-05-05T08:13:38.993Z",
                                uploaderName: "peter.volosh"
                            }
                        ],
                        editedBy        : {
                            user: "563f673270bbc2b740ce89ae",
                            date: "2016-05-05T10:32:59.145Z"
                        },
                        createdBy       : {
                            date: "2016-05-05T08:11:52.969Z",
                            user: "55b9fc0fd79a3a3439000008"
                        },
                        creationDate    : "2016-05-05T08:11:52.969Z",
                        groups          : {
                            owner: "560c099da5d4a2e20ba5068b",
                            users: [],
                            group: []
                        },
                        whoCanRW        : "everyOne",
                        workflow        : "55647d982e4aa3804a765ecb",
                        paymentInfo     : {
                            total  : 202500,
                            taxes  : 0,
                            unTaxed: 202500,
                            balance: 0
                        },
                        paymentTerms    : null,
                        salesPerson     : "55b92ad221e4b7c40f00005f",
                        currency        : {
                            _id : "565eab29aeb95fa9c0f9df2d",
                            rate: 1
                        },
                        journal         : "565ef6ba270f53d02ee71d65",
                        invoiceDate     : "2016-05-03T22:00:00.000Z",
                        paymentReference: "PO1032",
                        sourceDocument  : "572b0048a132c10022d39b75",
                        supplier        : "55ba0b46d79a3a3439000013",
                        forSales        : true,
                        name            : "PO1032",
                        dueDate         : "2016-05-03T22:00:00.000Z",
                        reconcile       : true,
                        paymentDate     : "2016-05-03T22:00:00.000Z",
                        payments        : [
                            "572b21609ac68ede4899da89"
                        ]
                    },
                    subject: {
                        name: {
                            last : "",
                            first: "Unibet"
                        }
                    }
                },
                currency      : {
                    rate: 1,
                    name: "USD"
                },
                journal       : {
                    name         : "Invoice Journal ",
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
                        account : "Account Receivable ",
                        type    : "Current Assets",
                        name    : "101200 Account Receivable ",
                        editedBy: {
                            date: "2016-06-13T11:04:15.753Z",
                            user: null
                        }
                    }
                },
                date          : "2016-05-03T22:00:00.000Z"
            },
            {
                _id           : "574ed1083b7cc36e35271294",
                debit         : 3500,
                sourceDocument: {
                    model  : "Invoice",
                    _id    : {
                        _id             : "5729bbd92d11557621505d17",
                        _type           : "wTrackInvoice",
                        __v             : 0,
                        project         : "55b92ad621e4b7c40f00067d",
                        products        : [
                            {
                                unitPrice  : 3500,
                                subTotal   : 3500,
                                taxes      : 0,
                                jobs       : "571724de1eca60707afbc9cb",
                                description: "",
                                product    : "5540d528dacb551c24000003",
                                quantity   : 5
                            }
                        ],
                        emailed         : false,
                        approved        : true,
                        removable       : false,
                        invoiced        : false,
                        attachments     : [
                            {
                                uploaderName: "yana.gusti",
                                uploadDate  : "2016-05-04T09:07:36.920Z",
                                size        : "0.004&nbsp;Mb",
                                shortPas    : "%2Fuploads%2F5729bbd92d11557621505d17%2FInvoice_64772568_20160424.pdf",
                                name        : "Invoice_64772568_20160424.pdf",
                                _id         : "5729bbd8d4761c212289b803"
                            }
                        ],
                        editedBy        : {
                            user: "55bf144765cda0810b000005",
                            date: "2016-05-04T09:08:03.564Z"
                        },
                        createdBy       : {
                            user: "55bf144765cda0810b000005",
                            date: "2016-05-04T09:05:45.608Z"
                        },
                        creationDate    : "2016-05-04T09:05:45.607Z",
                        groups          : {
                            owner: "560c099da5d4a2e20ba5068b",
                            users: [],
                            group: []
                        },
                        whoCanRW        : "everyOne",
                        workflow        : "55647d982e4aa3804a765ecb",
                        paymentInfo     : {
                            total  : 3500,
                            balance: 0,
                            unTaxed: 3500,
                            taxes  : 0
                        },
                        paymentTerms    : null,
                        salesPerson     : "55b92ad221e4b7c40f000063",
                        currency        : {
                            _id : "565eab29aeb95fa9c0f9df2d",
                            rate: 1
                        },
                        journal         : "565ef6ba270f53d02ee71d65",
                        invoiceDate     : "2016-05-03T22:00:00.000Z",
                        paymentReference: "PO1030",
                        sourceDocument  : "5729bb69913d96692245eb75",
                        supplier        : "55b92ad621e4b7c40f000646",
                        forSales        : true,
                        name            : "27138242",
                        dueDate         : "2016-05-03T22:00:00.000Z",
                        payments        : [
                            "5729bbf62d11557621505d19"
                        ],
                        reconcile       : true,
                        paymentDate     : "2016-05-03T22:00:00.000Z"
                    },
                    subject: {
                        name: {
                            last : "",
                            first: "EtienneL"
                        }
                    }
                },
                currency      : {
                    rate: 1,
                    name: "USD"
                },
                journal       : {
                    name         : "Invoice Journal ",
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
                        account : "Account Receivable ",
                        type    : "Current Assets",
                        name    : "101200 Account Receivable ",
                        editedBy: {
                            date: "2016-06-13T11:04:15.753Z",
                            user: null
                        }
                    }
                },
                date          : "2016-05-03T22:00:00.000Z"
            },
            {
                _id           : "574ed1073b7cc36e352710e4",
                debit         : 48000,
                sourceDocument: {
                    model  : "Invoice",
                    _id    : {
                        _id             : "572af029dce306912118afa4",
                        _type           : "wTrackInvoice",
                        __v             : 0,
                        project         : "5721d21871d367e52185bd3c",
                        products        : [
                            {
                                unitPrice  : 48000,
                                subTotal   : 48000,
                                taxes      : 0,
                                jobs       : "5721d3a8dce306912118af86",
                                description: "",
                                product    : "5540d528dacb551c24000003",
                                quantity   : 48
                            }
                        ],
                        emailed         : false,
                        approved        : true,
                        removable       : false,
                        invoiced        : false,
                        attachments     : [
                            {
                                uploaderName: "eugen.lendyel",
                                uploadDate  : "2016-05-05T07:03:04.401Z",
                                size        : "0.054&nbsp;Mb",
                                shortPas    : "%2Fuploads%2F572af029dce306912118afa4%2FInvoice%20ThinkMobiles_FlightText.pdf",
                                name        : "Invoice ThinkMobiles_FlightText.pdf",
                                _id         : "572af028913d96692245ec05"
                            }
                        ],
                        editedBy        : {
                            user: "560255d1638625cf32000005",
                            date: "2016-05-11T10:54:23.164Z"
                        },
                        createdBy       : {
                            user: "56d704f1805eb08d2b93d95f",
                            date: "2016-05-05T07:02:16.278Z"
                        },
                        creationDate    : "2016-05-05T07:02:16.278Z",
                        groups          : {
                            owner: "56d704f1805eb08d2b93d95f",
                            users: [],
                            group: []
                        },
                        whoCanRW        : "everyOne",
                        workflow        : "55647d982e4aa3804a765ecb",
                        paymentInfo     : {
                            total  : 48000,
                            balance: 0,
                            unTaxed: 48000,
                            taxes  : 0
                        },
                        paymentTerms    : null,
                        salesPerson     : "56029cc950de7f4138000005",
                        currency        : {
                            _id : "565eab29aeb95fa9c0f9df2d",
                            rate: 1
                        },
                        journal         : "565ef6ba270f53d02ee71d65",
                        invoiceDate     : "2016-05-04T22:00:00.000Z",
                        paymentReference: "PO1031",
                        sourceDocument  : "572aeff8913d96692245ec04",
                        supplier        : "5721d1bb2d11557621505d02",
                        forSales        : true,
                        name            : "PO1031",
                        dueDate         : "2016-05-04T22:00:00.000Z",
                        reconcile       : true,
                        paymentDate     : "2016-05-04T22:00:00.000Z",
                        payments        : [
                            "57330f68308514ee5f3da7be"
                        ]
                    },
                    subject: {
                        name: {
                            last : "Sanz",
                            first: "Pere"
                        }
                    }
                },
                currency      : {
                    rate: 1,
                    name: "USD"
                },
                journal       : {
                    name         : "Invoice Journal ",
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
                        account : "Account Receivable ",
                        type    : "Current Assets",
                        name    : "101200 Account Receivable ",
                        editedBy: {
                            date: "2016-06-13T11:04:15.753Z",
                            user: null
                        }
                    }
                },
                date          : "2016-05-04T22:00:00.000Z"
            }
        ]
    };
    var fakeInvoiceForForm = {
        _id             : "568bb6af7c0383e04c60e892",
        _type           : "wTrackInvoice",
        __v             : 0,
        project         : {
            _id: "55b92ad621e4b7c40f00068c"
        },
        products        : [
            {
                subTotal   : 13300,
                unitPrice  : 13300,
                taxes      : 0,
                jobs       : {
                    _id      : "568bb6047c0383e04c60e88b",
                    invoice  : "568bb6af7c0383e04c60e892",
                    quotation: "568bb6987c0383e04c60e891",
                    budget   : {
                        budgetTotal: {
                            minDate   : 201553,
                            maxDate   : 201553,
                            hoursSum  : 19,
                            revenueSum: 13300,
                            costSum   : 0
                        },
                        projectTeam: [
                            {
                                budget    : {
                                    hoursSum  : 19,
                                    revenueSum: 13300,
                                    costSum   : 0
                                },
                                employee  : {
                                    name       : {
                                        first: "Sergiy",
                                        last : "Tilishevsky"
                                    },
                                    jobPosition: {
                                        name: "Junior QA",
                                        _id : "55b92acf21e4b7c40f000018"
                                    },
                                    _id        : "55b92ad221e4b7c40f000064"
                                },
                                department: {
                                    departmentName: "QA",
                                    _id           : "55b92ace21e4b7c40f000011"
                                }
                            }
                        ]
                    },
                    project  : "55b92ad621e4b7c40f00068c",
                    wTracks  : [
                        "568bb6307c0383e04c60e88c"
                    ],
                    type     : "Invoiced",
                    workflow : "56337c675d49d8d6537832ea",
                    name     : "53 week",
                    __v      : 0,
                    editedBy : {
                        date: "2016-03-29T14:08:57.028Z",
                        user: "55bf144765cda0810b000005"
                    },
                    createdBy: {
                        user: null,
                        date: "2016-01-05T12:25:20.630Z"
                    }
                },
                description: "",
                product    : {
                    _id              : "5540d528dacb551c24000003",
                    editedBy         : {
                        date: "2015-10-30T14:18:42.379Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy        : {
                        date: "2015-04-29T12:57:12.785Z",
                        user: null
                    },
                    creationDate     : "2015-04-29T12:57:12.785Z",
                    groups           : {
                        group: [],
                        users: [],
                        owner: "560c099da5d4a2e20ba5068b"
                    },
                    whoCanRW         : "everyOne",
                    workflow         : null,
                    info             : {
                        description: "",
                        barcode    : "",
                        isActive   : true,
                        salePrice  : 0,
                        productType: "Service"
                    },
                    name             : "IT services",
                    imageSrc         : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    canBePurchased   : true,
                    eventSubscription: true,
                    canBeExpensed    : true,
                    canBeSold        : true,
                    __v              : 0,
                    accounting       : {
                        category: {
                            name: ""
                        }
                    }
                },
                quantity   : 19
            }
        ],
        editedBy        : {
            date: "2016-03-14T07:55:20.865Z",
            user: {
                _id            : "55bf144765cda0810b000005",
                profile: 1387275598000,
                kanbanSettings: {
                    tasks        : {
                        foldWorkflows: [],
                        countPerPage : 10
                    },
                    applications: {
                        foldWorkflows: [],
                        countPerPage : 5
                    },
                    opportunities: {
                        foldWorkflows: [],
                        countPerPage : 10
                    }
                },
                credentials   : {
                    access_token : "",
                    refresh_token: ""
                },
                pass          : "ebe5ffd65e0e1de96e45a13e645646812c9ba15ba57d28a1cc3886365d948c26",
                email         : "yana.gusti@thinkmobiles.com",
                login         : "yana.gusti",
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                __v           : 0,
                lastAccess    : "2016-05-17T13:32:44.013Z",
                savedFilters  : [
                    {
                        _id      : null,
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : null,
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : null,
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : null,
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5624c55fe9576d1728a9ed40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5624c78a25f58a237fd5b4d2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "562df97d129820ab5994e8fb",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "562f6e8071c88830607cd587",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "565c5e853410ae512364dbb1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566010ba6226e3c43108dbe1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56618b467d284423697e2bf8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566191577d284423697e2d88",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566e7a4a8453e8b464b70914",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56efa708fed15a0833469c69",
                        viewType: "",
                        byDefault: "wTrack"
                    }
                ],
                relatedEmployee: null
            }
        },
        createdBy       : {
            date: "2016-01-05T12:27:04.595Z",
            user: {
                _id            : "55bf144765cda0810b000005",
                profile: 1387275598000,
                kanbanSettings: {
                    tasks        : {
                        foldWorkflows: [],
                        countPerPage : 10
                    },
                    applications: {
                        foldWorkflows: [],
                        countPerPage : 5
                    },
                    opportunities: {
                        foldWorkflows: [],
                        countPerPage : 10
                    }
                },
                credentials   : {
                    access_token : "",
                    refresh_token: ""
                },
                pass          : "ebe5ffd65e0e1de96e45a13e645646812c9ba15ba57d28a1cc3886365d948c26",
                email         : "yana.gusti@thinkmobiles.com",
                login         : "yana.gusti",
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                __v           : 0,
                lastAccess    : "2016-05-17T13:32:44.013Z",
                savedFilters  : [
                    {
                        _id      : null,
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : null,
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : null,
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : null,
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5624c55fe9576d1728a9ed40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5624c78a25f58a237fd5b4d2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "562df97d129820ab5994e8fb",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "562f6e8071c88830607cd587",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "565c5e853410ae512364dbb1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566010ba6226e3c43108dbe1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56618b467d284423697e2bf8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566191577d284423697e2d88",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566e7a4a8453e8b464b70914",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56efa708fed15a0833469c69",
                        viewType: "",
                        byDefault: "wTrack"
                    }
                ],
                relatedEmployee: null
            }
        },
        creationDate    : "2016-01-05T12:27:04.595Z",
        groups          : {
            group: [],
            users: [],
            owner: {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            }
        },
        whoCanRW        : "everyOne",
        workflow        : {
            _id   : "55647d982e4aa3804a765ecb",
            status: "Done",
            name  : "Paid"
        },
        payments        : [
            {
                _id       : "56e66e6d3d5bc25541857e14",
                paymentRef: "",
                name      : "PP_289",
                date      : "2016-01-08T04:00:00.000Z",
                paidAmount: 13300
            }
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
            _id : {
                _id     : "565eab29aeb95fa9c0f9df2d",
                name: "USD",
                sequence: 0
            },
            rate: 1
        },
        journal         : "565ef6ba270f53d02ee71d65",
        invoiceDate     : "2016-01-01T04:00:00.000Z",
        paymentReference: "PO651",
        sourceDocument  : {
            _id           : "568bb6987c0383e04c60e891",
            expectedDate: "2016-01-04T23:00:00.000Z",
            editedBy    : {
                date: "2016-01-05T12:27:27.637Z",
                user: "55bf144765cda0810b000005"
            },
            createdBy   : {
                date: "2016-01-05T12:27:04.595Z",
                user: "55bf144765cda0810b000005"
            },
            creationDate: "2016-01-05T12:27:04.595Z",
            groups      : {
                group: [],
                users: [],
                owner: "560c099da5d4a2e20ba5068b"
            },
            whoCanRW    : "everyOne",
            workflow    : "55647b962e4aa3804a765ec6",
            products    : [
                {
                    scheduledDate: "2016-01-04T23:00:00.000Z",
                    jobs         : "568bb6047c0383e04c60e88b",
                    description  : "",
                    product      : "5540d528dacb551c24000003",
                    unitPrice    : 13300,
                    subTotal     : 13300,
                    taxes        : 0,
                    quantity     : 19
                }
            ],
            paymentInfo : {
                total  : 13300,
                unTaxed: 13300,
                taxes  : 0
            },
            paymentTerm : null,
            invoiceRecived: false,
            invoiceControl: null,
            incoterm      : null,
            destination   : null,
            name          : "PO651",
            orderDate     : "2016-01-04T23:00:00.000Z",
            deliverTo     : "55543831d51bdef79ea0d58c",
            project       : "55b92ad621e4b7c40f00068c",
            supplier      : "55b92ad521e4b7c40f000621",
            isOrder       : true,
            type          : "Not Invoiced",
            forSales      : true,
            currency      : {
                _id : "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            __v           : 0
        },
        supplier        : {
            _id : "55b92ad521e4b7c40f000621",
            name: {
                last : "",
                first: "Mike Allstar"
            }
        },
        forSales        : true,
        name            : "26780540",
        dueDate         : "2016-01-15T04:00:00.000Z",
        paymentDate     : "2016-01-08T04:00:00.000Z",
        approved        : true,
        reconcile       : true,
        attachments     : [],
        removable       : false
    };
    var journalEntryCollection;
    var view;
    var topBarView;
    var listView;
    var setDateRangeSpy;
    var showDatePickerSpy;
    var reconcileSpy;
    var debounceStub;
    var removeFilterSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);

    expect = chai.expect;

    describe('JournalEntry View', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            setDateRangeSpy = sinon.spy(TopBarView.prototype, 'setDateRange');
            showDatePickerSpy = sinon.spy(TopBarView.prototype, 'showDatePickers');
            reconcileSpy = sinon.spy(TopBarView.prototype, 'reconcile');
            debounceStub = sinon.stub(_, 'debounce', function (debFunction) {
                return debFunction;
            });
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();

            setDateRangeSpy.restore();
            showDatePickerSpy.restore();
            reconcileSpy.restore();
            debounceStub.restore();
            removeFilterSpy.restore();

            if ($('.ui-dialog').length) {
                $('.ui-dialog').remove();
            }
        });

        describe('#initialize()', function () {
            var server;

            before(function () {
                $fixture = $(fixtures);
                $fixture.appendTo(document.body);
                $elFixture = $fixture.find('#wrapper');

                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Should create main view', function () {
                var $expectedSubMenuEl;
                var $expectedMenuEl;

                server.respondWith('GET', '/getModules', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'journalEntry'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="86"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="86"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/journalEntry');

            });

        });

        describe('TopBarView', function () {
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to create TopBarView', function (done) {
                var journalEntryUrl = new RegExp('journalEntries\/', 'i');
                server.respondWith('GET', journalEntryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournalEntry)]);
                journalEntryCollection = new JournalEntryCollection({
                    viewType: 'list',
                    page    : 1,
                    count   : 100
                });
                server.respond();

                expect(journalEntryCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    collection: journalEntryCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;

                done();
            });
        });

        describe('journalEntry list view', function () {
            var server;
            var mainSpy;
            var clock;
            var renderSpy;
            var $thisEl;
            var selectSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                renderSpy = sinon.spy(ListView.prototype, 'render');
                selectSpy = sinon.spy(FilterView.prototype, 'selectValue');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                clock.restore();
                renderSpy.restore();
                selectSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create JournalEntry list view', function (done) {
                    var $firstRow;
                    var colCount;
                    var journal;
                    var accountingDate;
                    var subject;
                    var sourceDocument;
                    var debitAccount;
                    var creditAccount;
                    var sum;

                    listView = new ListView({
                        collection: journalEntryCollection,
                        startTime : new Date()
                    });

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(journalEntryCollection, listView);

                    journalEntryCollection.trigger('fetchFinished', {
                        totalRecords: journalEntryCollection.totalRecords,
                        currentPage : journalEntryCollection.currentPage,
                        pageSize    : journalEntryCollection.pageSize
                    });

                    clock.tick(200);
                    $thisEl = listView.$el;

                    expect(renderSpy.calledOnce).to.be.true;
                    expect($thisEl.find('table')).to.exist;
                    expect($thisEl.find('#listFooter')).to.exist;

                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;

                    expect(colCount).to.be.equals(8);

                    journal = $firstRow.find('td:nth-child(2)').text().trim();
                    expect(journal).to.not.empty;
                    expect(journal).to.not.match(/object Object|undefined/);

                    accountingDate = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(accountingDate).to.not.empty;
                    expect(accountingDate).to.not.match(/object Object|undefined/);

                    subject = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(subject).to.not.empty;
                    expect(subject).to.not.match(/object Object|undefined/);

                    sourceDocument = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(sourceDocument).to.not.match(/object Object|undefined/);

                    debitAccount = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(debitAccount).to.not.empty;
                    expect(debitAccount).to.not.match(/object Object|undefined/);

                    creditAccount = $firstRow.find('td:nth-child(7)').text().trim();
                    expect(creditAccount).to.not.empty;
                    expect(creditAccount).to.not.match(/object Object|undefined/);

                    sum = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(sum).to.not.empty;
                    expect(sum).to.not.match(/object Object|undefined/);

                    done();
                });

                it('Try to filter ListView', function () {
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var $journal;
                    var $subject;
                    var $next;
                    var $prev;
                    var $selectedItem;

                    // open search dropdown
                    $searchArrow.click();
                    expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                    // select Journal filter
                    $journal = $searchContainer.find('#journalNameFullContainer > .groupName');
                    $journal.click();
                    $selectedItem = $searchContainer.find('#journalNameUl > li').first();

                    $selectedItem.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                    expect(selectSpy.calledOnce).to.be.true;

                    // select Subject
                    $subject = $searchContainer.find('#sourceDocumentFullContainer > .groupName');
                    $subject.click();
                    $next = $searchContainer.find('.next');
                    $next.click();
                    expect($searchContainer.find('#sourceDocumentContainer .counter').text().trim()).to.be.equals('8-14 of 20');
                    $prev = $searchContainer.find('.prev');
                    $prev.click();
                    expect($searchContainer.find('#sourceDocumentContainer .counter').text().trim()).to.be.equals('1-7 of 20');
                    $selectedItem = $searchContainer.find('#sourceDocumentUl > li').first();

                    $selectedItem.click();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                    expect(selectSpy.calledTwice).to.be.true;

                    // unselect Subject filter
                    $selectedItem = $searchContainer.find('#sourceDocumentUl > li').first();
                    $selectedItem.click();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                    expect(selectSpy.calledThrice).to.be.true;

                });

                it('Try to remove Journal filter', function () {
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $closeBtn = $searchContainer.find('.removeValues');

                    $closeBtn.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                    expect(removeFilterSpy.calledOnce).to.be.true;
                });

                it('Try to change date range', function (done) {
                    var $topBarEl = topBarView.$el;
                    var $updateDateBtn = $topBarEl.find('#updateDate');
                    var $dateRange = $topBarEl.find('.dateRange');
                    var journalEntryUrl = new RegExp('journalEntries\/list', 'i');
                    var journalTotalUrl = new RegExp('journalEntries\/totalCollectionLength', 'i');
                    var $cancelBtn;
                    var $thisMonth;
                    var $finYear;
                    var $lastMonth;
                    var $lastQuarter;
                    var $lastFinYear;
                    var $customDate;
                    var $startDate;
                    var $endDate;

                    server.respondWith('GET', journalTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count     : 3,
                        totalValue: 10000
                    })]);
                    server.respondWith('GET', journalEntryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJournalEntry)]);
                    // open dateRange DropDown
                    $dateRange.click();
                    expect($topBarEl.find('.frameDetail')).to.not.have.class('hidden');

                    // open dateRange DropDown
                    $dateRange.click();
                    expect($topBarEl.find('.frameDetail')).to.have.class('hidden');

                    $dateRange.click();

                    $thisMonth = $topBarEl.find('#thisMonth');
                    $thisMonth.click();
                    server.respond();
                    expect(setDateRangeSpy.calledOnce).to.be.true;

                    $finYear = $topBarEl.find('#thisYear');
                    $finYear.click();
                    server.respond();
                    expect(setDateRangeSpy.calledTwice).to.be.true;

                    $lastMonth = $topBarEl.find('#lastMonth');
                    $lastMonth.click();
                    server.respond();
                    expect(setDateRangeSpy.calledThrice).to.be.true;

                    $lastQuarter = $topBarEl.find('#lastQuarter');
                    $lastQuarter.click();
                    server.respond();
                    expect(setDateRangeSpy.callCount).to.be.equals(4);

                    $lastFinYear = $topBarEl.find('#lastYear');
                    $lastFinYear.click();
                    server.respond();
                    expect(setDateRangeSpy.callCount).to.be.equals(5);

                    // open dateRange dropdown
                    $dateRange.click();

                    // cancel dateRange dropdown
                    $cancelBtn = $topBarEl.find('#cancelBtn');
                    $cancelBtn.click();

                    $dateRange.click();
                    $customDate = $topBarEl.find('#custom');
                    $customDate.click();
                    expect(showDatePickerSpy.calledOnce).to.be.true;

                    $startDate = $topBarEl.find('#startDate');
                    $startDate.datepicker('setDate', new Date('1 May, 2016'));
                    $startDate.change();

                    $endDate = $topBarEl.find('#endDate');
                    $endDate.datepicker('setDate', new Date('1 June, 2016'));
                    $endDate.change();

                    $updateDateBtn.click();
                    server.respond();

                    done();
                });

                it('Try to reconcile JournalEntry with reconcile btn have class "greenBtn"', function () {
                    var $topBarEl = topBarView.$el;
                    var $reconcileBtn = $topBarEl.find('#reconcileBtn');

                    mainSpy.reset();
                    reconcileSpy.reset();

                    $reconcileBtn.removeClass('btnAttention');
                    $reconcileBtn.addClass('greenBtn');

                    $reconcileBtn.click();

                    expect(reconcileSpy.calledOnce).to.be.true;
                    expect(reconcileSpy.args[0][0]).to.have.property('result', false);
                });

                it('Try to reconcile JournalEntry', function (done) {
                    var $topBarEl = topBarView.$el;
                    var $reconcileBtn = $topBarEl.find('#reconcileBtn');
                    var reconcileUrl = '/journalEntries/reconcile';
                    var spyResponse;

                    mainSpy.reset();

                    $reconcileBtn.removeClass('greenBtn');
                    $reconcileBtn.addClass('btnAttention');

                    server.respondWith('POST', reconcileUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: true})]);
                    $reconcileBtn.click();
                    server.respond();
                    clock.tick(200);

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'notify');
                    expect(spyResponse).to.have.property('message', 'Your request has been sent for processing. Please, wait few minutes.');

                    done();
                });

                it('Try to viewSourceDocument with error response', function () {
                    var $needDividendInvoice = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(5) > a');
                    var invoiceUrl = new RegExp('\/Invoice\/form', 'i');
                    var spyResponse;

                    mainSpy.reset();

                    server.respondWith('GET', invoiceUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $needDividendInvoice.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];

                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please refresh browser');
                });

                it('Try to viewSourceDocument with 200 status response', function (done) {
                    var $needDividendInvoice = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(5) > a');
                    var invoiceUrl = new RegExp('\/Invoice\/form', 'i');

                    App.currentUser = {
                        profile: {
                            _id: '1387275598000'
                        }
                    };

                    mainSpy.reset();

                    server.respondWith('GET', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoiceForForm)]);
                    $needDividendInvoice.click();
                    server.respond();

                    clock.tick(200);

                    expect($('.ui-dialog')).to.exist;

                    done();
                });
            });
        });
    });
});
