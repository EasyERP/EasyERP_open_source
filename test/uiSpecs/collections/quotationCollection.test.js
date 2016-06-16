define([
    'collections/Quotations/filterCollection',
    'chai'
], function (QuotationCollection, chai) {
    'use strict';
    var expect = chai.expect;

    describe('QuotationCollection', function () {
        var mainSpy;
        var server;
        var orderCollection;

        before(function () {
            server = sinon.fakeServer.create();
            mainSpy = sinon.spy(App, 'render');
        });

        after(function () {
            server.restore();
            mainSpy.restore();
        });

        var fakeQuotation = [
            {
                _id: "570f9563ccb41cca20cd9261",
                workflow: {
                    _id: "55647b962e4aa3804a765ec6",
                    color: "#2C3E50",
                    name: "Invoiced",
                    sequence: 1,
                    status: "Done",
                    wId: "Sales Order",
                    wName: "order",
                    source: "purchase",
                    targetSource: [
                        "order"
                    ],
                    visible: true
                },
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 0,
                    total: 0
                },
                name: "PO1",
                orderDate: "2016-04-13T21:00:00.000Z",
                project: {
                    _id: "55b92ad621e4b7c40f00065f",
                    EndDate: "2016-04-26T21:00:00.000Z",
                    StartDate: "2014-08-10T21:00:00.000Z",
                    ID: 1,
                    bonus: [
                        {
                            bonusId: "55b92ad521e4b7c40f00060a",
                            employeeId: "55b92ad221e4b7c40f000031",
                            _id: "570e4aa461cae96537ef44ad",
                            endDate: null,
                            startDate: null
                        },
                        {
                            bonusId: "55b92ad521e4b7c40f000607",
                            employeeId: "55b92ad221e4b7c40f000063",
                            _id: "570e4aa461cae96537ef44ac",
                            endDate: null,
                            startDate: null
                        },
                        {
                            bonusId: "55b92ad521e4b7c40f000604",
                            employeeId: "55b92ad221e4b7c40f00004a",
                            _id: "570e4aa461cae96537ef44ab",
                            endDate: null,
                            startDate: null
                        }
                    ],
                    health: 3,
                    editedBy: {
                        date: "2016-04-13T13:33:24.594Z",
                        user: "52203e707d4dba8813000003"
                    },
                    attachments: [ ],
                    notes: [ ],
                    projecttype: "",
                    createdBy: {
                        date: "2015-07-29T19:34:46.291Z",
                        user: "52203e707d4dba8813000003"
                    },
                    progress: 0,
                    remaining: 0,
                    logged: 0,
                    estimated: 0,
                    workflow: "528ce7f2f3f67bc40b000023",
                    parent: null,
                    sequence: 0,
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: "55ba28c8d79a3a3439000016"
                    },
                    whoCanRW: "everyOne",
                    projectmanager: "55b92ad221e4b7c40f000063",
                    customer: "55b92ad521e4b7c40f00060c",
                    task: [ ],
                    projectName: "IOS/Android QA",
                    projectShortDesc: "emptyProject",
                    __v: 0,
                    teams: { },
                    info: { },
                    description: "",
                    TargetEndDate: "2016-04-23T21:00:00.000Z",
                    budget: {
                        bonus: [
                            {
                                percentage: "PM Junior/Usual 1.5%",
                                resource: "Alex Gleba",
                                bonus: 294
                            },
                            {
                                percentage: "Sales/QA 8%",
                                resource: "Yana Gusti",
                                bonus: 1568
                            },
                            {
                                percentage: "Sales/Ref 2%",
                                resource: "Oleg Ostroverkh",
                                bonus: 392
                            }
                        ],
                        projectTeam: [
                            "570dfc206625f34212d01f3f",
                            "570dfbd96625f34212d01f39",
                            "570dfb7d6625f34212d01f37",
                            "570de3596625f34212d01f32",
                            "570ddef86625f34212d01f2d",
                            "564cfd8ba6e6390160c9ee1c"
                        ]
                    },
                    salesManagers: [
                        {
                            date: "2014-08-11T12:27:35.056Z",
                            _id: "5707533ecbb17f48214c769c",
                            manager: "55b92ad221e4b7c40f000063"
                        }
                    ]
                },
                supplier: {
                    _id: "55b92ad521e4b7c40f00060c",
                    ID: 1,
                    companyInfo: {
                        size: null,
                        industry: null
                    },
                    editedBy: {
                        date: "2015-10-05T06:46:29.793Z",
                        user: "55bf144765cda0810b000005"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:45.989Z",
                        user: "52203e707d4dba8813000003"
                    },
                    history: [ ],
                    attachments: [ ],
                    notes: [ ],
                    groups: {
                        owner: "55ba28c8d79a3a3439000016",
                        users: [ ],
                        group: [ ]
                    },
                    whoCanRW: "everyOne",
                    social: {
                        LI: "",
                        FB: ""
                    },
                    color: "#4d5a75",
                    relatedUser: null,
                    salesPurchases: {
                        isCustomer: true,
                        isSupplier: false,
                        active: false,
                        reference: "",
                        language: ""
                    },
                    title: "",
                    internalNotes: "",
                    contacts: [ ],
                    phones: {
                        phone: "",
                        mobile: "",
                        fax: ""
                    },
                    skype: "",
                    jobPosition: null,
                    website: "",
                    address: {
                        country: "",
                        zip: "",
                        state: "",
                        city: "",
                        street: ""
                    },
                    timezone: "UTC",
                    department: null,
                    company: null,
                    email: "",
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    name: {
                        first: "Alexey",
                        last: "Blinov"
                    },
                    isOwn: false,
                    type: "Person",
                    __v: 0,
                    dateBirth: null
                },
                isOrder: true,
                forSales: true,
                projectmanager: {
                    _id: "55b92ad221e4b7c40f000063",
                    dateBirth: "1990-07-30T00:00:00.000Z",
                    ID: 57,
                    isLead: 2,
                    fire: [ ],
                    hire: [
                        "2013-11-17T22:00:00.000Z"
                    ],
                    social: {
                        FB: "",
                        LI: "https://ua.linkedin.com/pub/yana"
                    },
                    sequence: 0,
                    jobType: "fullTime",
                    gender: "male",
                    marital: "married",
                    contractEnd: {
                        date: "2015-07-29T19:34:42.464Z",
                        reason: ""
                    },
                    attachments: [ ],
                    editedBy: {
                        date: "2016-03-31T09:31:59.608Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:42.464Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate: "2015-07-29T19:34:42.464Z",
                    color: "#4d5a75",
                    otherInfo: "",
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: "55ba28c8d79a3a3439000016"
                    },
                    whoCanRW: "everyOne",
                    workflow: null,
                    active: false,
                    referredBy: "",
                    source: "",
                    age: 25,
                    homeAddress: {
                        country: "",
                        zip: "",
                        state: "",
                        city: "",
                        street: ""
                    },
                    otherId: "",
                    bankAccountNo: "",
                    nationality: "Ukrainian",
                    coach: null,
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "5644388770bbc2b740ce8a18",
                    department: "55b92ace21e4b7c40f000011",
                    visibility: "Public",
                    relatedUser: null,
                    officeLocation: "",
                    skype: "yanochka_3007",
                    workPhones: {
                        phone: "",
                        mobile: "+380508754761"
                    },
                    personalEmail: "yana.gusti@gmail.com",
                    workEmail: "yana.gusti@thinkmobiles.com",
                    workAddress: {
                        country: "",
                        zip: "",
                        state: "",
                        city: "",
                        street: ""
                    },
                    tags: [
                        ""
                    ],
                    name: {
                        last: "Gusti",
                        first: "Yana"
                    },
                    subject: "",
                    imageSrc: "data:image/jpeg;base64,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",
                    isEmployee: true,
                    __v: 0,
                    transferred: [
                        {
                            date: "2015-11-12T07:01:22.647Z",
                            department: " BusinessDev"
                        }
                    ],
                    transfer: [
                        {
                            date: "2013-11-17T22:00:00.000Z",
                            isDeveloper: true,
                            info: "",
                            salary: 350,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5644388770bbc2b740ce8a18",
                            department: "55b92ace21e4b7c40f000011",
                            status: "hired"
                        },
                        {
                            date: "2014-06-30T21:00:00.000Z",
                            isDeveloper: true,
                            info: "",
                            salary: 450,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5644388770bbc2b740ce8a18",
                            department: "55b92ace21e4b7c40f000011",
                            status: "updated"
                        },
                        {
                            date: "2015-08-31T21:00:00.000Z",
                            isDeveloper: true,
                            info: "",
                            salary: 1000,
                            jobType: "fullTime",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5644388770bbc2b740ce8a18",
                            department: "55b92ace21e4b7c40f000011",
                            status: "updated"
                        }
                    ]
                }
            }, {
                _id: "5703dd42ed3f15af0782f1a2",
                workflow: {
                    _id: "55647b962e4aa3804a765ec6",
                    color: "#2C3E50",
                    name: "Invoiced",
                    sequence: 1,
                    status: "Done",
                    wId: "Sales Order",
                    wName: "order",
                    source: "purchase",
                    targetSource: [
                        "order"
                    ],
                    visible: true
                },
                paymentInfo: {
                    taxes: 0,
                    unTaxed: 3024,
                    total: 3024
                },
                name: "PO928",
                orderDate: "2016-04-05T00:00:00.000Z",
                project: {
                    _id: "55b92ad621e4b7c40f00067f",
                    EndDate: "2016-04-07T21:00:00.000Z",
                    StartDate: "2014-11-30T22:00:00.000Z",
                    ID: 65,
                    bonus: [
                        {
                            bonusId: "55b92ad521e4b7c40f000602",
                            employeeId: "55b92ad221e4b7c40f00004a",
                            _id: "5662e05bf13e46fd145353e1",
                            endDate: null,
                            startDate: null
                        },
                        {
                            bonusId: "55b92ad521e4b7c40f000604",
                            employeeId: "55b92ad221e4b7c40f00004a",
                            _id: "5662e05bf13e46fd145353e0",
                            endDate: null,
                            startDate: null
                        }
                    ],
                    health: 1,
                    editedBy: {
                        date: "2015-12-05T13:02:19.389Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    attachments: [ ],
                    notes: [ ],
                    projecttype: "",
                    createdBy: {
                        date: "2015-07-29T19:34:46.310Z",
                        user: "52203e707d4dba8813000003"
                    },
                    progress: 0,
                    remaining: 0,
                    logged: 0,
                    estimated: 0,
                    workflow: "528ce7f2f3f67bc40b000023",
                    parent: null,
                    sequence: 0,
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: "560c099da5d4a2e20ba5068b"
                    },
                    whoCanRW: "everyOne",
                    projectmanager: "55b92ad221e4b7c40f00004a",
                    customer: "55b92ad621e4b7c40f000624",
                    task: [ ],
                    projectName: "Player iOS/And",
                    projectShortDesc: "emptyProject",
                    __v: 0,
                    budget: {
                        bonus: [
                            {
                                percentage: "Sales/Head 8%",
                                resource: "Oleg Ostroverkh",
                                bonus: 371183.5200000001
                            },
                            {
                                percentage: "Sales/Ref 2%",
                                resource: "Oleg Ostroverkh",
                                bonus: 92795.88000000002
                            }
                        ],
                        projectTeam: [
                            "56e031ba155b964b1e9c47eb",
                            "569e97072208b3af4a5271b0",
                            "57038b03e7050b54043a69aa",
                            "5661fba825e5eb511510bbcc",
                            "5661f30d25e5eb511510bae3",
                            "5661f62225e5eb511510bb41",
                            "5661ed5425e5eb511510ba66",
                            "5661f7fa25e5eb511510bb6e",
                            "564cfd8ba6e6390160c9ee29"
                        ]
                    },
                    TargetEndDate: "",
                    description: "",
                    salesManagers: [
                        {
                            date: "2014-12-01T12:27:34.436Z",
                            _id: "5707533ecbb17f48214c76bb",
                            manager: "55b92ad221e4b7c40f00004a"
                        }
                    ]
                },
                supplier: {
                    _id: "55b92ad621e4b7c40f000624",
                    ID: 37,
                    companyInfo: {
                        size: null,
                        industry: null
                    },
                    editedBy: {
                        date: "2015-07-29T19:34:46.000Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:46.000Z",
                        user: "52203e707d4dba8813000003"
                    },
                    history: [ ],
                    attachments: [ ],
                    notes: [ ],
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: null
                    },
                    whoCanRW: "everyOne",
                    social: {
                        LI: "",
                        FB: ""
                    },
                    color: "#4d5a75",
                    relatedUser: null,
                    salesPurchases: {
                        receiveMessages: 0,
                        language: "English",
                        reference: "",
                        active: true,
                        implementedBy: null,
                        salesTeam: null,
                        salesPerson: null,
                        isSupplier: false,
                        isCustomer: true
                    },
                    title: "",
                    internalNotes: "",
                    contacts: [ ],
                    phones: {
                        fax: "",
                        mobile: "",
                        phone: ""
                    },
                    skype: "",
                    jobPosition: "",
                    website: "",
                    address: {
                        country: "France",
                        zip: "",
                        state: "",
                        city: "",
                        street: ""
                    },
                    timezone: "UTC",
                    department: null,
                    company: null,
                    email: "",
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    name: {
                        last: "",
                        first: "Giroptic"
                    },
                    isOwn: false,
                    type: "Person",
                    __v: 0
                },
                isOrder: true,
                forSales: true,
                projectmanager: {
                    _id: "55b92ad221e4b7c40f00004a",
                    dateBirth: "1987-10-25T03:00:00.000Z",
                    ID: 34,
                    isLead: 2,
                    fire: [
                        "2016-03-14T22:00:00.000Z"
                    ],
                    hire: [
                        "2014-05-25T21:00:00.000Z"
                    ],
                    social: {
                        FB: "",
                        LI: ""
                    },
                    sequence: 0,
                    jobType: "Select",
                    gender: "male",
                    marital: "married",
                    contractEnd: {
                        reason: "Fired",
                        date: "2016-03-14T22:00:00.000Z"
                    },
                    attachments: [ ],
                    editedBy: {
                        date: "2016-04-04T15:36:05.882Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy: {
                        date: "2015-07-29T19:34:42.433Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate: "2015-07-29T19:34:42.433Z",
                    color: "#4d5a75",
                    otherInfo: "",
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: "55ba28c8d79a3a3439000016"
                    },
                    whoCanRW: "everyOne",
                    workflow: null,
                    active: false,
                    referredBy: "",
                    source: "",
                    age: 28,
                    homeAddress: {
                        country: "",
                        zip: "",
                        state: "",
                        city: "",
                        street: ""
                    },
                    otherId: "",
                    bankAccountNo: "",
                    nationality: "Ukrainian",
                    coach: null,
                    manager: "55b92ad221e4b7c40f00004f",
                    jobPosition: "55b92acf21e4b7c40f000024",
                    department: "55b92ace21e4b7c40f000014",
                    visibility: "Public",
                    relatedUser: null,
                    officeLocation: "",
                    skype: "bdm.mobilez365",
                    workPhones: {
                        mobile: "+380951132334",
                        phone: ""
                    },
                    personalEmail: "OOstroverkh@gmail.com",
                    workEmail: "oleg.ostroverkh@thinkmobiles.com",
                    workAddress: {
                        country: "",
                        zip: "",
                        state: "",
                        city: "",
                        street: ""
                    },
                    tags: [
                        ""
                    ],
                    name: {
                        last: "Ostroverkh",
                        first: "Oleg"
                    },
                    subject: "",
                    imageSrc: "data:image/jpeg;base64,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",
                    isEmployee: false,
                    __v: 0,
                    lastFire: 201611,
                    transfer: [
                        {
                            date: "2014-05-25T21:00:00.000Z",
                            isDeveloper: true,
                            info: "",
                            salary: 600,
                            jobType: "Select",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000024",
                            department: "55b92ace21e4b7c40f000014",
                            status: "hired"
                        },
                        {
                            date: "2014-07-31T21:00:00.000Z",
                            isDeveloper: true,
                            info: "плюс %",
                            salary: 450,
                            jobType: "Select",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000024",
                            department: "55b92ace21e4b7c40f000014",
                            status: "updated"
                        },
                        {
                            date: "2016-03-14T22:00:00.000Z",
                            isDeveloper: true,
                            info: "Fired",
                            salary: 450,
                            jobType: "Select",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000024",
                            department: "55b92ace21e4b7c40f000014",
                            status: "fired"
                        }
                    ]
                }
            }
        ];

        it ('Try to create collection with contentType="salesOrders"', function(done){
            var quotationUrl = new RegExp('/quotations/list', 'i');

            server.respondWith('GET', quotationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotation)]);
            orderCollection = new QuotationCollection({
                viewType: 'list',
                success: function(){
                    done();
                },
                error: function(collection, response){
                    done(response);
                }
            });
            server.respond();

            expect(orderCollection.toJSON().length).to.be.equals(2);
        });

        it ('Try showMore collection', function(){
            var quotationUrl = new RegExp('/quotations/list', 'i');

            server.respondWith('GET', quotationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotation)]);
            orderCollection.showMore();
            server.respond();

            expect(orderCollection.toJSON().length).to.be.equals(2);
        });

        it ('Try to create collection with error response', function(done){
            var quotationUrl = new RegExp('/quotations/list', 'i');

            server.respondWith('GET', quotationUrl, [401, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotation)]);
            orderCollection = new QuotationCollection({
                viewType: 'list',
                contentType: 'salesOrders',
                success: function(){
                    done();
                },
                error: function(collection, response){
                    done(response);
                }
            });
            server.respond();

            expect(window.location.hash).to.be.equals('#login');
        });

        it ('Try to create collection', function(done){
            var quotationUrl = new RegExp('/quotations/list', 'i');

            server.respondWith('GET', quotationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotation)]);
            orderCollection = new QuotationCollection({
                viewType: 'list',
                contentType: 'salesOrders',
                success: function(){
                    done();
                },
                error: function(collection, response){
                    done(response);
                }
            });
            server.respond();

            expect(orderCollection.toJSON().length).to.be.equals(2);
        });

        it ('Try showMore collection', function(){
            var quotationUrl = new RegExp('/quotations/list', 'i');

            server.respondWith('GET', quotationUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotation)]);
            orderCollection.showMore({
                page: 1,
                count: 2,
                viewType: 'list',
                contentType: 'salesQuotations'
            });
            server.respond();

            expect(orderCollection.toJSON().length).to.be.equals(2);
        });

        it ('Try showMore collection with error response', function(){
            var spyResponse;
            var quotationUrl = new RegExp('/quotations/list', 'i');

            server.respondWith('GET', quotationUrl, [400, {"Content-Type": "application/json"}, JSON.stringify(fakeQuotation)]);
            orderCollection.showMore();
            server.respond();

            spyResponse = mainSpy.args[0][0];
            expect(spyResponse).to.have.property('type', 'error');
            expect(spyResponse).to.have.property('message', 'Some Error.');
        });

    });
});
