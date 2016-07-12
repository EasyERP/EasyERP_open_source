define([
    'Backbone',
    'Underscore',
    'modules',
    'text!fixtures/index.html',
    'collections/Opportunities/filterCollection',
    'collections/Workflows/WorkflowsCollection',
    'views/main/MainView',
    'views/Opportunities/list/ListView',
    'views/Opportunities/kanban/KanbanView',
    'views/Opportunities/form/FormView',
    'views/Opportunities/TopBarView',
    'views/Opportunities/CreateView',
    'views/Opportunities/EditView',
    'views/Filter/filterView',
    'views/Filter/filtersGroup',
    'views/Filter/savedFiltersView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'testConstants/currentUser',
    'constants/filters'
], function (Backbone,
             _,
             modules,
             fixtures,
             OpportunitiesCollection,
             WorkflowCollection,
             MainView,
             ListView,
             KanbanView,
             FormView,
             TopBarView,
             CreateView,
             EditView,
             FilterView,
             FilterGroup,
             SavedFilters,
             eventsBinder,
             $,
             chai,
             chaiJquery,
             sinonChai,
             fakeCurrentUser,
             FILTER_CONSTANTS) {
    'use strict';

    var fakeOpportunities = {
        total: 35,
        data : [
            {
                _id            : "56af668374d57e0d56d6bf2f",
                total          : 38,
                contactName    : " ",
                salesPerson    : {
                    name: {
                        last : "Yartysh",
                        first: "Nataliya"
                    }
                },
                workflow       : {
                    _id         : "528cdf1cf3f67bc40b00000b",
                    __v         : 0,
                    attachments : [],
                    color       : "#2C3E50",
                    name        : "Lost",
                    sequence    : 0,
                    status      : "Cancelled",
                    wId         : "Opportunities",
                    wName       : "opportunity",
                    source      : "opportunity",
                    targetSource: [
                        "opportunity"
                    ],
                    visible     : true
                },
                createdBy      : {
                    user: "alina.yurenko",
                    date: "2016-02-01T14:06:59.178Z"
                },
                editedBy       : {
                    user: "admin",
                    date: "2016-05-18T07:09:03.810Z"
                },
                creationDate   : "2016-02-01T14:06:59.177Z",
                isOpportunitie : true,
                name           : "ERP integration",
                expectedRevenue: {
                    value   : 0,
                    progress: 0,
                    currency: null
                },
                attachments    : [],
                notes          : [],
                convertedDate  : "2016-05-27T11:05:22.285Z",
                isConverted    : true,
                source         : "website",
                campaign       : "web",
                sequence       : 0,
                reffered       : "",
                optout         : false,
                active         : false,
                color          : "#4d5a75",
                categories     : {
                    name: "",
                    id  : ""
                },
                priority       : "P3",
                expectedClosing: "2016-03-06T23:00:00.000Z",
                nextAction     : {
                    desc: "",
                    date: "2016-01-31T23:00:00.000Z"
                },
                internalNotes  : "We're looking for an ERP solution to integrate with our existing event entry system we need to be able to white label this product and offer to our customers. Has a nodeJS/mongoDB service, wants to add CRM features Right now considering creating own CRM with partners. Has 3 inhouse developers",
                phones         : {
                    fax   : "",
                    mobile: "",
                    phone : ""
                },
                email          : "",
                address        : {
                    country: "UK",
                    zip    : "",
                    state  : "",
                    city   : "",
                    street : ""
                },
                company        : null
            },
            {
                _id            : "56b0d2d39aa9c4f407d7113d",
                total          : 38,
                contactName    : "Bill ",
                salesPerson    : {
                    name: {
                        last : "Voloshchuk",
                        first: "Peter"
                    }
                },
                workflow       : {
                    _id         : "528cdf1cf3f67bc40b00000b",
                    __v         : 0,
                    attachments : [],
                    color       : "#2C3E50",
                    name        : "Lost",
                    sequence    : 0,
                    status      : "Cancelled",
                    wId         : "Opportunities",
                    wName       : "opportunity",
                    source      : "opportunity",
                    targetSource: [
                        "opportunity"
                    ],
                    visible     : true
                },
                createdBy      : {
                    date: "2016-02-02T16:01:22.999Z"
                },
                editedBy       : {
                    user: "admin",
                    date: "2016-05-18T07:08:27.895Z"
                },
                creationDate   : "2016-02-02T16:01:22.998Z",
                isOpportunitie : true,
                name           : "xamarin",
                expectedRevenue: {
                    value   : 0,
                    progress: 0,
                    currency: null
                },
                attachments    : [],
                notes          : [],
                convertedDate  : "2016-03-08T08:57:48.799Z",
                isConverted    : true,
                source         : "victor",
                campaign       : "",
                sequence       : 0,
                reffered       : "",
                optout         : false,
                active         : true,
                color          : "#4d5a75",
                categories     : {
                    name: "",
                    id  : ""
                },
                priority       : "Trivial",
                expectedClosing: null,
                nextAction     : {
                    date: "2016-02-02T16:01:22.998Z",
                    desc: ""
                },
                internalNotes  : "message:Hello, I would like to know if you are able to work with the xamarin stack for mobile app maintenance and development. Also can you do Microsoft ASP.net backend work? Thanks",
                phones         : {
                    fax   : "",
                    phone : "",
                    mobile: ""
                },
                email          : "bill@cardiacdesigns.com",
                address        : {
                    country: "",
                    zip    : "",
                    state  : "",
                    city   : "",
                    street : ""
                },
                company        : null
            }
        ]
    };
    var fakeOpportunitiesPriority = {
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
    var fakeOpportunityForForm = {
        _id             : "56eaa60166a6a5573cd02d6c",
        __v             : 0,
        attachments     : [],
        notes           : [],
        convertedDate   : "2016-03-17T12:41:37.541Z",
        isConverted     : false,
        source          : "",
        campaign        : "",
        editedBy        : {
            date: "2016-03-24T08:31:08.528Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v            : 0,
                attachments    : [],
                lastAccess     : "2016-03-24T08:19:13.710Z",
                profile        : 1387275598000,
                relatedEmployee: "55b92ad221e4b7c40f00004f",
                savedFilters   : [
                    {
                        _id      : "56213057c558b13c1bbf874d",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "5621307bc558b13c1bbf874f",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213103c558b13c1bbf8750",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213197c558b13c1bbf8751",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56215e86c558b13c1bbf8755",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56229009184ec5a427913306",
                        viewType : "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "562506bb19a2ecca01ca84b3",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56265005d53978de6e9ea440",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "562b83ccb4677e225aa31df6",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "564dd4ce9fb8bc3f2195662c",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56570d714d96962262fd4b55",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56572368bfd103f108eb4a24",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56604795ccc590f32c577ece",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "566047c6ccc590f32c577ed1",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "5661a7bf7d284423697e34a8",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "5665429e9294f4d728bcafaa",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "566eba768453e8b464b70a40",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56c711ab0769bba2647ae710",
                        viewType : "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56daf5322e7b62c613ff2552",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd69d991cb620c19ff60c2",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd6af71e6cb7131892b2ba",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dfe8e56e2877d85455a6bb",
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
        createdBy       : {
            date: "2016-03-17T12:41:37.541Z",
            user: {
                _id            : "56239e58e9576d1728a9ed1f",
                profile        : 1438158771000,
                __v            : 0,
                lastAccess     : "2016-03-15T08:51:02.772Z",
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
                email          : "Olga.Sikora@thinkmobiles.com",
                login          : "olga.sikora",
                imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
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
            _id         : "528cdd2af3f67bc40b000007",
            __v         : 0,
            attachments : [],
            name        : "Probablity 25-50",
            sequence    : 4,
            status      : "In Progress",
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
        active          : true,
        color           : "#4d5a75",
        categories      : {
            name: "",
            id  : ""
        },
        priority        : "P3",
        expectedClosing : "2016-04-01T00:00:00.000Z",
        nextAction      : {
            date: "2016-03-17T12:41:37.540Z",
            desc: ""
        },
        internalNotes   : "Flash to HTML transfer",
        salesTeam       : null,
        salesPerson     : {
            _id           : "56123232c90e2fb026ce064b",
            dateBirth     : "1994-05-03T00:00:00.000Z",
            transferred   : [
                {
                    department: " BusinessDev",
                    date      : "2015-10-19T15:41:51.978Z"
                }
            ],
            __v           : 0,
            lastFire      : null,
            fire          : [
                {
                    date       : "2015-10-04T21:00:00.000Z",
                    info       : "Update",
                    salary     : 151,
                    jobType    : "fullTime",
                    manager    : "55b92ad221e4b7c40f000030",
                    jobPosition: "561b73fb9ebb48212ea838bf",
                    department : "55bb1f40cb76ca630b000007"
                },
                {
                    date       : "2015-11-30T22:00:00.000Z",
                    info       : "Update",
                    salary     : 200,
                    jobType    : "fullTime",
                    manager    : "55b92ad221e4b7c40f000030",
                    jobPosition: "561b73fb9ebb48212ea838bf",
                    department : "55bb1f40cb76ca630b000007"
                },
                {
                    date       : "2016-01-31T22:00:00.000Z",
                    info       : "Update",
                    salary     : 250,
                    jobType    : "fullTime",
                    manager    : "55b92ad221e4b7c40f000030",
                    jobPosition: "561b73fb9ebb48212ea838bf",
                    department : "55bb1f40cb76ca630b000007"
                }
            ],
            hire          : [
                {
                    date       : "2015-10-04T21:00:00.000Z",
                    info       : "4000 грн",
                    salary     : 151,
                    jobType    : "fullTime",
                    manager    : "55b92ad221e4b7c40f000030",
                    jobPosition: "561b73fb9ebb48212ea838bf",
                    department : "55bb1f40cb76ca630b000007"
                },
                {
                    date       : "2015-11-30T22:00:00.000Z",
                    info       : "",
                    salary     : 200,
                    jobType    : "fullTime",
                    manager    : "55b92ad221e4b7c40f000030",
                    jobPosition: "561b73fb9ebb48212ea838bf",
                    department : "55bb1f40cb76ca630b000007"
                },
                {
                    date       : "2016-01-31T22:00:00.000Z",
                    info       : "",
                    salary     : 250,
                    jobType    : "fullTime",
                    manager    : "55b92ad221e4b7c40f000030",
                    jobPosition: "561b73fb9ebb48212ea838bf",
                    department : "55bb1f40cb76ca630b000007"
                },
                {
                    date       : "2016-02-29T22:00:00.000Z",
                    info       : "",
                    salary     : 400,
                    jobType    : "fullTime",
                    manager    : "55b92ad221e4b7c40f000030",
                    jobPosition: "561b73fb9ebb48212ea838bf",
                    department : "55bb1f40cb76ca630b000007"
                }
            ],
            social        : {
                GP: "",
                LI: "",
                FB: ""
            },
            sequence      : 159,
            jobType       : "fullTime",
            gender        : "male",
            marital       : "unmarried",
            contractEnd   : {
                date  : "2015-10-05T08:17:54.762Z",
                reason: ""
            },
            attachments   : [],
            editedBy      : {
                date: "2016-03-17T09:24:32.261Z",
                user: "55ba2ef1d79a3a343900001c"
            },
            createdBy     : {
                date: "2015-10-05T08:17:54.762Z",
                user: "55ba2f3ed79a3a343900001d"
            },
            creationDate  : "2015-10-05T08:17:54.762Z",
            color         : "#4d5a75",
            otherInfo     : "",
            groups        : {
                group: [],
                users: [],
                owner: "560c099da5d4a2e20ba5068b"
            },
            whoCanRW      : "everyOne",
            workflow      : null,
            active        : false,
            referredBy    : "",
            source        : "www.rabota.ua",
            age           : 21,
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
            manager       : "55b92ad221e4b7c40f000030",
            jobPosition   : "561b73fb9ebb48212ea838bf",
            department    : "55bb1f40cb76ca630b000007",
            visibility    : "Public",
            relatedUser   : "56239e58e9576d1728a9ed1f",
            officeLocation: "",
            skype         : "Voliya7",
            workPhones    : {
                phone : "",
                mobile: "+380663367219"
            },
            personalEmail : "Sikora.Olga123@gmail.com",
            workEmail     : "olga.sikora@thinkmobiles.com",
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
                last : "Sikora",
                first: "Olga"
            },
            subject       : "",
            imageSrc      : "data:image/jpeg;base64,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",
            isEmployee    : true,
            fullName      : "Olga Sikora",
            id            : "56123232c90e2fb026ce064b"
        },
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
            country: "Italy",
            zip    : "",
            state  : "",
            city   : "",
            street : ""
        },
        customer        : {
            _id           : "5604170eb904af832d000005",
            __v           : 0,
            companyInfo   : {
                industry: null
            },
            editedBy      : {
                date: "2015-09-24T15:30:22.135Z",
                user: "55cb7302fea413b50b000007"
            },
            createdBy     : {
                date: "2015-09-24T15:30:22.135Z",
                user: "55cb7302fea413b50b000007"
            },
            history       : [],
            attachments   : [],
            notes         : [],
            groups        : {
                group: [],
                users: [],
                owner: "55ba28c8d79a3a3439000016"
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
            website       : "",
            address       : {
                country: "Italy",
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
                first: "Stentle"
            },
            isOwn         : false,
            type          : "Company",
            fullName      : "Stentle ",
            id            : "5604170eb904af832d000005"
        },
        company         : null,
        tempCompanyField: "",
        creationDate    : "2016-03-17T12:41:37.540Z",
        expectedRevenue : {
            currency: "$",
            progress: 0,
            value   : 4500
        },
        name            : "Sandos E-Learning",
        isOpportunitie  : true
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
            }
        ]
    };
    var fakeCustomerWithId = {
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
            }
        ]
    };
    var fakeWorkFlowFirstCol = {
        data: [
            {
                _id             : "56f3de611fd5eed4401c5a29",
                __v             : 0,
                attachments     : [],
                notes           : [],
                convertedDate   : "2016-03-24T12:32:33.242Z",
                isConverted     : false,
                source          : "",
                campaign        : "",
                editedBy        : {
                    date: "2016-03-24T13:20:03.819Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy       : {
                    date: "2016-03-24T12:32:33.241Z",
                    user: null
                },
                sequence        : 2,
                groups          : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW        : "everyOne",
                workflow        : {
                    _id: "528cdcb4f3f67bc40b000006"
                },
                reffered        : "",
                optout          : false,
                active          : false,
                color           : "#4d5a75",
                categories      : {
                    name: "",
                    id  : ""
                },
                priority        : "P3",
                expectedClosing : "",
                nextAction      : {
                    date: "",
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
                    country: "USA",
                    zip    : "",
                    state  : "",
                    city   : "",
                    street : ""
                },
                customer        : {
                    _id     : "55b92ad621e4b7c40f000635",
                    name    : {
                        last : "",
                        first: "Academiacs"
                    },
                    fullName: "Academiacs ",
                    id      : "55b92ad621e4b7c40f000635"
                },
                company         : null,
                tempCompanyField: "",
                creationDate    : "2016-03-24T12:32:33.238Z",
                expectedRevenue : {
                    currency: "$",
                    progress: null,
                    value   : 100000
                },
                name            : "Test",
                isOpportunitie  : true
            }
        ]
    };
    var fakeOpportunitiesKanBan = {
        data      : [
            {
                _id             : "56f90f0ec3a5da3e0347a422",
                __v             : 0,
                attachments     : [],
                notes           : [],
                convertedDate   : "2016-03-28T11:01:34.400Z",
                isConverted     : false,
                source          : "",
                campaign        : "",
                editedBy        : {
                    date: "2016-03-30T15:25:57.562Z",
                    user: "56239e58e9576d1728a9ed1f"
                },
                createdBy       : {
                    date: "2016-03-28T11:01:34.400Z",
                    user: "56239e58e9576d1728a9ed1f"
                },
                sequence        : 4,
                groups          : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW        : "everyOne",
                workflow        : {
                    _id: "528cdef4f3f67bc40b00000a"
                },
                reffered        : "",
                optout          : false,
                active          : true,
                color           : "#4d5a75",
                categories      : {
                    name: "",
                    id  : ""
                },
                priority        : "P3",
                expectedClosing : "2016-03-31T00:00:00.000Z",
                nextAction      : {
                    date: "2016-03-28T11:01:34.400Z",
                    desc: ""
                },
                internalNotes   : "E-Commerce Platform. CSS skinning",
                salesTeam       : null,
                salesPerson     : {
                    _id     : "56123232c90e2fb026ce064b",
                    name    : {
                        last : "Sikora",
                        first: "Olga"
                    },
                    fullName: "Olga Sikora",
                    id      : "56123232c90e2fb026ce064b"
                },
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
                    country: "Italy",
                    zip    : "",
                    state  : "",
                    city   : "",
                    street : ""
                },
                customer        : {
                    _id     : "5604170eb904af832d000005",
                    name    : {
                        last : "",
                        first: "Stentle"
                    },
                    fullName: "Stentle ",
                    id      : "5604170eb904af832d000005"
                },
                company         : null,
                tempCompanyField: "",
                creationDate    : "2016-03-28T11:01:34.400Z",
                expectedRevenue : {
                    currency: "$",
                    progress: 0,
                    value   : 5200
                },
                name            : "PriceBox WEB",
                isOpportunitie  : true
            },
            {
                _id             : "5654dd337fd64406664b9216",
                __v             : 0,
                attachments     : [],
                notes           : [],
                convertedDate   : "2016-03-03T14:05:04.650Z",
                isConverted     : true,
                source          : "",
                campaign        : "",
                editedBy        : {
                    date: "2016-03-03T15:14:11.491Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy       : {
                    date: "2015-11-24T21:57:07.157Z",
                    user: null
                },
                sequence        : 3,
                groups          : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW        : "everyOne",
                workflow        : {
                    _id: "528cdef4f3f67bc40b00000a"
                },
                reffered        : "",
                optout          : false,
                active          : false,
                color           : "#4d5a75",
                categories      : {
                    name: "",
                    id  : ""
                },
                priority        : "Trivial",
                expectedClosing : "",
                nextAction      : {
                    date: "2016-03-30T22:00:00.000Z",
                    desc: ""
                },
                internalNotes   : "message:I´d love to get a 10K discount... Let´s see if we can do business. All ready in dialogues with you... Br. Stian",
                salesTeam       : null,
                salesPerson     : {
                    _id     : "55b92ad221e4b7c40f0000a2",
                    name    : {
                        last : "Stan",
                        first: "Igor"
                    },
                    fullName: "Igor Stan",
                    id      : "55b92ad221e4b7c40f0000a2"
                },
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
                    country: "USA",
                    zip    : "",
                    state  : "",
                    city   : "",
                    street : ""
                },
                customer        : {
                    _id     : "56ab5ca674d57e0d56d6bda4",
                    name    : {
                        last : "Maurstad",
                        first: "Stian"
                    },
                    fullName: "Stian Maurstad",
                    id      : "56ab5ca674d57e0d56d6bda4"
                },
                company         : null,
                tempCompanyField: "",
                creationDate    : "2015-11-24T21:57:07.155Z",
                expectedRevenue : {
                    currency: "$",
                    progress: null,
                    value   : 6000
                },
                name            : "Stian Maurstad (Ihor's client)",
                isOpportunitie  : true
            },
            {
                _id             : "56de98160f318aa605cf4420",
                __v             : 0,
                attachments     : [],
                notes           : [],
                convertedDate   : "2016-03-08T09:15:02.569Z",
                isConverted     : false,
                source          : "",
                campaign        : "",
                editedBy        : {
                    date: "2016-03-26T18:28:06.383Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                createdBy       : {
                    date: "2016-03-08T09:15:02.569Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                sequence        : 1,
                groups          : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW        : "everyOne",
                workflow        : {
                    _id: "528cdef4f3f67bc40b00000a"
                },
                reffered        : "",
                optout          : false,
                active          : true,
                color           : "#4d5a75",
                categories      : {
                    name: "",
                    id  : ""
                },
                priority        : "P3",
                expectedClosing : "2016-03-13T23:00:00.000Z",
                nextAction      : {
                    date: "2016-03-08T09:15:02.569Z",
                    desc: ""
                },
                internalNotes   : "",
                salesTeam       : null,
                salesPerson     : {
                    _id     : "55b92ad221e4b7c40f00005f",
                    name    : {
                        last : "Voloshchuk",
                        first: "Peter"
                    },
                    fullName: "Peter Voloshchuk",
                    id      : "55b92ad221e4b7c40f00005f"
                },
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
                    country: "UAE",
                    zip    : "",
                    state  : "",
                    city   : "",
                    street : ""
                },
                customer        : {
                    _id     : "55b92ad621e4b7c40f00063c",
                    name    : {
                        last : "",
                        first: "DigiPresents"
                    },
                    fullName: "DigiPresents ",
                    id      : "55b92ad621e4b7c40f00063c"
                },
                company         : null,
                tempCompanyField: "",
                creationDate    : "2016-03-08T09:15:02.568Z",
                expectedRevenue : {
                    currency: "$",
                    progress: 0,
                    value   : 13000
                },
                name            : "Poems",
                isOpportunitie  : true
            },
            {
                _id             : "56de98a6297d1db405eadd51",
                __v             : 0,
                attachments     : [],
                notes           : [],
                convertedDate   : "2016-03-08T09:17:26.602Z",
                isConverted     : false,
                source          : "",
                campaign        : "",
                editedBy        : {
                    date: "2016-03-26T18:28:18.225Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                createdBy       : {
                    date: "2016-03-08T09:17:26.602Z",
                    user: "56d704f1805eb08d2b93d95f"
                },
                sequence        : 0,
                groups          : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW        : "everyOne",
                workflow        : {
                    _id: "528cdef4f3f67bc40b00000a"
                },
                reffered        : "",
                optout          : false,
                active          : false,
                color           : "#4d5a75",
                categories      : {
                    name: "",
                    id  : ""
                },
                priority        : "P3",
                expectedClosing : "2016-03-11T00:00:00.000Z",
                nextAction      : {
                    date: "",
                    desc: ""
                },
                internalNotes   : "From Flash to HTML5 Gil Strauss Israel.",
                salesTeam       : null,
                salesPerson     : {
                    _id     : "56029cc950de7f4138000005",
                    name    : {
                        last : "Lendyel",
                        first: "Eugen"
                    },
                    fullName: "Eugen Lendyel",
                    id      : "56029cc950de7f4138000005"
                },
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
                customer        : null,
                company         : null,
                tempCompanyField: "",
                creationDate    : "2016-03-08T09:17:26.601Z",
                expectedRevenue : {
                    currency: "$",
                    progress: null,
                    value   : 4500
                },
                name            : "Online Casino",
                isOpportunitie  : true
            },
            {
                _id             : "56de985cda160ef305231c1f",
                __v             : 0,
                attachments     : [],
                notes           : [],
                convertedDate   : "2016-03-08T09:16:12.689Z",
                isConverted     : false,
                source          : "",
                campaign        : "",
                editedBy        : {
                    date: "2016-03-15T13:09:27.633Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy       : {
                    date: "2016-03-08T09:16:12.689Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                sequence        : -1,
                groups          : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW        : "everyOne",
                workflow        : {
                    _id: "528cdef4f3f67bc40b00000a"
                },
                reffered        : "",
                optout          : false,
                active          : false,
                color           : "#4d5a75",
                categories      : {
                    name: "",
                    id  : ""
                },
                priority        : "P3",
                expectedClosing : "2016-03-31T00:00:00.000Z",
                nextAction      : {
                    date: "",
                    desc: ""
                },
                internalNotes   : "",
                salesTeam       : null,
                salesPerson     : {
                    _id     : "55b92ad221e4b7c40f00005f",
                    name    : {
                        last : "Voloshchuk",
                        first: "Peter"
                    },
                    fullName: "Peter Voloshchuk",
                    id      : "55b92ad221e4b7c40f00005f"
                },
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
                    country: "UAE",
                    zip    : "",
                    state  : "",
                    city   : "",
                    street : ""
                },
                customer        : {
                    _id     : "55b92ad621e4b7c40f00063c",
                    name    : {
                        last : "",
                        first: "DigiPresents"
                    },
                    fullName: "DigiPresents ",
                    id      : "55b92ad621e4b7c40f00063c"
                },
                company         : null,
                tempCompanyField: "",
                creationDate    : "2016-03-08T09:16:12.688Z",
                expectedRevenue : {
                    currency: "$",
                    progress: null,
                    value   : 25000
                },
                name            : "Emirates Wallet",
                isOpportunitie  : true
            },
            {
                _id             : "56de9893fc5a36e7053672e8",
                __v             : 0,
                attachments     : [],
                notes           : [],
                convertedDate   : "2016-03-08T09:17:07.199Z",
                isConverted     : false,
                source          : "",
                campaign        : "",
                editedBy        : {
                    date: "2016-03-15T13:08:57.501Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                createdBy       : {
                    date: "2016-03-08T09:17:07.199Z",
                    user: "56d70560805eb08d2b93d960"
                },
                sequence        : -2,
                groups          : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW        : "everyOne",
                workflow        : {
                    _id: "528cdef4f3f67bc40b00000a"
                },
                reffered        : "",
                optout          : false,
                active          : true,
                color           : "#4d5a75",
                categories      : {
                    name: "",
                    id  : ""
                },
                priority        : "P3",
                expectedClosing : null,
                nextAction      : {
                    date: "2016-03-08T09:17:07.198Z",
                    desc: ""
                },
                internalNotes   : "Menachem Talman, Israel",
                salesTeam       : null,
                salesPerson     : {
                    _id     : "5602a01550de7f4138000008",
                    name    : {
                        last : "Dufynets",
                        first: "Yana"
                    },
                    fullName: "Yana Dufynets",
                    id      : "5602a01550de7f4138000008"
                },
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
                customer        : null,
                company         : null,
                tempCompanyField: "",
                creationDate    : "2016-03-08T09:17:07.198Z",
                expectedRevenue : {
                    currency: "$",
                    progress: 0,
                    value   : 3800
                },
                name            : "Web App Smart360",
                isOpportunitie  : true
            }
        ],
        workflowId: "528cdef4f3f67bc40b00000a"
    };
    var fakeOpportunityById = {
        _id             : "56f90f0ec3a5da3e0347a422",
        __v             : 0,
        attachments     : [],
        notes           : [],
        convertedDate   : "2016-03-28T11:01:34.400Z",
        isConverted     : false,
        source          : "",
        campaign        : "",
        editedBy        : {
            date: "2016-05-10T07:54:22.210Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v            : 0,
                attachments    : [],
                lastAccess     : "2016-05-10T06:32:59.347Z",
                profile        : 1387275598000,
                relatedEmployee: "55b92ad221e4b7c40f00004f",
                savedFilters   : [
                    {
                        _id      : "56213057c558b13c1bbf874d",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "5621307bc558b13c1bbf874f",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213103c558b13c1bbf8750",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213197c558b13c1bbf8751",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56215e86c558b13c1bbf8755",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56229009184ec5a427913306",
                        viewType : "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "562506bb19a2ecca01ca84b3",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56265005d53978de6e9ea440",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "562b83ccb4677e225aa31df6",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "564dd4ce9fb8bc3f2195662c",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56570d714d96962262fd4b55",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56572368bfd103f108eb4a24",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56604795ccc590f32c577ece",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "566047c6ccc590f32c577ed1",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "5661a7bf7d284423697e34a8",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "5665429e9294f4d728bcafaa",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "566eba768453e8b464b70a40",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56c711ab0769bba2647ae710",
                        viewType : "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56daf5322e7b62c613ff2552",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd69d991cb620c19ff60c2",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd6af71e6cb7131892b2ba",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dfe8e56e2877d85455a6bb",
                        viewType : "",
                        byDefault: "Leads"
                    },
                    {
                        _id      : "56f3d039c1785edc507e81ea",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "5717252b526673490fa188a8",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "5717256e526673490fa188a9",
                        viewType : "",
                        byDefault: ""
                    },
                    {
                        _id      : "57172598526673490fa188ac",
                        viewType : "",
                        byDefault: ""
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
                        countPerPage : 14
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
        createdBy       : {
            date: "2016-03-28T11:01:34.400Z",
            user: {
                _id            : "56239e58e9576d1728a9ed1f",
                profile        : 1438158771000,
                __v            : 0,
                lastAccess     : "2016-03-24T16:50:37.626Z",
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
                email          : "Olga.Sikora@thinkmobiles.com",
                login          : "olga.sikora",
                imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        sequence        : 4,
        groups          : {
            group: [
                {
                    _id              : "56e6775c5ec71b00429745a4",
                    __v              : 0,
                    sequence         : 1,
                    nestingLevel     : 0,
                    editedBy         : {
                        date: "2016-03-14T08:36:13.179Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy        : {
                        date: "2016-03-14T08:33:32.754Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users            : [],
                    departmentManager: null,
                    parentDepartment : null,
                    departmentName   : "Admin"
                },
                {
                    _id              : "55b92ace21e4b7c40f000014",
                    ID               : 6,
                    __v              : 0,
                    sequence         : 1,
                    nestingLevel     : 1,
                    editedBy         : {
                        date: "2016-03-14T08:34:00.655Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy        : {
                        date: "2015-07-29T19:34:38.909Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users            : [],
                    departmentManager: null,
                    parentDepartment : "56e6775c5ec71b00429745a4",
                    departmentName   : "BusinessDev"
                }
            ],
            users: [
                {
                    _id            : "55ba2ef1d79a3a343900001c",
                    profile        : 1438158808000,
                    __v            : 0,
                    lastAccess     : "2016-04-05T07:14:01.967Z",
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
                },
                {
                    _id            : "55ba28c8d79a3a3439000016",
                    profile        : 1438158808000,
                    __v            : 0,
                    lastAccess     : "2016-04-08T07:08:42.517Z",
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
                    pass           : "e28ac09936a6b64abafe5870482de8ddd0b63cff921323ec91924d443afc907f",
                    email          : "andriana.lemko@thinkmobiles.com",
                    login          : "AndrianaLemko",
                    imageSrc       : "data:image/jpeg;base64,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"
                }
            ],
            owner: {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            }
        },
        whoCanRW        : "everyOne",
        workflow        : {
            _id         : "528cdef4f3f67bc40b00000a",
            __v         : 0,
            attachments : [],
            name        : "Won",
            sequence    : 1,
            status      : "Done",
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
        priority        : "P3",
        expectedClosing : "2016-05-10T21:00:00.000Z",
        nextAction      : {
            date: "2016-05-09T21:00:00.000Z",
            desc: ""
        },
        internalNotes   : "E-Commerce Platform. CSS skinning",
        salesTeam       : null,
        salesPerson     : {
            _id           : "56123232c90e2fb026ce064b",
            dateBirth     : "1994-05-03T00:00:00.000Z",
            transferred   : [
                {
                    department: " BusinessDev",
                    date      : "2015-10-19T15:41:51.978Z"
                }
            ],
            __v           : 0,
            transfer      : [
                {
                    status     : "hired",
                    department : "55bb1f40cb76ca630b000007",
                    jobPosition: "561b73fb9ebb48212ea838bf",
                    manager    : "55b92ad221e4b7c40f000030",
                    jobType    : "fullTime",
                    salary     : 151,
                    info       : "4000 грн",
                    isDeveloper: true,
                    date       : "2015-10-04T21:00:00.000Z"
                },
                {
                    status     : "updated",
                    department : "55bb1f40cb76ca630b000007",
                    jobPosition: "561b73fb9ebb48212ea838bf",
                    manager    : "55b92ad221e4b7c40f000030",
                    jobType    : "fullTime",
                    salary     : 200,
                    info       : "",
                    isDeveloper: true,
                    date       : "2015-11-30T22:00:00.000Z"
                },
                {
                    status     : "updated",
                    department : "55bb1f40cb76ca630b000007",
                    jobPosition: "561b73fb9ebb48212ea838bf",
                    manager    : "55b92ad221e4b7c40f000030",
                    jobType    : "fullTime",
                    salary     : 250,
                    info       : "",
                    isDeveloper: true,
                    date       : "2016-01-31T22:00:00.000Z"
                },
                {
                    status     : "updated",
                    department : "55bb1f40cb76ca630b000007",
                    jobPosition: "561b73fb9ebb48212ea838bf",
                    manager    : "55b92ad221e4b7c40f000030",
                    jobType    : "fullTime",
                    salary     : 400,
                    info       : "",
                    isDeveloper: true,
                    date       : "2016-02-29T22:00:00.000Z"
                }
            ],
            lastFire      : null,
            fire          : [],
            hire          : [
                {
                    info       : "",
                    salary     : 0,
                    jobType    : "",
                    manager    : null,
                    jobPosition: null,
                    department : null
                }
            ],
            social        : {
                GP: "",
                LI: "",
                FB: ""
            },
            sequence      : 159,
            jobType       : "fullTime",
            gender        : "male",
            marital       : "unmarried",
            contractEnd   : {
                date  : "2015-10-05T08:17:54.762Z",
                reason: ""
            },
            attachments   : [],
            editedBy      : {
                date: "2016-03-17T09:24:32.261Z",
                user: "55ba2ef1d79a3a343900001c"
            },
            createdBy     : {
                date: "2015-10-05T08:17:54.762Z",
                user: "55ba2f3ed79a3a343900001d"
            },
            creationDate  : "2015-10-05T08:17:54.762Z",
            color         : "#4d5a75",
            otherInfo     : "",
            groups        : {
                group: [],
                users: [],
                owner: "560c099da5d4a2e20ba5068b"
            },
            whoCanRW      : "everyOne",
            workflow      : null,
            active        : false,
            referredBy    : "",
            source        : "www.rabota.ua",
            age           : 22,
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
            manager       : "55b92ad221e4b7c40f000030",
            jobPosition   : "561b73fb9ebb48212ea838bf",
            department    : "55bb1f40cb76ca630b000007",
            visibility    : "Public",
            relatedUser   : "56239e58e9576d1728a9ed1f",
            officeLocation: "",
            skype         : "Voliya7",
            workPhones    : {
                phone : "",
                mobile: "+380663367219"
            },
            personalEmail : "Sikora.Olga123@gmail.com",
            workEmail     : "olga.sikora@thinkmobiles.com",
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
                last : "Sikora",
                first: "Olga"
            },
            subject       : "",
            imageSrc      : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACMAIwDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3++BXJCjrn6Vx7m72sUSccAgjryev5/Si1g0LcGSCQuMe1AzStzznaKOmok2cH8Y/j38OfgTpdtqXj2+uBJqAlFjZWtu0s12Y9pdV6IMb05dlHI5pxjzbA5W1Z8CfGL9u/wCLPxMtbrQtChs/CWh3WUeGyJlu5YiBlJbhuoyD/q0jyGKtuGa3VCP2iOZrQ+bXdWYuEOSc5Nb3XRCt1L+g+Itc8M6nba34c1S80rUbRvMgurOd4Zo2xjKupBHBx+JFJpS3QXa0PRP+GpP2gXCpcfFPXJlXGBNKJBx7MCOwrP2NPe35jUpNnoPhr9vf42aGzC+XR9T3R7P3lmIskEfO3l7cnHHbtnOKl4dLZgpdWe5fDL/go+mqava2XxB8NW1jpzQok1xaXRMsc2TukCuADGcj5N+9QCcvwKylSlHzHzRex9AeGv2oPgZ4ov8A7PoXivSfNZQd+oXC28sidWx5h3ZGc7Wxnt0rN3WjRbeh7XpN9DeRq8RyrjcCCCMcYIIJBH0OOtUtSVZGvCjAnJ4/KhWK21LiDgsQOTmhK4tLXJEX5uMdcD1p9BN3LUaE4G0Y680mhrzJQh/ujHakw5rbM8XugGBDZP1/rQBn7AGIK9OlFwtoWbduRg5I6/lQC7Eup65pPhzSbvXdb1CCy0+wiae5uJpAiQxqMlmY9ABRfQHpqj8nP2kPipefHP4w614nsZZZ9GtX/s/SQQwVbOIkKwBAI3ndIQeQZCOwreDVKNpCUHN6I87g0RGJ82RA391QWIPv6Cs54hr4UdEMMn8TNUeHrGKMG5uVjJGcE/j0zWX1mo2bfV4DDoNjIgMMjsQCScgAfTd1/Cn9ZqIn6vTsVJPDEsn/AB7SpIcHgkDPHY9K1jil9pGUsK/smXNY3EbtGY2BTqMf4Vuq0XsZOjKOhGElXIYbW/nVc19UZqFtHuTwXstvIjRuQ0eD14FJxU1dgm4n1v8Asr/tna94C1fT/C3jvVGuvC8swjeaRA0lip7rtXcyghRgnhcgdBjmqQ5GWkpK6P1D0zULLUrC31LTJ47m1njEkU0Th0dSMhgQSCD6jip3C99UaCE8qKa7i1J4xkdcntT62J6XRaj4OMHBx0qbNF3s9SYbRwQCfpTSl0C6R4pecNjJ64qQPG/j3+0H4Q+A+iw3OrQSX+q6gG/s7TYWCNNtxuZ3wRHGCQCxBJJ4BwcVGDm7ILpHwD49/as+OXjzUzeS+OtQ0S3TIistEnksoUU4yDsbfJyM5kZiCTjA4rqVKC0epndtnMf8LB+Kni2wm03xP8R/FGpaUxVp7W+1i4mgcKwYbo3cqcMARx1GeK5qs401aK1OmhT53eRThsnu4l27ba0+6o7sR/M9P/rVzN233OpQTWmxaitba2UQh1CNwT79sn6enSpb5i4xSVxIZbaCYJbuAwI4+UfjnJ/WlZyV2C93RBKlzKSI5vNwcIgZG/QCmuVatA031M26uryIhLiJWzyMJj6jIxjFaRinqjKU5RZTlfemBIWfJDDvjsffitIpmbaZNbt56s91H5kabRuP3i3oD1HGfyoknHbccWpaSWhqaj4Ea5uHk8Ms9zbiJZfnGACQPl3YxnkdfzpU8Zyq1ZalywPtLui/kc08d/pVw0UsclvOuQyOMZH+FdicKi01RwOMqcrNan6Cf8E4f2jpb+S6+B/ivUpnnK/atBLsWICqfNtwSTwFAdVA4Cyc9KwlT5RuSfvI/QeJf4gTSdugrFuIgnGO/rQG5PEpzjPtR1uJO7J9oNCTYNtM8L8R6lpmiWF3rGrXMVpY2MD3NzPKcJFEilndj2AUEn6VCNGz8hfj18Wr341/E3U/G0gkisWYWul28o+aCzjJ8tSMnDHLOwyQGdscYrqpw5VYyu3qcPp1nJf3K28eMN94noo7k06k1CN2VShzux2Ok6Kt7EfnEVnb56j/AFjA/eI9O3pn6GvLqVHHfc9SnFWtEbfO08vl20ICD5U2g4IHYe3qamK6leQW/h+8kkxMwXI6H/8AXTc0i1SkwutAvUYxpC+SMfKMj8KtVE9iPYPqLa+CtSuo/OmPlknao5LYxyxA/hxzn3rT2kTJ4ab2Kuo6TfW7PGZvNRBvDMCDjgf1pRa3Q5QknYqDTn8kSYw4YADkMfb6cVpzaGXs0Vbm1mhRBPxHy6gnhvU0XE0keo/Db4ip4TS0i1AfadOaTe0Tjcv3hvRg2QVIAOccMoPVVK8k6fPotzZScfeXU9h+I/7O+jeNNFTXvAsqQmZGuI9OushsccwuTvK8d9wJPUVnSrOjK2w5yVVe+fOWraZqPwp8W6Pr+jXFzbTQeTeK4ysltcI3zoCDnKuhwc9vUV6lOp7aLT3OCUFB36H7Afs4fGex+MPw9sNeN8Jr4KFuMKFZnxzlV4DA5B4GcbgApFZxffciSs7HssKbsD07ECmgtcsonuKdw0JRGpGSQKNRNXPzt/4KPa94i074UaTo2lRMul6vq6x6pOswHEaF4oWTqyu4L5HAMCg/eFFNJyK1PzhjRz8qKSzngAZP5CurZXZmot6I7LRfDklvZQ27v5c18+ZHAzsjHX+f4niuCtW5nbsehQp8quzu7nTnt7Cz0i1jWGWVwSMfdOMgdecDt1JPevNvzSbZ3QjdJGjo3hKzgZbi5gWSRRhQx+VRjjA6f5Jpynf3UdVOjZXZ2VlpluxAa1RwMBsKM9fUd/8A69ZSbezOiKi0WpfDWn7ZGMBQHHAXK49eme4/PmlzySVi1STKGo+Hkgk82CNCFBUHHQHAPfj/AOv+NNVL6EuCRw3irw7K0nmFCXCDy328EZ4zj2wK6IVNTmqUlay3OQurK5twZnbCrlCGYEdufpmtlUZxyhrzPc5+/aRsJJnKrgA87fb6d66Iu7OWcbLQkaOSKyXDK8bMTtGc9Bz+Ix78Cper1FH3dj6G+AHjOH4laG3wa8U3jfaLQG70S63ss0brjARwDgjJX/dc9RuB58RB037SPzFBpuz2Ok+I3w10XVr2X7d4ZumtpbQJd3890RcW91Ef3pRmLeYpDh9sh5CsAflQC6c3utDO7Wj1O/8A2G9Tu/COr6p4LXVDPYpcKYZoz8rxZcr1OMg+Y2ByCjdwa6FLmdzKolZNH6E6RO1xEr8fdBYDsfb2/wDrVepktzWQMTnAHvQlcbJQVAGeaGJ+Z8YftafBjUPjP8OG0fQZwur6ZOL+0ieTbHcMFIMRyQoJB4Y9COwJqNU+ZGsGtmfnToPwk8Q2hvtS8QaHe6baae5hke8haMvMHC+UgIBJB646Dr2orVZNam8Ixj8J0egafDe66C23yrcZ29yoPT8Tx9MVwzlaN2dUI80lE6S2003GtyzSAM0aY6YVcgEnp/uj8K5b2R6FJc0jrLPT4QrxKqgE884PHX+Q5obdzt0Ssi9a6cnG9mw2Rnb0x+Hf/Gs5S1CMWncu2lg1xJLsdecALnBIzycH+fT8qfa47W2L9xo1usbKi8qvJJPGRjb04PPb9elLroG5zuq6TFNC6yowAO4AMcg+x9xj/I5pXIsnueeeJfC/kQSTJGk0TKTgHafc/j610U5anJWjZaHmmrgW1yrvASIyCAepGc/jXVG/Q86asYGoXkco8u3GxQc4zxn+YreMbs55voM0bXdS8OavZ6/o90be9sJVmhkU4IYH+XYj0q3C65WZ8yZ9pHxp4d+LXgqw8dXF1crbwvEdf023JAV8bZCygjIaIvtbPt1DLXn8jpS5X0NWubVbs1/gBYQ6H8WZILi0nsLK+064s7KB4yrStEvnJO68BCIRu56jzO5GOyk+bc5anSx+hHgaVrrRxdsuN0jDGRxgn+XQewFbGSOpRQTyowKS8imPwO+Pzo+YK3U8SvymMZ+boBnk1K00KZ8Rfth+O1utfs/Cit5Ys2MsiEHJBHDe45/zgGuad5Nm9Kx4V4LjMs+9SWaVjITz0GcAj16muas3sz0aWjudtpG2W7mnO/5sICTjgADP8hzXNLRWPQpHRwurooIIJ+UkHB9fw9PyqW3Y6bK5f05fOmMOzaM/Tacg+nXHr61N+oJ30R1mkyeUqKFRRMAh+fGAGyB06cA/gOnWmxNLcNSjtooWJR3MicOq/e/Tp/n2Lemgb6nJ6komQMsiq2C3BJ3DIxyPbPpkU0FmcnrapKrqAW4xlTwR/wDrx+Rq4GNWKZ434vUAyQqAVyTtIG5T/TPp0/SvQpo8ir1aPPrgHlSOSeldSORtldskkMeR+v41S20M3q9T0z4L+Or3wjqzqkxNrOF8+Ak4eMnn2BB6H+8R15Fc1em2uZHVQftPce/Q9p8P63N4E+I2la39skl066a3n0S6SZisNq3DwgFuUKF0CZGAEHQnEUp+9yszrU/3fOvmfqn4Lt4rPS/skMpeONgFycgfIvyj6cj8Peu16nCtjqY0DEACpVinYmCnHGKN9iV5M+e/FN4NNs7q+cqFgjaQsSFwQM4z27VEnZNl2uflX8RPFsvi7xrqerzNvFzdPs5/gH+P9a53ojshBbGv4InFvbTXbthnUoPfPBx+n6Vy1FdqJ3Q0On8LeI9Jv5mtba5UyJKwKseeP4ves6tNwV2jtoVYzVkdak0aQOzgZVWOfTH+etYWbeh1XVmibR7zCnG/k4xyOT/SnKIbq52OkvaSSBnYBsBSxznHcE8npz+FZjvZkmv2rRSBbZSyMowxXG36jjqR+n1q7qwKz1ZxWqxPCHLyZYHBHqAPQfh+VaJt7knNzyFgwyNwAxjj8hVWMp7WPLvG+nyRTMzFwHOenH/1z1rupTujzcRCzPNNQhkWVnxkDuRxiuuNmrHnzTvcoFM4Hl4HH51V7GdmaVjfjQ9btLye2S5ihIWaF/uyoRhlz1U4J5HIOCORThapFx7hKTjZrofSnwhsdN8b+CpvBerXMcjWrvPpFzyzIsgI4HUDepBHuw7CuConCdjr9omudddz9PvgJeG5+E3hMTTi4uI9ItIriUOHJlSJY3BIAGQykH0IxXcndXR5zik7HpsRGRg01FbiemxYUAr0H40J26Cuj40/ap8Vv4T+Euu6jDIkU7w/Z4STgkuwU4Hfgn9a557WNYXckfl/C7yXRlVhvUNJ+A4/rWcmrHbFN6nY+Hro2emSzuwKwxGTnnBHb6Yxn6VhJczsbKVoto5VrrVPC0+n6vdNAJ7xPPCwsQVTPBbJwScHgV2uEZLlbOenVlGV0j2PwR4tj8UaeVifa6rk9j/9evLrU3Tep7VGqqqujc1A3OnW4eLO5CHUE4DY6Z/P8DWcfeeptNuMdDnE8f8Ai+2uQljJa28ODtklbYV9O5OfwrpjRp9Wckq9Vv3bHW2Xj3xlqkSW8jacwRckiTjPPBB569cdj6cHOUKcepUKlRqxVvtd1WQqt5ospU4DSxSK2Tz1GenvnH5VHJHozZTmt0VWlSZnxuyMhl249/8AOP1ot1HdNWZzniaya/06UcCTBKEZz61tB8sjCtC8b9jxfWrd45DgHAAOR2yK9GDTR481Z6mPBE0s6Rf3mC+/WqbVrmUU2y1qal5JJCu4k56d8UqbaKmt0dB8LfiHqXw98Q2+pwxtcWhdftVtu5Ze5XnAbA/Hp6EdVWjGvHzOWE3DQ/ZL9lnXNH8S/CLQNc0OUSWd5HcSqR0LG5fcSD0bduBHHINc9nBJMlS5ndHtsHLeg4x61fQbsW0Hy5Oep9qV/Ik/ND/goNr5ttC0DQUnYm8uZZ2AxgKgAx+b/wCcVyz1kkddFatnw1YygPM7H5mUKMjpyDn9Kmd0kdUOrOu0u2mudEubeJwrvBhBj7xJC4/X9K500ppm6jdWRZsfBf2+CCDVYbq4it+FV5QVTIB4PXHXj61q8Q+hqsJG15HbfD7R7a08Stb6azNbxIkJ4B2nn5ePTOSTzk1hiJ88Vc3wtGMG+U7Txqv9qaj9msYzDBCu1W9hxn8sVz01bc6qkWldHjGuaJbyeJlXxQl1NpkBwsUJOw9PmOG3Y+g7CvRo1FGOi1PJxNGVTqcbqEWo2viC5fwzPcwWn2k/ZnjlYp5YzgMpGWOApznjnPXjp0kveRyxvBWje53vhXxL4ruxJY6vC8oibMV0qkLKPUqRkeo479BXFVp01rFnfQqVZq0+h31jbTtbiWeMh8cbvX1/z7VySlZ6HfFPcgv4gAwIUIwZdx7e4prXQJRvueI+M7NrXU5UUttAA4GAR2/TIr0aMtDxcRC0jn4bfbKGTIOcjPXitHJWM4Qu9TqNC8J3GvW090UCwWigyHPXnn/PqfasVNRaR2Rw/PFyZzmvWkFr4mv7W2j2Qw3DiNR2QMcDP0/lXrYeV4I8bEx5Kkl2P1t/4JyzXV/+zZo5mVVitr/UIIMD5tn2hn6n/adqzxD5ZadjCnfU+rYUCkDbjtgmsE9Sr9iyqMR1/WqWw7eZ+Rv7f2tG8+IunaSCdthYBm5ztLyMTkdjhR19vauOXxHZRWh8s6Yu6bbtyW4BI9+tKastDoptnoHhWM3kq2iYLuwAPoByP55rkk7O7O+jHmaR3t9py2mmXFxI7Dykyy5wDgcfrxWSd2kjtnT5E2XfBFtHpOnrLcqy3FySz5GBluxI6f54pVHzPQKUFCJuRqbm8cAtlj8pz1J4GfUZGazeh0XU0Vdd8Lwz7muEy6ceYnUcDpVxqNaGLpqWxiw+GtOLbZAFCkHIz757e/6n61p7d7XM/YRbuzoNO8MWkarJaAnBORsxnp/k1jKbZpCny9NSzqXl29sD5eNvG3cBjI/z+lKNzW7scVrV1Gm+MjK9cAc4GPzNdEFcwlJNHm+u2Y1K6eLJ8wAdck4z3J6//XrrpvlR51eN5WRdTwCIrzTLC41ETfamYpHFbkSuOMgkE8c/56Vm6t7msKFtzvmtLWwtL+KO2S3VYIraSNclYUQgszsQAGOMYHr35qVdtXOpyjGNuh5tb+DtX+JXiu18PeAbCXxPq2tOyWlpAxaS05DOzc7UUEk7m+Xbk+49SiqkPd2sfMV6kZybfU/YL9l34Pv8C/g7ovgG7vVu723D3F7Mg+VriU73VP8AZXO0eu3PenNubMEj2GMjPHzdPwpbhaxYXJUHP14pW8hpNn4sftfaouufGXxHNBK7rBPHaKr5P+riRWA/4ECfxriTUmzvguWKPDrJWVi2SMcZHrTkax0R6F8PJhHqEsrkIACVUjqP8g1yVNVoenhd3c7XVp2uLvTba4m220szFiQANyjKqT6dT9QKzjZJs6anvSS6HQ31pbW1jA8Gq2zyuWIiQkyIABgkkYweehJ4Oe1Srrc0lJLQzbTVrzTbiKRiwjdth+XIAP8AnNUo8xF7K5qW+oyT3ZglbefmUkt93Gc/XnHHuKz5TZNN6HQW2hwypuG08bVKkZx6Yz1yO/WpvbRlXsXJ3SzRm2KmOcAYyO3Wpu2JptHG69qYljfbIcrkBtuBj+uc1rFEPY871TUHuJCoYckn8Pp2rsgktjknN7FeK1FvJ9rd8YABIPBUH/Gq3OXeWp6dFZafolil/c3MbXL2jPFKU2mNVwCFbPT5h1rlV5Oy2O92gr3OMs59L8TtJDql+LfSrPbcpAjKRKASXa4GOO3yHH58DvhHkXN1PCr4mVb3I6R/PzPbP+CXdx4f0Dxt4rttRupl1bWLKNLGPd+78tHZnU88sflIOOiOOD165V1U904HSdN3Z+mFlGVQkgnPehLTcjc0owPX0/z+lPXoJaFpEjIy3Wiz6MpNH4V/Ee8uvE3jG/1S65m1C5nuZG3d2dnPYdBmvNgz1VHlZxRsTbxg+UwJYhuxB7iqbCKNPw7JPaX67QRkFTxjsCP5VDtJWOui+WWh2muXsk7W9k7FI5UEkMinBDj09/wrGMbe8dNS89DV0bTNVku7eLU2MvmRts3kqc474Iwcd6qUo20JjTd1zO53Oj+DbcyxTavf3Fz5I3xLuAjVu2SSS3I7nHNYyqJKyR0KLfUoeLrVLHU11CEZRwN68Yz/AJ/WphqrFy9zW5paP4gieLCSNlRhWJAOO/8AM+lTKLW5ampFTXfEDeWQZH+fBGPT3P1pxi2wdla5wuq6m1yxVSwHqDxnt/k+ldMYoxn7yuYUarJLl13Io5JHPfnrW0XpdHJJuJd0/bcSPcTBhDbjOSv8Xb8uv5U2YJ8z12RyPjHXtcfSLo29xdf2db3UMBhM2ItzpKQCueRiM4A4Az0zz0UacU79Thr1Zv3U9DltPutQvYDbSXJEZYExrhFP19fx9qKsktETTjdXZ6r8IfEWpeAfHvh/xVpZZJFuQCB16hWBPcEdvc1y89pX7G0488Ndz9ovDeqW2taTbalZvuhnRJEJ/ulQR+hr0E76nmLsb0Qyc44/lVLYjrqWY8Bep596WvQd7H4aXsAW7mv3Y7/mVMjhVIGfy4/WvITtZHtJdzBt9Pa5uZSoXJlCLx94jOCf8ParlO8bDimhdZsG0a2/tAMVWK4QbQMk8EnrTpe9oEpcrTF8XTnXdGjjtow7xYlUryR64/CnSXJJ3O6nU55rWxR0Px34w0ryJLfV1uI7Vdix3aBjtP8ACW64/H+laTpU5+Vz1Pq84rVJnodl8bdWtIFXWPDOc8+bbTbVz14V/Yj+LvXP9UTejF7Fy2TJf+Et8Q+J8vpvhq7NsxBMlzIie+VGTk/SpdOMN2c9SnOO5YsoHin/AHWVfqvOSOeo9uKlu5lCMivqcs8kgXduzywznvTiktSm3sZUtuVy7BtzDP3uvP69fzNap6bkPzMW+njjJiVip77R7Gtoq60OCrU1Zb1e7h0XQf37lSq+bM3oSOnfnoKIpyloRUtCnZvU8huPFF1qH2yxG57ed98cRd8RnK5KqGC5IRQSQeg9AR2OPIk2eRKd2zQ8PyRQCQndu3AFGAzjHOfyFYVUpWOuhLQ9JsLmK2t4HdmVlfKDH8WcAj8jXFbU676I/Wj9mDWpNf8Ag74d1OW4MkjwPG/TgLKyqPwUKPwr0aLvBNnk1IqE3Y9liDdOQD3zW2lzJu+xaQDHKg/U4pc1hqR+H2oyRyFbdFCqR+Z+XH9K8VaanuW6EXhKCG4u0EzA+fM7KB1UDB/xp1LrUUdWO1Rotc8R6fosyAwXeoIHQDll7gfgcD61th9yK7tGyOe0C0htvE+taBFdGWDTr6W2gccbo1cgN174rSsrJNBg5e0upHVt4DttQ23BtIpW6ll+Ukj1xjP41zut0Z7EHUpK8WbGj+FdP08bzpCB05DON7Ke+M9KmVVvRM0lVqzXvM3IbtI0KsR8mQDjpxWWt7iUrIz7h1EjTxqNxBXPXA9vxp7kGLO21fNmQqwySuM4/KtY2bsJy7mJqupRom8gKWQgdj/nitox6I5K1ZJFTRdNub2dNRvUZI1/1KNwXPqfQVrOSXuo5YQlL3pHKfFi+KiHSYmOX/eyYPXHAH5k/lW2HVtWc2Lbfu9Tg7GyaHE8gwXGBg9KdWpze6uh5j8zRjuRbyl8HDLjH48fzP61lCF1Y0hNxt2O7hmkiOnW6As0J3yHJ5IGcY9OmKyaTuz0U3sfqx+xEXb4I6SJDIPLlnTDDkncDn9a6qH8Nf11OCtZ1GfR8Zz1B+lboxSsW1UkfLz+FJ7gz8OLp4lukUoFXLd+27p0/wA/lXjWe57y0dkZum3LWeoWs33VRZjnHAyFz/M/lVSd4tCjo1cn8G7dW+JmkrcvtRbnezJ1XnJPvj+lbUNEYYid0crqOstoPxR15rsIqTX8xcr91SZCQfpzXRUjz09NzPC1vZ1NdmezeHdbsp44ijALhcncOnH9K8ycXHc9+nOMkb91rGnMioGBCD1wAOuB37f561Ci92aPscnqWr2ySudwO1jznv2/pWsY3MZSUWc7f+JII4yzTqgxkjIB9DWsad0YTrRiZ0Wo6jrsv2fRLN5M8+YRtTHrk/0rVRVNXkzF1JVXyxOgsvC1np+JtVlFxdLggycInf5V7n3P5CsXVctIlezjDWb1I9V1ixtbeQwybyoKuUBbBIzyR09ga1hCTepjOvCKaT+48a8eCY65C90BhoQyBZAxC7m646HIP6V2wTjFpHn1JKcrmfvESlDGzIB8jAZ49K57c2pxtKWwQwu7bpAAW5I68fh19aUpcuiFKVtEd3oUD397AkIDMVU7t3Tp/Kpex6VNtwTP2C/Zn8JTeDfg54b0yeIpOytcyqeCDI2MH6ZH5V3RjyxUTz5S55OR7NDjOMn0pk30uWgrn7rAD3pXS3CzZ+DOpa4kF1azO24KTu4wc8g9ffBrzox3PYctL9irLqEJhVo3LeW5XOOOQO/foeaTi2tATuye0u7zwyLPxRAqeesmU3ElQ3XJx2yMdaunfn5SayXLc47XL+41zxFLreqYMl7KZJGUYRj/ABAfpXS1aOhw2967L1g/iDRbNLjTtRbarFTBKM456D9Kl8s37yOynKpTScWdDY+JfF13GFaKzGQOdz8fkuKxlTprY6/bVWtR66bruoFXv9X2qe0URBH4t/hT5oQ0SJ5Z1HeTL9h4cDea9npl1dJCN8tz5XnMCM8/NwvT2/Th3f2nYzlKnHbVnTG+OiWcbRgRQy4YhIGaRvdnPTnHX396v6rDeTuZfXZ7U1YrapJBDHDPq8JS5kBLCRtwRXGVyG6k46qccHmrpSgm1A5qjnJc02cy8kssInspZLh/PbzlXCEBejYJ5HIwB/WuiajezM4OXR6nFeLbSW2nt57v99uVolYdcg5AP/fX61FS7emhHLK10ZEF0GIhdgJQPmX/AArnnC3vdDF90WigyCCeOnbr6/pWLYNH2J+xx+zrqvxB1ix8Rarp8sPh2zKzz3EgAFwy4IiUMDvBIw3YDI6jFdNGGvNM6Z1bQUIn6f6bapDaW1vDFsSNVAUdgBwK3u3uYdLGugwMAHrVICypXuD+dFr6sVj+evWpXaRwTwsgxz0zXFFI9OUmoJ/11F02WSSKRWc4KBse/P8AgKU4qw4TbdmFxql3PpH2ORgY1kyBz6mqUUppj3pss6bK0TpCqoyh0PzKD1UN/MVs4rc597o6IQRLYsu3dsLAbuf4sVzt+8dyiuX+vMLRVSRECjaQeMcDlh/Soepolpf0N6zcSRQq0aYnKoRj7vJ5Hv8AXNdSpxVjkdSU3JNnR+CYmls5rV55TC6yeYmR+8UKcqx64PfBB54IpV4qVmzmhJxsalpp9rawSW8aZS3cKgbkjHv+GPxNaPozN6aIz7fQbLxPOkOrPLJHJqHkhMgiNSf4cg4P8++ackqfvR3sNa6M8/8AF2kW2gXO/T3kUtEJPmxxlM4GAOPaoozlUhdmvIudI5bXVF5oV3dzcyRtHKCP72EH9TW8t7GMWcRaSN/aYbP3iCR25HNTOK9lY530OgspGnXzHxkHHAri5Fz8nTQdvyP2/wDgJ4P0Xwh8O9D0rRonSCSyglbcQTuaIMegHfJ9eea7pK2gQV1c9SgUeYFHA4FRbQLvcsqAGxVbIFqywF4z/QUrmkdj/9k=",
            isEmployee    : true,
            fullName      : "Olga Sikora",
            id            : "56123232c90e2fb026ce064b"
        },
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
            country: "Italy",
            zip    : "",
            state  : "",
            city   : "",
            street : ""
        },
        customer        : {
            _id           : "5604170eb904af832d000005",
            __v           : 0,
            companyInfo   : {
                industry: null
            },
            editedBy      : {
                date: "2015-09-24T15:30:22.135Z",
                user: "55cb7302fea413b50b000007"
            },
            createdBy     : {
                date: "2015-09-24T15:30:22.135Z",
                user: "55cb7302fea413b50b000007"
            },
            history       : [],
            attachments   : [],
            notes         : [],
            groups        : {
                group: [],
                users: [],
                owner: "55ba28c8d79a3a3439000016"
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
            website       : "",
            address       : {
                country: "Italy",
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
                first: "Stentle"
            },
            isOwn         : false,
            type          : "Company",
            fullName      : "Stentle ",
            id            : "5604170eb904af832d000005"
        },
        company         : null,
        tempCompanyField: "",
        creationDate    : "2016-03-28T11:01:34.400Z",
        expectedRevenue : {
            currency: "$",
            progress: null,
            value   : 5200
        },
        name            : "PriceBox WEB",
        isOpportunitie  : true
    };
    var fakeWorkFlows = {
        data: [
            {
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
            {
                _id         : "528cdd2af3f67bc40b000007",
                __v         : 0,
                attachments : [],
                name        : "Probablity 25-50",
                sequence    : 4,
                status      : "In Progress",
                wId         : "Opportunities",
                wName       : "opportunity",
                source      : "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id     : "56dd819ccc599b971852913b",
                sequence: 3,
                status  : "In Progress",
                name    : "Probability 50-75",
                wId     : "Opportunities",
                __v     : 0,
                visible : true,
                color   : "#2C3E50"
            },
            {
                _id         : "528cde9ef3f67bc40b000008",
                __v         : 0,
                attachments : [],
                name        : "Probability 75-100",
                sequence    : 2,
                status      : "In Progress",
                wId         : "Opportunities",
                wName       : "opportunity",
                source      : "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528cdef4f3f67bc40b00000a",
                __v         : 0,
                attachments : [],
                name        : "Won",
                sequence    : 1,
                status      : "Done",
                wId         : "Opportunities",
                wName       : "opportunity",
                source      : "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528cdf1cf3f67bc40b00000b",
                __v         : 0,
                attachments : [],
                name        : "Lost",
                sequence    : 0,
                status      : "Cancelled",
                wId         : "Opportunities",
                wName       : "opportunity",
                source      : "opportunity",
                targetSource: [
                    "opportunity"
                ],
                visible     : true,
                color       : "#2C3E50"
            }
        ]
    };
    var fakeFilters = {
        _id     : null,
        customer: [
            {
                _id : "56ab5ca674d57e0d56d6bda4",
                name: "Stian Maurstad"
            },
            {
                _id : "562bc2db62461bfd59ef58c7",
                name: "AppMedia "
            },
            {
                _id : "5717873cc6efb4847a5bc78c",
                name: "CEEK VR "
            }
        ],
        workflow: [
            {
                _id : "56dd819ccc599b971852913b",
                name: "% 50-75"
            },
            {
                _id : "528cdd2af3f67bc40b000007",
                name: "% 25-50"
            },
            {
                _id : "528cde9ef3f67bc40b000008",
                name: "% 75-100"
            },
            {
                _id : "528cdcb4f3f67bc40b000006",
                name: "New"
            },
            {
                _id : "528cdf1cf3f67bc40b00000b",
                name: "Lost"
            },
            {
                _id : "528cdef4f3f67bc40b00000a",
                name: "Won"
            }
        ]
    };
    var fakeResponseSavedFilter = {
        "success": {
            "_id"            : "52203e707d4dba8813000003",
            "__v"            : 0,
            "attachments"    : [],
            "lastAccess"     : "2016-06-28T07:03:57.904Z",
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
            }, {
                "_id"        : "577221ca58982a9011f8a580",
                "contentType": "journalEntry",
                "byDefault"  : false
            }, {"_id": "57722e0458982a9011f8a581", "contentType": "Opportunities", "byDefault": false}],
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
    var opportunitiesCollection;
    var view;
    var topBarView;
    var listView;
    var kanbanView;
    var expect;
    var selectSpy;
    var removeFilterSpy;
    var saveFilterSpy;
    var removedFromDBSpy;
    var debounceStub;
    var globalClock;
    var ajaxSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('Opportunities View', function () {
        var $fixture;
        var $elFixture;
        var historyNavigateSpy;

        before(function () {
            globalClock = sinon.useFakeTimers();
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
            selectSpy = sinon.spy(FilterGroup.prototype, 'selectValue');
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
            saveFilterSpy = sinon.spy(SavedFilters.prototype, 'saveFilter');
            removedFromDBSpy = sinon.spy(SavedFilters.prototype, 'removeFilterFromDB');
            debounceStub = sinon.stub(_, 'debounce', function (debFunction) {
                globalClock.tick(700);
                return debFunction;
            });
            ajaxSpy = sinon.spy($, 'ajax');
        });

        after(function () {
            var $dialogs = $('.ui-dialog');

            view.remove();
            topBarView.remove();
            listView.remove();
            kanbanView.remove();

            if ($dialogs.length) {
                $dialogs.remove();
            }

            globalClock.restore();
            historyNavigateSpy.restore();
            selectSpy.restore();
            removeFilterSpy.restore();
            saveFilterSpy.restore();
            removedFromDBSpy.restore();
            debounceStub.restore();
            ajaxSpy.restore();
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

                view = new MainView({el: $elFixture, contentType: 'Opportunities'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="25"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="25"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Opportunities');
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
                var opportunitiesUrl = new RegExp('\/Opportunities\/', 'i');

                server.respondWith('GET', opportunitiesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunities)]);
                opportunitiesCollection = new OpportunitiesCollection({
                    contentType: 'Opportunities',
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true,
                    showMore   : false
                });
                server.respond();
                expect(opportunitiesCollection)
                    .to.have.lengthOf(2);

                topBarView = new TopBarView({
                    collection: opportunitiesCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });

            it('Try to change viewType', function () {
                var $listTypeBtn = topBarView.$el.find('#listBtn');
                var $kanBanTypeBtn = topBarView.$el.find('#kanbanBtn');

                $listTypeBtn.click();
                expect(window.location.hash).to.be.equals('#easyErp/Opportunities/list');

                $kanBanTypeBtn.click();
                expect(window.location.hash).to.be.equals('#easyErp/Opportunities/kanban');
            });
        });

        describe('List view', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;
            var alertStub;
            var $thisEl;
            var listDeleteSpy;
            var sortSpy;
            var chooseOptionSpy;
            var clock;

            before(function () {
                App.currentViewType = 'list';

                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                alertStub = sinon.stub(window, 'alert');
                alertStub.returns(true);
                listDeleteSpy = sinon.spy(ListView.prototype, 'deleteItems');
                sortSpy = sinon.spy(ListView.prototype, 'goSort');
                chooseOptionSpy = sinon.spy(ListView.prototype, 'chooseOption');
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                alertStub.restore();
                listDeleteSpy.restore();
                sortSpy.restore();
                chooseOptionSpy.restore();
                clock.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create Opportunities list view', function (done) {
                    var workflowsUrl = new RegExp('\/Workflows', 'i');
                    var filterUrl = '/filter/Opportunities';
                    var $firstRow;
                    var colCount;
                    var date;
                    var opportunity;
                    var revenue;
                    var customer;
                    var nextActDate;
                    var nextAction;
                    var stage;
                    var salesPerson;
                    var createdBy;
                    var editedBy;

                    server.respondWith('GET', workflowsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWorkFlows)]);
                    server.respondWith('GET', filterUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilters)]);
                    listView = new ListView({
                        collection: opportunitiesCollection,
                        startTime : new Date()
                    });
                    server.respond();

                    clock.tick(700);

                    $thisEl = listView.$el;

                    eventsBinder.subscribeCollectionEvents(opportunitiesCollection, listView);
                    eventsBinder.subscribeTopBarEvents(topBarView, listView);

                    expect($thisEl.find('table')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(2);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;
                    expect(colCount).to.be.equals(12);

                    date = $firstRow.find('td:nth-child(3)').text();
                    expect(date).not.to.be.empty;
                    expect(date).to.not.match(/object Object|undefined/);

                    opportunity = $firstRow.find('td:nth-child(4) > span').text();
                    expect(opportunity).not.to.be.empty;
                    expect(opportunity).to.not.match(/object Object|undefined/);

                    revenue = $firstRow.find('td:nth-child(5)').text();
                    expect(revenue).not.to.be.empty;
                    expect(revenue).to.not.match(/object Object|undefined/);

                    customer = $firstRow.find('td:nth-child(6)').text();
                    expect(customer).to.not.match(/object Object|undefined/);

                    nextActDate = $firstRow.find('td:nth-child(7)').text();
                    expect(nextActDate).to.not.match(/object Object|undefined/);

                    nextAction = $firstRow.find('td:nth-child(8)').text();
                    expect(nextAction).to.not.match(/object Object|undefined/);

                    expect($firstRow.find('td:nth-child(9) > a')).to.exist;
                    stage = $firstRow.find('td:nth-child(9) > a').text();
                    expect(stage).not.to.be.empty;
                    expect(stage).to.not.match(/object Object|undefined/);

                    salesPerson = $firstRow.find('td:nth-child(10)').text();
                    expect(salesPerson).not.to.be.empty;
                    expect(salesPerson).to.not.match(/object Object|undefined/);

                    createdBy = $firstRow.find('td:nth-child(11)').text();
                    expect(createdBy).not.to.be.empty;
                    expect(createdBy).to.not.match(/object Object|undefined/);

                    editedBy = $firstRow.find('td:nth-child(12)').text();
                    expect(editedBy).not.to.be.empty;
                    expect(editedBy).to.not.match(/object Object|undefined/);

                    done();
                });

                it('Try to delete item with error response', function () {
                    var opportunitiesUrl = new RegExp('\/Opportunities\/', 'i');
                    var $firstEl = listView.$el.find('tr:nth-child(1) > td:nth-child(1) > .checkbox');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    windowConfirmStub.returns(true);
                    listDeleteSpy.reset();
                    ajaxSpy.reset();
                    mainSpy.reset();

                    $firstEl.click();

                    server.respondWith('DELETE', opportunitiesUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({
                        success: 'Delete success'
                    })]);
                    $deleteBtn.click();
                    server.respond();

                    expect(listDeleteSpy.calledOnce).to.be.true;
                    expect(windowConfirmStub.called).to.be.true;
                    expect(mainSpy.args[0][0]).to.have.property('type', 'error');
                });

                it('Try to delete item', function () {
                    var opportunitiesUrl = new RegExp('\/Opportunities\/', 'i');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    windowConfirmStub.returns(true);
                    listDeleteSpy.reset();

                    ajaxSpy.reset();

                    server.respondWith('GET', opportunitiesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunities)]);
                    server.respondWith('DELETE', opportunitiesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    expect(listDeleteSpy.calledOnce).to.be.true;
                    expect(windowConfirmStub.called).to.be.true;
                    expect(ajaxSpy.args.length).to.be.least(2);
                });

                it('Try to sort list', function () {
                    var opportunitiesUrl = new RegExp('\/Opportunities\/', 'i');
                    var $sortBtn = listView.$el.find('th[data-sort="expectedRevenue.value"]');

                    server.respondWith('GET', opportunitiesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunities)]);
                    $sortBtn.click();
                    server.respond();
                    expect(sortSpy.calledOnce).to.be.true;

                    $sortBtn.click();
                    server.respond();
                    expect(sortSpy.calledTwice).to.be.true;
                });

                it('Try to change opportunity stage', function () {
                    var $needRow = listView.$el.find('#listTable > tr:nth-child(1)');
                    var $stageBtn = $needRow.find('td:nth-child(9) > a');
                    var opportunitiesUrl = new RegExp('\/Opportunities\/', 'i');
                    var $selectedItem;

                    $stageBtn.click();
                    expect($stageBtn.closest('td').find('.newSelectList')).to.exist;
                    expect($stageBtn.closest('td').find('.newSelectList li').length).to.not.equals(0);

                    $stageBtn.click();
                    expect($stageBtn.closest('td').find('.newSelectList')).to.not.exist;

                    $stageBtn.click();
                    expect($stageBtn.closest('td').find('.newSelectList')).to.exist;
                    expect($stageBtn.closest('td').find('.newSelectList li').length).to.not.equals(0);

                    $selectedItem = $stageBtn.closest('td').find('.newSelectList li').first();

                    ajaxSpy.reset();

                    server.respondWith('PATCH', opportunitiesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $selectedItem.click();
                    server.respond();

                    expect(chooseOptionSpy.calledOnce).to.be.true;
                    expect(ajaxSpy.args[1][0]).to.have.property('url', '/Opportunities/');
                });

                it('Try to Open edit opportunity view with error', function () {
                    var spyResponse;
                    var opportunitiesUrl = new RegExp('\/Opportunities\/form', 'i');
                    var $firstTr = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(4)');

                    mainSpy.reset();

                    server.respondWith('GET', opportunitiesUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunityForForm)]);
                    $firstTr.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to Open edit opportunity view', function () {
                    var opportunitiesUrl = new RegExp('\/Opportunities', 'i');
                    var customerUrl = new RegExp('\/customers\/', 'i');
                    var $firstTr = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(4)');
                    var $dialog;

                    ajaxSpy.reset();

                    server.respondWith('GET', opportunitiesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunityForForm)]);
                    server.respondWith('GET', customerUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomers)]);
                    $firstTr.click();
                    server.respond();
                    server.respond();

                    $dialog = $('.ui-dialog');
                    expect(ajaxSpy.args[0][0]).to.have.property('url', '/Opportunities');
                    expect($dialog).to.have.lengthOf(1);
                });

                /*it('Try to change tab in dialog', function () {
                 var $dialogContainer = $('.ui-dialog');
                 var $firstTab = $dialogContainer.find('.dialog-tabs > li:nth-child(1) > a');
                 var $secondTab = $dialogContainer.find('.dialog-tabs > li:nth-child(2) > a');
                 var $thirdTab = $dialogContainer.find('.dialog-tabs > li:nth-child(3) > a');

                 expect($firstTab).to.have.class('active');

                 $secondTab.click();
                 expect($dialogContainer.find('.dialog-tabs > li:nth-child(2) > a')).to.have.class('active');

                 $thirdTab.click();
                 expect($dialogContainer.find('.dialog-tabs > li:nth-child(3) > a')).to.have.class('active');

                 $firstTab.click();
                 expect($dialogContainer.find('.dialog-tabs > li:nth-child(1) > a')).to.have.class('active');
                 });*/

                it('Try to edit item', function () {
                    var opportunitiesUrl = new RegExp('\/Opportunities\/', 'i');
                    var $dialogContainer = $('.ui-dialog');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var $customerBtn = $dialogContainer.find('#customerDd');
                    var hashOpportunityUrl = new RegExp('#easyErp\/Opportunities');
                    var $needSelect;

                    $customerBtn.click();
                    $needSelect = $dialogContainer.find('.newSelectList li').first();

                    server.respondWith('GET', '/customers/?id=55b92ad621e4b7c40f000635', [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomerWithId)]);
                    $needSelect.click();
                    server.respond();

                    server.respondWith('PATCH', opportunitiesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect(hashOpportunityUrl.test(window.location.hash)).to.be.true;
                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to open Create Opportunities View', function () {
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var customerUrl = new RegExp('\/customers\/', 'i');
                    var opportunityPriorityUrl = '/opportunities/priority';
                    var employeesForDDUrl = '/employees/getForDD?isEmployee=true';

                    server.respondWith('GET', customerUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomers)]);
                    server.respondWith('GET', opportunityPriorityUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunitiesPriority)]);
                    server.respondWith('GET', employeesForDDUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployeesForDD)]);
                    $createBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to change tab', function () {
                    var $dialogContainer = $('.ui-dialog');
                    var $firstTab = $dialogContainer.find('.dialog-tabs > li:nth-child(1) > a');
                    var $secondTab = $dialogContainer.find('.dialog-tabs > li:nth-child(2) > a');
                    var $thirdTab = $dialogContainer.find('.dialog-tabs > li:nth-child(3) > a');

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($dialogContainer.find('.dialog-tabs > li:nth-child(2) > a')).to.have.class('active');

                    $thirdTab.click();
                    expect($dialogContainer.find('.dialog-tabs > li:nth-child(3) > a')).to.have.class('active');

                    $firstTab.click();
                    expect($dialogContainer.find('.dialog-tabs > li:nth-child(1) > a')).to.have.class('active');
                });

                it('Try to create item with error result', function () {
                    var $dialogContainer = $('.ui-dialog');
                    var $subjectEl = $dialogContainer.find('#name');
                    var $revenueEl = $dialogContainer.find('#expectedRevenueValue');
                    var $customerBtn = $dialogContainer.find('#customerDd');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var opportunitiesUrl = new RegExp('\/Opportunities\/', 'i');
                    var customerUrl = new RegExp('\/customers\/', 'i');
                    var $needSelect;

                    $customerBtn.click();
                    $needSelect = $dialogContainer.find('.newSelectList li').first();

                    server.respondWith('GET', customerUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomerWithId)]);
                    $needSelect.click();
                    server.respond();

                    $subjectEl.val('Test');
                    $revenueEl.val('100000');

                    alertStub.reset();

                    server.respondWith('POST', opportunitiesUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect(alertStub.called).to.be.true;
                });

                it('Try to change Customer AssignedTo Stages Priority', function () {
                    var $customerDd = $('#customerDd');
                    var $assignedDd = $('#salesPersonDd');
                    var $stagesDd = $('#workflowDd');
                    var $priorityDd = $('#priorityDd');
                    var $newSelectList;
                    var $firstEl;

                    $customerDd.click();
                    $newSelectList = $customerDd.find('.newSelectList');
                    expect($newSelectList).have.to.exist;
                    $firstEl = $newSelectList.find('ul > li').first();
                    $firstEl.click();
                    expect($customerDd.find('.newSelectList')).to.not.exist;
                    expect($customerDd).to.have.attr('data-id');

                    $assignedDd.click();
                    $newSelectList = $assignedDd.find('.newSelectList');
                    expect($newSelectList).have.to.exist;
                    $firstEl = $newSelectList.find('ul > li').first();
                    $firstEl.click();
                    expect($assignedDd.find('.newSelectList')).to.not.exist;
                    expect($assignedDd).to.have.attr('data-id');

                    $stagesDd.click();
                    $newSelectList = $stagesDd.find('.newSelectList');
                    expect($newSelectList).have.to.exist;
                    $firstEl = $newSelectList.find('ul > li').first();
                    $firstEl.click();
                    expect($stagesDd.find('.newSelectList')).to.not.exist;
                    expect($stagesDd).to.have.attr('data-id');

                    $priorityDd.click();
                    $newSelectList = $priorityDd.find('.newSelectList');
                    expect($newSelectList).have.to.exist;
                    $firstEl = $newSelectList.find('ul > li').first();
                    $firstEl.click();
                    expect($priorityDd.find('.newSelectList')).to.not.exist;
                    expect($priorityDd).to.have.attr('data-id');

                });

                it('Try to create item', function () {
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var opportunitiesUrl = new RegExp('\/Opportunities\/', 'i');

                    server.respondWith('POST', opportunitiesUrl, [201, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/Opportunities/list/p=1/c=100');
                });

                it('Try to cancel dialog', function () {
                    var $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to filter listView by customer and workflow', function () {
                    var url = '/Opportunities/';
                    var contentType = 'Opportunities';
                    var firstValue = 'customer';
                    var secondValue = 'workflow';
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
                    ajaxSpy.reset();
                    $firstGroup = $searchContainer.find($firstContainer);
                    $firstGroup.click();

                    $selectedItem = $searchContainer.find($firstSelector);

                    server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunities)]);
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

                    clock.tick(700);
                    server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteSavedFilterBtn.click();
                    server.respond();

                    expect(removedFromDBSpy.calledOnce).to.be.true;
                    expect($searchContainer.find('#savedFiltersElements > li')).to.have.lengthOf(0);
                    expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
                });

                it('Try to remove filter', function () {
                    var secondValue = 'supplier';
                    var $searchContainer = $('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
                    var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
                    var $thisEl = $('#content-holder');
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

                    $removeBtn = $searchContainer.find('.removeValues');
                    $removeBtn.click();
                    server.respond();
                    clock.tick(700);

                    expect(removeFilterSpy.calledOnce).to.be.true;
                    expect(ajaxSpy.calledOnce).to.be.true;
                    ajaxResponse = ajaxSpy.args[0][0];
                    ajaxFilter = ajaxResponse.data && ajaxResponse.data.filter;
                    expect(ajaxFilter).to.not.have.property(secondValue);

                    //expect($searchContainer.find('.forFilterIcons')).to.have.lengthOf(0);
                });
            });
        });

        describe('Kanban View', function () {
            var $thisEl;
            var server;
            var workflowCollection;
            var mainSpy;
            var windowConfirmStub;
            var clock;
            var alertStub;
            var foldUnfoldSpy;
            var gotoEditFormSpy;
            var saveOpportunitySpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                App.currentViewType = 'kanban';
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                clock = sinon.useFakeTimers();
                alertStub = sinon.stub(window, 'alert');
                alertStub.returns(true);
                foldUnfoldSpy = sinon.spy(KanbanView.prototype, 'foldUnfoldKanban');
                gotoEditFormSpy = sinon.spy(KanbanView.prototype, 'gotoEditForm');
                saveOpportunitySpy = sinon.spy(EditView.prototype, 'saveItem');

                delete App.filtersObject.filter;
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                clock.restore();
                alertStub.restore();
                foldUnfoldSpy.restore();
                gotoEditFormSpy.restore();
                saveOpportunitySpy.restore();
            });

            it('Try to create KanbanView', function () {
                var kanbanUrl = new RegExp('\/Opportunities\/', 'i');
                var workFlowUrl = new RegExp('\/Workflows');
                var $kanbanTable;
                var $firstItem;
                var $opportunityHeader;
                var $opportunityContent;
                var opportunityName;
                var revenue;
                var salesManager;
                var customer;
                var date;

                server.respondWith('GET', workFlowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWorkFlows)]);
                workflowCollection = new WorkflowCollection({
                    id: 'Opportunities'
                });
                server.respond();

                server.respondWith('GET', kanbanUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunitiesKanBan)]);
                kanbanView = new KanbanView({
                    workflowCollection: workflowCollection,
                    startTime         : new Date()
                });
                server.respond();

                eventsBinder.subscribeTopBarEvents(topBarView, kanbanView);

                $thisEl = kanbanView.$el;
                expect($thisEl.find('.kanban')).to.exist;
                $kanbanTable = $thisEl.find('.kanban');
                expect($kanbanTable.find('tr > td').length).to.be.equals(6);
                expect($kanbanTable.find('tr > td .item').length).to.be.equals(6);

                $firstItem = $kanbanTable.find('tr > td .item').first();
                $opportunityHeader = $firstItem.find('.opportunity-header');
                $opportunityContent = $firstItem.find('.opportunity-content');

                expect($opportunityHeader).to.exist;
                expect($opportunityContent).to.exist;

                opportunityName = $opportunityHeader.find('h4').text();
                expect(opportunityName).not.to.be.empty;
                expect(opportunityName).to.not.match(/object Object|undefined/);

                revenue = $opportunityHeader.find('h3').text();
                expect(revenue).to.not.match(/object Object|undefined/);

                customer = $opportunityContent.find('p.left').first().text();
                expect(customer).to.not.match(/object Object|undefined/);

                salesManager = $opportunityContent.find('p.left').eq(1).text();
                expect(salesManager).not.to.be.empty;
                expect(salesManager).to.not.match(/object Object|undefined/);

                date = $opportunityContent.find('p.right').text();
                expect(date).to.not.match(/object Object|undefined/);
            });

            it('Try to fold|unfold kanban column', function () {
                var $needTd = $thisEl.find('td[data-id="528cdef4f3f67bc40b00000a"]');
                var $foldBtn = $needTd.find('.fold-unfold');

                foldUnfoldSpy.reset();
                //unfold
                $needTd.click();
                expect(foldUnfoldSpy.calledOnce).to.be.true;
                expect($thisEl.find('td[data-id="528cdef4f3f67bc40b00000a"]')).to.have.not.class('fold');

                // fold
                $foldBtn.click();
                expect(foldUnfoldSpy.calledTwice).to.be.true;
                expect($thisEl.find('td[data-id="528cdef4f3f67bc40b00000a"]')).to.have.class('fold');
            });

            it('Try to open and cancel edit kanban settings dialog', function () {
                var currentUserUrl = '/users/current';
                var $cancelBtn;

                server.respondWith('GET', currentUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCurrentUser)]);
                kanbanView.editKanban();
                server.respond();

                expect($('.ui-dialog')).to.exist;

                // try to cancel dialog
                $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                $cancelBtn.click();
                expect($('.ui-dialog')).to.not.exist;
            });

            it('Try to edit Kanban settings', function () {
                var currentUserUrl = '/users/current';
                var $saveBtn;
                var $countInput;
                var $dialog;

                server.respondWith('GET', currentUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCurrentUser)]);
                kanbanView.editKanban();
                server.respond();

                expect($('.ui-dialog')).to.exist;

                $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                $dialog = $('.ui-dialog');
                $countInput = $dialog.find('#cPerPage');
                $countInput.val('15');

                server.respondWith('POST', currentUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'update success'})]);
                $saveBtn.click();
                server.respond();

                expect($('.ui-dialog')).to.not.exist;
            });

            it('Try to go to OpportunityEditView with fetch model error', function () {
                var spyResponse;
                var $needTd = $thisEl.find('td[data-id="528cdef4f3f67bc40b00000a"]');
                var $needItem = $needTd.find('#5654dd337fd64406664b9216');
                var opportunityUrl = new RegExp('\/Opportunities');

                server.respondWith('GET', opportunityUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $needItem.dblclick();
                server.respond();

                spyResponse = mainSpy.args[0][0];

                expect(gotoEditFormSpy.calledOnce).to.be.true;
                expect(spyResponse).to.have.property('type', 'error');
                expect(spyResponse).to.have.property('message', 'Please refresh browser');
            });

            it('Try to go to OpportunityEditView', function () {
                var $needTd = $thisEl.find('td[data-id="528cdef4f3f67bc40b00000a"]');
                var $needItem = $needTd.find('#5654dd337fd64406664b9216');
                var opportunityUrl = new RegExp('\/Opportunities');
                var customersUrl = '/customers/';

                server.respondWith('GET', opportunityUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunityById)]);
                server.respondWith('GET', customersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomers)]);
                $needItem.dblclick();
                server.respond();
                server.respond();

                expect(gotoEditFormSpy.calledTwice).to.be.true;
                expect($('.ui-dialog')).to.exist;
            });

            it('Try to edit item', function (done) {
                var $selectedItem;
                var $prev;
                var $next;
                var saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                var $form = $('.ui-dialog');
                var $customer = $form.find('#customerDd');
                var opportunityUrl = new RegExp('\/Opportunities\/', 'i');
                var customerUrl = new RegExp('\/customers\/', 'i');
                var keyDownEvent = $.Event('keydown', {which: 56});

                $form.find('#name').val('test');
                $form.find('#name').trigger(keyDownEvent);
                $form.find('#internalNotes').val('test');
                $form.find('#expectedRevenueValue').val('10000');

                // select customers
                $customer.click();
                $next = $customer.find('.next');
                $next.click();
                $prev = $customer.find('.prev');
                $prev.click();
                $selectedItem = $customer.find('#55b92ad621e4b7c40f000637');

                server.respondWith('GET', customerUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomerWithId)]);
                $selectedItem.click();
                server.respond();

                server.respondWith('PATCH', opportunityUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    success : 'Opportunities updated',
                    notes   : [],
                    sequence: 2
                })]);
                saveBtn.click();
                server.respond();

                clock.tick(250);

                $('.ui-dialog').remove();

                expect(saveOpportunitySpy.calledOnce).to.be.true;
                expect(window.location.hash).to.be.equals('#easyErp/Opportunities');

                done();
            });

            it('Try to delete item with error response', function () {
                var $deleteBtn;
                var $needTd = $thisEl.find('td[data-id="528cdef4f3f67bc40b00000a"]');
                var $needItem = $needTd.find('#5654dd337fd64406664b9216');
                var opportunityUrl = new RegExp('\/Opportunities\/form');
                var customersUrl = '/customers/';
                var opportunityDeleteForn = new RegExp('\/Opportunities\/', 'i');

                server.respondWith('GET', opportunityUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunityById)]);
                server.respondWith('GET', customersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomers)]);
                $needItem.dblclick();
                server.respond();
                server.respond();

                expect($('.ui-dialog')).to.exist;

                $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                server.respondWith('DELETE', opportunityDeleteForn, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $deleteBtn.click();
                server.respond();

                expect(alertStub.called).to.be.true;
            });

            it('Try to delete item', function () {
                var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                var opportunityDeleteForn = new RegExp('\/Opportunities\/', 'i');

                server.respondWith('DELETE', opportunityDeleteForn, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Deleted success'})]);
                $deleteBtn.click();
                server.respond();

                expect($('.ui-dialog')).to.not.exist;
            });

            it('Try to filter listView by workflow and salesPerson', function () {
                var url = '/Opportunities/';
                var contentType = 'Opportunities';
                var firstValue = 'workflow';
                var secondValue = 'salesPerson';
                var $searchContainer = $thisEl.find('#searchContainer');
                var $searchArrow = $searchContainer.find('.search-content');
                var contentUrl = new RegExp(url, 'i');
                var $firstContainer = '#' + firstValue + 'FullContainer .groupName';
                var $firstSelector = '#' + firstValue + 'Ul > li:nth-child(1)';
                var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
                var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
                var $firstGroup;
                var $secondGroup;
                var $selectedItem;
                var ajaxResponse;
                var filterObject;
                var $kanbanTable;

                selectSpy.reset();

                // open filter dropdown
                $searchArrow.click();
                expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                // select firstGroup filter
                ajaxSpy.reset();
                $firstGroup = $searchContainer.find($firstContainer);
                $firstGroup.click();

                $selectedItem = $searchContainer.find($firstSelector);

                server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOpportunitiesKanBan)]);
                $selectedItem.click();
                server.respond();

                expect(selectSpy.calledOnce).to.be.true;
                expect($thisEl.find('#searchContainer')).to.exist;
                //expect($thisEl.find('#startLetter')).to.exist;
                expect($searchContainer.find('#searchFilterContainer>div')).to.have.lengthOf(2);
                expect($searchContainer.find($firstSelector)).to.have.class('checkedValue');
                $kanbanTable = $thisEl.find('.kanban');
                expect($kanbanTable.find('tr > td').length).to.be.equals(6);
                expect($kanbanTable.find('tr > td .item').length).to.be.not.equals(0);

                expect(ajaxSpy.calledOnce).to.be.true;

                ajaxResponse = ajaxSpy.args[0][0];
                expect(ajaxResponse).to.have.property('url', url);
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
                $kanbanTable = $thisEl.find('.kanban');
                expect($kanbanTable.find('tr > td').length).to.be.equals(6);
                expect($kanbanTable.find('tr > td .item').length).to.be.not.equals(0);

                ajaxResponse = ajaxSpy.args[0][0];
                expect(ajaxResponse).to.have.property('url', url);
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
                expect($kanbanTable.find('tr > td').length).to.be.equals(6);
                expect($kanbanTable.find('tr > td .item').length).to.be.not.equals(0);

                ajaxResponse = ajaxSpy.args[0][0];
                expect(ajaxResponse).to.have.property('url', url);
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

                clock.tick(700);
                server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $deleteSavedFilterBtn.click();
                server.respond();

                expect(removedFromDBSpy.calledOnce).to.be.true;
                expect($searchContainer.find('#savedFiltersElements > li')).to.have.lengthOf(0);
                expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(1);
            });

            it('Try to remove filter', function () {
                var secondValue = 'supplier';
                var $searchContainer = $('#searchContainer');
                var $searchArrow = $searchContainer.find('.search-content');
                var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
                var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
                var $thisEl = $('#content-holder');
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

                $removeBtn = $searchContainer.find('.removeValues');
                $removeBtn.click();
                server.respond();
                clock.tick(700);

                expect(removeFilterSpy.calledOnce).to.be.true;
                expect(ajaxSpy.calledOnce).to.be.true;
                ajaxResponse = ajaxSpy.args[0][0];
                ajaxFilter = ajaxResponse.data && ajaxResponse.data.filter;
                expect(ajaxFilter).to.not.have.property(secondValue);

                //expect($searchContainer.find('.forFilterIcons')).to.have.lengthOf(0);
            });
        });
    });
});
