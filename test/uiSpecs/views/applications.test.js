define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/Applications/filterCollection',
    'collections/Workflows/WorkflowsCollection',
    'views/main/MainView',
    'views/Applications/list/ListView',
    'views/Applications/kanban/KanbanView',
    'views/Applications/form/FormView',
    'views/Applications/TopBarView',
    'views/Applications/CreateView',
    'views/Applications/EditView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone,
             modules,
             fixtures,
             ApplicationCollection,
             WorkflowCollection,
             MainView,
             ListView,
             KanBanView,
             FormView,
             TopBarView,
             CreateView,
             EditView,
             $,
             chai,
             chaiJquery,
             sinonChai) {
    'use strict';

    var expect;
    var fakeApplication = {
        data      : [
            {
                _id        : "55b92ad221e4b7c40f0000b1",
                sequence   : 2,
                editedBy   : {
                    date: "2016-05-27T12:35:22.022Z"
                },
                workflow   : {
                    _id: "52d2c1369b57890814000005"
                },
                jobPosition: {
                    _id : "56b1bea7d6ef38a708dfc2a3",
                    name: "Senior Designer"
                },
                name       : {
                    last : "Korniyenko",
                    first: "Daniil"
                },
                fullName   : "Daniil Korniyenko",
                id         : "55b92ad221e4b7c40f0000b1"
            },
            {
                _id        : "56c2f2a7dfd8a81466e2f71f",
                sequence   : 1,
                editedBy   : {
                    date: "2016-05-27T12:03:05.082Z"
                },
                workflow   : {
                    _id: "52d2c1369b57890814000005"
                },
                jobPosition: {
                    _id : "55b92acf21e4b7c40f000018",
                    name: "Junior QA"
                },
                name       : {
                    last : "Mateleshka",
                    first: "Viktor"
                },
                fullName   : "Viktor Mateleshka",
                id         : "56c2f2a7dfd8a81466e2f71f"
            },
            {
                _id        : "56d06aef541812c0719735c8",
                sequence   : 206,
                editedBy   : {
                    date: "2016-05-27T12:03:02.185Z"
                },
                workflow   : {
                    _id: "52d2c1369b57890814000005"
                },
                jobPosition: {
                    _id : "56b9cd808f23c5696159cd0a",
                    name: "PR Manager Assistant"
                },
                name       : {
                    last : "Garagonich",
                    first: "Liza"
                },
                fullName   : "Liza Garagonich",
                id         : "56d06aef541812c0719735c8"
            }
        ],
        workflowId: "52d2c1369b57890814000005"
    };
    var fakeWorkflows = {
        data: [
            {
                _id         : "528ce51cf3f67bc40b000015",
                __v         : 0,
                attachments : [],
                color       : "#2C3E50",
                name        : "Initial Qualification",
                sequence    : 6,
                status      : "New",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true
            },
            {
                _id         : "528ce53bf3f67bc40b000016",
                __v         : 0,
                attachments : [],
                color       : "#2C3E50",
                name        : "First Interview",
                sequence    : 5,
                status      : "In Progress",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true
            },
            {
                _id         : "52fa5108a7bec22c19000018",
                __v         : 0,
                attachments : [],
                color       : "#2C3E50",
                name        : "Ready to teach",
                sequence    : 5,
                status      : "Pending",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true
            },
            {
                _id         : "528ce553f3f67bc40b000017",
                __v         : 0,
                attachments : [],
                color       : "#2C3E50",
                name        : "Second Interview",
                sequence    : 4,
                status      : "In Progress",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true
            },
            {
                _id         : "528ce5e3f3f67bc40b000018",
                __v         : 0,
                attachments : [],
                color       : "#2C3E50",
                name        : "Internship",
                sequence    : 3,
                status      : "Pending",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true
            },
            {
                _id         : "528ce61bf3f67bc40b000019",
                __v         : 0,
                attachments : [],
                color       : "#2C3E50",
                name        : "Contract Signed",
                sequence    : 2,
                status      : "Hired",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true
            },
            {
                _id         : "52d2c1369b57890814000005",
                __v         : 0,
                attachments : [],
                color       : "#2C3E50",
                name        : "Contract End",
                sequence    : 1,
                status      : "Cancelled",
                wId         : "Applications",
                wName       : "",
                source      : "",
                targetSource: [
                    ""
                ],
                visible     : true
            },
            {
                _id         : "528ce682f3f67bc40b00001a",
                __v         : 0,
                attachments : [],
                color       : "#2C3E50",
                name        : "Refused",
                sequence    : 0,
                status      : "Cancelled",
                wId         : "Applications",
                wName       : "application",
                source      : "application",
                targetSource: [
                    "application"
                ],
                visible     : true
            }
        ]
    };
    var fakeApplicationById = {
        _id            : "55b92ad221e4b7c40f0000b1",
        dateBirth      : "1991-12-04T04:00:00.000Z",
        ID             : 2124,
        isLead         : 0,
        fire           : [
            "2016-04-18T21:00:00.000Z"
        ],
        hire           : [
            "2015-04-19T21:00:00.000Z"
        ],
        sequence       : 2,
        jobType        : "Full-time",
        gender         : "male",
        marital        : "unmarried",
        attachments    : [
            {
                _id         : "56e2d72aacc1f83f4ad1b8d6",
                name        : "резюме Корниенко Данила.docx",
                shortPas    : "%2Fuploads%2F55b92ad221e4b7c40f0000b1%2F%D1%80%D0%B5%D0%B7%D1%8E%D0%BC%D0%B5%20%D0%9A%D0%BE%D1%80%D0%BD%D0%B8%D0%B5%D0%BD%D0%BA%D0%BE%20%D0%94%D0%B0%D0%BD%D0%B8%D0%BB%D0%B0.docx",
                size        : "0.005&nbsp;Mb",
                uploadDate  : "2016-03-11T14:33:14.500Z",
                uploaderName: "AndrianaLemko"
            }
        ],
        creationDate   : "2015-07-29T19:34:42.654Z",
        color          : "#4d5a75",
        otherInfo      : "",
        whoCanRW       : "everyOne",
        workflow       : {
            _id         : "52d2c1369b57890814000005",
            __v         : 0,
            attachments : [],
            color       : "#2C3E50",
            name        : "Contract End",
            sequence    : 1,
            status      : "Cancelled",
            wId         : "Applications",
            wName       : "",
            source      : "",
            targetSource: [
                ""
            ],
            visible     : true
        },
        active         : false,
        referredBy     : "",
        source         : "",
        age            : 24,
        otherId        : "",
        bankAccountNo  : "",
        nationality    : "",
        coach          : null,
        manager        : {
            _id     : "55b92ad221e4b7c40f00009a",
            name    : {
                last : "Pasichnyuk",
                first: "Katerina"
            },
            fullName: "Katerina Pasichnyuk",
            id      : "55b92ad221e4b7c40f00009a"
        },
        jobPosition    : {
            _id : "56b1bea7d6ef38a708dfc2a3",
            name: "Senior Designer"
        },
        department     : {
            _id           : "55bb1f14cb76ca630b000006",
            name          : "Design"
        },
        visibility     : "Public",
        relatedUser    : null,
        officeLocation : "",
        skype          : "danila-mosc",
        personalEmail  : "trip.maskaline@gmail.com",
        workEmail      : "daniil.korniyenko@thinkmobiles.com",
        tags           : [
            ""
        ],
        subject        : "",
        imageSrc       : "data:image/jpeg;base64,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",
        isEmployee     : false,
        __v            : 0,
        transferred    : [
            {
                department: {
                    name: "Marketing",
                    _id : "55b92ace21e4b7c40f000013"
                },
                date      : "2015-09-21T21:00:00.000Z"
            }
        ],
        transfer       : [
            {
                date           : "2015-04-20T01:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 300,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f000039",
                    name    : {
                        last : "Rikun",
                        first: "Stas"
                    },
                    fullName: "Stas Rikun",
                    id      : "55b92ad221e4b7c40f000039"
                },
                jobPosition    : {
                    _id : "55b92acf21e4b7c40f000028",
                    name: "Junior Designer"
                },
                department     : {
                    _id           : "55bb1f14cb76ca630b000006",
                    name          : "Design"
                },
                status         : "hired"
            },
            {
                date           : "2015-08-01T01:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 350,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f000039",
                    name    : {
                        last : "Rikun",
                        first: "Stas"
                    },
                    fullName: "Stas Rikun",
                    id      : "55b92ad221e4b7c40f000039"
                },
                jobPosition    : {
                    _id : "55b92acf21e4b7c40f000028",
                    name: "Junior Designer"
                },
                department     : {
                    _id           : "55bb1f14cb76ca630b000006",
                    name: "Design"
                },
                status         : "updated"
            },
            {
                date           : "2015-09-01T01:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 400,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f000039",
                    name    : {
                        last : "Rikun",
                        first: "Stas"
                    },
                    fullName: "Stas Rikun",
                    id      : "55b92ad221e4b7c40f000039"
                },
                jobPosition    : {
                    _id : "55b92acf21e4b7c40f000023",
                    name: "Middle Designer"
                },
                department     : {
                    _id           : "55bb1f14cb76ca630b000006",
                    name: "Design"
                },
                status         : "updated"
            },
            {
                date           : "2015-10-01T01:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 450,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f000039",
                    name    : {
                        last : "Rikun",
                        first: "Stas"
                    },
                    fullName: "Stas Rikun",
                    id      : "55b92ad221e4b7c40f000039"
                },
                jobPosition    : {
                    _id : "55b92acf21e4b7c40f000023",
                    name: "Middle Designer"
                },
                department     : {
                    _id           : "55bb1f14cb76ca630b000006",
                    name: "Design"
                },
                status         : "updated"
            },
            {
                date           : "2015-12-01T02:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 500,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00009a",
                    name    : {
                        last : "Pasichnyuk",
                        first: "Katerina"
                    },
                    fullName: "Katerina Pasichnyuk",
                    id      : "55b92ad221e4b7c40f00009a"
                },
                jobPosition    : {
                    _id : "55b92acf21e4b7c40f000023",
                    name: "Middle Designer"
                },
                department     : {
                    _id           : "55bb1f14cb76ca630b000006",
                    name: "Design"
                },
                status         : "updated"
            },
            {
                date           : "2016-01-01T02:00:00.000Z",
                isDeveloper    : true,
                info           : "",
                salary         : 600,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00009a",
                    name    : {
                        last : "Pasichnyuk",
                        first: "Katerina"
                    },
                    fullName: "Katerina Pasichnyuk",
                    id      : "55b92ad221e4b7c40f00009a"
                },
                jobPosition    : {
                    _id : "56b1bea7d6ef38a708dfc2a3",
                    name: "Senior Designer"
                },
                department     : {
                    _id           : "55bb1f14cb76ca630b000006",
                    name: "Design"
                },
                status         : "updated"
            },
            {
                date           : "2016-04-19T01:00:00.000Z",
                isDeveloper    : true,
                info           : "Fired",
                salary         : 600,
                jobType        : "Full-time",
                weeklyScheduler: {
                    _id : "57332c3b94ee1140b6bb49e2",
                    name: "UA-40"
                },
                manager        : {
                    _id     : "55b92ad221e4b7c40f00009a",
                    name    : {
                        last : "Pasichnyuk",
                        first: "Katerina"
                    },
                    fullName: "Katerina Pasichnyuk",
                    id      : "55b92ad221e4b7c40f00009a"
                },
                jobPosition    : {
                    _id : "56b1bea7d6ef38a708dfc2a3",
                    name: "Senior Designer"
                },
                department     : {
                    _id           : "55bb1f14cb76ca630b000006",
                    name: "Design"
                },
                status         : "fired"
            }
        ],
        lastFire       : 201616,
        weeklyScheduler: {
            _id : "57332c3b94ee1140b6bb49e2",
            name: "UA-40"
        },
        social         : {
            FB: "",
            LI: ""
        },
        contractEnd    : {
            date  : "2015-07-29T19:34:42.654Z",
            reason: ""
        },
        editedBy       : {
            date: "2016-05-27T12:35:22.022Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v            : 0,
                attachments    : [],
                lastAccess     : "2016-05-31T09:44:23.072Z",
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
                        _id      : "5708ca211d118cb6401008cc",
                        viewType : "",
                        byDefault: "Employees"
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
        createdBy      : {
            date: "2015-07-29T19:34:42.654Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v            : 0,
                attachments    : [],
                lastAccess     : "2016-05-31T09:44:23.072Z",
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
                        _id      : "5708ca211d118cb6401008cc",
                        viewType : "",
                        byDefault: "Employees"
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
        groups         : {
            group: [],
            users: [],
            owner: {
                _id  : "55ba28c8d79a3a3439000016",
                login: "AndrianaLemko"
            }
        },
        homeAddress    : {
            country: "",
            zip    : "",
            state  : "",
            city   : "",
            street : ""
        },
        workPhones     : {
            mobile: "+380953657202",
            phone : ""
        },
        workAddress    : {
            country: "",
            zip    : "",
            state  : "",
            city   : "",
            street : ""
        },
        name           : {
            last : "Korniyenko",
            first: "Daniil"
        },
        fullName       : "Daniil Korniyenko",
        id             : "55b92ad221e4b7c40f0000b1"
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
                _id  : "56f944f94ff1cd48536c298f",
                login: "test"
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
    var fakeApplicationsForList = {
        data: [
            {
                _id          : "55b92ad221e4b7c40f000049",
                dateBirth    : "1993-04-08T00:00:00.000Z",
                fire         : [
                    {
                        date       : "2013-08-03T21:00:00.000Z",
                        info       : "Update",
                        salary     : 600,
                        jobType    : "Full-time",
                        manager    : "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department : "55b92ace21e4b7c40f000016"
                    },
                    {
                        date       : "2016-02-04T22:00:00.000Z",
                        info       : "Fired",
                        salary     : 800,
                        jobType    : "Full-time",
                        manager    : "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department : "55b92ace21e4b7c40f000016"
                    }
                ],
                hire         : [
                    {
                        date       : "2013-08-03T21:00:00.000Z",
                        info       : "",
                        salary     : 600,
                        jobType    : "Full-time",
                        manager    : "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department : "55b92ace21e4b7c40f000016"
                    },
                    {
                        date       : "2015-03-03T22:00:00.000Z",
                        info       : "Update",
                        salary     : 800,
                        jobType    : "Full-time",
                        manager    : "55b92ad221e4b7c40f000060",
                        jobPosition: "55b92acf21e4b7c40f00001c",
                        department : "55b92ace21e4b7c40f000016"
                    }
                ],
                sequence     : 0,
                jobType      : "Full-time",
                editedBy     : {
                    date: "2016-04-04T08:36:29.197Z",
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
                                countPerPage : 100,
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
                        lastAccess     : "2016-04-04T06:06:58.757Z",
                        login          : "admin",
                        pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                        profile        : 1387275598000,
                        imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
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
                        relatedEmployee: "55b92ad221e4b7c40f00004f"
                    }
                },
                createdBy    : {
                    date: "2015-07-29T19:34:42.432Z",
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
                                countPerPage : 100,
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
                        lastAccess     : "2016-04-04T06:06:58.757Z",
                        login          : "admin",
                        pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                        profile        : 1387275598000,
                        imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
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
                        relatedEmployee: "55b92ad221e4b7c40f00004f"
                    }
                },
                creationDate : "2015-07-29T19:34:42.432Z",
                workflow     : {
                    _id         : "52d2c1369b57890814000005",
                    __v         : 0,
                    attachments : [],
                    color       : "#2C3E50",
                    name        : "Contract End",
                    sequence    : 0,
                    status      : "Cancelled",
                    wId         : "Applications",
                    wName       : "",
                    source      : "",
                    targetSource: [
                        ""
                    ],
                    visible     : true
                },
                manager      : {
                    _id           : "55b92ad221e4b7c40f000060",
                    dateBirth     : "1983-03-06T22:00:00.000Z",
                    ID            : 42,
                    isLead        : 2,
                    fire          : [
                        {
                            date       : "2012-02-21T22:00:00.000Z",
                            info       : "Update",
                            salary     : 1400,
                            jobType    : "fullTime",
                            manager    : "55b92ad221e4b7c40f00004f",
                            jobPosition: "56121847c90e2fb026ce0621",
                            department : "55b92ace21e4b7c40f000016"
                        },
                        {
                            date       : "2015-10-31T22:00:00.000Z",
                            info       : "Update",
                            salary     : 1800,
                            jobType    : "fullTime",
                            manager    : "55b92ad221e4b7c40f00004f",
                            jobPosition: "56121847c90e2fb026ce0621",
                            department : "55b92ace21e4b7c40f000016"
                        }
                    ],
                    hire          : [
                        {
                            date       : "2012-02-21T22:00:00.000Z",
                            info       : "",
                            salary     : 1400,
                            jobType    : "fullTime",
                            manager    : "55b92ad221e4b7c40f00004f",
                            jobPosition: "56121847c90e2fb026ce0621",
                            department : "55b92ace21e4b7c40f000016"
                        },
                        {
                            date       : "2015-10-31T22:00:00.000Z",
                            info       : "",
                            salary     : 1800,
                            jobType    : "fullTime",
                            manager    : "55b92ad221e4b7c40f00004f",
                            jobPosition: "56121847c90e2fb026ce0621",
                            department : "55b92ace21e4b7c40f000016"
                        },
                        {
                            date       : "2015-12-31T22:00:00.000Z",
                            info       : "",
                            salary     : 2000,
                            jobType    : "fullTime",
                            manager    : "55b92ad221e4b7c40f00004f",
                            jobPosition: "56121847c90e2fb026ce0621",
                            department : "55b92ace21e4b7c40f000016"
                        }
                    ],
                    social        : {
                        FB: "null",
                        LI: "null"
                    },
                    sequence      : 0,
                    jobType       : "fullTime",
                    gender        : "male",
                    marital       : "unmarried",
                    contractEnd   : {
                        date  : "2015-07-29T19:34:42.461Z",
                        reason: ""
                    },
                    attachments   : [],
                    editedBy      : {
                        date: "2016-03-11T13:43:23.273Z",
                        user: "55ba2f3ed79a3a343900001d"
                    },
                    createdBy     : {
                        date: "2015-07-29T19:34:42.461Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate  : "2015-07-29T19:34:42.461Z",
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
                    nationality   : "",
                    coach         : null,
                    manager       : "55b92ad221e4b7c40f00004f",
                    jobPosition   : "56121847c90e2fb026ce0621",
                    department    : "55b92ace21e4b7c40f000016",
                    visibility    : "Public",
                    relatedUser   : null,
                    officeLocation: "",
                    skype         : "romashkabk",
                    workPhones    : {
                        phone : "",
                        mobile: "+380667778480"
                    },
                    personalEmail : "",
                    workEmail     : "roman.buchuk@thinkmobiles.com",
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
                        last : "Buchuk",
                        first: "Roman"
                    },
                    subject       : "",
                    imageSrc      : "data:image/jpeg;base64,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",
                    isEmployee    : true,
                    __v           : 0
                },
                jobPosition  : {
                    _id                     : "55b92acf21e4b7c40f00001c",
                    department              : "55b92ace21e4b7c40f000016",
                    ID                      : 2,
                    editedBy                : {
                        date: "2015-07-29T19:34:39.105Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy               : {
                        date: "2015-07-29T19:34:39.105Z",
                        user: "52203e707d4dba8813000003"
                    },
                    totalForecastedEmployees: 8,
                    numberOfEmployees       : 3,
                    groups                  : {
                        group: [],
                        users: [],
                        owner: null
                    },
                    whoCanRW                : "everyOne",
                    workflow                : "528ce71ef3f67bc40b00001d",
                    expectedRecruitment     : 5,
                    name                    : "Middle JS",
                    __v                     : 0
                },
                department   : {
                    _id              : "55b92ace21e4b7c40f000016",
                    ID               : 8,
                    sequence         : 0,
                    nestingLevel     : 1,
                    editedBy         : {
                        date: "2016-02-25T08:40:40.193Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy        : {
                        date: "2015-07-29T19:34:38.910Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users            : [],
                    departmentManager: null,
                    parentDepartment : "56cebdf6541812c07197358f",
                    name   : "Web",
                    __v              : 0
                },
                skype        : "michael.kapustey",
                workPhones   : {
                    mobile: "+380668456190",
                    phone : ""
                },
                personalEmail: "michaelkapustey@gmail.com",
                workEmail    : "michael.kapustej@thinkmobiles.com",
                name         : {
                    last : "Kapustey",
                    first: "Michael"
                },
                isEmployee   : false
            },
            {
                _id          : "55c98aa7cbb0f4910b000005",
                dateBirth    : "1994-07-28T00:00:00.000Z",
                fire         : [
                    {
                        date       : "2015-08-05T21:00:00.000Z",
                        info       : "Update",
                        salary     : 350,
                        jobType    : "fullTime",
                        manager    : "55b92ad221e4b7c40f00004e",
                        jobPosition: "55b92acf21e4b7c40f000021",
                        department : "55b92ace21e4b7c40f000010"
                    },
                    {
                        date       : "2015-12-27T22:00:00.000Z",
                        info       : "",
                        salary     : 400,
                        jobType    : "fullTime",
                        manager    : "55b92ad221e4b7c40f00004e",
                        jobPosition: "55b92acf21e4b7c40f000021",
                        department : "55b92ace21e4b7c40f000010"
                    }
                ],
                hire         : [
                    {
                        date       : "2015-08-05T21:00:00.000Z",
                        info       : "",
                        salary     : 350,
                        jobType    : "fullTime",
                        manager    : "55b92ad221e4b7c40f00004e",
                        jobPosition: "55b92acf21e4b7c40f000021",
                        department : "55b92ace21e4b7c40f000010"
                    },
                    {
                        date       : "2015-09-30T21:00:00.000Z",
                        info       : "",
                        salary     : 400,
                        jobType    : "fullTime",
                        manager    : "55b92ad221e4b7c40f00004e",
                        jobPosition: "55b92acf21e4b7c40f000021",
                        department : "55b92ace21e4b7c40f000010"
                    }
                ],
                sequence     : 148,
                jobType      : "fullTime",
                editedBy     : {
                    date: "2016-04-04T08:32:17.607Z",
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
                                countPerPage : 100,
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
                        lastAccess     : "2016-04-04T06:06:58.757Z",
                        login          : "admin",
                        pass           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                        profile        : 1387275598000,
                        imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
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
                        relatedEmployee: "55b92ad221e4b7c40f00004f"
                    }
                },
                createdBy    : {
                    date: "2015-08-11T05:39:51.991Z",
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
                        lastAccess     : "2016-03-21T07:48:07.268Z",
                        savedFilters   : [],
                        relatedEmployee: null
                    }
                },
                creationDate : "2015-08-11T05:39:51.990Z",
                workflow     : {
                    _id         : "52d2c1369b57890814000005",
                    __v         : 0,
                    attachments : [],
                    color       : "#2C3E50",
                    name        : "Contract End",
                    sequence    : 0,
                    status      : "Cancelled",
                    wId         : "Applications",
                    wName       : "",
                    source      : "",
                    targetSource: [
                        ""
                    ],
                    visible     : true
                },
                manager      : {
                    _id           : "55b92ad221e4b7c40f00004e",
                    dateBirth: "1994-06-16T21:00:00.000Z",
                    ID       : 54,
                    isLead   : 1,
                    fire     : [
                        {
                            date       : "2013-05-24T21:00:00.000Z",
                            info       : "Update",
                            salary     : 350,
                            jobType    : "Full-time",
                            manager    : "55b92ad221e4b7c40f00004f",
                            jobPosition: "5681592f9cceae182b907757",
                            department : "55b92ace21e4b7c40f000012"
                        },
                        {
                            date       : "2013-08-31T21:00:00.000Z",
                            info       : "Update",
                            salary     : 450,
                            jobType    : "Full-time",
                            manager    : "55b92ad221e4b7c40f00004f",
                            jobPosition: "5681592f9cceae182b907757",
                            department : "55b92ace21e4b7c40f000012"
                        },
                        {
                            date       : "2013-10-31T22:00:00.000Z",
                            info       : "Update",
                            salary     : 500,
                            jobType    : "Full-time",
                            manager    : "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000021",
                            department : "55b92ace21e4b7c40f000010"
                        },
                        {
                            date       : "2014-08-31T21:00:00.000Z",
                            info       : "Update",
                            salary     : 600,
                            jobType    : "Full-time",
                            manager    : "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000022",
                            department : "55b92ace21e4b7c40f000010"
                        },
                        {
                            date       : "2014-12-31T22:00:00.000Z",
                            info  : "Update",
                            salary: 800,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department : "55b92ace21e4b7c40f000010"
                        },
                        {
                            date       : "2015-08-31T21:00:00.000Z",
                            info: "Update",
                            salary: 1000,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department : "55b92ace21e4b7c40f000010"
                        },
                        {
                            date       : "2015-12-31T22:00:00.000Z",
                            info: "Update",
                            salary: 1200,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department : "55b92ace21e4b7c40f000010"
                        }
                    ],
                    hire     : [
                        {
                            date       : "2013-05-24T21:00:00.000Z",
                            info: "",
                            salary: 350,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5681592f9cceae182b907757",
                            department : "55b92ace21e4b7c40f000012"
                        },
                        {
                            date       : "2013-08-31T21:00:00.000Z",
                            info: "",
                            salary: 450,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "5681592f9cceae182b907757",
                            department : "55b92ace21e4b7c40f000012"
                        },
                        {
                            date       : "2013-10-31T22:00:00.000Z",
                            info: "",
                            salary: 500,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000021",
                            department : "55b92ace21e4b7c40f000010"
                        },
                        {
                            date       : "2014-08-31T21:00:00.000Z",
                            info: "",
                            salary: 600,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "55b92acf21e4b7c40f000022",
                            department : "55b92ace21e4b7c40f000010"
                        },
                        {
                            date       : "2014-12-31T22:00:00.000Z",
                            info: "",
                            salary: 800,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department : "55b92ace21e4b7c40f000010"
                        },
                        {
                            date       : "2015-08-31T21:00:00.000Z",
                            info: "",
                            salary: 1000,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department : "55b92ace21e4b7c40f000010"
                        },
                        {
                            date       : "2015-12-31T22:00:00.000Z",
                            info: "",
                            salary: 1200,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department : "55b92ace21e4b7c40f000010"
                        },
                        {
                            date       : "2016-02-29T22:00:00.000Z",
                            info: "",
                            salary: 1400,
                            jobType: "Full-time",
                            manager: "55b92ad221e4b7c40f00004f",
                            jobPosition: "564438aa70bbc2b740ce8a19",
                            department : "55b92ace21e4b7c40f000010"
                        }
                    ],
                    social   : {
                        FB: "",
                        LI: ""
                    },
                    sequence : 0,
                    jobType  : "Full-time",
                    gender   : "male",
                    marital  : "unmarried",
                    contractEnd: {
                        date  : "2015-07-29T19:34:42.437Z",
                        reason: ""
                    },
                    attachments: [],
                    editedBy   : {
                        date: "2016-03-11T13:41:16.494Z",
                        user: "55ba2f3ed79a3a343900001d"
                    },
                    createdBy  : {
                        date: "2015-07-29T19:34:42.437Z",
                        user: "52203e707d4dba8813000003"
                    },
                    creationDate: "2015-07-29T19:34:42.437Z",
                    color       : "#4d5a75",
                    otherInfo   : "",
                    groups      : {
                        group: [],
                        users: [],
                        owner: "55ba28c8d79a3a3439000016"
                    },
                    whoCanRW    : "everyOne",
                    workflow    : null,
                    active      : false,
                    referredBy  : "",
                    source      : "",
                    age         : 21,
                    homeAddress : {
                        country: "",
                        zip    : "",
                        state  : "",
                        city   : "",
                        street : ""
                    },
                    otherId     : "",
                    bankAccountNo: "",
                    nationality  : "Ukrainian",
                    coach        : null,
                    manager      : "55b92ad221e4b7c40f00004f",
                    jobPosition  : "564438aa70bbc2b740ce8a19",
                    department   : "55b92ace21e4b7c40f000010",
                    visibility   : "Public",
                    relatedUser  : "560d0c46963ba3087363de94",
                    officeLocation: "",
                    skype         : "mikazme",
                    workPhones    : {
                        phone : "",
                        mobile: "+380950366064"
                    },
                    personalEmail : "mikazmes@gmail.com",
                    workEmail     : "vitaliy.shuba@thinkmobiles.com",
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
                        last : "Shuba",
                        first: "Vitaliy"
                    },
                    subject       : "",
                    imageSrc      : "data:image/jpeg;base64,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",
                    isEmployee    : true,
                    __v           : 0
                },
                jobPosition  : {
                    _id                     : "55b92acf21e4b7c40f000021",
                    department: "55b92ace21e4b7c40f000010",
                    ID        : 3,
                    editedBy  : {
                        date: "2015-07-29T19:34:39.108Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy : {
                        date: "2015-07-29T19:34:39.108Z",
                        user: "52203e707d4dba8813000003"
                    },
                    totalForecastedEmployees: 38,
                    numberOfEmployees       : 23,
                    groups                  : {
                        group: [],
                        users: [],
                        owner: null
                    },
                    whoCanRW                : "everyOne",
                    workflow                : "528ce71ef3f67bc40b00001d",
                    expectedRecruitment     : 15,
                    name                    : "Junior Android",
                    __v                     : 0
                },
                department   : {
                    _id              : "55b92ace21e4b7c40f000010",
                    ID : 2,
                    sequence: 4,
                    nestingLevel: 1,
                    editedBy    : {
                        date: "2016-02-25T08:41:11.006Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy   : {
                        date: "2015-07-29T19:34:38.908Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users       : [],
                    departmentManager: null,
                    parentDepartment : "56cebdf6541812c07197358f",
                    name   : "Android",
                    __v              : 0
                },
                skype        : "ok-zet",
                workPhones   : {
                    mobile: "+380635793979",
                    phone : ""
                },
                personalEmail: "",
                workEmail    : "eugen.rechun@thinkmobiles.com",
                name         : {
                    last : "Rechun",
                    first: "Eugen"
                },
                isEmployee   : false
            }
        ]
    };
    var fakeCurrentUser = {
        user        : {
            _id            : "52203e707d4dba8813000003",
            attachments: [],
            lastAccess : "2016-06-01T05:59:09.300Z",
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
                    _id      : {
                        _id        : "566eba768453e8b464b70a40",
                        filter: {
                            12: {
                                projectmanager: {
                                    key  : "projectmanager._id",
                                    value: [
                                        "55b92ad221e4b7c40f00004f",
                                        "55b92ad221e4b7c40f00005f"
                                    ],
                                    type : null
                                }
                            }
                        },
                        contentView: "Projects",
                        __v        : 0
                    },
                    viewType: "",
                    byDefault: ""
                },
                {
                    _id      : {
                        _id        : "56c711ab0769bba2647ae710",
                        filter: {
                            myP: {
                                projectmanager: {
                                    key  : "projectmanager._id",
                                    value: [
                                        "55b92ad221e4b7c40f00004f",
                                        "55b92ad221e4b7c40f00005f"
                                    ],
                                    type : null
                                },
                                workflow      : {
                                    key  : "workflow._id",
                                    value: [
                                        "528ce7f2f3f67bc40b000023",
                                        "528ce7d0f3f67bc40b000021",
                                        "528ce7e3f3f67bc40b000022"
                                    ],
                                    type : null
                                }
                            }
                        },
                        contentView: "Projects",
                        __v        : 0
                    },
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
                    _id      : null,
                    viewType: "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType: "",
                    byDefault: "Employees"
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
                    countPerPage : 10
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
                    byDefault: "Employees"
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
            Projects : [
                {
                    _id      : {
                        _id        : "566eba768453e8b464b70a40",
                        filter: {
                            12: {
                                projectmanager: {
                                    key  : "projectmanager._id",
                                    value: [
                                        "55b92ad221e4b7c40f00004f",
                                        "55b92ad221e4b7c40f00005f"
                                    ],
                                    type : null
                                }
                            }
                        },
                        contentView: "Projects",
                        __v        : 0
                    },
                    viewType: "",
                    byDefault: ""
                },
                {
                    _id      : {
                        _id        : "56c711ab0769bba2647ae710",
                        filter: {
                            myP: {
                                projectmanager: {
                                    key  : "projectmanager._id",
                                    value: [
                                        "55b92ad221e4b7c40f00004f",
                                        "55b92ad221e4b7c40f00005f"
                                    ],
                                    type : null
                                },
                                workflow      : {
                                    key  : "workflow._id",
                                    value: [
                                        "528ce7f2f3f67bc40b000023",
                                        "528ce7d0f3f67bc40b000021",
                                        "528ce7e3f3f67bc40b000022"
                                    ],
                                    type : null
                                }
                            }
                        },
                        contentView: "Projects",
                        __v        : 0
                    },
                    viewType: "",
                    byDefault: "Projects"
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
                }
            ]
        }
    };
    var view;
    var topBarView;
    var listView;
    var kanbanView;
    var workflowCollection;
    var applicationCollection;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('ApplicationsView', function () {
        var $fixture;
        var $elFixture;
        var historyNavigateSpy;

        before(function () {
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
        });

        after(function () {
            view.remove();
            topBarView.remove();
            kanbanView.remove();
            listView.remove();

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

                server.respondWith('GET', '/getModules', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);
                view = new MainView({el: $elFixture, contentType: 'Applications'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;

            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="43"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="43"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Applications');
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

            it('Try to fetch application collection with error', function () {
                var applicationListUrl = new RegExp('\/applications', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', applicationListUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeApplicationsForList)]);
                applicationCollection = new ApplicationCollection({
                    contentType: 'Applications',
                    viewType   : 'list',
                    page       : 1,
                    count      : 2
                });
                server.respond();
                expect(historyNavigateSpy.calledOnce).to.be.true;
            });

            it('Try to create TopBarView', function () {
                var applicationListUrl = new RegExp('\/applications', 'i');

                server.respondWith('GET', applicationListUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeApplicationsForList)]);

                applicationCollection = new ApplicationCollection({
                    contentType: 'Applications',
                    viewType   : 'list',
                    page       : 1,
                    count      : 2
                });
                server.respond();

                expect(applicationCollection).to.have.lengthOf(2);

                topBarView = new TopBarView({
                    collection: applicationCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Applications');
            });

        });

        describe('Application KanbanView', function () {
            var server;
            var windowConfirmStub;
            var clock;
            var $thisEl;
            var foldUnfoldSpy;

            before(function () {
                window.location.hash = '#easyErp/Applications';
                App.currentViewType = 'kanban';
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                clock = sinon.useFakeTimers();
                foldUnfoldSpy = sinon.spy(KanBanView.prototype, 'foldUnfoldKanban');
            });

            after(function () {
                server.restore();
                clock.restore();
                windowConfirmStub.restore();
                foldUnfoldSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to application KanBanView', function (done) {
                    var workflowsUrl = new RegExp('\/Workflows', 'i');
                    var applicationUrl = '/applications/?workflowId=52d2c1369b57890814000005&viewType=kanban';
                    var applicationLengthUrl = new RegExp('\/applications\/getApplicationsLengthByWorkflows', 'i');

                    server.respondWith('GET', workflowsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWorkflows)]);
                    server.respondWith('GET', applicationLengthUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        showMore      : false,
                        arrayOfObjects: [
                            {
                                _id  : '52d2c1369b57890814000005',
                                count: 3
                            },
                            {
                                _id  : null,
                                count: 223
                            }
                        ]
                    })]);
                    workflowCollection = new WorkflowCollection({
                        id: 'Applications'
                    });
                    server.respond();

                    server.respondWith('GET', applicationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeApplication)]);
                    kanbanView = new KanBanView({
                        workflowCollection: workflowCollection
                    });
                    server.respond();
                    clock.tick(200);

                    $thisEl = kanbanView.$el;
                    expect($thisEl.find('.kanban')).to.exist;
                    expect($thisEl.find('.kanban .item').length).to.be.equals(3);
                    expect($thisEl.find('.item').first().find('.application-header > p').text().trim())
                        .to.not.equals('[object Object]');
                    expect($thisEl.find('.item').first().find('.application-header > p').text().trim())
                        .to.not.equals('undefined');

                    // bind ev events to topBarView
                    topBarView.bind('createEvent', kanbanView.createItem, kanbanView);
                    topBarView.bind('editEvent', kanbanView.editItem, kanbanView);
                    topBarView.bind('editKanban', kanbanView.editKanban, kanbanView);

                    done();
                });

                it('Try to fold|unfold kanban', function () {
                    var $foldBtn = $thisEl.find('tbody > tr > td:nth-child(7) .fold-unfold');
                    var currentUserUrl = '/users/current';
                    var $unfold;

                    // fold kanban column
                    server.respondWith('POST', currentUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        success: {
                            _id: '52203e707d4dba8813000003'
                        }
                    })]);
                    $foldBtn.click();
                    server.respond();
                    expect(foldUnfoldSpy.calledOnce).to.be.true;
                    expect($thisEl.find('tbody > tr > td:nth-child(7)')).to.have.class('fold');

                    // unfold
                    $unfold = $thisEl.find('tbody > tr > td:nth-child(7)');
                    $unfold.click();
                    server.respond();
                    expect(foldUnfoldSpy.calledTwice).to.be.true;
                    expect($thisEl.find('tbody > tr > td:nth-child(7)')).to.have.not.class('fold');
                });

                it('Try to open EditForm', function (done) {
                    var $needApplication = kanbanView.$el.find('.item').first();
                    var applicationUrl = new RegExp('\/applications\/', 'i');
                    var usersUrl = '/users/forDd';

                    server.respondWith('GET', applicationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeApplicationById)]);
                    server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsers)]);
                    $needApplication.dblclick();
                    server.respond();
                    server.respond();

                    clock.tick(2000);

                    expect($('.ui-dialog')).to.exist;

                    done();
                });

                it('Try to switch tabs', function () {
                    var $dialog = $('.ui-dialog');
                    var $firstTab = $dialog.find('.dialog-tabs li:nth-child(1) > a');
                    var $secondTab = $dialog.find('.dialog-tabs li:nth-child(2) > a');

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($secondTab).to.have.class('active');

                    $firstTab.click();
                    expect($firstTab).to.have.class('active');
                });

                it('Try to save application', function () {
                    var $next;
                    var $prev;
                    var $selectedItem;
                    var $saveBtn;
                    var $dialogEl = $('.ui-dialog');
                    var $nameInput = $dialogEl.find('#first');
                    var $relatedUserSelect = $dialogEl.find('#relatedUsersDd');
                    var applicationUrl = new RegExp('\/applications\/', 'i');

                    $nameInput.val('Test');
                    $relatedUserSelect.click();
                    $next = $dialogEl.find('.next');
                    $next.click();
                    $prev = $dialogEl.find('.prev');
                    $prev.click();
                    $selectedItem = $dialogEl.find('#560c099da5d4a2e20ba5068b');
                    $selectedItem.click();

                    $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');

                    server.respondWith('PATCH', applicationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                    expect(window.location.hash).to.be.equals('#easyErp/Applications');

                });

                it('Try delete item from edit form', function () {
                    var $deleteBtn;
                    var $needApplication = kanbanView.$el.find('#55b92ad221e4b7c40f000078');
                    var applicationUrl = new RegExp('\/applications\/', 'i');

                    windowConfirmStub.returns(true);

                    $needApplication.dblclick();
                    server.respond();
                    server.respond();

                    $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    server.respondWith('DELETE', applicationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                    expect(window.location.hash).to.be.equals('#easyErp/Applications');
                });

                it('Try to open kanban change settings view', function () {
                    var currentUserUrl = '/users/current';

                    server.respondWith('GET', currentUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCurrentUser)]);
                    kanbanView.editKanban();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to edit kanban settings view with 400 error status response', function () {
                    var currentUserUrl = '/users/current';
                    var $dialog = $('.ui-dialog');
                    var $countInput = $dialog.find('#cPerPage');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');

                    historyNavigateSpy.reset();

                    $countInput.val('0');
                    $countInput.trigger('change');

                    server.respondWith('POST', currentUserUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect(historyNavigateSpy.calledOnce).to.be.true;
                });

                it('Try to edit kanban settings view with 200 server response', function () {
                    var currentUserUrl = '/users/current';
                    var $dialog = $('.ui-dialog');
                    var $countInput = $dialog.find('#cPerPage');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');

                    historyNavigateSpy.reset();

                    $countInput.val('12');
                    $countInput.trigger('change');

                    server.respondWith('POST', currentUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        success: {
                            _id: '52203e707d4dba8813000003'
                        }
                    })]);
                    $saveBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                    expect(historyNavigateSpy.calledOnce).to.be.true;
                    expect(window.location.hash).to.be.equals('#easyErp/Applications');
                });

                it('Try to cancel kanban edit settings form', function () {
                    var currentUserUrl = '/users/current';
                    var $cancelBtn;

                    server.respondWith('GET', currentUserUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCurrentUser)]);
                    kanbanView.editKanban();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');

                    $cancelBtn.click();
                    expect($('.ui-dialog')).to.not.exist;
                });
            });
        });

        describe('Application ListView', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;
            var $thisEl;
            var chooseOptionSpy;

            before(function () {
                App.currentViewType = 'list';
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                mainSpy = sinon.spy(App, 'render');
                chooseOptionSpy = sinon.spy(ListView.prototype, 'chooseOption');
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                mainSpy.restore();
                chooseOptionSpy.restore();
            });

            describe('INITIALIZE', function () {
                it('Try to application ListView', function () {
                    var workflowUrl = new RegExp('\/Workflows', 'i');

                    server.respondWith('GET', workflowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWorkflows)]);
                    listView = new ListView({
                        collection: applicationCollection
                    });
                    server.respond();

                    $thisEl = listView.$el;

                    expect($thisEl.find('table')).to.have.class('list');
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);

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

                    applicationCollection.bind('showmore', listView.showMoreContent, listView);
                });

                it('Try to showMore applications with error response', function () {
                    var spyResponse;
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var applicationListUrl = new RegExp('\/applications', 'i');

                    server.respondWith('GET', applicationListUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeApplicationsForList)]);
                    $needBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Some Error.');
                });

                it('Try to showMore applications', function () {
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var applicationListUrl = new RegExp('\/applications', 'i');

                    server.respondWith('GET', applicationListUrl, [200, {'Content-Type': 'application/json'},
                        JSON.stringify(fakeApplicationsForList)]);
                    $needBtn.click();
                    server.respond();

                    expect(listView.$el.find('table')).to.have.class('list');
                });

                it('Try to change applications JobType', function () {
                    var $stageSelect = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(8) > a');
                    var $stageTd = $stageSelect.closest('td');
                    var applicationUrl = new RegExp('\/applications\/', 'i');
                    var $selectedItem;

                    // open select list
                    $stageSelect.click();
                    expect($stageTd.find('.newSelectList')).to.exist;

                    // close select list
                    $stageSelect.click();
                    expect($stageTd.find('.newSelectList')).to.not.exist;

                    // open select list
                    $stageSelect.click();
                    expect($stageTd.find('.newSelectList')).to.exist;

                    $selectedItem = $stageTd.find('.newSelectList > li').eq(1);
                    server.respondWith('PATCH', applicationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        _id: '56b9d49d8f23c5696159cd0c'
                    })]);
                    server.respondWith('GET', applicationUrl, [200, {'Content-Type': 'application/json'},
                        JSON.stringify(fakeApplicationsForList)]);

                    $selectedItem.click();
                    server.respond();
                    server.respond();

                    expect(chooseOptionSpy.calledOnce).to.be.true;
                });

                it('Try to go to EditForm with error response', function () {
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var applicationUrl = new RegExp('\/applications\/', 'i');
                    var spyResponse;

                    mainSpy.reset();
                    server.respondWith('GET', applicationUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $needTd.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please refresh browser');
                });

                it('Try to go to EditForm', function () {
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var applicationUrl = new RegExp('\/applications\/', 'i');
                    var usersUrl = '/users/forDd';

                    server.respondWith('GET', applicationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeApplicationById)]);
                    server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsers)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to switch tabs', function () {
                    var $dialog = $('.ui-dialog');
                    var $firstTab = $dialog.find('.dialog-tabs li:nth-child(1) > a');
                    var $secondTab = $dialog.find('.dialog-tabs li:nth-child(2) > a');

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($secondTab).to.have.class('active');

                    $firstTab.click();
                    expect($firstTab).to.have.class('active');
                });

                it('Try to add new job row', function () {
                    var $updateBtn;
                    var $hireDate;
                    var $dialogEl = $('.ui-dialog');
                    var $jobTab = $dialogEl.find('.dialog-tabs > li:nth-child(3) > a');

                    $jobTab.click();
                    $updateBtn = $dialogEl.find('#update');
                    $updateBtn.click();
                    $hireDate = $dialogEl.find('#hire2 > td[data-id="hireDate"]');
                    $hireDate.text('5 Apr, 2016');

                });

                /*it('Try to delete row in job table', function () {
                    var $dialogEl = $('.ui-dialog');
                    var $deleteRowBtn = $dialogEl.find('.fa-trash');

                    windowConfirmStub.returns(true);

                    $deleteRowBtn.click();
                });*/

                it('Try to edit job row', function () {
                    var $needInput;
                    var $dialogEl = $('.ui-dialog');
                    var $needTd = $dialogEl.find('#hire0 > td:nth-child(8)');

                    $needTd.click();
                    $needInput = $dialogEl.find('#hire0 > td:nth-child(8) > input');
                    $needInput.val('999');
                    $dialogEl.find('#hire0 > td:nth-child(7)').click();
                });

                it('Try to save application', function () {
                    var $next;
                    var $prev;
                    var $selectedItem;
                    var $saveBtn;
                    var $dialogEl = $('.ui-dialog');
                    var $nameInput = $dialogEl.find('#first');
                    var $relatedUserSelect = $dialogEl.find('#relatedUsersDd');
                    var applicationUrl = new RegExp('\/applications\/', 'i');

                    window.location.hash = '#easyErp/Applications';

                    $nameInput.val('Test');
                    $relatedUserSelect.click();
                    $next = $dialogEl.find('.next');
                    $next.click();
                    $prev = $dialogEl.find('.prev');
                    $prev.click();
                    $selectedItem = $dialogEl.find('#560c099da5d4a2e20ba5068b');
                    $selectedItem.click();

                    $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');

                    server.respondWith('PATCH', applicationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                    expect(window.location.hash).to.be.equals('#easyErp/Employees');

                });

                it('Try delete item from edit form', function () {
                    var $deleteBtn;
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var applicationUrl = new RegExp('\/applications\/', 'i');

                    window.location.hash = '#easyErp/Applications';

                    windowConfirmStub.returns(true);

                    $needTd.click();
                    server.respond();
                    server.respond();

                    $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    server.respondWith('DELETE', applicationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);

                    $deleteBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                    expect(window.location.hash).to.be.equals('#easyErp/Applications');
                });

            });
        });

        describe('Application CreateView', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;
            var createView;

            before(function () {
                App.currentViewType = 'list';
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm').returns(true);
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();

                createView.remove();
            });

            it('Try to create CreateView', function () {
                var usersUrl = '/users/forDd';

                server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsers)]);
                createView = new CreateView();
                server.respond();

                expect($('.ui-dialog')).to.exist;

            });

            it('Try to switch tabs', function () {
                var $dialog = $('.ui-dialog');
                var $firstTab = $dialog.find('.dialog-tabs li:nth-child(1) > a');
                var $secondTab = $dialog.find('.dialog-tabs li:nth-child(2) > a');

                expect($firstTab).to.have.class('active');

                $secondTab.click();
                expect($secondTab).to.have.class('active');

                $firstTab.click();
                expect($firstTab).to.have.class('active');
            });

            it('Try to save application', function () {
                var $selectedItem;
                var $prev;
                var $next;
                var $dialogEl = $('.ui-dialog');
                var $firstName = $dialogEl.find('#first');
                var $lastName = $dialogEl.find('#last');
                var $birthDate = $dialogEl.find('#dateBirth');
                var $relatedUserSelect = $dialogEl.find('#relatedUsersDd');
                var applicationUrl = new RegExp('/applications', 'i');
                var $createBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.create-app-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');

                $firstName.val('Test');
                $lastName.val('Test');
                $birthDate.val('5 Apr, 1991');
                $relatedUserSelect.click();
                $next = $dialogEl.find('.next');
                $next.click();
                $prev = $dialogEl.find('.prev');
                $prev.click();
                $selectedItem = $dialogEl.find('#560c099da5d4a2e20ba5068b');
                $selectedItem.click();

                server.respondWith('POST', applicationUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Created success'})]);
                $createBtn.click();
                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Applications');
            });
        });


    });


});
