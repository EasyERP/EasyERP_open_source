define([
    'Backbone',
    'Underscore',
    'modules',
    'text!fixtures/index.html',
    'collections/Tasks/filterCollection',
    'collections/Workflows/WorkflowsCollection',
    'views/main/MainView',
    'views/Tasks/list/ListView',
    'views/Tasks/kanban/KanbanView',
    'views/Tasks/TopBarView',
    'views/Tasks/CreateView',
    'views/Tasks/EditView',
    'views/Filter/filterView',
    'views/Filter/filtersGroup',
    'views/Filter/savedFiltersView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'constants/filters'
], function (Backbone,
             _,
             modules,
             fixtures,
             TasksCollection,
             WorkflowCollection,
             MainView,
             ListView,
             KanBanView,
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
             FILTER_CONSTANTS) {
    'use strict';

    var expect;
    var fakeTasks = {
        total: 300,
        data : [
            {
                _id       : "575ef20a0fc96daf2a4787a4",
                total     : 3,
                summary   : "Test_task1",
                type      : "Task",
                workflow  : {
                    _id         : "528ce0cdf3f67bc40b00000c",
                    __v         : 0,
                    attachments : [],
                    color       : "#2C3E50",
                    name        : "New",
                    sequence    : 5,
                    status      : "New",
                    wId         : "Tasks",
                    wName       : "task",
                    source      : "task",
                    targetSource: [
                        "task"
                    ],
                    visible     : true
                },
                assignedTo: {
                    _id           : "55b92ad221e4b7c40f000030",
                    dateBirth     : "1981-12-31T23:00:00.000Z",
                    ID            : 1,
                    isLead        : 2,
                    fire          : [],
                    hire          : [
                        "2011-10-10T21:00:00.000Z"
                    ],
                    social        : {
                        FB: "",
                        LI: ""
                    },
                    sequence      : 0,
                    jobType       : "fullTime",
                    gender        : "male",
                    marital       : "married",
                    contractEnd   : {
                        date  : "2015-07-29T19:34:42.405Z",
                        reason: ""
                    },
                    attachments   : [],
                    editedBy      : {
                        date: "2016-05-12T06:15:39.433Z",
                        user: "55b8cb7d0ce4affc2a0015cb"
                    },
                    createdBy     : {
                        date: "2015-07-29T19:34:42.404Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate  : "2015-07-29T19:34:42.404Z",
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
                    age           : 33,
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
                    jobPosition   : "564438d470bbc2b740ce8a1a",
                    department    : "55bb1f40cb76ca630b000007",
                    visibility    : "Public",
                    relatedUser   : null,
                    officeLocation: "",
                    skype         : "alexsvt",
                    workPhones    : {
                        phone : "",
                        mobile: "+380509369493"
                    },
                    personalEmail : "alsv82@gmail.com",
                    workEmail     : "alex.svatuk@thinkmobiles.com",
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
                        first: "Alex",
                        last : "Svatuk"
                    },
                    subject       : "",
                    imageSrc      : "data:image/jpeg;base64,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",
                    isEmployee    : true,
                    __v           : 0,
                    transfer      : [
                        {
                            isDeveloper    : true,
                            date           : "2011-10-10T21:00:00.000Z",
                            info           : "",
                            salary         : 1800,
                            jobType        : "fullTime",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f00004f",
                            jobPosition    : "5643483270bbc2b740ce8a16",
                            department     : "55b92ace21e4b7c40f000012",
                            status         : "hired"
                        },
                        {
                            isDeveloper    : true,
                            date           : "2015-07-01T00:00:00.000Z",
                            info           : "",
                            salary         : 2000,
                            jobType        : "fullTime",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f00004f",
                            jobPosition    : "5643483270bbc2b740ce8a16",
                            department     : "55b92ace21e4b7c40f000012",
                            status         : "transfer"
                        },
                        {
                            isDeveloper    : false,
                            date           : "2015-08-01T00:00:00.000Z",
                            info           : "",
                            salary         : 2000,
                            jobType        : "fullTime",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f00004f",
                            jobPosition    : "564438d470bbc2b740ce8a1a",
                            department     : "55bb1f40cb76ca630b000007",
                            status         : "updated"
                        },
                        {
                            isDeveloper    : false,
                            date           : "2016-04-01T00:00:00.000Z",
                            info           : "",
                            salary         : 2200,
                            jobType        : "fullTime",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f00004f",
                            jobPosition    : "564438d470bbc2b740ce8a1a",
                            department     : "55bb1f40cb76ca630b000007",
                            status         : "updated"
                        }
                    ]
                },
                project   : {
                    _id             : "571a079eb629a41976c9ac96",
                    StartDate       : "2016-03-15T23:00:00.000Z",
                    description     : "Windows app for creating bolus 3D models",
                    budget          : {
                        bonus      : [],
                        projectTeam: []
                    },
                    bonus           : [],
                    health          : 1,
                    editedBy        : {
                        date: "2016-05-25T12:17:34.773Z",
                        user: "52203e707d4dba8813000003"
                    },
                    attachments     : [],
                    notes           : [],
                    projecttype     : ".net",
                    createdBy       : {
                        date: "2016-04-22T11:14:38.051Z",
                        user: "56239dcce9576d1728a9ed1c"
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
                    customer        : "55cf4f834a91e37b0b000102",
                    task            : [
                        "575ef20a0fc96daf2a4787a4"
                    ],
                    projectShortDesc: "Peter Hickey",
                    __v             : 0,
                    paymentTerms    : "55536e52475b7be475f335f6",
                    paymentMethod   : "565f2e05ab70d49024242e07",
                    name            : "3D Bolus (Windows)",
                    EndDate         : "2016-06-13T17:48:58.543Z"
                },
                editedBy  : {
                    user: {
                        _id            : "52203e707d4dba8813000003",
                        __v            : 0,
                        attachments    : [],
                        credentials    : {
                            access_token : "",
                            refresh_token: ""
                        },
                        email          : "info@thinkmobiles.com",
                        kanbanSettings : {
                            applications : {
                                countPerPage : 10,
                                foldWorkflows: [
                                    "Empty"
                                ]
                            },
                            opportunities: {
                                countPerPage: 10
                            },
                            tasks        : {
                                countPerPage : 10,
                                foldWorkflows: [
                                    "528ce3caf3f67bc40b000013",
                                    "528ce3acf3f67bc40b000012",
                                    "528ce30cf3f67bc40b00000f",
                                    "528ce35af3f67bc40b000010"
                                ]
                            }
                        },
                        lastAccess     : "2016-06-13T15:00:33.976Z",
                        login          : "admin",
                        pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                        profile        : 1387275598000,
                        imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        savedFilters   : [
                            {
                                _id      : "574335bb27725f815747d579",
                                viewType : "",
                                byDefault: "Leads"
                            },
                            {
                                _id      : "57556d58f07a2b38424e5f4c",
                                viewType : "",
                                byDefault: ""
                            },
                            {
                                _id      : "57557f08f07a2b38424e5f4d",
                                viewType : "",
                                byDefault: ""
                            }
                        ],
                        relatedEmployee: "55b92ad221e4b7c40f00004f"
                    },
                    date: "2016-06-13T17:48:58.543Z"
                },
                createdBy : {
                    user: {
                        _id            : "52203e707d4dba8813000003",
                        __v            : 0,
                        attachments    : [],
                        credentials    : {
                            access_token : "",
                            refresh_token: ""
                        },
                        email          : "info@thinkmobiles.com",
                        kanbanSettings : {
                            applications : {
                                countPerPage : 10,
                                foldWorkflows: [
                                    "Empty"
                                ]
                            },
                            opportunities: {
                                countPerPage: 10
                            },
                            tasks        : {
                                countPerPage : 10,
                                foldWorkflows: [
                                    "528ce3caf3f67bc40b000013",
                                    "528ce3acf3f67bc40b000012",
                                    "528ce30cf3f67bc40b00000f",
                                    "528ce35af3f67bc40b000010"
                                ]
                            }
                        },
                        lastAccess     : "2016-06-13T15:00:33.976Z",
                        login          : "admin",
                        pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                        profile        : 1387275598000,
                        imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        savedFilters   : [
                            {
                                _id      : "574335bb27725f815747d579",
                                viewType : "",
                                byDefault: "Leads"
                            },
                            {
                                _id      : "57556d58f07a2b38424e5f4c",
                                viewType : "",
                                byDefault: ""
                            },
                            {
                                _id      : "57557f08f07a2b38424e5f4d",
                                viewType : "",
                                byDefault: ""
                            }
                        ],
                        relatedEmployee: "55b92ad221e4b7c40f00004f"
                    },
                    date: "2016-06-13T17:48:58.543Z"
                },
                StartDate : "",
                EndDate   : "2016-06-13T17:48:58.543Z",
                logged    : null,
                tags      : [],
                progress  : 0,
                estimated : null,
                sequence  : 0,
                taskCount : 1
            },
            {
                _id       : "575ef1ee0fc96daf2a4787a3",
                total     : 3,
                summary   : "Test1",
                type      : "Task",
                workflow  : {
                    _id         : "528ce0cdf3f67bc40b00000c",
                    __v         : 0,
                    attachments : [],
                    color       : "#2C3E50",
                    name        : "New",
                    sequence    : 5,
                    status      : "New",
                    wId         : "Tasks",
                    wName       : "task",
                    source      : "task",
                    targetSource: [
                        "task"
                    ],
                    visible     : true
                },
                assignedTo: {
                    _id           : "55b92ad221e4b7c40f000030",
                    dateBirth     : "1981-12-31T23:00:00.000Z",
                    ID            : 1,
                    isLead        : 2,
                    fire          : [],
                    hire          : [
                        "2011-10-10T21:00:00.000Z"
                    ],
                    social        : {
                        FB: "",
                        LI: ""
                    },
                    sequence      : 0,
                    jobType       : "fullTime",
                    gender        : "male",
                    marital       : "married",
                    contractEnd   : {
                        date  : "2015-07-29T19:34:42.405Z",
                        reason: ""
                    },
                    attachments   : [],
                    editedBy      : {
                        date: "2016-05-12T06:15:39.433Z",
                        user: "55b8cb7d0ce4affc2a0015cb"
                    },
                    createdBy     : {
                        date: "2015-07-29T19:34:42.404Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate  : "2015-07-29T19:34:42.404Z",
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
                    age           : 33,
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
                    jobPosition   : "564438d470bbc2b740ce8a1a",
                    department    : "55bb1f40cb76ca630b000007",
                    visibility    : "Public",
                    relatedUser   : null,
                    officeLocation: "",
                    skype         : "alexsvt",
                    workPhones    : {
                        phone : "",
                        mobile: "+380509369493"
                    },
                    personalEmail : "alsv82@gmail.com",
                    workEmail     : "alex.svatuk@thinkmobiles.com",
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
                        first: "Alex",
                        last : "Svatuk"
                    },
                    subject       : "",
                    imageSrc      : "data:image/jpeg;base64,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",
                    isEmployee    : true,
                    __v           : 0,
                    transfer      : [
                        {
                            isDeveloper    : true,
                            date           : "2011-10-10T21:00:00.000Z",
                            info           : "",
                            salary         : 1800,
                            jobType        : "fullTime",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f00004f",
                            jobPosition    : "5643483270bbc2b740ce8a16",
                            department     : "55b92ace21e4b7c40f000012",
                            status         : "hired"
                        },
                        {
                            isDeveloper    : true,
                            date           : "2015-07-01T00:00:00.000Z",
                            info           : "",
                            salary         : 2000,
                            jobType        : "fullTime",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f00004f",
                            jobPosition    : "5643483270bbc2b740ce8a16",
                            department     : "55b92ace21e4b7c40f000012",
                            status         : "transfer"
                        },
                        {
                            isDeveloper    : false,
                            date           : "2015-08-01T00:00:00.000Z",
                            info           : "",
                            salary         : 2000,
                            jobType        : "fullTime",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f00004f",
                            jobPosition    : "564438d470bbc2b740ce8a1a",
                            department     : "55bb1f40cb76ca630b000007",
                            status         : "updated"
                        },
                        {
                            isDeveloper    : false,
                            date           : "2016-04-01T00:00:00.000Z",
                            info           : "",
                            salary         : 2200,
                            jobType        : "fullTime",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f00004f",
                            jobPosition    : "564438d470bbc2b740ce8a1a",
                            department     : "55bb1f40cb76ca630b000007",
                            status         : "updated"
                        }
                    ]
                },
                project   : {
                    _id             : "56e689c75ec71b00429745a9",
                    TargetEndDate   : "2016-03-31T00:00:00.000Z",
                    StartDate       : null,
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
                    workflow        : "528ce7f2f3f67bc40b000023",
                    parent          : null,
                    sequence        : 0,
                    groups          : {
                        owner: "560c099da5d4a2e20ba5068b",
                        users: [],
                        group: []
                    },
                    whoCanRW        : "everyOne",
                    customer        : "56a9eeabd59a04d6225b0df5",
                    task            : [
                        "5717661c2c8b789c7a0bb82d",
                        "575ef1ee0fc96daf2a4787a3"
                    ],
                    projectShortDesc: "SDK",
                    __v             : 0,
                    EndDate         : "2016-06-13T17:48:30.698Z",
                    paymentTerms    : "55536e52475b7be475f335f6",
                    paymentMethod   : "565f2e05ab70d49024242e07",
                    name            : "360CamSDK"
                },
                editedBy  : {
                    user: {
                        _id            : "52203e707d4dba8813000003",
                        __v            : 0,
                        attachments    : [],
                        credentials    : {
                            access_token : "",
                            refresh_token: ""
                        },
                        email          : "info@thinkmobiles.com",
                        kanbanSettings : {
                            applications : {
                                countPerPage : 10,
                                foldWorkflows: [
                                    "Empty"
                                ]
                            },
                            opportunities: {
                                countPerPage: 10
                            },
                            tasks        : {
                                countPerPage : 10,
                                foldWorkflows: [
                                    "528ce3caf3f67bc40b000013",
                                    "528ce3acf3f67bc40b000012",
                                    "528ce30cf3f67bc40b00000f",
                                    "528ce35af3f67bc40b000010"
                                ]
                            }
                        },
                        lastAccess     : "2016-06-13T15:00:33.976Z",
                        login          : "admin",
                        pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                        profile        : 1387275598000,
                        imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        savedFilters   : [
                            {
                                _id      : "574335bb27725f815747d579",
                                viewType : "",
                                byDefault: "Leads"
                            },
                            {
                                _id      : "57556d58f07a2b38424e5f4c",
                                viewType : "",
                                byDefault: ""
                            },
                            {
                                _id      : "57557f08f07a2b38424e5f4d",
                                viewType : "",
                                byDefault: ""
                            }
                        ],
                        relatedEmployee: "55b92ad221e4b7c40f00004f"
                    },
                    date: "2016-06-13T17:48:30.698Z"
                },
                createdBy : {
                    user: {
                        _id            : "52203e707d4dba8813000003",
                        __v            : 0,
                        attachments    : [],
                        credentials    : {
                            access_token : "",
                            refresh_token: ""
                        },
                        email          : "info@thinkmobiles.com",
                        kanbanSettings : {
                            applications : {
                                countPerPage : 10,
                                foldWorkflows: [
                                    "Empty"
                                ]
                            },
                            opportunities: {
                                countPerPage: 10
                            },
                            tasks        : {
                                countPerPage : 10,
                                foldWorkflows: [
                                    "528ce3caf3f67bc40b000013",
                                    "528ce3acf3f67bc40b000012",
                                    "528ce30cf3f67bc40b00000f",
                                    "528ce35af3f67bc40b000010"
                                ]
                            }
                        },
                        lastAccess     : "2016-06-13T15:00:33.976Z",
                        login          : "admin",
                        pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                        profile        : 1387275598000,
                        imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        savedFilters   : [
                            {
                                _id      : "574335bb27725f815747d579",
                                viewType : "",
                                byDefault: "Leads"
                            },
                            {
                                _id      : "57556d58f07a2b38424e5f4c",
                                viewType : "",
                                byDefault: ""
                            },
                            {
                                _id      : "57557f08f07a2b38424e5f4d",
                                viewType : "",
                                byDefault: ""
                            }
                        ],
                        relatedEmployee: "55b92ad221e4b7c40f00004f"
                    },
                    date: "2016-06-13T17:48:30.698Z"
                },
                StartDate : "",
                EndDate   : "2016-06-13T17:48:30.698Z",
                logged    : null,
                tags      : [],
                progress  : 0,
                estimated : null,
                sequence  : 0,
                taskCount : 2
            },
            {
                _id       : "5717661c2c8b789c7a0bb82d",
                total     : 3,
                summary   : "Testing",
                type      : "Task",
                workflow  : {
                    _id         : "528ce35af3f67bc40b000010",
                    __v         : 0,
                    attachments : [],
                    color       : "#2C3E50",
                    name        : "Testing",
                    sequence    : 2,
                    status      : "In Progress",
                    wId         : "Tasks",
                    wName       : "task",
                    source      : "task",
                    targetSource: [
                        "task"
                    ],
                    visible     : true
                },
                assignedTo: {
                    _id            : "55b92ad221e4b7c40f000090",
                    dateBirth      : "1992-12-20T04:00:00.000Z",
                    ID             : 1105,
                    isLead         : 0,
                    fire           : [],
                    hire           : [
                        "2015-01-21T22:00:00.000Z"
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
                        date  : "2015-07-29T19:34:42.492Z",
                        reason: ""
                    },
                    attachments    : [],
                    editedBy       : {
                        date: "2016-05-27T06:35:42.431Z",
                        user: "55b8cb7d0ce4affc2a0015cb"
                    },
                    createdBy      : {
                        date: "2015-07-29T19:34:42.492Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate   : "2015-07-29T19:34:42.492Z",
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
                    age            : 23,
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
                    manager        : "55b92ad221e4b7c40f000030",
                    jobPosition    : "561b73fb9ebb48212ea838bf",
                    department     : "55bb1f40cb76ca630b000007",
                    visibility     : "Public",
                    relatedUser    : null,
                    officeLocation : "",
                    skype          : "sterr.gabriella",
                    workPhones     : {
                        phone : "",
                        mobile: "+380662662064"
                    },
                    personalEmail  : "sterr.gabriella@gmail.com",
                    workEmail      : "gabriella.shterr@thinkmobiles.com",
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
                        last : "Shterr",
                        first: "Gabriella"
                    },
                    subject        : "",
                    imageSrc       : "data:image/jpeg;base64,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",
                    isEmployee     : true,
                    __v            : 0,
                    transferred    : [
                        {
                            department: {
                                name: "Marketing",
                                _id : "55b92ace21e4b7c40f000013"
                            },
                            date      : "2015-09-28T12:17:45.141Z"
                        }
                    ],
                    transfer       : [
                        {
                            isDeveloper    : false,
                            date           : "2015-01-21T22:00:00.000Z",
                            info           : "",
                            salary         : 100,
                            jobType        : "Full-time",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f00004f",
                            jobPosition    : "55b92acf21e4b7c40f000025",
                            department     : "55b92ace21e4b7c40f000013",
                            status         : "hired"
                        },
                        {
                            isDeveloper    : false,
                            date           : "2015-08-30T21:00:00.000Z",
                            info           : "",
                            salary         : 200,
                            jobType        : "Full-time",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f00004f",
                            jobPosition    : "55b92acf21e4b7c40f000025",
                            department     : "55b92ace21e4b7c40f000013",
                            status         : "transfer"
                        },
                        {
                            isDeveloper    : false,
                            date           : "2015-08-31T21:00:00.000Z",
                            info           : "",
                            salary         : 200,
                            jobType        : "Full-time",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f000030",
                            jobPosition    : "561b73fb9ebb48212ea838bf",
                            department     : "55bb1f40cb76ca630b000007",
                            status         : "updated"
                        },
                        {
                            isDeveloper    : false,
                            date           : "2016-01-31T22:00:00.000Z",
                            info           : "",
                            salary         : 250,
                            jobType        : "Full-time",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f000030",
                            jobPosition    : "561b73fb9ebb48212ea838bf",
                            department     : "55bb1f40cb76ca630b000007",
                            status         : "updated"
                        },
                        {
                            isDeveloper    : false,
                            date           : "2016-04-30T21:00:00.000Z",
                            info           : "",
                            salary         : 300,
                            jobType        : "Full-time",
                            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
                            manager        : "55b92ad221e4b7c40f000030",
                            jobPosition    : "561b73fb9ebb48212ea838bf",
                            department     : "55bb1f40cb76ca630b000007",
                            status         : "updated"
                        }
                    ],
                    weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                },
                project   : {
                    _id             : "56e689c75ec71b00429745a9",
                    TargetEndDate   : "2016-03-31T00:00:00.000Z",
                    StartDate       : null,
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
                    workflow        : "528ce7f2f3f67bc40b000023",
                    parent          : null,
                    sequence        : 0,
                    groups          : {
                        owner: "560c099da5d4a2e20ba5068b",
                        users: [],
                        group: []
                    },
                    whoCanRW        : "everyOne",
                    customer        : "56a9eeabd59a04d6225b0df5",
                    task            : [
                        "5717661c2c8b789c7a0bb82d",
                        "575ef1ee0fc96daf2a4787a3"
                    ],
                    projectShortDesc: "SDK",
                    __v             : 0,
                    EndDate         : "2016-06-13T17:48:30.698Z",
                    paymentTerms    : "55536e52475b7be475f335f6",
                    paymentMethod   : "565f2e05ab70d49024242e07",
                    name            : "360CamSDK"
                },
                editedBy  : {
                    user: {
                        _id            : "563f673270bbc2b740ce89ae",
                        profile        : 1387275598000,
                        savedFilters   : [
                            {
                                _id      : "573dc01eaf2e939f7706d93e",
                                viewType : "",
                                byDefault: "Leads"
                            },
                            {
                                _id      : "574089fd51010f2757eed3a3",
                                viewType : "",
                                byDefault: ""
                            },
                            {
                                _id      : "57408a14bd80afa95681fd64",
                                viewType : "",
                                byDefault: "salesInvoice"
                            }
                        ],
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
                        pass           : "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                        email          : "info@thinkmobiles.com",
                        login          : "alex.sokhanych",
                        imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        __v            : 0,
                        lastAccess     : "2016-05-30T17:51:29.136Z",
                        relatedEmployee: null
                    },
                    date: "2016-05-19T09:08:39.443Z"
                },
                createdBy : {
                    user: {
                        _id            : "55b9fc0fd79a3a3439000008",
                        profile        : 1387275598000,
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
                        email          : "peter.voloshchuk@thinkmobiles.com",
                        login          : "peter.volosh",
                        imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                        __v            : 0,
                        lastAccess     : "2016-05-24T09:41:51.695Z",
                        savedFilters   : [
                            {
                                _id      : "574d8475e39a499b52ca80d4",
                                viewType : "",
                                byDefault: ""
                            },
                            {
                                _id      : "574d8497395dee7f52e348d0",
                                viewType : "",
                                byDefault: "Leads"
                            }
                        ],
                        relatedEmployee: null
                    },
                    date: "2016-04-20T11:21:00.114Z"
                },
                StartDate : "2016-04-05T22:00:00.000Z",
                EndDate   : "2016-04-06T06:00:00.000Z",
                logged    : 7,
                tags      : [
                    ""
                ],
                progress  : 88,
                estimated : 8,
                sequence  : 0,
                taskCount : 1
            }
        ]
    };
    var fakeTaskForm = {
        _id        : "56fcc88a956d5b400d39ea91",
        summary    : "Test",
        description: "",
        __v        : 0,
        editedBy   : {
            date: "2016-03-31T06:49:46.216Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v            : 0,
                attachments    : [],
                lastAccess     : "2016-03-31T06:00:20.887Z",
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
        attachments: [],
        notes      : [],
        createdBy  : {
            date: "2016-03-31T06:49:46.216Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v            : 0,
                attachments    : [],
                lastAccess     : "2016-03-31T06:00:20.887Z",
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
        progress   : 0,
        remaining  : 8,
        logged     : null,
        estimated  : 8,
        type       : "Task",
        workflow   : {
            _id         : "528ce0cdf3f67bc40b00000c",
            __v         : 0,
            attachments : [],
            name        : "New",
            sequence    : 5,
            status      : "New",
            wId         : "Tasks",
            wName       : "task",
            source      : "task",
            targetSource: [
                "task"
            ],
            visible     : true,
            color       : "#2C3E50"
        },
        duration   : 1,
        EndDate    : "2016-03-03T06:00:00.000Z",
        StartDate  : "2016-03-02T22:00:00.000Z",
        customer   : null,
        sequence   : 0,
        priority   : "P3",
        tags       : [
            ""
        ],
        assignedTo : {
            _id     : "55b92ad221e4b7c40f0000bd",
            name    : {
                last : "Vashkeba",
                first: "Michael"
            },
            imageSrc: "data:image/jpeg;base64,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",
            fullName: "Michael Vashkeba",
            id      : "55b92ad221e4b7c40f0000bd"
        },
        project    : {
            _id             : "562beda846bca6e4591f4930",
            projectName     : "TreatMe",
            projectShortDesc: "Uber-like app"
        },
        taskCount  : 1
    };
    var fakeEmployee = {
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
                name    : {
                    last : "Voloshchuk",
                    first: "Peter"
                },
                fullName: "Peter Voloshchuk",
                id      : "55b92ad221e4b7c40f00005f"
            },
            {
                _id     : "55e549309624477a0b000005",
                name    : {
                    last : "Rospopa",
                    first: "Petro"
                },
                fullName: "Petro Rospopa",
                id      : "55e549309624477a0b000005"
            },
            {
                _id     : "56cc7ad8541812c071973579",
                name    : {
                    last : "Tesliuk",
                    first: "Petro"
                },
                fullName: "Petro Tesliuk",
                id      : "56cc7ad8541812c071973579"
            },
            {
                _id     : "56a78c75aa157ca50f21fb24",
                name    : {
                    last : "Iyber",
                    first: "Renata"
                },
                fullName: "Renata Iyber",
                id      : "56a78c75aa157ca50f21fb24"
            },
            {
                _id     : "55b92ad221e4b7c40f000051",
                name    : {
                    last : "Mozes",
                    first: "Richard"
                },
                fullName: "Richard Mozes",
                id      : "55b92ad221e4b7c40f000051"
            },
            {
                _id     : "56e298ab5def9136621b7803",
                name    : {
                    last : "Shinkovych",
                    first: "Rikhard"
                },
                fullName: "Rikhard Shinkovych",
                id      : "56e298ab5def9136621b7803"
            },
            {
                _id     : "55b92ad221e4b7c40f00007a",
                name    : {
                    last : "Fogash",
                    first: "Robert"
                },
                fullName: "Robert Fogash",
                id      : "55b92ad221e4b7c40f00007a"
            },
            {
                _id     : "56e6b7d7977124d34db5829c",
                name    : {
                    last : "Bachynska",
                    first: "Roksana"
                },
                fullName: "Roksana Bachynska",
                id      : "56e6b7d7977124d34db5829c"
            },
            {
                _id     : "55b92ad221e4b7c40f00004b",
                name    : {
                    last : "Katona",
                    first: "Roland"
                },
                fullName: "Roland Katona",
                id      : "55b92ad221e4b7c40f00004b"
            },
            {
                _id     : "55b92ad221e4b7c40f000038",
                name    : {
                    last : "Babunich",
                    first: "Roman"
                },
                fullName: "Roman Babunich",
                id      : "55b92ad221e4b7c40f000038"
            },
            {
                _id     : "55b92ad221e4b7c40f000060",
                name    : {
                    last : "Buchuk",
                    first: "Roman"
                },
                fullName: "Roman Buchuk",
                id      : "55b92ad221e4b7c40f000060"
            },
            {
                _id     : "55b92ad221e4b7c40f00007b",
                name    : {
                    last : "Guti",
                    first: "Roman"
                },
                fullName: "Roman Guti",
                id      : "55b92ad221e4b7c40f00007b"
            },
            {
                _id     : "55b92ad221e4b7c40f000086",
                name    : {
                    last : "Kubichka",
                    first: "Roman"
                },
                fullName: "Roman Kubichka",
                id      : "55b92ad221e4b7c40f000086"
            },
            {
                _id     : "55b92ad221e4b7c40f0000b0",
                name    : {
                    last : "Donchenko",
                    first: "Roman"
                },
                fullName: "Roman Donchenko",
                id      : "55b92ad221e4b7c40f0000b0"
            },
            {
                _id     : "55dd73d1f09cc2ec0b000008",
                name    : {
                    last : "Vizenko",
                    first: "Roman"
                },
                fullName: "Roman Vizenko",
                id      : "55dd73d1f09cc2ec0b000008"
            },
            {
                _id     : "55eef3fd6dceaee10b000020",
                name    : {
                    last : "Saldan",
                    first: "Roman"
                },
                fullName: "Roman Saldan",
                id      : "55eef3fd6dceaee10b000020"
            },
            {
                _id     : "5667f43da3fc012a68f0d5f6",
                name    : {
                    last : "Katsala",
                    first: "Roman"
                },
                fullName: "Roman Katsala",
                id      : "5667f43da3fc012a68f0d5f6"
            },
            {
                _id     : "568bbdfd5827e3b24d8123a7",
                name    : {
                    last : "Chaban",
                    first: "Roman"
                },
                fullName: "Roman Chaban",
                id      : "568bbdfd5827e3b24d8123a7"
            },
            {
                _id     : "568cd341b2bcba971ba6f5c4",
                name    : {
                    last : "Rosul",
                    first: "Roman"
                },
                fullName: "Roman Rosul",
                id      : "568cd341b2bcba971ba6f5c4"
            },
            {
                _id     : "568cd4c0b2bcba971ba6f5c5",
                name    : {
                    last : "Osadchuk",
                    first: "Roman"
                },
                fullName: "Roman Osadchuk",
                id      : "568cd4c0b2bcba971ba6f5c5"
            },
            {
                _id     : "569e3a73044ae38173244cfb",
                name    : {
                    last : "Martyniuk",
                    first: "Roman"
                },
                fullName: "Roman Martyniuk",
                id      : "569e3a73044ae38173244cfb"
            },
            {
                _id     : "56d5a0c45132d292750a5e7e",
                name    : {
                    last : "Ukrainskiy",
                    first: "Rostyslav"
                },
                fullName: "Rostyslav Ukrainskiy",
                id      : "56d5a0c45132d292750a5e7e"
            },
            {
                _id     : "55b92ad221e4b7c40f000056",
                name    : {
                    last : "Labjak",
                    first: "Ruslan"
                },
                fullName: "Ruslan Labjak",
                id      : "55b92ad221e4b7c40f000056"
            },
            {
                _id     : "55b92ad221e4b7c40f000097",
                name    : {
                    last : "Abylgazinov",
                    first: "Samgash"
                },
                fullName: "Samgash Abylgazinov",
                id      : "55b92ad221e4b7c40f000097"
            },
            {
                _id     : "568cdd375527d6691cb68b22",
                name    : {
                    last : "Melnik",
                    first: "Sergey"
                },
                fullName: "Sergey Melnik",
                id      : "568cdd375527d6691cb68b22"
            },
            {
                _id     : "55b92ad221e4b7c40f000064",
                name    : {
                    last : "Tilishevsky",
                    first: "Sergiy"
                },
                fullName: "Sergiy Tilishevsky",
                id      : "55b92ad221e4b7c40f000064"
            },
            {
                _id     : "55b92ad221e4b7c40f00007c",
                name    : {
                    last : "Sheba",
                    first: "Sergiy"
                },
                fullName: "Sergiy Sheba",
                id      : "55b92ad221e4b7c40f00007c"
            },
            {
                _id     : "55b92ad221e4b7c40f0000a1",
                name    : {
                    last : "Stepaniuk",
                    first: "Sergiy"
                },
                fullName: "Sergiy Stepaniuk",
                id      : "55b92ad221e4b7c40f0000a1"
            },
            {
                _id     : "55d1a2b18f61e2c90b000023",
                name    : {
                    last : "Degtyar",
                    first: "Sergiy"
                },
                fullName: "Sergiy Degtyar",
                id      : "55d1a2b18f61e2c90b000023"
            },
            {
                _id     : "55dd63f8f09cc2ec0b000006",
                name    : {
                    last : "Ihnatko",
                    first: "Sergiy"
                },
                fullName: "Sergiy Ihnatko",
                id      : "55dd63f8f09cc2ec0b000006"
            },
            {
                _id     : "5649b8ccad4bc9e53f1f6192",
                name    : {
                    last : "Gevelev",
                    first: "Sergiy"
                },
                fullName: "Sergiy Gevelev",
                id      : "5649b8ccad4bc9e53f1f6192"
            },
            {
                _id     : "5652dd95c4d12cf51e7f7e0b",
                name    : {
                    last : "Petakh",
                    first: "Sergiy"
                },
                fullName: "Sergiy Petakh",
                id      : "5652dd95c4d12cf51e7f7e0b"
            },
            {
                _id     : "56e17848f625de2a2f9cacd1",
                name    : {
                    last : "Biloborodov",
                    first: "Sergiy"
                },
                fullName: "Sergiy Biloborodov",
                id      : "56e17848f625de2a2f9cacd1"
            },
            {
                _id     : "55b92ad221e4b7c40f00004c",
                name    : {
                    last : "Nayda",
                    first: "Sofia"
                },
                fullName: "Sofia Nayda",
                id      : "55b92ad221e4b7c40f00004c"
            },
            {
                _id     : "56d823e78230197c0e089038",
                name    : {
                    last : "Marenych",
                    first: "Sofiya"
                },
                fullName: "Sofiya Marenych",
                id      : "56d823e78230197c0e089038"
            },
            {
                _id     : "561b756f9ebb48212ea838c0",
                name    : {
                    last : "Romanyuk",
                    first: "Stanislav"
                },
                fullName: "Stanislav Romanyuk",
                id      : "561b756f9ebb48212ea838c0"
            },
            {
                _id     : "55b92ad221e4b7c40f000039",
                name    : {
                    last : "Rikun",
                    first: "Stas"
                },
                fullName: "Stas Rikun",
                id      : "55b92ad221e4b7c40f000039"
            },
            {
                _id     : "55b92ad221e4b7c40f00007d",
                name    : {
                    last : "Volskiy",
                    first: "Stas"
                },
                fullName: "Stas Volskiy",
                id      : "55b92ad221e4b7c40f00007d"
            },
            {
                _id     : "55b92ad221e4b7c40f0000ad",
                name    : {
                    last : "Krovspey",
                    first: "Stepan"
                },
                fullName: "Stepan Krovspey",
                id      : "55b92ad221e4b7c40f0000ad"
            },
            {
                _id     : "55b92ad221e4b7c40f00008d",
                name    : {
                    last : "Kira",
                    first: "Svitlana"
                },
                fullName: "Svitlana Kira",
                id      : "55b92ad221e4b7c40f00008d"
            },
            {
                _id     : "55b92ad221e4b7c40f0000ae",
                name    : {
                    last : "Dolottseva",
                    first: "Tamara"
                },
                fullName: "Tamara Dolottseva",
                id      : "55b92ad221e4b7c40f0000ae"
            },
            {
                _id     : "55b92ad221e4b7c40f000061",
                name    : {
                    last : "Mondok",
                    first: "Tamas"
                },
                fullName: "Tamas Mondok",
                id      : "55b92ad221e4b7c40f000061"
            },
            {
                _id     : "55b92ad221e4b7c40f000050",
                name    : {
                    last : "Holovatska",
                    first: "Tamila"
                },
                fullName: "Tamila Holovatska",
                id      : "55b92ad221e4b7c40f000050"
            },
            {
                _id     : "55b92ad221e4b7c40f00007e",
                name    : {
                    last : "Zmiy",
                    first: "Taras"
                },
                fullName: "Taras Zmiy",
                id      : "55b92ad221e4b7c40f00007e"
            },
            {
                _id     : "564a02e0ad4bc9e53f1f6194",
                name    : {
                    last : "Dvorian",
                    first: "Taras"
                },
                fullName: "Taras Dvorian",
                id      : "564a02e0ad4bc9e53f1f6194"
            },
            {
                _id     : "56813fe29cceae182b907755",
                name    : {
                    last : "Ukrainskiy",
                    first: "Taras"
                },
                fullName: "Taras Ukrainskiy",
                id      : "56813fe29cceae182b907755"
            },
            {
                _id     : "56d9497dae35cc4f0e721074",
                name    : {
                    last : "TESTING",
                    first: "Test"
                },
                fullName: "Test TESTING",
                id      : "56d9497dae35cc4f0e721074"
            },
            {
                _id     : "56cf0928541812c071973593",
                name    : {
                    last : "Shepitko",
                    first: "Tetiana"
                },
                fullName: "Tetiana Shepitko",
                id      : "56cf0928541812c071973593"
            },
            {
                _id     : "55b92ad221e4b7c40f000099",
                name    : {
                    last : "Smertina",
                    first: "Tetyana"
                },
                fullName: "Tetyana Smertina",
                id      : "55b92ad221e4b7c40f000099"
            },
            {
                _id     : "55c98df0cbb0f4910b000007",
                name    : {
                    last : "Berezhnoi",
                    first: "Timur"
                },
                fullName: "Timur Berezhnoi",
                id      : "55c98df0cbb0f4910b000007"
            },
            {
                _id     : "55b92ad221e4b7c40f00006a",
                name    : {
                    last : "Tsipf",
                    first: "Vadim"
                },
                fullName: "Vadim Tsipf",
                id      : "55b92ad221e4b7c40f00006a"
            },
            {
                _id     : "56011186536bd29228000005",
                name    : {
                    last : "Khruslov",
                    first: "Valentyn"
                },
                fullName: "Valentyn Khruslov",
                id      : "56011186536bd29228000005"
            },
            {
                _id     : "561bb5329ebb48212ea838c6",
                name    : {
                    last : "Ladomiryak",
                    first: "Valerii"
                },
                fullName: "Valerii Ladomiryak",
                id      : "561bb5329ebb48212ea838c6"
            },
            {
                _id     : "55b92ad221e4b7c40f0000af",
                name    : {
                    last : "Tokareva",
                    first: "Valeriya"
                },
                fullName: "Valeriya Tokareva",
                id      : "55b92ad221e4b7c40f0000af"
            },
            {
                _id     : "55b92ad221e4b7c40f00007f",
                name    : {
                    last : "Klimchenko",
                    first: "Vasilisa"
                },
                fullName: "Vasilisa Klimchenko",
                id      : "55b92ad221e4b7c40f00007f"
            },
            {
                _id     : "55b92ad221e4b7c40f00003a",
                name    : {
                    last : "Agosta",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Agosta",
                id      : "55b92ad221e4b7c40f00003a"
            },
            {
                _id     : "55b92ad221e4b7c40f000040",
                name    : {
                    last : "Almashiy",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Almashiy",
                id      : "55b92ad221e4b7c40f000040"
            },
            {
                _id     : "55b92ad221e4b7c40f000053",
                name    : {
                    last : "Seredniy",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Seredniy",
                id      : "55b92ad221e4b7c40f000053"
            },
            {
                _id     : "55b92ad221e4b7c40f000062",
                name    : {
                    last : "Cheypesh",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Cheypesh",
                id      : "55b92ad221e4b7c40f000062"
            },
            {
                _id     : "55b92ad221e4b7c40f000080",
                name    : {
                    last : "Barchiy",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Barchiy",
                id      : "55b92ad221e4b7c40f000080"
            },
            {
                _id     : "55b92ad221e4b7c40f000093",
                name    : {
                    last : "Lupchey",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Lupchey",
                id      : "55b92ad221e4b7c40f000093"
            },
            {
                _id     : "55b92ad221e4b7c40f0000b4",
                name    : {
                    last : "Prokopyshyn",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Prokopyshyn",
                id      : "55b92ad221e4b7c40f0000b4"
            },
            {
                _id     : "55d1d860dda01e250c000010",
                name    : {
                    last : "Hoshovsky",
                    first: "Vasiliy"
                },
                fullName: "Vasiliy Hoshovsky",
                id      : "55d1d860dda01e250c000010"
            },
            {
                _id     : "55b92ad221e4b7c40f000088",
                name    : {
                    last : "Buchok",
                    first: "Viktor"
                },
                fullName: "Viktor Buchok",
                id      : "55b92ad221e4b7c40f000088"
            },
            {
                _id     : "55b92ad221e4b7c40f000091",
                name    : {
                    last : "Kiver",
                    first: "Viktor"
                },
                fullName: "Viktor Kiver",
                id      : "55b92ad221e4b7c40f000091"
            },
            {
                _id     : "55f9298456f79c9c0c000006",
                name    : {
                    last : "Manhur",
                    first: "Viktor"
                },
                fullName: "Viktor Manhur",
                id      : "55f9298456f79c9c0c000006"
            },
            {
                _id     : "56c2f2a7dfd8a81466e2f71f",
                name    : {
                    last : "Mateleshka",
                    first: "Viktor"
                },
                fullName: "Viktor Mateleshka",
                id      : "56c2f2a7dfd8a81466e2f71f"
            },
            {
                _id     : "5626278d750d38934bfa1313",
                name    : {
                    last : "Rogachenko",
                    first: "Viktoria"
                },
                fullName: "Viktoria Rogachenko",
                id      : "5626278d750d38934bfa1313"
            },
            {
                _id     : "5637710e5d23a8eb04e80aed",
                name    : {
                    last : "Kovalenko",
                    first: "Viktoria"
                },
                fullName: "Viktoria Kovalenko",
                id      : "5637710e5d23a8eb04e80aed"
            },
            {
                _id     : "55b92ad221e4b7c40f00003b",
                name    : {
                    last : "Bizilya",
                    first: "Vitaliy"
                },
                fullName: "Vitaliy Bizilya",
                id      : "55b92ad221e4b7c40f00003b"
            },
            {
                _id     : "55b92ad221e4b7c40f00004e",
                name    : {
                    last : "Shuba",
                    first: "Vitaliy"
                },
                fullName: "Vitaliy Shuba",
                id      : "55b92ad221e4b7c40f00004e"
            },
            {
                _id     : "55b92ad221e4b7c40f000081",
                name    : {
                    last : "Sokhanych",
                    first: "Vitaliy"
                },
                fullName: "Vitaliy Sokhanych",
                id      : "55b92ad221e4b7c40f000081"
            },
            {
                _id     : "55b92ad221e4b7c40f000052",
                name    : {
                    last : "Gerasimenko",
                    first: "Vladimir"
                },
                fullName: "Vladimir Gerasimenko",
                id      : "55b92ad221e4b7c40f000052"
            },
            {
                _id     : "561bb1269ebb48212ea838c5",
                name    : {
                    last : "Pogorilyak",
                    first: "Vladimir"
                },
                fullName: "Vladimir Pogorilyak",
                id      : "561bb1269ebb48212ea838c5"
            },
            {
                _id     : "55eeed546dceaee10b00001e",
                name    : {
                    last : "Turytskyi",
                    first: "Vladyslav"
                },
                fullName: "Vladyslav Turytskyi",
                id      : "55eeed546dceaee10b00001e"
            },
            {
                _id     : "568bbf935827e3b24d8123a8",
                name    : {
                    last : "Hamalii",
                    first: "Vladyslav"
                },
                fullName: "Vladyslav Hamalii",
                id      : "568bbf935827e3b24d8123a8"
            },
            {
                _id     : "55eee9c26dceaee10b00001d",
                name    : {
                    last : "Stepanchuk",
                    first: "Volodymyr"
                },
                fullName: "Volodymyr Stepanchuk",
                id      : "55eee9c26dceaee10b00001d"
            },
            {
                _id     : "55b92ad221e4b7c40f00004d",
                name    : {
                    last : "Kopinets",
                    first: "Vyacheslav"
                },
                fullName: "Vyacheslav Kopinets",
                id      : "55b92ad221e4b7c40f00004d"
            },
            {
                _id     : "55b92ad221e4b7c40f000063",
                name    : {
                    last : "Gusti",
                    first: "Yana"
                },
                fullName: "Yana Gusti",
                id      : "55b92ad221e4b7c40f000063"
            },
            {
                _id     : "55b92ad221e4b7c40f0000ca",
                name    : {
                    last : "Vengerova",
                    first: "Yana"
                },
                fullName: "Yana Vengerova",
                id      : "55b92ad221e4b7c40f0000ca"
            },
            {
                _id     : "55f7c20a6d43203d0c000005",
                name    : {
                    last : "Samaryk",
                    first: "Yana"
                },
                fullName: "Yana Samaryk",
                id      : "55f7c20a6d43203d0c000005"
            },
            {
                _id     : "5602a01550de7f4138000008",
                name    : {
                    last : "Dufynets",
                    first: "Yana"
                },
                fullName: "Yana Dufynets",
                id      : "5602a01550de7f4138000008"
            },
            {
                _id     : "55b92ad221e4b7c40f000082",
                name    : {
                    last : "Fuchko",
                    first: "Yaroslav"
                },
                fullName: "Yaroslav Fuchko",
                id      : "55b92ad221e4b7c40f000082"
            },
            {
                _id     : "55b92ad221e4b7c40f0000cf",
                name    : {
                    last : "Denysiuk",
                    first: "Yaroslav"
                },
                fullName: "Yaroslav Denysiuk",
                id      : "55b92ad221e4b7c40f0000cf"
            },
            {
                _id     : "568bc0b55827e3b24d8123a9",
                name    : {
                    last : "Syrota",
                    first: "Yaroslav"
                },
                fullName: "Yaroslav Syrota",
                id      : "568bc0b55827e3b24d8123a9"
            },
            {
                _id     : "56014cc8536bd29228000007",
                name    : {
                    last : "Bezyk",
                    first: "Yevgenia"
                },
                fullName: "Yevgenia Bezyk",
                id      : "56014cc8536bd29228000007"
            },
            {
                _id     : "56e2e83a74ac46664a83e94b",
                name    : {
                    last : "Melnyk",
                    first: "Yevgenia"
                },
                fullName: "Yevgenia Melnyk",
                id      : "56e2e83a74ac46664a83e94b"
            },
            {
                _id     : "55ed5a437221afe30b000006",
                name    : {
                    last : "Porokhnitska",
                    first: "Yulia"
                },
                fullName: "Yulia Porokhnitska",
                id      : "55ed5a437221afe30b000006"
            },
            {
                _id     : "55b92ad221e4b7c40f000054",
                name    : {
                    last : "Derevenko",
                    first: "Yuriy"
                },
                fullName: "Yuriy Derevenko",
                id      : "55b92ad221e4b7c40f000054"
            },
            {
                _id     : "55b92ad221e4b7c40f000065",
                name    : {
                    last : "Sirko",
                    first: "Yuriy"
                },
                fullName: "Yuriy Sirko",
                id      : "55b92ad221e4b7c40f000065"
            },
            {
                _id     : "55b92ad221e4b7c40f00008f",
                name    : {
                    last : "Holovatskyi",
                    first: "Yuriy"
                },
                fullName: "Yuriy Holovatskyi",
                id      : "55b92ad221e4b7c40f00008f"
            },
            {
                _id     : "55b92ad221e4b7c40f00009d",
                name    : {
                    last : "Fedynec",
                    first: "Yuriy"
                },
                fullName: "Yuriy Fedynec",
                id      : "55b92ad221e4b7c40f00009d"
            },
            {
                _id     : "55f7c3736d43203d0c000006",
                name    : {
                    last : "Bodak",
                    first: "Yuriy"
                },
                fullName: "Yuriy Bodak",
                id      : "55f7c3736d43203d0c000006"
            },
            {
                _id     : "56090d77066d979a33000009",
                name    : {
                    last : "Bysaha",
                    first: "Yuriy"
                },
                fullName: "Yuriy Bysaha",
                id      : "56090d77066d979a33000009"
            }
        ]
    };
    var fakeTasksForKanban = {
        workflowId: "528ce0cdf3f67bc40b00000c",
        remaining : 0,
        data      : [
            {
                _id       : "575ef1ee0fc96daf2a4787a3",
                summary   : "Test1",
                editedBy  : {
                    date: "2016-06-13T17:48:30.698Z"
                },
                remaining : 0,
                type      : "Task",
                workflow  : "528ce0cdf3f67bc40b00000c",
                sequence  : 0,
                priority  : "P3",
                assignedTo: {
                    _id     : "55b92ad221e4b7c40f000030",
                    name    : {
                        last : "Svatuk",
                        first: "Alex"
                    },
                    fullName: "Alex Svatuk",
                    id      : "55b92ad221e4b7c40f000030"
                },
                project   : {
                    _id             : "56e689c75ec71b00429745a9",
                    projectShortDesc: "SDK"
                },
                taskCount : 2
            },
            {
                _id       : "575ef20a0fc96daf2a4787a4",
                summary   : "Test_task1",
                editedBy  : {
                    date: "2016-06-13T17:48:58.543Z"
                },
                remaining : 0,
                type      : "Task",
                workflow  : "528ce0cdf3f67bc40b00000c",
                sequence  : 0,
                priority  : "P3",
                assignedTo: {
                    _id     : "55b92ad221e4b7c40f000030",
                    name    : {
                        last : "Svatuk",
                        first: "Alex"
                    },
                    fullName: "Alex Svatuk",
                    id      : "55b92ad221e4b7c40f000030"
                },
                project   : {
                    _id             : "571a079eb629a41976c9ac96",
                    projectShortDesc: "Peter Hickey"
                },
                taskCount : 1
            }
        ],
        total     : 2,
        time      : 167,
        fold      : false
    };
    var fakeProjectById = {
        _id             : "55cdc96d9b42266a4f000006",
        TargetEndDate: "2015-08-17T22:00:00.000Z",
        StartDate    : "2015-08-10T09:10:39.394Z",
        __v          : 0,
        description  : "",
        EndDate      : "2015-08-28T09:10:38.966Z",
        salesManagers: [
            {
                manager: "55b92ad221e4b7c40f00004b",
                _id    : "5707533ecbb17f48214c7707",
                date   : "2015-08-10T12:27:34.823Z"
            }
        ],
        budget       : {
            projectTeam: [
                {
                    _id      : "564cfdd06584412e618421da",
                    __v      : 0,
                    payments : [
                        "5661c681f13e46fd14533ef8"
                    ],
                    createdBy: {
                        date: "2015-08-14T10:59:06.974Z",
                        user: null
                    },
                    editedBy : {
                        date: "2015-11-30T14:46:59.954Z",
                        user: "55bf144765cda0810b000005"
                    },
                    invoice  : "5661c5e3f13e46fd14533ec7",
                    quotation: "5661c5caf13e46fd14533ec6",
                    budget   : {
                        budgetTotal  : {
                            profitSum  : 2755.75,
                            costSum    : 300.25,
                            revenueSum : 3056,
                            hoursSum   : 170,
                            revenueByQA: 0,
                            hoursByQA  : 0,
                            maxDate    : 201535,
                            minDate    : 201533
                        },
                        budget       : [
                            {
                                revenue: 719.06,
                                hours  : 40,
                                cost   : 300.25,
                                profit : 418.81
                            },
                            {
                                revenue: 179.76,
                                hours  : 10,
                                cost   : 0,
                                profit : 179.76
                            },
                            {
                                revenue: 719.06,
                                hours  : 40,
                                cost   : 0,
                                profit : 719.06
                            },
                            {
                                revenue: 1438.12,
                                hours  : 80,
                                cost   : 0,
                                profit : 1438.12
                            }
                        ],
                        projectValues: [],
                        projectTeam  : [
                            {
                                _id        : "55b92ad221e4b7c40f00004d",
                                jobPosition: {
                                    _id : "55b92acf21e4b7c40f00001c",
                                    name: "Middle JS"
                                },
                                department : {
                                    _id           : "55b92ace21e4b7c40f000016",
                                    departmentName: "Web"
                                },
                                name       : {
                                    last : "Kopinets",
                                    first: "Vyacheslav"
                                }
                            },
                            {
                                _id        : "55b92ad221e4b7c40f0000a0",
                                jobPosition: {
                                    _id : "561b75f89ebb48212ea838c1",
                                    name: "PM"
                                },
                                department : {
                                    _id           : "55bb1f40cb76ca630b000007",
                                    departmentName: "PM"
                                },
                                name       : {
                                    last : "Bilak",
                                    first: "Ivan"
                                }
                            },
                            {
                                _id        : "55b92ad221e4b7c40f0000b7",
                                jobPosition: {
                                    _id : "55b92acf21e4b7c40f00002c",
                                    name: "Junior iOS"
                                },
                                department : {
                                    _id           : "55b92ace21e4b7c40f00000f",
                                    departmentName: "iOS"
                                },
                                name       : {
                                    last : "Polovka",
                                    first: "Myroslava"
                                }
                            },
                            {
                                _id        : "55c98b86cbb0f4910b000006",
                                jobPosition: {
                                    _id : "55b92acf21e4b7c40f000021",
                                    name: "Junior Android"
                                },
                                department : {
                                    _id           : "55b92ace21e4b7c40f000010",
                                    departmentName: "Android"
                                },
                                name       : {
                                    last : "Kovalenko",
                                    first: "Ivan"
                                }
                            }
                        ]
                    },
                    project  : "55cdc96d9b42266a4f000006",
                    wTracks  : [
                        "566ee6508453e8b464b70b76",
                        "55cdca3a9b42266a4f000009",
                        "55cdcbc29b42266a4f00000a",
                        "55cdca199b42266a4f000008",
                        "55cdc9fa9b42266a4f000007"
                    ],
                    type     : "Invoiced",
                    workflow : "56337c675d49d8d6537832ea",
                    name     : "65"
                }
            ],
            bonus      : []
        },
        bonus        : [],
        health       : 1,
        editedBy     : {
            date: "2015-12-04T16:59:53.625Z",
            user: {
                _id  : "55bf144765cda0810b000005",
                login: "yana.gusti"
            }
        },
        attachments  : [],
        notes        : [],
        projecttype  : "",
        createdBy    : {
            date: "2015-08-14T10:56:45.871Z",
            user: {
                _id  : "55b9dd237a3632120b000005",
                login: "roland.katona"
            }
        },
        progress     : 0,
        remaining    : 0,
        logged       : 0,
        estimated    : 0,
        workflow     : {
            _id : "528ce82df3f67bc40b000025",
            name: "Closed"
        },
        parent       : null,
        sequence     : 0,
        groups       : {
            group: [],
            users: [],
            owner: {
                _id  : "55ba28c8d79a3a3439000016",
                login: "AndrianaLemko"
            }
        },
        whoCanRW     : "everyOne",
        projectmanager: {
            _id     : "55b92ad221e4b7c40f00004b",
            name: {
                last : "Katona",
                first: "Roland"
            },
            fullName: "Roland Katona",
            id      : "55b92ad221e4b7c40f00004b"
        },
        customer      : {
            _id     : "55cdc93c9b42266a4f000005",
            name: {
                last : "",
                first: "AgileFind"
            },
            fullName: "AgileFind ",
            id      : "55cdc93c9b42266a4f000005"
        },
        task          : [
            "56dfd3e78c59375e055e0cc2"
        ],
        projectName   : "Absolute Vodka",
        projectShortDesc: "Absolute Vodka"
    };
    var fakeTaskStages = {
        data: [
            {
                _id         : "528ce0cdf3f67bc40b00000c",
                __v: 0,
                attachments: [],
                name       : "New",
                sequence   : 5,
                status     : "New",
                wId        : "Tasks",
                wName      : "task",
                source     : "task",
                targetSource: [
                    "task"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce131f3f67bc40b00000d",
                __v: 0,
                attachments: [],
                name       : "In Progress",
                sequence   : 4,
                status     : "In Progress",
                wId        : "Tasks",
                wName      : "task",
                source     : "task",
                targetSource: [
                    "task"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce30cf3f67bc40b00000f",
                __v: 0,
                attachments: [],
                name       : "Fixed",
                sequence   : 3,
                status     : "In Progress",
                wId        : "Tasks",
                wName      : "task",
                source     : "task",
                targetSource: [
                    "task"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce35af3f67bc40b000010",
                __v: 0,
                attachments: [],
                name       : "Testing",
                sequence   : 2,
                status     : "In Progress",
                wId        : "Tasks",
                wName      : "task",
                source     : "task",
                targetSource: [
                    "task"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce3acf3f67bc40b000012",
                __v: 0,
                attachments: [],
                name       : "Done",
                sequence   : 1,
                status     : "Done",
                wId        : "Tasks",
                wName      : "task",
                source     : "task",
                targetSource: [
                    "task"
                ],
                visible     : true,
                color       : "#2C3E50"
            },
            {
                _id         : "528ce3caf3f67bc40b000013",
                __v: 0,
                attachments: [],
                name       : "Cancelled",
                sequence   : 0,
                status     : "Cancelled",
                wId        : "Tasks",
                wName      : "task",
                source     : "task",
                targetSource: [
                    "task"
                ],
                visible     : true,
                color       : "#2C3E50"
            }
        ]
    };
    var fakeCurrentUser = {
        user        : {
            _id            : "52203e707d4dba8813000003",
            attachments: [],
            lastAccess : "2016-04-26T05:58:49.347Z",
            profile    : {
                _id        : 1387275598000,
                profileName: "admin"
            },
            relatedEmployee: {
                _id     : "55b92ad221e4b7c40f00004f",
                name: {
                    last : "Sokhanych",
                    first: "Alex"
                },
                imageSrc: "data:image/jpeg;base64,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",
                fullName: "Alex Sokhanych",
                id      : "55b92ad221e4b7c40f00004f"
            },
            savedFilters   : [
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
                    _id      : null,
                    viewType: "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType: "",
                    byDefault: "salesInvoice"
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
                    _id      : {
                        _id        : "562b83ccb4677e225aa31df6",
                        filter: {
                            PM: {
                                department: {
                                    key  : "department._id",
                                    value: [
                                        "55bb1f40cb76ca630b000007"
                                    ]
                                }
                            }
                        },
                        contentView: "Employees",
                        __v        : 0
                    },
                    viewType: "",
                    byDefault: ""
                },
                {
                    _id      : {
                        _id        : "564dd4ce9fb8bc3f2195662c",
                        filter: {
                            dfghj: {
                                name    : {
                                    key  : "_id",
                                    value: [
                                        "55b92ad621e4b7c40f000635",
                                        "55b92ad621e4b7c40f000637",
                                        "55b92ad621e4b7c40f00062d",
                                        "55d37aee226ed3280b000005",
                                        "55b92ad621e4b7c40f00064a",
                                        "55b92ad621e4b7c40f00065e",
                                        "55b92ad621e4b7c40f000636",
                                        "55b92ad621e4b7c40f000649",
                                        "55b92ad621e4b7c40f00063c",
                                        "55ba0479d79a3a3439000010",
                                        "55ba0701d79a3a3439000012",
                                        "55b92ad521e4b7c40f00061c",
                                        "55b92ad621e4b7c40f00062b",
                                        "55b92ad521e4b7c40f000612",
                                        "55b92ad521e4b7c40f000619",
                                        "55b9fa60d79a3a3439000005",
                                        "55b92ad621e4b7c40f000658",
                                        "55b92ad521e4b7c40f000613",
                                        "55b92ad521e4b7c40f000621",
                                        "55b92ad621e4b7c40f000640",
                                        "55b92ad621e4b7c40f000659",
                                        "55b92ad521e4b7c40f00061f",
                                        "55b92ad621e4b7c40f00064c",
                                        "55b9ff67d79a3a343900000a",
                                        "55b92ad621e4b7c40f00064e",
                                        "55b92ad621e4b7c40f000626",
                                        "55b92ad521e4b7c40f00060f",
                                        "55b92ad621e4b7c40f000656",
                                        "55b92ad621e4b7c40f00065a",
                                        "55b92ad521e4b7c40f000614",
                                        "55b92ad521e4b7c40f000616",
                                        "55b92ad621e4b7c40f00064b",
                                        "55b92ad521e4b7c40f000620",
                                        "55b92ad621e4b7c40f000631",
                                        "55b92ad621e4b7c40f000655",
                                        "55b92ad621e4b7c40f000625",
                                        "55b92ad621e4b7c40f000632",
                                        "55b92ad621e4b7c40f000644",
                                        "55b92ad621e4b7c40f000654",
                                        "55b92ad621e4b7c40f00062c"
                                    ]
                                },
                                country: {
                                    key  : "address.country",
                                    value: [
                                        "Australia",
                                        "Israel",
                                        "Singapore",
                                        "Spain",
                                        "US",
                                        "USA",
                                        "USA/Germany",
                                        "United States"
                                    ]
                                },
                                services: {
                                    key  : "services",
                                    value: [
                                        "isCustomer",
                                        "isSupplier"
                                    ]
                                }
                            }
                        },
                        contentView: "Persons",
                        __v        : 0
                    },
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
                    _id      : null,
                    viewType: "",
                    byDefault: "Projects"
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
                    _id      : {
                        _id        : "56dfe8e56e2877d85455a6bb",
                        filter: {
                            initial: {
                                workflow: {
                                    key  : "workflow._id",
                                    value: [
                                        "528ce779f3f67bc40b00001f"
                                    ],
                                    type : null
                                }
                            }
                        },
                        contentView: "Leads",
                        __v        : 0
                    },
                    viewType: "",
                    byDefault: "Leads"
                },
                {
                    _id      : {
                        _id        : "56f3d039c1785edc507e81ea",
                        filter: {
                            ggggg: {
                                source: {
                                    key  : "source",
                                    value: [
                                        "victor"
                                    ],
                                    type : null
                                }
                            }
                        },
                        contentView: "Leads",
                        __v        : 0
                    },
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
                    _id      : {
                        _id        : "57172598526673490fa188ac",
                        filter: {
                            'Can be Purchased': {
                                canBePurchased: {
                                    key  : "canBePurchased",
                                    value: [
                                        "true"
                                    ]
                                }
                            }
                        },
                        contentView: "Product",
                        __v        : 0
                    },
                    viewType: "",
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
                applications: {
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
            email          : "info@thinkmobiles.com",
            login          : "admin",
            imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
        },
        savedFilters: {
            undefined: [
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
                    _id      : null,
                    viewType: "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType: "",
                    byDefault: "salesInvoice"
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
                    byDefault: "Projects"
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
                    _id      : null,
                    viewType: "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType: "",
                    byDefault: ""
                }
            ],
            Employees: [
                {
                    _id      : {
                        _id        : "562b83ccb4677e225aa31df6",
                        filter: {
                            PM: {
                                department: {
                                    key  : "department._id",
                                    value: [
                                        "55bb1f40cb76ca630b000007"
                                    ]
                                }
                            }
                        },
                        contentView: "Employees",
                        __v        : 0
                    },
                    viewType: "",
                    byDefault: ""
                }
            ],
            Persons  : [
                {
                    _id      : {
                        _id        : "564dd4ce9fb8bc3f2195662c",
                        filter: {
                            dfghj: {
                                name    : {
                                    key  : "_id",
                                    value: [
                                        "55b92ad621e4b7c40f000635",
                                        "55b92ad621e4b7c40f000637",
                                        "55b92ad621e4b7c40f00062d",
                                        "55d37aee226ed3280b000005",
                                        "55b92ad621e4b7c40f00064a",
                                        "55b92ad621e4b7c40f00065e",
                                        "55b92ad621e4b7c40f000636",
                                        "55b92ad621e4b7c40f000649",
                                        "55b92ad621e4b7c40f00063c",
                                        "55ba0479d79a3a3439000010",
                                        "55ba0701d79a3a3439000012",
                                        "55b92ad521e4b7c40f00061c",
                                        "55b92ad621e4b7c40f00062b",
                                        "55b92ad521e4b7c40f000612",
                                        "55b92ad521e4b7c40f000619",
                                        "55b9fa60d79a3a3439000005",
                                        "55b92ad621e4b7c40f000658",
                                        "55b92ad521e4b7c40f000613",
                                        "55b92ad521e4b7c40f000621",
                                        "55b92ad621e4b7c40f000640",
                                        "55b92ad621e4b7c40f000659",
                                        "55b92ad521e4b7c40f00061f",
                                        "55b92ad621e4b7c40f00064c",
                                        "55b9ff67d79a3a343900000a",
                                        "55b92ad621e4b7c40f00064e",
                                        "55b92ad621e4b7c40f000626",
                                        "55b92ad521e4b7c40f00060f",
                                        "55b92ad621e4b7c40f000656",
                                        "55b92ad621e4b7c40f00065a",
                                        "55b92ad521e4b7c40f000614",
                                        "55b92ad521e4b7c40f000616",
                                        "55b92ad621e4b7c40f00064b",
                                        "55b92ad521e4b7c40f000620",
                                        "55b92ad621e4b7c40f000631",
                                        "55b92ad621e4b7c40f000655",
                                        "55b92ad621e4b7c40f000625",
                                        "55b92ad621e4b7c40f000632",
                                        "55b92ad621e4b7c40f000644",
                                        "55b92ad621e4b7c40f000654",
                                        "55b92ad621e4b7c40f00062c"
                                    ]
                                },
                                country: {
                                    key  : "address.country",
                                    value: [
                                        "Australia",
                                        "Israel",
                                        "Singapore",
                                        "Spain",
                                        "US",
                                        "USA",
                                        "USA/Germany",
                                        "United States"
                                    ]
                                },
                                services: {
                                    key  : "services",
                                    value: [
                                        "isCustomer",
                                        "isSupplier"
                                    ]
                                }
                            }
                        },
                        contentView: "Persons",
                        __v        : 0
                    },
                    viewType: "",
                    byDefault: ""
                }
            ],
            Leads    : [
                {
                    _id      : {
                        _id        : "56dfe8e56e2877d85455a6bb",
                        filter: {
                            initial: {
                                workflow: {
                                    key  : "workflow._id",
                                    value: [
                                        "528ce779f3f67bc40b00001f"
                                    ],
                                    type : null
                                }
                            }
                        },
                        contentView: "Leads",
                        __v        : 0
                    },
                    viewType: "",
                    byDefault: "Leads"
                },
                {
                    _id      : {
                        _id        : "56f3d039c1785edc507e81ea",
                        filter: {
                            ggggg: {
                                source: {
                                    key  : "source",
                                    value: [
                                        "victor"
                                    ],
                                    type : null
                                }
                            }
                        },
                        contentView: "Leads",
                        __v        : 0
                    },
                    viewType: "",
                    byDefault: ""
                }
            ],
            Product  : [
                {
                    _id      : {
                        _id        : "57172598526673490fa188ac",
                        filter: {
                            'Can be Purchased': {
                                canBePurchased: {
                                    key  : "canBePurchased",
                                    value: [
                                        "true"
                                    ]
                                }
                            }
                        },
                        contentView: "Product",
                        __v        : 0
                    },
                    viewType: "",
                    byDefault: ""
                }
            ]
        }
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
    var fakeProjectForDD = {
        data: [
            {
                _id             : "56e689c75ec71b00429745a9",
                projectName: "360CamSDK",
                projectShortDesc: "SDK"
            },
            {
                _id             : "55cdc96d9b42266a4f000006",
                projectName: "Absolute Vodka",
                projectShortDesc: "Absolute Vodka"
            },
            {
                _id             : "55b92ad621e4b7c40f0006af",
                projectName: "Academic Website testing",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000681",
                projectName: "AirPort",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000669",
                projectName: "Airsoft site",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "5702160eed3f15af0782f13a",
                projectName: "Andreas Project 2",
                projectShortDesc: "Description"
            },
            {
                _id             : "55b92ad621e4b7c40f0006a2",
                projectName: "Android",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006a5",
                projectName: "Android",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006b1",
                projectName: "Android Automation",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00067b",
                projectName: "Android Help",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000677",
                projectName: "Android Tribesta",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "569f60d162d172544baf0d58",
                projectName: "Android advertisement",
                projectShortDesc: "Supportment of app"
            },
            {
                _id             : "55b92ad621e4b7c40f00069e",
                projectName: "Android1",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000661",
                projectName: "Android2",
                projectShortDesc: "emptyProjectxcvxcv"
            },
            {
                _id             : "56aa2cb4b4dc0d09232bd7aa",
                projectName: "AngularJS - Stentle",
                projectShortDesc: "AngularJS"
            },
            {
                _id             : "55b92ad621e4b7c40f000678",
                projectName: "Appium testing",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "562ff292b03714731dd8433b",
                projectName: "Appsmakerstore",
                projectShortDesc: "Appsmakerstore"
            },
            {
                _id             : "55b92ad621e4b7c40f0006d6",
                projectName: "ArTV",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56abd16ac6be8658550dc6c3",
                projectName: "Baccarat",
                projectShortDesc: "Unity 3d video streaming project"
            },
            {
                _id             : "56e2cc9b74ac46664a83e949",
                projectName: "Backoffice 2.0 Stentle",
                projectShortDesc: "AngularJS web page"
            },
            {
                _id             : "55b92ad621e4b7c40f0006cb",
                projectName: "Bayzat",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000664",
                projectName: "BelgiumHTML",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55f5728cb81672730c00006a",
                projectName: "BetterIt ios",
                projectShortDesc: "betterit ios"
            },
            {
                _id             : "55f55a89b81672730c000017",
                projectName: "Bimii",
                projectShortDesc: "Tablet"
            },
            {
                _id             : "55b92ad621e4b7c40f0006c7",
                projectName: "BizRate",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "5638e863593807ff047d99e5",
                projectName: "Bizrate",
                projectShortDesc: "iOS"
            },
            {
                _id             : "55de1e8ef09cc2ec0b000031",
                projectName: "BlueLight",
                projectShortDesc: "Java Project"
            },
            {
                _id             : "55b92ad621e4b7c40f000683",
                projectName: "Bob",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "561ebb8cd6c741e8235f42ea",
                projectName: "Bodega application",
                projectShortDesc: "app for iOS and Andr tablets"
            },
            {
                _id             : "56a0d60062d172544baf0e3d",
                projectName: "BuddyBet",
                projectShortDesc: "Betting app"
            },
            {
                _id             : "5629e238129820ab5994e8c0",
                projectName: "Bus Project",
                projectShortDesc: "Bus lines"
            },
            {
                _id             : "56bdcc69dfd8a81466e2f58a",
                projectName: "Buzinga extra costs",
                projectShortDesc: "extra costs"
            },
            {
                _id             : "56ab5ceb74d57e0d56d6bda5",
                projectName: "CAPT",
                projectShortDesc: "capt the video"
            },
            {
                _id             : "56e292585def9136621b7800",
                projectName: "Casino",
                projectShortDesc: "Flash to HTML5"
            },
            {
                _id             : "55b92ad621e4b7c40f0006d8",
                projectName: "Casino Game",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006cd",
                projectName: "CloudFuze",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "563767135d23a8eb04e80aec",
                projectName: "Coach App",
                projectShortDesc: "iOS, Android, Backend"
            },
            {
                _id             : "55b92ad621e4b7c40f000680",
                projectName: "CodeThreads",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56fe645769c37d5903700b20",
                projectName: "Colgate",
                projectShortDesc: "Quizz"
            },
            {
                _id             : "5703a427c3a5da3e0347a481",
                projectName: "Command Center",
                projectShortDesc: "social marketing analysis tool"
            },
            {
                _id             : "55b92ad621e4b7c40f000682",
                projectName: "Connexus",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000695",
                projectName: "Consent APP",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006b9",
                projectName: "Curb testing",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000672",
                projectName: "DRH QA Automation",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00068c",
                projectName: "DRH manual",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006c6",
                projectName: "Demo Rocket",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56a23c5caa157ca50f21fae1",
                projectName: "Demolition Derby",
                projectShortDesc: "DD"
            },
            {
                _id             : "55b92ad621e4b7c40f0006b7",
                projectName: "Design",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56afdabef5c2bcd4555cb2f8",
                projectName: "Design Slots",
                projectShortDesc: "Game slots"
            },
            {
                _id             : "55b92ad621e4b7c40f00066c",
                projectName: "DesignShargo",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "57039f0353db5c9d03fc9ebe",
                projectName: "DiGep",
                projectShortDesc: "Training app"
            },
            {
                _id             : "55b92ad621e4b7c40f0006aa",
                projectName: "DiveplanIT",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56fd3453a33b73e503e3eb65",
                projectName: "Donation App",
                projectShortDesc: "Xamarin project"
            },
            {
                _id             : "55de2cd2f09cc2ec0b000053",
                projectName: "Dragon Daze",
                projectShortDesc: "Design game"
            },
            {
                _id             : "56dffa45f20b938426716709",
                projectName: "ESTablet web",
                projectShortDesc: "Management system for hospitals"
            },
            {
                _id             : "56dff1b4a12a4f3c26919c91",
                projectName: "EasyERP",
                projectShortDesc: "EasyERP all jobs"
            },
            {
                _id             : "55b92ad621e4b7c40f000691",
                projectName: "Faceworks",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55ded24cae2b22730b000040",
                projectName: "FarmStatistic",
                projectShortDesc: "Farm sales"
            },
            {
                _id             : "55f55d31b81672730c000020",
                projectName: "Farmers App",
                projectShortDesc: "App for Farmers"
            },
            {
                _id             : "55b92ad621e4b7c40f0006b8",
                projectName: "FindLost",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56030dbffa3f91444e00000d",
                projectName: "Firderberg",
                projectShortDesc: "web"
            },
            {
                _id             : "55b92ad621e4b7c40f0006ce",
                projectName: "FlipStar Game",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "568b85b33cce9254776f2b4c",
                projectName: "FluxIOT",
                projectShortDesc: "Hydroponic app"
            },
            {
                _id             : "55de24bbf09cc2ec0b000036",
                projectName: "FosterFarms",
                projectShortDesc: "Facebook app"
            },
            {
                _id             : "55b92ad621e4b7c40f0006c1",
                projectName: "Ganchak Help",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006a0",
                projectName: "GetFit",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "569f5bc662d172544baf0c40",
                projectName: "Gilad Nevo Bug fixing",
                projectShortDesc: "Fixing bugs for Indian code"
            },
            {
                _id             : "55cf5ea04a91e37b0b00012c",
                projectName: "Global Workshop",
                projectShortDesc: "Global Workshop"
            },
            {
                _id             : "55de2a30f09cc2ec0b00004e",
                projectName: "GovMap",
                projectShortDesc: "Government map"
            },
            {
                _id             : "56e93c3b07ea2d845ef75dff",
                projectName: "Guru",
                projectShortDesc: "Guru website"
            },
            {
                _id             : "55b92ad621e4b7c40f0006be",
                projectName: "HBO",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "565740e0bfd103f108eb4ad4",
                projectName: "HKConnect",
                projectShortDesc: "aga"
            },
            {
                _id             : "56d9a14f7891423e3d5b8f18",
                projectName: "Habi",
                projectShortDesc: "iOS Swift"
            },
            {
                _id             : "569f58df62d172544baf0c3d",
                projectName: "Haie",
                projectShortDesc: "Bugfix/Inplementation"
            },
            {
                _id             : "55b92ad621e4b7c40f0006d3",
                projectName: "HashPlay",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00065f",
                projectName: "IOS/Android QA",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006c4",
                projectName: "Ibizawire",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000665",
                projectName: "JellyGames",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006c3",
                projectName: "Jude",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006ad",
                projectName: "KX keyboard",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000671",
                projectName: "Kari",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006b5",
                projectName: "KemblaJoggers",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006ae",
                projectName: "Kikast",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006cf",
                projectName: "Kogan Apps",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00066e",
                projectName: "LCUpdate iOS",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55cf4fc74a91e37b0b000103",
                projectName: "Legal Application",
                projectShortDesc: "Web App for Lawyers"
            },
            {
                _id             : "55b92ad621e4b7c40f0006c5",
                projectName: "Liquivid",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00066d",
                projectName: "LiveCasinoAndroid",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "568cea4977b14bf41bf2c32c",
                projectName: "LocalCollector",
                projectShortDesc: "it is a local collector"
            },
            {
                _id             : "56a89384eb2b76c70ec74d1e",
                projectName: "Locappy",
                projectShortDesc: "Neighborhood App"
            },
            {
                _id             : "563b95acab9698be7c9df727",
                projectName: "LoginChineseTrue",
                projectShortDesc: "Chinese language learning tool"
            },
            {
                _id             : "55b92ad621e4b7c40f0006b3",
                projectName: "Loyalty",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006d4",
                projectName: "M-Government",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006ac",
                projectName: "Manual front end testing for e commerce site",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000690",
                projectName: "Max",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006d7",
                projectName: "Mesa Ave",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006bf",
                projectName: "Minder",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55cf36d54a91e37b0b0000c2",
                projectName: "Mobstar",
                projectShortDesc: "Project for Android and iOS, Bac"
            },
            {
                _id             : "55b92ad621e4b7c40f0006bb",
                projectName: "MorfitRun",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006a6",
                projectName: "Moriser",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56304d56547f50b51d6de2bb",
                projectName: "Move for Less",
                projectShortDesc: "logistic company app"
            },
            {
                _id             : "562bc32484deb7cb59d61b70",
                projectName: "MyDrive",
                projectShortDesc: "App For Santander Bank Employees"
            },
            {
                _id             : "569ced3fea21e2ac7d729e18",
                projectName: "MySmallCommunity",
                projectShortDesc: "haha"
            },
            {
                _id             : "56e001b7622d25002676ffd3",
                projectName: "Nexture site",
                projectShortDesc: "Corporate site for Nexture"
            },
            {
                _id             : "56685d88a3fc012a68f0d854",
                projectName: "Nicolas Burer Design",
                projectShortDesc: "design project"
            },
            {
                _id             : "55b92ad621e4b7c40f00066b",
                projectName: "Nikky",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00066f",
                projectName: "Oculus Player",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000684",
                projectName: "OnSite Unibet",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56618227bb8be7814fb526e5",
                projectName: "Otrema WP4",
                projectShortDesc: "PROBABLY THE BEST SMART RADIATOR"
            },
            {
                _id             : "56422bfc70bbc2b740ce89f3",
                projectName: "PREEME",
                projectShortDesc: "Video app"
            },
            {
                _id             : "55b92ad621e4b7c40f000667",
                projectName: "PT2",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "561d1c3db51032d674856acc",
                projectName: "PayFever",
                projectShortDesc: "Pay less"
            },
            {
                _id             : "55b92ad621e4b7c40f00068e",
                projectName: "Phidget ANE",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56e003948594da632689f1cd",
                projectName: "Phone app",
                projectShortDesc: "Phone app for Android"
            },
            {
                _id             : "56dea0a5c235df7c05aa635c",
                projectName: "PhotoShop app",
                projectShortDesc: "Photo marketplace"
            },
            {
                _id             : "55b92ad621e4b7c40f000697",
                projectName: "Pilot",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006d9",
                projectName: "Pilot",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56ab958e74d57e0d56d6be3b",
                projectName: "Planogram",
                projectShortDesc: "Project for PandG"
            },
            {
                _id             : "55b92ad621e4b7c40f0006b2",
                projectName: "Player",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00067f",
                projectName: "Player iOS/And",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56e2924a1f2850d361927dd1",
                projectName: "Poems app",
                projectShortDesc: "Reading app"
            },
            {
                _id             : "55b92ad621e4b7c40f0006c8",
                projectName: "PriTriever",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "57063f34c3a5da3e0347a4b9",
                projectName: "PriceBox WEB",
                projectShortDesc: "E-Commerce skinning project"
            },
            {
                _id             : "55b92ad621e4b7c40f0006bc",
                projectName: "Pseudo",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006bd",
                projectName: "Purple Ocean",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000673",
                projectName: "Q/A digital QA",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000676",
                projectName: "QA",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000694",
                projectName: "QA iOS Purple Ocean",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00068f",
                projectName: "QMR Android",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006ab",
                projectName: "QMR iOS",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00067a",
                projectName: "QMr and It websites testing",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000662",
                projectName: "QMr and It websites testing1",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55cb770bfea413b50b000008",
                projectName: "QualPro",
                projectShortDesc: "ERP system"
            },
            {
                _id             : "56c431dda2cb3024468a04ee",
                projectName: "Raffle Draw",
                projectShortDesc: "Random lottery"
            },
            {
                _id             : "566857caa3fc012a68f0d83a",
                projectName: "SPS Mobile",
                projectShortDesc: "Mobile bug fix"
            },
            {
                _id             : "55b92ad621e4b7c40f0006d1",
                projectName: "Sales Tool",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "566d4bc3abccac87642cb523",
                projectName: "Scatch",
                projectShortDesc: "Coupon app"
            },
            {
                _id             : "55b92ad621e4b7c40f000668",
                projectName: "Selenium IDE",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000686",
                projectName: "Sensei",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56ab891074d57e0d56d6be1f",
                projectName: "Serial Box",
                projectShortDesc: "ror project"
            },
            {
                _id             : "55b92ad621e4b7c40f00067d",
                projectName: "Sharalike",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006b6",
                projectName: "Shiwaforce Karma",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "561253dfc90e2fb026ce064d",
                projectName: "Shiwaforce Karma QA",
                projectShortDesc: "Automation testing"
            },
            {
                _id             : "55b92ad621e4b7c40f0006ca",
                projectName: "SketchTechPoints",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56dff43eb07e2ad226b6893b",
                projectName: "Smart360",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006d2",
                projectName: "Snapped",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000696",
                projectName: "Software Testing of Web Application",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00067e",
                projectName: "SoulIntentions",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "562bba6e4a431b5a5a3111fe",
                projectName: "Spark",
                projectShortDesc: "App inspired by Snapchat"
            },
            {
                _id             : "55b92ad621e4b7c40f0006a9",
                projectName: "Spokal",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56e005f0f20b93842671670d",
                projectName: "Spoon Comics",
                projectShortDesc: "Comics site"
            },
            {
                _id             : "55b92ad621e4b7c40f000698",
                projectName: "Staffd",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "5605736c002c16436b000007",
                projectName: "Stentle CSS",
                projectShortDesc: "short css project"
            },
            {
                _id             : "570b8fce9655379f334001c9",
                projectName: "TEST1",
                projectShortDesc: "TEST1"
            },
            {
                _id             : "55b92ad621e4b7c40f000699",
                projectName: "Tablet apps",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006b0",
                projectName: "Telecom",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "570b6a5df684d1240d484b6e",
                projectName: "Test",
                projectShortDesc: "Test"
            },
            {
                _id             : "55b92ad621e4b7c40f00066a",
                projectName: "The Watch Enthusiast",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56dff3458594da632689f1c7",
                projectName: "ThinkMobiles Web",
                projectShortDesc: "ThinkMobiles Web"
            },
            {
                _id             : "55f56442b81672730c000032",
                projectName: "Tinder clone",
                projectShortDesc: "Project similar to Tinder"
            },
            {
                _id             : "55b92ad621e4b7c40f0006ba",
                projectName: "TocToc",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000685",
                projectName: "Travlr",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "562beda846bca6e4591f4930",
                projectName: "TreatMe",
                projectShortDesc: "Uber-like app"
            },
            {
                _id             : "55b92ad621e4b7c40f0006c0",
                projectName: "TrumpT QA",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006d5",
                projectName: "Unlimited Conferencing",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56a9ef06d59a04d6225b0df6",
                projectName: "UpCity",
                projectShortDesc: "City management"
            },
            {
                _id             : "56b09dd8d6ef38a708dfc284",
                projectName: "Vike Analytics Integration",
                projectShortDesc: "Internal Project"
            },
            {
                _id             : "55b92ad621e4b7c40f0006b4",
                projectName: "Vroup",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000693",
                projectName: "WP Player",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006c2",
                projectName: "WP Wrapper Unibet",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "56bc8fd2dfd8a81466e2f46b",
                projectName: "WSpider",
                projectShortDesc: "design and research"
            },
            {
                _id             : "56a24d5faa157ca50f21fb13",
                projectName: "Water Safety App",
                projectShortDesc: "Water source testing"
            },
            {
                _id             : "55f55901b81672730c000011",
                projectName: "WhachApp",
                projectShortDesc: "Android"
            },
            {
                _id             : "55b92ad621e4b7c40f000674",
                projectName: "Win7 app tester needed",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000692",
                projectName: "WishExpress",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "563295f6c928c61d052d5003",
                projectName: "WordPress Sites",
                projectShortDesc: "Site Templates Business"
            },
            {
                _id             : "55deb95bae2b22730b000017",
                projectName: "YelloDrive",
                projectShortDesc: "Delivery app"
            },
            {
                _id             : "55b92ad621e4b7c40f000663",
                projectName: "ajaxbrowser.com",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00068a",
                projectName: "application regression testing",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000666",
                projectName: "blow.com",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006a7",
                projectName: "couch",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006a4",
                projectName: "iOS Periop",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006a3",
                projectName: "iOS dev",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000687",
                projectName: "iOS/Tribesta",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000660",
                projectName: "iOS1",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000688",
                projectName: "iOS2",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00069d",
                projectName: "iOS3",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000689",
                projectName: "iOS4",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00069f",
                projectName: "iOS5",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000675",
                projectName: "iOS6",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f00067c",
                projectName: "iQshop",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f000670",
                projectName: "iRemember",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "5613b6f0c90e2fb026ce068c",
                projectName: "iTacit",
                projectShortDesc: "iOS and Android"
            },
            {
                _id             : "55b92ad621e4b7c40f00069c",
                projectName: "sTrader",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006a8",
                projectName: "sitefix",
                projectShortDesc: "emptyProject"
            },
            {
                _id             : "55b92ad621e4b7c40f0006c9",
                projectName: "spscontrol",
                projectShortDesc: "emptyProject"
            }
        ]
    };
    var fakeFilter = {
        _id       : null,
        project: [
            {
                _id : "56e689c75ec71b00429745a9",
                name: "360CamSDK"
            },
            {}
        ],
        summary: [
            {
                _id : "5350eaabc3406b2c0900003b",
                name: "new skins"
            },
            {
                _id : "5350ea3ec3406b2c09000039",
                name: "bug fixng"
            },
            {
                _id : "5350ea0dc3406b2c09000038",
                name: "finish the design"
            },
            {
                _id : "5717661c2c8b789c7a0bb82d",
                name: "Testing"
            },
            {
                _id : "5350e82bc3406b2c09000035",
                name: "wallpapers"
            },
            {
                _id : "5350eb3fc3406b2c0900003c",
                name: "finishing the project"
            },
            {
                _id : "5350ea5ac3406b2c0900003a",
                name: "new features"
            },
            {
                _id : "5350e871c3406b2c09000037",
                name: "testing"
            },
            {
                _id : "5350e84ec3406b2c09000036",
                name: "design"
            },
            {
                _id : "5350e815c3406b2c09000034",
                name: "Weekly sprint 03-07.02.14"
            }
        ],
        assignedTo: [
            {
                _id : "55b92ad221e4b7c40f000090",
                name: "Gabriella Shterr"
            },
            {
                name: "None"
            }
        ],
        workflow  : [
            {
                _id : "528ce35af3f67bc40b000010",
                name: "Testing"
            },
            {
                _id : "528ce0cdf3f67bc40b00000c",
                name: "New"
            },
            {
                _id : "528ce131f3f67bc40b00000d",
                name: "In Progress"
            }
        ],
        type      : [
            {
                _id : "Feature",
                name: "Feature"
            },
            {
                _id : "Bug",
                name: "Bug"
            },
            {
                _id : "Task",
                name: "Task"
            }
        ]
    };
    var fakeResponseSavedFilter = {
        "success": {
            "_id"            : "52203e707d4dba8813000003",
            "__v": 0,
            "attachments": [],
            "lastAccess" : "2016-06-29T12:59:07.236Z",
            "profile"    : 1387275598000,
            "relatedEmployee": "55b92ad221e4b7c40f00004f",
            "savedFilters"   : [{
                "_id"        : "574335bb27725f815747d579",
                "viewType": "",
                "contentType": null,
                "byDefault"  : true
            }, {
                "_id"        : "576140b0db710fca37a2d950",
                "viewType": "",
                "contentType": null,
                "byDefault"  : false
            }, {
                "_id"        : "5761467bdb710fca37a2d951",
                "viewType": "",
                "contentType": null,
                "byDefault"  : false
            }, {
                "_id"        : "57615278db710fca37a2d952",
                "viewType": "",
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
            }, {"_id": "5773ccdad523f12a494382aa", "contentType": "Tasks", "byDefault": false}],
            "kanbanSettings" : {
                "tasks"        : {"foldWorkflows": ["Empty"], "countPerPage": 10},
                "applications": {"foldWorkflows": ["Empty"], "countPerPage": 87},
                "opportunities": {"foldWorkflows": ["528cdf1cf3f67bc40b00000b"], "countPerPage": 10}
            },
            "credentials"    : {"access_token": "", "refresh_token": ""},
            "pass"           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
            "email"          : "info@thinkmobiles.com",
            "login"          : "admin"
        }
    };
    var view;
    var topBarView;
    var listView;
    var kanbanView;
    var tasksCollection;
    var historyNavigateSpy;
    var ajaxSpy;
    var selectSpy;
    var removeFilterSpy;
    var saveFilterSpy;
    var removedFromDBSpy;
    var debounceStub;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('TasksView', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
            ajaxSpy = sinon.spy($, 'ajax');
            selectSpy = sinon.spy(FilterGroup.prototype, 'selectValue');
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
            saveFilterSpy = sinon.spy(SavedFilters.prototype, 'saveFilter');
            removedFromDBSpy = sinon.spy(SavedFilters.prototype, 'removeFilterFromDB');
            debounceStub = sinon.stub(_, 'debounce', function (debFunction) {
                return debFunction;
            });
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();
            kanbanView.remove();

            historyNavigateSpy.restore();
            ajaxSpy.restore();
            selectSpy.restore();
            removeFilterSpy.restore();
            saveFilterSpy.restore();
            removedFromDBSpy.restore();
            debounceStub.restore();
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
                view = new MainView({el: $elFixture, contentType: 'Tasks'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="40"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="40"]').closest('li');
                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Tasks');
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
                var tasksUrl = new RegExp('\/Tasks\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', tasksUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                tasksCollection = new TasksCollection({
                    filter     : null,
                    viewType: 'list',
                    page    : 1,
                    count   : 100,
                    reset   : true,
                    showMore: false,
                    contentType: 'Tasks'

                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
            });

            it('Try to create TopBarView', function () {
                var tasksUrl = new RegExp('\/Tasks\/', 'i');

                window.location.hash = '#easyErp/Tasks';

                server.respondWith('GET', tasksUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTasks)]);
                tasksCollection = new TasksCollection({
                    filter     : null,
                    viewType: 'list',
                    page    : 1,
                    count   : 100,
                    reset   : true,
                    showMore: false,
                    contentType: 'Tasks'
                });
                server.respond();

                expect(tasksCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    collection: tasksCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Tasks');
            });

            it('Try to change ViewType', function () {
                var $listBtn = topBarView.$el.find('#listBtn');
                var $kanbanBtn = topBarView.$el.find('#kanbanBtn');

                expect(window.location.hash).to.be.equals('#easyErp/Tasks');

                $kanbanBtn.click();
                expect(window.location.hash).to.be.equals('#easyErp/Tasks/kanban');

                $listBtn.click();
                expect(window.location.hash).to.be.equals('#easyErp/Tasks/list');
            });
        });

        describe('Task list view', function () {
            var server;
            var windowConfirmStub;
            var mainSpy;
            var windowAlertStub;
            var clock;
            var $thisEl;
            var showFilteredPageSpy;

            before(function () {
                App.currentViewType = 'list';
                mainSpy = sinon.spy(App, 'render');
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                windowAlertStub = sinon.stub(window, 'alert');
                windowAlertStub.returns(true);
                clock = sinon.useFakeTimers();
                showFilteredPageSpy = sinon.spy(ListView.prototype, 'showFilteredPage');
            });

            after(function () {
                mainSpy.restore();
                server.restore();
                windowConfirmStub.restore();
                windowAlertStub.restore();
                clock.restore();
                showFilteredPageSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create tasks list view', function () {
                    var taskStagesUrl = new RegExp('\/Workflows', 'i');
                    var filterUrl = '/filter/Tasks';
                    var $firstRow;
                    var colCount;
                    var taskId;
                    var taskSummary;
                    var project;
                    var status;
                    var assigned;
                    var estimated;
                    var logged;
                    var type;
                    var progress;
                    var createdBy;
                    var editedBy;
                    var $pagination;
                    var $currentPageList;

                    server.respondWith('GET', filterUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilter)]);
                    server.respondWith('GET', taskStagesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTaskStages)]);
                    listView = new ListView({
                        collection: tasksCollection,
                        startTime : new Date()
                    });
                    server.respond();

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(tasksCollection, listView);

                    tasksCollection.trigger('fetchFinished', {
                        totalRecords: tasksCollection.totalRecords,
                        currentPage : tasksCollection.currentPage,
                        pageSize    : tasksCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('.list')).to.exist;
                    expect($thisEl.find('#searchContainer')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;
                    expect(colCount).to.be.equals(13);

                    taskId = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(taskId).not.to.be.empty;
                    expect(taskId).to.not.match(/object Object|undefined/);

                    taskSummary = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(taskSummary).not.to.be.empty;
                    expect(taskSummary).to.not.match(/object Object|undefined/);

                    project = $firstRow.find('td:nth-child(5) > a').text().trim();
                    expect(project).not.to.be.empty;
                    expect(project).to.not.match(/object Object|undefined/);

                    status = $firstRow.find('td:nth-child(6) > a').text().trim();
                    expect(status).not.to.be.empty;
                    expect(status).to.not.match(/object Object|undefined/);

                    assigned = $firstRow.find('td:nth-child(7)').text().trim();
                    expect(assigned).not.to.be.empty;
                    expect(assigned).to.not.match(/object Object|undefined/);

                    estimated = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(estimated).to.not.match(/object Object|undefined/);

                    logged = $firstRow.find('td:nth-child(9)').text().trim();
                    expect(logged).to.not.match(/object Object|undefined/);

                    type = $firstRow.find('td:nth-child(10) > a').text().trim();
                    expect(type).not.to.be.empty;
                    expect(type).to.not.match(/object Object|undefined/);

                    progress = $firstRow.find('td:nth-child(11) > progress');
                    expect(progress).to.exist;

                    createdBy = $firstRow.find('td:nth-child(12)').text().trim();
                    expect(createdBy).not.to.be.empty;
                    expect(createdBy).to.not.match(/object Object|undefined/);

                    editedBy = $firstRow.find('td:nth-child(13)').text().trim();
                    expect(editedBy).not.to.be.empty;
                    expect(editedBy).to.not.match(/object Object|undefined/);

                    // test pagination container

                    $pagination = $thisEl.find('.pagination');

                    expect($pagination).to.exist;
                    expect($pagination.find('.countOnPage')).to.be.exist;
                    expect($pagination.find('.pageList')).to.be.exist;

                    $currentPageList = $thisEl.find('.currentPageList');
                    $currentPageList.mouseover();
                    expect($thisEl.find('#pageList')).to.have.css('display', 'block');
                    expect($thisEl.find('#pageList > li')).to.have.lengthOf(3);

                    $currentPageList.mouseover();
                    expect($thisEl.find('#pageList')).to.have.css('display', 'none');
                });

                it('Try to go to ProjectEditView with error', function () {
                    var $listEl = listView.$el;
                    var $projectBtn = $listEl.find('tr:nth-child(1) .project');
                    var projectUrl = new RegExp('\/Projects\/');
                    var spyResponse;

                    server.respondWith('GET', projectUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeProjectById)]);
                    $projectBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to go to ProjectEditView', function () {
                    var $projectBtn = $thisEl.find('#listTable > tr').first().find('.project');
                    var projectUrl = new RegExp('\/Projects\/');
                    this.timeout(3000);

                    server.respondWith('GET', projectUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProjectById)]);
                    $projectBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;

                    $('.ui-dialog').remove();
                });

                it('Try to change Status', function () {
                    var $selectedItem;
                    var $listEl = listView.$el;
                    var $statusBtn = $listEl.find('tr:nth-child(1) .stageSelect');
                    var taskUrl = new RegExp('\/Tasks\/', 'i');
                    var tasksListUrl = new RegExp('\/Tasks\/list', 'i');

                    showFilteredPageSpy.reset();
                    ajaxSpy.reset();

                    $statusBtn.click();
                    $selectedItem = $listEl.find('tr:nth-child(1) > td:nth-child(6) li:nth-child(2)');
                    server.respondWith('GET', tasksListUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTasks)]);
                    server.respondWith('PATCH', taskUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $selectedItem.click();
                    server.respond();
                    server.respond();

                    expect(showFilteredPageSpy.calledOnce).to.be.true;
                    expect(ajaxSpy.calledTwice).to.be.true;
                });

                it('Try to open EditForm with error', function () {
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(3)');
                    var taskFormUrl = new RegExp('\/Tasks\/form', 'i');
                    var spyResponse;

                    server.respondWith('GET', taskFormUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $needTd.click();
                    server.respond();
                    spyResponse = mainSpy.args[1][0];

                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to open EditForm', function () {
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(3)');
                    var taskFormUrl = new RegExp('\/Tasks\/', 'i');
                    var employeeUrl = '/employees/getForDd';

                    server.respondWith('GET', taskFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTaskForm)]);
                    server.respondWith('GET', employeeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployee)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to edit item', function () {
                    var $selectedItem;
                    var $nextEl;
                    var $prevEl;
                    var $dialogEl = $('.ui-dialog');
                    var $startDate = $dialogEl.find('#StartDate');
                    var $logged = $dialogEl.find('#logged');
                    var $employeeSelect = $dialogEl.find('#assignedToDd');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var tasksUrl = new RegExp('\/Tasks\/', 'i');

                    $startDate.val('5 Apr, 2016');
                    $logged.val('6');
                    $employeeSelect.click();
                    $nextEl = $dialogEl.find('.next');
                    $nextEl.click();
                    $prevEl = $dialogEl.find('.prev');
                    $prevEl.click();
                    $selectedItem = $dialogEl.find('#55b92ad221e4b7c40f000084');
                    $selectedItem.click();

                    server.respondWith('PATCH', tasksUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/Tasks/list/p=1/c=100');
                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to delete item with error', function () {
                    var $deleteBtn;
                    var spyResponse;
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(3)');
                    var taskFormUrl = new RegExp('\/Tasks\/form', 'i');
                    var taskUrl = new RegExp('\/Tasks\/', 'i');

                    server.respondWith('GET', taskFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTaskForm)]);
                    $needTd.click();
                    server.respond();

                    $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');

                    server.respondWith('DELETE', taskUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();
                    spyResponse = mainSpy.args[1][0];

                    expect(spyResponse).to.have.property('type', 'error');

                });

                it('Try to delete current task', function () {
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    var taskUrl = new RegExp('\/Tasks\/', 'i');

                    server.respondWith('DELETE', taskUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to open CreateView', function (done) {
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var employeeUrl = '/employees/getForDd';
                    var projectForDDUrl = '/getProjectsForDd';

                    server.respondWith('GET', employeeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployee)]);
                    server.respondWith('GET', projectForDDUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProjectForDD)]);
                    $createBtn.click();
                    server.respond();

                    clock.tick(200);

                    expect($('.ui-dialog')).to.exist;

                    done();
                });

                it('Try to create new task', function () {
                    var $selectedItem;
                    var $next;
                    var $prev;
                    var $dialogEl = $('.ui-dialog');
                    var $summary = $dialogEl.find('#summaryTask');
                    var $startDate = $dialogEl.find('#StartDate');
                    var $employeeSelect = $dialogEl.find('#assignedToDd');
                    var $createBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var taskUrl = '/Tasks/';

                    $summary.val('Test');
                    $startDate.val('4 Apr, 2016');
                    $employeeSelect.click();
                    $next = $dialogEl.find('.next');
                    $next.click();
                    $prev = $dialogEl.find('.prev');
                    $prev.click();
                    $selectedItem = $dialogEl.find('#55b92ad221e4b7c40f000084');
                    $selectedItem.click();

                    server.respondWith('POST', taskUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Created success'})]);
                    $createBtn.click();
                    server.respond();
                    expect(window.location.hash).to.be.equals('#easyErp/Tasks/list/p=1/c=100');

                });

                it('Try to cancel dialog', function () {
                    var $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to delete item from list view', function () {
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var $needCheckBox = listView.$el.find('tr[data-id="56dfd3e78c59375e055e0cc2"] > td:nth-child(1) > input');
                    var taskUrl = new RegExp('\/Tasks\/', 'i');

                    $needCheckBox.click();
                    server.respondWith('DELETE', taskUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/Tasks/list/p=1/c=100');
                });

                it('Try to filter listView by Project and Task Summary', function () {
                    var url = '/Tasks/';
                    var contentType = 'Tasks';
                    var firstValue = 'project';
                    var secondValue = 'summary';
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

                    server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTasks)]);
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

                    server.respondWith('PATCH', userUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteSavedFilterBtn.click();
                    server.respond();

                    expect(removedFromDBSpy.calledOnce).to.be.true;
                    expect($searchContainer.find('#savedFiltersElements > li')).to.have.lengthOf(0);
                });

                it('Try to remove filter', function () {
                    var secondValue = 'summary';
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
                    expect(ajaxFilter).to.have.not.property(secondValue)
                });
            });
        });

        describe('Task kanban view', function () {
            var server;
            var windowConfirmStub;
            var windowAlertStub;
            var workflowCollection;
            var clock;
            var $thisEl;

            before(function () {
                App.currentViewType = 'kanban';
                window.location.hash = 'easyErp/Tasks/kanban';

                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowAlertStub = sinon.stub(window, 'alert');
                windowConfirmStub.returns(true);
                windowAlertStub.returns(true);
                clock = sinon.useFakeTimers();

                delete App.filtersObject.filter;
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                windowAlertStub.restore();
                clock.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create kanbanView', function (done) {
                    var workflowsUrl = new RegExp('\/Workflows', 'i');
                    var tasksUrl = '/Tasks/?viewType=kanban&workflowId=528ce0cdf3f67bc40b00000c';
                    var tasksTypeUrl = '/task/getFilterValues';
                    var tasksPriorityUrl = '/tasks/priority';

                    server.respondWith('GET', tasksPriorityUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTaskPriority)]);
                    server.respondWith('GET', workflowsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTaskStages)]);
                    server.respondWith('GET', tasksTypeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify([
                        {
                            _id : null,
                            type: [
                                "Feature",
                                "Bug",
                                "Task"
                            ]
                        }
                    ])]);
                    workflowCollection = new WorkflowCollection({
                        id: 'Tasks'
                    });
                    server.respond();
                    server.respond();

                    expect(workflowCollection).to.have.lengthOf(6);
                    expect(workflowCollection.type).to.exist;
                    expect(workflowCollection.type).to.be.equals('Tasks');

                    server.respondWith('GET', tasksUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTasksForKanban)]);
                    kanbanView = new KanBanView({
                        workflowCollection: workflowCollection
                    });
                    server.respond();

                    $thisEl = kanbanView.$el;

                    expect($thisEl.find('.kanban')).to.exist;
                    expect($thisEl.find('.column').length).to.be.equals(6);
                    expect($thisEl.find('.item').length).to.be.equals(2);

                    clock.tick(200);

                    topBarView.bind('createEvent', kanbanView.createItem, kanbanView);
                    topBarView.bind('editEvent', kanbanView.editItem, kanbanView);
                    topBarView.bind('editKanban', kanbanView.editKanban, kanbanView);

                    done();
                });

                it('Try to change task type', function () {
                    var $selectedItem;
                    var $needItem = $thisEl.find('.item').first();
                    var $typeBtn = $needItem.find('a').eq(1);
                    var taskUrl = new RegExp('\/Tasks\/', 'i');

                    $typeBtn.click();
                    expect($thisEl.find('.newSelectList')).to.exist;

                    $selectedItem = $needItem.find('#Bug');
                    server.respondWith('PATCH', taskUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $selectedItem.click();
                    server.respond();

                    expect($needItem.find('a').eq(1).text().trim()).to.be.equals('Bug');
                });

                it('Try to change task priority', function () {
                    var $needItem = $thisEl.find('.item').first();
                    var $typeBtn = $needItem.find('a').eq(0);
                    var taskUrl = new RegExp('\/Tasks\/', 'i');
                    var $selectedItem;

                    $typeBtn.click();
                    $selectedItem = $needItem.find('#P1');
                    server.respondWith('PATCH', taskUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $selectedItem.click();
                    server.respond();

                    expect($needItem.find('a').eq(0).text().trim()).to.be.equals('P1');
                });

                it('Try to fold|unfold task column', function () {
                    var $firstColumn = kanbanView.$el.find('#528ce0cdf3f67bc40b00000c');
                    var $foldUnfold = $firstColumn.find('.fold-unfold');

                    $foldUnfold.click();
                    expect(kanbanView.$el.find('#528ce0cdf3f67bc40b00000c')).to.have.class('fold');

                    $firstColumn.click();
                    expect(kanbanView.$el.find('#528ce0cdf3f67bc40b00000c')).to.have.not.class('fold');
                });

                it('Try to open edit form', function () {
                    var $needTaskEl = $thisEl.find('.item').first();
                    var taskFormUrl = new RegExp('\/Tasks\/', 'i');
                    var employeeUrl = '/employees/getForDd';
                    var $dialog;

                    server.respondWith('GET', taskFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeTaskForm)]);
                    server.respondWith('GET', employeeUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmployee)]);
                    $needTaskEl.dblclick();
                    server.respond();
                    server.respond();

                    $dialog = $('.ui-dialog');

                    expect($dialog).to.exist;
                    expect($dialog).to.have.lengthOf(1);
                });

                it('Try to edit item', function () {
                    var $selectedItem;
                    var $nextEl;
                    var $prevEl;
                    var $dialogEl = $('.ui-dialog');
                    var $startDate = $dialogEl.find('#StartDate');
                    var $logged = $dialogEl.find('#logged');
                    var $employeeSelect = $dialogEl.find('#assignedToDd');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');
                    var tasksUrl = new RegExp('\/Tasks\/', 'i');

                    $startDate.val('5 Apr, 2016');
                    $logged.val('6');
                    $employeeSelect.click();
                    $nextEl = $dialogEl.find('.next');
                    $nextEl.click();
                    $prevEl = $dialogEl.find('.prev');
                    $prevEl.click();
                    $selectedItem = $dialogEl.find('#55b92ad221e4b7c40f000084');
                    $selectedItem.click();

                    server.respondWith('PATCH', tasksUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/Tasks/kanban');
                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to delete current task', function () {
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.task-edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    var taskUrl = new RegExp('\/Tasks\/', 'i');

                    server.respondWith('DELETE', taskUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });


                it('Try to change kanban settings', function () {
                    var $dialog;
                    var $countInput;
                    var $saveBtn;
                    var currentUserUrl = '/users/current';

                    server.respondWith('GET', currentUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCurrentUser)]);
                    kanbanView.editKanban();
                    server.respond();

                    $dialog = $('.ui-dialog');
                    expect($dialog).to.exist;
                    expect($dialog).to.have.lengthOf(1);

                    $countInput = $dialog.find('#cPerPage');
                    $countInput.val('15');
                    $countInput.trigger('change');

                    $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');

                    server.respondWith('POST', currentUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                });
            });
        });
    });
});
