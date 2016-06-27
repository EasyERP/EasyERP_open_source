define([
    'Backbone',
    'Underscore',
    'modules',
    'text!fixtures/index.html',
    'collections/ExpensesInvoice/filterCollection',
    'views/main/MainView',
    'views/ExpensesInvoice/list/ListView',
    'views/ExpensesInvoice/TopBarView',
    'views/ExpensesInvoice/EditView',
    'views/Filter/filterView',
    'views/Filter/filtersGroup',
    'views/Filter/savedFiltersView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone, _, modules, fixtures, InvoiceCollection, MainView, ListView, TopBarView, EditView, FilterView, FilterGroup, SavedFilters, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var expect;
    var fakeInvoice = {
        total: 300,
        data: [
            {
                _id: "572c94cb1d7bd6eb38d58664",
                total: 21,
                workflow: {
                    _id: "55647d982e4aa3804a765ecb",
                    status: "Done",
                    name: "Paid"
                },
                supplier: {
                    _id: "572c750c7ae8db5b4e0b854a",
                    name: {
                        last: "",
                        first: "End User"
                    }
                },
                currency: {
                    _id: "565eab29aeb95fa9c0f9df2d",
                    rate: 1
                },
                paymentInfo: {
                    total: 600000,
                    balance: 0,
                    unTaxed: 600000,
                    taxes: 0
                },
                invoiceDate: "2014-08-30T22:00:00.000Z",
                name: "08/2014",
                paymentDate: "2014-09-29T22:00:00.000Z",
                dueDate: "2014-09-29T22:00:00.000Z",
                approved: true,
                removable: true,
                paid: 6000
            },
            {
                _id: "572c95064b6e6975397be5fd",
                total: 21,
                workflow: {
                    _id: "55647d982e4aa3804a765ecb",
                    status: "Done",
                    name: "Paid"
                },
                supplier: {
                    _id: "572c750c7ae8db5b4e0b854a",
                    name: {
                        last: "",
                        first: "End User"
                    }
                },
                currency: {
                    _id: "565eab29aeb95fa9c0f9df2d",
                    rate: 1
                },
                paymentInfo: {
                    total: 1032100,
                    balance: 0,
                    unTaxed: 1032100,
                    taxes: 0
                },
                invoiceDate: "2014-09-29T22:00:00.000Z",
                name: "09/2014",
                paymentDate: "2014-09-29T22:00:00.000Z",
                dueDate: "2014-09-29T22:00:00.000Z",
                approved: true,
                removable: true,
                paid: 10321
            },
            {
                _id: "572c952fd4aabbca384eefa6",
                total: 21,
                workflow: {
                    _id: "55647d982e4aa3804a765ecb",
                    status: "Done",
                    name: "Paid"
                },
                supplier: {
                    _id: "572c750c7ae8db5b4e0b854a",
                    name: {
                        last: "",
                        first: "End User"
                    }
                },
                currency: {
                    _id: "565eab29aeb95fa9c0f9df2d",
                    rate: 1
                },
                paymentInfo: {
                    total: 843500,
                    balance: 0,
                    unTaxed: 843500,
                    taxes: 0
                },
                invoiceDate: "2014-10-30T23:00:00.000Z",
                name: "10/2014",
                paymentDate: "2014-10-30T23:00:00.000Z",
                dueDate: "2014-10-30T23:00:00.000Z",
                approved: true,
                removable: true,
                paid: 8435
            },
            {
                _id: "572c9587487014c939a3d0fc",
                total: 21,
                workflow: {
                    _id: "55647d982e4aa3804a765ecb",
                    status: "Done",
                    name: "Paid"
                },
                supplier: {
                    _id: "572c750c7ae8db5b4e0b854a",
                    name: {
                        last: "",
                        first: "End User"
                    }
                },
                currency: {
                    _id: "565eab29aeb95fa9c0f9df2d",
                    rate: 1
                },
                paymentInfo: {
                    total: 901600,
                    balance: 0,
                    unTaxed: 901600,
                    taxes: 0
                },
                invoiceDate: "2014-12-30T23:00:00.000Z",
                name: "12/2014",
                paymentDate: "2014-12-30T23:00:00.000Z",
                dueDate: "2014-12-30T23:00:00.000Z",
                approved: true,
                removable: true,
                paid: 9016
            }]
    };
    var fakeInvoiceById = {
        _id             : "55b92ae121e4b7c40f001275",
        paymentDate     : "2015-01-29T04:00:00.000Z",
        dueDate         : "2015-02-13T12:09:15.273Z",
        ID              : 141,
        editedBy        : {
            date: "2015-07-29T19:34:57.678Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v           : 0,
                attachments   : [],
                credentials   : {
                    access_token : "",
                    refresh_token: ""
                },
                email         : "info@thinkmobiles.com",
                kanbanSettings: {
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
                lastAccess    : "2016-05-18T07:28:11.790Z",
                login         : "admin",
                pass          : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                profile       : 1387275598000,
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                savedFilters  : [
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
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    },
                    {
                        _id      : "56f3d039c1785edc507e81ea",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5708ca211d118cb6401008cc",
                        viewType: "",
                        byDefault: "Employees"
                    }
                ],
                relatedEmployee: "55b92ad221e4b7c40f00004f"
            }
        },
        createdBy       : {
            date: "2015-07-29T19:34:57.678Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v: 0,
                attachments: [],
                credentials: {
                    access_token : "",
                    refresh_token: ""
                },
                email      : "info@thinkmobiles.com",
                kanbanSettings: {
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
                lastAccess    : "2016-05-18T07:28:11.790Z",
                login         : "admin",
                pass          : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                profile       : 1387275598000,
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                savedFilters  : [
                    {
                        _id      : "56213057c558b13c1bbf874d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5621307bc558b13c1bbf874f",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213103c558b13c1bbf8750",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56213197c558b13c1bbf8751",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56215e86c558b13c1bbf8755",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56229009184ec5a427913306",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id      : "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    },
                    {
                        _id      : "56f3d039c1785edc507e81ea",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5708ca211d118cb6401008cc",
                        viewType: "",
                        byDefault: "Employees"
                    }
                ],
                relatedEmployee: "55b92ad221e4b7c40f00004f"
            }
        },
        creationDate    : "2015-07-29T19:34:57.678Z",
        groups          : {
            group: [],
            users: [],
            owner: null
        },
        whoCanRW        : "everyOne",
        workflow        : {
            _id   : "55647d982e4aa3804a765ecb",
            status: "Done",
            name  : "Paid"
        },
        products        : [
            {
                subTotal   : 100000,
                unitPrice: 100000,
                taxes    : 0,
                jobs     : {
                    _id      : "564cfd8ba6e6390160c9ee2c",
                    budget: {
                        budgetTotal: {
                            minDate   : 201445,
                            maxDate: 201446,
                            hoursSum: 104,
                            revenueSum: 100000,
                            costSum   : 35900
                        },
                        projectTeam: [
                            {
                                budget    : {
                                    hoursSum  : 72,
                                    revenueSum: 69230.76923076923,
                                    costSum   : 20700
                                },
                                employee: {
                                    name       : {
                                        first: "Antonina",
                                        last : "Zhuk"
                                    },
                                    jobPosition: {
                                        name: "Junior Android",
                                        _id : "55b92acf21e4b7c40f000021"
                                    },
                                    _id        : "55b92ad221e4b7c40f000083"
                                },
                                department: {
                                    departmentName: "Android",
                                    _id           : "55b92ace21e4b7c40f000010"
                                }
                            },
                            {
                                budget    : {
                                    hoursSum  : 32,
                                    revenueSum: 30769.230769230773,
                                    costSum   : 15200
                                },
                                employee: {
                                    name       : {
                                        first: "Ilya",
                                        last : "Mondok"
                                    },
                                    jobPosition: {
                                        name: "Junior Android",
                                        _id : "55b92acf21e4b7c40f000021"
                                    },
                                    _id        : "55b92ad221e4b7c40f000035"
                                },
                                department: {
                                    departmentName: "Android",
                                    _id           : "55b92ace21e4b7c40f000010"
                                }
                            }
                        ]
                    },
                    project: "55b92ad621e4b7c40f0006ad",
                    wTracks: [
                        "55b92ad921e4b7c40f0008a5",
                        "55b92ad921e4b7c40f0008ac",
                        "55b92ad921e4b7c40f0008b5"
                    ],
                    type   : "Invoiced",
                    workflow: "56337c675d49d8d6537832ea",
                    name    : "KX keyboard49-30/01/15",
                    __v     : 0,
                    quotation: "564cfd8ba6e6390160c9efa3",
                    invoice  : "55b92ae121e4b7c40f001275",
                    payments : [
                        "55b92ae221e4b7c40f00138f"
                    ],
                    editedBy : {
                        date: "2016-02-08T09:53:54.131Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        user: "52203e707d4dba8813000003",
                        date: "2015-07-29T19:34:49.815Z"
                    }
                },
                description: "",
                product    : {
                    _id              : "5540d528dacb551c24000003",
                    editedBy: {
                        date: "2015-10-30T14:18:42.379Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-04-29T12:57:12.785Z",
                        user: null
                    },
                    creationDate: "2015-04-29T12:57:12.785Z",
                    groups      : {
                        group: [],
                        users: [],
                        owner: "560c099da5d4a2e20ba5068b"
                    },
                    whoCanRW    : "everyOne",
                    workflow    : null,
                    info        : {
                        description: "",
                        barcode    : "",
                        isActive   : true,
                        salePrice  : 0,
                        productType: "Service"
                    },
                    name        : "IT services",
                    imageSrc    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    canBePurchased: true,
                    eventSubscription: true,
                    canBeExpensed    : true,
                    canBeSold        : true,
                    __v              : 0,
                    accounting       : {
                        category: {
                            name: ""
                        }
                    }
                },
                quantity   : 1
            }
        ],
        payments        : [
            {
                _id       : "55b92ae221e4b7c40f00138f",
                paymentRef: "",
                name      : "1125_2516",
                date      : "2015-01-29T04:00:00.000Z",
                paidAmount: 100000
            }
        ],
        paymentInfo     : {
            taxes  : 0,
            unTaxed: 100000,
            balance: 0,
            total  : 100000
        },
        paymentTerms    : null,
        salesPerson     : "55b92ad221e4b7c40f00004b",
        invoiceDate     : "2015-01-27T04:00:00.273Z",
        project         : {
            _id: "55b92ad621e4b7c40f0006ad"
        },
        paymentReference: "free",
        sourceDocument  : {
            _id           : "564cfd8ba6e6390160c9efa3",
            editedBy: {
                date: "2015-11-18T22:36:59.697Z",
                user: null
            },
            createdBy: {
                date: "2015-11-18T22:36:59.696Z",
                user: null
            },
            creationDate: "2015-11-18T22:36:59.696Z",
            groups      : {
                group: [],
                users: [],
                owner: null
            },
            whoCanRW    : "everyOne",
            workflow    : "55647b962e4aa3804a765ec6",
            products    : [
                {
                    scheduledDate: "2015-01-27T12:09:15.273Z",
                    jobs         : "564cfd8ba6e6390160c9ee2c",
                    description  : "",
                    product      : "5540d528dacb551c24000003",
                    unitPrice    : 100000,
                    subTotal     : 100000,
                    taxes        : 0,
                    quantity     : 104
                }
            ],
            paymentInfo : {
                total  : 100000,
                unTaxed: 100000,
                taxes  : 0
            },
            paymentTerm : null,
            invoiceRecived: true,
            invoiceControl: null,
            incoterm      : null,
            destination   : null,
            name          : "PO17",
            orderDate     : "2015-01-27T12:09:15.273Z",
            deliverTo     : null,
            project       : "55b92ad621e4b7c40f0006ad",
            supplier      : "55b92ad621e4b7c40f000645",
            isOrder       : true,
            forSales      : true,
            __v           : 0,
            type          : "Invoiced",
            currency      : {
                rate: 1,
                _id : "565eab29aeb95fa9c0f9df2d"
            }
        },
        supplier        : {
            _id : "55b92ad621e4b7c40f000645",
            name: {
                last : "",
                first: "Vlad"
            }
        },
        forSales        : true,
        invoiceType     : "wTrack",
        name            : "49-30/01/15",
        __v             : 0,
        _type           : "wTrackInvoice",
        currency        : {
            _id : {
                _id     : "565eab29aeb95fa9c0f9df2d",
                name: "USD",
                sequence: 0
            },
            rate: 1
        },
        approved        : true,
        reconcile       : true,
        attachments     : [],
        removable       : false
    };
    var fakeProduct = {
        success: [
            {
                _id              : "5540d528dacb551c24000003",
                __v: 0,
                editedBy: {
                    date: "2015-10-30T14:18:42.379Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-04-29T12:57:12.785Z",
                    user: null
                },
                creationDate: "2015-04-29T12:57:12.785Z",
                groups      : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW    : "everyOne",
                workflow    : null,
                accounting  : {
                    category: {
                        name: "",
                        _id : null
                    }
                },
                info        : {
                    description: "",
                    barcode    : "",
                    isActive   : true,
                    salePrice  : 0,
                    productType: "Service"
                },
                name        : "IT services",
                imageSrc    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                canBePurchased: true,
                eventSubscription: true,
                canBeExpensed    : true,
                canBeSold        : true,
                wTrack           : null
            },
            {
                _id              : "55c0e4a30343b37542000005",
                __v: 0,
                editedBy: {
                    date: "2016-04-18T14:50:39.186Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-08-04T16:13:23.246Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-08-04T16:13:23.246Z",
                groups      : {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW    : "everyOne",
                workflow    : null,
                accounting  : {
                    category: {
                        name: "",
                        _id : null
                    }
                },
                info        : {
                    description: "",
                    barcode    : "",
                    isActive   : true,
                    salePrice  : 0,
                    productType: "Service"
                },
                name        : "Bank expenses",
                imageSrc    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                canBePurchased: true,
                eventSubscription: true,
                canBeExpensed    : true,
                canBeSold        : true,
                wTrack           : null
            },
            {
                _id              : "5715fdf09a56725721b14df0",
                __v: 0,
                editedBy: {
                    date: "2016-04-19T09:44:16.940Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2016-04-19T09:44:16.940Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2016-04-19T09:44:16.940Z",
                groups      : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW    : "everyOne",
                workflow    : null,
                accounting  : {
                    category: {
                        name: "All ",
                        _id : "564591f9624e48551dfe3b23"
                    }
                },
                info        : {
                    description: "",
                    barcode    : "Test",
                    isActive   : true,
                    salePrice  : 0,
                    productType: null
                },
                name        : "TEST",
                imageSrc    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                canBePurchased: true,
                eventSubscription: true,
                canBeExpensed    : false,
                canBeSold        : false,
                wTrack           : null
            }
        ]
    };
    var view;
    var topBarView;
    var listView;
    var invoiceCollection;
    var ajaxSpy;
    var historyNavigateSpy;
    var selectSpy;
    var removeFilterSpy;
    var saveFilterSpy;
    var removedFromDBSpy;
    var debounceStub;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('expenseInvoiceView', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            ajaxSpy = sinon.spy($, 'ajax');
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
            selectSpy = sinon.spy(FilterGroup.prototype, 'selectValue');
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
            saveFilterSpy = sinon.spy(SavedFilters.prototype, 'saveFilter');
            removedFromDBSpy = sinon.spy(SavedFilters.prototype, 'removeFilterFromDB');
            debounceStub = sinon.stub(_, 'debounce', function (debFunction) {
                return debFunction;
            });
        });

        after(function () {
            topBarView.remove();
            listView.remove();
            view.remove();

            if ($('.ui-dialog').length) {
                $('.ui-dialog').remove();
            }

            ajaxSpy.restore();
            historyNavigateSpy.restore();
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
                view = new MainView({el: $elFixture, contentType: 'ExpensesInvoice'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="97"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="97"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/ExpensesInvoice');
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
                var invoiceUrl = new RegExp('\/invoices\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', invoiceUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                invoiceCollection = new InvoiceCollection({
                    contentType: 'ExpensesInvoice',
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true,
                    showMore   : true
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
                expect(historyNavigateSpy.args[0][0]).to.be.equals('#login');
            });

            it('Try to create TopBarView', function () {
                var invoiceUrl = new RegExp('\/invoices\/', 'i');

                server.respondWith('GET', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoice)]);
                invoiceCollection = new InvoiceCollection({
                    contentType: 'ExpensesInvoice',
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true
                });
                server.respond();

                expect(invoiceCollection).to.have.lengthOf(4);

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: invoiceCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Expenses');
            });
        });

        describe('InvoiceListView', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var windowConfirmStub;
            var goToEditSpy;
            var editViewSpy;
            var deleteSpy;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                goToEditSpy = sinon.spy(ListView.prototype, 'gotoForm');
                editViewSpy = sinon.spy(EditView.prototype, 'initialize');
                deleteSpy = sinon.spy(ListView.prototype, 'deleteItems');
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                goToEditSpy.restore();
                editViewSpy.restore();
                deleteSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to invoice ListView', function (done) {
                    var $firstRow;
                    var colCount;
                    var customer;
                    var invNumber;
                    var payDate;
                    var assigned;
                    var due;
                    var balance;
                    var paid;
                    var total;
                    var status;
                    var $pagination;
                    var $pageList;

                    listView = new ListView({
                        startTime : new Date(),
                        collection: invoiceCollection
                    });

                    clock.tick(200);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(invoiceCollection, listView);

                    invoiceCollection.trigger('fetchFinished', {
                        totalRecords: invoiceCollection.totalRecords,
                        currentPage : invoiceCollection.currentPage,
                        pageSize    : invoiceCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('.list')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(4);
                    expect($thisEl.find('#searchContainer')).to.exist;

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;

                    expect(colCount).to.be.equals(11);

                    customer = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(customer).to.not.match(/object Object|undefined/);

                    invNumber = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(invNumber).to.not.empty;
                    expect(invNumber).to.not.match(/object Object|undefined/);

                    payDate = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(payDate).to.not.match(/object Object|undefined/);

                    assigned = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(assigned).to.not.empty;
                    expect(assigned).to.not.match(/object Object|undefined/)

                    due = $firstRow.find('td:nth-child(7)').text().trim();
                    expect(due).to.not.empty;
                    expect(due).to.not.match(/object Object|undefined/);

                    balance = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(balance).to.not.empty;
                    expect(balance).to.not.match(/object Object|undefined/);

                    paid = $firstRow.find('td:nth-child(9)').text().trim();
                    expect(paid).to.not.empty;
                    expect(paid).to.not.match(/object Object|undefined/);

                    total = $firstRow.find('td:nth-child(10) > span').text().trim();
                    expect(total).to.not.empty;
                    expect(total).to.not.match(/object Object|undefined/);

                    status = $firstRow.find('td:nth-child(11)').text().trim();
                    expect(status).to.not.empty;
                    expect(status).to.not.match(/object Object|undefined/);

                    // test pagination
                    $pagination = $thisEl.find('.pagination');
                    expect($pagination).to.exist;
                    expect($pagination.find('.countOnPage')).to.exist;
                    expect($pagination.find('.pageList')).to.exist;
                    expect($pagination.find('.currentPageList')).to.exist;
                    $pageList = $pagination.find('#pageList');
                    expect($pageList).to.exist;
                    expect($pageList).to.have.css('display', 'none');

                    done();
                });

                it('Try to showMore invoices with error', function () {
                    var spyResponse;
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var invoiceUrl = new RegExp('\/Invoice\/', 'i');

                    server.respondWith('GET', invoiceUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoice)]);
                    $needBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
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
                    expect(ajaxResponse).to.have.property('url', '/invoices/');
                    expect(ajaxResponse.data).to.have.property('contentType').and.to.not.undefined;
                    expect(ajaxResponse.data).to.have.property('page', 2);
                });

                it('Try to select 25 items per page', function () {
                    var $pagination = $thisEl.find('.pagination');
                    var $pageList = $pagination.find('.pageList');
                    var $needBtn = $pageList.find('a').eq(0);
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
                    var $pageList = $pagination.find('.pageList');
                    var $needBtn = $pageList.find('a').eq(1);
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
                    var $pageList = $pagination.find('.pageList');
                    var $needBtn = $pageList.find('a').eq(2);
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
                    var $pageList = $pagination.find('.pageList');
                    var $needBtn = $pageList.find('a').eq(3);
                    var ajaxResponse;

                    ajaxSpy.reset();

                    $needBtn.click();
                    server.respond();

                    ajaxResponse = ajaxSpy.args[0][0];

                    expect(ajaxResponse.data).to.be.exist;
                    expect(ajaxResponse.data).to.have.property('page', 1);
                    expect(ajaxResponse.data).to.have.property('count', '200');
                });

                it('Try to delete item with error response', function () {
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var invoiceUrl = new RegExp('\/Invoice\/');

                    deleteSpy.reset();

                    $needCheckBox.click();
                    server.respondWith('DELETE', invoiceUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Deleted success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteSpy.calledOnce).to.be.true;
                    //need expectation
                });

                it('Try to delete item', function () {
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var invoiceUrl = new RegExp('\/invoices\/');

                    $needCheckBox.click();
                    server.respondWith('DELETE', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Deleted success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteSpy.calledTwice).to.be.true;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(4);
                });

                it('Try to go to edit dialog with error response', function () {
                    var $needTd = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var invoiceUrl = new RegExp('\/invoices', 'i');
                    var spyResponse;

                    mainSpy.reset();

                    server.respondWith('GET', invoiceUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoiceById)]);
                    $needTd.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to go to edit dialog', function () {
                    var $needTd = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(6)');
                    var invoiceUrl = new RegExp('\/invoices', 'i');
                    var productUrl = new RegExp('\/product\/', 'i');

                    App.currentDb = 'micheldb';
                    App.currentUser = {
                        profile: {
                            _id: '1387275598000'
                        }
                    };

                    server.respondWith('GET', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoiceById)]);
                    server.respondWith('GET', productUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProduct)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    expect(goToEditSpy.called).to.be.true;
                    expect(editViewSpy.called).to.be.true;
                    expect($('.ui-dialog')).to.exist;
                });

            });
        });

    });
});
