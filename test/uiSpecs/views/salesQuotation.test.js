define([
    'modules',
    'text!fixtures/index.html',
    'collections/Quotations/filterCollection',
    'views/main/MainView',
    'views/salesQuotations/list/ListView',
    'views/salesQuotations/TopBarView',
    'views/salesQuotations/CreateView',
    'views/salesQuotations/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules, fixtures, QuotationCollection, MainView, ListView, TopBarView, CreateView, EditView, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var expect;
    var fakeQuotation = [
        {
            _id         : "572992e72d11557621505d05",
            workflow    : {
                _id         : "5555bf276a3f01acae0b5560",
                color       : "#2C3E50",
                name        : "Not Ordered",
                sequence    : 3,
                status      : "New",
                wId         : "Purchase Order",
                wName       : "order",
                source      : "purchase",
                targetSource: [
                    "quotation"
                ],
                visible     : true
            },
            paymentInfo : {
                total  : 500000,
                unTaxed: 500000,
                taxes  : 0
            },
            name        : "PO1028",
            orderDate   : "2016-05-03T22:00:00.000Z",
            project     : {
                _id             : "55b92ad621e4b7c40f0006d3",
                EndDate         : null,
                StartDate       : null,
                ID              : 2105,
                bonus           : [],
                health          : 1,
                editedBy        : {
                    date: "2016-04-29T13:39:14.176Z",
                    user: "55ba00e9d79a3a343900000c"
                },
                attachments     : [],
                notes           : [],
                projecttype     : "",
                createdBy       : {
                    date: "2015-07-29T19:34:46.416Z",
                    user: "52203e707d4dba8813000003"
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
                customer        : "55b92ad621e4b7c40f00062b",
                task            : [],
                projectName     : "HashPlay",
                projectShortDesc: "emptyProject",
                __v             : 0,
                budget          : {
                    bonus      : [],
                    projectTeam: [
                        "56ab56b374d57e0d56d6bd87",
                        "569e98452208b3af4a5271c2",
                        "5662165b25e5eb511510bf92",
                        "5662134b25e5eb511510be6f",
                        "569ea8b62208b3af4a5271cd",
                        "5662125d25e5eb511510be16",
                        "564cfdd06584412e618421b4",
                        "564cfd8ba6e6390160c9ef59",
                        "564cfd8ba6e6390160c9ef58",
                        "572364027ddd4b42221d86e9"
                    ]
                },
                TargetEndDate   : "",
                description     : "",
                salesmanager    : "55b92ad221e4b7c40f000040"
            },
            supplier    : {
                _id           : "55b92ad621e4b7c40f00062b",
                ID            : 1067,
                companyInfo   : {
                    size    : null,
                    industry: null
                },
                editedBy      : {
                    date: "2015-07-29T19:34:46.003Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy     : {
                    date: "2015-07-29T19:34:46.003Z",
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
                    country: "USA/Germany",
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
                    first: "HashPlay"
                },
                isOwn         : false,
                type          : "Person",
                __v           : 0
            },
            isOrder     : false,
            forSales    : true,
            currency    : {
                rate: 1,
                _id : "565eab29aeb95fa9c0f9df2d"
            },
            salesmanager: {
                _id            : "55b92ad221e4b7c40f000040",
                dateBirth      : "1992-01-10T22:00:00.000Z",
                ID             : 85,
                isLead         : 0,
                fire           : [],
                hire           : [
                    "2015-01-18T22:00:00.000Z"
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
                    date  : "2015-07-29T19:34:42.423Z",
                    reason: ""
                },
                attachments    : [],
                editedBy       : {
                    date: "2016-04-18T14:44:21.206Z",
                    user: "55ba2ef1d79a3a343900001c"
                },
                createdBy      : {
                    date: "2015-07-29T19:34:42.423Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate   : "2015-07-29T19:34:42.423Z",
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
                age            : 24,
                homeAddress    : {
                    country: "",
                    zip    : "",
                    state  : "",
                    city   : "",
                    street : ""
                },
                otherId        : "",
                bankAccountNo  : "",
                nationality    : "",
                coach          : null,
                manager        : "55b92ad221e4b7c40f00004f",
                jobPosition    : "55b92acf21e4b7c40f00002e",
                department     : "55b92ace21e4b7c40f000014",
                visibility     : "Public",
                relatedUser    : "55ba00e9d79a3a343900000c",
                officeLocation : "",
                skype          : "almashij",
                workPhones     : {
                    phone : "",
                    mobile: "+380502215999"
                },
                personalEmail  : "shein_92@ukr.net",
                workEmail      : "vasiliy.almashiy@thinkmobiles.com",
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
                    last : "Almashiy",
                    first: "Vasiliy"
                },
                subject        : "",
                imageSrc       : "data:image/jpeg;base64,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",
                isEmployee     : true,
                __v            : 0,
                transfer       : [
                    {
                        date           : "2015-01-19T02:00:00.000Z",
                        isDeveloper    : false,
                        info           : "1200 грн",
                        salary         : 48,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004a",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "hired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2015-04-01T01:00:00.000Z",
                        isDeveloper    : false,
                        info           : "плюс %",
                        salary         : 200,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004a",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2015-12-01T02:00:00.000Z",
                        isDeveloper    : false,
                        info           : "плюс %",
                        salary         : 250,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004a",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2016-03-01T02:00:00.000Z",
                        isDeveloper    : false,
                        info           : "плюс %",
                        salary         : 450,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004a",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2016-04-01T01:00:00.000Z",
                        isDeveloper    : false,
                        info           : "плюс %",
                        salary         : 450,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004f",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    }
                ],
                weeklyScheduler: "57332c3b94ee1140b6bb49e2"
            }
        },
        {
            _id         : "5729a74ddce306912118af8c",
            workflow    : {
                _id         : "5555bf276a3f01acae0b5560",
                color       : "#2C3E50",
                name        : "Not Ordered",
                sequence    : 3,
                status      : "New",
                wId         : "Purchase Order",
                wName       : "order",
                source      : "purchase",
                targetSource: [
                    "quotation"
                ],
                visible     : true
            },
            paymentInfo : {
                total  : 1400000,
                unTaxed: 1400000,
                taxes  : 0
            },
            name        : "PO1029",
            orderDate   : "2016-05-03T22:00:00.000Z",
            project     : {
                _id             : "571789282c8b789c7a0bb82f",
                TargetEndDate   : "2016-05-19T22:00:00.000Z",
                StartDate       : null,
                description     : "AR/VR Store",
                budget          : {
                    bonus      : [],
                    projectTeam: [
                        "5723501ed4761c212289b7f2"
                    ]
                },
                bonus           : [],
                health          : 1,
                editedBy        : {
                    date: "2016-04-29T12:33:33.343Z",
                    user: "56d704f1805eb08d2b93d95f"
                },
                attachments     : [],
                notes           : [],
                projecttype     : ".net",
                createdBy       : {
                    date: "2016-04-20T13:50:32.223Z",
                    user: "56d704f1805eb08d2b93d95f"
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
                projectMembers  : [],
                projectmanager  : null,
                customer        : "5717873cc6efb4847a5bc78c",
                task            : [],
                projectName     : "Richline Jewelry",
                projectShortDesc: "AR/VR Store",
                __v             : 0,
                salesmanager    : "56029cc950de7f4138000005",
                EndDate         : null
            },
            supplier    : {
                _id           : "5717873cc6efb4847a5bc78c",
                companyInfo   : {
                    industry: null
                },
                editedBy      : {
                    date: "2016-04-20T13:42:20.311Z",
                    user: "56d704f1805eb08d2b93d95f"
                },
                createdBy     : {
                    date: "2016-04-20T13:42:20.311Z",
                    user: "56d704f1805eb08d2b93d95f"
                },
                history       : [],
                attachments   : [],
                notes         : [],
                groups        : {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [],
                    group: []
                },
                whoCanRW      : "everyOne",
                social        : {
                    LI: "https://www.linkedin.com/in/maryspio",
                    FB: ""
                },
                color         : "#4d5a75",
                salesPurchases: {
                    receiveMessages: 0,
                    language       : "English",
                    reference      : "",
                    active         : false,
                    implementedBy  : null,
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
                website       : "ceek.com",
                address       : {
                    country: "USA",
                    zip    : "",
                    state  : "",
                    city   : "Miami",
                    street : ""
                },
                timezone      : "UTC",
                department    : null,
                company       : null,
                email         : "support@ceek.com",
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name          : {
                    last : "",
                    first: "CEEK VR"
                },
                isOwn         : false,
                type          : "Company",
                __v           : 0
            },
            isOrder     : false,
            forSales    : true,
            currency    : {
                rate: 1,
                _id : "565eab29aeb95fa9c0f9df2d"
            },
            salesmanager: {
                _id            : "56029cc950de7f4138000005",
                dateBirth      : "1994-03-06T00:00:00.000Z",
                transferred    : [],
                lastFire       : null,
                fire           : [],
                hire           : [
                    "2015-09-22T21:00:00.000Z"
                ],
                social         : {
                    FB: "",
                    LI: ""
                },
                sequence       : 157,
                jobType        : "fullTime",
                gender         : "male",
                marital        : "unmarried",
                contractEnd    : {
                    date  : "2015-09-23T12:36:25.361Z",
                    reason: ""
                },
                attachments    : [],
                editedBy       : {
                    date: "2016-04-18T12:27:13.523Z",
                    user: "55ba2ef1d79a3a343900001c"
                },
                createdBy      : {
                    date: "2015-09-23T12:36:25.361Z",
                    user: "55ba28c8d79a3a3439000016"
                },
                creationDate   : "2015-09-23T12:36:25.360Z",
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
                source         : "www.rabota.ua",
                age            : 22,
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
                manager        : "55b92ad221e4b7c40f00004f",
                jobPosition    : "55b92acf21e4b7c40f00002e",
                department     : "55b92ace21e4b7c40f000014",
                visibility     : "Public",
                relatedUser    : "56d704f1805eb08d2b93d95f",
                officeLocation : "",
                skype          : "zhenyalendel",
                workPhones     : {
                    phone : "",
                    mobile: "+380950870448"
                },
                personalEmail  : "zhenyalendel13@gmail.com",
                workEmail      : "eugen.lendyel@thinkmobiles.com",
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
                    last : "Lendyel",
                    first: "Eugen"
                },
                subject        : "",
                imageSrc       : "data:image/jpeg;base64,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",
                isEmployee     : true,
                __v            : 0,
                transfer       : [
                    {
                        date           : "2015-09-23T01:00:00.000Z",
                        isDeveloper    : false,
                        info           : "2000 грн плюс %",
                        salary         : 76,
                        jobType        : "fullTime",
                        manager        : "55b92ad221e4b7c40f00004a",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "hired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2016-03-01T02:00:00.000Z",
                        isDeveloper    : false,
                        info           : "",
                        salary         : 250,
                        jobType        : "fullTime",
                        manager        : "55b92ad221e4b7c40f00004a",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2016-04-01T01:00:00.000Z",
                        isDeveloper    : false,
                        info           : "",
                        salary         : 250,
                        jobType        : "fullTime",
                        manager        : "55b92ad221e4b7c40f00004f",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2016-05-01T01:00:00.000Z",
                        isDeveloper    : false,
                        info           : "",
                        salary         : 200,
                        jobType        : "fullTime",
                        manager        : "55b92ad221e4b7c40f00004f",
                        jobPosition    : "55b92acf21e4b7c40f00002e",
                        department     : "55b92ace21e4b7c40f000014",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    }
                ],
                weeklyScheduler: "57332c3b94ee1140b6bb49e2"
            }
        }
    ];
    var fakeWorkflow = [
        {
            _id         : "55647b932e4aa3804a765ec5",
            name        : "Not Invoiced",
            sequence    : 3,
            status      : "New",
            wId         : "Sales Order",
            wName       : "order",
            source      : "purchase",
            targetSource: [
                "quotation"
            ],
            visible     : true,
            color       : "#2C3E50"
        }
    ];
    var fakeQuotationForm = {
        _id           : "56e7c1d6c64e96844ef3d6a6",
        expectedDate  : "2016-03-14T22:00:00.000Z",
        __v           : 0,
        editedBy      : {
            date: "2016-03-15T08:03:34.117Z",
            user: "56239e0ce9576d1728a9ed1d"
        },
        createdBy     : {
            date: "2016-03-15T08:03:34.117Z",
            user: "56239e0ce9576d1728a9ed1d"
        },
        creationDate  : "2016-03-15T08:03:34.117Z",
        groups        : {
            group: [],
            users: [],
            owner: {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            }
        },
        whoCanRW      : "everyOne",
        workflow      : {
            _id   : "5555bf276a3f01acae0b5560",
            name  : "Not Ordered",
            status: "New"
        },
        products      : [
            {
                unitPrice    : 1500,
                scheduledDate: "2016-03-15T00:00:00.000Z",
                taxes        : 0,
                subTotal     : 1500,
                jobs         : {
                    _id : "564cfdd06584412e618421c3",
                    name: "02.11-21.01"
                },
                description  : "",
                product      : {
                    _id : "5540d528dacb551c24000003",
                    name: "IT services"
                },
                quantity     : 409
            }
        ],
        paymentInfo   : {
            taxes  : 0,
            unTaxed: 1500,
            total  : 1500
        },
        paymentTerm   : null,
        invoiceRecived: false,
        invoiceControl: null,
        incoterm      : null,
        destination   : null,
        name          : "PO899",
        orderDate     : "2016-03-15T00:00:00.000Z",
        deliverTo     : {
            _id : "55543831d51bdef79ea0d58c",
            name: "YourCompany"
        },
        project       : {
            _id        : "563295f6c928c61d052d5003",
            projectName: "WordPress Sites"
        },
        supplier      : {
            _id     : "55cf4f834a91e37b0b000102",
            name    : {
                last : "",
                first: "SharperBuilds"
            },
            fullName: "SharperBuilds ",
            id      : "55cf4f834a91e37b0b000102"
        },
        isOrder       : false,
        type          : "Not Ordered",
        forSales      : true,
        currency      : {
            rate: 1,
            _id : {
                _id     : "565eab29aeb95fa9c0f9df2d",
                sequence: 0,
                name    : "USD"
            }
        }
    };
    var fakeCurrencies = {
        data: [
            {
                _id     : "565eab29aeb95fa9c0f9df2d",
                sequence: 0,
                name    : "USD"
            },
            {
                _id     : "565eab34aeb95fa9c0f9df2e",
                sequence: 1,
                name    : "EUR"
            },
            {
                _id     : "565eab3faeb95fa9c0f9df2f",
                sequence: 2,
                name    : "UAH"
            }
        ]
    };
    var quotationCollection;
    var view;
    var topBarView;
    var listView;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('SalesQuotationView', function () {
        var $fixture;
        var $elFixture;

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();

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

                view = new MainView({el: $elFixture, contentType: 'salesQuotations'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="62"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="62"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/salesQuotations');

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
                var quotationUrl = new RegExp('\/quotations\/list', 'i');

                server.respondWith('GET', quotationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeQuotation)]);
                quotationCollection = new QuotationCollection({
                    count      : 100,
                    viewType   : 'list',
                    contentType: 'salesQuotations'
                });
                server.respond();

                topBarView = new TopBarView({
                    collection: quotationCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
            });
        });

        describe('List View', function () {
            var server;
            var mainSpy;
            var clock;
            var $thisEl;
            var windowConfirmStub;
            var sortSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                sortSpy = sinon.spy(ListView.prototype, 'goSort');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                clock.restore();
                windowConfirmStub.restore();
                sortSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create listView', function (done) {
                    var quotationUrl = new RegExp('\/quotations\/list', 'i');
                    var workflowUrl = new RegExp('\/workflows\/fetch', 'i');

                    server.respondWith('GET', quotationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeQuotation)]);
                    server.respondWith('GET', workflowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWorkflow)]);
                    listView = new ListView({
                        collection: quotationCollection,
                        startTime : new Date()
                    });
                    server.respond();
                    server.respond();

                    clock.tick(100);

                    $thisEl = listView.$el;
                    expect($thisEl).to.exist;
                    expect($thisEl.find('#listTable > tr').lenght).to.be.not.equals(0);

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

                    quotationCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
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

                    server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([fakeQuotation[0], fakeQuotation[1]])]);
                    $selectedItem.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);

                    // select status
                    $status = $searchContainer.find('#workflowFullContainer > .groupName');
                    $status.click();
                    $selectedItem = $searchContainer.find('li[data-value="5555bf276a3f01acae0b5560"]');

                    server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([fakeQuotation[0]])]);
                    $selectedItem.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(1);

                    // uncheck status filter
                    server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([fakeQuotation[0], fakeQuotation[1]])]);
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

                    server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeQuotation)]);
                    $closeFilterBtn.click();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);
                });

                it('Try to sort list', function () {
                    var quotationUrl = new RegExp('\/quotations\/list', 'i');
                    var $thSortEl = listView.$el.find('table > thead > tr > th.oe_sortable');

                    sortSpy.reset();

                    server.respondWith('GET', quotationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([fakeQuotation[1], fakeQuotation[0]])]);
                    $thSortEl.click();
                    server.respond();
                    expect(sortSpy.called).to.be.true;
                    expect(listView.$el.find('tr:nth-child(1) > td.total').text()).to.be.equals('14 000.00');

                    server.respondWith('GET', quotationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeQuotation)]);
                    $thSortEl.click();
                    server.respond();
                    expect(sortSpy.called).to.be.true;
                    expect(listView.$el.find('tr:nth-child(1) > td.total').text()).to.be.equals('5 000.00');

                });

                it('Try to open CreateView', function () {
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');

                    $createBtn.click();
                    expect($('.ui-dialog')).to.exist;
                    $('.ui-dialog').remove();
                });

                it('Try to go to edit form with error response', function () {
                    var spyResponse;
                    var quotationFormUrl = new RegExp('\/quotations\/form\/', 'i');
                    var currencyUrl = new RegExp('\/currency\/getForDd', 'i');
                    var $needTd = listView.$el.find('tr:nth-child(1) > td:nth-child(3)');

                    server.respondWith('GET', quotationFormUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeQuotationForm)]);
                    $needTd.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please refresh browser');
                });

                it('Try to go to edit form', function () {
                    var quotationFormUrl = new RegExp('\/quotations\/form\/', 'i');
                    var currencyUrl = new RegExp('\/currency\/getForDd', 'i');
                    var $needTd = listView.$el.find('tr:nth-child(1) > td:nth-child(3)');

                    server.respondWith('GET', quotationFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeQuotationForm)]);
                    server.respondWith('GET', currencyUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCurrencies)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to change tabs', function () {
                    var $dialogEl = $('.ui-dialog');
                    var $firstTab = $dialogEl.find('ul.dialog-tabs > li:nth-child(1) > a');
                    var $secondTab = $dialogEl.find('ul.dialog-tabs > li:nth-child(2) > a');

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($dialogEl.find('ul.dialog-tabs > li:nth-child(2) > a')).to.have.class('active');

                    $firstTab.click();
                    expect($dialogEl.find('ul.dialog-tabs > li:nth-child(1) > a')).to.have.class('active');

                });

                it('Try to delete item', function () {
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var quotationUrl = new RegExp('\/quotations\/', 'i');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    $needCheckBox.click();

                    server.respondWith('DELETE', quotationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "success": {
                            "_id"           : "56e68fa4dd81ed4e426c60d1",
                            "expectedDate"  : "2016-03-13T22:00:00.000Z",
                            "__v"           : 0,
                            "editedBy"      : {
                                "date": "2016-03-14T10:17:08.480Z",
                                "user": "55ba0c01d79a3a3439000014"
                            },
                            "createdBy"     : {
                                "date": "2016-03-14T10:17:08.480Z",
                                "user": "55ba0c01d79a3a3439000014"
                            },
                            "creationDate"  : "2016-03-14T10:17:08.480Z",
                            "groups"        : {
                                "group": [],
                                "users": [],
                                "owner": "55ba28c8d79a3a3439000016"
                            },
                            "whoCanRW"      : "everyOne",
                            "workflow"      : "5555bf276a3f01acae0b5560",
                            "products"      : [{
                                "subTotal"     : 13500,
                                "taxes"        : 0,
                                "scheduledDate": "2016-03-14T00:00:00.000Z",
                                "unitPrice"    : 13500,
                                "jobs"         : "56dff02c425d4276052c23d3",
                                "description"  : "",
                                "product"      : "5540d528dacb551c24000003",
                                "quantity"     : 691
                            }],
                            "paymentInfo"   : {
                                "taxes"  : 0,
                                "unTaxed": 13500,
                                "total"  : 13500
                            },
                            "paymentTerm"   : null,
                            "invoiceRecived": false,
                            "invoiceControl": null,
                            "incoterm"      : null,
                            "destination"   : null,
                            "name"          : "PO887",
                            "orderDate"     : "2016-03-14T00:00:00.000Z",
                            "deliverTo"     : "55543831d51bdef79ea0d58c",
                            "project"       : "55cf36d54a91e37b0b0000c2",
                            "supplier"      : "55cf362b4a91e37b0b0000c1",
                            "isOrder"       : false,
                            "type"          : "Not Ordered",
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
            });
        });
    });

});
