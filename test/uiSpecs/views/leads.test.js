define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/Leads/filterCollection',
    'views/main/MainView',
    'views/Leads/TopBarView',
    'views/Leads/CreateView',
    'views/Leads/EditView',
    'views/Leads/form/FormView',
    'views/Leads/list/ListView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'filterTest'
], function (Backbone,
             modules,
             fixtures,
             LeadsCollection,
             MainView,
             TopBarView,
             CreateView,
             EditView,
             FormView,
             ListView,
             eventsBinder,
             $,
             chai,
             chaiJquery,
             sinonChai,
             FilterTest) {
    'use strict';

    var expect;
    var fakeLeads = {
        total: 300,
        data : [
            {
                _id        : "573ed9d5f38fc00657e4f4a7",
                total      : 164,
                contactName: "Olivia ORiordan",
                salesPerson: {
                    _id : "55b92ad221e4b7c40f0000a0",
                    name: {
                        last : "Bilak",
                        first: "Ivan"
                    }
                },
                workflow   : {
                    _id   : "528ce79bf3f67bc40b000020",
                    name  : "Cancelled",
                    status: "Cancelled"
                },
                createdBy  : {
                    user: "alina.slavska",
                    date: "2016-05-20T09:33:09.203Z"
                },
                name       : "mobile deveoper",
                source     : null,
                address    : {
                    country: "Canada"
                }
            },
            {
                _id        : "57440ec86b3b137a678462a0",
                total      : 164,
                contactName: "Jukka Salmenkyla",
                salesPerson: {
                    _id : "55b92ad221e4b7c40f0000a0",
                    name: {
                        last : "Bilak",
                        first: "Ivan"
                    }
                },
                workflow   : {
                    _id   : "528ce74ef3f67bc40b00001e",
                    name  : "Draft",
                    status: "New"
                },
                createdBy  : {
                    user: "bohdana.stets",
                    date: "2016-05-24T08:20:24.790Z"
                },
                name       : "Interested in mobile analytics",
                source     : null,
                address    : {
                    country: "Finland"
                }
            },
            {
                _id        : "56dd4e7b42b170aa130a6ed4",
                total      : 164,
                contactName: "Maricruz Vicente",
                salesPerson: {
                    _id : "561ba8639ebb48212ea838c4",
                    name: {
                        last : "Yartysh",
                        first: "Nataliya"
                    }
                },
                workflow   : {
                    _id   : "528ce79bf3f67bc40b000020",
                    name  : "Cancelled",
                    status: "Cancelled"
                },
                createdBy  : {
                    user: "andriy.merentsov",
                    date: "2016-03-07T09:48:43.690Z"
                },
                name       : "Mobility testing services",
                source     : null,
                address    : {
                    country: "USA"
                }
            }
        ]
    };
    var fakeUsersForDD = {
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
                _id  : "569f5d8c62d172544baf0d52",
                login: "alona.yelahina"
            },
            {
                _id  : "56bda2e0dfd8a81466e2f4e2",
                login: "andriy.hanchak"
            },
            {
                _id  : "563b58c2ab9698be7c9df6b6",
                login: "gabriella.shterr"
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
                _id  : "561e37f7d6c741e8235f42cb",
                login: "natalia.yartysh"
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
                _id  : "55b9dd237a3632120b000005",
                login: "roland.katona"
            },
            {
                _id  : "56a72af2aa157ca50f21fb20",
                login: "roman.kubichka"
            },
            {
                _id  : "56a72cafaa157ca50f21fb22",
                login: "stanislav.romanyuk"
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
                _id  : "55bf144765cda0810b000005",
                login: "yana.gusti"
            },
            {
                _id  : "560255d1638625cf32000005",
                login: "yevgenia.bezyk"
            }
        ]
    };
    var fakeWorkflowsForDD = {
        data: [
            {
                _id  : "528ce74ef3f67bc40b00001e",
                name : "Draft",
                wName: "lead"
            },
            {
                _id  : "52b4265cc033b7e25ac4f91c",
                name : "Open",
                wName: "lead"
            },
            {
                _id  : "528ce779f3f67bc40b00001f",
                name : "In Progress",
                wName: "lead"
            },
            {
                _id  : "52b426b7c033b7e25ac4f91d",
                name : "Closed",
                wName: "lead"
            },
            {
                _id  : "528ce79bf3f67bc40b000020",
                name : "Cancelled",
                wName: "lead"
            }
        ]
    };
    var fakeEmplSources = {
        data: [
            {
                _id     : "Outbound",
                name    : "Outbound",
                sequence: 0,
                __v     : 0
            },
            {
                _id     : "Web Organic",
                name    : "Web Organic",
                sequence: 2,
                __v     : 0
            },
            {
                _id     : "Web referral",
                name    : "Web referral",
                sequence: 3,
                __v     : 0
            },
            {
                _id     : "Nets",
                name    : "Nets",
                sequence: 4,
                __v     : 0
            },
            {
                _id     : "Partners",
                name    : "Partners",
                sequence: 5,
                __v     : 0
            },
            {
                _id     : "Offline Meetings",
                name    : "Offline Meetings",
                sequence: 1,
                __v     : 0
            }
        ]
    };
    var fakeCampaigns = {
        data: [
            {
                _id : "cpc",
                __v : 0,
                name: "cpc"
            },
            {
                _id        : "email",
                attachments: [],
                name       : "Email"
            },
            {
                _id        : "newsletter",
                attachments: [],
                name       : "Newsletter"
            },
            {
                _id        : "telesales",
                attachments: [],
                name       : "Telesales"
            },
            {
                _id : "testmain",
                __v : 0,
                name: "testmain"
            },
            {
                _id        : "web",
                attachments: [],
                name       : "Web"
            }
        ]
    };
    var fakeCustomers = {
        data: [{
            _id           : "55b92ad521e4b7c40f00060e",
            ID            : 11,
            __v           : 0,
            companyInfo   : {
                size    : null,
                industry: null
            },
            editedBy      : {
                date: "2015-07-29T19:34:45.991Z",
                user: "52203e707d4dba8813000003"
            },
            createdBy     : {
                date: "2015-07-29T19:34:45.991Z",
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
                country: "USA",
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
                first: "Pekaboo/D.Kaufman"
            },
            isOwn         : false,
            type          : "Person",
            fullName      : "Pekaboo/D.Kaufman ",
            id            : "55b92ad521e4b7c40f00060e"
        },
            {
                _id           : "55b92ad521e4b7c40f00060f",
                ID            : 16,
                __v           : 0,
                companyInfo   : {
                    size    : null,
                    industry: null
                },
                editedBy      : {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy     : {
                    date: "2015-07-29T19:34:45.991Z",
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
                    country: "Singapore",
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
                    first: "Sharmila"
                },
                isOwn         : false,
                type          : "Person",
                fullName      : "Sharmila ",
                id            : "55b92ad521e4b7c40f00060f"
            },
            {
                _id           : "55b92ad521e4b7c40f000610",
                ID            : 21,
                __v           : 0,
                companyInfo   : {
                    size    : null,
                    industry: null
                },
                editedBy      : {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy     : {
                    date: "2015-07-29T19:34:45.991Z",
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
                    first: "Norbert"
                },
                isOwn         : false,
                type          : "Person",
                fullName      : "Norbert ",
                id            : "55b92ad521e4b7c40f000610"
            }
        ]
    };
    var fakeRelatedUser = {
        data: [
            {
                _id     : "55b92ad221e4b7c40f00004f",
                name    : {
                    last : "Sokhanych",
                    first: "Alex"
                },
                fullName: "Alex Sokhanych",
                id      : "55b92ad221e4b7c40f00004f"
            }
        ]
    };
    var fakeCustomerId = {
        data: [
            {
                _id           : "55b92ad521e4b7c40f00060e",
                ID            : 11,
                __v           : 0,
                companyInfo   : {
                    size    : null,
                    industry: null
                },
                editedBy      : {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy     : {
                    date: "2015-07-29T19:34:45.991Z",
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
                    country: "USA",
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
                    first: "Pekaboo/D.Kaufman"
                },
                isOwn         : false,
                type          : "Person",
                fullName      : "Pekaboo/D.Kaufman ",
                id            : "55b92ad521e4b7c40f00060e"
            },
            {
                _id           : "55b92ad521e4b7c40f00060f",
                ID            : 16,
                __v           : 0,
                companyInfo   : {
                    size    : null,
                    industry: null
                },
                editedBy      : {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy     : {
                    date: "2015-07-29T19:34:45.991Z",
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
                    country: "Singapore",
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
                    first: "Sharmila"
                },
                isOwn         : false,
                type          : "Person",
                fullName      : "Sharmila ",
                id            : "55b92ad521e4b7c40f00060f"
            },
            {
                _id           : "55b92ad521e4b7c40f000610",
                ID            : 21,
                __v           : 0,
                companyInfo   : {
                    size    : null,
                    industry: null
                },
                editedBy      : {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy     : {
                    date: "2015-07-29T19:34:45.991Z",
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
                    first: "Norbert"
                },
                isOwn         : false,
                type          : "Person",
                fullName      : "Norbert ",
                id            : "55b92ad521e4b7c40f000610"
            }
        ]
    };
    var fakeCustomerIdCompany = {
        data: [
            {
                _id           : "55b92ad521e4b7c40f00060e",
                ID            : 11,
                __v           : 0,
                companyInfo   : {
                    size    : null,
                    industry: null
                },
                editedBy      : {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy     : {
                    date: "2015-07-29T19:34:45.991Z",
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
                    country: "USA",
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
                    first: "Pekaboo/D.Kaufman"
                },
                isOwn         : false,
                type          : "Company",
                fullName      : "Pekaboo/D.Kaufman ",
                id            : "55b92ad521e4b7c40f00060e"
            },
            {
                _id           : "55b92ad521e4b7c40f00060f",
                ID            : 16,
                __v           : 0,
                companyInfo   : {
                    size    : null,
                    industry: null
                },
                editedBy      : {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy     : {
                    date: "2015-07-29T19:34:45.991Z",
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
                    country: "Singapore",
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
                    first: "Sharmila"
                },
                isOwn         : false,
                type          : "Company",
                fullName      : "Sharmila ",
                id            : "55b92ad521e4b7c40f00060f"
            },
            {
                _id           : "55b92ad521e4b7c40f000610",
                ID            : 21,
                __v           : 0,
                companyInfo   : {
                    size    : null,
                    industry: null
                },
                editedBy      : {
                    date: "2015-07-29T19:34:45.991Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy     : {
                    date: "2015-07-29T19:34:45.991Z",
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
                    first: "Norbert"
                },
                isOwn         : false,
                type          : "Person",
                fullName      : "Norbert ",
                id            : "55b92ad521e4b7c40f000610"
            }
        ]
    };
    var fakeLeadId = {
        _id             : "573ed9d5f38fc00657e4f4a7",
        skype           : "",
        social          : {
            LI: "",
            FB: ""
        },
        attachments     : [],
        notes           : [],
        source          : null,
        campaign        : "",
        editedBy        : {
            date: "2016-06-06T06:12:16.313Z",
            user: {
                _id  : "573b161eb3beef0e61032fd9",
                login: "alina.slavska"
            }
        },
        createdBy       : {
            date: "2016-05-20T09:33:09.203Z",
            user: {
                _id  : "573b161eb3beef0e61032fd9",
                login: "alina.slavska"
            }
        },
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
            _id : "528ce79bf3f67bc40b000020",
            name: "Cancelled"
        },
        priority        : "Trivial",
        expectedClosing : null,
        nextAction      : {
            date: "2016-05-20T09:33:09.203Z",
            desc: ""
        },
        internalNotes   : "шукають mobile dev call today 5 pm",
        salesPerson     : {
            _id     : "55b92ad221e4b7c40f0000a0",
            name    : {
                last : "Bilak",
                first: "Ivan"
            },
            fullName: "Ivan Bilak",
            id      : "55b92ad221e4b7c40f0000a0"
        },
        phones          : {
            fax   : "",
            phone : "",
            mobile: ""
        },
        email           : "olivia@tophatmonocle.com",
        contactName     : {
            last : "ORiordan",
            first: "Olivia"
        },
        address         : {
            country: "Canada",
            zip    : "",
            state  : "",
            city   : "",
            street : ""
        },
        customer        : null,
        company         : null,
        tempCompanyField: "Top Hat",
        expectedRevenue : {
            currency: "",
            progress: 0,
            value   : 0
        },
        name            : "mobile deveoper",
        history         : {
            'Mon Jun 06 2016 09:12:16 GMT+0300 (EEST)': [
                {
                    editedBy    : "alina.slavska",
                    newValue    : "Cancelled",
                    changedField: "workflow",
                    date        : "2016-06-06T06:12:16.320Z"
                }
            ]
        }
    };
    var fakeWorkflows = {
        data: [
            {
                _id         : "528ce74ef3f67bc40b00001e",
                __v         : 0,
                attachments : [],
                name        : "Draft",
                sequence    : 2,
                status      : "New",
                wId         : "Leads",
                wName       : "lead",
                source      : "lead",
                targetSource: [
                    "lead"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce779f3f67bc40b00001f",
                __v         : 0,
                attachments : [],
                name        : "In Progress",
                sequence    : 1,
                status      : "In Progress",
                wId         : "Leads",
                wName       : "lead",
                source      : "lead",
                targetSource: [
                    "lead"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce79bf3f67bc40b000020",
                __v         : 0,
                attachments : [],
                name        : "Cancelled",
                sequence    : 0,
                status      : "Cancelled",
                wId         : "Leads",
                wName       : "lead",
                source      : "lead",
                targetSource: [
                    "lead"
                ],
                visible     : true,
                color       : "#2C3E50"
            }
        ]
    };
    var fakeLeadsPriority = {
        data: [
            {
                _id     : "Trivial",
                type    : "Leads",
                priority: "Trivial"
            },
            {
                _id     : "Low",
                type    : "Leads",
                priority: "Low"
            },
            {
                _id     : "Medium",
                type    : "Leads",
                priority: "Medium"
            },
            {
                _id     : "High",
                type    : "Leads",
                priority: "High"
            }
        ]
    };
    var fakeEmployeesForDD = {
        data: [
            {
                _id       : "55b92ad221e4b7c40f000030",
                department: {
                    _id              : "55bb1f40cb76ca630b000007",
                    sequence         : 4,
                    nestingLevel     : 1,
                    editedBy         : {
                        date: "2016-03-30T11:20:27.579Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy        : {
                        date: "2015-07-31T07:09:52.155Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users            : [],
                    departmentManager: "55b92ad221e4b7c40f000030",
                    parentDepartment : "56e6775c5ec71b00429745a4",
                    departmentName   : "PM",
                    __v              : 0,
                    isDevelopment    : false
                },
                name      : {
                    first: "Alex",
                    last : "Svatuk"
                },
                isEmployee: true
            },
            {
                _id       : "55b92ad221e4b7c40f000031",
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
                name      : {
                    last : "Gleba",
                    first: "Alex"
                },
                isEmployee: true
            }
        ]
    };
    var fakeFilters = {
        _id        : null,
        contactName: [
            {
                _id : "Pete Roithmayr",
                name: "Pete Roithmayr"
            },
            {
                _id : "Adrien Martinelli",
                name: "Adrien Martinelli"
            }
        ],
        source     : [
            {
                _id : "Offline Meetings",
                name: "Offline Meetings"
            },
            {
                _id : "Web Organic",
                name: "Web Organic"
            }
        ]
    };
    var view;
    var topBarView;
    var leadsCollection;
    var listView;
    var filterOptions = {
        url        : '/leads/',
        contentType: 'Leads'
    };
    var filterTest = FilterTest(filterOptions);
    var jQueryAjaxSpy = sinon.spy($, 'ajax');
    var fakeResponseSaveFilter = {"success":{"_id":"52203e707d4dba8813000003","__v":0,"attachments":[],"lastAccess":"2016-06-23T12:46:39.099Z","profile":1387275598000,"relatedEmployee":"55b92ad221e4b7c40f00004f","savedFilters":[{"_id":"574335bb27725f815747d579","viewType":"","contentType":null,"byDefault":true},{"_id":"576140b0db710fca37a2d950","viewType":"","contentType":null,"byDefault":false},{"_id":"5761467bdb710fca37a2d951","viewType":"","contentType":null,"byDefault":false},{"_id":"57615278db710fca37a2d952","viewType":"","contentType":null,"byDefault":false},{"_id":"576be27e8833d3d250b617a5","contentType":"Leads","byDefault":false}],"kanbanSettings":{"tasks":{"foldWorkflows":["Empty"],"countPerPage":10},"applications":{"foldWorkflows":["Empty"],"countPerPage":10},"opportunities":{"foldWorkflows":["Empty"],"countPerPage":10}},"credentials":{"access_token":"","refresh_token":""},"pass":"082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9","email":"info@thinkmobiles.com","login":"admin"}}

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('LeadsView', function () {
        var $fixture;
        var $elFixture;
        var historyNavigateSpy;

        before(function () {
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
        });

        after(function () {
            topBarView.remove();
            listView.remove();
            view.remove();

            historyNavigateSpy.restore();

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

                server.respondWith('GET', '/modules/', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'Leads'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="24"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="24"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Leads');
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

            it('Try to fetch collection with 401 error', function () {
                var leadsUrl = new RegExp('\/leads\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', leadsUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeLeads)]);
                leadsCollection = new LeadsCollection({
                    viewType: 'list'
                });
                server.respond();

                expect(historyNavigateSpy.called).to.be.true;
            });

            it('Try to create topBar view', function () {
                var $createBtnHolderEl;
                var $addLeadsBtnEl;
                var leadsUrl = new RegExp('\/leads\/', 'i');

                server.respondWith('GET', leadsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeLeads)]);
                leadsCollection = new LeadsCollection({
                    viewType: 'list'
                });
                server.respond();
                expect(leadsCollection)
                    .to.have.lengthOf(3);

                topBarView = new TopBarView({
                    collection: leadsCollection,
                    actionType: 'Content'
                });

                $createBtnHolderEl = topBarView.$el.find('#createBtnHolder');
                $addLeadsBtnEl = $createBtnHolderEl.find('a[href="#home/action-Leads/Create"]');

                expect($createBtnHolderEl).to.exist;
                expect($addLeadsBtnEl).to.exist;
                expect($addLeadsBtnEl).to.have.id('top-bar-createBtn');
            });
        });

        describe('Leads list view', function () {
            var server;
            var windowConfirmStub;
            var mainSpy;
            var clock;
            var alertStub;
            var listDeleteSpy;
            var $thisEl;
            var openEditDialogSpy;
            var deleteEditSpy;

            before(function () {
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                alertStub = sinon.stub(window, 'alert');
                alertStub.returns(true);
                listDeleteSpy = sinon.spy(ListView.prototype, 'deleteItems');
                openEditDialogSpy = sinon.spy(ListView.prototype, 'gotoForm');
                deleteEditSpy = sinon.spy(EditView.prototype, 'deleteItem');
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                mainSpy.restore();
                clock.restore();
                alertStub.restore();
                listDeleteSpy.restore();
                openEditDialogSpy.restore();
                deleteEditSpy.restore();
            });

            it('Try to create lead list view', function (done) {
                var workFlowUrl = new RegExp('/Workflows', 'i');
                var filtersUrl = '/filter/Leads';
                var $firstRow;
                var countColumn;
                var subject;
                var contactName;
                var email;
                var phone;
                var country;
                var campaign;
                var source;
                var stage;
                var assigned;
                var createBy;
                var editedBy;
                var $pagination;
                var $currentPageList;
                var $pageList;

                server.respondWith('GET', filtersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilters)]);
                server.respondWith('GET', workFlowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWorkflows)]);
                listView = new ListView({
                    collection   : leadsCollection,
                    startTime    : new Date(),
                    newCollection: true,
                    page         : 1
                });
                server.respond();

                clock.tick(700);

                eventsBinder.subscribeCollectionEvents(leadsCollection, listView);
                eventsBinder.subscribeTopBarEvents(topBarView, listView);

                leadsCollection.trigger('fetchFinished', {
                    totalRecords: leadsCollection.totalRecords,
                    currentPage : leadsCollection.currentPage,
                    pageSize    : leadsCollection.pageSize
                });

                $thisEl = listView.$el;

                expect($thisEl).to.exist;
                expect($thisEl.find('#listTable > tr').length).to.equals(3);

                $firstRow = $thisEl.find('#listTable > tr').first();
                countColumn = $firstRow.find('td').length;
                expect(countColumn).to.be.equals(11);

                subject = $firstRow.find('td:nth-child(3) > span').text().trim();
                expect(subject).not.to.be.empty;
                expect(subject).to.not.match(/object Object|undefined/);

                contactName = $firstRow.find('td:nth-child(4)').text().trim();
                expect(contactName).to.not.match(/object Object|undefined/);

                email = $firstRow.find('td:nth-child(5)').text().trim();
                expect(email).to.not.match(/object Object|undefined/);

                phone = $firstRow.find('td:nth-child(6) > a').text().trim();
                expect(phone).to.not.match(/object Object|undefined/);

                country = $firstRow.find('td:nth-child(7)').text().trim();
                expect(country).to.not.match(/object Object|undefined/);

                campaign = $firstRow.find('td:nth-child(8)').text().trim();
                expect(campaign).to.not.match(/object Object|undefined/);

                source = $firstRow.find('td:nth-child(9)').text().trim();
                expect(source).to.not.match(/object Object|undefined/);

                expect($firstRow.find('td:nth-child(10)').find('a')).to.be.not.empty;
                stage = $firstRow.find('td:nth-child(10) > a').text().trim();
                /* expect(stage).not.to.be.empty;
                 expect(stage).to.not.match(/object Object|undefined/);*/

                assigned = $firstRow.find('td:nth-child(11)').text().trim();
                expect(assigned).to.not.match(/object Object|undefined/);

                // test list pagination

                $pagination = $thisEl.find('.pagination');

                expect($pagination).to.exist;
                expect($pagination.find('.countOnPage')).to.exist;
                expect($pagination.find('.pageList')).to.exist;

                $currentPageList = $pagination.find('.currentPageList');
                expect($currentPageList).to.exist;

                $pageList = $pagination.find('#pageList');
                expect($pageList).to.exist;
                expect($pageList).to.have.css('display', 'none');

                done();
            });

            it('Try to select 25 item per page', function () {
                var $pagination = $thisEl.find('.pagination');
                var $pageList = $pagination.find('.pageList');
                var $needBtn = $pageList.find('.itemsNumber').first();
                var ajaxResponse;

                jQueryAjaxSpy.reset();

                $needBtn.click();
                server.respond();

                ajaxResponse = jQueryAjaxSpy.args[0][0];

                expect(ajaxResponse.data).to.exist;
                expect(ajaxResponse.data).to.have.property('count', '25');
                expect(ajaxResponse.data).to.have.property('page', 1);
                expect(window.location.hash).to.be.equals('#easyErp/Leads/list/p=1/c=25');
            });

            it('Try to select 2 page on list', function () {
                var $pagination = $thisEl.find('.pagination');
                var $currentPageList = $pagination.find('.currentPageList');
                var $pageList;
                var $secondPageBtn;
                var ajaxResponse;

                jQueryAjaxSpy.reset();

                $currentPageList.mouseover();
                $pageList = $pagination.find('#pageList');
                expect($pageList).to.have.css('display', 'block');

                $secondPageBtn = $pageList.find('li').eq(1);

                $secondPageBtn.click();
                server.respond();

                ajaxResponse = jQueryAjaxSpy.args[0][0];

                expect(ajaxResponse.data).to.exist;
                expect(ajaxResponse.data).to.have.property('count', '25');
                expect(ajaxResponse.data).to.have.property('page', 2);
                expect(window.location.hash).to.be.equals('#easyErp/Leads/list/p=2/c=25');
            });

            it('Try to select 50 item per page', function () {
                var $pagination = $thisEl.find('.pagination');
                var $pageList = $pagination.find('.pageList');
                var $needBtn = $pageList.find('.itemsNumber').eq(1);
                var ajaxResponse;

                jQueryAjaxSpy.reset();

                $needBtn.click();
                server.respond();

                ajaxResponse = jQueryAjaxSpy.args[0][0];

                expect(ajaxResponse.data).to.exist;
                expect(ajaxResponse.data).to.have.property('count', '50');
                expect(ajaxResponse.data).to.have.property('page', 1);
                expect(window.location.hash).to.be.equals('#easyErp/Leads/list/p=1/c=50');
            });

            it('Try to select 100 item per page', function () {
                var $pagination = $thisEl.find('.pagination');
                var $pageList = $pagination.find('.pageList');
                var $needBtn = $pageList.find('.itemsNumber').eq(2);
                var ajaxResponse;

                jQueryAjaxSpy.reset();

                $needBtn.click();
                server.respond();

                ajaxResponse = jQueryAjaxSpy.args[0][0];

                expect(ajaxResponse.data).to.exist;
                expect(ajaxResponse.data).to.have.property('count', '100');
                expect(ajaxResponse.data).to.have.property('page', 1);
                expect(window.location.hash).to.be.equals('#easyErp/Leads/list/p=1/c=100');

            });

            it('Try to select 200 item per page', function () {
                var $pagination = $thisEl.find('.pagination');
                var $pageList = $pagination.find('.pageList');
                var $needBtn = $pageList.find('.itemsNumber').eq(3);
                var ajaxResponse;

                jQueryAjaxSpy.reset();

                $needBtn.click();
                server.respond();

                ajaxResponse = jQueryAjaxSpy.args[0][0];

                expect(ajaxResponse.data).to.exist;
                expect(ajaxResponse.data).to.have.property('count', '200');
                expect(ajaxResponse.data).to.have.property('page', 1);
                expect(window.location.hash).to.be.equals('#easyErp/Leads/list/p=1/c=200');
            });

            it('Try to change leads stage', function () {
                var $selectedItem;
                var $needTr = listView.$el.find('#listTable > tr:nth-child(1)');
                var $stageBtn = $needTr.find('td:nth-child(9) > a');
                var leadsUrl = new RegExp('\/leads\/', 'i');

                jQueryAjaxSpy.reset();

                $stageBtn.click();
                expect($thisEl.find('.newSelectList')).to.exist;
                $stageBtn.click();
                expect($thisEl.find('.newSelectList')).to.not.exist;

                $stageBtn.click();
                expect($thisEl.find('.newSelectList')).to.exist;
                expect($thisEl.find('.newSelectList > li').length).to.not.equals(0);

                $selectedItem = $needTr.find('.newSelectList > li#528ce74ef3f67bc40b00001e');
                server.respondWith('PATCH', leadsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    success: 'Updated success'
                })]);
                $selectedItem.click();
                server.respond();

                expect(jQueryAjaxSpy.args[1][0]).to.have.property('url', '/leads/');
                expect(window.location.hash).to.be.equals('#easyErp/Leads/list/p=1/c=200');
            });

            it('Try to delete leads with 403 server response', function () {
                var $needCheckBox = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(1) >input');
                var leadsUrl = new RegExp('\/leads\/', 'i');
                var $deleteBtnEl;

                windowConfirmStub.returns(true);
                listDeleteSpy.reset();
                mainSpy.reset();

                server.respondWith('DELETE', leadsUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $needCheckBox.click();
                $deleteBtnEl = topBarView.$el.find('#top-bar-deleteBtn').first();
                $deleteBtnEl.click();
                server.respond();

                expect(windowConfirmStub.called).to.be.true;
                expect(listDeleteSpy.called).to.be.true;
                expect(mainSpy.args[0][0]).to.have.property('type', 'error');
            });

            it('Try to delete leads with good(200) server response', function () {
                var leadsUrl = new RegExp('\/leads\/', 'i');
                var $deleteBtnEl;

                windowConfirmStub.returns(true);
                listDeleteSpy.reset();

                server.respondWith('DELETE', leadsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    success: 'Opportunities removed'
                })]);
                $deleteBtnEl = topBarView.$el.find('#top-bar-deleteBtn').first();
                $deleteBtnEl.click();
                server.respond();

                expect(windowConfirmStub.called).to.be.true;
                expect(listDeleteSpy.called).to.be.true;
            });

            it('Try to create leads', function () {
                var $dialogContainer = $('#dialogContainer');
                var $createBtn = topBarView.$el.find('#top-bar-createBtn');

                expect($dialogContainer).to.be.empty;

                server.respondWith('GET', '/users/forDd', [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', /\/workflows\/getWorkflowsForDd/, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWorkflowsForDD)]);
                server.respondWith('GET', '/employees/sources', [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplSources)]);
                server.respondWith('GET', '/leads/priority', [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeLeadsPriority)]);
                server.respondWith('GET', '/Campaigns', [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCampaigns)]);
                server.respondWith('GET', '/customers/', [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomers)]);
                server.respondWith('GET', '/employees/getForDD?isEmployee=true', [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployeesForDD)]);
                $createBtn.click();
                server.respond();

                expect($('#leadForm')).to.exist;
            });

            it('Try to save lead without need data', function () {
                var $createBtn = $($('.ui-dialog-buttonset button')[0]);
                var spyResponse;
                mainSpy.reset();

                $createBtn.click();

                spyResponse = mainSpy.args[0][0];
                expect(spyResponse).to.have.property('type', 'error');
            });

            it('Try to change tab', function () {
                var $tabsBtn = $('.dialog-tabs a');
                var $firstBtn = $($tabsBtn[0]);
                var $secondBtn = $($tabsBtn[1]);

                expect($firstBtn).to.have.class('active');
                $secondBtn.click();
                expect($firstBtn).to.have.not.class('active');
                expect($secondBtn).to.have.class('active');
            });

            it('Try to save lead with error response', function (done) {
                var $createBtn = $($('.ui-dialog-buttonset button')[0]);
                var $selectBtn = $('.current-selected')[0];
                var $customerSel;
                var $form = $('#leadForm');
                var $tabsBtn = $('.dialog-tabs a');
                var $firstBtn = $($tabsBtn[0]);
                var customerUrl = new RegExp('\/customers\/', 'i');

                $firstBtn.click();
                $selectBtn.click();

                server.respondWith('GET', customerUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomerIdCompany)]);
                $customerSel = $('#customerDd .newSelectList li')[1];
                $customerSel.click();
                server.respond();

                clock.tick(200);

                $form.find('#name').val('Test');
                $form.find('#first').val('Test');
                $form.find('#last').val('Test');
                $form.find('#company').val('Test');
                $form.find('#e-mail').val('test@test.test');
                $form.find('#phone').val('+3568989856');
                $form.find('#mobile').val('+3365656583');
                $form.find('#street').val('test');
                $form.find('#city').val('test');
                $form.find('#state').val('test');
                $form.find('#zip').val('88000');
                $form.find('#country').val('test');
                $form.find('#workflowsDd').attr('data-id', '528ce74ef3f67bc40b00001e');

                alertStub.reset();
                jQueryAjaxSpy.reset();

                server.respondWith('POST', '/leads/', [400, {'Content-Type': 'application/json'}, JSON.stringify({
                    success: 'A new Opportunities create success',
                    id     : '12345'
                })]);
                $createBtn.click();
                server.respond();

                expect(alertStub.called).to.be.true;
                done();
            });

            it('Try to save lead with need data with customer company', function () {
                var $createBtn = $($('.ui-dialog-buttonset button')[0]);
                var hashUrlLeads = new RegExp('#easyErp\/Leads', 'i');

                server.respondWith('POST', '/leads/', [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    success: 'A new Opportunities create success',
                    id     : '12345'
                })]);
                $createBtn.click();
                server.respond();

                expect(hashUrlLeads.test(window.location.hash)).to.be.true;
                expect($('#leadForm')).to.not.exist;
            });

            it('Try to open create leads view', function () {
                var $dialogContainer = $('#dialogContainer');
                var $createBtn = topBarView.$el.find('#top-bar-createBtn');

                expect($dialogContainer).to.be.empty;

                $createBtn.click();
                server.respond();

                expect($('#leadForm')).to.exist;
            });

            it('Try to save lead with need data with customer person', function (done) {
                var createBtn = $('.ui-dialog-buttonset button')[0];
                var $selectBtn = $('.current-selected')[0];
                var $customerSel;
                var $form = $('#leadForm');
                var $tabsBtn = $('.dialog-tabs a');
                var $firstBtn = $($tabsBtn[0]);
                var customerUrl = new RegExp('\/customers\/', 'i');
                var hashUrlLeads = new RegExp('#easyErp\/Leads', 'i');

                $firstBtn.click();

                $selectBtn.click();

                server.respondWith('GET', customerUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomerId)]);
                $customerSel = $('#customerDd .newSelectList li')[3];
                $customerSel.click();
                server.respond();

                clock.tick(200);

                server.respondWith('POST', '/leads/', [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    success: 'A new Opportunities create success',
                    id     : '12345'
                })]);

                $form.find('#name').val('Test');
                $form.find('#first').val('Test');
                $form.find('#last').val('Test');
                $form.find('#company').val('Test');
                $form.find('#e-mail').val('test@test.test');
                $form.find('#phone').val('+3568989856');
                $form.find('#mobile').val('+3365656583');
                $form.find('#street').val('test');
                $form.find('#city').val('test');
                $form.find('#state').val('test');
                $form.find('#zip').val('88000');
                $form.find('#country').val('test');
                $form.find('#workflowsDd').attr('data-id', '528ce74ef3f67bc40b00001e');

                $(createBtn).click();

                server.respond();

                expect(hashUrlLeads.test(window.location.hash)).to.be.true;
                expect($('#leadForm')).to.not.exist;

                done();
            });

            it('Try to open EditView with error', function () {
                var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                var leadUrl = new RegExp('\/Leads\/', 'i');
                var spyResponse;

                mainSpy.reset();

                server.respondWith('GET', leadUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $needTd.click();
                server.respond();

                spyResponse = mainSpy.args[0][0];
                expect(openEditDialogSpy.calledOnce).to.be.true;
                expect(spyResponse).to.have.property('type', 'error');
                expect($('.ui-dialog')).to.not.exist;
            });

            it('Try to open EditDialog', function () {
                var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                var leadUrl = new RegExp('\/Leads\/', 'i');
                var sourceUrl = '/employees/sources';
                var leadsPriorityUrl = '/leads/priority';
                var employeesForDDUrl = '/employees/getForDD';
                var $uiDialog;

                server.respondWith('GET', leadsPriorityUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeLeadsPriority)]);
                server.respondWith('GET', sourceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplSources)]);
                server.respondWith('GET', leadUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeLeadId)]);
                server.respondWith('GET', employeesForDDUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployeesForDD)]);
                $needTd.click();
                server.respond();
                server.respond();

                clock.tick(200);
                $uiDialog = $('.ui-dialog');

                expect(openEditDialogSpy.calledTwice).to.be.true;
                expect($uiDialog).to.exist;
                expect($uiDialog).to.have.lengthOf(1);
            });

            it('Try to edit with error response', function () {
                var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                var leadUrl = new RegExp('\/Leads\/', 'i');

                alertStub.reset();

                server.respondWith('PATCH', leadUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $saveBtn.click();
                server.respond();

                expect(alertStub.called).to.be.true;
            });

            it('Try to select source', function () {
                var $dialog = $('.ui-dialog');
                var $source = $dialog.find('#sourceDd.current-selected');
                var $selectedItem;

                $source.click();
                expect($source.find('.newSelectList')).to.exist;
                expect($source.find('.newSelectList > li')).to.be.not.empty;

                $selectedItem = $source.find('.newSelectList li').first();
                $selectedItem.click();
                //expect($dialog.find('#sourceDd').text().trim()).to.be.equals('1O');
            });

            it('Try to select customer', function () {
                var $dialog = $('.ui-dialog');
                var $customer = $dialog.find('#customerDd');
                var $selectedItem;
                var $selelctList;

                $customer.click();
                expect($customer.find('.newSelectList')).to.exist;
                $selelctList = $customer.find('.newSelectList');
                expect($selelctList.find('li')).to.be.not.empty;

                $selectedItem = $selelctList.find('li').first();
                $selectedItem.click();
                expect($dialog.find('#customerDd').text().trim()).to.be.equals('Norbert');

            });

            it('Try to PATCH lead with correct data', function () {
                var $form = $('#leadForm');
                var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                var leadUrl = new RegExp('\/leads\/', 'i');

                server.respondWith('PATCH', leadUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: "A new Opportunities create success"})]);
                $form.find('#name').val('Test');
                $($saveBtn).click();
                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Leads');
                expect($('#leadForm')).to.not.exist;
            });

            it('Try to open edit form for deleting item', function () {
                var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                var leadsUrl = new RegExp('\/Leads\/form', 'i');

                // open editDialog
                server.respondWith('GET', leadsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeLeadId)]);
                $needTd.click();
                server.respond();

                expect($('#leadForm')).to.exist;
            });

            it('Try to change tab in edit form', function () {
                var $tabsBtn = $('.dialog-tabs a');
                var $firstBtn = $($tabsBtn[0]);
                var $secondBtn = $($tabsBtn[1]);

                expect($firstBtn).to.have.class('active');

                $secondBtn.click();

                expect($firstBtn).to.have.not.class('active');
                expect($secondBtn).to.have.class('active');
            });

            it('Try to delete item with error result', function () {
                var $deleteBtn;

                alertStub.reset();
                deleteEditSpy.reset();

                $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                server.respondWith('DELETE', '/Leads/56c1c4ecc99aad5365bff221', [400, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Opportunities removed'})]);
                $deleteBtn.click();
                server.respond();

                expect(deleteEditSpy.calledOnce).to.be.true;
            });

            it('Try to delete item with good result', function () {
                var leadUrl = new RegExp('\/leads\/', 'i');
                var $deleteBtn;

                windowConfirmStub.returns(true);

                $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                server.respondWith('DELETE', leadUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Opportunities removed'})]);
                $deleteBtn.click();
                server.respond();

                expect(deleteEditSpy.calledTwice).to.be.true;
                expect(window.location.hash).to.be.equals('#easyErp/Leads');
                expect(windowConfirmStub.called).to.be.true;
            });

            it('Try to filter list view by contactName and source', function () {
                filterTest.select2FiltersAndremove1.call(this, 'contactName', 'source', 'listView', jQueryAjaxSpy, fakeLeads);
            });

            it('Try to save name filter', function () {
                filterTest.saveFilter.call(this, fakeResponseSaveFilter);
            });

            it('Try remove saved Filters', function () {
                filterTest.removeSavedFilter.call(this);
            });

            it('Try to remove filter', function () {
                filterTest.removeFilter.call(this, 'source', jQueryAjaxSpy);
            });
        });
    });
});