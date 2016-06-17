define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/Applications/filterCollection',
    'collections/Workflows/WorkflowsCollection',
    'views/main/MainView',
    'views/Applications/list/ListView',
    'views/Applications/kanban/KanbanView',
    'views/Applications/TopBarView',
    'views/Applications/CreateView',
    'views/Applications/EditView',
    'helpers/eventsBinder',
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
             TopBarView,
             CreateView,
             EditView,
             eventsBinder,
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
            _id : "55bb1f14cb76ca630b000006",
            name: "Design"
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
                    _id : "55bb1f14cb76ca630b000006",
                    name: "Design"
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
                    _id : "55bb1f14cb76ca630b000006",
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
                    _id : "55bb1f14cb76ca630b000006",
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
                    _id : "55bb1f14cb76ca630b000006",
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
                    _id : "55bb1f14cb76ca630b000006",
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
                    _id : "55bb1f14cb76ca630b000006",
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
                    _id : "55bb1f14cb76ca630b000006",
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
        total: 300,
        data : [
            {
                _id          : "566ada96a74aaf316eaea69d",
                total        : 97,
                jobPosition  : {
                    name: "Junior JS",
                    _id : "55b92acf21e4b7c40f000017"
                },
                createdBy    : {
                    user: "AndrianaLemko"
                },
                editedBy     : {
                    user: "admin",
                    date: "2016-06-07T15:38:59.994Z"
                },
                department   : {
                    _id : "55b92ace21e4b7c40f000016",
                    name: "Web"
                },
                name         : {
                    last : "Gladovskyy",
                    first: "Maxim"
                },
                dateBirth    : "1988-06-21T00:00:00.000Z",
                skype        : "umkaline",
                workEmail    : "maxim.gladovskyy@thinkmobiles.com",
                workPhones   : {
                    phone : "",
                    mobile: "+380508039723"
                },
                jobType      : "fullTime",
                isEmployee   : false,
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
                personalEmail: "glmax132@gmail.com",
                sequence     : 1,
                hire         : [
                    "2015-12-07T22:00:00.000Z"
                ],
                fire         : [
                    "2016-05-30T21:00:00.000Z"
                ]
            },
            {
                _id          : "55b92ad221e4b7c40f0000c5",
                total        : 97,
                jobPosition  : {
                    name: "Junior iOS",
                    _id : "55b92acf21e4b7c40f00002c"
                },
                createdBy    : {
                    user: "admin"
                },
                editedBy     : {
                    user: "AndrianaLemko",
                    date: "2016-05-27T13:49:52.601Z"
                },
                department   : {
                    _id : "55b92ace21e4b7c40f00000f",
                    name: "iOS"
                },
                name         : {
                    last : "Gajdan",
                    first: "Michael"
                },
                dateBirth    : "1994-02-02T06:00:00.000Z",
                skype        : "misha.gajdan",
                workEmail    : "michael.gajdan@thinkmobiles.com",
                workPhones   : {
                    phone : "",
                    mobile: "+380508297842"
                },
                jobType      : "Full-time",
                isEmployee   : false,
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
                personalEmail: "",
                sequence     : 0,
                hire         : [
                    "2015-07-12T21:00:00.000Z"
                ],
                fire         : [
                    "2016-05-24T21:00:00.000Z"
                ]
            },
            {
                _id          : "55b92ad221e4b7c40f0000cb",
                total        : 97,
                jobPosition  : {
                    name: "Account Manager",
                    _id : "55b92acf21e4b7c40f00002e"
                },
                createdBy    : {
                    user: "admin"
                },
                editedBy     : {
                    user: "admin",
                    date: "2016-05-25T13:56:57.676Z"
                },
                department   : {
                    _id : "55b92ace21e4b7c40f000014",
                    name: "BusinessDev"
                },
                name         : {
                    last : "Yelahina",
                    first: "Alona"
                },
                dateBirth    : "1994-09-27T23:00:00.000Z",
                skype        : "aljona_sonce",
                workEmail    : "alona.yelahina@thinkmobiles.com",
                workPhones   : {
                    mobile: "+380990849677",
                    phone : ""
                },
                jobType      : "fullTime",
                isEmployee   : false,
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
                personalEmail: "aljonaelagina@gmail.com",
                sequence     : 0,
                hire         : [
                    "2015-07-12T00:00:00.000Z"
                ],
                fire         : [
                    "2016-05-19T00:00:00.000Z"
                ]
            }
        ]
    };
    var fakeCurrentUser = {
        user        : {
            _id            : "52203e707d4dba8813000003",
            attachments    : [],
            lastAccess     : "2016-06-01T05:59:09.300Z",
            profile        : {
                _id        : 1387275598000,
                profileName: "admin"
            },
            relatedEmployee: {
                _id     : "55b92ad221e4b7c40f00004f",
                name    : {
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
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: "salesInvoice"
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : {
                        _id        : "562b83ccb4677e225aa31df6",
                        filter     : {
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
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : {
                        _id        : "564dd4ce9fb8bc3f2195662c",
                        filter     : {
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
                                country : {
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
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : {
                        _id        : "566eba768453e8b464b70a40",
                        filter     : {
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
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : {
                        _id        : "56c711ab0769bba2647ae710",
                        filter     : {
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
                    viewType : "",
                    byDefault: "Projects"
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : {
                        _id        : "56dfe8e56e2877d85455a6bb",
                        filter     : {
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
                    viewType : "",
                    byDefault: "Leads"
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
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
            email          : "info@thinkmobiles.com",
            login          : "admin",
            imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
        },
        savedFilters: {
            undefined: [
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: "salesInvoice"
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : null,
                    viewType : "",
                    byDefault: "Employees"
                }
            ],
            Employees: [
                {
                    _id      : {
                        _id        : "562b83ccb4677e225aa31df6",
                        filter     : {
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
                    viewType : "",
                    byDefault: ""
                }
            ],
            Persons  : [
                {
                    _id      : {
                        _id        : "564dd4ce9fb8bc3f2195662c",
                        filter     : {
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
                                country : {
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
                    viewType : "",
                    byDefault: ""
                }
            ],
            Projects : [
                {
                    _id      : {
                        _id        : "566eba768453e8b464b70a40",
                        filter     : {
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
                    viewType : "",
                    byDefault: ""
                },
                {
                    _id      : {
                        _id        : "56c711ab0769bba2647ae710",
                        filter     : {
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
                    viewType : "",
                    byDefault: "Projects"
                }
            ],
            Leads    : [
                {
                    _id      : {
                        _id        : "56dfe8e56e2877d85455a6bb",
                        filter     : {
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
                    viewType : "",
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
    var ajaxSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('ApplicationsView', function () {
        var $fixture;
        var $elFixture;
        var historyNavigateSpy;

        before(function () {
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
            ajaxSpy = sinon.spy($, 'ajax');
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
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true,
                    showMore   : false
                });
                server.respond();
                expect(historyNavigateSpy.calledOnce).to.be.true;
                expect(historyNavigateSpy.args[0][0]).to.be.equals('#login');
            });

            it('Try to create TopBarView', function () {
                var applicationListUrl = new RegExp('\/applications', 'i');

                server.respondWith('GET', applicationListUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeApplicationsForList)]);

                applicationCollection = new ApplicationCollection({
                    contentType: 'Applications',
                    filter     : null,
                    viewType   : 'list',
                    count      : 100,
                    reset      : true,
                    showMore   : false
                });
                server.respond();

                expect(applicationCollection).to.have.lengthOf(3);

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

                    server.respondWith('GET', workflowsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWorkflows)]);
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
                    var $pagination;
                    var $currentPageList;
                    var $firstRow;
                    var colCount;
                    var name;
                    var email;
                    var phone;
                    var appliedJob;
                    var stage;
                    var jobType;
                    var createdBy;
                    var editedBy;

                    server.respondWith('GET', workflowUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeWorkflows)]);
                    listView = new ListView({
                        collection: applicationCollection
                    });
                    server.respond();

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(applicationCollection, listView);

                    applicationCollection.trigger('fetchFinished', {
                        totalRecords: applicationCollection.totalRecords,
                        currentPage : applicationCollection.currentPage,
                        pageSize    : applicationCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('table')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
                    expect($thisEl.find('#searchContainer')).to.exist;

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;
                    expect(colCount).to.be.equals(10);

                    name = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(name).not.to.be.empty;
                    expect(name).to.not.match(/object Object|undefined/);

                    email = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(email).to.not.match(/object Object|undefined/);

                    phone = $firstRow.find('td:nth-child(5) > a').text().trim();
                    expect(phone).to.not.match(/object Object|undefined/);

                    appliedJob = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(appliedJob).not.to.be.empty;
                    expect(appliedJob).to.not.match(/object Object|undefined/);

                    stage = $firstRow.find('td:nth-child(7) > a').text().trim();
                    expect(stage).not.to.be.empty;
                    expect(stage).to.not.match(/object Object|undefined/);

                    jobType = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(jobType).not.to.be.empty;
                    expect(jobType).to.not.match(/object Object|undefined/);

                    createdBy = $firstRow.find('td:nth-child(9)').text().trim();
                    expect(createdBy).not.to.be.empty;
                    expect(createdBy).to.not.match(/object Object|undefined/);

                    editedBy = $firstRow.find('td:nth-child(10)').text().trim();
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
                    expect(ajaxResponse).to.have.property('url', '/applications/');
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

                it('Try to change applications JobType', function () {
                    var $stageSelect = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(7) > a');
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
                    var $dialogEl = $('.ui-dialog');
                    var $nameInput = $dialogEl.find('#first');
                    var $relatedUserSelect = $dialogEl.find('#relatedUsersDd');
                    var applicationUrl = new RegExp('\/applications\/', 'i');
                    var $next;
                    var $prev;
                    var $selectedItem;
                    var $saveBtn;

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
                var $dialog;

                server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsers)]);
                createView = new CreateView();
                server.respond();

                $dialog = $('.ui-dialog');

                expect($dialog).to.exist;
                expect($dialog).to.have.lengthOf(1);
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
