define([
    'Underscore',
    'modules',
    'text!fixtures/index.html',
    'models/CompaniesModel',
    'collections/Companies/filterCollection',
    'views/main/MainView',
    'views/Companies/TopBarView',
    'views/Companies/CreateView',
    'views/Companies/EditView',
    'views/Companies/form/FormView',
    'views/Companies/list/ListView',
    'views/Companies/thumbnails/ThumbnailsView',
    'views/Filter/filterView',
    'views/Filter/filtersGroup',
    'views/Filter/savedFiltersView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'constants/filters'
], function (_,
             modules,
             fixtures,
             CompanyModel,
             CompaniesCollection,
             MainView,
             TopBarView,
             CreateView,
             EditView,
             FormView,
             ListView,
             ThumbnailsView,
             FilterView,
             FilterGroup,
             SavedFilters,
             eventsBinder,
             $,
             chai,
             chaiJquery,
             sinonChai,
             FILTER_CONSTANTS) {
    'use strict';

    var fakeCompaniesList = {
        total: 300,
        data : [
            {
                _id           : "56bc9b53dfd8a81466e2f48b",
                editedBy      : {
                    date: "2016-02-11T14:31:47.740Z",
                    user: null
                },
                createdBy     : {
                    date: "2016-02-11T14:31:47.740Z",
                    user: null
                },
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
                phones        : {
                    phone: ""
                },
                address       : {
                    country: ""
                },
                email         : "",
                name          : {
                    last : "",
                    first: "TestAlina"
                },
                fullName      : "TestAlina ",
                id            : "56bc9b53dfd8a81466e2f48b"
            },
            {
                _id           : "56a9ee95d59a04d6225b0df4",
                editedBy      : {
                    date: "2016-01-28T10:33:57.441Z",
                    user: {
                        _id  : "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
                createdBy     : {
                    date: "2016-01-28T10:33:57.440Z",
                    user: {
                        _id  : "52203e707d4dba8813000003",
                        login: "admin"
                    }
                },
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
                phones        : {
                    phone: ""
                },
                address       : {
                    country: ""
                },
                email         : "",
                name          : {
                    last : "",
                    first: "ThinkMobiles"
                },
                fullName      : "ThinkMobiles ",
                id            : "56a9ee95d59a04d6225b0df4"
            },
            {
                _id           : "56a0d4b962d172544baf0e3b",
                editedBy      : {
                    date: "2016-01-21T12:53:13.143Z",
                    user: {
                        _id  : "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
                createdBy     : {
                    date: "2016-01-21T12:53:13.143Z",
                    user: {
                        _id  : "55b9fbcdd79a3a3439000007",
                        login: "Igor Stan"
                    }
                },
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
                phones        : {
                    phone: ""
                },
                address       : {
                    country: "Sweden"
                },
                email         : "",
                name          : {
                    last : "",
                    first: "Chimney"
                },
                fullName      : "Chimney ",
                id            : "56a0d4b962d172544baf0e3b"
            }]
    };
    var fakeAlphabet = {
        data: [
            {
                _id: "T"
            },
            {
                _id: "t"
            },
            {
                _id: "Y"
            },
            {
                _id: "M"
            },
            {
                _id: "A"
            },
            {
                _id: "#"
            },
            {
                _id: "S"
            },
            {
                _id: "L"
            },
            {
                _id: "W"
            },
            {
                _id: "O"
            },
            {
                _id: "B"
            },
            {
                _id: "C"
            },
            {
                _id: "P"
            },
            {
                _id: "K"
            },
            {
                _id: "G"
            },
            {
                _id: "U"
            },
            {
                _id: "H"
            },
            {
                _id: "E"
            }
        ]
    };
    var fakeCompaniesThumb = {
        total: 100,
        data : [
            {
                _id     : "55b92ad521e4b7c40f00060d",
                address : {
                    country: "USA",
                    zip    : "49525 ",
                    state  : "Michigan",
                    city   : "Grand Rapids",
                    street : "4647 Shearwood Ct."
                },
                name    : {
                    last : "",
                    first: "Sportsman Tracker"
                },
                fullName: "Sportsman Tracker ",
                id      : "55b92ad521e4b7c40f00060d"
            },
            {
                _id     : "55b92ad521e4b7c40f00061d",
                address : {
                    country: "Australia",
                    zip    : "3121",
                    state  : "Melbourne",
                    city   : "Richmond",
                    street : "Level 1, 225 - 227 Swan St"
                },
                name    : {
                    last : "",
                    first: "Buzinga"
                },
                fullName: "Buzinga ",
                id      : "55b92ad521e4b7c40f00061d"
            },
            {
                _id     : "55b92ad521e4b7c40f00061e",
                address : {
                    country: "UK",
                    zip    : "",
                    state  : "",
                    city   : "",
                    street : ""
                },
                name    : {
                    last : "",
                    first: "Luke Raskino"
                },
                fullName: "Luke Raskino ",
                id      : "55b92ad521e4b7c40f00061e"
            }
        ]
    };
    var fakeCompanyWithId = {
        _id           : "55b92ad521e4b7c40f00060d",
        ID            : 6,
        __v           : 0,
        companyInfo   : {
            size    : "1-50",
            industry: null
        },
        editedBy      : {
            date: "2016-04-21T09:34:15.219Z",
            user: {
                _id  : "52203e707d4dba8813000003",
                login: "admin"
            }
        },
        createdBy     : {
            date: "2015-07-29T19:34:45.990Z",
            user: {
                _id  : "52203e707d4dba8813000003",
                login: "admin"
            }
        },
        history       : [],
        attachments   : [],
        notes         : [],
        groups        : {
            group: [],
            users: [],
            owner: {
                _id  : "52203e707d4dba8813000003",
                login: "admin"
            }
        },
        whoCanRW      : "everyOne",
        social        : {
            LI: "",
            FB: "adsda"
        },
        color         : "#4d5a75",
        relatedUser   : null,
        salesPurchases: {
            receiveMessages: 0,
            language       : "",
            reference      : "",
            active         : false,
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
            phone : "+16162403185"
        },
        skype         : "",
        jobPosition   : "",
        website       : "http://www.sportsmantracker.com",
        address       : {
            country: "USA",
            zip    : "49525 ",
            state  : "Michigan",
            city   : "Grand Rapids",
            street : "4647 Shearwood Ct."
        },
        timezone      : "UTC",
        department    : null,
        company       : null,
        email         : "jeff@sportsmantracker.com",
        imageSrc      : "data:image/jpeg;base64,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",
        name          : {
            last : "",
            first: "Sportsman Tracker"
        },
        isOwn         : false,
        type          : "Company",
        fullName      : "Sportsman Tracker ",
        id            : "55b92ad521e4b7c40f00060d"
    };
    var fakePersonsForMiveView = {
        data: [
            {
                _id     : "55b92ad621e4b7c40f000635",
                phones  : {
                    mobile: ""
                },
                email   : "",
                name    : {
                    last : "",
                    first: "Academiacs"
                },
                fullName: "Academiacs ",
                id      : "55b92ad621e4b7c40f000635"
            },
            {
                _id     : "55b92ad621e4b7c40f000637",
                phones  : {
                    mobile: ""
                },
                email   : "",
                name    : {
                    last : "",
                    first: "Airsoft Holdings "
                },
                fullName: "Airsoft Holdings ",
                id      : "55b92ad621e4b7c40f000637"
            },
            {
                _id     : "56574092bfd103f108eb4ad3",
                phones  : {
                    mobile: ""
                },
                email   : "Ales.Smokvina@marand.si",
                name    : {
                    last : "Smokvina",
                    first: "Ales"
                },
                fullName: "Ales Smokvina",
                id      : "56574092bfd103f108eb4ad3"
            },
            {
                _id     : "55b92ad521e4b7c40f00060c",
                phones  : {
                    mobile: ""
                },
                email   : "",
                name    : {
                    last : "Blinov",
                    first: "Alexey"
                },
                fullName: "Alexey Blinov",
                id      : "55b92ad521e4b7c40f00060c"
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
    var fakeDepsForDD = {
        data: [
            {
                _id             : "55b92ace21e4b7c40f000012",
                nestingLevel    : 0,
                parentDepartment: null,
                departmentName  : ".NET/WP"
            },
            {
                _id             : "55b92ace21e4b7c40f000010",
                nestingLevel    : 0,
                parentDepartment: null,
                departmentName  : "Android"
            },
            {
                _id             : "55b92ace21e4b7c40f000014",
                nestingLevel    : 0,
                parentDepartment: null,
                departmentName  : "BusinessDev"
            },
            {
                _id             : "56802e9d1afe27f547b7ba51",
                nestingLevel    : 1,
                parentDepartment: "55b92ace21e4b7c40f000016",
                departmentName  : "CSS/FrontEnd"
            },
            {
                _id             : "55bb1f14cb76ca630b000006",
                nestingLevel    : 0,
                parentDepartment: null,
                departmentName  : "Design"
            },
            {
                _id             : "560c0b83a5d4a2e20ba5068c",
                nestingLevel    : 0,
                parentDepartment: null,
                departmentName  : "Finance"
            },
            {
                _id             : "55b92ace21e4b7c40f000015",
                nestingLevel    : 0,
                parentDepartment: null,
                departmentName  : "HR"
            },
            {
                _id             : "56802eb31afe27f547b7ba52",
                nestingLevel    : 1,
                parentDepartment: "55b92ace21e4b7c40f000016",
                departmentName  : "JS"
            },
            {
                _id             : "55b92ace21e4b7c40f000013",
                nestingLevel    : 0,
                parentDepartment: null,
                departmentName  : "Marketing"
            },
            {
                _id             : "56802ec21afe27f547b7ba53",
                nestingLevel    : 1,
                parentDepartment: "55b92ace21e4b7c40f000016",
                departmentName  : "PHP/WordPress"
            },
            {
                _id             : "55bb1f40cb76ca630b000007",
                nestingLevel    : 0,
                parentDepartment: null,
                departmentName  : "PM"
            },
            {
                _id             : "55b92ace21e4b7c40f000011",
                nestingLevel    : 0,
                parentDepartment: null,
                departmentName  : "QA"
            },
            {
                _id             : "566ee11b8453e8b464b70b73",
                nestingLevel    : 1,
                parentDepartment: "55b92ace21e4b7c40f000016",
                departmentName  : "Ruby on Rails"
            },
            {
                _id             : "55b92ace21e4b7c40f000016",
                nestingLevel    : 0,
                parentDepartment: null,
                departmentName  : "Web"
            },
            {
                _id             : "55b92ace21e4b7c40f00000f",
                nestingLevel    : 0,
                parentDepartment: null,
                departmentName  : "iOS"
            }
        ]
    };
    var fakeEmplLang = {
        data: [
            {
                _id        : "5301e61b3d8b9898d5896e67",
                attachments: [],
                name       : "English"
            }
        ]
    };
    var fakeEmplRelUser = {
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
    var fakeCustomers = {
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
    var fakePersnosForMiniView = {
        data: [
            {
                _id     : "55b92ad621e4b7c40f000635",
                phones  : {
                    mobile: ""
                },
                email   : "",
                name    : {
                    last : "",
                    first: "Academiacs"
                },
                fullName: "Academiacs ",
                id      : "55b92ad621e4b7c40f000635"
            },
            {
                _id     : "55b92ad621e4b7c40f000637",
                phones  : {
                    mobile: ""
                },
                email   : "",
                name    : {
                    last : "",
                    first: "Airsoft Holdings "
                },
                fullName: "Airsoft Holdings ",
                id      : "55b92ad621e4b7c40f000637"
            },
            {
                _id     : "56574092bfd103f108eb4ad3",
                phones  : {
                    mobile: ""
                },
                email   : "Ales.Smokvina@marand.si",
                name    : {
                    last : "Smokvina",
                    first: "Ales"
                },
                fullName: "Ales Smokvina",
                id      : "56574092bfd103f108eb4ad3"
            },
            {
                _id     : "55b92ad521e4b7c40f00060c",
                phones  : {
                    mobile: ""
                },
                email   : "",
                name    : {
                    last : "Blinov",
                    first: "Alexey"
                },
                fullName: "Alexey Blinov",
                id      : "55b92ad521e4b7c40f00060c"
            }
        ]
    };
    var fakeWorkflowForDD = {
        data: [
            {
                _id  : "528cdcb4f3f67bc40b000006",
                name : "New",
                wName: "opportunity"
            },
            {
                _id  : "528cdd2af3f67bc40b000007",
                name : "Qualification",
                wName: "opportunity"
            },
            {
                _id  : "528cde9ef3f67bc40b000008",
                name : "Proposition",
                wName: "opportunity"
            },
            {
                _id  : "528cdef4f3f67bc40b00000a",
                name : "Won",
                wName: "opportunity"
            },
            {
                _id  : "528cdf1cf3f67bc40b00000b",
                name : "Lost",
                wName: "opportunity"
            }
        ]
    };
    var fakeTaskPriority = {
        data: [
            {
                attachments: [],
                priority   : "P1"
            },
            {
                attachments: [],
                priority   : "P2"
            },
            {
                attachments: [],
                priority   : "P3"
            },
            {
                attachments: [],
                priority   : "P4"
            },
            {
                attachments: [],
                priority   : "P5"
            }
        ]
    };
    var fakeCustomerForDD = {
        data: [
            {
                _id     : "55ba0301d79a3a343900000d",
                name    : {
                    first: "#Play"
                },
                fullName: "#Play undefined",
                id      : "55ba0301d79a3a343900000d"
            },
            {
                _id     : "55cdc93c9b42266a4f000005",
                name    : {
                    first: "AgileFind"
                },
                fullName: "AgileFind undefined",
                id      : "55cdc93c9b42266a4f000005"
            },
            {
                _id     : "55f56406b81672730c00002e",
                name    : {
                    first: "App Institute"
                },
                fullName: "App Institute undefined",
                id      : "55f56406b81672730c00002e"
            },
            {
                _id     : "562bc2db62461bfd59ef58c7",
                name    : {
                    first: "AppMedia"
                },
                fullName: "AppMedia undefined",
                id      : "562bc2db62461bfd59ef58c7"
            },
            {
                _id     : "562ff202547f50b51d6de2b8",
                name    : {
                    first: "Appsmakerstore"
                },
                fullName: "Appsmakerstore undefined",
                id      : "562ff202547f50b51d6de2b8"
            },
            {
                _id     : "561d1bc0b51032d674856acb",
                name    : {
                    first: "Attrecto"
                },
                fullName: "Attrecto undefined",
                id      : "561d1bc0b51032d674856acb"
            },
            {
                _id     : "569f5fbf62d172544baf0d56",
                name    : {
                    first: "BIScience"
                },
                fullName: "BIScience undefined",
                id      : "569f5fbf62d172544baf0d56"
            },
            {
                _id     : "55edaf167221afe30b000040",
                name    : {
                    first: "BetterIt"
                },
                fullName: "BetterIt undefined",
                id      : "55edaf167221afe30b000040"
            },
            {
                _id     : "55b92ad521e4b7c40f00061d",
                name    : {
                    first: "Buzinga"
                },
                fullName: "Buzinga undefined",
                id      : "55b92ad521e4b7c40f00061d"
            },
            {
                _id     : "56a0d4b962d172544baf0e3b",
                name    : {
                    first: "Chimney"
                },
                fullName: "Chimney undefined",
                id      : "56a0d4b962d172544baf0e3b"
            },
            {
                _id     : "55b92ad621e4b7c40f000633",
                name    : {
                    first: "Chris Mack"
                },
                fullName: "Chris Mack undefined",
                id      : "55b92ad621e4b7c40f000633"
            },
            {
                _id     : "5637a8e2bf9592df04c55115",
                name    : {
                    first: "Colestreet"
                },
                fullName: "Colestreet undefined",
                id      : "5637a8e2bf9592df04c55115"
            },
            {
                _id     : "55b92ad621e4b7c40f000629",
                name    : {
                    first: "Cristaliza"
                },
                fullName: "Cristaliza undefined",
                id      : "55b92ad621e4b7c40f000629"
            },
            {
                _id     : "569f57be62d172544baf0c3a",
                name    : {
                    first: "ETECTURE GmbH"
                },
                fullName: "ETECTURE GmbH undefined",
                id      : "569f57be62d172544baf0c3a"
            },
            {
                _id     : "55b92ad621e4b7c40f000646",
                name    : {
                    first: "EtienneL"
                },
                fullName: "EtienneL undefined",
                id      : "55b92ad621e4b7c40f000646"
            },
            {
                _id     : "55cf5c194a91e37b0b00012b",
                name    : {
                    first: "Global Workshop Solutions"
                },
                fullName: "Global Workshop Solutions undefined",
                id      : "55cf5c194a91e37b0b00012b"
            },
            {
                _id     : "55ba03f8d79a3a343900000f",
                name    : {
                    first: "GlobalWorkshop"
                },
                fullName: "GlobalWorkshop undefined",
                id      : "55ba03f8d79a3a343900000f"
            },
            {
                _id     : "55b92ad621e4b7c40f00063d",
                name    : {
                    first: "Gomez"
                },
                fullName: "Gomez undefined",
                id      : "55b92ad621e4b7c40f00063d"
            },
            {
                _id     : "55b92ad621e4b7c40f00063f",
                name    : {
                    first: "Hussam"
                },
                fullName: "Hussam undefined",
                id      : "55b92ad621e4b7c40f00063f"
            },
            {
                _id     : "55b92ad621e4b7c40f00064f",
                name    : {
                    first: "Kenlo Group Ltd"
                },
                fullName: "Kenlo Group Ltd undefined",
                id      : "55b92ad621e4b7c40f00064f"
            },
            {
                _id     : "55b9fe20d79a3a3439000009",
                name    : {
                    first: "Kogan"
                },
                fullName: "Kogan undefined",
                id      : "55b9fe20d79a3a3439000009"
            },
            {
                _id     : "55b92ad521e4b7c40f00061e",
                name    : {
                    first: "Luke Raskino"
                },
                fullName: "Luke Raskino undefined",
                id      : "55b92ad521e4b7c40f00061e"
            },
            {
                _id     : "56574032bfd103f108eb4ad2",
                name    : {
                    first: "Marand"
                },
                fullName: "Marand undefined",
                id      : "56574032bfd103f108eb4ad2"
            },
            {
                _id     : "55f55854b81672730c000010",
                name    : {
                    first: "MediaHeads"
                },
                fullName: "MediaHeads undefined",
                id      : "55f55854b81672730c000010"
            },
            {
                _id     : "55cf362b4a91e37b0b0000c1",
                name    : {
                    first: "MobStar"
                },
                fullName: "MobStar undefined",
                id      : "55cf362b4a91e37b0b0000c1"
            },
            {
                _id     : "5661805cbb8be7814fb52529",
                name    : {
                    first: "Otrema"
                },
                fullName: "Otrema undefined",
                id      : "5661805cbb8be7814fb52529"
            },
            {
                _id     : "55b92ad621e4b7c40f00062a",
                name    : {
                    first: "PeachInc"
                },
                fullName: "PeachInc undefined",
                id      : "55b92ad621e4b7c40f00062a"
            },
            {
                _id     : "56030d81fa3f91444e00000c",
                name    : {
                    first: "Peter F"
                },
                fullName: "Peter F undefined",
                id      : "56030d81fa3f91444e00000c"
            },
            {
                _id     : "566d4b35abccac87642cb521",
                name    : {
                    first: "Scatch"
                },
                fullName: "Scatch undefined",
                id      : "566d4b35abccac87642cb521"
            },
            {
                _id     : "55cf4f834a91e37b0b000102",
                name    : {
                    first: "SharperBuilds"
                },
                fullName: "SharperBuilds undefined",
                id      : "55cf4f834a91e37b0b000102"
            },
            {
                _id     : "55b92ad521e4b7c40f00060d",
                name    : {
                    first: "Sportsman Tracker1"
                },
                fullName: "Sportsman Tracker1 undefined",
                id      : "55b92ad521e4b7c40f00060d"
            },
            {
                _id     : "5604170eb904af832d000005",
                name    : {
                    first: "Stentle"
                },
                fullName: "Stentle undefined",
                id      : "5604170eb904af832d000005"
            },
            {
                _id     : "56bc9b53dfd8a81466e2f48b",
                name    : {
                    first: "TestAlina"
                },
                fullName: "TestAlina undefined",
                id      : "56bc9b53dfd8a81466e2f48b"
            },
            {
                _id     : "56a9ee95d59a04d6225b0df4",
                name    : {
                    first: "ThinkMobiles"
                },
                fullName: "ThinkMobiles undefined",
                id      : "56a9ee95d59a04d6225b0df4"
            },
            {
                _id     : "569f590262d172544baf0c3e",
                name    : {
                    first: "Time2view"
                },
                fullName: "Time2view undefined",
                id      : "569f590262d172544baf0c3e"
            },
            {
                _id     : "562bed4062461bfd59ef58d1",
                name    : {
                    first: "TreatMe"
                },
                fullName: "TreatMe undefined",
                id      : "562bed4062461bfd59ef58d1"
            },
            {
                _id     : "55ba0b46d79a3a3439000013",
                name    : {
                    first: "Unibet"
                },
                fullName: "Unibet undefined",
                id      : "55ba0b46d79a3a3439000013"
            },
            {
                _id     : "55b92ad621e4b7c40f00062e",
                name    : {
                    first: "Web1 Syndication, Inc"
                },
                fullName: "Web1 Syndication, Inc undefined",
                id      : "55b92ad621e4b7c40f00062e"
            },
            {
                _id     : "55deb987ae2b22730b000018",
                name    : {
                    first: "Yello"
                },
                fullName: "Yello undefined",
                id      : "55deb987ae2b22730b000018"
            },
            {
                _id     : "56dd34b83cb195140de40a66",
                name    : {
                    first: "test"
                },
                fullName: "test undefined",
                id      : "56dd34b83cb195140de40a66"
            },
            {
                _id     : "55fe60f5e2a48c310c000005",
                name    : {
                    first: "test supplier"
                },
                fullName: "test supplier undefined",
                id      : "55fe60f5e2a48c310c000005"
            }
        ]
    };
    var fakeOpportunitiesForFormView = {
        listLength: 5,
        data      : [
            {
                _id            : "571882f0e611193c13905945",
                workflow       : {
                    _id : "528cdcb4f3f67bc40b000006",
                    name: "New"
                },
                nextAction     : {
                    date: "2016-04-21T21:00:00.000Z"
                },
                expectedRevenue: {
                    currency: "$",
                    value   : 12233
                },
                name           : "Test"
            },
            {
                _id            : "5718830ee611193c13905946",
                workflow       : {
                    _id : "528cdcb4f3f67bc40b000006",
                    name: "New"
                },
                nextAction     : {
                    date: "2016-04-26T21:00:00.000Z"
                },
                expectedRevenue: {
                    currency: "$",
                    value   : 15000
                },
                name           : "Test1"
            },
            {
                _id            : "5718844de611193c13905947",
                workflow       : {
                    _id : "528cdcb4f3f67bc40b000006",
                    name: "New"
                },
                nextAction     : {
                    date: ""
                },
                expectedRevenue: {
                    currency: "$",
                    value   : 0
                },
                name           : "ads"
            },
            {
                _id            : "57188454e611193c13905948",
                workflow       : {
                    _id : "528cdcb4f3f67bc40b000006",
                    name: "New"
                },
                nextAction     : {
                    date: ""
                },
                expectedRevenue: {
                    currency: "$",
                    value   : 0
                },
                name           : "adasdasds"
            },
            {
                _id            : "5718845ae611193c13905949",
                workflow       : {
                    _id : "528cdcb4f3f67bc40b000006",
                    name: "New"
                },
                nextAction     : {
                    date: ""
                },
                expectedRevenue: {
                    currency: "$",
                    value   : 0
                },
                name           : "aaaaa"
            }
        ]
    };
    var fakeOpportunitiesById = {
        _id             : "571882f0e611193c13905945",
        __v             : 0,
        attachments     : [],
        notes           : [],
        convertedDate   : "2016-04-21T07:36:16.212Z",
        isConverted     : false,
        source          : "",
        campaign        : "",
        editedBy        : {
            date: "2016-04-21T07:36:16.211Z",
            user: null
        },
        createdBy       : {
            date: "2016-04-21T07:36:16.211Z",
            user: null
        },
        sequence        : 3,
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
            _id         : "528cdcb4f3f67bc40b000006",
            __v         : 0,
            attachments : [],
            name        : "New",
            sequence    : 5,
            status      : "New",
            wId         : "Opportunities",
            wName       : "opportunity",
            source      : "opportunity",
            targetSource: [
                "opportunity"
            ],
            visible     : true,
            color       : "#2C3E50"
        },
        reffered        : "",
        optout          : false,
        active          : false,
        color           : "#4d5a75",
        categories      : {
            name: "",
            id  : ""
        },
        priority        : "P1 ",
        expectedClosing : "2016-04-28T21:00:00.000Z",
        nextAction      : {
            date: "2016-04-21T21:00:00.000Z",
            desc: ""
        },
        internalNotes   : "",
        salesTeam       : null,
        salesPerson     : null,
        func            : "",
        phones          : {
            fax   : "",
            phone : "",
            mobile: ""
        },
        email           : "",
        contactName     : {
            last : "",
            first: ""
        },
        address         : {
            country: "",
            zip    : "",
            state  : "",
            city   : "",
            street : ""
        },
        customer        : {
            _id           : "55b92ad521e4b7c40f00060d",
            ID            : 6,
            __v           : 0,
            companyInfo   : {
                size    : "1-50",
                industry: null
            },
            editedBy      : {
                date: "2016-04-21T09:34:15.219Z",
                user: "52203e707d4dba8813000003"
            },
            createdBy     : {
                date: "2015-07-29T19:34:45.990Z",
                user: "52203e707d4dba8813000003"
            },
            history       : [],
            attachments   : [],
            notes         : [],
            groups        : {
                group: [],
                users: [],
                owner: "52203e707d4dba8813000003"
            },
            whoCanRW      : "everyOne",
            social        : {
                LI: "",
                FB: "adsda"
            },
            color         : "#4d5a75",
            relatedUser   : null,
            salesPurchases: {
                receiveMessages: 0,
                language       : "",
                reference      : "",
                active         : false,
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
                phone : "+16162403185"
            },
            skype         : "",
            jobPosition   : "",
            website       : "http://www.sportsmantracker.com",
            address       : {
                country: "USA",
                zip    : "49525 ",
                state  : "Michigan",
                city   : "Grand Rapids",
                street : "4647 Shearwood Ct."
            },
            timezone      : "UTC",
            department    : null,
            company       : null,
            email         : "jeff@sportsmantracker.com",
            imageSrc      : "data:image/jpeg;base64,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",
            name          : {
                last : "",
                first: "Sportsman Tracker"
            },
            isOwn         : false,
            type          : "Company",
            fullName      : "Sportsman Tracker ",
            id            : "55b92ad521e4b7c40f00060d"
        },
        company         : null,
        tempCompanyField: "",
        creationDate    : "2016-04-21T07:36:16.210Z",
        expectedRevenue : {
            currency: "$",
            progress: null,
            value   : 12233
        },
        name            : "Test",
        isOpportunitie  : true
    };
    var fakeFilters = {
        _id : null,
        name: [
            {
                _id : "575e696a7f3384556ae3d11c",
                name: "Chilicon IT "
            },
            {
                _id : "575ab7eb3319da9d6ac1c140",
                name: "ITFarm "
            },
            {
                _id : "575987cb9c10be346a160f20",
                name: "Pazam "
            }
        ],

        country: [
            {
                _id : "Thailand",
                name: "Thailand"
            },
            {
                _id : "New Zeland",
                name: "New Zeland"
            },
            {
                _id : "France",
                name: "France"
            }
        ],

        services: [
            {
                name: "Supplier",
                _id : "isSupplier"
            },
            {
                name: "Customer",
                _id : "isCustomer"
            }
        ]
    };
    var fakeResponseSavedFilter = {
        "success": {
            "_id"            : "52203e707d4dba8813000003",
            "__v"            : 0,
            "attachments"    : [],
            "lastAccess"     : "2016-06-30T09:41:45.294Z",
            "profile"        : 1387275598000,
            "relatedEmployee": "55b92ad221e4b7c40f00004f",
            "savedFilters"   : [{
                "_id"        : "574335bb27725f815747d579",
                "contentType": null,
                "byDefault"  : true
            }, {
                "_id"        : "576140b0db710fca37a2d950",
                "contentType": null,
                "byDefault"  : false
            }, {
                "_id"        : "5761467bdb710fca37a2d951",
                "contentType": null,
                "byDefault"  : false
            }, {
                "_id"        : "57615278db710fca37a2d952",
                "contentType": null,
                "byDefault"  : false
            }, {
                "_id"        : "576be27e8833d3d250b617a5",
                "contentType": "Leads",
                "byDefault"  : false
            }, {
                "_id"        : "576beedfa96be05a77ce0267",
                "contentType": "Leads",
                "byDefault"  : false
            }, {
                "_id"        : "576bfd2ba96be05a77ce0268",
                "contentType": "Persons",
                "byDefault"  : false
            }, {
                "_id"        : "576d4c74b4d90a5a6023e0bf",
                "contentType": "customerPayments",
                "byDefault"  : false
            }, {
                "_id"        : "577221ca58982a9011f8a580",
                "contentType": "journalEntry",
                "byDefault"  : false
            }, {
                "_id"        : "57722e0458982a9011f8a581",
                "contentType": "Opportunities",
                "byDefault"  : false
            }, {
                "_id"        : "57738eb0f2ec5e1517865733",
                "contentType": "salesQuotations",
                "byDefault"  : false
            }, {
                "_id"        : "5773914af2ec5e1517865734",
                "contentType": "salesInvoices",
                "byDefault"  : false
            }, {
                "_id"        : "5773be29d523f12a494382a9",
                "contentType": "supplierPayments",
                "byDefault"  : false
            }, {
                "_id"        : "5773e113d523f12a494382ac",
                "contentType": "wTrack",
                "byDefault"  : false
            }, {"_id": "5774fe5392d2b3d40ef1f5fe", "contentType": "Companies", "byDefault": false}],
            "kanbanSettings" : {
                "tasks"        : {"foldWorkflows": ["Empty"], "countPerPage": 10},
                "applications" : {"foldWorkflows": ["Empty"], "countPerPage": 87},
                "opportunities": {"foldWorkflows": ["Empty"], "countPerPage": 10}
            },
            "credentials"    : {"access_token": "", "refresh_token": ""},
            "pass"           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
            "email"          : "info@thinkmobiles.com",
            "login"          : "admin"
        }
    };
    var view;
    var formView;
    var thumbnailsView;
    var listView;
    var topBarView;
    var editView;
    var companiesCollection;
    var windowConfirmStub;
    var expect;
    var debounceStub;
    var ajaxSpy;
    var selectSpy;
    var removeFilterSpy;
    var saveFilterSpy;
    var removedFromDBSpy;
    var clock;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('CompaniesView', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            clock = sinon.useFakeTimers();
            windowConfirmStub = sinon.stub(window, 'confirm');
            windowConfirmStub.returns(true);
            debounceStub = sinon.stub(_, 'debounce', function (debounceFunction) {
                return debounceFunction;
            });
            ajaxSpy = sinon.spy($, 'ajax');
            selectSpy = sinon.spy(FilterGroup.prototype, 'selectValue');
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
            saveFilterSpy = sinon.spy(SavedFilters.prototype, 'saveFilter');
            removedFromDBSpy = sinon.spy(SavedFilters.prototype, 'removeFilterFromDB');
        });

        after(function () {
            view.remove();
            thumbnailsView.remove();
            listView.remove();
            topBarView.remove();
            formView.remove();
            editView.remove();

            if ($('.ui-dialog').length) {
                $('.ui-dialog').remove();
            }

            debounceStub.restore();
            windowConfirmStub.restore();
            ajaxSpy.restore();
            selectSpy.restore();
            removeFilterSpy.restore();
            saveFilterSpy.restore();
            removedFromDBSpy.restore();
            clock.restore();
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

                view = new MainView({el: $elFixture, contentType: 'Companies'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="50"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="50"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Companies');
            });
        });

        describe('TopBar View', function () {
            var server;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to fetch collection with 401 error', function () {
                var companyUrl = new RegExp('\/companies\/list', 'i');

                server.respondWith('GET', companyUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);

                companiesCollection = new CompaniesCollection({
                    contentType  : 'Companies',
                    count        : 100,
                    filter       : null,
                    newCollection: false,
                    viewType     : 'list'
                });

                server.respond();
            });

            it('Try to create TopBarView', function () {
                var $topBarEl;
                var $createBtnEl;
                var companyUrl = new RegExp('\/companies\/', 'i');

                server.respondWith('GET', companyUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCompaniesList)]);
                companiesCollection = new CompaniesCollection({
                    contentType: 'Companies',
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 3,
                    reset      : true,
                    showMore   : false
                });
                server.respond();

                expect(companiesCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    collection: companiesCollection
                });

                $topBarEl = topBarView.$el;
                $createBtnEl = $topBarEl.find('#createBtnHolder');

                expect($topBarEl).to.exist;
                expect($createBtnEl).to.exist;
            });


            it('Try to change view type (Thumbnails, List)', function () {
                var $topBarEl = topBarView.$el;
                var $listBtn = $topBarEl.find('a[data-view-type="list"]');
                var $thumbnailsBtn = $topBarEl.find('a[data-view-type="thumbnails"]');

                $listBtn.click();

                expect(window.location.hash).to.equals('#easyErp/Companies/list');

                $thumbnailsBtn.click();

                expect(window.location.hash).to.equals('#easyErp/Companies/thumbnails');
            });
        });

        describe('Companies list View', function () {
            var server;
            var $thisEl;

            before(function () {
                server = sinon.fakeServer.create();
            });

            after(function () {
                server.restore();
            });

            it('Try to create companies list view', function (done) {
                var companiesAlphabetUrl = new RegExp('\/customers\/getCompaniesAlphabet', 'i');
                var filterUrl = '/filter/Companies';
                var $searchContainerEl;
                var $alphabetEl;
                var $firstRow;
                var colCount;
                var name;
                var email;
                var phone;
                var country;
                var createdBy;
                var editedBy;
                var $pagination;
                var $currentPageList;

                server.respondWith('GET', filterUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilters)]);
                server.respondWith('GET', companiesAlphabetUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeAlphabet)]);
                listView = new ListView({
                    collection: companiesCollection,
                    startTime : new Date()
                });
                server.respond();

                clock.tick(700);

                eventsBinder.subscribeTopBarEvents(topBarView, listView);
                eventsBinder.subscribeCollectionEvents(companiesCollection, listView);

                companiesCollection.trigger('fetchFinished', {
                    totalRecords: companiesCollection.totalRecords,
                    currentPage : companiesCollection.currentPage,
                    pageSize    : companiesCollection.pageSize
                });

                $thisEl = listView.$el;
                $searchContainerEl = $thisEl.find('.search-view');
                $alphabetEl = $thisEl.find('#startLetter');

                expect($searchContainerEl).to.exist;
                expect($alphabetEl).to.exist;
                expect($thisEl.find('table')).to.exist;
                expect($thisEl.find('table')).to.have.class('list');
                expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);

                $firstRow = $thisEl.find('#listTable > tr').first();
                colCount = $firstRow.find('td').length;

                expect(colCount).to.be.equals(8);

                name = $firstRow.find('td:nth-child(3)').text().trim();
                expect(name).not.to.be.empty;
                expect(name).to.not.match(/object Object|undefined/);

                email = $firstRow.find('td:nth-child(4)').text().trim();
                expect(email).to.not.match(/object Object|undefined/);

                phone = $firstRow.find('td:nth-child(5)').text().trim();
                expect(phone).to.not.match(/object Object|undefined/);

                country = $firstRow.find('td:nth-child(6)').text().trim();
                expect(country).to.not.match(/object Object|undefined/);

                createdBy = $firstRow.find('td:nth-child(7)').text().trim();
                expect(createdBy).not.to.be.empty;
                expect(createdBy).to.not.match(/object Object|undefined/);

                editedBy = $firstRow.find('td:nth-child(8)').text().trim();
                expect(editedBy).not.to.be.empty;
                expect(editedBy).to.not.match(/object Object|undefined/);

                // pagination test

                $pagination = $thisEl.find('.pagination');

                expect($pagination).to.exist;
                expect($pagination.find('.countOnPage')).to.be.exist;
                expect($pagination.find('.pageList')).to.be.exist;

                $currentPageList = $thisEl.find('.currentPageList');
                $currentPageList.mouseover();
                expect($thisEl.find('#pageList')).to.have.css('display', 'block');
                expect($thisEl.find('#pageList > li')).to.have.lengthOf(7);

                $currentPageList.mouseover();
                expect($thisEl.find('#pageList')).to.have.css('display', 'none');

                done();
            });

            it('Try to change page1 to page2', function () {
                var $currentPageList = $thisEl.find('.currentPageList');
                var ajaxResponse;
                var $page2Btn;

                ajaxSpy.reset();

                $currentPageList.mouseover();
                $page2Btn = $thisEl.find('#pageList > li').eq(1);
                $page2Btn.click();
                server.respond();

                ajaxResponse = ajaxSpy.args[0][0];
                expect(ajaxSpy.called).to.be.true;
                expect(ajaxResponse).to.have.property('url', '/companies/');
                expect(ajaxResponse.data).to.have.property('contentType').and.to.not.undefined;
                expect(ajaxResponse.data).to.have.property('page', 2);
            });

            it('Try to select 25 items per page', function () {
                var $pagination = $thisEl.find('.pagination');
                var $needBtn = $pagination.find('.pageList > a').first();
                var ajaxResponse;

                ajaxSpy.reset();

                $needBtn.click();
                server.respond();

                ajaxResponse = ajaxSpy.args[0][0];

                expect(ajaxResponse.data).to.be.exist;
                expect(ajaxResponse.data).to.have.property('page', 1);
                expect(ajaxResponse.data).to.have.property('count', '25');
            });

            it('Try to select 50 items per page', function () {
                var $pagination = $thisEl.find('.pagination');
                var $needBtn = $pagination.find('.pageList > a').eq(1);
                var ajaxResponse;

                ajaxSpy.reset();

                $needBtn.click();
                server.respond();

                ajaxResponse = ajaxSpy.args[0][0];

                expect(ajaxResponse.data).to.be.exist;
                expect(ajaxResponse.data).to.have.property('page', 1);
                expect(ajaxResponse.data).to.have.property('count', '50');
            });

            it('Try to select 100 items per page', function () {
                var $pagination = $thisEl.find('.pagination');
                var $needBtn = $pagination.find('.pageList > a').eq(2);
                var ajaxResponse;

                ajaxSpy.reset();

                $needBtn.click();
                server.respond();

                ajaxResponse = ajaxSpy.args[0][0];

                expect(ajaxResponse.data).to.be.exist;
                expect(ajaxResponse.data).to.have.property('page', 1);
                expect(ajaxResponse.data).to.have.property('count', '100');
            });

            it('Try to select 200 items per page', function () {
                var $pagination = $thisEl.find('.pagination');
                var $needBtn = $pagination.find('.pageList > a').eq(3);
                var ajaxResponse;

                ajaxSpy.reset();

                $needBtn.click();
                server.respond();

                ajaxResponse = ajaxSpy.args[0][0];

                expect(ajaxResponse.data).to.be.exist;
                expect(ajaxResponse.data).to.have.property('page', 1);
                expect(ajaxResponse.data).to.have.property('count', '200');
            });

            it('Try to filter listView by name and country', function () {
                var firstValue = 'name';
                var secondValue = 'country';
                var contentType = 'Companies';
                var $searchContainer = $thisEl.find('#searchContainer');
                var $searchArrow = $searchContainer.find('.search-content');
                var contentUrl = new RegExp('/companies/', 'i');
                var $firstContainer = '#nameFullContainer .groupName';
                var $firstSelector = '#nameUl > li:nth-child(1)';
                var $secondContainer = '#countryFullContainer .groupName';
                var $secondSelector = '#countryUl > li:nth-child(1)';
                var elementQuery = '#listTable > tr';
                var url = '/companies/';
                var $firstGroup;
                var $secondGroup;
                var elementsCount;
                var $selectedItem;
                var ajaxResponse;
                var filterObject;

                selectSpy.reset();

                // open filter dropdown
                $searchArrow.click();
                expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                // select firstGroup filter
                ajaxSpy.reset();
                $firstGroup = $searchContainer.find($firstContainer);
                $firstGroup.click();

                $selectedItem = $searchContainer.find($firstSelector);

                server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCompaniesList)]);
                $selectedItem.click();
                server.respond();

                expect(selectSpy.calledOnce).to.be.true;
                expect($thisEl.find('#searchContainer')).to.exist;
                //expect($thisEl.find('#startLetter')).to.exist;
                expect($searchContainer.find('#searchFilterContainer>div')).to.have.lengthOf(1);
                expect($searchContainer.find($firstSelector)).to.have.class('checkedValue');
                elementsCount = $thisEl.find(elementQuery).length;
                expect(elementsCount).to.be.not.equals(0);

                expect(ajaxSpy.calledOnce).to.be.true;

                ajaxResponse = ajaxSpy.args[0][0];
                expect(ajaxResponse).to.have.property('url', url);
                expect(ajaxResponse).to.have.property('type', 'GET');
                expect(ajaxResponse.data).to.have.property('filter');
                filterObject = ajaxResponse.data.filter;

                expect(filterObject[firstValue]).to.exist;
                expect(filterObject[firstValue]).to.have.property('key', FILTER_CONSTANTS[contentType][firstValue].backend);
                expect(filterObject[firstValue]).to.have.property('value');
                expect(filterObject[firstValue].value)
                    .to.be.instanceof(Array)
                    .and
                    .to.have.lengthOf(1);

                // select secondGroup filter
                ajaxSpy.reset();

                $secondGroup = $thisEl.find($secondContainer);
                $secondGroup.click();
                $selectedItem = $searchContainer.find($secondSelector);
                $selectedItem.click();
                server.respond();

                expect(selectSpy.calledTwice).to.be.true;
                expect($thisEl.find('#searchContainer')).to.exist;
                //expect($thisEl.find('#startLetter')).to.exist;
                expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(2);
                expect($searchContainer.find($secondSelector)).to.have.class('checkedValue');
                elementsCount = $thisEl.find(elementQuery).length;
                expect(elementsCount).to.be.not.equals(0);

                ajaxResponse = ajaxSpy.args[0][0];
                expect(ajaxResponse).to.have.property('url', url);
                expect(ajaxResponse).to.have.property('type', 'GET');
                expect(ajaxResponse.data).to.have.property('filter');
                filterObject = ajaxResponse.data.filter;

                expect(filterObject[firstValue]).to.exist;
                expect(filterObject[secondValue]).to.exist;
                expect(filterObject[secondValue]).to.have.property('key', FILTER_CONSTANTS[contentType][secondValue].backend);
                expect(filterObject[secondValue]).to.have.property('value');
                expect(filterObject[secondValue].value)
                    .to.be.instanceof(Array)
                    .and
                    .to.have.lengthOf(1);

                // unselect secondGroup filter
                $selectedItem = $searchContainer.find($secondSelector);
                $selectedItem.click();
                server.respond();

                expect(selectSpy.calledThrice).to.be.true;
                expect($thisEl.find('#searchContainer')).to.exist;
                //expect($thisEl.find('#startLetter')).to.exist;
                expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
                expect($searchContainer.find($secondSelector)).to.have.not.class('checkedValue');
                elementsCount = $thisEl.find(elementQuery).length;
                expect(elementsCount).to.be.not.equals(0);

                ajaxResponse = ajaxSpy.args[0][0];
                expect(ajaxResponse).to.have.property('url', url);
                expect(ajaxResponse).to.have.property('type', 'GET');
                expect(ajaxResponse.data).to.have.property('filter');
                filterObject = ajaxResponse.data.filter;

                expect(filterObject[firstValue]).to.exist;
                expect(filterObject[secondValue]).to.not.exist;
            });

            it('Try to save filter', function () {
                var $searchContainer = $('#searchContainer');
                var userUrl = new RegExp('\/users\/', 'i');
                var $searchArrow = $searchContainer.find('.search-content');
                var $favoritesBtn;
                var $filterNameInput;
                var $saveFilterBtn;

                saveFilterSpy.reset();

                $searchArrow.click();
                expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                $favoritesBtn = $searchContainer.find('.filter-dialog-tabs > li:nth-child(2)');
                $favoritesBtn.click();
                expect($searchContainer.find('#filtersContent')).to.have.class('hidden');

                $filterNameInput = $searchContainer.find('#forFilterName');
                $filterNameInput.val('TestFilter');
                $saveFilterBtn = $searchContainer.find('#saveFilterButton');

                server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeResponseSavedFilter)]);
                $saveFilterBtn.click();
                server.respond();

                expect(saveFilterSpy.called).to.be.true;
                expect($searchContainer.find('#savedFiltersElements > li')).to.have.lengthOf(1);
                expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
            });

            it('Try to remove saved filters', function () {
                var $searchContainer = $('#searchContainer');
                var $deleteSavedFilterBtn = $searchContainer.find('#savedFiltersElements > li:nth-child(1) > button.removeSavedFilter');
                var userUrl = new RegExp('\/users\/', 'i');

                removedFromDBSpy.reset();

                server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $deleteSavedFilterBtn.click();
                server.respond();

                expect(removedFromDBSpy.calledOnce).to.be.true;
                expect($searchContainer.find('#savedFiltersElements > li')).to.have.lengthOf(0);
            });

            it('Try to remove filter', function () {
                var secondValue = 'country';
                var $searchContainer = $('#searchContainer');
                var $searchArrow = $searchContainer.find('.search-content');
                var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
                var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
                var $secondGroup;
                var $selectedItem;
                var $removeBtn;
                var ajaxResponse;
                var ajaxFilter;

                $searchArrow.click();

                $secondGroup = $thisEl.find($secondContainer);
                $secondGroup.click();
                $selectedItem = $searchContainer.find($secondSelector);
                $selectedItem.click();
                server.respond();

                // remove firstGroupFilter
                ajaxSpy.reset();
                removeFilterSpy.reset();

                $removeBtn = $searchContainer.find('.removeValues').eq(1);
                $removeBtn.click();
                server.respond();

                expect(removeFilterSpy.calledOnce).to.be.true;
                expect(ajaxSpy.calledOnce).to.be.true;

                ajaxResponse = ajaxSpy.args[0][0];
                ajaxFilter = ajaxResponse.data.filter;
                expect(ajaxFilter).to.not.have.property(secondValue);
            });
        });

        describe('Companies thumbnail view', function () {
            var companiesCollection;
            var server;
            var $thisEl;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();

                delete App.filtersObject.filter;
            });

            after(function () {
                server.restore();
                clock.restore();
            });

            it('Try to create persons thumbnails view', function (done) {
                var companiesThumbUrl = new RegExp('\/companies\/', 'i');
                var companiesAlphabetUrl = new RegExp('\/customers\/getCompaniesAlphabet', 'i');
                var filterUrl = '/filter/Companies';
                var $searchContainerEl;
                var $alphabetEl;
                var $firstEl;
                var $avatarHolder;
                var $infoHolder;
                var $gotoFormEl;
                var $gotoFormInfoEl;
                var $showMoreBtn;

                server.respondWith('GET', companiesThumbUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCompaniesThumb)]);
                companiesCollection = new CompaniesCollection({
                    contentType: 'Companies',
                    filter     : null,
                    count      : 3,
                    reset      : true,
                    viewType   : 'thumbnails'
                });
                server.respond();
                expect(companiesCollection).to.have.lengthOf(3);


                server.respondWith('GET', filterUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilters)]);
                server.respondWith('GET', companiesAlphabetUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeAlphabet)]);
                thumbnailsView = new ThumbnailsView({
                    collection: companiesCollection,
                    startTime : new Date()
                });
                server.respond();

                clock.tick(700);

                eventsBinder.subscribeTopBarEvents(topBarView, thumbnailsView);
                eventsBinder.subscribeCollectionEvents(companiesCollection, thumbnailsView);

                companiesCollection.trigger('fetchFinished', {
                    totalRecords: companiesCollection.totalRecords,
                    currentPage : companiesCollection.currentPage,
                    pageSize    : companiesCollection.pageSize
                });

                $thisEl = thumbnailsView.$el;
                $searchContainerEl = $thisEl.find('#searchContainer');
                $alphabetEl = $thisEl.find('#startLetter');

                expect($searchContainerEl).to.exist;
                expect($alphabetEl).to.exist;
                expect($thisEl.find('.thumbnailwithavatar'))
                    .to.have.lengthOf(3);

                $firstEl = $thisEl.find('.thumbnailwithavatar').first();

                $avatarHolder = $firstEl.find('.avatar');
                $infoHolder = $firstEl.find('.info');

                expect($avatarHolder).to.exist;
                expect($infoHolder).to.exist;

                $gotoFormEl = $avatarHolder.find('a');
                expect($gotoFormEl).to.exist;
                expect($gotoFormEl).to.have.class('gotoForm');
                expect($gotoFormEl)
                    .to.have.attr('data-id')
                    .and
                    .not.be.empty;
                expect($gotoFormEl.attr('href')).to.match(/#easyErp\/Companies\/form\//);
                expect($gotoFormEl.find('img')).to.exist;

                $gotoFormInfoEl = $infoHolder.find('a');
                expect($gotoFormInfoEl).to.exist;
                expect($gotoFormInfoEl).to.have.class('gotoForm');
                expect($gotoFormInfoEl.attr('href')).to.match(/#easyErp\/Companies\/form\//);
                expect($gotoFormInfoEl)
                    .to.have.attr('data-id')
                    .and
                    .not.be.empty;

                $showMoreBtn = $thisEl.find('#showMore');
                expect($showMoreBtn).to.exist;

                done();
            });

            it('Try to showMore content', function () {
                var $showMoreBtn = $thisEl.find('#showMore');
                var $searchContainerEl;
                var $alphabetEl;

                $showMoreBtn.click();
                server.respond();

                $searchContainerEl = $thisEl.find('.search-view');
                $alphabetEl = $thisEl.find('#startLetter');

                expect($searchContainerEl).to.exist;
                expect($alphabetEl).to.exist;
                expect($thisEl.find('.thumbnailwithavatar').length).to.be.equals(6);
                expect($thisEl.find('#showMore')).to.exist;
            });

            it('Try to click alphabetic letter', function () {
                var $searchContainerEl;
                var $alphabetEl;
                var $thisEl = thumbnailsView.$el;
                var $letterEl = $thisEl.find('#startLetter a:nth-child(4)');
                var $allLetter = $thisEl.find('#startLetter a:nth-child(1)');

                $letterEl.click();
                server.respond();

                $searchContainerEl = $thisEl.find('.search-view');
                $alphabetEl = $thisEl.find('#startLetter');

                expect($searchContainerEl).to.exist;
                expect($alphabetEl).to.exist;
                expect($thisEl.find('.thumbnailwithavatar').length).to.be.equals(3);
                expect($thisEl.find('#showMore')).to.exist;

                $allLetter.click();
                server.respond();
                $searchContainerEl = $thisEl.find('.search-view');
                $alphabetEl = $thisEl.find('#startLetter');

                expect($searchContainerEl).to.exist;
                expect($alphabetEl).to.exist;
                expect($thisEl.find('.thumbnailwithavatar').length).to.be.equals(3);
                expect($thisEl.find('#showMore')).to.exist;
            });

            it('Try to filter listView by name and country', function () {
                var firstValue = 'country';
                var secondValue = 'services';
                var contentType = 'Companies';
                var url = '/companies/';

                var $searchContainer = $thisEl.find('#searchContainer');
                var $searchArrow = $searchContainer.find('.search-content');
                var contentUrl = new RegExp(url, 'i');
                var $firstContainer = '#' + firstValue + 'FullContainer .groupName';
                var $firstSelector = '#' + firstValue + 'Ul > li:nth-child(1)';
                var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
                var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
                var elementQuery = '.thumbnailElement';
                var $firstGroup;
                var $secondGroup;
                var elementsCount;
                var $selectedItem;
                var ajaxResponse;
                var filterObject;

                selectSpy.reset();

                // open filter dropdown
                $searchArrow.click();
                expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                // select firstGroup filter
                ajaxSpy.reset();
                $firstGroup = $searchContainer.find($firstContainer);
                $firstGroup.click();

                $selectedItem = $searchContainer.find($firstSelector);

                server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCompaniesThumb)]);
                $selectedItem.click();
                server.respond();

                expect(selectSpy.calledOnce).to.be.true;
                expect($thisEl.find('#searchContainer')).to.exist;
                //expect($thisEl.find('#startLetter')).to.exist;
                expect($searchContainer.find('#searchFilterContainer>div')).to.have.lengthOf(1);
                expect($searchContainer.find($firstSelector)).to.have.class('checkedValue');
                elementsCount = $thisEl.find(elementQuery).length;
                expect(elementsCount).to.be.not.equals(0);

                ajaxResponse = ajaxSpy.args[0][0];
                expect(ajaxResponse).to.have.property('url', url);
                expect(ajaxResponse).to.have.property('type', 'GET');
                expect(ajaxResponse.data).to.have.property('filter');
                filterObject = ajaxResponse.data.filter;

                expect(filterObject[firstValue]).to.exist;
                expect(filterObject[firstValue]).to.have.property('key', FILTER_CONSTANTS[contentType][firstValue].backend);
                expect(filterObject[firstValue]).to.have.property('value');
                expect(filterObject[firstValue].value)
                    .to.be.instanceof(Array)
                    .and
                    .to.have.lengthOf(1);

                // select secondGroup filter
                ajaxSpy.reset();

                $secondGroup = $thisEl.find($secondContainer);
                $secondGroup.click();
                $selectedItem = $searchContainer.find($secondSelector);
                $selectedItem.click();
                server.respond();

                expect(selectSpy.calledTwice).to.be.true;
                expect($thisEl.find('#searchContainer')).to.exist;
                //expect($thisEl.find('#startLetter')).to.exist;
                expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(2);
                expect($searchContainer.find($secondSelector)).to.have.class('checkedValue');
                elementsCount = $thisEl.find(elementQuery).length;
                expect(elementsCount).to.be.not.equals(0);

                ajaxResponse = ajaxSpy.args[0][0];
                expect(ajaxResponse).to.have.property('url', url);
                expect(ajaxResponse).to.have.property('type', 'GET');
                expect(ajaxResponse.data).to.have.property('filter');
                filterObject = ajaxResponse.data.filter;

                expect(filterObject[firstValue]).to.exist;
                expect(filterObject[secondValue]).to.exist;
                expect(filterObject[secondValue]).to.have.property('key', FILTER_CONSTANTS[contentType][secondValue].backend);
                expect(filterObject[secondValue]).to.have.property('value');
                expect(filterObject[secondValue].value)
                    .to.be.instanceof(Array)
                    .and
                    .to.have.lengthOf(1);

                // unselect secondGroup filter

                ajaxSpy.reset();
                $selectedItem = $searchContainer.find($secondSelector);
                $selectedItem.click();
                server.respond();

                expect(selectSpy.calledThrice).to.be.true;
                expect($thisEl.find('#searchContainer')).to.exist;
                //expect($thisEl.find('#startLetter')).to.exist;
                expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
                expect($searchContainer.find($secondSelector)).to.have.not.class('checkedValue');
                elementsCount = $thisEl.find(elementQuery).length;
                expect(elementsCount).to.be.not.equals(0);

                ajaxResponse = ajaxSpy.args[0][0];
                expect(ajaxResponse).to.have.property('url', url);
                expect(ajaxResponse).to.have.property('type', 'GET');
                expect(ajaxResponse.data).to.have.property('filter');
                filterObject = ajaxResponse.data.filter;

                expect(filterObject[firstValue]).to.exist;
                expect(filterObject[secondValue]).to.not.exist;
            });

            it('Try to save filter', function () {
                var $searchContainer = $('#searchContainer');
                var userUrl = new RegExp('\/users\/', 'i');
                var $searchArrow = $searchContainer.find('.search-content');
                var $favoritesBtn;
                var $filterNameInput;
                var $saveFilterBtn;

                saveFilterSpy.reset();

                $searchArrow.click();
                expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                $favoritesBtn = $searchContainer.find('.filter-dialog-tabs > li:nth-child(2)');
                $favoritesBtn.click();
                expect($searchContainer.find('#filtersContent')).to.have.class('hidden');

                $filterNameInput = $searchContainer.find('#forFilterName');
                $filterNameInput.val('TestFilter');
                $saveFilterBtn = $searchContainer.find('#saveFilterButton');

                server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeResponseSavedFilter)]);
                $saveFilterBtn.click();
                server.respond();

                expect(saveFilterSpy.called).to.be.true;
                expect($searchContainer.find('#savedFiltersElements > li')).to.have.lengthOf(1);
                expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
            });

            it('Try to remove saved filters', function () {
                var $searchContainer = $('#searchContainer');
                var $deleteSavedFilterBtn = $searchContainer.find('#savedFiltersElements > li:nth-child(1) > button.removeSavedFilter');
                var userUrl = new RegExp('\/users\/', 'i');

                removedFromDBSpy.reset();

                server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $deleteSavedFilterBtn.click();
                server.respond();

                expect(removedFromDBSpy.calledOnce).to.be.true;
                expect($searchContainer.find('#savedFiltersElements > li')).to.have.lengthOf(0);
            });

            it('Try to remove filter', function () {
                var secondValue = 'services';
                var $searchContainer = $('#searchContainer');
                var $searchArrow = $searchContainer.find('.search-content');
                var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
                var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
                var $secondGroup;
                var $selectedItem;
                var $removeBtn;
                var ajaxResponse;
                var ajaxFilter;

                $searchArrow.click();

                $secondGroup = $thisEl.find($secondContainer);
                $secondGroup.click();
                $selectedItem = $searchContainer.find($secondSelector);
                $selectedItem.click();
                server.respond();

                // remove firstGroupFilter
                ajaxSpy.reset();
                removeFilterSpy.reset();

                $removeBtn = $searchContainer.find('.removeValues').eq(1);
                $removeBtn.click();
                server.respond();

                expect(removeFilterSpy.calledOnce).to.be.true;
                ajaxResponse = ajaxSpy.args[0][0];
                ajaxFilter = ajaxResponse.data.filter;
                expect(ajaxFilter).to.not.have.property(secondValue);
            });
        });

        describe('Form View', function () {
            var companyModel;
            var server;
            var mainSpy;
            var clock;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                clock.restore();

                editView.remove();
            });

            it('Try to open form', function (done) {
                var companyIdUrl = new RegExp('\/companies', 'i');
                var $contentHolder;

                companyModel = new CompanyModel();

                companyModel.urlRoot = companyModel.url() + '55b92ad521e4b7c40f00060d';

                server.respondWith('GET', companyIdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCompanyWithId)]);

                companyModel.fetch({
                    success: function (model) {

                        expect(model).to.be.instanceOf(Object);

                        formView = new FormView({
                            model    : model,
                            startTime: new Date()
                        });

                        server.respondWith('GET', '/opportunities/OpportunitiesForMiniView?person=&company=55b92ad521e4b7c40f00060d&page=1&count=4&onlyCount=true', [200, {'Content-Type': 'application/json'}, JSON.stringify({listLength: 5})]);
                        server.respondWith('GET', '/opportunities/OpportunitiesForMiniView?person=&company=55b92ad521e4b7c40f00060d&page=1&count=4&onlyCount=false', [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunitiesForFormView)]);
                        server.respondWith('GET', '/persons/getPersonsForMiniView?companyId=55b92ad521e4b7c40f00060d&page=1&count=4&onlyCount=true', [200, {'Content-Type': 'application/json'}, JSON.stringify({listLength: 98})]);
                        server.respondWith('GET', '/persons/getPersonsForMiniView?companyId=55b92ad521e4b7c40f00060d&page=1&count=4&onlyCount=false', [200, {'Content-Type': 'application/json'}, JSON.stringify(fakePersonsForMiveView)]);
                        formView.render();
                        server.respond();

                        eventsBinder.subscribeTopBarEvents(topBarView, formView);

                        done();
                    },

                    error: function (model, response) {
                        done(response);
                    }
                });

                server.respond();
                $contentHolder = formView.$el;

                expect($contentHolder).to.exist;
            });

            it('Try to click on pagination for opportunity miniView', function () {
                var $formEl = formView.$el;
                var $next = $formEl.find('.next');
                var $prev;
                var $last;
                var $first;
                var opportunityUrl = new RegExp('\/opportunities\/OpportunitiesForMiniView', 'i');

                expect($formEl.find('.prev')).to.have.class('not-active');
                expect($formEl.find('.first')).to.have.class('not-active');
                server.respondWith('GET', opportunityUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunitiesForFormView)]);
                $next.click();
                server.respond();
                expect($formEl.find('.next')).to.have.class('not-active');
                expect($formEl.find('.last')).to.have.class('not-active');

                $prev = $formEl.find('.prev');
                $prev.click();
                server.respond();
                expect($formEl.find('.prev')).to.have.class('not-active');
                expect($formEl.find('.first')).to.have.class('not-active');

                $last = $formEl.find('.last');
                $last.click();
                server.respond();
                expect($formEl.find('.next')).to.have.class('not-active');
                expect($formEl.find('.last')).to.have.class('not-active');

                $first = $formEl.find('.first');
                $first.click();
                server.respond();
                expect($formEl.find('.prev')).to.have.class('not-active');
                expect($formEl.find('.first')).to.have.class('not-active');
            });

            it('Try to click on pagination for persons miniView', function () {
                var $formEl = formView.$el;
                var $next = $formEl.find('.nextPersons');
                var $prev;
                var $last;
                var $first;
                var personsUrl = new RegExp('\/persons\/getPersonsForMiniView', 'i');

                server.respondWith('GET', personsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakePersnosForMiniView)]);
                expect($formEl.find('.prevPersons')).to.have.class('not-active');
                expect($formEl.find('.firstPersons')).to.have.class('not-active');

                $next.click();
                server.respond();
                expect($formEl.find('.prevPersons')).to.have.not.class('not-active');
                expect($formEl.find('.firstPersons')).to.have.not.class('not-active');

                $prev = $formEl.find('.prevPersons');
                $prev.click();
                server.respond();
                expect($formEl.find('.prevPersons')).to.have.class('not-active');
                expect($formEl.find('.firstPersons')).to.have.class('not-active');

                $last = $formEl.find('.lastPersons');
                $last.click();
                server.respond();
                expect($formEl.find('.nextPersons')).to.have.class('not-active');
                expect($formEl.find('.lastPersons')).to.have.class('not-active');

                $first = $formEl.find('.firstPersons');
                $first.click();
                server.respond();
                expect($formEl.find('.prevPersons')).to.have.class('not-active');
                expect($formEl.find('.firstPersons')).to.have.class('not-active');
            });

            it('Try to quick edit with error validate', function () {
                var $editSpan;
                var $editInput;
                var $saveSpan;
                var spyResponse;
                var $formHolder = formView.$el;
                var $editableEl = $($formHolder.find('.editable')[5]);
                var companyIdUrl = new RegExp('/Companies/', 'i');

                mainSpy.reset();

                $editableEl.mouseenter();
                $editSpan = $formHolder.find('#editSpan a');

                $editSpan.click();

                $editInput = $formHolder.find('#editInput');
                $saveSpan = $formHolder.find('#saveSpan');

                $editInput.val('vvsdas'); // not valid email
                server.respondWith('PATCH', companyIdUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(new Error())]);
                $saveSpan.click();
                server.respond();

                spyResponse = mainSpy.args[0][0];
                expect(spyResponse).to.have.property('type', 'error');
            });

            it('Try to quick edit', function () {
                var $editSpan;
                var $editInput;
                var $saveSpan;
                var $formHolder = formView.$el;
                var $editableEl = $($formHolder.find('.editable')[0]);
                var companyIdUrl = new RegExp('/Companies/', 'i');

                $editableEl.mouseenter();
                expect($editableEl.find('#editSpan')).to.exist;
                $editableEl.mouseleave();
                expect($editableEl.find('#editSpan')).to.not.exist;

                $editableEl.mouseenter();
                $editSpan = $formHolder.find('#editSpan a');

                $editSpan.click();

                $editInput = $formHolder.find('#editInput');
                $saveSpan = $formHolder.find('#saveSpan');

                $editInput.val('http://www.google.com');

                server.respondWith('PATCH', companyIdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    success: 'Customer updated'
                })]);

                $saveSpan.click();

                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Companies/form/55b92ad521e4b7c40f00060d');
            });

            it('Try to open Create opportunity form', function (done) {
                var $createOppBtn = formView.$el.find('.formRightColumn .btnHolder .add.opportunities');
                var userForDdUrl = new RegExp('\/users\/forDd', 'i');
                var depsForDdUrl = new RegExp('\/departments\/getForDD', 'i');
                var emplRelUserUrl = new RegExp('\/employees\/getForDdByRelatedUser', 'i');
                var customersUrl = new RegExp('\/customers\/', 'i');
                var workflowUrl = new RegExp('\/workflows\/getWorkflowsForDd', 'i');
                var taskUrl = new RegExp('\/tasks\/priority', 'i');
                var $dialog;

                server.respondWith('GET', userForDdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', emplRelUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplRelUser)]);
                server.respondWith('GET', customersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomers)]);
                server.respondWith('GET', workflowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWorkflowForDD)]);
                server.respondWith('GET', taskUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTaskPriority)]);
                $createOppBtn.click();
                server.respond();

                $dialog = $('.ui-dialog');
                expect($dialog).to.exist;
                expect($dialog.find('.dialog-tabs')).to.exist;
                expect($dialog.find('.dialog-tabs > li')).to.have.lengthOf(3);

                done();
            });

            it('Try to change tab', function () {
                var $dialog = $('.ui-dialog');
                var $firstTab = $dialog.find('.dialog-tabs > li:nth-child(1) > a');
                var $secondTab = $dialog.find('.dialog-tabs > li:nth-child(2) > a');
                var $thirdTab = $dialog.find('.dialog-tabs > li:nth-child(3) > a');

                expect($firstTab).to.have.class('active');

                $secondTab.click();
                expect($dialog.find('.dialog-tabs > li:nth-child(2) > a')).to.have.class('active');

                $thirdTab.click();
                expect($dialog.find('.dialog-tabs > li:nth-child(3) > a')).to.have.class('active');

                $firstTab.click();
                expect($dialog.find('.dialog-tabs > li:nth-child(1) > a')).to.have.class('active');
            });

            it('Try to save opportunity without need data', function () {
                var saveBtn = $('.btn')[6];
                var spyResponse;

                saveBtn.click();
                spyResponse = mainSpy.args[1][0];

                expect(spyResponse).to.have.property('type', 'error');

            });

            it('Try to save opportunity', function () {
                var $selectedItem;
                var $prev;
                var $next;
                var saveBtn = $('.btn')[6];
                var $form = $('.ui-dialog');
                var $customer = $form.find('#customerDd');

                $form.find('#name').val('test');
                $form.find('#internalNotes').val('test');
                $form.find('#expectedRevenueValue').val('10000');

                // select customers
                $customer.click();
                $next = $customer.find('.next');
                $next.click();
                $prev = $customer.find('.prev');
                $prev.click();
                $selectedItem = $customer.find('#55b92ad621e4b7c40f000637');
                $selectedItem.click();

                server.respondWith('POST', '/Opportunities/', [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    success: 'A new Opportunities create success',
                    id     : '123'
                })]);

                saveBtn.click();

                server.respond();

                $('.ui-dialog').remove();

                expect(window.location.hash).to.be.equals('#easyErp/Companies/form/55b92ad521e4b7c40f00060d');

            });

            it('Try to open editOpportunityForm with fetch model error', function () {
                var $formEl = formView.$el;
                var spyResponse;
                var $oppBtn = $formEl.find('#571882f0e611193c13905945');
                var oppFormUrl = new RegExp('\/Opportunities\/form');

                server.respondWith('GET', oppFormUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $oppBtn.click();
                server.respond();

                spyResponse = mainSpy.args[2][0];
                expect(spyResponse).to.have.property('type', 'error');
                expect(spyResponse).to.have.property('message', 'Please refresh browser');
            });

            it('Try to open editOpportunityForm', function () {
                var $formEl = formView.$el;
                var $oppBtn = $formEl.find('#571882f0e611193c13905945');
                var oppFormUrl = new RegExp('\/Opportunities\/form');

                server.respondWith('GET', oppFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunitiesById)]);
                $oppBtn.click();
                server.respond();

                expect($('.ui-dialog')).to.exist;
            });

            it('Try to edit opportunity', function () {
                var $selectedItem;
                var $prev;
                var $next;
                var saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                var $form = $('.ui-dialog');
                var $customer = $form.find('#customerDd');
                var opportunityUrl = new RegExp('\/Opportunities\/', 'i');

                $form.find('#name').val('test');
                $form.find('#internalNotes').val('test');
                $form.find('#expectedRevenueValue').val('10000');

                // select customers
                $customer.click();
                $next = $customer.find('.next');
                $next.click();
                $prev = $customer.find('.prev');
                $prev.click();
                $selectedItem = $customer.find('#55b92ad621e4b7c40f000637');
                $selectedItem.click();

                server.respondWith('PATCH', opportunityUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    success: 'A new Opportunities create success',
                    id     : '123'
                })]);

                saveBtn.click();

                server.respond();

                $('.ui-dialog').remove();

                expect(window.location.hash).to.be.equals('#easyErp/Companies/form/55b92ad521e4b7c40f00060d');
            });

            it('Try to add person', function () {
                var $createPersonBtn = formView.$el.find('.formRightColumn .btnHolder .add.persons');
                var userForDdUrl = new RegExp('\/users\/forDd', 'i');
                var depsForDdUrl = new RegExp('\/departments\/getForDD', 'i');
                var emplRelUserUrl = new RegExp('\/employees\/getForDdByRelatedUser', 'i');
                var employeeLangUrl = new RegExp('\/employees\/languages', 'i');
                var customersForDDUrl = new RegExp('\/customers\/getCompaniesForDd', 'i');
                var customersUrl = new RegExp('\/customers\/', 'i');

                server.respondWith('GET', userForDdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', emplRelUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplRelUser)]);
                server.respondWith('GET', employeeLangUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplLang)]);
                server.respondWith('GET', customersForDDUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomerForDD)]);
                server.respondWith('GET', customersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomers)]);

                $createPersonBtn.click();

                server.respond();
                server.respond();
                server.respond();
                server.respond();
                server.respond();
                server.respond();

                expect('.ui-dialog').to.exist;
            });

            it('Try to cancel PersonCreateForm', function () {
                var $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                $cancelBtn.click();
                expect($('.ui-dialog')).to.not.exist;
            });

            it('Try to save person', function () {
                var $selectedItem;
                var $next;
                var $prev;
                var $createBtn;
                var $form;
                var $secondTab;
                var $salesTeam;
                var $createPersonBtn = formView.$el.find('.formRightColumn .btnHolder .add.persons');

                $createPersonBtn.click();
                server.respond();

                expect('.ui-dialog').to.exist;
                $createBtn = $('#create-person-dialog');
                $form = $('.ui-dialog');
                $secondTab = $form.find('.dialog-tabs > li:nth-child(2) > a');
                $salesTeam = $form.find('#departmentDd');

                $secondTab.click();

                $salesTeam.click();
                $next = $salesTeam.find('.next');
                $next.click();
                $prev = $salesTeam.find('.prev');
                $prev.click();
                $selectedItem = $salesTeam.find('#55b92ace21e4b7c40f000012');
                $selectedItem.click();

                $form.find('#firstName').val('Test');
                $form.find('#lastName').val('Test');

                server.respondWith('POST', '/persons/', [201, {'Content-Type': 'application/json'}, JSON.stringify({
                    success: 'A new Person create success',
                    id     : '123'
                })]);
                $createBtn.click();
                server.respond();

                $('.ui-dialog').remove();
                expect(window.location.hash).to.be.equals('#easyErp/Persons');
            });

            it('Try to go to person form', function () {
                var $gotoPersonBtn = $('#persons p > a');

                $gotoPersonBtn.click();
                expect(window.location.hash).to.equals('#easyErp/Persons/form/55b92ad521e4b7c40f00060c');
            });

            // create Edit form into
            it('Try to click edit button', function () {
                var $contentHolderEl;
                var userForDdUrl = new RegExp('\/users\/forDd', 'i');
                var depsForDdUrl = new RegExp('\/departments\/getForDD', 'i');
                var emplLangUrl = new RegExp('\/employees\/languages', 'i');
                var emplRelUserUrl = new RegExp('\/employees\/getForDdByRelatedUser', 'i');
                var customersUrl = new RegExp('\/customers\/', 'i');

                server.respondWith('GET', userForDdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', emplLangUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplLang)]);
                server.respondWith('GET', emplRelUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplRelUser)]);
                server.respondWith('GET', customersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomers)]);
                editView = new EditView({
                    model: companyModel
                });
                server.respond();

                $contentHolderEl = editView.$el;

                expect($contentHolderEl).to.exist;
            });

            it('Try to change tab', function () {
                var $tabEl = $('.dialog-tabs a');
                var $firstTab = $($tabEl[0]);
                var $secondTab = $($tabEl[1]);
                var $thirdTab = $($tabEl[2]);

                expect($firstTab).to.have.class('active');

                $secondTab.click();
                expect($secondTab).to.have.class('active');

                $thirdTab.click();
                expect($thirdTab).to.have.class('active');
            });

            it('Try to PATCH company with error', function () {
                var spyResponse;
                var editBtn = $('.ui-button')[1];
                var $form = $('.dialog-tabs-item');

                $form.find('#name').val('');

                editBtn.click();
                spyResponse = mainSpy.args[3][0];

                expect(spyResponse).to.have.property('type', 'error');
            });

            it('Try to delete company with 403 error', function () {
                var deleteBtn = $('.ui-button')[3];
                var companiesUrl = new RegExp('\/Companies\/', 'i');
                var spyResponse;

                server.respondWith('DELETE', companiesUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify(new Error())]);

                deleteBtn.click();

                server.respond();
                spyResponse = mainSpy.args[4][0];

                expect(spyResponse).to.have.property('type', 'error');
            });

            it('Try to delete company', function () {
                var deleteBtn = $('.ui-button')[3];
                var companiesUrl = new RegExp('\/Companies\/', 'i');

                server.respondWith('DELETE', companiesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'customer removed'})]);
                deleteBtn.click();
                server.respond();

                expect(window.location.hash).to.equals('#easyErp/Companies');
            });

            it('Try to PATCH company', function () {
                var $salesTeam;
                var editBtn;
                var $form;
                var $selectBtn;
                var companiesUrl = new RegExp('\/Companies\/', 'i');
                var userForDdUrl = new RegExp('\/users\/forDd', 'i');
                var depsForDdUrl = new RegExp('\/departments\/getForDD', 'i');
                var emplLangUrl = new RegExp('\/employees\/languages', 'i');
                var emplRelUserUrl = new RegExp('\/employees\/getForDdByRelatedUser', 'i');
                var customersUrl = new RegExp('\/customers\/', 'i');

                server.respondWith('GET', userForDdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', emplLangUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplLang)]);
                server.respondWith('GET', emplRelUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplRelUser)]);
                server.respondWith('GET', customersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomers)]);

                editView = new EditView({
                    model: companyModel
                });

                server.respond();

                editBtn = $('.ui-button')[1];
                $form = $('.dialog-tabs-item');
                $selectBtn = $('.current-selected')[1];

                $form.find('#name').val('testCompany');
                $selectBtn.click();
                $salesTeam = $('#departmentDd .newSelectList li')[0];
                $salesTeam.click();

                server.respondWith('PUT', companiesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    id: '123'
                })]);
                editBtn.click();
                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Companies/form/55b92ad521e4b7c40f00060d');
            });

            it('Try to close dialog', function () {
                var cancelBtn;
                var $contentHolder;
                var userForDdUrl = new RegExp('\/users\/forDd', 'i');
                var depsForDdUrl = new RegExp('\/departments\/getForDD', 'i');
                var emplLangUrl = new RegExp('\/employees\/languages', 'i');
                var emplRelUserUrl = new RegExp('\/employees\/getForDdByRelatedUser', 'i');
                var customersUrl = new RegExp('\/customers\/', 'i');

                server.respondWith('GET', userForDdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', emplLangUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplLang)]);
                server.respondWith('GET', emplRelUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplRelUser)]);
                server.respondWith('GET', customersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomers)]);

                editView = new EditView({
                    model: companyModel
                });

                server.respond();

                $contentHolder = editView.$el;
                cancelBtn = $('.ui-button')[2];

                expect($contentHolder).to.have.class('ui-dialog-content');

                cancelBtn.click();

                $contentHolder = editView.$el;

                expect($contentHolder).to.not.have.class('ui-dialog-content');

            });

            it('Try to delete company from the form with 403 error', function () {
                var spyResponse;
                var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                var companyUrl = new RegExp('\/Companies\/', 'i');

                server.respondWith('DELETE', companyUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({success: 'customer removed'})]);
                $deleteBtn.click();
                server.respond();

                spyResponse = mainSpy.args[5][0];
                expect(spyResponse).to.have.property('type', 'error');
            });

            it('Try to delete company from the form', function () {
                var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                var companyUrl = new RegExp('\/Companies\/', 'i');

                server.respondWith('DELETE', companyUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'customer removed'})]);
                $deleteBtn.click();
                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Companies/thumbnails');
            });

        });

        describe('Company create view', function () {
            var server;
            var mainSpy;
            var saveSpy;
            var alertStub;

            before(function () {
                mainSpy = sinon.spy(App, 'render');
                server = sinon.fakeServer.create();
                saveSpy = sinon.spy(CreateView.prototype, 'saveItem');
                alertStub = sinon.stub(window, 'alert');
                alertStub.returns(true);
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                saveSpy.restore();
                alertStub.restore();
            });

            it('Try to create CreateForm', function () {
                var userForDdUrl = new RegExp('\/users\/forDd', 'i');
                var depsForDdUrl = new RegExp('\/departments\/getForDD', 'i');
                var emplLangUrl = new RegExp('\/employees\/languages', 'i');
                var emplRelUserUrl = new RegExp('\/employees\/getForDdByRelatedUser', 'i');
                var customersUrl = new RegExp('\/customers\/', 'i');
                var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                var $dialog;

                server.respondWith('GET', userForDdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDdUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', emplLangUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplLang)]);
                server.respondWith('GET', emplRelUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplRelUser)]);
                server.respondWith('GET', customersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomers)]);
                expect($('#dialogContainer')).to.empty;
                $createBtn.click();
                server.respond();

                $dialog = $('.ui-dialog').first();
                expect($dialog).to.exist;
                expect($dialog.find('.dialog-tabs')).to.exist;
                expect($dialog.find('.dialog-tabs > li')).to.have.lengthOf(3);
                expect($dialog.find('.avatar')).to.exist;
                expect($dialog.find('.avatarInfoContainer')).to.exist;
                expect($dialog.find('.avatarInfoContainer  .half-block')).to.have.lengthOf(2);

                $('.ui-dialog').eq(1).remove();
            });

            it('Try to save lead without need data', function () {
                var createBtn = $('.ui-button')[1];
                var spyResponse;

                createBtn.click();

                spyResponse = mainSpy.args[0][0];
                expect(spyResponse).to.have.property('type', 'error');
            });

            it('Try to change tab', function () {
                var $tabEl = $('.dialog-tabs a');
                var $firstTab = $($tabEl[0]);
                var $secondTab = $($tabEl[1]);
                var $thirdTab = $($tabEl[2]);

                expect($firstTab).to.have.class('active');

                $secondTab.click();
                expect($secondTab).to.have.class('active');

                $thirdTab.click();
                expect($thirdTab).to.have.class('active');

                $firstTab.click();
                expect($($tabEl[0])).to.have.class('active');
            });

            it('Try to save company with empty company name', function () {
                var createBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.create-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)').first();
                var spyResponse;

                mainSpy.reset();

                createBtn.click();
                server.respond();

                spyResponse = mainSpy.args[0][0];
                expect(spyResponse).to.have.property('type', 'error');
                expect(spyResponse).to.have.property('message', 'Company field can not be empty');
            });

            it('Try to save company with error server response', function () {
                var createBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.create-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)').first();
                var $form = $('.dialog-tabs-item');
                var $selectBtn = $('.current-selected').first();
                var $salesTeam;

                $form.find('#companyName').val('test');
                $form.find('#website').val('test');
                $form.find('#email').val('test@test.com');
                $form.find('#LI').val('test.com');
                $form.find('#Facebook').val('test.com');
                $form.find('#phone').val('+363636363');
                $form.find('#mobile').val('+363636363');
                $form.find('#street').val('test');
                $form.find('#city').val('test');
                $form.find('#state').val('test');
                $form.find('#zip').val('88000');
                $form.find('#country').val('test');
                $selectBtn.click();

                $salesTeam = $('#departmentDd .newSelectList li')[0];
                $salesTeam.click();

                alertStub.reset();
                saveSpy.reset();

                server.respondWith('POST', '/companies/', [400, {'Content-Type': 'application/json'}, JSON.stringify({
                    success: 'A new Person crate success',
                    id     : '123'
                })]);
                createBtn.click();
                server.respond();

                expect(saveSpy.calledOnce).to.be.true;
                expect(alertStub.calledOnce).to.be.true;
            });

            it('Try to save company with correct data', function () {
                var createBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.create-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)').first();

                server.respondWith('POST', '/companies/', [201, {'Content-Type': 'application/json'}, JSON.stringify({
                    success: 'A new Person crate success',
                    id     : '123'
                })]);
                createBtn.click();
                server.respond();

                expect(saveSpy.calledTwice).to.be.true;
                expect(window.location.hash).to.be.equals('#easyErp/Companies');
            });
        });
    });
});
