define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'router',
    'collections/Departments/filterCollection',
    'views/main/MainView',
    'views/Departments/TopBarView',
    'views/Departments/CreateView',
    'views/Departments/EditView',
    'views/Departments/form/FormView',
    'views/Departments/list/ListView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone,
             modules,
             fixtures,
             router,
             DepartmentsCollection,
             MainView,
             TopBarView,
             CreateUserView,
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

    var fakeDepartments = {
        data: [
            {
                _id: "56cebdf6541812c07197358f",
                __v: 0,
                sequence: 9,
                nestingLevel: 0,
                editedBy: {
                    date: "2016-02-25T08:40:29.051Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2016-02-25T08:40:22.784Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: null,
                name: "Development"
            },
            {
                _id: "56e6775c5ec71b00429745a4",
                __v: 0,
                isDevelopment: false,
                sequence: 1,
                nestingLevel: 0,
                editedBy: {
                    date: "2016-05-06T13:59:56.345Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2016-03-14T08:33:32.754Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: null,
                name: "Service"
            },
            {
                _id: "566ee11b8453e8b464b70b73",
                __v: 0,
                isDevelopment: true,
                sequence: 8,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-04-12T07:48:44.518Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-12-14T15:32:43.470Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "56cebdf6541812c07197358f",
                    name: "Development"
                },
                name: "Ruby on Rails"
            },
            {
                _id: "56e175c4d62294582e10ca68",
                __v: 0,
                isDevelopment: true,
                sequence: 7,
                nestingLevel: 1,
                editedBy: {
                    user: null
                },
                createdBy: {
                    date: "2016-03-10T13:25:24.979Z",
                    user: "56dda0599fb95fbe18e3f8ed"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "56cebdf6541812c07197358f",
                    name: "Development"
                },
                name: "Unity"
            },
            {
                _id: "55bb1f14cb76ca630b000006",
                __v: 0,
                isDevelopment: true,
                sequence: 6,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-02-25T08:42:20.626Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-31T07:09:08.957Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: {
                    _id: "55b92ad221e4b7c40f000039",
                    name: {
                        last: "Rikun",
                        first: "Stas"
                    },
                    fullName: "Stas Rikun",
                    id: "55b92ad221e4b7c40f000039"
                },
                parentDepartment: {
                    _id: "56cebdf6541812c07197358f",
                    name: "Development"
                },
                name: "Design"
            },
            {
                _id: "55b92ace21e4b7c40f000011",
                ID: 3,
                __v: 0,
                isDevelopment: true,
                sequence: 5,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-02-25T08:41:16.215Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:38.908Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "56cebdf6541812c07197358f",
                    name: "Development"
                },
                name: "QA"
            },
            {
                _id: "55b92ace21e4b7c40f000010",
                ID: 2,
                __v: 0,
                isDevelopment: true,
                sequence: 4,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-02-25T08:41:11.006Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:38.908Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "56cebdf6541812c07197358f",
                    name: "Development"
                },
                name: "Android"
            },
            {
                _id: "55bb1f40cb76ca630b000007",
                __v: 0,
                isDevelopment: false,
                sequence: 4,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-03-30T11:20:27.579Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-31T07:09:52.155Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: {
                    _id: "55b92ad221e4b7c40f000030",
                    name: {
                        last: "Svatuk",
                        first: "Alex"
                    },
                    fullName: "Alex Svatuk",
                    id: "55b92ad221e4b7c40f000030"
                },
                parentDepartment: {
                    _id: "56e6775c5ec71b00429745a4",
                    name: "Service"
                },
                name: "PM"
            },
            {
                _id: "55b92ace21e4b7c40f00000f",
                ID: 1,
                __v: 0,
                isDevelopment: true,
                sequence: 3,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-02-25T08:41:05.787Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:38.907Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "56cebdf6541812c07197358f",
                    name: "Development"
                },
                name: "iOS"
            },
            {
                _id: "560c0b83a5d4a2e20ba5068c",
                __v: 0,
                isDevelopment: false,
                sequence: 3,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-03-14T08:34:18.225Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-09-30T16:19:15.986Z",
                    user: "560c099da5d4a2e20ba5068b"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "56e6775c5ec71b00429745a4",
                    name: "Service"
                },
                name: "Finance"
            },
            {
                _id: "55b92ace21e4b7c40f000015",
                ID: 7,
                __v: 0,
                isDevelopment: false,
                sequence: 2,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-03-14T08:34:09.729Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:38.909Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "56e6775c5ec71b00429745a4",
                    name: "Service"
                },
                name: "HR"
            },
            {
                _id: "55b92ace21e4b7c40f000012",
                ID: 4,
                __v: 0,
                isDevelopment: true,
                sequence: 1,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-02-25T08:40:48.233Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:38.909Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "56cebdf6541812c07197358f",
                    name: "Development"
                },
                name: ".NET/WP"
            },
            {
                _id: "55b92ace21e4b7c40f000014",
                ID: 6,
                __v: 0,
                isDevelopment: false,
                sequence: 1,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-03-14T08:34:00.655Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:38.909Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "56e6775c5ec71b00429745a4",
                    name: "Service"
                },
                name: "BusinessDev"
            },
            {
                _id: "55b92ace21e4b7c40f000013",
                ID: 5,
                __v: 0,
                isDevelopment: false,
                sequence: 0,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-03-14T08:33:47.375Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:38.909Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "56e6775c5ec71b00429745a4",
                    name: "Service"
                },
                name: "Marketing"
            },
            {
                _id: "55b92ace21e4b7c40f000016",
                ID: 8,
                __v: 0,
                isDevelopment: true,
                sequence: 0,
                nestingLevel: 1,
                editedBy: {
                    date: "2016-02-25T08:40:40.193Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:38.910Z",
                    user: "52203e707d4dba8813000003"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "56cebdf6541812c07197358f",
                    name: "Development"
                },
                name: "Web"
            },
            {
                _id: "56802ec21afe27f547b7ba53",
                __v: 0,
                isDevelopment: true,
                sequence: 2,
                nestingLevel: 2,
                editedBy: {
                    date: "2016-04-14T07:37:18.546Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-12-27T18:32:34.872Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "55b92ace21e4b7c40f000016",
                    name: "Web"
                },
                name: "PHP/WordPress"
            },
            {
                _id: "56802e9d1afe27f547b7ba51",
                __v: 0,
                isDevelopment: true,
                sequence: 1,
                nestingLevel: 2,
                editedBy: {
                    date: "2016-04-14T07:37:12.116Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-12-27T18:31:57.230Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "55b92ace21e4b7c40f000016",
                    name: "Web"
                },
                name: "CSS/FrontEnd"
            },
            {
                _id: "56802eb31afe27f547b7ba52",
                __v: 0,
                isDevelopment: true,
                sequence: 0,
                nestingLevel: 2,
                editedBy: {
                    date: "2016-04-14T07:36:58.416Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-12-27T18:32:19.543Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                users: [ ],
                departmentManager: null,
                parentDepartment: {
                    _id: "55b92ace21e4b7c40f000016",
                    name: "Web"
                },
                name: "JS"
            }
        ]
    };
    var fakeDepartmentForm = {
        _id              : "55b92ace21e4b7c40f000012",
        ID               : 4,
        __v              : 0,
        sequence         : 11,
        nestingLevel     : 0,
        editedBy         : {
            date: "2015-11-19T11:09:15.406Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v            : 0,
                attachments    : [],
                lastAccess     : "2016-02-29T11:23:17.225Z",
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
                        _id      : "56c30bc6114d646c263cde43",
                        viewType : "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56d07871b5057fdb22ff9096",
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
                        countPerPage : 10
                    }
                },
                credentials    : {
                    access_token : "",
                    refresh_token: ""
                },
                pass           : "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                email          : "info@thinkmobiles.com",
                login          : "admin",
                imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        createdBy        : {
            date: "2015-07-29T19:34:38.909Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v            : 0,
                attachments    : [],
                lastAccess     : "2016-02-29T11:23:17.225Z",
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
                        _id      : "56c30bc6114d646c263cde43",
                        viewType : "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56d07871b5057fdb22ff9096",
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
                        countPerPage : 10
                    }
                },
                credentials    : {
                    access_token : "",
                    refresh_token: ""
                },
                pass           : "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                email          : "info@thinkmobiles.com",
                login          : "admin",
                imageSrc       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC"
            }
        },
        users            : [],
        departmentManager: null,
        parentDepartment : null,
        departmentName   : ".NET/WP"
    };
    var fakePersonsForDD = {
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
                _id     : "56b3412299ce8d706a81b2cd",
                name    : {
                    last : "Kholtobin",
                    first: "Mykola"
                },
                fullName: "Mykola Kholtobin",
                id      : "56b3412299ce8d706a81b2cd"
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
                _id     : "55b92ad221e4b7c40f00007a",
                name    : {
                    last : "Fogash",
                    first: "Robert"
                },
                fullName: "Robert Fogash",
                id      : "55b92ad221e4b7c40f00007a"
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
                _id     : "55b92ad221e4b7c40f00004c",
                name    : {
                    last : "Nayda",
                    first: "Sofia"
                },
                fullName: "Sofia Nayda",
                id      : "55b92ad221e4b7c40f00004c"
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
    var view;
    var topBarView;
    var listView;
    var depsCollection;
    var expect;
    var historyNavigateSpy;
    var ajaxSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('Departments view', function () {
        var $fixture;
        var $elFixture;
        var alertStub;

        before(function () {
            alertStub = sinon.stub(window, 'alert');
            alertStub.returns(true);

            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
            ajaxSpy = sinon.spy($, 'ajax');
        });

        after(function () {
            var $dialogs = $('.ui-dialog');
            view.remove();
            topBarView.remove();
            listView.remove();

            if ($dialogs.length) {
                $dialogs.remove();
            }

            alertStub.restore();
            historyNavigateSpy.restore();
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

                view = new MainView({el: $elFixture, contentType: 'Departments'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="15"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="15"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Departments');
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
                var depsUrl = new RegExp('\/Departments\/', 'i');

                server.respondWith('GET', depsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepartments)]);
                depsCollection = new DepartmentsCollection({
                    contentType: 'Departments',
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true,
                    showMore   : false
                });
                server.respond();

                expect(depsCollection).to.have.lengthOf(18);

                topBarView = new TopBarView({
                    collection: depsCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Departments');
                expect(topBarView.$el.find('#template-switcher')).to.exist;
            });
        });

        describe('Department list view', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;
            var clock;
            var $thisEl;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                clock = sinon.useFakeTimers();
            });

            after(function () {
                windowConfirmStub.restore();
                server.restore();
                mainSpy.restore();
                clock.restore();
            });

            it('Try to create departments list view', function (done) {
                var $listContainerEl;

                listView = new ListView({
                    collection   : depsCollection,
                    startTime    : new Date(),
                    newCollection: true,
                    page         : 1
                });

                eventsBinder.subscribeTopBarEvents(topBarView, listView);
                eventsBinder.subscribeCollectionEvents(depsCollection, listView);

                depsCollection.trigger('fetchFinished', {
                    totalRecords: depsCollection.totalRecords,
                    currentPage : depsCollection.currentPage,
                    pageSize    : depsCollection.pageSize
                });

                clock.tick(500);

                $thisEl = listView.$el;
                $listContainerEl = $thisEl.find('ul');
                403
                expect($listContainerEl).to.exist;
                expect($listContainerEl.find('li').length).to.be.above(1);
                expect($listContainerEl).to.have.class('ui-sortable');
                expect($listContainerEl).to.have.id('groupList');

                done();
            });

            it('Try to delete item with some error with error response not equals 403', function () {
                var $deleteBtn = listView.$el.find('#groupList > li:nth-child(1) > span > span.text > span.trash');
                var departmentsUrl = new RegExp('\/Departments\/', 'i');

                historyNavigateSpy.reset();

                windowConfirmStub.returns(true);
                server.respondWith('DELETE', departmentsUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $deleteBtn.click();
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
                expect(historyNavigateSpy.args[0][0]).to.be.equals('home');
            });

            it('Try to delete item with 403 error', function () {
                var $deleteBtn = listView.$el.find('#groupList > li:nth-child(1) > span > span.text > span.trash');
                var departmentsUrl = new RegExp('\/Departments\/', 'i');
                var spyResponse;

                windowConfirmStub.returns(true);
                server.respondWith('DELETE', departmentsUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $deleteBtn.click();
                server.respond();
                spyResponse = mainSpy.args[0][0];

                expect(spyResponse).to.have.property('type', 'error');
                expect(windowConfirmStub.called).to.be.true;
            });

            it('Try to delete item', function () {
                var $deleteBtn = listView.$el.find('#groupList > li:nth-child(1) > span > span.text > span.trash');
                var departmentsUrl = new RegExp('\/Departments\/', 'i');

                window.location.hash = '#easyErp/Departments';

                windowConfirmStub.returns(true);
                server.respondWith('DELETE', departmentsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $deleteBtn.click();
                server.respond();

                expect(windowConfirmStub.called).to.be.true;
                expect(window.location.hash).to.equals('#easyErp/Departments');
                expect(listView.$el.find('#groupList > li:nth-child(1)').attr('data-id')).to.be.equals('56e6775c5ec71b00429745a4');
            });

            it('Try to edit item with error of  /Departments/form/?id=55b92ace21e4b7c40f000012', function () {
                var spyResponse;
                var $needLiEl = listView.$el.find('#groupList > li:nth-child(1)');
                var departmentsUrl = new RegExp('\/Departments\/', 'i');

                server.respondWith('GET', departmentsUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(new Error())]);
                $needLiEl.click();

                server.respond();
                spyResponse = mainSpy.args[1][0];

                expect(spyResponse).to.have.property('type', 'error');
            });

            it('Try to open edit form', function () {
                var $needLiEl = listView.$el.find('#groupList > li:nth-child(1)');
                var depFormUrl = new RegExp('\/Departments\/', 'i');
                var usersUrl = new RegExp('\/users\/forDd', 'i');
                var employeesUrl = new RegExp('\/employees\/getForDd', 'i');
                var $dialogContainerEl;

                server.respondWith('GET', depFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepartmentForm)]);
                server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', employeesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakePersonsForDD)]);
                $needLiEl.click();
                server.respond();
                server.respond();

                $dialogContainerEl = $('#dialogContainer');

                expect($dialogContainerEl).to.exist;
                expect($('.dialog-tabs')).to.exist;
                expect($('#parentDepartment')).to.have.text('Select');
                expect($('#departmentManager')).to.have.text('Select');
            });

            it('Try change tab', function () {
                var $firstDialogTabEl = $('.dialog-tabs > li:nth-child(1) > a');
                var $secondDialogTabEl = $('.dialog-tabs > li:nth-child(2) > a');

                expect($firstDialogTabEl).to.have.class('active');

                $secondDialogTabEl.click();
                expect($('.dialog-tabs > li:nth-child(2) > a')).to.have.class('active');

                $firstDialogTabEl.click();
                expect($('.dialog-tabs > li:nth-child(1) > a')).to.have.class('active');

            });

            it('Try to edit item', function () {
                var $nextBtn;
                var $prevBtn;
                var $nextUserList;
                var $prevUserList;
                var $select;
                var $deleteSelect;
                var $dialogEl = $('.ui-dialog');
                var $managerBtn = $dialogEl.find('#departmentManager');
                var $secondTabEl = $dialogEl.find('li:nth-child(2) > a');
                var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)')
                var departmentUrl = new RegExp('\/Departments\/', 'i');

                $managerBtn.click();
                $nextBtn = $dialogEl.find('.next');
                $nextBtn.click();
                $prevBtn = $dialogEl.find('.prev');
                $prevBtn.click();
                $select = $dialogEl.find('#55b92ad221e4b7c40f000084');
                $select.click();

                $secondTabEl.click();
                $nextUserList = $dialogEl.find('.nextUserList');
                $nextUserList.click();
                $prevUserList = $dialogEl.find('.prevUserList');
                $prevUserList.click();
                $select = $dialogEl.find('#560c099da5d4a2e20ba5068b');
                $select.click();
                $select = $dialogEl.find('#55cb7302fea413b50b000007');
                $select.click();
                $deleteSelect = $dialogEl.find('#55cb7302fea413b50b000007');
                $deleteSelect.click();

                server.respondWith('PUT', departmentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                $saveBtn.click();
                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Departments');
            });

            it('Try to delete item from edit form with error', function () {
                var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                var departmentUrl = new RegExp('\/Departments\/', 'i');
                var spyResponse;

                server.respondWith('DELETE', departmentUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Deleted success'})]);
                $deleteBtn.click();
                server.respond();
                spyResponse = mainSpy.args[2][0];

                expect(spyResponse).to.have.property('type', 'error');
            });

            it('Try to delete item from edit form', function () {
                var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                var departmentUrl = new RegExp('\/Departments\/', 'i');

                windowConfirmStub.returns(true);

                server.respondWith('DELETE', departmentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Deleted success'})]);
                $deleteBtn.click();
                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Departments');
            });

        });

        describe('CreateView', function () {
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
            });

            it('Try to open CreateView', function (done) {
                var $dialogContainerEl;
                var depFormUrl = new RegExp('\/Departments\/form\/', 'i');
                var usersUrl = new RegExp('\/users\/forDd', 'i');
                var createBtn = topBarView.$el.find('#top-bar-createBtn');
                var employeesUrl = new RegExp('\/employees\/getForDd', 'i');

                server.respondWith('GET', depFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDepartmentForm)]);
                server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsersForDD)]);
                server.respondWith('GET', employeesUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakePersonsForDD)]);
                createBtn.click();
                server.respond();
                server.respond();

                clock.tick(200);

                $dialogContainerEl = $('#dialogContainer');

                expect($dialogContainerEl).to.exist;
                expect($('.dialog-tabs')).to.exist;
                expect($('#parentDepartment')).to.have.text('Select');
                expect($('#departmentManager')).to.have.text('Select');

                done();
            });

            it('Try change tab', function () {
                var $firstDialogTabEl = $('.dialog-tabs > li:nth-child(1) > a');
                var $secondDialogTabEl = $('.dialog-tabs > li:nth-child(2) > a');

                expect($firstDialogTabEl).to.have.class('active');

                $secondDialogTabEl.click();
                expect($('.dialog-tabs > li:nth-child(2) > a')).to.have.class('active');

                $firstDialogTabEl.click();
                expect($('.dialog-tabs > li:nth-child(1) > a')).to.have.class('active');
            });

            it('Try to create item with error result', function (done) {
                var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.create-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)')
                var departmentUrl = new RegExp('\/Departments\/', 'i');
                var spyResponse;

                server.respondWith('POST', departmentUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                $saveBtn.click();
                server.respond();

                clock.tick(200);

                spyResponse = mainSpy.args[0][0];

                expect(spyResponse).to.have.property('type', 'error');

                done();
            });

            it('Try to create item', function () {
                var $nextBtn;
                var $prevBtn;
                var $nextUserList;
                var $prevUserList;
                var $select;
                var $deleteSelect;
                var $dialogEl = $('.ui-dialog');
                var $managerBtn = $dialogEl.find('#departmentManager');
                var $secondTabEl = $dialogEl.find('li:nth-child(2) > a');
                var $depNameInput = $dialogEl.find('#departmentName');
                var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.create-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)')
                var departmentUrl = new RegExp('\/Departments\/', 'i');

                $depNameInput.val('Test department');
                $managerBtn.click();
                $nextBtn = $dialogEl.find('.next');
                $nextBtn.click();
                $prevBtn = $dialogEl.find('.prev');
                $prevBtn.click();
                $select = $dialogEl.find('#55b92ad221e4b7c40f000084');
                $select.click();

                $secondTabEl.click();
                $nextUserList = $dialogEl.find('.nextUserList');
                $nextUserList.click();
                $prevUserList = $dialogEl.find('.prevUserList');
                $prevUserList.click();
                $select = $dialogEl.find('#560c099da5d4a2e20ba5068b');
                $select.click();
                $select = $dialogEl.find('#55cb7302fea413b50b000007');
                $select.click();
                $deleteSelect = $dialogEl.find('#55cb7302fea413b50b000007');
                $deleteSelect.click();


                server.respondWith('POST', departmentUrl, [201, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                $saveBtn.click();
                server.respond();

                expect(window.location.hash).to.be.equals('#easyErp/Departments');
            });

            it('Try to cancel form', function () {
                var $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.create-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                $cancelBtn.click();

                expect($('.ui-dialog')).to.not.exist;
            });
        });

    });


});
