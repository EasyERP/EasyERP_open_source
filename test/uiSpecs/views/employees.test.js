define([
    'Backbone',
    'Underscore',
    'text!fixtures/index.html',
    'models/EmployeesModel',
    'modules',
    'collections/Employees/filterCollection',
    'views/main/MainView',
    'views/Employees/list/ListView',
    'views/Employees/thumbnails/ThumbnailsView',
    'views/Employees/CreateView',
    'views/Employees/EditView',
    'views/Employees/TopBarView',
    'views/Filter/filterView',
    'views/Filter/filtersGroup',
    'views/Filter/savedFiltersView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'testConstants/filtersEmployees',
    'constants/filters'
], function (Backbone,
             _,
             fixtures,
             EmployeeModel,
             modules,
             EmployeeCollection,
             MainView,
             ListView,
             ThumbnailsView,
             CreateView,
             EditView,
             TopBarView,
             FilterView,
             FilterGroup,
             SavedFilters,
             eventsBinder,
             $,
             chai,
             chaiJquery,
             sinonChai,
             fakeFilters,
             FILTER_CONSTANTS) {
    'use strict';
    var expect;
    var fakeEmployeeForList = {
        total: 300,
        data : [
            {
                _id        : "560264bb8dc408c632000005",
                total      : 18,
                manager    : {
                    _id : "55b92ad221e4b7c40f00004f",
                    name: {
                        last : "Sokhanych",
                        first: "Alex"
                    }
                },
                jobPosition: {
                    _id : "55b92acf21e4b7c40f00002e",
                    name: "Account Manager"
                },
                department : {
                    _id : "55b92ace21e4b7c40f000014",
                    name: "BusinessDev"
                },
                createdBy  : {
                    user: "AndrianaLemko",
                    date: "2015-09-23T08:37:15.986Z"
                },
                editedBy   : {
                    user: "AnnaLobas",
                    date: "2016-04-18T12:27:57.499Z"
                },
                name       : {
                    last : "Lyakh",
                    first: "Anastas"
                },
                dateBirth  : "1991-06-30T00:00:00.000Z",
                skype      : "anastas4321",
                workEmail  : "anastas.lyakh@thinkmobiles.com",
                workPhones : {
                    phone : "",
                    mobile: "+380506730125"
                },
                jobType    : "fullTime",
                isEmployee : true
            },
            {
                _id        : "56029cc950de7f4138000005",
                total      : 18,
                manager    : {
                    _id : "55b92ad221e4b7c40f00004f",
                    name: {
                        last : "Sokhanych",
                        first: "Alex"
                    }
                },
                jobPosition: {
                    _id : "55b92acf21e4b7c40f00002e",
                    name: "Account Manager"
                },
                department : {
                    _id : "55b92ace21e4b7c40f000014",
                    name: "BusinessDev"
                },
                createdBy  : {
                    user: "AndrianaLemko",
                    date: "2015-09-23T12:36:25.361Z"
                },
                editedBy   : {
                    user: "AnnaLobas",
                    date: "2016-04-18T12:27:13.523Z"
                },
                name       : {
                    last : "Lendyel",
                    first: "Eugen"
                },
                dateBirth  : "1994-03-06T00:00:00.000Z",
                skype      : "zhenyalendel",
                workEmail  : "eugen.lendyel@thinkmobiles.com",
                workPhones : {
                    phone : "",
                    mobile: "+380950870448"
                },
                jobType    : "fullTime",
                isEmployee : true
            },
            {
                _id        : "5602a01550de7f4138000008",
                total      : 18,
                manager    : {
                    _id : "55b92ad221e4b7c40f00004f",
                    name: {
                        last : "Sokhanych",
                        first: "Alex"
                    }
                },
                jobPosition: {
                    _id : "55b92acf21e4b7c40f00002e",
                    name: "Account Manager"
                },
                department : {
                    _id : "55b92ace21e4b7c40f000014",
                    name: "BusinessDev"
                },
                createdBy  : {
                    user: "AndrianaLemko",
                    date: "2015-09-23T12:50:29.159Z"
                },
                editedBy   : {
                    user: "AnnaLobas",
                    date: "2016-04-18T12:26:27.887Z"
                },
                name       : {
                    last : "Dufynets",
                    first: "Yana"
                },
                dateBirth  : "1991-04-24T00:00:00.000Z",
                skype      : "janedoe2404",
                workEmail  : "yana.dufynets@thinkmobiles.com",
                workPhones : {
                    phone : "",
                    mobile: "+380990771049"
                },
                jobType    : "Full-time",
                isEmployee : true
            },
            {
                _id        : "561ba8639ebb48212ea838c4",
                total      : 18,
                manager    : {
                    _id : "55b92ad221e4b7c40f00004f",
                    name: {
                        last : "Sokhanych",
                        first: "Alex"
                    }
                },
                jobPosition: {
                    _id : "55b92acf21e4b7c40f00001f",
                    name: "Sales"
                },
                department : {
                    _id : "55b92ace21e4b7c40f000014",
                    name: "BusinessDev"
                },
                createdBy  : {
                    user: "MariaZasukhina",
                    date: "2015-10-12T12:32:35.919Z"
                },
                editedBy   : {
                    user: "AnnaLobas",
                    date: "2016-04-18T12:23:53.601Z"
                },
                name       : {
                    last : "Yartysh",
                    first: "Nataliya"
                },
                dateBirth  : "1992-10-05T00:00:00.000Z",
                skype      : "natalia_yartush",
                workEmail  : "natalia.yartysh@thinkmobiles.com",
                workPhones : {
                    phone : "",
                    mobile: "+380974628318"
                },
                jobType    : "fullTime",
                isEmployee : true
            },
            {
                _id        : "56e0408e4f9ff8e0737d7c52",
                total      : 18,
                manager    : {
                    _id : "55b92ad221e4b7c40f00005f",
                    name: {
                        last : "Voloshchuk",
                        first: "Peter"
                    }
                },
                jobPosition: {
                    _id : "55b92acf21e4b7c40f00002e",
                    name: "Account Manager"
                },
                department : {
                    _id : "55b92ace21e4b7c40f000014",
                    name: "BusinessDev"
                },
                createdBy  : {
                    user: "AndrianaLemko",
                    date: "2016-03-09T15:26:06.265Z"
                },
                editedBy   : {
                    user: "MariaZasukhina",
                    date: "2016-03-10T14:22:11.459Z"
                },
                name       : {
                    last : "Pylyp",
                    first: "Oksana"
                },
                dateBirth  : "1990-11-18T00:00:00.000Z",
                skype      : "oksanapylyp",
                workEmail  : "oksana.pylyp@thinkmobiles.com",
                workPhones : {
                    phone : "",
                    mobile: "+380665149801"
                },
                jobType    : "Full-time",
                isEmployee : true
            }
        ]
    };
    var fakeEmployeeForA = {
        data: [
            {
                _id        : "55c32e0d29bd6ccd0b000005",
                dateBirth  : "1992-02-11T00:00:00.000Z",
                jobType    : "fullTime",
                editedBy   : {
                    date: "2016-03-14T08:02:33.037Z",
                    user: {
                        _id            : "55ba2f3ed79a3a343900001d",
                        profile        : 1438158808000,
                        kanbanSettings : {
                            tasks        : {
                                foldWorkflows: [],
                                countPerPage : 10
                            },
                            applications : {
                                foldWorkflows: [],
                                countPerPage : 10
                            },
                            opportunities: {
                                foldWorkflows: [],
                                countPerPage : 10
                            }
                        },
                        credentials    : {
                            access_token : "",
                            refresh_token: ""
                        },
                        pass           : "ebe5ffd65e0e1de96e45a13e645646812c9ba15ba57d28a1cc3886365d948c26",
                        email          : "maria.zasukhina@thinkmobiles.com",
                        login          : "MariaZasukhina",
                        imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        __v            : 0,
                        lastAccess     : "2016-02-23T11:36:27.002Z",
                        savedFilters   : [],
                        relatedEmployee: null
                    }
                },
                createdBy  : {
                    date: "2015-08-06T09:51:09.567Z",
                    user: {
                        _id            : "55ba28c8d79a3a3439000016",
                        profile        : 1438158808000,
                        kanbanSettings : {
                            tasks        : {
                                foldWorkflows: [],
                                countPerPage : 10
                            },
                            applications : {
                                foldWorkflows: [],
                                countPerPage : 10
                            },
                            opportunities: {
                                foldWorkflows: [],
                                countPerPage : 10
                            }
                        },
                        credentials    : {
                            access_token : "",
                            refresh_token: ""
                        },
                        pass           : "e28ac09936a6b64abafe5870482de8ddd0b63cff921323ec91924d443afc907f",
                        email          : "andriana.lemko@thinkmobiles.com",
                        login          : "AndrianaLemko",
                        imageSrc       : "data:image/jpeg;base64,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",
                        __v            : 0,
                        lastAccess     : "2016-03-14T09:17:43.298Z",
                        savedFilters   : [],
                        relatedEmployee: null
                    }
                },
                manager    : {
                    _id           : "55b92ad221e4b7c40f000072",
                    dateBirth     : "1985-05-25T00:00:00.000Z",
                    ID            : 18,
                    isLead        : 2,
                    fire          : [
                        {
                            date       : "2013-09-05T21:00:00.000Z",
                            info       : "Update",
                            salary     : 1000,
                            jobType    : "Full-time",
                            manager    : "55b92ad221e4b7c40f00004f",
                            jobPosition: "55c32e2a29bd6ccd0b000006",
                            department : "56e175c4d62294582e10ca68"
                        }
                    ],
                    hire          : [
                        {
                            date       : "2013-09-05T21:00:00.000Z",
                            info       : "",
                            salary     : 1000,
                            jobType    : "Full-time",
                            manager    : "55b92ad221e4b7c40f00004f",
                            jobPosition: "55c32e2a29bd6ccd0b000006",
                            department : "56e175c4d62294582e10ca68"
                        },
                        {
                            date       : "2015-02-28T22:00:00.000Z",
                            info       : "",
                            salary     : 1200,
                            jobType    : "Full-time",
                            manager    : "55b92ad221e4b7c40f00004f",
                            jobPosition: "55c32e2a29bd6ccd0b000006",
                            department : "56e175c4d62294582e10ca68"
                        }
                    ],
                    social        : {
                        FB: "",
                        LI: ""
                    },
                    sequence      : 0,
                    jobType       : "Full-time",
                    gender        : "male",
                    marital       : "unmarried",
                    contractEnd   : {
                        date  : "2015-07-29T19:34:42.474Z",
                        reason: ""
                    },
                    attachments   : [],
                    editedBy      : {
                        date: "2016-03-11T13:44:38.409Z",
                        user: "55ba2f3ed79a3a343900001d"
                    },
                    createdBy     : {
                        date: "2015-07-29T19:34:42.474Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate  : "2015-07-29T19:34:42.474Z",
                    color         : "#4d5a75",
                    otherInfo     : "",
                    groups        : {
                        group: [],
                        users: [],
                        owner: "55ba28c8d79a3a3439000016"
                    },
                    whoCanRW      : "everyOne",
                    workflow      : null,
                    active        : false,
                    referredBy    : "",
                    source        : "",
                    age           : 30,
                    homeAddress   : {
                        country: "",
                        zip    : "",
                        state  : "",
                        city   : "",
                        street : ""
                    },
                    otherId       : "",
                    bankAccountNo : "",
                    nationality   : "Ukrainian",
                    coach         : null,
                    manager       : "55b92ad221e4b7c40f00004f",
                    jobPosition   : "55c32e2a29bd6ccd0b000006",
                    department    : "56e175c4d62294582e10ca68",
                    visibility    : "Public",
                    relatedUser   : null,
                    officeLocation: "",
                    skype         : "evgendavis",
                    workPhones    : {
                        phone : "",
                        mobile: "+380951114615"
                    },
                    personalEmail : "berneugen@gmail.com",
                    workEmail     : "eugen.bernikevych@thinkmobiles.com",
                    workAddress   : {
                        country: "",
                        zip    : "",
                        state  : "",
                        city   : "",
                        street : ""
                    },
                    tags          : [
                        ""
                    ],
                    name          : {
                        last : "Bernikevich",
                        first: "Eugen"
                    },
                    subject       : "",
                    imageSrc      : "data:image/jpeg;base64,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",
                    isEmployee    : true,
                    __v           : 0
                },
                jobPosition: {
                    _id                     : "55c32e2a29bd6ccd0b000006",
                    department              : "55b92ace21e4b7c40f000012",
                    editedBy                : {
                        user: "55ba28c8d79a3a3439000016",
                        date: "2015-08-06T09:53:38.743Z"
                    },
                    createdBy               : {
                        date: "2015-08-06T09:51:38.152Z",
                        user: "55ba28c8d79a3a3439000016"
                    },
                    totalForecastedEmployees: 1,
                    numberOfEmployees       : 0,
                    groups                  : {
                        owner: "55ba28c8d79a3a3439000016",
                        users: [],
                        group: []
                    },
                    whoCanRW                : "everyOne",
                    workflow                : "528ce700f3f67bc40b00001c",
                    expectedRecruitment     : 1,
                    name                    : "Middle Unity 3D",
                    __v                     : 0,
                    requirements            : "",
                    description             : ""
                },
                department : {
                    _id              : "56e175c4d62294582e10ca68",
                    sequence         : 7,
                    nestingLevel     : 1,
                    editedBy         : {
                        user: null
                    },
                    createdBy        : {
                        date: "2016-03-10T13:25:24.979Z",
                        user: "56dda0599fb95fbe18e3f8ed"
                    },
                    users            : [],
                    departmentManager: null,
                    parentDepartment : "56cebdf6541812c07197358f",
                    departmentName   : "Unity",
                    __v              : 0
                },
                skype      : "figazzz1",
                workPhones : {
                    phone : "",
                    mobile: "+380990872131"
                },
                workEmail  : "eugen.alexeev@thinkmobiles.com",
                name       : {
                    last : "Alexeev",
                    first: "Eugen"
                },
                isEmployee : true
            }
        ]
    };
    var fakeAphabet = {
        data: [
            {
                _id: "L"
            },
            {
                _id: "Z"
            },
            {
                _id: "F"
            },
            {
                _id: "T"
            },
            {
                _id: "V"
            },
            {
                _id: "D"
            },
            {
                _id: "I"
            },
            {
                _id: "R"
            },
            {
                _id: "M"
            },
            {
                _id: "G"
            },
            {
                _id: "A"
            },
            {
                _id: "S"
            },
            {
                _id: "N"
            },
            {
                _id: "Y"
            },
            {
                _id: "H"
            },
            {
                _id: "U"
            },
            {
                _id: "P"
            },
            {
                _id: "O"
            },
            {
                _id: "B"
            },
            {
                _id: "K"
            },
            {
                _id: "C"
            }
        ]
    };
    var fakeEmployeeForThumb = {
        total: 200,
        data : [{
            _id        : "5638aa635d23a8eb04e80af0",
            total      : 1,
            jobPosition: {
                _id : "55b92acf21e4b7c40f000021",
                name: "Junior Android"
            },
            manager    : {
                _id : "55b92ad221e4b7c40f00004e",
                name: {
                    last : "Shuba",
                    first: "Vitaliy"
                }
            },
            age        : 29,
            workPhones : {
                mobile: "+380506966056"
            },
            name       : {
                last : "Siladii",
                first: "Alex"
            },
            department : {
                _id : "55b92ace21e4b7c40f000010",
                name: "Android"
            },
            dateBirth  : "1987-06-03T00:00:00.000Z",
            isEmployee : true
        },
            {
                _id        : "55b92ad221e4b7c40f00004e",
                total      : 1,
                jobPosition: {
                    _id : "564438aa70bbc2b740ce8a19",
                    name: "Head of Android"
                },
                manager    : {
                    _id : "55b92ad221e4b7c40f00004f",
                    name: {
                        last : "Sokhanych",
                        first: "Alex"
                    }
                },
                age        : 21,
                relatedUser: {
                    login: "Vitaliy.Shuba"
                },
                workPhones : {
                    mobile: "+380950366064"
                },
                name       : {
                    last : "Shuba",
                    first: "Vitaliy"
                },
                department : {
                    _id : "55b92ace21e4b7c40f000010",
                    name: "Android"
                },
                dateBirth  : "1994-06-16T21:00:00.000Z",
                isEmployee : true
            }
        ]
    };
    var fakeEmpWithId = {
        _id           : "55b92ad221e4b7c40f00004e",
        dateBirth     : "1994-06-16T21:00:00.000Z",
        ID            : 54,
        isLead        : 1,
        fire          : [],
        hire          : [
            "2013-05-24T21:00:00.000Z"
        ],
        sequence      : 0,
        jobType       : "Full-time",
        gender        : "male",
        marital       : "unmarried",
        attachments   : [],
        creationDate  : "2015-07-29T19:34:42.437Z",
        color         : "#4d5a75",
        otherInfo     : "",
        whoCanRW      : "everyOne",
        workflow      : null,
        active        : false,
        referredBy    : "",
        source        : "",
        age           : 21,
        otherId       : "",
        bankAccountNo : "",
        nationality   : "Ukrainian",
        coach         : null,
        manager       : {
            _id     : "55b92ad221e4b7c40f00004f",
            name    : {
                last : "Sokhanych",
                first: "Alex"
            },
            fullName: "Alex Sokhanych",
            id      : "55b92ad221e4b7c40f00004f"
        },
        jobPosition   : {
            _id : "564438aa70bbc2b740ce8a19",
            name: "Head of Android"
        },
        department    : {
            _id           : "55b92ace21e4b7c40f000010",
            departmentName: "emptyDepartment"
        },
        visibility    : "Public",
        relatedUser   : {
            _id  : "560d0c46963ba3087363de94",
            login: "Vitaliy.Shuba"
        },
        officeLocation: "",
        skype         : "mikazme",
        personalEmail : "mikazmes@gmail.com",
        workEmail     : "vitaliy.shuba@thinkmobiles.com",
        tags          : [
            ""
        ],
        subject       : "",
        imageSrc      : "data:image/jpeg;base64,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",
        isEmployee    : true,
        __v           : 0,
        transfer      : [
            {
                date           : "2013-05-25T01:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 350,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00004f",
                    name    : {
                        last : "Sokhanych",
                        first: "Alex"
                    },
                    fullName: "Alex Sokhanych",
                    id      : "55b92ad221e4b7c40f00004f"
                },
                jobPosition    : {
                    _id : "5681592f9cceae182b907757",
                    name: "Junior .Net"
                },
                department     : {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: "emptyDepartment"
                },
                status         : "hired"
            },
            {
                date           : "2013-09-01T00:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 450,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00004f",
                    name    : {
                        last : "Sokhanych",
                        first: "Alex"
                    },
                    fullName: "Alex Sokhanych",
                    id      : "55b92ad221e4b7c40f00004f"
                },
                jobPosition    : {
                    _id : "5681592f9cceae182b907757",
                    name: "Junior .Net"
                },
                department     : {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: "emptyDepartment"
                },
                status         : "updated"
            },
            {
                date           : "2013-11-01T00:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 450,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00004f",
                    name    : {
                        last : "Sokhanych",
                        first: "Alex"
                    },
                    fullName: "Alex Sokhanych",
                    id      : "55b92ad221e4b7c40f00004f"
                },
                jobPosition    : {
                    _id : "5681592f9cceae182b907757",
                    name: "Junior .Net"
                },
                department     : {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: "emptyDepartment"
                },
                status         : "transfer"
            },
            {
                date           : "2013-11-01T00:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 500,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00004f",
                    name    : {
                        last : "Sokhanych",
                        first: "Alex"
                    },
                    fullName: "Alex Sokhanych",
                    id      : "55b92ad221e4b7c40f00004f"
                },
                jobPosition    : {
                    _id : "55b92acf21e4b7c40f000021",
                    name: "Junior Android"
                },
                department     : {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "emptyDepartment"
                },
                status         : "updated"
            },
            {
                date           : "2014-09-01T00:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 600,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00004f",
                    name    : {
                        last : "Sokhanych",
                        first: "Alex"
                    },
                    fullName: "Alex Sokhanych",
                    id      : "55b92ad221e4b7c40f00004f"
                },
                jobPosition    : {
                    _id : "55b92acf21e4b7c40f000022",
                    name: "Middle Android"
                },
                department     : {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "emptyDepartment"
                },
                status         : "updated"
            },
            {
                date           : "2015-01-01T00:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 800,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00004f",
                    name    : {
                        last : "Sokhanych",
                        first: "Alex"
                    },
                    fullName: "Alex Sokhanych",
                    id      : "55b92ad221e4b7c40f00004f"
                },
                jobPosition    : {
                    _id : "564438aa70bbc2b740ce8a19",
                    name: "Head of Android"
                },
                department     : {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "emptyDepartment"
                },
                status         : "updated"
            },
            {
                date           : "2015-09-01T00:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 1000,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00004f",
                    name    : {
                        last : "Sokhanych",
                        first: "Alex"
                    },
                    fullName: "Alex Sokhanych",
                    id      : "55b92ad221e4b7c40f00004f"
                },
                jobPosition    : {
                    _id : "564438aa70bbc2b740ce8a19",
                    name: "Head of Android"
                },
                department     : {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "emptyDepartment"
                },
                status         : "updated"
            },
            {
                date           : "2016-01-01T00:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 1200,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00004f",
                    name    : {
                        last : "Sokhanych",
                        first: "Alex"
                    },
                    fullName: "Alex Sokhanych",
                    id      : "55b92ad221e4b7c40f00004f"
                },
                jobPosition    : {
                    _id : "564438aa70bbc2b740ce8a19",
                    name: "Head of Android"
                },
                department     : {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "emptyDepartment"
                },
                status         : "updated"
            },
            {
                date           : "2016-03-01T00:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 1400,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00004f",
                    name    : {
                        last : "Sokhanych",
                        first: "Alex"
                    },
                    fullName: "Alex Sokhanych",
                    id      : "55b92ad221e4b7c40f00004f"
                },
                jobPosition    : {
                    _id : "564438aa70bbc2b740ce8a19",
                    name: "Head of Android"
                },
                department     : {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "emptyDepartment"
                },
                status         : "updated"
            },
            {
                date           : "2016-04-01T00:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 1600,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00004f",
                    name    : {
                        last : "Sokhanych",
                        first: "Alex"
                    },
                    fullName: "Alex Sokhanych",
                    id      : "55b92ad221e4b7c40f00004f"
                },
                jobPosition    : {
                    _id : "564438aa70bbc2b740ce8a19",
                    name: "Head of Android"
                },
                department     : {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "emptyDepartment"
                },
                status         : "updated"
            }
        ],
        social        : {
            FB: "",
            LI: ""
        },
        contractEnd   : {
            date  : "2015-07-29T19:34:42.437Z",
            reason: ""
        },
        editedBy      : {
            date: "2016-04-06T07:31:47.915Z",
            user: {
                _id            : "55ba2ef1d79a3a343900001c",
                profile        : 1387275504000,
                __v            : 0,
                lastAccess     : "2016-05-12T13:47:43.746Z",
                relatedEmployee: null,
                savedFilters   : [],
                kanbanSettings : {
                    tasks        : {
                        foldWorkflows: [],
                        countPerPage : 10
                    },
                    applications : {
                        foldWorkflows: [],
                        countPerPage : 10
                    },
                    opportunities: {
                        foldWorkflows: [],
                        countPerPage : 10
                    }
                },
                credentials    : {
                    access_token : "",
                    refresh_token: ""
                },
                pass           : "ebe5ffd65e0e1de96e45a13e645646812c9ba15ba57d28a1cc3886365d948c26",
                email          : "anna.lobas@thinkmobiles.com",
                login          : "AnnaLobas",
                imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        createdBy     : {
            date: "2015-07-29T19:34:42.437Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v            : 0,
                attachments    : [],
                lastAccess     : "2016-06-03T08:18:34.447Z",
                profile        : 1387275598000,
                relatedEmployee: "55b92ad221e4b7c40f00004f",
                savedFilters   : [
                    {
                        _id      : "574335bb27725f815747d579",
                        viewType : "",
                        byDefault: "Leads"
                    }
                ],
                kanbanSettings : {
                    tasks        : {
                        foldWorkflows: [
                            "528ce3caf3f67bc40b000013",
                            "528ce3acf3f67bc40b000012",
                            "528ce30cf3f67bc40b00000f",
                            "528ce35af3f67bc40b000010"
                        ],
                        countPerPage : 10
                    },
                    applications : {
                        foldWorkflows: [
                            "Empty"
                        ],
                        countPerPage : 10
                    },
                    opportunities: {
                        foldWorkflows: [],
                        countPerPage : 10
                    }
                },
                credentials    : {
                    access_token : "",
                    refresh_token: ""
                },
                pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                email          : "info@thinkmobiles.com",
                login          : "admin",
                imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        groups        : {
            group: [],
            users: [],
            owner: {
                _id  : "55ba28c8d79a3a3439000016",
                login: "AndrianaLemko"
            }
        },
        homeAddress   : {
            country: "",
            zip    : "",
            state  : "",
            city   : "",
            street : ""
        },
        workPhones    : {
            phone : "",
            mobile: "+380950366064"
        },
        workAddress   : {
            country: "",
            zip    : "",
            state  : "",
            city   : "",
            street : ""
        },
        name          : {
            last : "Shuba",
            first: "Vitaliy"
        },
        fullName      : "Vitaliy Shuba",
        id            : "55b92ad221e4b7c40f00004e"
    };
    var fakeResponseSaveFilter = {
        "success": {
            "_id"            : "52203e707d4dba8813000003",
            "__v"            : 0,
            "attachments"    : [],
            "lastAccess"     : "2016-06-27T06:19:21.682Z",
            "profile"        : 1387275598000,
            "relatedEmployee": "55b92ad221e4b7c40f00004f",
            "savedFilters"   : [{
                "_id"        : "574335bb27725f815747d579",
                "viewType"   : "",
                "contentType": null,
                "byDefault"  : true
            }, {
                "_id"        : "576140b0db710fca37a2d950",
                "viewType"   : "",
                "contentType": null,
                "byDefault"  : false
            }, {
                "_id"        : "5761467bdb710fca37a2d951",
                "viewType"   : "",
                "contentType": null,
                "byDefault"  : false
            }, {
                "_id"        : "57615278db710fca37a2d952",
                "viewType"   : "",
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
            }, {"_id": "5770ed29a7b6d5c50fd66763", "contentType": "Employees", "byDefault": false}],
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
            }
        ]
    };
    var fakeJobPositionType = {
        data: [
            {
                _id : "contract",
                name: "Contract"
            },
            {
                _id : "fullTime",
                name: "Full-time"
            },
            {
                _id : "internship",
                name: "Internship"
            },
            {
                _id : "partTime",
                name: "Part-time"
            },
            {
                _id : "remote",
                name: "Remote"
            },
            {
                _id : "temporary",
                name: "Temporary"
            }
        ]
    };
    var fakeEmpPersonsForDD = {
        data: [
            {
                _id     : "55b92ad221e4b7c40f000030",
                name    : {
                    last : "Svatuk",
                    first: "Alex"
                },
                fullName: "Alex Svatuk",
                id      : "55b92ad221e4b7c40f000030"
            },
            {
                _id     : "55b92ad221e4b7c40f000031",
                name    : {
                    last : "Gleba",
                    first: "Alex"
                },
                fullName: "Alex Gleba",
                id      : "55b92ad221e4b7c40f000031"
            },
            {
                _id     : "55b92ad221e4b7c40f00003e",
                name    : {
                    last : "Lapchuk",
                    first: "Alex"
                },
                fullName: "Alex Lapchuk",
                id      : "55b92ad221e4b7c40f00003e"
            },
            {
                _id     : "55b92ad221e4b7c40f000044",
                name    : {
                    last : "Devezenko",
                    first: "Alex"
                },
                fullName: "Alex Devezenko",
                id      : "55b92ad221e4b7c40f000044"
            },
            {
                _id     : "55b92ad221e4b7c40f00004f",
                name    : {
                    last : "Sokhanych",
                    first: "Alex"
                },
                fullName: "Alex Sokhanych",
                id      : "55b92ad221e4b7c40f00004f"
            },
            {
                _id     : "55b92ad221e4b7c40f000057",
                name    : {
                    last : "Roman",
                    first: "Alex"
                },
                fullName: "Alex Roman",
                id      : "55b92ad221e4b7c40f000057"
            },
            {
                _id     : "55b92ad221e4b7c40f000058",
                name    : {
                    last : "Makhanets",
                    first: "Alex"
                },
                fullName: "Alex Makhanets",
                id      : "55b92ad221e4b7c40f000058"
            },
            {
                _id     : "55b92ad221e4b7c40f00006c",
                name    : {
                    last : "Sich",
                    first: "Alex"
                },
                fullName: "Alex Sich",
                id      : "55b92ad221e4b7c40f00006c"
            },
            {
                _id     : "55b92ad221e4b7c40f00006d",
                name    : {
                    last : "Tutunnik",
                    first: "Alex"
                },
                fullName: "Alex Tutunnik",
                id      : "55b92ad221e4b7c40f00006d"
            },
            {
                _id     : "55b92ad221e4b7c40f000084",
                name    : {
                    last : "Dahno",
                    first: "Alex"
                },
                fullName: "Alex Dahno",
                id      : "55b92ad221e4b7c40f000084"
            },
            {
                _id     : "55b92ad221e4b7c40f00009e",
                name    : {
                    last : "Michenko",
                    first: "Alex"
                },
                fullName: "Alex Michenko",
                id      : "55b92ad221e4b7c40f00009e"
            },
            {
                _id     : "55b92ad221e4b7c40f0000a7",
                name    : {
                    last : "Ryabcev",
                    first: "Alex"
                },
                fullName: "Alex Ryabcev",
                id      : "55b92ad221e4b7c40f0000a7"
            },
            {
                _id     : "55b92ad221e4b7c40f0000ac",
                name    : {
                    last : "Volkov",
                    first: "Alex"
                },
                fullName: "Alex Volkov",
                id      : "55b92ad221e4b7c40f0000ac"
            },
            {
                _id     : "55b92ad221e4b7c40f0000ce",
                name    : {
                    last : "Storojenko",
                    first: "Alex"
                },
                fullName: "Alex Storojenko",
                id      : "55b92ad221e4b7c40f0000ce"
            },
            {
                _id     : "5638aa635d23a8eb04e80af0",
                name    : {
                    last : "Siladii",
                    first: "Alex"
                },
                fullName: "Alex Siladii",
                id      : "5638aa635d23a8eb04e80af0"
            },
            {
                _id     : "564dac3e9b85f8b16b574fea",
                name    : {
                    last : "Filchak",
                    first: "Alex"
                },
                fullName: "Alex Filchak",
                id      : "564dac3e9b85f8b16b574fea"
            },
            {
                _id     : "565f0fa6f6427f253cf6bf19",
                name    : {
                    last : "Lysachenko",
                    first: "Alex"
                },
                fullName: "Alex Lysachenko",
                id      : "565f0fa6f6427f253cf6bf19"
            },
            {
                _id     : "566ede9e8453e8b464b70b71",
                name    : {
                    last : "Tonkovid",
                    first: "Alex"
                },
                fullName: "Alex Tonkovid",
                id      : "566ede9e8453e8b464b70b71"
            },
            {
                _id     : "56b8b99e6c411b590588feb9",
                name    : {
                    last : "Ovcharenko",
                    first: "Alex"
                },
                fullName: "Alex Ovcharenko",
                id      : "56b8b99e6c411b590588feb9"
            },
            {
                _id     : "55b92ad221e4b7c40f0000ba",
                name    : {
                    last : "Klochkova",
                    first: "Alexandra"
                },
                fullName: "Alexandra Klochkova",
                id      : "55b92ad221e4b7c40f0000ba"
            },
            {
                _id     : "55c330d529bd6ccd0b000007",
                name    : {
                    last : "Yurenko",
                    first: "Alina"
                },
                fullName: "Alina Yurenko",
                id      : "55c330d529bd6ccd0b000007"
            },
            {
                _id     : "55b92ad221e4b7c40f0000cb",
                name    : {
                    last : "Yelahina",
                    first: "Alona"
                },
                fullName: "Alona Yelahina",
                id      : "55b92ad221e4b7c40f0000cb"
            },
            {
                _id     : "565c66633410ae512364dc00",
                name    : {
                    last : "Timochchenko",
                    first: "Alona"
                },
                fullName: "Alona Timochchenko",
                id      : "565c66633410ae512364dc00"
            },
            {
                _id     : "560264bb8dc408c632000005",
                name    : {
                    last : "Lyakh",
                    first: "Anastas"
                },
                fullName: "Anastas Lyakh",
                id      : "560264bb8dc408c632000005"
            },
            {
                _id     : "55ded6b3ae2b22730b00004e",
                name    : {
                    last : "Dimova",
                    first: "Anastasia"
                },
                fullName: "Anastasia Dimova",
                id      : "55ded6b3ae2b22730b00004e"
            },
            {
                _id     : "55b92ad221e4b7c40f000059",
                name    : {
                    last : "Dalekorey",
                    first: "Anatoliy"
                },
                fullName: "Anatoliy Dalekorey",
                id      : "55b92ad221e4b7c40f000059"
            },
            {
                _id     : "55b92ad221e4b7c40f0000b5",
                name    : {
                    last : "Lemko",
                    first: "Andriana"
                },
                fullName: "Andriana Lemko",
                id      : "55b92ad221e4b7c40f0000b5"
            },
            {
                _id     : "55b92ad221e4b7c40f000045",
                name    : {
                    last : "Tivodar",
                    first: "Andriy"
                },
                fullName: "Andriy Tivodar",
                id      : "55b92ad221e4b7c40f000045"
            },
            {
                _id     : "55b92ad221e4b7c40f00006e",
                name    : {
                    last : "Hanchak",
                    first: "Andriy"
                },
                fullName: "Andriy Hanchak",
                id      : "55b92ad221e4b7c40f00006e"
            },
            {
                _id     : "55b92ad221e4b7c40f000096",
                name    : {
                    last : "Herasymyuk",
                    first: "Andriy"
                },
                fullName: "Andriy Herasymyuk",
                id      : "55b92ad221e4b7c40f000096"
            },
            {
                _id     : "55b92ad221e4b7c40f000098",
                name    : {
                    last : "Krupka",
                    first: "Andriy"
                },
                fullName: "Andriy Krupka",
                id      : "55b92ad221e4b7c40f000098"
            },
            {
                _id     : "55b92ad221e4b7c40f0000a3",
                name    : {
                    last : "Karpenko",
                    first: "Andriy"
                },
                fullName: "Andriy Karpenko",
                id      : "55b92ad221e4b7c40f0000a3"
            },
            {
                _id     : "55b92ad221e4b7c40f0000a8",
                name    : {
                    last : "Korneychuk",
                    first: "Andriy"
                },
                fullName: "Andriy Korneychuk",
                id      : "55b92ad221e4b7c40f0000a8"
            },
            {
                _id     : "55b92ad221e4b7c40f0000a9",
                name    : {
                    last : "Loboda",
                    first: "Andriy"
                },
                fullName: "Andriy Loboda",
                id      : "55b92ad221e4b7c40f0000a9"
            },
            {
                _id     : "55b92ad221e4b7c40f0000b3",
                name    : {
                    last : "Sarkanych",
                    first: "Andriy"
                },
                fullName: "Andriy Sarkanych",
                id      : "55b92ad221e4b7c40f0000b3"
            },
            {
                _id     : "55b92ad221e4b7c40f0000bf",
                name    : {
                    last : "Fizer",
                    first: "Andriy"
                },
                fullName: "Andriy Fizer",
                id      : "55b92ad221e4b7c40f0000bf"
            },
            {
                _id     : "55b92ad221e4b7c40f0000c2",
                name    : {
                    last : "Mistetskiy",
                    first: "Andriy"
                },
                fullName: "Andriy Mistetskiy",
                id      : "55b92ad221e4b7c40f0000c2"
            },
            {
                _id     : "55b92ad221e4b7c40f0000cd",
                name    : {
                    last : "Vovk",
                    first: "Andriy"
                },
                fullName: "Andriy Vovk",
                id      : "55b92ad221e4b7c40f0000cd"
            },
            {
                _id     : "561bb90a9ebb48212ea838c7",
                name    : {
                    last : "Svyd",
                    first: "Andriy"
                },
                fullName: "Andriy Svyd",
                id      : "561bb90a9ebb48212ea838c7"
            },
            {
                _id     : "561bc5ca9ebb48212ea838c8",
                name    : {
                    last : "Sokalskiy",
                    first: "Andriy"
                },
                fullName: "Andriy Sokalskiy",
                id      : "561bc5ca9ebb48212ea838c8"
            },
            {
                _id     : "564da59f9b85f8b16b574fe9",
                name    : {
                    last : "Chuprov",
                    first: "Andriy"
                },
                fullName: "Andriy Chuprov",
                id      : "564da59f9b85f8b16b574fe9"
            },
            {
                _id     : "566fe2348453e8b464b70ba6",
                name    : {
                    last : "Lukashchuk",
                    first: "Andriy"
                },
                fullName: "Andriy Lukashchuk",
                id      : "566fe2348453e8b464b70ba6"
            },
            {
                _id     : "5693b24bd87c9004552b63a1",
                name    : {
                    last : "Horak",
                    first: "Andriy"
                },
                fullName: "Andriy Horak",
                id      : "5693b24bd87c9004552b63a1"
            },
            {
                _id     : "56965733d87c9004552b63be",
                name    : {
                    last : "Samokhin",
                    first: "Andriy"
                },
                fullName: "Andriy Samokhin",
                id      : "56965733d87c9004552b63be"
            },
            {
                _id     : "569cce1dcf1f31f925c026fa",
                name    : {
                    last : "Stupchuk",
                    first: "Andriy"
                },
                fullName: "Andriy Stupchuk",
                id      : "569cce1dcf1f31f925c026fa"
            },
            {
                _id     : "56c19971dfd8a81466e2f6dc",
                name    : {
                    last : "Khainus",
                    first: "Andriy"
                },
                fullName: "Andriy Khainus",
                id      : "56c19971dfd8a81466e2f6dc"
            },
            {
                _id     : "56c59ba4d2b48ede4ba42266",
                name    : {
                    last : "Lytvynenko",
                    first: "Andriy"
                },
                fullName: "Andriy Lytvynenko",
                id      : "56c59ba4d2b48ede4ba42266"
            },
            {
                _id     : "56dd4b727bd21335130c4f95",
                name    : {
                    last : "Merentsov",
                    first: "Andriy"
                },
                fullName: "Andriy Merentsov",
                id      : "56dd4b727bd21335130c4f95"
            },
            {
                _id     : "56dd4d8eea0939141336783f",
                name    : {
                    last : "Vasyliev",
                    first: "Andriy"
                },
                fullName: "Andriy Vasyliev",
                id      : "56dd4d8eea0939141336783f"
            },
            {
                _id     : "55b92ad221e4b7c40f0000b8",
                name    : {
                    last : "Lobas",
                    first: "Anna"
                },
                fullName: "Anna Lobas",
                id      : "55b92ad221e4b7c40f0000b8"
            },
            {
                _id     : "55b92ad221e4b7c40f00006f",
                name    : {
                    last : "Karabeinikov",
                    first: "Anton"
                },
                fullName: "Anton Karabeinikov",
                id      : "55b92ad221e4b7c40f00006f"
            },
            {
                _id     : "55b92ad221e4b7c40f00008c",
                name    : {
                    last : "Gychka",
                    first: "Anton"
                },
                fullName: "Anton Gychka",
                id      : "55b92ad221e4b7c40f00008c"
            },
            {
                _id     : "55b92ad221e4b7c40f000094",
                name    : {
                    last : "Yarosh",
                    first: "Anton"
                },
                fullName: "Anton Yarosh",
                id      : "55b92ad221e4b7c40f000094"
            },
            {
                _id     : "55c0656ad011746b0b000006",
                name    : {
                    last : "Nizhegorodov",
                    first: "Anton"
                },
                fullName: "Anton Nizhegorodov",
                id      : "55c0656ad011746b0b000006"
            },
            {
                _id     : "55b92ad221e4b7c40f000083",
                name    : {
                    last : "Zhuk",
                    first: "Antonina"
                },
                fullName: "Antonina Zhuk",
                id      : "55b92ad221e4b7c40f000083"
            },
            {
                _id     : "5629e27046bca6e4591f4919",
                name    : {
                    last : "Petrov",
                    first: "Artem"
                },
                fullName: "Artem Petrov",
                id      : "5629e27046bca6e4591f4919"
            },
            {
                _id     : "56b9ccd88f23c5696159cd09",
                name    : {
                    last : "Antonenko",
                    first: "Artem"
                },
                fullName: "Artem Antonenko",
                id      : "56b9ccd88f23c5696159cd09"
            },
            {
                _id     : "55b92ad221e4b7c40f000042",
                name    : {
                    last : "Myhalko",
                    first: "Artur"
                },
                fullName: "Artur Myhalko",
                id      : "55b92ad221e4b7c40f000042"
            },
            {
                _id     : "55b92ad221e4b7c40f000032",
                name    : {
                    last : "Sakalo",
                    first: "Bogdan"
                },
                fullName: "Bogdan Sakalo",
                id      : "55b92ad221e4b7c40f000032"
            },
            {
                _id     : "55b92ad221e4b7c40f00005a",
                name    : {
                    last : "Cheypesh",
                    first: "Bogdan"
                },
                fullName: "Bogdan Cheypesh",
                id      : "55b92ad221e4b7c40f00005a"
            },
            {
                _id     : "569e63df044ae38173244cfd",
                name    : {
                    last : "Danyliuk",
                    first: "Bogdan"
                },
                fullName: "Bogdan Danyliuk",
                id      : "569e63df044ae38173244cfd"
            },
            {
                _id     : "56e17661177f76f72edf774c",
                name    : {
                    last : "Stets",
                    first: "Bogdana"
                },
                fullName: "Bogdana Stets",
                id      : "56e17661177f76f72edf774c"
            },
            {
                _id     : "56cc7cb7541812c07197357b",
                name    : {
                    last : "Opanasiuk",
                    first: "Bohdana"
                },
                fullName: "Bohdana Opanasiuk",
                id      : "56cc7cb7541812c07197357b"
            },
            {
                _id     : "55b92ad221e4b7c40f000070",
                name    : {
                    last : "Pozhidaev",
                    first: "Daniil"
                },
                fullName: "Daniil Pozhidaev",
                id      : "55b92ad221e4b7c40f000070"
            },
            {
                _id     : "55b92ad221e4b7c40f0000b1",
                name    : {
                    last : "Korniyenko",
                    first: "Daniil"
                },
                fullName: "Daniil Korniyenko",
                id      : "55b92ad221e4b7c40f0000b1"
            },
            {
                _id     : "55fbcb65f9210c860c000005",
                name    : {
                    last : "Shamolina",
                    first: "Daria"
                },
                fullName: "Daria Shamolina",
                id      : "55fbcb65f9210c860c000005"
            },
            {
                _id     : "55b92ad221e4b7c40f000046",
                name    : {
                    last : "Udod",
                    first: "Denis"
                },
                fullName: "Denis Udod",
                id      : "55b92ad221e4b7c40f000046"
            },
            {
                _id     : "55b92ad221e4b7c40f0000b6",
                name    : {
                    last : "Vengrin",
                    first: "Denis"
                },
                fullName: "Denis Vengrin",
                id      : "55b92ad221e4b7c40f0000b6"
            },
            {
                _id     : "55ca0145cbb0f4910b000009",
                name    : {
                    last : "Zinkovskyi",
                    first: "Denis"
                },
                fullName: "Denis Zinkovskyi",
                id      : "55ca0145cbb0f4910b000009"
            },
            {
                _id     : "55effafa8f1e10e50b000006",
                name    : {
                    last : "Pavlenko",
                    first: "Denis"
                },
                fullName: "Denis Pavlenko",
                id      : "55effafa8f1e10e50b000006"
            },
            {
                _id     : "5640741570bbc2b740ce89ec",
                name    : {
                    last : "Lukashov",
                    first: "Denis"
                },
                fullName: "Denis Lukashov",
                id      : "5640741570bbc2b740ce89ec"
            },
            {
                _id     : "565c2793f4dcd63b5dbd7372",
                name    : {
                    last : "Yaremenko",
                    first: "Denis"
                },
                fullName: "Denis Yaremenko",
                id      : "565c2793f4dcd63b5dbd7372"
            },
            {
                _id     : "566add9aa74aaf316eaea6fc",
                name    : {
                    last : "Saranyuk",
                    first: "Denis"
                },
                fullName: "Denis Saranyuk",
                id      : "566add9aa74aaf316eaea6fc"
            },
            {
                _id     : "55b92ad221e4b7c40f000033",
                name    : {
                    last : "Bruso",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Bruso",
                id      : "55b92ad221e4b7c40f000033"
            },
            {
                _id     : "55b92ad221e4b7c40f00006b",
                name    : {
                    last : "Kanivets",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Kanivets",
                id      : "55b92ad221e4b7c40f00006b"
            },
            {
                _id     : "55b92ad221e4b7c40f000071",
                name    : {
                    last : "Masalovich",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Masalovich",
                id      : "55b92ad221e4b7c40f000071"
            },
            {
                _id     : "55b92ad221e4b7c40f00009f",
                name    : {
                    last : "Dzuba",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Dzuba",
                id      : "55b92ad221e4b7c40f00009f"
            },
            {
                _id     : "55b92ad221e4b7c40f0000bc",
                name    : {
                    last : "Demchenko",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Demchenko",
                id      : "55b92ad221e4b7c40f0000bc"
            },
            {
                _id     : "55cdffa59b42266a4f000015",
                name    : {
                    last : "Magar",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Magar",
                id      : "55cdffa59b42266a4f000015"
            },
            {
                _id     : "5600031ba36a8ca10c000028",
                name    : {
                    last : "Mostiv",
                    first: "Dmitriy"
                },
                fullName: "Dmitriy Mostiv",
                id      : "5600031ba36a8ca10c000028"
            },
            {
                _id     : "5614d4c7ab24a83b1dc1a7a8",
                name    : {
                    last : "Babilia",
                    first: "Dmytro"
                },
                fullName: "Dmytro Babilia",
                id      : "5614d4c7ab24a83b1dc1a7a8"
            },
            {
                _id     : "567ac0a48365c9a205406f33",
                name    : {
                    last : "Kolochynsky",
                    first: "Dmytro"
                },
                fullName: "Dmytro Kolochynsky",
                id      : "567ac0a48365c9a205406f33"
            },
            {
                _id     : "564a03d1ad4bc9e53f1f6195",
                name    : {
                    last : "Tanchenec",
                    first: "Edgard"
                },
                fullName: "Edgard Tanchenec",
                id      : "564a03d1ad4bc9e53f1f6195"
            },
            {
                _id     : "55b92ad221e4b7c40f00005b",
                name    : {
                    last : "Chori",
                    first: "Eduard"
                },
                fullName: "Eduard Chori",
                id      : "55b92ad221e4b7c40f00005b"
            },
            {
                _id     : "55b92ad221e4b7c40f000067",
                name    : {
                    last : "Rudenko",
                    first: "Eduard"
                },
                fullName: "Eduard Rudenko",
                id      : "55b92ad221e4b7c40f000067"
            },
            {
                _id     : "55b92ad221e4b7c40f000092",
                name    : {
                    last : "Dedenok",
                    first: "Eduard"
                },
                fullName: "Eduard Dedenok",
                id      : "55b92ad221e4b7c40f000092"
            },
            {
                _id     : "55b92ad221e4b7c40f000066",
                name    : {
                    last : "Gromadskiy",
                    first: "Egor"
                },
                fullName: "Egor Gromadskiy",
                id      : "55b92ad221e4b7c40f000066"
            },
            {
                _id     : "55b92ad221e4b7c40f000041",
                name    : {
                    last : "Oleynikov",
                    first: "Eugen"
                },
                fullName: "Eugen Oleynikov",
                id      : "55b92ad221e4b7c40f000041"
            },
            {
                _id     : "55b92ad221e4b7c40f000072",
                name    : {
                    last : "Bernikevich",
                    first: "Eugen"
                },
                fullName: "Eugen Bernikevich",
                id      : "55b92ad221e4b7c40f000072"
            },
            {
                _id     : "55b92ad221e4b7c40f00008b",
                name    : {
                    last : "Ugolkov",
                    first: "Eugen"
                },
                fullName: "Eugen Ugolkov",
                id      : "55b92ad221e4b7c40f00008b"
            },
            {
                _id     : "55b92ad221e4b7c40f0000a4",
                name    : {
                    last : "Sokolenko",
                    first: "Eugen"
                },
                fullName: "Eugen Sokolenko",
                id      : "55b92ad221e4b7c40f0000a4"
            },
            {
                _id     : "55c32e0d29bd6ccd0b000005",
                name    : {
                    last : "Alexeev",
                    first: "Eugen"
                },
                fullName: "Eugen Alexeev",
                id      : "55c32e0d29bd6ccd0b000005"
            },
            {
                _id     : "55c98aa7cbb0f4910b000005",
                name    : {
                    last : "Rechun",
                    first: "Eugen"
                },
                fullName: "Eugen Rechun",
                id      : "55c98aa7cbb0f4910b000005"
            },
            {
                _id     : "56029cc950de7f4138000005",
                name    : {
                    last : "Lendyel",
                    first: "Eugen"
                },
                fullName: "Eugen Lendyel",
                id      : "56029cc950de7f4138000005"
            },
            {
                _id     : "56e696da81046d9741fb66fc",
                name    : {
                    last : "Kovbel",
                    first: "Fedir"
                },
                fullName: "Fedir Kovbel",
                id      : "56e696da81046d9741fb66fc"
            },
            {
                _id     : "55b92ad221e4b7c40f000090",
                name    : {
                    last : "Shterr",
                    first: "Gabriella"
                },
                fullName: "Gabriella Shterr",
                id      : "55b92ad221e4b7c40f000090"
            },
            {
                _id     : "56b9d3eb8f23c5696159cd0b",
                name    : {
                    last : "Mykhailova",
                    first: "Galina"
                },
                fullName: "Galina Mykhailova",
                id      : "56b9d3eb8f23c5696159cd0b"
            },
            {
                _id     : "56e045e943fcd85c74307060",
                name    : {
                    last : "Milchevych",
                    first: "Galina"
                },
                fullName: "Galina Milchevych",
                id      : "56e045e943fcd85c74307060"
            },
            {
                _id     : "55b92ad221e4b7c40f00003d",
                name    : {
                    last : "Kravets",
                    first: "German"
                },
                fullName: "German Kravets",
                id      : "55b92ad221e4b7c40f00003d"
            },
            {
                _id     : "568158fc9cceae182b907756",
                name    : {
                    last : "Belous",
                    first: "Herman"
                },
                fullName: "Herman Belous",
                id      : "568158fc9cceae182b907756"
            },
            {
                _id     : "55b92ad221e4b7c40f0000a2",
                name    : {
                    last : "Stan",
                    first: "Igor"
                },
                fullName: "Igor Stan",
                id      : "55b92ad221e4b7c40f0000a2"
            },
            {
                _id     : "55b92ad221e4b7c40f0000bb",
                name    : {
                    last : "Shepinka",
                    first: "Igor"
                },
                fullName: "Igor Shepinka",
                id      : "55b92ad221e4b7c40f0000bb"
            },
            {
                _id     : "56966c82d87c9004552b63c7",
                name    : {
                    last : "Kuzma",
                    first: "Ihor"
                },
                fullName: "Ihor Kuzma",
                id      : "56966c82d87c9004552b63c7"
            },
            {
                _id     : "56a0d4b162d172544baf0e3a",
                name    : {
                    last : "Ilnytskyi",
                    first: "Ihor"
                },
                fullName: "Ihor Ilnytskyi",
                id      : "56a0d4b162d172544baf0e3a"
            },
            {
                _id     : "55b92ad221e4b7c40f0000c6",
                name    : {
                    last : "Kramarenko",
                    first: "Illia"
                },
                fullName: "Illia Kramarenko",
                id      : "55b92ad221e4b7c40f0000c6"
            },
            {
                _id     : "55b92ad221e4b7c40f000035",
                name    : {
                    last : "Mondok",
                    first: "Ilya"
                },
                fullName: "Ilya Mondok",
                id      : "55b92ad221e4b7c40f000035"
            },
            {
                _id     : "55b92ad221e4b7c40f000047",
                name    : {
                    last : "Khymych",
                    first: "Ilya"
                },
                fullName: "Ilya Khymych",
                id      : "55b92ad221e4b7c40f000047"
            },
            {
                _id     : "56090fae86e2435a33000008",
                name    : {
                    last : "Nukhova",
                    first: "Inna"
                },
                fullName: "Inna Nukhova",
                id      : "56090fae86e2435a33000008"
            },
            {
                _id     : "55b92ad221e4b7c40f000073",
                name    : {
                    last : "Grab",
                    first: "Irina"
                },
                fullName: "Irina Grab",
                id      : "55b92ad221e4b7c40f000073"
            },
            {
                _id     : "55b92ad221e4b7c40f000034",
                name    : {
                    last : "Nazarovich",
                    first: "Ishtvan"
                },
                fullName: "Ishtvan Nazarovich",
                id      : "55b92ad221e4b7c40f000034"
            },
            {
                _id     : "55b92ad221e4b7c40f00005c",
                name    : {
                    last : "Irchak",
                    first: "Ivan"
                },
                fullName: "Ivan Irchak",
                id      : "55b92ad221e4b7c40f00005c"
            },
            {
                _id     : "55b92ad221e4b7c40f000074",
                name    : {
                    last : "Kornyk",
                    first: "Ivan"
                },
                fullName: "Ivan Kornyk",
                id      : "55b92ad221e4b7c40f000074"
            },
            {
                _id     : "55b92ad221e4b7c40f000087",
                name    : {
                    last : "Kostromin",
                    first: "Ivan"
                },
                fullName: "Ivan Kostromin",
                id      : "55b92ad221e4b7c40f000087"
            },
            {
                _id     : "55b92ad221e4b7c40f00008e",
                name    : {
                    last : "Grab",
                    first: "Ivan"
                },
                fullName: "Ivan Grab",
                id      : "55b92ad221e4b7c40f00008e"
            },
            {
                _id     : "55b92ad221e4b7c40f00009c",
                name    : {
                    last : "Feltsan",
                    first: "Ivan"
                },
                fullName: "Ivan Feltsan",
                id      : "55b92ad221e4b7c40f00009c"
            },
            {
                _id     : "55b92ad221e4b7c40f0000a0",
                name    : {
                    last : "Bilak",
                    first: "Ivan"
                },
                fullName: "Ivan Bilak",
                id      : "55b92ad221e4b7c40f0000a0"
            },
            {
                _id     : "55b92ad221e4b7c40f0000aa",
                name    : {
                    last : "Lyashenko",
                    first: "Ivan"
                },
                fullName: "Ivan Lyashenko",
                id      : "55b92ad221e4b7c40f0000aa"
            },
            {
                _id     : "55b92ad221e4b7c40f0000c8",
                name    : {
                    last : "Bizilya",
                    first: "Ivan"
                },
                fullName: "Ivan Bizilya",
                id      : "55b92ad221e4b7c40f0000c8"
            },
            {
                _id     : "55b92ad221e4b7c40f0000cc",
                name    : {
                    last : "Lyakh",
                    first: "Ivan"
                },
                fullName: "Ivan Lyakh",
                id      : "55b92ad221e4b7c40f0000cc"
            },
            {
                _id     : "55c98b86cbb0f4910b000006",
                name    : {
                    last : "Kovalenko",
                    first: "Ivan"
                },
                fullName: "Ivan Kovalenko",
                id      : "55c98b86cbb0f4910b000006"
            },
            {
                _id     : "55dd71eaf09cc2ec0b000007",
                name    : {
                    last : "Khartov",
                    first: "Ivan"
                },
                fullName: "Ivan Khartov",
                id      : "55dd71eaf09cc2ec0b000007"
            },
            {
                _id     : "56a5ef86aa157ca50f21fb1d",
                name    : {
                    last : "Pasichnyuk",
                    first: "Ivan"
                },
                fullName: "Ivan Pasichnyuk",
                id      : "56a5ef86aa157ca50f21fb1d"
            },
            {
                _id     : "55b92ad221e4b7c40f000048",
                name    : {
                    last : "Chupova",
                    first: "Katerina"
                },
                fullName: "Katerina Chupova",
                id      : "55b92ad221e4b7c40f000048"
            },
            {
                _id     : "55b92ad221e4b7c40f000068",
                name    : {
                    last : "Bartish",
                    first: "Katerina"
                },
                fullName: "Katerina Bartish",
                id      : "55b92ad221e4b7c40f000068"
            },
            {
                _id     : "55b92ad221e4b7c40f00009a",
                name    : {
                    last : "Pasichnyuk",
                    first: "Katerina"
                },
                fullName: "Katerina Pasichnyuk",
                id      : "55b92ad221e4b7c40f00009a"
            },
            {
                _id     : "55b92ad221e4b7c40f0000ab",
                name    : {
                    last : "Olkhovik",
                    first: "Katerina"
                },
                fullName: "Katerina Olkhovik",
                id      : "55b92ad221e4b7c40f0000ab"
            },
            {
                _id     : "55b92ad221e4b7c40f000085",
                name    : {
                    last : "Gorbushko",
                    first: "Kirill"
                },
                fullName: "Kirill Gorbushko",
                id      : "55b92ad221e4b7c40f000085"
            },
            {
                _id     : "55e419094983acdd0b000012",
                name    : {
                    last : "Paliiuk",
                    first: "Kirill"
                },
                fullName: "Kirill Paliiuk",
                id      : "55e419094983acdd0b000012"
            },
            {
                _id     : "56b9d49d8f23c5696159cd0c",
                name    : {
                    last : "Bed",
                    first: "Kirill"
                },
                fullName: "Kirill Bed",
                id      : "56b9d49d8f23c5696159cd0c"
            },
            {
                _id     : "56b2287b99ce8d706a81b2bc",
                name    : {
                    last : "Mudrenok",
                    first: "Kostiantyn"
                },
                fullName: "Kostiantyn Mudrenok",
                id      : "56b2287b99ce8d706a81b2bc"
            },
            {
                _id     : "55d1e234dda01e250c000015",
                name    : {
                    last : "Rimar",
                    first: "Kristian"
                },
                fullName: "Kristian Rimar",
                id      : "55d1e234dda01e250c000015"
            },
            {
                _id     : "55b92ad221e4b7c40f00009b",
                name    : {
                    last : "Popp",
                    first: "Larysa"
                },
                fullName: "Larysa Popp",
                id      : "55b92ad221e4b7c40f00009b"
            },
            {
                _id     : "55b92ad221e4b7c40f000075",
                name    : {
                    last : "Gvozdyo",
                    first: "Lilia"
                },
                fullName: "Lilia Gvozdyo",
                id      : "55b92ad221e4b7c40f000075"
            },
            {
                _id     : "55b92ad221e4b7c40f0000c7",
                name    : {
                    last : "Mykhailova",
                    first: "Liliya"
                },
                fullName: "Liliya Mykhailova",
                id      : "55b92ad221e4b7c40f0000c7"
            },
            {
                _id     : "55bf45cf65cda0810b00000a",
                name    : {
                    last : "Shustur",
                    first: "Liliya"
                },
                fullName: "Liliya Shustur",
                id      : "55bf45cf65cda0810b00000a"
            },
            {
                _id     : "564a0186ad4bc9e53f1f6193",
                name    : {
                    last : "Orlenko",
                    first: "Liliya"
                },
                fullName: "Liliya Orlenko",
                id      : "564a0186ad4bc9e53f1f6193"
            },
            {
                _id     : "56d06aef541812c0719735c8",
                name    : {
                    last : "Garagonich",
                    first: "Liza"
                },
                fullName: "Liza Garagonich",
                id      : "56d06aef541812c0719735c8"
            },
            {
                _id     : "55b92ad221e4b7c40f00005d",
                name    : {
                    last : "Gerevich",
                    first: "Lubomir"
                },
                fullName: "Lubomir Gerevich",
                id      : "55b92ad221e4b7c40f00005d"
            },
            {
                _id     : "55b92ad221e4b7c40f0000c1",
                name    : {
                    last : "Zasukhina",
                    first: "Maria"
                },
                fullName: "Maria Zasukhina",
                id      : "55b92ad221e4b7c40f0000c1"
            },
            {
                _id     : "5684ec1a1fec73d05393a2a4",
                name    : {
                    last : "Zaitseva",
                    first: "Maria"
                },
                fullName: "Maria Zaitseva",
                id      : "5684ec1a1fec73d05393a2a4"
            },
            {
                _id     : "560115cf536bd29228000006",
                name    : {
                    last : "Myhalko",
                    first: "Marianna"
                },
                fullName: "Marianna Myhalko",
                id      : "560115cf536bd29228000006"
            },
            {
                _id     : "55b92ad221e4b7c40f00003f",
                name    : {
                    last : "Kubichka",
                    first: "Marina"
                },
                fullName: "Marina Kubichka",
                id      : "55b92ad221e4b7c40f00003f"
            },
            {
                _id     : "56cdd631541812c071973584",
                name    : {
                    last : "Sheverya",
                    first: "Maryna"
                },
                fullName: "Maryna Sheverya",
                id      : "56cdd631541812c071973584"
            },
            {
                _id     : "55b92ad221e4b7c40f000043",
                name    : {
                    last : "Geraschenko",
                    first: "Maxim"
                },
                fullName: "Maxim Geraschenko",
                id      : "55b92ad221e4b7c40f000043"
            },
            {
                _id     : "55b92ad221e4b7c40f000089",
                name    : {
                    last : "Sychov",
                    first: "Maxim"
                },
                fullName: "Maxim Sychov",
                id      : "55b92ad221e4b7c40f000089"
            },
            {
                _id     : "55b92ad221e4b7c40f0000a5",
                name    : {
                    last : "Holubka",
                    first: "Maxim"
                },
                fullName: "Maxim Holubka",
                id      : "55b92ad221e4b7c40f0000a5"
            },
            {
                _id     : "55c06411d011746b0b000005",
                name    : {
                    last : "Rachytskyy",
                    first: "Maxim"
                },
                fullName: "Maxim Rachytskyy",
                id      : "55c06411d011746b0b000005"
            },
            {
                _id     : "566ada96a74aaf316eaea69d",
                name    : {
                    last : "Gladovskyy",
                    first: "Maxim"
                },
                fullName: "Maxim Gladovskyy",
                id      : "566ada96a74aaf316eaea69d"
            },
            {
                _id     : "55b92ad221e4b7c40f000036",
                name    : {
                    last : "Yemets",
                    first: "Michael"
                },
                fullName: "Michael Yemets",
                id      : "55b92ad221e4b7c40f000036"
            },
            {
                _id     : "55b92ad221e4b7c40f000049",
                name    : {
                    last : "Kapustey",
                    first: "Michael"
                },
                fullName: "Michael Kapustey",
                id      : "55b92ad221e4b7c40f000049"
            },
            {
                _id     : "55b92ad221e4b7c40f000055",
                name    : {
                    last : "Rogach",
                    first: "Michael"
                },
                fullName: "Michael Rogach",
                id      : "55b92ad221e4b7c40f000055"
            },
            {
                _id     : "55b92ad221e4b7c40f00005e",
                name    : {
                    last : "Didenko",
                    first: "Michael"
                },
                fullName: "Michael Didenko",
                id      : "55b92ad221e4b7c40f00005e"
            },
            {
                _id     : "55b92ad221e4b7c40f000069",
                name    : {
                    last : "Afendikov",
                    first: "Michael"
                },
                fullName: "Michael Afendikov",
                id      : "55b92ad221e4b7c40f000069"
            },
            {
                _id     : "55b92ad221e4b7c40f000076",
                name    : {
                    last : "Glagola",
                    first: "Michael"
                },
                fullName: "Michael Glagola",
                id      : "55b92ad221e4b7c40f000076"
            },
            {
                _id     : "55b92ad221e4b7c40f000077",
                name    : {
                    last : "Soyma",
                    first: "Michael"
                },
                fullName: "Michael Soyma",
                id      : "55b92ad221e4b7c40f000077"
            },
            {
                _id     : "55b92ad221e4b7c40f0000b2",
                name    : {
                    last : "Yeremenko",
                    first: "Michael"
                },
                fullName: "Michael Yeremenko",
                id      : "55b92ad221e4b7c40f0000b2"
            },
            {
                _id     : "55b92ad221e4b7c40f0000bd",
                name    : {
                    last : "Vashkeba",
                    first: "Michael"
                },
                fullName: "Michael Vashkeba",
                id      : "55b92ad221e4b7c40f0000bd"
            },
            {
                _id     : "55b92ad221e4b7c40f0000c4",
                name    : {
                    last : "Myronyshyn",
                    first: "Michael"
                },
                fullName: "Michael Myronyshyn",
                id      : "55b92ad221e4b7c40f0000c4"
            },
            {
                _id     : "55b92ad221e4b7c40f0000c5",
                name    : {
                    last : "Gajdan",
                    first: "Michael"
                },
                fullName: "Michael Gajdan",
                id      : "55b92ad221e4b7c40f0000c5"
            },
            {
                _id     : "55dd7776f09cc2ec0b000009",
                name    : {
                    last : "Kavka",
                    first: "Michael"
                },
                fullName: "Michael Kavka",
                id      : "55dd7776f09cc2ec0b000009"
            },
            {
                _id     : "5600042ca36a8ca10c000029",
                name    : {
                    last : "Filchak",
                    first: "Michael"
                },
                fullName: "Michael Filchak",
                id      : "5600042ca36a8ca10c000029"
            },
            {
                _id     : "5667f310a3fc012a68f0d5f5",
                name    : {
                    last : "Sopko",
                    first: "Michael"
                },
                fullName: "Michael Sopko",
                id      : "5667f310a3fc012a68f0d5f5"
            },
            {
                _id     : "56e2b53e896e98a661aa8326",
                name    : {
                    last : "Ptitsyn",
                    first: "Michael"
                },
                fullName: "Michael Ptitsyn",
                id      : "56e2b53e896e98a661aa8326"
            },
            {
                _id     : "56b3412299ce8d706a81b2cd",
                name    : {
                    last : "Kholtobin",
                    first: "Mykola"
                },
                fullName: "Mykola Kholtobin",
                id      : "56b3412299ce8d706a81b2cd"
            },
            {
                _id     : "56cb3695541812c071973546",
                name    : {
                    last : "Vasylyna",
                    first: "Mykola"
                },
                fullName: "Mykola Vasylyna",
                id      : "56cb3695541812c071973546"
            },
            {
                _id     : "565c306af4dcd63b5dbd7373",
                name    : {
                    last : "Matrafayilo",
                    first: "Myroslav"
                },
                fullName: "Myroslav Matrafayilo",
                id      : "565c306af4dcd63b5dbd7373"
            },
            {
                _id     : "55b92ad221e4b7c40f0000b7",
                name    : {
                    last : "Polovka",
                    first: "Myroslava"
                },
                fullName: "Myroslava Polovka",
                id      : "55b92ad221e4b7c40f0000b7"
            },
            {
                _id     : "56bdf283dfd8a81466e2f6d0",
                name    : {
                    last : "Shishko",
                    first: "Nadiya"
                },
                fullName: "Nadiya Shishko",
                id      : "56bdf283dfd8a81466e2f6d0"
            },
            {
                _id     : "56938d2cd87c9004552b639e",
                name    : {
                    last : "Makarova",
                    first: "Nastya"
                },
                fullName: "Nastya Makarova",
                id      : "56938d2cd87c9004552b639e"
            },
            {
                _id     : "561ba8639ebb48212ea838c4",
                name    : {
                    last : "Yartysh",
                    first: "Nataliya"
                },
                fullName: "Nataliya Yartysh",
                id      : "561ba8639ebb48212ea838c4"
            },
            {
                _id     : "566aa49f4f817b7f51746ec0",
                name    : {
                    last : "Burtnyk",
                    first: "Nataliya"
                },
                fullName: "Nataliya Burtnyk",
                id      : "566aa49f4f817b7f51746ec0"
            },
            {
                _id     : "56af32e174d57e0d56d6bee5",
                name    : {
                    last : "Sichko",
                    first: "Nataliya"
                },
                fullName: "Nataliya Sichko",
                id      : "56af32e174d57e0d56d6bee5"
            },
            {
                _id     : "56cdd88b541812c071973585",
                name    : {
                    last : "Plovayko",
                    first: "Nelya"
                },
                fullName: "Nelya Plovayko",
                id      : "56cdd88b541812c071973585"
            },
            {
                _id     : "55b92ad221e4b7c40f0000a6",
                name    : {
                    last : "Citrak",
                    first: "Norbert"
                },
                fullName: "Norbert Citrak",
                id      : "55b92ad221e4b7c40f0000a6"
            },
            {
                _id     : "55b92ad221e4b7c40f0000be",
                name    : {
                    last : "Borys",
                    first: "Oksana"
                },
                fullName: "Oksana Borys",
                id      : "55b92ad221e4b7c40f0000be"
            },
            {
                _id     : "55b92ad221e4b7c40f0000c0",
                name    : {
                    last : "Kordas",
                    first: "Oksana"
                },
                fullName: "Oksana Kordas",
                id      : "55b92ad221e4b7c40f0000c0"
            },
            {
                _id     : "56e0408e4f9ff8e0737d7c52",
                name    : {
                    last : "Pylyp",
                    first: "Oksana"
                },
                fullName: "Oksana Pylyp",
                id      : "56e0408e4f9ff8e0737d7c52"
            },
            {
                _id     : "55b92ad221e4b7c40f00003c",
                name    : {
                    last : "Stasiv",
                    first: "Oleg"
                },
                fullName: "Oleg Stasiv",
                id      : "55b92ad221e4b7c40f00003c"
            },
            {
                _id     : "55b92ad221e4b7c40f00004a",
                name    : {
                    last : "Ostroverkh",
                    first: "Oleg"
                },
                fullName: "Oleg Ostroverkh",
                id      : "55b92ad221e4b7c40f00004a"
            },
            {
                _id     : "55b92ad221e4b7c40f000078",
                name    : {
                    last : "Boyanivskiy",
                    first: "Oleg"
                },
                fullName: "Oleg Boyanivskiy",
                id      : "55b92ad221e4b7c40f000078"
            },
            {
                _id     : "55b92ad221e4b7c40f00008a",
                name    : {
                    last : "Mahobey",
                    first: "Oleg"
                },
                fullName: "Oleg Mahobey",
                id      : "55b92ad221e4b7c40f00008a"
            },
            {
                _id     : "561ba7039ebb48212ea838c3",
                name    : {
                    last : "Maliavska",
                    first: "Oleksandra"
                },
                fullName: "Oleksandra Maliavska",
                id      : "561ba7039ebb48212ea838c3"
            },
            {
                _id     : "56b9cbb48f23c5696159cd08",
                name    : {
                    last : "Kovalenko",
                    first: "Oleksii"
                },
                fullName: "Oleksii Kovalenko",
                id      : "56b9cbb48f23c5696159cd08"
            },
            {
                _id     : "55b92ad221e4b7c40f000037",
                name    : {
                    last : "Shanghin",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Shanghin",
                id      : "55b92ad221e4b7c40f000037"
            },
            {
                _id     : "55b92ad221e4b7c40f000079",
                name    : {
                    last : "Gerasimov",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Gerasimov",
                id      : "55b92ad221e4b7c40f000079"
            },
            {
                _id     : "55b92ad221e4b7c40f000095",
                name    : {
                    last : "Kuropyatnik",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Kuropyatnik",
                id      : "55b92ad221e4b7c40f000095"
            },
            {
                _id     : "55b92ad221e4b7c40f0000c9",
                name    : {
                    last : "Fedosov",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Fedosov",
                id      : "55b92ad221e4b7c40f0000c9"
            },
            {
                _id     : "56e2b6a21f2850d361927dd8",
                name    : {
                    last : "Protsenko",
                    first: "Oleksiy"
                },
                fullName: "Oleksiy Protsenko",
                id      : "56e2b6a21f2850d361927dd8"
            },
            {
                _id     : "55b92ad221e4b7c40f0000b9",
                name    : {
                    last : "Melnyk",
                    first: "Olena"
                },
                fullName: "Olena Melnyk",
                id      : "55b92ad221e4b7c40f0000b9"
            },
            {
                _id     : "55e96ab13f3ae4fd0b000009",
                name    : {
                    last : "Pavliuk",
                    first: "Oles"
                },
                fullName: "Oles Pavliuk",
                id      : "55e96ab13f3ae4fd0b000009"
            },
            {
                _id     : "55b92ad221e4b7c40f0000c3",
                name    : {
                    last : "Prokoshkina",
                    first: "Olesia"
                },
                fullName: "Olesia Prokoshkina",
                id      : "55b92ad221e4b7c40f0000c3"
            },
            {
                _id     : "56123232c90e2fb026ce064b",
                name    : {
                    last : "Sikora",
                    first: "Olga"
                },
                fullName: "Olga Sikora",
                id      : "56123232c90e2fb026ce064b"
            },
            {
                _id     : "55c84a4aaa36a0e60a000005",
                name    : {
                    last : "Muratov",
                    first: "Pavlo"
                },
                fullName: "Pavlo Muratov",
                id      : "55c84a4aaa36a0e60a000005"
            },
            {
                _id     : "56964a03d87c9004552b63ba",
                name    : {
                    last : "Skyba",
                    first: "Pavlo"
                },
                fullName: "Pavlo Skyba",
                id      : "56964a03d87c9004552b63ba"
            },
            {
                _id     : "56a7956faa157ca50f21fb25",
                name    : {
                    last : "Demko",
                    first: "Pavlo"
                },
                fullName: "Pavlo Demko",
                id      : "56a7956faa157ca50f21fb25"
            },
            {
                _id     : "55b92ad221e4b7c40f00005f",
                name: {
                    last : "Voloshchuk",
                    first: "Peter"
                },
                fullName: "Peter Voloshchuk",
                id      : "55b92ad221e4b7c40f00005f"
            },
            {
                _id     : "55e549309624477a0b000005",
                name: {
                    last : "Rospopa",
                    first: "Petro"
                },
                fullName: "Petro Rospopa",
                id      : "55e549309624477a0b000005"
            },
            {
                _id     : "56cc7ad8541812c071973579",
                name: {
                    last : "Tesliuk",
                    first: "Petro"
                },
                fullName: "Petro Tesliuk",
                id      : "56cc7ad8541812c071973579"
            },
            {
                _id     : "56a78c75aa157ca50f21fb24",
                name: {
                    last : "Iyber",
                    first: "Renata"
                },
                fullName: "Renata Iyber",
                id      : "56a78c75aa157ca50f21fb24"
            },
            {
                _id     : "55b92ad221e4b7c40f000051",
                name: {
                    last : "Mozes",
                    first: "Richard"
                },
                fullName: "Richard Mozes",
                id      : "55b92ad221e4b7c40f000051"
            },
            {
                _id     : "56e298ab5def9136621b7803",
                name: {
                    last : "Shinkovych",
                    first: "Rikhard"
                },
                fullName: "Rikhard Shinkovych",
                id      : "56e298ab5def9136621b7803"
            },
            {
                _id     : "55b92ad221e4b7c40f00007a",
                name: {
                    last : "Fogash",
                    first: "Robert"
                },
                fullName: "Robert Fogash",
                id      : "55b92ad221e4b7c40f00007a"
            },
            {
                _id     : "55b92ad221e4b7c40f00004b",
                name: {
                    last : "Katona",
                    first: "Roland"
                },
                fullName: "Roland Katona",
                id      : "55b92ad221e4b7c40f00004b"
            },
            {
                _id     : "55b92ad221e4b7c40f000038",
                name: {
                    last : "Babunich",
                    first: "Roman"
                },
                fullName: "Roman Babunich",
                id      : "55b92ad221e4b7c40f000038"
            },
            {
                _id     : "55b92ad221e4b7c40f000060",
                name: {
                    last : "Buchuk",
                    first: "Roman"
                },
                fullName: "Roman Buchuk",
                id      : "55b92ad221e4b7c40f000060"
            },
            {
                _id     : "55b92ad221e4b7c40f00007b",
                name: {
                    last : "Guti",
                    first: "Roman"
                },
                fullName: "Roman Guti",
                id      : "55b92ad221e4b7c40f00007b"
            },
            {
                _id     : "55b92ad221e4b7c40f000086",
                name: {
                    last : "Kubichka",
                    first: "Roman"
                },
                fullName: "Roman Kubichka",
                id      : "55b92ad221e4b7c40f000086"
            },
            {
                _id     : "55b92ad221e4b7c40f0000b0",
                name: {
                    last : "Donchenko",
                    first: "Roman"
                },
                fullName: "Roman Donchenko",
                id      : "55b92ad221e4b7c40f0000b0"
            },
            {
                _id     : "55dd73d1f09cc2ec0b000008",
                name: {
                    last : "Vizenko",
                    first: "Roman"
                },
                fullName: "Roman Vizenko",
                id      : "55dd73d1f09cc2ec0b000008"
            },
            {
                _id     : "55eef3fd6dceaee10b000020",
                name: {
                    last : "Saldan",
                    first: "Roman"
                },
                fullName: "Roman Saldan",
                id      : "55eef3fd6dceaee10b000020"
            },
            {
                _id     : "5667f43da3fc012a68f0d5f6",
                name: {
                    last : "Katsala",
                    first: "Roman"
                },
                fullName: "Roman Katsala",
                id      : "5667f43da3fc012a68f0d5f6"
            },
            {
                _id     : "568bbdfd5827e3b24d8123a7",
                name: {
                    last : "Chaban",
                    first: "Roman"
                },
                fullName: "Roman Chaban",
                id      : "568bbdfd5827e3b24d8123a7"
            },
            {
                _id     : "568cd341b2bcba971ba6f5c4",
                name: {
                    last : "Rosul",
                    first: "Roman"
                },
                fullName: "Roman Rosul",
                id      : "568cd341b2bcba971ba6f5c4"
            },
            {
                _id     : "568cd4c0b2bcba971ba6f5c5",
                name: {
                    last : "Osadchuk",
                    first: "Roman"
                },
                fullName: "Roman Osadchuk",
                id      : "568cd4c0b2bcba971ba6f5c5"
            },
            {
                _id     : "569e3a73044ae38173244cfb",
                name: {
                    last : "Martyniuk",
                    first: "Roman"
                },
                fullName: "Roman Martyniuk",
                id      : "569e3a73044ae38173244cfb"
            },
            {
                _id     : "56d5a0c45132d292750a5e7e",
                name: {
                    last : "Ukrainskiy",
                    first: "Rostyslav"
                },
                fullName: "Rostyslav Ukrainskiy",
                id      : "56d5a0c45132d292750a5e7e"
            },
            {
                _id     : "55b92ad221e4b7c40f000056",
                name: {
                    last : "Labjak",
                    first: "Ruslan"
                },
                fullName: "Ruslan Labjak",
                id      : "55b92ad221e4b7c40f000056"
            },
            {
                _id     : "55b92ad221e4b7c40f000097",
                name: {
                    last : "Abylgazinov",
                    first: "Samgash"
                },
                fullName: "Samgash Abylgazinov",
                id      : "55b92ad221e4b7c40f000097"
            },
            {
                _id     : "568cdd375527d6691cb68b22",
                name: {
                    last : "Melnik",
                    first: "Sergey"
                },
                fullName: "Sergey Melnik",
                id      : "568cdd375527d6691cb68b22"
            },
            {
                _id     : "55b92ad221e4b7c40f000064",
                name: {
                    last : "Tilishevsky",
                    first: "Sergiy"
                },
                fullName: "Sergiy Tilishevsky",
                id      : "55b92ad221e4b7c40f000064"
            },
            {
                _id     : "55b92ad221e4b7c40f00007c",
                name: {
                    last : "Sheba",
                    first: "Sergiy"
                },
                fullName: "Sergiy Sheba",
                id      : "55b92ad221e4b7c40f00007c"
            },
            {
                _id     : "55b92ad221e4b7c40f0000a1",
                name: {
                    last : "Stepaniuk",
                    first: "Sergiy"
                },
                fullName: "Sergiy Stepaniuk",
                id      : "55b92ad221e4b7c40f0000a1"
            },
            {
                _id     : "55d1a2b18f61e2c90b000023",
                name: {
                    last : "Degtyar",
                    first: "Sergiy"
                },
                fullName: "Sergiy Degtyar",
                id      : "55d1a2b18f61e2c90b000023"
            },
            {
                _id     : "55dd63f8f09cc2ec0b000006",
                name: {
                    last : "Ihnatko",
                    first: "Sergiy"
                },
                fullName: "Sergiy Ihnatko",
                id      : "55dd63f8f09cc2ec0b000006"
            },
            {
                _id     : "5649b8ccad4bc9e53f1f6192",
                name: {
                    last : "Gevelev",
                    first: "Sergiy"
                },
                fullName: "Sergiy Gevelev",
                id      : "5649b8ccad4bc9e53f1f6192"
            },
            {
                _id     : "5652dd95c4d12cf51e7f7e0b",
                name: {
                    last : "Petakh",
                    first: "Sergiy"
                },
                fullName: "Sergiy Petakh",
                id      : "5652dd95c4d12cf51e7f7e0b"
            },
            {
                _id     : "56e17848f625de2a2f9cacd1",
                name: {
                    last : "Biloborodov",
                    first: "Sergiy"
                },
                fullName: "Sergiy Biloborodov",
                id      : "56e17848f625de2a2f9cacd1"
            },
            {
                _id     : "55b92ad221e4b7c40f00004c",
                name: {
                    last : "Nayda",
                    first: "Sofia"
                },
                fullName: "Sofia Nayda",
                id      : "55b92ad221e4b7c40f00004c"
            },
            {
                _id     : "56d823e78230197c0e089038",
                name: {
                    last : "Marenych",
                    first: "Sofiya"
                },
                fullName: "Sofiya Marenych",
                id      : "56d823e78230197c0e089038"
            },
            {
                _id     : "561b756f9ebb48212ea838c0",
                name: {
                    last : "Romanyuk",
                    first: "Stanislav"
                },
                fullName: "Stanislav Romanyuk",
                id      : "561b756f9ebb48212ea838c0"
            },
            {
                _id     : "55b92ad221e4b7c40f000039",
                name: {
                    last : "Rikun",
                    first: "Stas"
                },
                fullName: "Stas Rikun",
                id      : "55b92ad221e4b7c40f000039"
            },
            {
                _id     : "55b92ad221e4b7c40f00007d",
                name: {
                    last : "Volskiy",
                    first: "Stas"
                },
                fullName: "Stas Volskiy",
                id      : "55b92ad221e4b7c40f00007d"
            },
            {
                _id     : "55b92ad221e4b7c40f0000ad",
                name: {
                    last : "Krovspey",
                    first: "Stepan"
                },
                fullName: "Stepan Krovspey",
                id      : "55b92ad221e4b7c40f0000ad"
            },
            {
                _id     : "55b92ad221e4b7c40f00008d",
                name: {
                    last : "Kira",
                    first: "Svitlana"
                },
                fullName: "Svitlana Kira",
                id      : "55b92ad221e4b7c40f00008d"
            },
            {
                _id     : "55b92ad221e4b7c40f0000ae",
                name: {
                    last : "Dolottseva",
                    first: "Tamara"
                },
                fullName: "Tamara Dolottseva",
                id      : "55b92ad221e4b7c40f0000ae"
            },
            {
                _id     : "55b92ad221e4b7c40f000061",
                name: {
                    last : "Mondok",
                    first: "Tamas"
                },
                fullName: "Tamas Mondok",
                id      : "55b92ad221e4b7c40f000061"
            },
            {
                _id     : "55b92ad221e4b7c40f000050",
                name: {
                    last : "Holovatska",
                    first: "Tamila"
                },
                fullName: "Tamila Holovatska",
                id      : "55b92ad221e4b7c40f000050"
            },
            {
                _id     : "55b92ad221e4b7c40f00007e",
                name: {
                    last : "Zmiy",
                    first: "Taras"
                },
                fullName: "Taras Zmiy",
                id      : "55b92ad221e4b7c40f00007e"
            },
            {
                _id     : "564a02e0ad4bc9e53f1f6194",
                name: {
                    last : "Dvorian",
                    first: "Taras"
                },
                fullName: "Taras Dvorian",
                id      : "564a02e0ad4bc9e53f1f6194"
            },
            {
                _id     : "56813fe29cceae182b907755",
                name: {
                    last : "Ukrainskiy",
                    first: "Taras"
                },
                fullName: "Taras Ukrainskiy",
                id      : "56813fe29cceae182b907755"
            },
            {
                _id     : "56d9497dae35cc4f0e721074",
                name: {
                    last : "TESTING",
                    first: "Test"
                },
                fullName: "Test TESTING",
                id      : "56d9497dae35cc4f0e721074"
            },
            {
                _id     : "56cf0928541812c071973593",
                name: {
                    last : "Shepitko",
                    first: "Tetiana"
                },
                fullName: "Tetiana Shepitko",
                id      : "56cf0928541812c071973593"
            },
            {
                _id     : "55b92ad221e4b7c40f000099",
                name: {
                    last : "Smertina",
                    first: "Tetyana"
                },
                fullName: "Tetyana Smertina",
                id      : "55b92ad221e4b7c40f000099"
            },
            {
                _id     : "55c98df0cbb0f4910b000007",
                name: {
                    last : "Berezhnoi",
                    first: "Timur"
                },
                fullName: "Timur Berezhnoi",
                id      : "55c98df0cbb0f4910b000007"
            },
            {
                _id     : "55b92ad221e4b7c40f00006a",
                name: {
                    last : "Tsipf",
                    first: "Vadim"
                },
                fullName: "Vadim Tsipf",
                id      : "55b92ad221e4b7c40f00006a"
            },
            {
                _id     : "56011186536bd29228000005",
                name: {
                    last : "Khruslov",
                    first: "Valentyn"
                },
                fullName: "Valentyn Khruslov",
                id      : "56011186536bd29228000005"
            },
            {
                _id     : "561bb5329ebb48212ea838c6",
                name: {
                    last : "Ladomiryak",
                    first: "Valerii"
                },
                fullName: "Valerii Ladomiryak",
                id      : "561bb5329ebb48212ea838c6"
            },
            {
                _id     : "55b92ad221e4b7c40f0000af",
                name: {
                    last : "Tokareva",
                    first: "Valeriya"
                },
                fullName: "Valeriya Tokareva",
                id      : "55b92ad221e4b7c40f0000af"
            },
            {
                _id     : "55b92ad221e4b7c40f00007f",
                name: {
                    last : "Klimchenko",
                    first: "Vasilisa"
                },
                fullName: "Vasilisa Klimchenko",
                id      : "55b92ad221e4b7c40f00007f"
            },
            {
                _id     : "55b92ad221e4b7c40f00003a",
                name: {
                    last : "Agosta",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Agosta",
                id      : "55b92ad221e4b7c40f00003a"
            },
            {
                _id     : "55b92ad221e4b7c40f000040",
                name: {
                    last : "Almashiy",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Almashiy",
                id      : "55b92ad221e4b7c40f000040"
            },
            {
                _id     : "55b92ad221e4b7c40f000053",
                name: {
                    last : "Seredniy",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Seredniy",
                id      : "55b92ad221e4b7c40f000053"
            },
            {
                _id     : "55b92ad221e4b7c40f000062",
                name: {
                    last : "Cheypesh",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Cheypesh",
                id      : "55b92ad221e4b7c40f000062"
            },
            {
                _id     : "55b92ad221e4b7c40f000080",
                name: {
                    last : "Barchiy",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Barchiy",
                id      : "55b92ad221e4b7c40f000080"
            },
            {
                _id     : "55b92ad221e4b7c40f000093",
                name: {
                    last : "Lupchey",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Lupchey",
                id      : "55b92ad221e4b7c40f000093"
            },
            {
                _id     : "55b92ad221e4b7c40f0000b4",
                name: {
                    last : "Prokopyshyn",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Prokopyshyn",
                id      : "55b92ad221e4b7c40f0000b4"
            },
            {
                _id     : "55d1d860dda01e250c000010",
                name: {
                    last : "Hoshovsky",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Hoshovsky",
                id      : "55d1d860dda01e250c000010"
            },
            {
                _id     : "55b92ad221e4b7c40f000088",
                name: {
                    last : "Buchok",
                    first: "Viktor"
                },
                fullName: "Viktor Buchok",
                id      : "55b92ad221e4b7c40f000088"
            },
            {
                _id     : "55b92ad221e4b7c40f000091",
                name: {
                    last : "Kiver",
                    first: "Viktor"
                },
                fullName: "Viktor Kiver",
                id      : "55b92ad221e4b7c40f000091"
            },
            {
                _id     : "55f9298456f79c9c0c000006",
                name: {
                    last : "Manhur",
                    first: "Viktor"
                },
                fullName: "Viktor Manhur",
                id      : "55f9298456f79c9c0c000006"
            },
            {
                _id     : "56c2f2a7dfd8a81466e2f71f",
                name: {
                    last : "Mateleshka",
                    first: "Viktor"
                },
                fullName: "Viktor Mateleshka",
                id      : "56c2f2a7dfd8a81466e2f71f"
            },
            {
                _id     : "5626278d750d38934bfa1313",
                name: {
                    last : "Rogachenko",
                    first: "Viktoria"
                },
                fullName: "Viktoria Rogachenko",
                id      : "5626278d750d38934bfa1313"
            },
            {
                _id     : "5637710e5d23a8eb04e80aed",
                name: {
                    last : "Kovalenko",
                    first: "Viktoria"
                },
                fullName: "Viktoria Kovalenko",
                id      : "5637710e5d23a8eb04e80aed"
            },
            {
                _id     : "55b92ad221e4b7c40f00003b",
                name: {
                    last : "Bizilya",
                    first: "Vitaliy"
                },
                fullName: "Vitaliy Bizilya",
                id      : "55b92ad221e4b7c40f00003b"
            },
            {
                _id     : "55b92ad221e4b7c40f00004e",
                name: {
                    last : "Shuba",
                    first: "Vitaliy"
                },
                fullName: "Vitaliy Shuba",
                id      : "55b92ad221e4b7c40f00004e"
            },
            {
                _id     : "55b92ad221e4b7c40f000081",
                name: {
                    last : "Sokhanych",
                    first: "Vitaliy"
                },
                fullName: "Vitaliy Sokhanych",
                id      : "55b92ad221e4b7c40f000081"
            },
            {
                _id     : "55b92ad221e4b7c40f000052",
                name: {
                    last : "Gerasimenko",
                    first: "Vladimir"
                },
                fullName: "Vladimir Gerasimenko",
                id      : "55b92ad221e4b7c40f000052"
            },
            {
                _id     : "561bb1269ebb48212ea838c5",
                name: {
                    last : "Pogorilyak",
                    first: "Vladimir"
                },
                fullName: "Vladimir Pogorilyak",
                id      : "561bb1269ebb48212ea838c5"
            },
            {
                _id     : "55eeed546dceaee10b00001e",
                name: {
                    last : "Turytskyi",
                    first: "Vladyslav"
                },
                fullName: "Vladyslav Turytskyi",
                id      : "55eeed546dceaee10b00001e"
            },
            {
                _id     : "568bbf935827e3b24d8123a8",
                name: {
                    last : "Hamalii",
                    first: "Vladyslav"
                },
                fullName: "Vladyslav Hamalii",
                id      : "568bbf935827e3b24d8123a8"
            },
            {
                _id     : "55eee9c26dceaee10b00001d",
                name: {
                    last : "Stepanchuk",
                    first: "Volodymyr"
                },
                fullName: "Volodymyr Stepanchuk",
                id      : "55eee9c26dceaee10b00001d"
            },
            {
                _id     : "55b92ad221e4b7c40f00004d",
                name: {
                    last : "Kopinets",
                    first: "Vyacheslav"
                },
                fullName: "Vyacheslav Kopinets",
                id      : "55b92ad221e4b7c40f00004d"
            },
            {
                _id     : "55b92ad221e4b7c40f000063",
                name: {
                    last : "Gusti",
                    first: "Yana"
                },
                fullName: "Yana Gusti",
                id      : "55b92ad221e4b7c40f000063"
            },
            {
                _id     : "55b92ad221e4b7c40f0000ca",
                name: {
                    last : "Vengerova",
                    first: "Yana"
                },
                fullName: "Yana Vengerova",
                id      : "55b92ad221e4b7c40f0000ca"
            },
            {
                _id     : "55f7c20a6d43203d0c000005",
                name: {
                    last : "Samaryk",
                    first: "Yana"
                },
                fullName: "Yana Samaryk",
                id      : "55f7c20a6d43203d0c000005"
            },
            {
                _id     : "5602a01550de7f4138000008",
                name: {
                    last : "Dufynets",
                    first: "Yana"
                },
                fullName: "Yana Dufynets",
                id      : "5602a01550de7f4138000008"
            },
            {
                _id     : "55b92ad221e4b7c40f000082",
                name: {
                    last : "Fuchko",
                    first: "Yaroslav"
                },
                fullName: "Yaroslav Fuchko",
                id      : "55b92ad221e4b7c40f000082"
            },
            {
                _id     : "55b92ad221e4b7c40f0000cf",
                name: {
                    last : "Denysiuk",
                    first: "Yaroslav"
                },
                fullName: "Yaroslav Denysiuk",
                id      : "55b92ad221e4b7c40f0000cf"
            },
            {
                _id     : "568bc0b55827e3b24d8123a9",
                name: {
                    last : "Syrota",
                    first: "Yaroslav"
                },
                fullName: "Yaroslav Syrota",
                id      : "568bc0b55827e3b24d8123a9"
            },
            {
                _id     : "56014cc8536bd29228000007",
                name: {
                    last : "Bezyk",
                    first: "Yevgenia"
                },
                fullName: "Yevgenia Bezyk",
                id      : "56014cc8536bd29228000007"
            },
            {
                _id     : "56e2e83a74ac46664a83e94b",
                name: {
                    last : "Melnyk",
                    first: "Yevgenia"
                },
                fullName: "Yevgenia Melnyk",
                id      : "56e2e83a74ac46664a83e94b"
            },
            {
                _id     : "55ed5a437221afe30b000006",
                name: {
                    last : "Porokhnitska",
                    first: "Yulia"
                },
                fullName: "Yulia Porokhnitska",
                id      : "55ed5a437221afe30b000006"
            },
            {
                _id     : "55b92ad221e4b7c40f000054",
                name: {
                    last : "Derevenko",
                    first: "Yuriy"
                },
                fullName: "Yuriy Derevenko",
                id      : "55b92ad221e4b7c40f000054"
            },
            {
                _id     : "55b92ad221e4b7c40f000065",
                name: {
                    last : "Sirko",
                    first: "Yuriy"
                },
                fullName: "Yuriy Sirko",
                id      : "55b92ad221e4b7c40f000065"
            },
            {
                _id     : "55b92ad221e4b7c40f00008f",
                name: {
                    last : "Holovatskyi",
                    first: "Yuriy"
                },
                fullName: "Yuriy Holovatskyi",
                id      : "55b92ad221e4b7c40f00008f"
            },
            {
                _id     : "55b92ad221e4b7c40f00009d",
                name: {
                    last : "Fedynec",
                    first: "Yuriy"
                },
                fullName: "Yuriy Fedynec",
                id      : "55b92ad221e4b7c40f00009d"
            },
            {
                _id     : "55f7c3736d43203d0c000006",
                name: {
                    last : "Bodak",
                    first: "Yuriy"
                },
                fullName: "Yuriy Bodak",
                id      : "55f7c3736d43203d0c000006"
            },
            {
                _id     : "56090d77066d979a33000009",
                name: {
                    last : "Bysaha",
                    first: "Yuriy"
                },
                fullName: "Yuriy Bysaha",
                id      : "56090d77066d979a33000009"
            }
        ]
    };
    var fakeDepsForDD = {
        data: [
            {
                _id              : "55b92ace21e4b7c40f000012",
                departmentManager: null,
                name             : ".NET/WP"
            },
            {
                _id              : "55b92ace21e4b7c40f000010",
                departmentManager: null,
                name             : "Android"
            },
            {
                _id              : "55b92ace21e4b7c40f000014",
                departmentManager: null,
                name             : "BusinessDev"
            },
            {
                _id              : "56802e9d1afe27f547b7ba51",
                departmentManager: null,
                name             : "CSS/FrontEnd"
            },
            {
                _id              : "55bb1f14cb76ca630b000006",
                departmentManager: "55b92ad221e4b7c40f000039",
                name             : "Design"
            },
            {
                _id              : "56cebdf6541812c07197358f",
                departmentManager: null,
                name             : "Development"
            },
            {
                _id              : "560c0b83a5d4a2e20ba5068c",
                departmentManager: null,
                name             : "Finance"
            },
            {
                _id              : "55b92ace21e4b7c40f000015",
                departmentManager: null,
                name             : "HR"
            },
            {
                _id              : "56802eb31afe27f547b7ba52",
                departmentManager: null,
                name             : "JS"
            },
            {
                _id              : "55b92ace21e4b7c40f000013",
                departmentManager: null,
                name             : "Marketing"
            },
            {
                _id              : "56802ec21afe27f547b7ba53",
                departmentManager: null,
                name             : "PHP/WordPress"
            },
            {
                _id              : "55bb1f40cb76ca630b000007",
                departmentManager: "55b92ad221e4b7c40f000030",
                name             : "PM"
            },
            {
                _id              : "55b92ace21e4b7c40f000011",
                departmentManager: null,
                name             : "QA"
            },
            {
                _id              : "566ee11b8453e8b464b70b73",
                departmentManager: null,
                name             : "Ruby on Rails"
            },
            {
                _id              : "56e6775c5ec71b00429745a4",
                departmentManager: null,
                name             : "Service"
            },
            {
                _id              : "56e175c4d62294582e10ca68",
                departmentManager: null,
                name             : "Unity"
            },
            {
                _id              : "55b92ace21e4b7c40f000016",
                departmentManager: null,
                name             : "Web"
            },
            {
                _id              : "55b92ace21e4b7c40f00000f",
                departmentManager: null,
                name             : "iOS"
            }
        ]
    };
    var fakeJobPosForDD = {
        data: [
            {
                _id : "55eeeddd6dceaee10b00001f",
                name: "2D Artist"
            },
            {
                _id : "55b92acf21e4b7c40f00002e",
                name: "Account Manager"
            },
            {
                _id : "5603a84fa5ac49794e00001a",
                name: "Accountant"
            },
            {
                _id : "55ddd8a2f09cc2ec0b000030",
                name: "CSS"
            },
            {
                _id : "56011b2d93b361cd28000005",
                name: "Chief Financial Officer"
            },
            {
                _id : "55b92acf21e4b7c40f000025",
                name: "Digital Marketing"
            },
            {
                _id : "56c47d6cd2b48ede4ba42200",
                name: "English teacher"
            },
            {
                _id : "56262666750d38934bfa1312",
                name: "Event/PR manager"
            },
            {
                _id : "55b92acf21e4b7c40f00002a",
                name: "HR Assistant"
            },
            {
                _id : "55b92acf21e4b7c40f000029",
                name: "HR manager"
            },
            {
                _id : "5643483270bbc2b740ce8a16",
                name: "Head of .NET/WP"
            },
            {
                _id : "56b1b2b0d6ef38a708dfc2a2",
                name: "Head of 2D"
            },
            {
                _id : "564438aa70bbc2b740ce8a19",
                name: "Head of Android"
            },
            {
                _id : "55b92acf21e4b7c40f000024",
                name: "Head of Business Development"
            },
            {
                _id : "56249299e9576d1728a9ed24",
                name: "Head of Design"
            },
            {
                _id : "56121847c90e2fb026ce0621",
                name: "Head of JS"
            },
            {
                _id : "55b92acf21e4b7c40f00001e",
                name: "Head of Marketing"
            },
            {
                _id : "564438d470bbc2b740ce8a1a",
                name: "Head of PM"
            },
            {
                _id : "5644388770bbc2b740ce8a18",
                name: "Head of QA"
            },
            {
                _id : "56c1914adfd8a81466e2f6db",
                name: "Head of ROR"
            },
            {
                _id : "564436a370bbc2b740ce8a17",
                name: "Head of iOS"
            },
            {
                _id : "56cc7ba1541812c07197357a",
                name: "IT Researcher"
            },
            {
                _id : "5681592f9cceae182b907757",
                name: "Junior .Net"
            },
            {
                _id : "55b92acf21e4b7c40f000021",
                name: "Junior Android"
            },
            {
                _id : "55b92acf21e4b7c40f000028",
                name: "Junior Designer"
            },
            {
                _id : "55b92acf21e4b7c40f000017",
                name: "Junior JS"
            },
            {
                _id : "55c98fb0cbb0f4910b000008",
                name: "Junior Java"
            },
            {
                _id : "55f7c4a36d43203d0c000007",
                name: "Junior PHP"
            },
            {
                _id : "561b73fb9ebb48212ea838bf",
                name: "Junior PM"
            },
            {
                _id : "55b92acf21e4b7c40f000018",
                name: "Junior QA"
            },
            {
                _id : "566ee0c68453e8b464b70b72",
                name: "Junior Ruby on Rails"
            },
            {
                _id : "55effa248f1e10e50b000005",
                name: "Junior Unity 3D"
            },
            {
                _id : "55b92acf21e4b7c40f00002d",
                name: "Junior WP"
            },
            {
                _id : "56b8b2116c411b590588feb8",
                name: "Junior WordPress"
            },
            {
                _id : "55b92acf21e4b7c40f00002c",
                name: "Junior iOS"
            },
            {
                _id : "56433d7c70bbc2b740ce8a15",
                name: "Middle .NET/WP"
            },
            {
                _id : "55b92acf21e4b7c40f000022",
                name: "Middle Android"
            },
            {
                _id : "55b92acf21e4b7c40f000023",
                name: "Middle Designer"
            },
            {
                _id : "55b92acf21e4b7c40f00001c",
                name: "Middle JS"
            },
            {
                _id : "55dd6259f09cc2ec0b000005",
                name: "Middle PHP"
            },
            {
                _id : "55b92acf21e4b7c40f000019",
                name: "Middle QA"
            },
            {
                _id : "56a9cb6eb4dc0d09232bd72c",
                name: "Middle Ruby on Rails"
            },
            {
                _id : "55c32e2a29bd6ccd0b000006",
                name: "Middle Unity 3D"
            },
            {
                _id : "55b92acf21e4b7c40f00001a",
                name: "Middle WP"
            },
            {
                _id : "56bde14cdfd8a81466e2f5ed",
                name: "Middle WordPress"
            },
            {
                _id : "55b92acf21e4b7c40f00001d",
                name: "Middle iOS"
            },
            {
                _id : "560114ab386dd9ad28000005",
                name: "Office Manager"
            },
            {
                _id : "55bf419165cda0810b000006",
                name: "P.M. Assistant"
            },
            {
                _id : "561b75f89ebb48212ea838c1",
                name: "PM"
            },
            {
                _id : "56b9cd808f23c5696159cd0a",
                name: "PR Manager Assistant"
            },
            {
                _id : "55b92acf21e4b7c40f00001f",
                name: "Sales"
            },
            {
                _id : "55b92acf21e4b7c40f00002f",
                name: "Senior .NET/WP"
            },
            {
                _id : "55b92acf21e4b7c40f000026",
                name: "Senior Android"
            },
            {
                _id : "56b1bea7d6ef38a708dfc2a3",
                name: "Senior Designer"
            },
            {
                _id : "55b92acf21e4b7c40f00002b",
                name: "Senior JS"
            },
            {
                _id : "560ba3a26f2e91ef2ee305f4",
                name: "Senior PM"
            },
            {
                _id : "5600025da36a8ca10c000027",
                name: "Senior SQL"
            },
            {
                _id : "55b92acf21e4b7c40f000027",
                name: "Senior iOS"
            },
            {
                _id : "5629e3c284deb7cb59d61b61",
                name: "Sysadmin"
            },
            {
                _id : "55b92acf21e4b7c40f00001b",
                name: "Tech.writer"
            },
            {
                _id : "55ded360ae2b22730b000043",
                name: "UI Designer"
            },
            {
                _id : "55b92acf21e4b7c40f000020",
                name: "Unity3D"
            }
        ]
    };
    var employeeCollection;
    var view;
    var topBarView;
    var listView;
    var thumbnailView;
    var createView;
    var jQueryAjaxSpy;
    var historyNavigateSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('Employees View', function () {
        var $fixture;
        var $elFixture;
        var selectSpy;
        var removeFilterSpy;
        var removedFromDBSpy;
        var saveFilterSpy;
        var debOnceStub;

        before(function () {
            debOnceStub = sinon.stub(_, 'debounce', function (debFunction) {
                return debFunction;
            });
            jQueryAjaxSpy = sinon.spy($, 'ajax');
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
            selectSpy = sinon.spy(FilterGroup.prototype, 'selectValue');
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
            saveFilterSpy = sinon.spy(SavedFilters.prototype, 'saveFilter');
            removedFromDBSpy = sinon.spy(SavedFilters.prototype, 'removeFilterFromDB');
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();
            thumbnailView.remove();
            createView.remove();

            selectSpy.restore();
            removeFilterSpy.restore();
            saveFilterSpy.restore();
            debOnceStub.restore();
            jQueryAjaxSpy.restore();
            historyNavigateSpy.restore();
            selectSpy.restore();
            removeFilterSpy.restore();
            removedFromDBSpy.restore();
            saveFilterSpy.restore();
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

                view = new MainView({el: $elFixture, contentType: 'Employees'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="42"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="42"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Employees');
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
                var employeeListUrl = new RegExp('\/employees\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', employeeListUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                employeeCollection = new EmployeeCollection({
                    filter     : null,
                    viewType   : 'list',
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'Employees'
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
                expect(historyNavigateSpy.args[0][0]).to.be.equals('#login');
            });

            it('Try to create TopBarView', function () {
                var employeeListUrl = new RegExp('\/employees\/', 'i');

                server.respondWith('GET', employeeListUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployeeForList)]);

                employeeCollection = new EmployeeCollection({
                    filter     : null,
                    viewType   : 'list',
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'Employees'
                });
                server.respond();

                expect(employeeCollection).to.have.lengthOf(5)

                topBarView = new TopBarView({
                    collection: employeeCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#forImport')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

            it('Try to switch between the viewTypes', function () {
                var $topBarEl = topBarView.$el;
                var $listBtn = $topBarEl.find('#listBtn');
                var $thumbBtn = $topBarEl.find('#thumbBtn');

                $listBtn.click();
                expect(window.location.hash).to.be.equals('#easyErp/Employees/list');

                $thumbBtn.click();
                expect(window.location.hash).to.be.equals('#easyErp/Employees/thumbnails');
            });
        });

        describe('Employees list view', function () {
            var server;
            var mainSpy;
            var $thisEl;
            var exportStub;
            var exportStubXlsx;
            var clock;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
                exportStub = sinon.stub(ListView.prototype, 'exportToCsv');
                exportStubXlsx = sinon.stub(ListView.prototype, 'exportToXlsx');
                exportStub.returns(true);
                exportStubXlsx.returns(true);
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                exportStub.restore();
                exportStubXlsx.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create Employees listView', function (done) {
                    var employeeAlphabetUrl = new RegExp('\/employees\/getEmployeesAlphabet', 'i');
                    var filterUrl = '/filter/Employees';
                    var elementsCount;
                    var subject;
                    var $pagination;
                    var $currentPageList;
                    var $pageList;
                    var countColumn;
                    var $firstRow;

                    server.respondWith('GET', filterUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilters)]);
                    server.respondWith('GET', employeeAlphabetUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeAphabet)]);
                    listView = new ListView({
                        collection: employeeCollection,
                        startTime : new Date()
                    });

                    server.respond();

                    clock.tick(700);

                    eventsBinder.subscribeCollectionEvents(employeeCollection, listView);
                    eventsBinder.subscribeTopBarEvents(topBarView, listView);

                    employeeCollection.trigger('fetchFinished', {
                        totalRecords: employeeCollection.totalRecords,
                        currentPage : employeeCollection.currentPage,
                        pageSize    : employeeCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl).to.exist;
                    expect($thisEl.find('#searchContainer')).to.exist;
                    expect($thisEl.find('#startLetter')).to.exist;
                    expect($thisEl.find('.pagination')).to.exist;

                    elementsCount = $thisEl.find('#listTable > tr').length;
                    expect(elementsCount).to.be.equals(5);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    countColumn = $firstRow.find('td').length;
                    expect(countColumn).to.be.equals(11);

                    subject = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(subject).not.to.be.empty;
                    expect(subject).to.not.match(/object Object|undefined/);

                    subject = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(subject).to.not.match(/object Object|undefined/);

                    subject = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(subject).to.not.match(/object Object|undefined/);

                    subject = $firstRow.find('td:nth-child(6) > a').text().trim();
                    expect(subject).to.not.match(/object Object|undefined/);

                    subject = $firstRow.find('td:nth-child(7)').text().trim();
                    expect(subject).to.not.match(/object Object|undefined/);

                    subject = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(subject).to.not.match(/object Object|undefined/);

                    subject = $firstRow.find('td:nth-child(9)').text().trim();
                    expect(subject).to.not.match(/object Object|undefined/);

                    expect($firstRow.find('td:nth-child(10)').find('a')).to.be.not.empty;
                    /* expect(stage).not.to.be.empty;
                     expect(stage).to.not.match(/object Object|undefined/);*/

                    subject = $firstRow.find('td:nth-child(11)').text().trim();
                    expect(subject).to.not.match(/object Object|undefined/);

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
                    expect(window.location.hash).to.be.equals('#easyErp/Employees/list/p=1/c=25');
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
                    expect(window.location.hash).to.be.equals('#easyErp/Employees/list/p=2/c=25');
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
                    expect(window.location.hash).to.be.equals('#easyErp/Employees/list/p=1/c=50');
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
                    expect(window.location.hash).to.be.equals('#easyErp/Employees/list/p=1/c=100');

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
                    expect(window.location.hash).to.be.equals('#easyErp/Employees/list/p=1/c=200');
                });

                it('Try to export to Csv', function () {
                    var $needEl = topBarView.$el.find('#top-bar-exportToCsvBtn');
                    $needEl.click();
                    expect(exportStub.calledOnce).to.be.true;
                });

                it('Try to export to Csv', function () {
                    var $needEl = topBarView.$el.find('#top-bar-exportToXlsxBtn');
                    $needEl.click();
                    expect(exportStubXlsx.calledOnce).to.be.true;
                });

                it('Try to go to EditForm with error', function (done) {
                    this.timeout(4000);
                    var spyResponse;
                    var $needEl = listView.$el.find('[data-id="560264bb8dc408c632000005"] > td:nth-child(3)');
                    var employeeUrl = new RegExp('\/employees\/', 'i');
                    server.respondWith('GET', employeeUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmpWithId)]);

                    $needEl.click();

                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');

                    done();
                });

                it('Try to go to EditForm', function (done) {
                    var employeeModel;
                    var $dialogEl;
                    var $needEl = listView.$el.find('[data-id="560264bb8dc408c632000005"] > td:nth-child(3)');
                    var employeeUrl = new RegExp('\/employees\/', 'i');
                    var employeePersonsForDDUrl = new RegExp('\/employees\/getForDd', 'i');
                    var depsForDDurl = new RegExp('\/departments\/getForDD', 'i');

                    this.timeout(4000);

                    server.respondWith('GET', employeeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmpWithId)]);
                    server.respondWith('GET', depsForDDurl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepsForDD)]);

                    $needEl.click();

                    server.respond();
                    server.respond();

                    $dialogEl = $('.ui-dialog');

                    expect($dialogEl).to.exist;
                    $dialogEl.remove();
                    done();
                });

                it('Try to click on alphabet letter', function () {
                    var $needLetterEl = $thisEl.find('#startLetter > a:nth-child(3)');
                    var $allLetter = $thisEl.find('#startLetter > a:nth-child(1)');
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var ajaxResponse;

                    jQueryAjaxSpy.reset();

                    $needLetterEl.click();
                    expect(jQueryAjaxSpy.calledOnce).to.be.true;
                    ajaxResponse = jQueryAjaxSpy.args[0][0];
                    expect(ajaxResponse.data).to.have.property('filter');
                    expect(ajaxResponse.data.filter).to.have.property('letter');
                    expect($searchContainer.find('.forFilterIcons')).to.have.lengthOf(1);

                    jQueryAjaxSpy.reset();

                    $allLetter.click();
                    expect(jQueryAjaxSpy.calledOnce).to.be.true;
                    ajaxResponse = jQueryAjaxSpy.args[0][0];
                    expect(ajaxResponse.data).to.have.property('filter');
                    expect(ajaxResponse.data.filter).to.have.not.property('letter');
                    expect($searchContainer.find('.forFilterIcons')).to.have.lengthOf(0);
                });

                it('Try to filter listView by  and company', function () {
                    var url = '/employees/';
                    var contentType = 'Employees';
                    var firstValue = 'name';
                    var secondValue = 'department';
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var contentUrl = new RegExp(url, 'i');
                    var $firstContainer = '#' + firstValue + 'FullContainer .groupName';
                    var $firstSelector = '#' + firstValue + 'Ul > li:nth-child(1)';
                    var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
                    var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
                    var elementQuery = '#listTable > tr';
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
                    jQueryAjaxSpy.reset();
                    $firstGroup = $searchContainer.find($firstContainer);
                    $firstGroup.click();

                    $selectedItem = $searchContainer.find($firstSelector);

                    server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployeeForList)]);
                    $selectedItem.click();
                    server.respond();

                    expect(selectSpy.calledOnce).to.be.true;
                    expect($thisEl.find('#searchContainer')).to.exist;
                    //expect($thisEl.find('#startLetter')).to.exist;
                    expect($searchContainer.find('#searchFilterContainer>div')).to.have.lengthOf(1);
                    expect($searchContainer.find($firstSelector)).to.have.class('checkedValue');
                    elementsCount = $thisEl.find(elementQuery).length;
                    expect(elementsCount).to.be.not.equals(0);

                    expect(jQueryAjaxSpy.calledOnce).to.be.true;

                    ajaxResponse = jQueryAjaxSpy.args[0][0];
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
                    jQueryAjaxSpy.reset();

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

                    ajaxResponse = jQueryAjaxSpy.args[0][0];
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

                    ajaxResponse = jQueryAjaxSpy.args[0][0];
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
                    server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeResponseSaveFilter)]);
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
                    expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
                });

                it('Try to remove filter', function () {
                    var secondValue = 'department';
                    var $searchContainer = $('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
                    var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
                    var $thisEl = $('#content-holder');
                    var $secondGroup;
                    var $selectedItem;
                    var $removeBtn;

                    $searchArrow.click();

                    $secondGroup = $thisEl.find($secondContainer);
                    $secondGroup.click();
                    $selectedItem = $searchContainer.find($secondSelector);
                    $selectedItem.click();
                    server.respond();

                    // remove firstGroupFilter
                    jQueryAjaxSpy.reset();
                    removeFilterSpy.reset();

                    $removeBtn = $searchContainer.find('.removeValues');
                    $removeBtn.click();
                    server.respond();

                    clock.tick(1500);

                    expect(removeFilterSpy.calledOnce).to.be.true;
                    expect(jQueryAjaxSpy.calledOnce).to.be.true;
                });
            });
        });

        describe('Thumbnails View', function () {
            var server;
            var mainSpy;
            var $dialogEl;
            var clock;
            var exportStub;
            var exportStubXlsx;
            var windowConfirmStub;
            var windowAlertStub;
            var $thisEl;

            before(function () {
                window.location.hash = '#easyErp/Employees/thumbnails';
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowAlertStub = sinon.stub(window, 'alert');
                exportStub = sinon.stub(ThumbnailsView.prototype, 'exportToCsv');
                exportStubXlsx = sinon.stub(ThumbnailsView.prototype, 'exportToXlsx');
                exportStub.returns(true);
                exportStubXlsx.returns(true);
                windowConfirmStub.returns(true);
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                clock.restore();
                windowConfirmStub.restore();
                windowAlertStub.restore();
                exportStub.restore();
                exportStubXlsx.restore();
            });

            it('Try to fail create thumbnails view', function () {
                var $thumbHolder;
                var employeeThumbUrl = new RegExp('\/employees', 'i');
                var employeeAlphabetUrl = new RegExp('\/employees\/getEmployeesAlphabet', 'i');

                server.respondWith('GET', employeeThumbUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                employeeCollection = new EmployeeCollection({
                    count      : 1,
                    viewType: 'thumbnails',
                    contentType: 'Employees'
                });

                server.respond();

                thumbnailView = new ThumbnailsView({
                    collection: employeeCollection,
                    startTime : new Date()
                });

                $thumbHolder = thumbnailView.$el;

                expect($thumbHolder).to.exist;
                expect($thumbHolder.find('h2')).to.have.text("No Employees found");
            });

            it('Try to create thumbnails view', function () {
                var employeeThumbUrl = new RegExp('\/employees', 'i');
                var employeeAlphabetUrl = new RegExp('\/employees\/getEmployeesAlphabet', 'i');

                server.respondWith('GET', employeeThumbUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployeeForThumb)]);

                employeeCollection = new EmployeeCollection({
                    count      : 1,
                    viewType: 'thumbnails',
                    contentType: 'Employees'
                });

                server.respond();

                server.respondWith('GET', employeeAlphabetUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeAphabet)]);

                thumbnailView = new ThumbnailsView({
                    collection: employeeCollection,
                    startTime : new Date()
                });

                server.respond();

                clock.tick(300);

                eventsBinder.subscribeCollectionEvents(employeeCollection, thumbnailView);
                eventsBinder.subscribeTopBarEvents(topBarView, thumbnailView);

                employeeCollection.trigger('fetchFinished', {
                    totalRecords: employeeCollection.totalRecords,
                    currentPage : employeeCollection.currentPage,
                    pageSize    : employeeCollection.pageSize
                });

                $thisEl = thumbnailView.$el;

                expect($thisEl).to.exist;
                expect($thisEl.find('#searchContainer')).to.exist;
                expect($thisEl.find('#startLetter')).to.exist;
            });

            it('Try to go to EditForm with error', function (done) {
                this.timeout(4000);
                var spyResponse;
                var $needEl = $thisEl.find('#55b92ad221e4b7c40f00004e');
                var employeeUrl = new RegExp('\/employees\/', 'i');
                server.respondWith('GET', employeeUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmpWithId)]);

                $needEl.click();

                server.respond();

                spyResponse = mainSpy.args[1][0];
                expect(spyResponse).to.have.property('type', 'error');
                expect(spyResponse).to.have.property('message', 'Please refresh browser');

                done();

            });

            it('Try to export to Csv', function () {
                var $needEl = topBarView.$el.find('#top-bar-exportToCsvBtn');
                $needEl.click();
                expect(exportStub.calledOnce).to.be.true;
            });

            it('Try to export to Xlsx', function () {
                var $needEl = topBarView.$el.find('#top-bar-exportToXlsxBtn');
                $needEl.click();
                expect(exportStubXlsx.calledOnce).to.be.true;
            });

            it('Try to go to EditForm', function (done) {
                var employeeModel;
                var editForm;
                var $needEl = thumbnailView.$el.find('#55b92ad221e4b7c40f00004e');
                var employeeUrl = new RegExp('\/employees\/', 'i');
                var employeePersonsForDDUrl = new RegExp('\/employees\/getForDd', 'i');
                var depsForDDurl = new RegExp('\/departments\/getForDD', 'i');
                this.timeout(3000);
                server.respondWith('GET', employeeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmpWithId)]);
                server.respondWith('GET', depsForDDurl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepsForDD)]);

                $needEl.click();

                server.respond();
                server.respond();

                $dialogEl = $('.ui-dialog');

                expect($dialogEl).to.exist;
                done();

            });

            it('Try to take notification in Edit Form', function () {
                var departmentTab = $dialogEl.find('#department');
                var spyResponse;

                departmentTab.click();
                spyResponse = mainSpy.args[3][0];

                expect(spyResponse).to.have.property('type', 'notify');
                expect(spyResponse).to.have.property('message', 'You can edit department at "Job" tab');

            });

            it('Try to change tab in Edit Form', function () {
                var $secondTab = $dialogEl.find('ul > li:nth-child(2) > a');

                $secondTab.click();

                expect($dialogEl.find('ul > li:nth-child(2) > a')).to.have.class('active');
            });

            it('Try to showEdit|hideEdit', function (done) {
                this.timeout(7000);
                var $dialog = $('.ui-dialog');
                var $avatar = $dialog.find('.avatar');

                $avatar.mouseenter();
                clock.tick(3500);

                $avatar.mouseleave();
                clock.tick(3500);

                done();
            });

            it('Try to Update Job', function () {
                var $updateBtn;
                var $hireDateEl;
                var $salaryEl;
                var $managerEl;
                var $newSelect;
                var $nextBtn;
                var $thirdTab = $dialogEl.find('ul > li:nth-child(3) > a');

                $thirdTab.click();

                $hireDateEl = $dialogEl.find('.transfer[data-id="9"] > td.editable.date');
                $hireDateEl.click();
                $('.editing').val('24 Sep, 2016');

                $managerEl = $dialogEl.find('.transfer[data-id="9"] #departmentsDd');
                $managerEl.click();
                $newSelect = $dialogEl.find('div.newSelectList');
                $nextBtn = $newSelect.find('a.next');
                $nextBtn.click();
                $newSelect.find('#56802ec21afe27f547b7ba53').click();

                $salaryEl = $dialogEl.find('.transfer[data-id="9"] > td.editable[data-id="salary"]');
                $salaryEl.click();
                $salaryEl.find('.editing').val('15000');
                $dialogEl.find('.transfer[data-id="9"] > td:nth-child(2)').click();

                expect($dialogEl.find('.transfer[data-id="9"] #departmentsDd').attr('data-id')).to.be.equals('56802ec21afe27f547b7ba53');
                expect($salaryEl.find('.editing').val()).to.be.equals('15000');

            });

            it('Try to delete job row', function () {
                var $deleteBtn = $dialogEl.find('.fa-trash');

                $deleteBtn.click();

                expect($dialogEl.find('#hire3')).to.not.exist;
            });

            it('Try to end contract', function () {
                var $newSelectEl;
                var $endContractArrowEl = $dialogEl.find('ul > li.right.withEndContract > span.arrow');

                $endContractArrowEl.click();

                $newSelectEl = $dialogEl.find('ul > li.right.withEndContract > ul > li:nth-child(1)');

                $newSelectEl.click();

                expect($dialogEl.find('[data-content="fired"]')).to.exist;
            });

            it('Try to save with error', function () {
                var employeeUrl = '/employees/';
                var $saveBtn = $dialogEl.find('button.btn.ui-button:nth-child(1)');
                server.respondWith('POST', employeeUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $saveBtn.click();
                server.respond();
                expect($('.ui-dialog')).to.exist;
            });

            it('Try to save item with fired (must be redirected to kanban)', function () {

                var $saveBtn = $dialogEl.find('button.btn.ui-button:nth-child(1)');
                var employeeUrl = new RegExp('\/employees\/', 'i');

                server.respondWith('PATCH', employeeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);

                $saveBtn.click();

                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Applications/kanban');
                $dialogEl.remove();

            });

            it('Try to save item', function () {

                var $needEl = thumbnailView.$el.find('#55b92ad221e4b7c40f00004e');
                var employeeUrl = new RegExp('\/employees\/', 'i');
                var employeePersonsForDDUrl = new RegExp('\/employees\/getForDd', 'i');
                var depsForDDurl = new RegExp('\/departments\/getForDD', 'i');

                server.respondWith('GET', employeeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmpWithId)]);
                server.respondWith('GET', depsForDDurl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepsForDD)]);

                $needEl.click();
                server.respond();
                server.respond();
                $dialogEl = $('.ui-dialog');

                $dialogEl.find('#first').val('adasd');

                var $saveBtn = $dialogEl.find('button.btn.ui-button:nth-child(1)');
                var employeeUrl = new RegExp('\/employees\/', 'i');

                server.respondWith('PATCH', employeeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);

                $saveBtn.click();

                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Applications/kanban');
                $dialogEl.remove();

            });
            it('Try to fail delete employee', function () {
                var $deleteBtn;
                var $needEl = thumbnailView.$el.find('#55b92ad221e4b7c40f00004e');
                var employeeUrl = new RegExp('\/employees\/', 'i');

                windowConfirmStub.returns(true);

                server.respondWith('GET', employeeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmpWithId)]);
                $needEl.click();
                server.respond();

                $deleteBtn = $('.ui-dialog button:nth-child(3)');

                server.respondWith('DELETE', employeeUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $deleteBtn.click();
                server.respond();

                expect($dialogEl).to.exist;

            });

            it('Try to delete employee', function () {
                var $deleteBtn;
                var $needEl = thumbnailView.$el.find('#55b92ad221e4b7c40f00004e');
                var employeeUrl = new RegExp('\/employees\/', 'i');

                $deleteBtn = $('.ui-dialog button:nth-child(3)');

                server.respondWith('DELETE', employeeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $deleteBtn.click();
                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Employees');

            });

            it('Try to click alphabetic letter', function () {
                var $needLetterEl = thumbnailView.$el.find('#startLetter > a:nth-child(3)');
                var $allLetter = $thisEl.find('#startLetter > a:nth-child(1)');
                var $searchContainer = $thisEl.find('#searchContainer');
                var ajaxResponse;

                jQueryAjaxSpy.reset();

                $needLetterEl.click();
                server.respond();
                //expect(jQueryAjaxSpy.calledOnce).to.be.true;
                ajaxResponse = jQueryAjaxSpy.args[0][0];
                expect(ajaxResponse.data).to.have.property('filter');
                expect(ajaxResponse.data.filter).to.have.property('letter');
                expect($searchContainer.find('.forFilterIcons')).to.have.lengthOf(1);

                jQueryAjaxSpy.reset();

                $allLetter.click();
                server.respond();
                //expect(jQueryAjaxSpy.calledOnce).to.be.true;
                ajaxResponse = jQueryAjaxSpy.args[0][0];
                expect(ajaxResponse.data).to.have.property('filter');
                expect(ajaxResponse.data.filter).to.have.not.property('letter');
                expect($searchContainer.find('.forFilterIcons')).to.have.lengthOf(0);
            });

            it('Try to create CreateView', function () {
                var jobPositionUrl = new RegExp('\/jobPositions\/getForDd', 'i');
                var usersForDDUrl = '/users/forDd';
                var depsForDDUrl = new RegExp('\/departments\/getForDD', 'i');
                var managersUrl = new RegExp('\/employees\/getForDd', 'i');
                var jobTypesUrl = new RegExp('\/jobPositions\/jobType', 'i');

                server.respondWith('GET', jobPositionUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJobPosForDD)]);
                server.respondWith('GET', usersForDDUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', depsForDDUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepsForDD)]);
                server.respondWith('GET', managersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmpPersonsForDD)]);
                server.respondWith('GET', jobTypesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeJobPositionType)]);

                createView = new CreateView();
                server.respond();
                server.respond();
                server.respond();
                server.respond();
                server.respond();

                expect($('.ui-dialog')).to.exist;
            });

            it('Try to change tab in CreateView', function () {
                var $dialogEl = $('.ui-dialog');
                var $firstTab = $dialogEl.find('ul > li:nth-child(1) > a');
                var $secondTab = $dialogEl.find('ul > li:nth-child(2) > a');

                expect($firstTab).to.have.class('active');

                $secondTab.click();

                expect($dialogEl.find('ul > li:nth-child(2) > a')).to.have.class('active');

                $firstTab.click();

                expect($dialogEl.find('ul > li:nth-child(1) > a')).to.have.class('active');

            });

            it('Try to create employee without need data', function () {
                var spyResponse;
                var $createBtnEl = $('#createBtnDialog');

                $createBtnEl.click();
                spyResponse = mainSpy.args[4][0];

                expect(spyResponse).to.have.property('type', 'error');

            });

            it('Try to create employee', function () {
                var $needLiEl;
                var $ownerBtn;
                var $next;
                var $prev;
                var $selectedItem;
                var $manageUserBtn;
                var $selectedUser;
                var $manageUserDialog;
                var $chooseUserBtn;
                var $cancelUserBtn;
                var $manageGroupBtn;
                var $cancelGroupBtn;
                var $manageGroupDialog;
                var $selectedGroup;
                var $chooseGroupBtn;
                var employeeUrl = '/employees/';
                var $dialogEl = $('.ui-dialog');
                var $firstName = $dialogEl.find('#first');
                var $lastName = $dialogEl.find('#last');
                var $dateOfBirth = $dialogEl.find('#dateBirth');
                var $jobPositionSelect = $dialogEl.find('#jobPositionDd');
                var $thirdTab = $dialogEl.find('ul > li:nth-child(3) > a');
                var $hireDateEl;
                var $salaryEl;
                var $managerEl;
                var jobPositionEl;
                var $newSelect;
                var $nextBtn;
                var $thirdTab = $dialogEl.find('ul > li:nth-child(3) > a');

                this.timeout(4000);

                $firstName.val('test');
                $lastName.val('test');
                $dateOfBirth.val('5 Apr, 1991');

                $needLiEl = $dialogEl.find('#55eeeddd6dceaee10b00001f');
                $needLiEl.click();

                //assignes view
                $thirdTab.click();

                //select owner
                $ownerBtn = $dialogEl.find('#allUsersSelect');
                $ownerBtn.click();
                $next = $dialogEl.find('.next');
                $next.click();
                $prev = $dialogEl.find('.prev');
                $prev.click();
                $selectedItem = $dialogEl.find('#560c099da5d4a2e20ba5068b');
                $selectedItem.click();

                // edit Job
                $thirdTab.click();

                $hireDateEl = $dialogEl.find('.transfer[data-id="0"] > td.editable.date');
                $hireDateEl.click();
                $('.editing').val('24 Sep, 2016');

                $jobPositionSelect = $dialogEl.find('.transfer[data-id="0"] #jobPositionDd');
                $jobPositionSelect.click();
                $newSelect = $dialogEl.find('div.newSelectList #55ddd8a2f09cc2ec0b000030');
                $newSelect.click();

                $managerEl = $dialogEl.find('.transfer[data-id="0"] #departmentsDd');
                $managerEl.click();
                $newSelect = $dialogEl.find('div.newSelectList');
                $nextBtn = $newSelect.find('a.next');
                $nextBtn.click();
                $newSelect.find('#56802ec21afe27f547b7ba53').click();

                $managerEl = $dialogEl.find('.transfer[data-id="0"] #projectManagerDD');
                $managerEl.click();
                $newSelect = $dialogEl.find('div.newSelectList');
                $nextBtn = $newSelect.find('a.next');
                $nextBtn.click();
                $newSelect.find('#55b92ad221e4b7c40f00004f').click();

                $managerEl = $dialogEl.find('.transfer[data-id="0"] #jobTypeDd');
                $managerEl.click();
                $newSelect = $dialogEl.find('div.newSelectList');
                $newSelect.find('#fullTime').click();

                $salaryEl = $dialogEl.find('.transfer[data-id="0"] > td.editable[data-id="salary"]');
                $salaryEl.click();
                $salaryEl.find('.editing').val('15000');
                $dialogEl.find('.transfer[data-id="0"] > td:nth-child(2)').click();

                expect($dialogEl.find('.transfer[data-id="0"] #departmentsDd').attr('data-id')).to.be.equals('56802ec21afe27f547b7ba53');
                expect($salaryEl.find('.editing').val()).to.be.equals('15000');

                // manage user
                $manageUserBtn = $dialogEl.find('.addUser');
                $manageUserBtn.click();
                server.respond();

                $cancelUserBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.add-user-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                $cancelUserBtn.click();
                $manageUserBtn.click();
                server.respond();

                // choose user
                $chooseUserBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.add-user-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                $manageUserDialog = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.add-user-dialog.ui-dialog-buttons.ui-draggable');
                $selectedUser = $manageUserDialog.find('#55ba2ef1d79a3a343900001c');
                $selectedUser.click();
                $next = $manageUserDialog.find('.nextUserList');
                $next.click();
                $prev = $manageUserDialog.find('.prevUserList');
                $prev.click();
                $selectedUser = $manageUserDialog.find('#56224c43c558b13c1bbf8756');
                $selectedUser.click();
                $selectedUser.click();

                $chooseUserBtn.click();

                // manage group
                $manageGroupBtn = $dialogEl.find('.addGroup');
                $manageGroupBtn.click();
                $cancelGroupBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.add-group-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                $cancelGroupBtn.click();

                $manageGroupBtn.click();
                server.respond();

                // choose group
                $manageGroupDialog = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.add-group-dialog.ui-dialog-buttons.ui-draggable');
                $selectedGroup = $manageGroupDialog.find('#56e6775c5ec71b00429745a4');
                $selectedGroup.click();
                $selectedGroup = $manageGroupDialog.find('#56802e9d1afe27f547b7ba51');
                $selectedGroup.click();
                $selectedGroup.click();
                $chooseGroupBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.add-group-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                $chooseGroupBtn.click();

                //expect($('.ui-dialog')).to.not.exist;

            });

            it('Try to save with error', function () {
                var employeeUrl = '/employees/';
                var $createBtnEl = $('#createBtnDialog');
                server.respondWith('POST', employeeUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $createBtnEl.click();
                server.respond();
                expect($('.ui-dialog')).to.exist;
            });

            it('Try to save with success', function () {
                var employeeUrl = '/employees/';
                var $createBtnEl = $('#createBtnDialog');
                server.respondWith('POST', employeeUrl, [201, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $createBtnEl.click();
                server.respond();

                expect($('.ui-dialog')).to.not.exist;
            });

            it('Try to show more employees', function () {
                var $showMoreBtn = thumbnailView.$el.find('#showMore');
                var employeeThumbUrl = new RegExp('\/employees\/thumbnails', 'i');
                var totalCollectionUrl = new RegExp('\/employees\/totalCollectionLength', 'i');
                var $thumbHolder;

                server.respondWith('GET', employeeThumbUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployeeForThumb)]);
                server.respondWith('GET', totalCollectionUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    showMore: false,
                    count   : 2
                })]);

                $showMoreBtn.click();

                server.respond();

                $thumbHolder = thumbnailView.$el;

                expect($thumbHolder).to.exist;

            });
        });
    });
});
