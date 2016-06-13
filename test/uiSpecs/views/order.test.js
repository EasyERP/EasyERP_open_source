define([
    'modules',
    'text!fixtures/index.html',
    'collections/salesOrders/filterCollection',
    'views/main/MainView',
    'views/salesOrders/list/ListView',
    'views/salesOrders/EditView',
    'views/salesOrders/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules, fixtures, OrderCollection, MainView, ListView, EditView, TopBarView, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var expect;
    var view;
    var topBarView;
    var listView;
    var orderCollection;
    var fakeOrders = [
        {
            _id         : "572b22b45aa8d58049019174",
            workflow    : {
                _id         : "55647b932e4aa3804a765ec5",
                color       : "#2C3E50",
                name        : "Not Invoiced",
                sequence    : 3,
                status      : "New",
                wId         : "Sales Order",
                wName       : "order",
                source      : "purchase",
                targetSource: [
                    "quotation"
                ],
                visible     : true
            },
            paymentInfo : {
                taxes  : 0,
                unTaxed: 70000,
                total  : 70000
            },
            name        : "PO1035",
            orderDate   : "2016-05-04T22:00:00.000Z",
            project     : {
                _id             : "56e005f0f20b93842671670d",
                StartDate       : null,
                budget          : {
                    bonus      : [],
                    projectTeam: [
                        "56e296543c074d636203bbd1"
                    ]
                },
                bonus           : [],
                health          : 3,
                editedBy        : {
                    date: "2016-05-05T10:31:31.549Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                attachments     : [],
                notes           : [],
                projecttype     : "web",
                createdBy       : {
                    date: "2016-03-09T11:16:00.812Z",
                    user: "56dfef269100b25c05819305"
                },
                progress        : 0,
                remaining       : 0,
                logged          : 0,
                estimated       : 0,
                workflow        : "528ce7f2f3f67bc40b000023",
                parent          : null,
                sequence        : 0,
                groups          : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW        : "everyOne",
                projectmanager  : null,
                customer        : "56dffe038594da632689f1ca",
                task            : [],
                projectName     : "Spoon Comics",
                projectShortDesc: "Comics site",
                __v             : 0,
                EndDate         : null,
                salesmanager    : "55b92ad221e4b7c40f0000bb",
                description     : ""
            },
            supplier    : {
                _id           : "56dffe038594da632689f1ca",
                companyInfo   : {
                    industry: null
                },
                editedBy      : {
                    date: "2016-03-09T10:51:49.650Z",
                    user: "56dfef269100b25c05819305"
                },
                createdBy     : {
                    date: "2016-03-09T10:42:11.329Z",
                    user: "56dfef269100b25c05819305"
                },
                history       : [],
                attachments   : [],
                notes         : [],
                groups        : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW      : "everyOne",
                social        : {
                    FB: "",
                    LI: ""
                },
                color         : "#4d5a75",
                salesPurchases: {
                    language   : "English",
                    reference  : "",
                    salesPerson: null,
                    active     : false,
                    isSupplier : false,
                    isCustomer : false
                },
                title         : "",
                internalNotes : "",
                contacts      : [],
                phones        : {
                    mobile: "",
                    phone : ""
                },
                skype         : "",
                jobPosition   : "",
                website       : "takuminet.works/",
                address       : {
                    country: "Japan",
                    zip    : "302-0024",
                    state  : "Ibaraki Prefecture",
                    city   : "Toride",
                    street : "Shinmachi 5-14-18"
                },
                timezone      : "UTC",
                department    : null,
                company       : null,
                email         : "",
                imageSrc      : "data:image/jpeg;base64,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",
                name          : {
                    last : "",
                    first: "Takumi Networks"
                },
                isOwn         : false,
                type          : "Company",
                __v           : 0,
                relatedUser   : null
            },
            isOrder     : true,
            forSales    : true,
            currency    : {
                rate: 1,
                _id : "565eab29aeb95fa9c0f9df2d"
            },
            salesmanager: {
                _id            : "55b92ad221e4b7c40f0000bb",
                dateBirth      : "1983-05-30T00:00:00.000Z",
                ID             : 5171,
                isLead         : 0,
                fire           : [
                    "2016-03-30T21:00:00.000Z"
                ],
                hire           : [
                    "2015-07-26T21:00:00.000Z"
                ],
                social         : {
                    FB: "",
                    LI: ""
                },
                sequence       : 0,
                jobType        : "Full-time",
                gender         : "male",
                marital        : "unmarried",
                contractEnd    : {
                    reason: "Fired",
                    date  : "2016-03-31T21:00:00.000Z"
                },
                attachments    : [],
                editedBy       : {
                    date: "2016-04-04T14:49:27.021Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy      : {
                    date: "2015-07-29T19:34:42.660Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate   : "2015-07-29T19:34:42.660Z",
                color          : "#4d5a75",
                otherInfo      : "",
                groups         : {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW       : "everyOne",
                workflow       : null,
                active         : false,
                referredBy     : "",
                source         : "",
                age            : 33,
                homeAddress    : {
                    country: "",
                    zip    : "",
                    state  : "",
                    city   : "",
                    street : ""
                },
                otherId        : "",
                bankAccountNo  : "",
                nationality    : "Ukrainian",
                coach          : null,
                manager        : "55b92ad221e4b7c40f00004a",
                jobPosition    : "55b92acf21e4b7c40f00002e",
                department     : "55b92ace21e4b7c40f000014",
                visibility     : "Public",
                relatedUser    : null,
                officeLocation : "",
                skype          : "lembergsun",
                workPhones     : {
                    mobile: "+380967934908",
                    phone : ""
                },
                personalEmail  : "lembergsun@gmail.com",
                workEmail      : "igor.shepinka@thinkmobiles.com",
                workAddress    : {
                    country: "",
                    zip    : "",
                    state  : "",
                    city   : "",
                    street : ""
                },
                tags           : [
                    ""
                ],
                name           : {
                    last : "Shepinka",
                    first: "Igor"
                },
                subject        : "",
                imageSrc       : "data:image/jpeg;base64,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",
                isEmployee     : false,
                __v            : 0,
                transferred    : [
                    {
                        date      : "2015-11-02T19:10:38.659Z",
                        department: "iOS"
                    }
                ],
                lastFire       : 201613,
                proposedSalary : 0,
                expectedSalary : 0,
                nextAction     : "",
                passportNo     : "",
                identNo        : "",
                transfer       : [
                    {
                        date           : "2015-07-27T01:00:00.000Z",
                        isDeveloper    : true,
                        info           : "",
                        salary         : 500,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004a",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "hired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2015-10-01T01:00:00.000Z",
                        isDeveloper    : true,
                        info           : "",
                        salary         : 500,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004a",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2016-02-01T02:00:00.000Z",
                        isDeveloper    : true,
                        info           : "Update",
                        salary         : 450,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004a",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2016-03-31T01:00:00.000Z",
                        isDeveloper    : true,
                        info           : "Fired",
                        salary         : 450,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004a",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "fired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    }
                ],
                weeklyScheduler: "57332c3b94ee1140b6bb49e2"
            }
        },
        {
            _id            : "573ad56e45310a4662c8004d",
            proformaCounter: 0,
            workflow       : {
                _id         : "55647b962e4aa3804a765ec6",
                color       : "#2C3E50",
                name        : "Invoiced",
                sequence    : 1,
                status      : "Done",
                wId         : "Sales Order",
                wName       : "order",
                source      : "purchase",
                targetSource: [
                    "order"
                ],
                visible     : true
            },
            paymentInfo    : {
                taxes  : 0,
                unTaxed: 200000,
                total  : 200000
            },
            name           : "PO1053",
            orderDate      : "2016-05-17T00:00:00.000Z",
            project        : {
                _id             : "5731dfc53c171d6620f8affe",
                TargetEndDate   : "2016-05-20T00:00:00.000Z",
                StartDate       : null,
                budget          : {
                    bonus      : [],
                    projectTeam: [
                        "5731e0a59574caa820fa074e",
                        "5731e0be70fe250920d090b5",
                        "5731e0dc3368be4f2157c6ef"
                    ]
                },
                bonus           : [],
                health          : 1,
                editedBy        : {
                    date: "2016-05-10T13:23:40.620Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments     : [],
                notes           : [],
                projecttype     : "mixed",
                createdBy       : {
                    date: "2016-05-10T13:19:01.259Z",
                    user: "55bf144765cda0810b000005"
                },
                progress        : 0,
                remaining       : 0,
                logged          : 0,
                estimated       : 0,
                workflow        : "528ce7d0f3f67bc40b000021",
                parent          : null,
                sequence        : 0,
                groups          : {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [],
                    group: []
                },
                whoCanRW        : "everyOne",
                salesmanager    : null,
                projectmanager  : null,
                customer        : "55ba0301d79a3a343900000d",
                task            : [],
                projectName     : "test",
                projectShortDesc: "test",
                __v             : 0,
                EndDate         : null
            },
            supplier       : {
                _id           : "55ba0301d79a3a343900000d",
                companyInfo   : {
                    industry: null
                },
                editedBy      : {
                    date: "2015-07-30T10:57:05.119Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                createdBy     : {
                    date: "2015-07-30T10:57:05.119Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                history       : [],
                attachments   : [],
                notes         : [],
                groups        : {
                    owner: "55b9fbcdd79a3a3439000007",
                    users: [],
                    group: []
                },
                whoCanRW      : "everyOne",
                social        : {
                    LI: "",
                    FB: ""
                },
                color         : "#4d5a75",
                salesPurchases: {
                    receiveMessages: 0,
                    language       : "English",
                    reference      : "",
                    active         : false,
                    implementedBy  : null,
                    salesTeam      : null,
                    salesPerson    : null,
                    isSupplier     : false,
                    isCustomer     : false
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
                website       : "hashplay.net",
                address       : {
                    country: "United States",
                    zip    : "94107",
                    state  : "California",
                    city   : "San Francisco",
                    street : "350 Townsend St. 755"
                },
                timezone      : "UTC",
                department    : null,
                company       : null,
                email         : "contact@hashplay.tv",
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name          : {
                    last : "",
                    first: "#Play"
                },
                isOwn         : false,
                type          : "Company",
                __v           : 0
            },
            isOrder        : true,
            forSales       : true,
            currency       : {
                _id: "565eab34aeb95fa9c0f9df2e"
            }
        },
        {
            _id            : "573af46d1dfbcab71d14e6a8",
            proformaCounter: 0,
            workflow       : {
                _id         : "55647b962e4aa3804a765ec6",
                color       : "#2C3E50",
                name        : "Invoiced",
                sequence    : 1,
                status      : "Done",
                wId         : "Sales Order",
                wName       : "order",
                source      : "purchase",
                targetSource: [
                    "order"
                ],
                visible     : true
            },
            paymentInfo    : {
                taxes  : 0,
                unTaxed: 20000,
                total  : 20000
            },
            name           : "PO1057",
            orderDate      : "2016-05-17T00:00:00.000Z",
            project        : {
                _id             : "573ad86f774df2256266159f",
                TargetEndDate   : "2016-05-31T00:00:00.000Z",
                StartDate       : null,
                budget          : {
                    bonus      : [],
                    projectTeam: [
                        "573ad8b16118b0046277ee46",
                        "573ae076d0501dc2618f18a6",
                        "573af6566601fa961ded80ee"
                    ]
                },
                bonus           : [],
                health          : 1,
                editedBy        : {
                    date: "2016-05-17T10:45:42.313Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments     : [],
                notes           : [],
                paymentMethod   : "565f2e05ab70d49024242e07",
                paymentTerms    : "55536e52475b7be475f335f6",
                projecttype     : "time & material",
                createdBy       : {
                    date: "2016-05-17T08:38:07.795Z",
                    user: "55bf144765cda0810b000005"
                },
                progress        : 0,
                remaining       : 0,
                logged          : 0,
                estimated       : 0,
                workflow        : "528ce7d0f3f67bc40b000021",
                parent          : null,
                sequence        : 0,
                groups          : {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [],
                    group: []
                },
                whoCanRW        : "everyOne",
                salesmanager    : "565f0fa6f6427f253cf6bf19",
                projectmanager  : "56b8b99e6c411b590588feb9",
                customer        : "55cdc93c9b42266a4f000005",
                task            : [],
                projectName     : "test2",
                projectShortDesc: "test2",
                __v             : 0,
                EndDate         : null
            },
            supplier       : {
                _id           : "55cdc93c9b42266a4f000005",
                companyInfo   : {
                    industry: null
                },
                editedBy      : {
                    date: "2015-08-14T10:55:56.414Z",
                    user: "55b9dd237a3632120b000005"
                },
                createdBy     : {
                    date: "2015-08-14T10:55:56.414Z",
                    user: "55b9dd237a3632120b000005"
                },
                history       : [],
                attachments   : [],
                notes         : [],
                groups        : {
                    owner: "55ba28c8d79a3a3439000016",
                    users: [],
                    group: []
                },
                whoCanRW      : "everyOne",
                social        : {
                    LI: "",
                    FB: ""
                },
                color         : "#4d5a75",
                salesPurchases: {
                    receiveMessages: 0,
                    language       : "English",
                    reference      : "",
                    active         : false,
                    implementedBy  : null,
                    salesTeam      : null,
                    salesPerson    : null,
                    isSupplier     : false,
                    isCustomer     : false
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
                website       : "www.agilefind.com/",
                address       : {
                    country: "United Kingdom",
                    zip    : "",
                    state  : "",
                    city   : "London",
                    street : ""
                },
                timezone      : "UTC",
                department    : null,
                company       : null,
                email         : "",
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name          : {
                    last : "",
                    first: "AgileFind"
                },
                isOwn         : false,
                type          : "Company",
                __v           : 0
            },
            isOrder        : true,
            forSales       : true,
            currency       : {
                _id: "565eab29aeb95fa9c0f9df2d"
            }
        },
        {
            _id            : "573ad6be0ff1f7a761a03e9a",
            proformaCounter: 1,
            workflow       : {
                _id         : "55647b962e4aa3804a765ec6",
                color       : "#2C3E50",
                name        : "Invoiced",
                sequence    : 1,
                status      : "Done",
                wId         : "Sales Order",
                wName       : "order",
                source      : "purchase",
                targetSource: [
                    "order"
                ],
                visible     : true
            },
            paymentInfo    : {
                taxes  : 0,
                unTaxed: 20000,
                total  : 20000
            },
            name           : "PO1054",
            orderDate      : "2016-05-17T00:00:00.000Z",
            project        : {
                _id             : "5731dfc53c171d6620f8affe",
                TargetEndDate   : "2016-05-20T00:00:00.000Z",
                StartDate       : null,
                budget          : {
                    bonus      : [],
                    projectTeam: [
                        "5731e0a59574caa820fa074e",
                        "5731e0be70fe250920d090b5",
                        "5731e0dc3368be4f2157c6ef"
                    ]
                },
                bonus           : [],
                health          : 1,
                editedBy        : {
                    date: "2016-05-10T13:23:40.620Z",
                    user: "55bf144765cda0810b000005"
                },
                attachments     : [],
                notes           : [],
                projecttype     : "mixed",
                createdBy       : {
                    date: "2016-05-10T13:19:01.259Z",
                    user: "55bf144765cda0810b000005"
                },
                progress        : 0,
                remaining       : 0,
                logged          : 0,
                estimated       : 0,
                workflow        : "528ce7d0f3f67bc40b000021",
                parent          : null,
                sequence        : 0,
                groups          : {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [],
                    group: []
                },
                whoCanRW        : "everyOne",
                salesmanager    : null,
                projectmanager  : null,
                customer        : "55ba0301d79a3a343900000d",
                task            : [],
                projectName     : "test",
                projectShortDesc: "test",
                __v             : 0,
                EndDate         : null
            },
            supplier       : {
                _id           : "55ba0301d79a3a343900000d",
                companyInfo   : {
                    industry: null
                },
                editedBy      : {
                    date: "2015-07-30T10:57:05.119Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                createdBy     : {
                    date: "2015-07-30T10:57:05.119Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                history       : [],
                attachments   : [],
                notes         : [],
                groups        : {
                    owner: "55b9fbcdd79a3a3439000007",
                    users: [],
                    group: []
                },
                whoCanRW      : "everyOne",
                social        : {
                    LI: "",
                    FB: ""
                },
                color         : "#4d5a75",
                salesPurchases: {
                    receiveMessages: 0,
                    language       : "English",
                    reference      : "",
                    active         : false,
                    implementedBy  : null,
                    salesTeam      : null,
                    salesPerson    : null,
                    isSupplier     : false,
                    isCustomer     : false
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
                website       : "hashplay.net",
                address       : {
                    country: "United States",
                    zip    : "94107",
                    state  : "California",
                    city   : "San Francisco",
                    street : "350 Townsend St. 755"
                },
                timezone      : "UTC",
                department    : null,
                company       : null,
                email         : "contact@hashplay.tv",
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name          : {
                    last : "",
                    first: "#Play"
                },
                isOwn         : false,
                type          : "Company",
                __v           : 0
            },
            isOrder        : true,
            forSales       : true,
            currency       : {
                _id: "565eab3faeb95fa9c0f9df2f"
            }
        }
    ];
    var fakeOrderById = {
        _id            : "572b22b45aa8d58049019174",
        __v            : 0,
        proformaCounter: 0,
        editedBy       : {
            date: "2016-05-19T10:23:41.422Z",
            user: "52203e707d4dba8813000003"
        },
        createdBy      : {
            date: "2016-05-05T10:38:44.116Z",
            user: "563f673270bbc2b740ce89ae"
        },
        creationDate   : "2016-05-05T10:38:44.116Z",
        groups         : {
            group: [],
            users: [],
            owner: {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            }
        },
        attachments    : [],
        whoCanRW       : "everyOne",
        workflow       : {
            _id   : "55647b932e4aa3804a765ec5",
            name  : "Not Invoiced",
            status: "New"
        },
        products       : [
            {
                scheduledDate: "",
                jobs         : {
                    _id : "56e296543c074d636203bbd1",
                    name: "comics design"
                },
                description  : "",
                product      : {
                    _id : "5540d528dacb551c24000003",
                    name: "IT services"
                },
                unitPrice    : 70000,
                subTotal     : 70000,
                taxes        : 0,
                quantity     : 192
            }
        ],
        paymentInfo    : {
            taxes  : 0,
            unTaxed: 70000,
            total  : 70000
        },
        paymentTerm    : null,
        invoiceRecived : false,
        invoiceControl : null,
        incoterm       : null,
        destination    : null,
        name           : "PO1035",
        expectedDate   : "2016-05-04T22:00:00.000Z",
        orderDate      : "2016-05-04T22:00:00.000Z",
        deliverTo      : {
            _id : "55543831d51bdef79ea0d58c",
            name: "YourCompany"
        },
        project        : {
            _id        : "56e005f0f20b93842671670d",
            projectName: "Spoon Comics"
        },
        supplier       : {
            _id     : "56dffe038594da632689f1ca",
            name    : {
                last : "",
                first: "Takumi Networks"
            },
            fullName: "Takumi Networks ",
            id      : "56dffe038594da632689f1ca"
        },
        isOrder        : true,
        type           : "Not Invoiced",
        forSales       : true,
        currency       : {
            rate: 1,
            _id : {
                _id     : "565eab29aeb95fa9c0f9df2d",
                sequence: 0,
                name    : "USD"
            }
        }
    };
    var fakeUsers = {
        data: [
            {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            },
            {
                _id  : "55ba28c8d79a3a3439000016",
                login: "AndrianaLemko"
            },
            {
                _id  : "55ba2ef1d79a3a343900001c",
                login: "AnnaLobas"
            },
            {
                _id  : "55c1e1276708490b0b000035",
                login: "ArturMyhalko"
            },
            {
                _id  : "55b9fbcdd79a3a3439000007",
                login: "Igor Stan"
            },
            {
                _id  : "55b8cb7d0ce4affc2a0015cb",
                login: "Irina.Grab"
            },
            {
                _id  : "56224c43c558b13c1bbf8756",
                login: "Kodenko"
            },
            {
                _id  : "55ba2f3ed79a3a343900001d",
                login: "MariaZasukhina"
            },
            {
                _id  : "55c1e1aa6708490b0b000037",
                login: "OksanaKordas"
            },
            {
                _id  : "55cb7302fea413b50b000007",
                login: "OlegOstroverkh"
            },
            {
                _id  : "55bb1d7ecb76ca630b000005",
                login: "Stas.Volskiy"
            },
            {
                _id  : "560d0c46963ba3087363de94",
                login: "Vitaliy.Shuba"
            },
            {
                _id  : "52203e707d4dba8813000003",
                login: "admin"
            },
            {
                _id  : "563f673270bbc2b740ce89ae",
                login: "alex.sokhanych"
            },
            {
                _id  : "5631dc18bf9592df04c55106",
                login: "alina.yurenko"
            },
            {
                _id  : "569f5d8c62d172544baf0d52",
                login: "alona.yelahina"
            },
            {
                _id  : "56d6fff1805eb08d2b93d95b",
                login: "anastas.lyakh"
            },
            {
                _id  : "56c44e38b81fd51e19207f40",
                login: "anatoliy.dalekorey"
            },
            {
                _id  : "56bda2e0dfd8a81466e2f4e2",
                login: "andriy.hanchak"
            },
            {
                _id  : "56dd3dd92e7b62c613ff2553",
                login: "andriy.merentsov"
            },
            {
                _id  : "56dda0599fb95fbe18e3f8ed",
                login: "anton.nizhegorodov"
            },
            {
                _id  : "56a72b95aa157ca50f21fb21",
                login: "anton.yarosh"
            },
            {
                _id  : "56a72df2aa157ca50f21fb23",
                login: "dmytro.babilia"
            },
            {
                _id  : "56d704f1805eb08d2b93d95f",
                login: "eugen.lendyel"
            },
            {
                _id  : "563b58c2ab9698be7c9df6b6",
                login: "gabriella.shterr"
            },
            {
                _id  : "56dfef269100b25c05819305",
                login: "igor.shepinka"
            },
            {
                _id  : "55ba0c01d79a3a3439000014",
                login: "ivan.bilak"
            },
            {
                _id  : "56b2e83b39df50996ae2f07e",
                login: "katerina.pasichnyuk"
            },
            {
                _id  : "56239dcce9576d1728a9ed1c",
                login: "kristian.rimar"
            },
            {
                _id  : "55b9dd7a7a3632120b000006",
                login: "larysa.popp"
            },
            {
                _id  : "56239e0ce9576d1728a9ed1d",
                login: "liliya.shustur"
            },
            {
                _id  : "56239f14e9576d1728a9ed23",
                login: "michael"
            },
            {
                _id  : "56c47f1ed2b48ede4ba42201",
                login: "nadiya.shishko"
            },
            {
                _id  : "561e37f7d6c741e8235f42cb",
                login: "natalia.yartysh"
            },
            {
                _id  : "56cc3dcf541812c071973563",
                login: "nelia.plovaiko"
            },
            {
                _id  : "569e1e8eea21e2ac7d729e2b",
                login: "office.manager"
            },
            {
                _id  : "567181ae8453e8b464b70c19",
                login: "oles.pavliuk"
            },
            {
                _id  : "56239e58e9576d1728a9ed1f",
                login: "olga.sikora"
            },
            {
                _id  : "55b9fc0fd79a3a3439000008",
                login: "peter.volosh"
            },
            {
                _id  : "55b9dd237a3632120b000005",
                login: "roland.katona"
            },
            {
                _id  : "56ddac991e6cb7131892b2be",
                login: "roman.babunych"
            },
            {
                _id  : "56a72af2aa157ca50f21fb20",
                login: "roman.kubichka"
            },
            {
                _id  : "56cf238d541812c0719735a4",
                login: "sergey.melnik"
            },
            {
                _id  : "56dd6b7986cd133418c45ada",
                login: "sergiy.ihnatko"
            },
            {
                _id  : "56a72cafaa157ca50f21fb22",
                login: "stanislav.romanyuk"
            },
            {
                _id  : "56dd6bb5cc599b9718529137",
                login: "tamara.dolottseva"
            },
            {
                _id  : "56d7e73eae35cc4f0e72105b",
                login: "testuser"
            },
            {
                _id  : "56d83d0f32e6cca40d256674",
                login: "tetiana.shepitko"
            },
            {
                _id  : "55ba00e9d79a3a343900000c",
                login: "vasiliy.almashi"
            },
            {
                _id  : "56239efae9576d1728a9ed22",
                login: "vladyslav."
            },
            {
                _id  : "56d70560805eb08d2b93d960",
                login: "yana.dufynets"
            },
            {
                _id  : "55bf144765cda0810b000005",
                login: "yana.gusti"
            },
            {
                _id  : "56dfd31116ff2db10581fa0e",
                login: "yana.vengerova"
            },
            {
                _id  : "560255d1638625cf32000005",
                login: "yevgenia.bezyk"
            },
            {
                _id  : "56e92c7a52252ef45d219264",
                login: "yevgenia.melnyk"
            }
        ]
    };
    var fakeIncoterm = {
        data: [
            {
                _id : "55537115475b7be475f33602",
                code: "CIP",
                name: "CARRIAGE AND INSURANCE PAID TO"
            },
            {
                _id : "55537115475b7be475f33601",
                code: "CPT",
                name: "CARRIAGE PAID TO"
            },
            {
                _id : "55537115475b7be475f335ff",
                code: "CFR",
                name: "COST AND FREIGHT"
            },
            {
                _id : "55537115475b7be475f33600",
                code: "CIF",
                name: "COST, INSURANCE AND FREIGHT"
            },
            {
                _id : "55537115475b7be475f33603",
                code: "DAF",
                name: "DELIVERED AT FRONTIER"
            },
            {
                _id : "55537115475b7be475f33608",
                code: "DAP",
                name: "DELIVERED AT PLACE"
            },
            {
                _id : "55537115475b7be475f33607",
                code: "DAT",
                name: "DELIVERED AT TERMINAL"
            },
            {
                _id : "55537115475b7be475f33609",
                code: "DDP",
                name: "DELIVERED DUTY PAID"
            },
            {
                _id : "55537115475b7be475f33606",
                code: "DDU",
                name: "DELIVERED DUTY UNPAID"
            },
            {
                _id : "55537115475b7be475f33605",
                code: "DEQ",
                name: "DELIVERED EX QUAY"
            },
            {
                _id : "55537115475b7be475f33604",
                code: "DES",
                name: "DELIVERED EX SHIP"
            },
            {
                _id : "55537115475b7be475f335fb",
                code: "EXW",
                name: "EX WORKS"
            },
            {
                _id : "55537115475b7be475f335fd",
                code: "FAS",
                name: "FREE ALONGSIDE SHIP"
            },
            {
                _id : "55537115475b7be475f335fc",
                code: "FCA",
                name: "FREE CARRIER"
            },
            {
                _id : "55537115475b7be475f335fe",
                code: "FOB",
                name: "FREE ON BOARD"
            }
        ]
    };

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;


    describe('SalesOrder View', function () {
        var $fixture;
        var $elFixture;

        after(function () {
            listView.remove();
            topBarView.remove();
            view.remove();
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
                view = new MainView({el: $elFixture, contentType: 'salesOrder'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="63"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="63"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/salesOrder');
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

            it('Try to create TopBarView', function () {
                var orderUrl = new RegExp('\/quotation\/list', 'i');

                server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOrders)]);
                orderCollection = new OrderCollection({
                    viewType   : 'list',
                    contentType: 'salesOrder',
                    page       : 1
                });
                server.respond();

                topBarView = new TopBarView({
                    collection: orderCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Orders');
            });
        });

        describe('SalesOrder ListView', function () {
            var server;
            var $thisEl;
            var windowConfirmStub;
            var mainSpy;

            before(function () {
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to SalesOrder ListView', function () {
                    listView = new ListView({
                        collection: orderCollection
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('.list')).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.be.not.equals(0);

                    topBarView.bind('copyEvent', listView.copy, listView);
                    topBarView.bind('generateEvent', listView.generate, listView);
                    topBarView.bind('createEvent', listView.createItem, listView);
                    topBarView.bind('editEvent', listView.editItem, listView);
                    topBarView.bind('saveEvent', listView.saveItem, listView);
                    topBarView.bind('deleteEvent', listView.deleteItems, listView);
                    topBarView.bind('generateInvoice', listView.generateInvoice, listView);
                    topBarView.bind('copyRow', listView.copyRow, listView);
                    topBarView.bind('exportToCsv', listView.exportToCsv, listView);
                    topBarView.bind('exportToXlsx', listView.exportToXlsx, listView);
                    topBarView.bind('importEvent', listView.importFiles, listView);
                    topBarView.bind('pay', listView.newPayment, listView);
                    topBarView.bind('changeDateRange', listView.changeDateRange, listView);

                    orderCollection.bind('showmore', listView.showMoreContent, listView);
                });

                it('Try to filter listView by Status and SM', function () {
                    var $next;
                    var $prev;
                    var $selectedItem;
                    var $salesManager;
                    var $status;
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var orderUrl = new RegExp('\/quotation\/list', 'i');

                    $searchArrow.click();
                    expect($thisEl.find('.search-options')).to.not.have.class('hidden');

                    //select SM
                    $salesManager = $searchContainer.find('#salesmanagerFullContainer > .groupName');
                    $salesManager.click();
                    $next = $searchContainer.find('.next');
                    $next.click();
                    $prev = $searchContainer.find('.prev');
                    $prev.click();
                    $selectedItem = $searchContainer.find('#salesmanagerUl > li').first();

                    server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([fakeOrders[0], fakeOrders[1]])]);
                    $selectedItem.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);

                    // select status
                    $status = $searchContainer.find('#workflowFullContainer > .groupName');
                    $status.click();
                    $selectedItem = $searchContainer.find('li[data-value="55647b962e4aa3804a765ec6"]');

                    server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([fakeOrders[0]])]);
                    $selectedItem.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(1);

                    // uncheck status filter
                    server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([fakeOrders[0], fakeOrders[1]])]);
                    $selectedItem.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);

                    $searchArrow.click();
                    expect($thisEl.find('.search-options')).to.have.class('hidden');
                });

                it('Try to close SM filter', function () {
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $closeFilterBtn = $searchContainer.find('span[data-value="salesmanager"]').next();
                    var orderUrl = new RegExp('\/quotation\/list', 'i');

                    server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOrders)]);
                    $closeFilterBtn.click();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(4);
                });

                it('Try to open CreateView', function () {
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.exist;

                    $('.ui-dialog').remove();
                });

                it('Try to delete item', function () {
                    var $deleteBtn;
                    var $checkBox = listView.$el.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var orderUrl = new RegExp('\/quotation\/', 'i');

                    $checkBox.click();
                    $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    server.respondWith('DELETE', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "success": {
                            "_id"           : "56fcd6fc0bbb61c30355b4fd",
                            "expectedDate"  : "2016-03-31T00:00:00.000Z",
                            "__v"           : 0,
                            "editedBy"      : {
                                "date": "2016-03-31T07:52:04.451Z",
                                "user": "55b9fc0fd79a3a3439000008"
                            },
                            "createdBy"     : {
                                "date": "2016-03-31T07:51:24.623Z",
                                "user": "55b9fc0fd79a3a3439000008"
                            },
                            "creationDate"  : "2016-03-31T07:51:24.623Z",
                            "groups"        : {
                                "group": [],
                                "users": [],
                                "owner": "560c099da5d4a2e20ba5068b"
                            },
                            "whoCanRW"      : "everyOne",
                            "workflow"      : "55647b962e4aa3804a765ec6",
                            "products"      : [{
                                "scheduledDate": "2016-03-31T00:00:00.000Z",
                                "subTotal"     : 3000,
                                "taxes"        : 0,
                                "unitPrice"    : 3000,
                                "jobs"         : "564cfdd06584412e618421de",
                                "description"  : "",
                                "product"      : "5540d528dacb551c24000003",
                                "quantity"     : 530
                            }],
                            "paymentInfo"   : {
                                "taxes"  : 0,
                                "unTaxed": 3000,
                                "total"  : 3000
                            },
                            "paymentTerm"   : null,
                            "invoiceRecived": false,
                            "invoiceControl": null,
                            "incoterm"      : null,
                            "destination"   : null,
                            "name"          : "PO918",
                            "orderDate"     : "2016-03-31T00:00:00.000Z",
                            "deliverTo"     : "55543831d51bdef79ea0d58c",
                            "project"       : "55b92ad621e4b7c40f000686",
                            "supplier"      : "55b92ad621e4b7c40f00064b",
                            "isOrder"       : true,
                            "type"          : "Not Invoiced",
                            "forSales"      : true,
                            "currency"      : {
                                "rate": 1,
                                "_id" : "565eab29aeb95fa9c0f9df2d"
                            }
                        }
                    })]);
                    $deleteBtn.click();
                    server.respond();
                });

                it('Try to go to edit form', function () {
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var orderUrl = new RegExp('\/orders\/form', 'i');
                    var usersUrl = new RegExp('\/users\/forDd', 'i');
                    var incotermUrl = '/incoterm';

                    server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOrderById)]);
                    server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsers)]);
                    server.respondWith('GET', incotermUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeIncoterm)]);
                    $needTd.click();
                    server.respond();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to change tab in EditView', function () {
                    var $dialogEl = $('.ui-dialog');
                    var $firstTab = $dialogEl.find('.dialog-tabs > li:nth-child(1) > a');
                    var $secondTab = $dialogEl.find('.dialog-tabs > li:nth-child(2) > a');

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($secondTab).to.have.class('active');

                    $firstTab.click();
                    expect($firstTab).to.have.class('active');
                });

                it('Try to delete NotInvoiced Order with error response', function () {
                    var spyResponse;
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    var orderUrl = new RegExp('\/orders\/', 'i');

                    server.respondWith('DELETE', orderUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'You do not have permission to perform this action');
                });

                it('Try to delete NotInvoiced Order ', function () {
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    var orderUrl = new RegExp('\/orders\/', 'i');

                    server.respondWith('DELETE', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "success": {
                            "_id"            : "56c6ebd80769bba2647ae701",
                            "__v"            : 0,
                            "proformaCounter": 0,
                            "editedBy"       : {
                                "date": "2016-04-11T07:01:01.309Z",
                                "user": "52203e707d4dba8813000003"
                            },
                            "createdBy"      : {
                                "date": "2016-02-19T10:18:00.060Z",
                                "user": "52203e707d4dba8813000003"
                            },
                            "creationDate"   : "2016-02-19T10:18:00.060Z",
                            "groups"         : {
                                "group": [],
                                "users": [],
                                "owner": "55ba28c8d79a3a3439000016"
                            },
                            "attachments"    : [],
                            "whoCanRW"       : "everyOne",
                            "workflow"       : "55647b932e4aa3804a765ec5",
                            "products"       : [{
                                "scheduledDate": "",
                                "jobs"         : "56afda4cf5c2bcd4555cb2f1",
                                "description"  : "",
                                "product"      : "5540d528dacb551c24000003",
                                "unitPrice"    : 360000,
                                "subTotal"     : 360000,
                                "taxes"        : 0,
                                "quantity"     : 42
                            }],
                            "paymentInfo"    : {
                                "taxes"  : 0,
                                "unTaxed": 360000,
                                "total"  : 360000
                            },
                            "paymentTerm"    : null,
                            "invoiceRecived" : false,
                            "invoiceControl" : null,
                            "incoterm"       : null,
                            "destination"    : null,
                            "name"           : "PO825",
                            "expectedDate"   : "2016-02-19T00:00:00.000Z",
                            "orderDate"      : "2016-02-19T00:00:00.000Z",
                            "deliverTo"      : "55543831d51bdef79ea0d58c",
                            "project"        : "56030dbffa3f91444e00000d",
                            "supplier"       : "56030d81fa3f91444e00000c",
                            "isOrder"        : true,
                            "type"           : "Not Invoiced",
                            "forSales"       : true,
                            "currency"       : {
                                "rate": 1,
                                "_id" : "565eab29aeb95fa9c0f9df2d"
                            }
                        }
                    })]);
                    $deleteBtn.click();
                    server.respond();

                });

                it('Try to receive invoice', function () {

                    var $needTd = listView.$el.find('#listTable > tr:nth-child(3) > td:nth-child(2)');
                    var usersUrl = new RegExp('\/users\/forDd', 'i');
                    var incotermUrl = '/incoterm';
                    var orderUrl = new RegExp('\/orders\/', 'i');
                    var invoiceUrl = '/invoices/receive';
                    var $dialog;
                    var $receiveInvoiceBtn;

                    server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOrderById)]);
                    server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsers)]);
                    server.respondWith('GET', incotermUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeIncoterm)]);
                    $needTd.click();
                    server.respond();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;

                    $dialog = $('.ui-dialog');
                    $receiveInvoiceBtn = $dialog.find('.receiveInvoice');
                    server.respondWith('PATCH', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    server.respondWith('POST', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Created success'})]);
                    $receiveInvoiceBtn.click();
                    server.respond();
                    server.respond();

                });

                it('Try to edit item', function () {
                    var $next;
                    var $prev;
                    var $selectedItem;
                    var $selectUsersEl = $('.assignees-info a');
                    var $dialog = $('.ui-dialog');
                    var $secondTab = $dialog.find('.dialog-tabs > li:nth-child(2) > a');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var orderUrl = new RegExp('\/orders\/', 'i');
                    var orderFormUrl = new RegExp('\/orders\/form', 'i');
                    var usersUrl = new RegExp('\/users\/forDd', 'i');
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var userAgentPattern = new RegExp('Firefox', 'i');
                    var userAgent = navigator.userAgent;

                    server.respondWith('GET', orderFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOrderById)]);
                    server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsers)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    $secondTab.click();
                    $selectUsersEl.click();
                    $next = $dialog.find('.next');
                    $next.click();
                    $prev = $dialog.find('.prev');
                    $prev.click();
                    $selectedItem = $dialog.find('#55ba28c8d79a3a3439000016');
                    $selectedItem.click();

                    server.respondWith('PATCH', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    if (userAgentPattern.test(userAgent)) {
                        expect(window.location.hash).to.be.equals('#easyErp/salesOrders/list/p=1/c=100/filter={"forSales":{"key":"forSales","value":["true"]}}');
                    } else {
                        expect(window.location.hash).to.be.equals('#easyErp/salesOrders/list/p=1/c=100/filter=%7B%22forSales%22%3A%7B%22key%22%3A%22forSales%22%2C%22value%22%3A%5B%22true%22%5D%7D%7D');
                    }
                });
            });
        });
    });
});
