define([
    'modules',
    'text!fixtures/index.html',
    'collections/wTrack/filterCollection',
    'views/main/MainView',
    'views/wTrack/list/ListView',
    'views/wTrack/TopBarView',
    'views/wTrack/CreateView',
    'views/wTrack/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules,
             fixtures,
             TCardCollection,
             MainView,
             ListView,
             TopBarView,
             CreateView,
             EditView,
             $,
             chai,
             chaiJquery,
             sinonChai) {
    'use strict';
    var expect;
    var fakeTCard = [
        {
            1         : 8,
            2         : 8,
            3         : 0,
            4         : 0,
            5         : 0,
            6         : 0,
            7         : 0,
            _id       : "573af6566601fa961ded80ef",
            worked    : 16,
            dateByWeek: 201620,
            year      : 2016,
            week      : 20,
            month     : 5,
            jobs      : {
                _id      : "573af6566601fa961ded80ee",
                reconcile: true,
                createdBy: {
                    date: "2016-05-17T10:45:42.313Z",
                    user: "55bf144765cda0810b000005"
                },
                editedBy : {
                    date: "2016-05-17T10:46:38.690Z",
                    user: "55bf144765cda0810b000005"
                },
                invoice  : "573af67f7254d5421eb9560e",
                quotation: "573af6620f6f25bd1e840c10",
                budget   : {
                    budgetTotal: {
                        minDate   : 201620,
                        maxDate   : 201620,
                        hoursSum  : 16,
                        revenueSum: 50000,
                        costSum   : 0
                    },
                    projectTeam: [
                        {
                            budget    : {
                                hoursSum  : 16,
                                revenueSum: 50000,
                                costSum   : 0
                            },
                            employee  : {
                                name       : {
                                    first: "Alex",
                                    last : "Gleba"
                                },
                                jobPosition: {
                                    name: "Middle iOS",
                                    _id : "55b92acf21e4b7c40f00001d"
                                },
                                _id        : "55b92ad221e4b7c40f000031"
                            },
                            department: {
                                departmentName: "iOS",
                                _id           : "55b92ace21e4b7c40f00000f"
                            }
                        }
                    ]
                },
                project  : "573ad86f774df2256266159f",
                wTracks  : [
                    "573af6566601fa961ded80ef"
                ],
                type     : "Invoiced",
                workflow : "56337c675d49d8d6537832ea",
                name     : "test3",
                __v      : 0
            },
            createdBy : {
                date: "2016-05-17T10:45:42.385Z",
                user: "55bf144765cda0810b000005"
            },
            isPaid    : false,
            amount    : 0,
            cost      : 0,
            revenue   : 50000,
            _type     : "ordinary",
            department: {
                _id              : "55b92ace21e4b7c40f00000f",
                ID               : 1,
                sequence         : 3,
                nestingLevel     : 1,
                editedBy         : {
                    date: "2016-02-25T08:41:05.787Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy        : {
                    date: "2015-07-29T19:34:38.907Z",
                    user: "52203e707d4dba8813000003"
                },
                users            : [],
                departmentManager: null,
                parentDepartment : "56cebdf6541812c07197358f",
                departmentName   : "iOS",
                __v              : 0,
                isDevelopment    : true
            },
            employee  : {
                _id            : "55b92ad221e4b7c40f000031",
                dateBirth      : "1995-01-21T09:00:00.000Z",
                ID             : 6,
                isLead         : 2,
                fire           : [],
                hire           : [
                    "2014-03-02T22:00:00.000Z"
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
                    date  : "2015-07-29T19:34:42.407Z",
                    reason: ""
                },
                attachments    : [],
                editedBy       : {
                    date: "2016-04-12T15:37:08.949Z",
                    user: "55ba2ef1d79a3a343900001c"
                },
                createdBy      : {
                    date: "2015-07-29T19:34:42.407Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate   : "2015-07-29T19:34:42.407Z",
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
                age            : 21,
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
                manager        : "55b92ad221e4b7c40f000059",
                jobPosition    : "55b92acf21e4b7c40f00001d",
                department     : "55b92ace21e4b7c40f00000f",
                visibility     : "Public",
                relatedUser    : null,
                officeLocation : "",
                skype          : "sasha.hleba",
                workPhones     : {
                    phone : "",
                    mobile: "+380505192679"
                },
                personalEmail  : "eddy2195@gmail.com",
                workEmail      : "alex.gleba@thinkmobiles.com",
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
                    last : "Gleba",
                    first: "Alex"
                },
                subject        : "",
                imageSrc       : "data:image/jpeg;base64,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",
                isEmployee     : true,
                __v            : 0,
                transfer       : [
                    {
                        isDeveloper    : false,
                        date           : "2014-03-03T02:00:00.000Z",
                        info           : "півставки",
                        salary         : 350,
                        jobType        : "Part-time",
                        manager        : "55b92ad221e4b7c40f000059",
                        jobPosition    : "55b92acf21e4b7c40f00002c",
                        department     : "55b92ace21e4b7c40f00000f",
                        status         : "hired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        isDeveloper    : false,
                        date           : "2014-09-01T01:00:00.000Z",
                        info           : "",
                        salary         : 450,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f000059",
                        jobPosition    : "55b92acf21e4b7c40f00002c",
                        department     : "55b92ace21e4b7c40f00000f",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        isDeveloper    : false,
                        date           : "2014-12-01T02:00:00.000Z",
                        info           : "",
                        salary         : 600,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f000059",
                        jobPosition    : "55b92acf21e4b7c40f00001d",
                        department     : "55b92ace21e4b7c40f00000f",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        isDeveloper    : false,
                        date           : "2015-11-01T02:00:00.000Z",
                        info           : "",
                        salary         : 700,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f000059",
                        jobPosition    : "55b92acf21e4b7c40f00001d",
                        department     : "55b92ace21e4b7c40f00000f",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        isDeveloper    : false,
                        date           : "2016-04-01T01:00:00.000Z",
                        info           : "",
                        salary         : 800,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f000059",
                        jobPosition    : "55b92acf21e4b7c40f00001d",
                        department     : "55b92ace21e4b7c40f00000f",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    }
                ],
                weeklyScheduler: "57332c3b94ee1140b6bb49e2"
            },
            project   : {
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
            customer  : {
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
            }
        },
        {
            1         : 8,
            2         : 8,
            3         : 8,
            4         : 8,
            5         : 0,
            6         : 0,
            7         : 0,
            _id       : "573ae076d0501dc2618f18a9",
            worked    : 32,
            dateByWeek: 201621,
            year      : 2016,
            week      : 21,
            month     : 5,
            jobs      : {
                _id      : "573ae076d0501dc2618f18a6",
                reconcile: true,
                createdBy: {
                    date: "2016-05-17T09:12:22.027Z",
                    user: "55bf144765cda0810b000005"
                },
                editedBy : {
                    date: "2016-05-17T10:46:23.536Z",
                    user: "55bf144765cda0810b000005"
                },
                invoice  : null,
                quotation: null,
                budget   : {
                    budgetTotal: {
                        minDate   : 201619,
                        maxDate   : 201621,
                        hoursSum  : 104,
                        revenueSum: 0,
                        costSum   : 0
                    },
                    projectTeam: [
                        {
                            budget    : {
                                hoursSum  : 104,
                                revenueSum: 0,
                                costSum   : 0
                            },
                            employee  : {
                                name       : {
                                    first: "Alex",
                                    last : "Ryabcev"
                                },
                                jobPosition: {
                                    name: "Middle Android",
                                    _id : "55b92acf21e4b7c40f000022"
                                },
                                _id        : "55b92ad221e4b7c40f0000a7"
                            },
                            department: {
                                departmentName: "Android",
                                _id           : "55b92ace21e4b7c40f000010"
                            }
                        }
                    ]
                },
                project  : "573ad86f774df2256266159f",
                wTracks  : [
                    "573ae076d0501dc2618f18a9",
                    "573ae076d0501dc2618f18a8",
                    "573ae076d0501dc2618f18a7"
                ],
                type     : "Ordered",
                workflow : "56337c705d49d8d6537832eb",
                name     : "test2",
                __v      : 0
            },
            createdBy : {
                date: "2016-05-17T09:12:22.086Z",
                user: "55bf144765cda0810b000005"
            },
            isPaid    : false,
            amount    : 0,
            cost      : 0,
            revenue   : 0,
            _type     : "ordinary",
            department: {
                _id              : "55b92ace21e4b7c40f000010",
                ID               : 2,
                sequence         : 4,
                nestingLevel     : 1,
                editedBy         : {
                    date: "2016-02-25T08:41:11.006Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy        : {
                    date: "2015-07-29T19:34:38.908Z",
                    user: "52203e707d4dba8813000003"
                },
                users            : [],
                departmentManager: null,
                parentDepartment : "56cebdf6541812c07197358f",
                departmentName   : "Android",
                __v              : 0,
                isDevelopment    : true
            },
            employee  : {
                _id            : "55b92ad221e4b7c40f0000a7",
                dateBirth      : "1987-02-06T02:00:00.000Z",
                ID             : 3155,
                isLead         : 1,
                fire           : [],
                hire           : [
                    "2015-06-30T21:00:00.000Z"
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
                    date  : "2015-07-29T19:34:42.628Z",
                    reason: ""
                },
                attachments    : [],
                editedBy       : {
                    date: "2016-04-06T07:32:04.658Z",
                    user: "55ba2ef1d79a3a343900001c"
                },
                createdBy      : {
                    date: "2015-07-29T19:34:42.628Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate   : "2015-07-29T19:34:42.628Z",
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
                age            : 29,
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
                manager        : "55b92ad221e4b7c40f00004e",
                jobPosition    : "55b92acf21e4b7c40f000022",
                department     : "55b92ace21e4b7c40f000010",
                visibility     : "Public",
                relatedUser    : null,
                officeLocation : "",
                skype          : "vvkesedi",
                workPhones     : {
                    phone : "",
                    mobile: "+380675626258"
                },
                personalEmail  : "",
                workEmail      : "alex.ryabcev@thinkmobiles.com",
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
                    last : "Ryabcev",
                    first: "Alex"
                },
                subject        : "",
                imageSrc       : "data:image/jpeg;base64,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",
                isEmployee     : true,
                __v            : 0,
                transfer       : [
                    {
                        date           : "2015-07-01T01:00:00.000Z",
                        isDeveloper    : true,
                        info           : "",
                        salary         : 1000,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004e",
                        jobPosition    : "55b92acf21e4b7c40f000022",
                        department     : "55b92ace21e4b7c40f000010",
                        status         : "hired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2015-09-01T01:00:00.000Z",
                        isDeveloper    : true,
                        info           : "",
                        salary         : 1200,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004e",
                        jobPosition    : "55b92acf21e4b7c40f000022",
                        department     : "55b92ace21e4b7c40f000010",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2015-12-01T02:00:00.000Z",
                        isDeveloper    : true,
                        info           : "",
                        salary         : 1300,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004e",
                        jobPosition    : "55b92acf21e4b7c40f000022",
                        department     : "55b92ace21e4b7c40f000010",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date           : "2016-04-01T01:00:00.000Z",
                        isDeveloper    : true,
                        info           : "",
                        salary         : 1500,
                        jobType        : "Full-time",
                        manager        : "55b92ad221e4b7c40f00004e",
                        jobPosition    : "55b92acf21e4b7c40f000022",
                        department     : "55b92ace21e4b7c40f000010",
                        status         : "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    }
                ],
                weeklyScheduler: "57332c3b94ee1140b6bb49e2"
            },
            project   : {
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
            customer  : {
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
            }
        }
    ];
    var fakeProjectForWTrack = {
        data: [
            {
                _id             : "56e689c75ec71b00429745a9",
                TargetEndDate   : "2016-03-31T00:00:00.000Z",
                StartDate       : "2016-03-13T22:00:00.000Z",
                budget          : {
                    projectTeam: [
                        "56e6f1ae0d773c634e918b68"
                    ],
                    bonus      : []
                },
                bonus           : [],
                health          : 1,
                editedBy        : {
                    date: "2016-03-14T16:19:02.059Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                attachments     : [],
                notes           : [],
                projecttype     : "iOs",
                createdBy       : {
                    date: "2016-03-14T09:52:07.280Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                progress        : 0,
                remaining       : 0,
                logged          : 0,
                estimated       : 0,
                workflow        : {
                    _id : "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent          : null,
                sequence        : 0,
                groups          : {
                    owner: "560c099da5d4a2e20ba5068b",
                    users: [],
                    group: []
                },
                whoCanRW        : "everyOne",
                projectmanager  : {
                    _id : "55b92ad221e4b7c40f00005f",
                    name: {
                        last : "Voloshchuk",
                        first: "Peter"
                    }
                },
                customer        : {
                    _id : "56a9eeabd59a04d6225b0df5",
                    name: {
                        last : "Voloshchuk",
                        first: "Peter"
                    }
                },
                task            : [],
                projectName     : "360CamSDK",
                projectShortDesc: "SDK",
                __v             : 0,
                EndDate         : "2016-03-24T22:00:00.000Z"
            },
            {
                _id             : "569f60d162d172544baf0d58",
                StartDate       : "2015-11-30T22:00:00.000Z",
                budget          : {
                    bonus      : [],
                    projectTeam: [
                        "56cf1b6e541812c071973595",
                        "56c599c7d2b48ede4ba4224b",
                        "56e291d1896e98a661aa831c",
                        "56b4be1799ce8d706a81b2e0",
                        "569f624a62d172544baf0d5c"
                    ]
                },
                bonus           : [],
                health          : 1,
                editedBy        : {
                    date: "2016-03-16T10:35:13.214Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                attachments     : [],
                notes           : [],
                projecttype     : "",
                createdBy       : {
                    date: "2016-01-20T10:26:25.668Z",
                    user: "561e37f7d6c741e8235f42cb"
                },
                progress        : 0,
                remaining       : 0,
                logged          : 0,
                estimated       : 0,
                workflow        : {
                    _id : "528ce7f2f3f67bc40b000023",
                    name: "In Progress"
                },
                parent          : null,
                sequence        : 0,
                groups          : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW        : "everyOne",
                projectmanager  : {
                    _id : "561ba8639ebb48212ea838c4",
                    name: {
                        last : "Yartysh",
                        first: "Nataliya"
                    }
                },
                customer        : {
                    _id : "569f603762d172544baf0d57",
                    name: {
                        last : "Nahum",
                        first: "Nimrod"
                    }
                },
                task            : [],
                projectName     : "Android advertisement",
                projectShortDesc: "Supportment of app",
                __v             : 0,
                EndDate         : "2016-03-30T21:00:00.000Z",
                TargetEndDate   : "",
                description     : ""
            }
        ]
    };
    var fakeEmployee = {
        data: [
            {
                _id       : "55b92ad221e4b7c40f000030",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    first: "Alex",
                    last : "Svatuk"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000031",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Gleba",
                    first: "Alex"
                }
            }
        ]
    };
    var fakeJobsWithId = [
        {
            _id   : "56e6f1ae0d773c634e918b68",
            budget: {
                budgetTotal  : {
                    profitSum  : 0,
                    costSum    : 0,
                    revenueSum : 0,
                    hoursSum   : 76,
                    revenueByQA: 0,
                    hoursByQA  : 0,
                    maxDate    : 201612,
                    minDate    : 201611
                },
                budget       : [
                    {
                        profit : 0,
                        cost   : 0,
                        hours  : 64,
                        revenue: 0
                    },
                    {
                        profit : 0,
                        cost   : 0,
                        hours  : 12,
                        revenue: 0
                    }
                ],
                projectValues: [],
                projectTeam  : [
                    {
                        _id        : "55b92ad221e4b7c40f00007d",
                        jobPosition: {
                            _id : "55b92acf21e4b7c40f00001d",
                            name: "Middle iOS"
                        },
                        department : {
                            _id           : "55b92ace21e4b7c40f00000f",
                            departmentName: "iOS"
                        },
                        name       : {
                            last : "Volskiy",
                            first: "Stas"
                        }
                    },
                    {
                        _id        : "55b92ad221e4b7c40f000085",
                        jobPosition: {
                            _id : "55b92acf21e4b7c40f00001d",
                            name: "Middle iOS"
                        },
                        department : {
                            _id           : "55b92ace21e4b7c40f00000f",
                            departmentName: "iOS"
                        },
                        name       : {
                            last : "Gorbushko",
                            first: "Kirill"
                        }
                    }
                ]
            },
            name  : "March"
        }
    ];
    var tCardCollection;
    var view;
    var topBarView;
    var listView;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('tCardView', function () {
        var $fixture;
        var $elFixture;

        after(function () {
            view.remove();
            listView.remove();
            topBarView.remove();

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
                view = new MainView({el: $elFixture, contentType: 'wTrack'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');
                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="75"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="75"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/wTrack');

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

            it('Try to fetch collection with error', function () {
                var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                server.respondWith('GET', tCardUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeTCard)]);

                tCardCollection = new TCardCollection({
                    contentType: 'wTrack',
                    viewType   : 'list'
                });
                server.respond();
            });

            it('Try to create TopBarView', function () {
                var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                server.respondWith('GET', tCardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTCard)]);

                tCardCollection = new TCardCollection({
                    contentType: 'wTrack',
                    viewType   : 'list'
                });
                server.respond();

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: tCardCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Time Card');
            });

        });

        describe('tCardView', function () {
            var server;
            var windowConfirmStub;
            var mainSpy;
            var clock;
            var deleteSpy;
            var saveSpy;

            before(function () {
                App.startPreload = function () {
                    App.preloaderShowFlag = true;
                    $('#loading').show();
                };

                App.stopPreload = function () {
                    App.preloaderShowFlag = false;
                    $('#loading').hide();
                };

                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                deleteSpy = sinon.spy(ListView.prototype, 'deleteItems');
                saveSpy = sinon.spy(ListView.prototype, 'saveItem');
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                mainSpy.restore();
                clock.restore();
                deleteSpy.restore();
                saveSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create ListView', function (done) {
                    var $listHolder;
                    var projectsUrl = new RegExp('\/project\/getForWtrack', 'i');
                    var employeeUrl = new RegExp('\/employees\/getForDD', 'i');
                    var depsUrl = new RegExp('\/departments\/getForDD', 'i');
                    var tCardTotal = new RegExp('\/wTrack\/totalCollectionLength', 'i');
                    var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                    server.respondWith('GET', projectsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProjectForWTrack)]);
                    server.respondWith('GET', employeeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployee)]);
                    server.respondWith('GET', depsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployee)]);
                    server.respondWith('GET', tCardTotal, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count: 2
                    })]);
                    server.respondWith('GET', tCardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTCard)]);
                    listView = new ListView({
                        startTime : new Date(),
                        collection: tCardCollection,
                        page      : 1

                    });
                    server.respond();
                    server.respond();
                    server.respond();
                    server.respond();
                    server.respond();

                    clock.tick(200);

                    $listHolder = listView.$el;

                    expect($listHolder.find('table')).to.exist;
                    expect()

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

                    tCardCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try to delete item with 403 error', function () {
                    var spyResponse;
                    var $needCheckBtn = listView.$el.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');

                    $needCheckBtn.click();

                    server.respondWith('DELETE', wTrackUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'You do not have permission to perform this action');
                    expect(deleteSpy.calledOnce).to.be.true;
                });

                it('Try to delete item', function () {
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');

                    server.respondWith('DELETE', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteSpy.calledTwice).to.be.true;
                });

                it('Try to go sort', function () {
                    var $sortEl = listView.$el.find('th[data-sort="project.projectName"]');
                    var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                    server.respondWith('GET', tCardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTCard)]);
                    $sortEl.click();
                    server.respond();
                    expect(listView.$el.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('573af6566601fa961ded80ef');

                    server.respondWith('GET', tCardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([fakeTCard[1], fakeTCard[0]])]);
                    $sortEl.click();
                    server.respond();
                    expect(listView.$el.find('#listTable > tr:nth-child(1)').attr('data-id')).to.be.equals('573ae076d0501dc2618f18a9');

                });

                it('Try to showMore tCard with error response', function () {
                    var spyResponse;
                    var $pageList = listView.$el.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                    server.respondWith('GET', tCardUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeTCard)]);
                    $needBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Some Error.');
                });

                it('Try to showMore tCard', function () {
                    var $pageList = listView.$el.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var tCardUrl = new RegExp('\/wTrack\/list', 'i');

                    server.respondWith('GET', tCardUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTCard)]);
                    $needBtn.click();
                    server.respond();
                    expect(listView.$el.find('#listTable > tr').length).to.be.equals(2);
                });

                it('Try to check|uncheck all checkboxes', function () {
                    var $checkAllBtn = listView.$el.find('#check_all');

                    $checkAllBtn.click();
                    expect(listView.$el.find('input[type="checkbox"]').prop('checked')).to.be.true;

                    $checkAllBtn.click();

                });

                it('Try to create item', function () {
                    var $projectBtn;
                    var $employeeBtn;
                    var $select;
                    var $sprintBtn;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var jobUrl = new RegExp('\/jobs\/getForDD', 'i');
                    var wTrackUrl = '/wTrack/';

                    $createBtn.click();

                    $projectBtn = listView.$el.find('#listTable > tr.false > td:nth-child(5)');
                    $projectBtn.click();
                    $select = listView.$el.find('#56e689c75ec71b00429745a9');
                    $select.click();

                    $employeeBtn = listView.$el.find('#listTable > tr.false > td:nth-child(8)');
                    $employeeBtn.click();
                    $select = listView.$el.find('#55b92ad221e4b7c40f000030');
                    $select.click();

                    /*$sprintBtn = listView.$el.find('#listTable > tr.false > td:nth-child(3)');
                     server.respondWith('GET', jobUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJobsWithId)]);
                     $sprintBtn.click();
                     server.respond();

                     $select = listView.$el.find('#56e6f1ae0d773c634e918b68');
                     $select.click();*/

                    $sprintBtn = listView.$el.find('#listTable > tr.false > td:nth-child(3)');
                    $sprintBtn.removeClass(' errorContent');
                    $sprintBtn.text('March');

                    server.respondWith('POST', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({id: '56f9172a160c8d6315f0862f'})]);
                    $saveBtn.click();
                    server.respond();

                    expect(saveSpy.calledOnce).to.be.true;
                });

                it('Try to copy tCard row', function () {
                    var $copyBtn;
                    var $needCheckBox = listView.$el.find('#listTable > tr:nth-child(2) > td.notForm > input');

                    $needCheckBox.click();
                    $copyBtn = topBarView.$el.find('#top-bar-copyBtn');
                    $copyBtn.click();

                    expect(listView.$el.find('#listTable > tr').length).to.be.equals(4);
                });

                it('Try to delete item with changes ', function () {
                    var $needCheckBtn = listView.$el.find('#listTable > tr:nth-child(2) > td.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var wTrackUrl = new RegExp('\/wTrack\/', 'i');

                    $needCheckBtn.click();

                    server.respondWith('DELETE', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    //expect(listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(4)').text().trim()).to.be.equals('Eugen Lendyel')
                });

                it('Try to edit wTrack', function () {
                    var $selectedItem;
                    var $input;
                    var $yearBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="year"]');
                    var $jobsBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="jobs"]');
                    var $monthBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="month"]');
                    var $weekBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="week"]');
                    var $mondayBtn = listView.$el.find('#listTable > tr:nth-child(2) > td[data-content="1"]');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var jobsUrl = new RegExp('/jobs/getForDD', 'i');
                    var wTrackUrl = '/wTrack/';
                    var keyDownEvent = $.Event('keydown');
                    var keyUpEvent = $.Event('keyup');

                    // change year
                    $yearBtn.click();
                    $selectedItem = $yearBtn.find('.newSelectList > li:nth-child(1)');
                    $selectedItem.click();

                    // change month
                    $monthBtn.click();
                    $input = $mondayBtn.find('input');
                    $input.trigger(keyDownEvent);
                    $input.trigger(keyUpEvent);
                    $input.val('12');
                    $input.trigger('change');

                    // change job
                    server.respondWith('GET', jobsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJobsWithId)]);
                    $jobsBtn.click();
                    server.respond();

                    // chang week
                    $weekBtn.click();
                    $selectedItem = $weekBtn.find('.newSelectList > li:nth-child(1)');
                    $selectedItem.click();

                    // change monday hours
                    $mondayBtn.click();
                    $input = $mondayBtn.find('input');
                    $input.val('10');
                    $input.trigger('change');

                    server.respondWith('PATCH', wTrackUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();
                });
            });
        });
    });
});
