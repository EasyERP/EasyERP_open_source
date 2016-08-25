define([
    'Backbone',
    'Underscore',
    'modules',
    'text!fixtures/index.html',
    'collections/DividendInvoice/filterCollection',
    'views/main/MainView',
    'views/DividendInvoice/list/ListView',
    'views/DividendInvoice/TopBarView',
    'views/DividendInvoice/CreateView',
    'views/DividendInvoice/EditView',
    'views/DividendPayments/CreateView',
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
             DividendCollection,
             MainView,
             ListView,
             TopBarView,
             CreateView,
             EditView,
             PaymentsCreateView,
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
    var fakeDividendDeclaration = {
        total: 300,
        data : [
            {
                _id        : "572c9da0526c630639837945",
                total      : 14,
                workflow   : {
                    _id   : "55647d982e4aa3804a765ecb",
                    status: "Done",
                    name  : "Paid"
                },
                currency   : {
                    _id : "565eab29aeb95fa9c0f9df2d",
                    rate: 1
                },
                paymentInfo: {
                    total  : 500000,
                    balance: 0,
                    unTaxed: 500000,
                    taxes  : 0
                },
                invoiceDate: "2015-02-27T23:00:00.000Z",
                name       : "DD1",
                paymentDate: "2015-02-27T23:00:00.000Z",
                dueDate    : "2015-02-27T23:00:00.000Z",
                approved   : true,
                removable  : true,
                paid       : 5000
            },
            {
                _id        : "572c9db9265f2548392c9125",
                total      : 14,
                workflow   : {
                    _id   : "55647d982e4aa3804a765ecb",
                    status: "Done",
                    name  : "Paid"
                },
                currency   : {
                    _id : "565eab29aeb95fa9c0f9df2d",
                    rate: 1
                },
                paymentInfo: {
                    total  : 2000000,
                    balance: 0,
                    unTaxed: 2000000,
                    taxes  : 0
                },
                invoiceDate: "2015-03-30T22:00:00.000Z",
                name       : "DD2",
                paymentDate: "2015-03-30T22:00:00.000Z",
                dueDate    : "2015-03-30T22:00:00.000Z",
                approved   : true,
                removable  : true,
                paid       : 20000
            },
            {
                _id        : "572c9dd2f1311e2739814c3c",
                total      : 14,
                workflow   : {
                    _id   : "55647d982e4aa3804a765ecb",
                    status: "Done",
                    name  : "Paid"
                },
                currency   : {
                    _id : "565eab29aeb95fa9c0f9df2d",
                    rate: 1
                },
                paymentInfo: {
                    total  : 500000,
                    balance: 0,
                    unTaxed: 500000,
                    taxes  : 0
                },
                invoiceDate: "2015-04-29T22:00:00.000Z",
                name       : "DD3",
                paymentDate: "2015-04-29T22:00:00.000Z",
                dueDate    : "2015-04-29T22:00:00.000Z",
                approved   : true,
                removable  : true,
                paid       : 5000
            }
        ]
    };
    var fakeDividendAfterDelete = [
        {
            _id        : "574400cf355ba73610d82ebe",
            _type      : "dividendInvoice",
            dueDate    : "2016-06-06T21:00:00.000Z",
            approved   : false,
            removable  : true,
            editedBy   : {
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
                    lastAccess     : "2016-05-24T07:28:57.964Z",
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
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy  : {
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
                    lastAccess     : "2016-05-24T07:28:57.964Z",
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
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow   : {
                _id         : "55647d982e4aa3804a765ecb",
                sequence    : 2,
                status      : "Done",
                name        : "Paid",
                wId         : "Sales Invoice",
                color       : "#2C3E50",
                __v         : 0,
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                wName       : "invoice",
                visible     : true
            },
            payments   : [
                "574400dd355ba73610d82ec0"
            ],
            paymentInfo: {
                total  : 0,
                balance: -55500,
                unTaxed: 0,
                taxes  : 0
            },
            currency   : {
                _id : "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            invoiceDate: "2016-05-23T21:00:00.000Z",
            forSales   : false,
            name       : "DD3",
            paymentDate: "2016-05-23T21:00:00.000Z",
            paid       : 555
        },
        {
            _id        : "574400d3355ba73610d82ebf",
            _type      : "dividendInvoice",
            dueDate    : "2016-06-06T21:00:00.000Z",
            approved   : false,
            removable  : true,
            editedBy   : {
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
                    lastAccess     : "2016-05-24T07:28:57.964Z",
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
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy  : {
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
                    lastAccess     : "2016-05-24T07:28:57.964Z",
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
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow   : {
                _id         : "55647d982e4aa3804a765ecb",
                sequence    : 2,
                status      : "Done",
                name        : "Paid",
                wId         : "Sales Invoice",
                color       : "#2C3E50",
                __v         : 0,
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                wName       : "invoice",
                visible     : true
            },
            payments   : [
                "574400f9355ba73610d82ec4"
            ],
            paymentInfo: {
                total  : 0,
                balance: -77700,
                unTaxed: 0,
                taxes  : 0
            },
            currency   : {
                _id : "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            invoiceDate: "2016-05-23T21:00:00.000Z",
            forSales   : false,
            name       : "DD4",
            paymentDate: "2016-05-23T21:00:00.000Z",
            paid       : 777
        },
        {
            _id        : "574448a58aa0eeae38752548",
            _type      : "dividendInvoice",
            dueDate    : "2016-06-06T21:00:00.000Z",
            approved   : false,
            removable  : true,
            editedBy   : {
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
                    lastAccess     : "2016-05-24T07:28:57.964Z",
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
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy  : {
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
                    lastAccess     : "2016-05-24T07:28:57.964Z",
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
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow   : {
                _id         : "55647d932e4aa3804a765ec9",
                color       : "#2C3E50",
                name        : "Unpaid",
                sequence    : 4,
                status      : "New",
                wId         : "Sales Invoice",
                wName       : "invoice",
                source      : "purchase",
                targetSource: [
                    "invoice"
                ],
                visible     : true
            },
            payments   : [],
            paymentInfo: {
                taxes  : 0,
                unTaxed: 0,
                balance: 0,
                total  : 0
            },
            currency   : {
                rate: 1,
                _id : "565eab29aeb95fa9c0f9df2d"
            },
            invoiceDate: "2016-05-23T21:00:00.000Z",
            forSales   : false,
            name       : "DD8",
            paid       : 0
        }
    ];
    var fakeDividendForForm = {
        _id             : "574400cf355ba73610d82ebe",
        _type      : "dividendInvoice",
        dueDate    : "2016-06-06T21:00:00.000Z",
        products   : [],
        emailed    : false,
        approved   : false,
        removable  : true,
        invoiced   : false,
        attachments: [],
        editedBy   : {
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
                lastAccess     : "2016-05-24T07:28:57.964Z",
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
            },
            date: "2016-05-24T07:20:47.685Z"
        },
        createdBy  : {
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
                lastAccess    : "2016-05-24T07:28:57.964Z",
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
            },
            date: "2016-05-24T07:20:47.685Z"
        },
        creationDate: "2016-05-24T07:20:47.685Z",
        groups      : {
            owner: {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            },
            users: [],
            group: []
        },
        whoCanRW    : "everyOne",
        workflow    : {
            _id   : "55647d982e4aa3804a765ecb",
            status: "Done",
            name  : "Paid"
        },
        payments    : [
            {
                _id       : "574400dd355ba73610d82ec0",
                paymentRef: "",
                name      : "PP_2",
                date      : "2016-05-23T21:00:00.000Z",
                paidAmount: 55500
            }
        ],
        paymentInfo : {
            total  : 0,
            balance: -55500,
            unTaxed: 0,
            taxes  : 0
        },
        paymentTerms: null,
        salesPerson : null,
        currency    : {
            _id : {
                _id     : "565eab29aeb95fa9c0f9df2d",
                name: "USD",
                sequence: 0
            },
            rate: 1
        },
        journal     : "572347d78ba4fd1330062726",
        invoiceDate : "2016-05-23T21:00:00.000Z",
        paymentReference: "free",
        sourceDocument  : null,
        supplier        : null,
        forSales        : false,
        name            : "DD3",
        __v             : 0,
        paymentDate     : "2016-05-23T21:00:00.000Z"
    };
    var fakeDividendUnpaidFoForm = {
        _id             : "574448a58aa0eeae38752548",
        _type: "dividendInvoice",
        dueDate: "2016-06-06T21:00:00.000Z",
        products: [],
        emailed : false,
        approved: false,
        removable: true,
        invoiced : false,
        attachments: [],
        editedBy   : {
            date: "2016-05-24T12:27:17.691Z",
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
                lastAccess    : "2016-05-24T07:28:57.964Z",
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
        createdBy  : {
            date: "2016-05-24T12:27:17.691Z",
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
                lastAccess    : "2016-05-24T07:28:57.964Z",
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
        creationDate: "2016-05-24T12:27:17.691Z",
        groups      : {
            group: [],
            users: [],
            owner: {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            }
        },
        whoCanRW    : "everyOne",
        workflow    : {
            _id   : "55647d932e4aa3804a765ec9",
            name: "Unpaid",
            status: "New"
        },
        payments    : [],
        paymentInfo : {
            taxes  : 0,
            unTaxed: 0,
            balance: 0,
            total  : 0
        },
        paymentTerms: null,
        salesPerson : null,
        currency    : {
            rate: 1,
            _id : {
                _id     : "565eab29aeb95fa9c0f9df2d",
                name: "USD",
                sequence: 0
            }
        },
        journal     : "572347d78ba4fd1330062726",
        invoiceDate : "2016-05-23T21:00:00.000Z",
        paymentReference: "free",
        sourceDocument  : null,
        supplier        : null,
        forSales        : false,
        name            : "DD8",
        __v             : 0
    };
    var fakePaymentMethods = {
        data: [
            {
                _id     : "565f2e05ab70d49024242e10",
                name: "CASH UAH",
                account: "CASH UAH",
                currency: "UAH",
                bank    : "",
                owner   : "CASH UAH"
            },
            {
                _id     : "565f2e05ab70d49024242e0f",
                name: "CASH USD",
                account: "CASH USD",
                currency: "USD",
                bank    : "",
                owner   : "CASH USD"
            },
            {
                _id     : "565f2e05ab70d49024242e07",
                name: "Erste Bank HU24 1160 0006 0000 0000 4916 1522",
                account: "HU24 1160 0006 0000 0000 4916 1522",
                currency: "USD",
                bank    : "Erste Bank",
                owner   : "Alexander Sokhanych"
            },
            {
                _id     : "565f2e05ab70d49024242e08",
                name: "Erste Bank HU27 1160 0006 0000 0000 4810 3101",
                account: "HU27 1160 0006 0000 0000 4810 3101",
                currency: "EUR",
                bank    : "Erste Bank",
                owner   : "Alexander Sokhanych"
            },
            {
                _id     : "555cc981532aebbc4a8baf36",
                name: "Payoneer ",
                account: "Payoneer ",
                currency: "USD",
                bank    : "",
                owner   : "Payoneer "
            },
            {
                _id  : "555cc981532aebbc4a8baf38",
                name: "Primary",
                owner: ""
            },
            {
                _id  : "555cc981532aebbc4a8baf37",
                name: "UkrSibBank",
                owner: ""
            },
            {
                _id     : "565f2e05ab70d49024242e0c",
                name: "Ukrsibbank 26000479199400",
                account: "26000479199400",
                currency: "USD",
                bank    : "Ukrsibbank",
                owner   : "YourTradingSystems"
            },
            {
                _id     : "565f2e05ab70d49024242e0d",
                name: "Ukrsibbank 26000479199400",
                account: "26000479199400",
                currency: "UAH",
                bank    : "Ukrsibbank",
                owner   : "YourTradingSystems"
            },
            {
                _id     : "565f2e05ab70d49024242e09",
                name: "Ukrsibbank 26005536599700",
                account: "26005536599700",
                currency: "USD",
                bank    : "Ukrsibbank",
                owner   : "ThinkMobiles"
            },
            {
                _id     : "565f2e05ab70d49024242e0b",
                name: "Ukrsibbank 26005536599700",
                account: "26005536599700",
                currency: "UAH",
                bank    : "Ukrsibbank",
                owner   : "ThinkMobiles"
            },
            {
                _id     : "565f2e05ab70d49024242e0a",
                name: "Ukrsibbank 26049536599700",
                account: "26049536599700",
                currency: "EUR",
                bank    : "Ukrsibbank",
                owner   : "ThinkMobiles"
            },
            {
                _id     : "565f2e05ab70d49024242e0e",
                name: "Unicreditbank",
                account: "Unicreditbank",
                currency: "USD",
                bank    : "",
                owner   : "Unicreditbank"
            }
        ]
    };
    var fakeCurrency = {
        data: [
            {
                _id     : "565eab29aeb95fa9c0f9df2d",
                sequence: 0,
                name    : "USD"
            },
            {
                _id     : "565eab34aeb95fa9c0f9df2e",
                sequence: 1,
                name    : "EUR"
            },
            {
                _id     : "565eab3faeb95fa9c0f9df2f",
                sequence: 2,
                name    : "UAH"
            }
        ]
    };
    var fakeFilters = {
        _id: null,
        workflow: [
            {
                _id: "55647d982e4aa3804a765ecb",
                name: "Paid"
            }
        ]
    };
    var view;
    var topBarView;
    var listView;
    var dividendCollection;
    var historyNavigateSpy;
    var ajaxSpy;
    var debounceStub;
    var selectSpy;
    var saveFilterSpy;
    var removedFromDBSpy;
    var removeFilterSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('DividendDeclaration', function () {

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

            historyNavigateSpy.restore();
            ajaxSpy.restore();
            debounceStub.restore();
            selectSpy.restore();
            saveFilterSpy.restore();
            removedFromDBSpy.restore();
            removeFilterSpy.restore();
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
                view = new MainView({el: $elFixture, contentType: 'DividendInvoice'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="101"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="101"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/DividendInvoice');
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
                var dividendUrl = new RegExp('\/Invoices\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', dividendUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                dividendCollection = new DividendCollection({
                    contentType: 'DividendInvoice',
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
                var dividendUrl = new RegExp('\/Invoices\/', 'i');

                server.respondWith('GET', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendDeclaration)]);
                dividendCollection = new DividendCollection({
                    contentType: 'DividendInvoice',
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true,
                    showMore   : false
                });
                server.respond();

                expect(dividendCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: dividendCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Dividend declaration');
            });
        });

        describe('DividendDeclarationViews', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var windowConfirmStub;
            var alertStub;
            var deleteSpy;
            var paymentCreateInitSpy;

            before(function () {
                App.startPreload = function () {
                    App.preloaderShowFlag = true;
                    $('#loading').show();
                };

                App.stopPreload = function () {
                    App.preloaderShowFlag = false;
                    $('#loading').hide();
                };

                App.currentDb = 'michelDb';
                App.currentUser = {
                    profile: {
                        _id: '1387275598000'
                    }
                };

                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                alertStub = sinon.stub(window, 'alert');
                alertStub.returns(true);
                deleteSpy = sinon.spy(ListView.prototype, 'deleteItems');
                paymentCreateInitSpy = sinon.spy(PaymentsCreateView.prototype, 'initialize');
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                alertStub.restore();
                deleteSpy.restore();
                paymentCreateInitSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create dividendDeclarationListView', function (done) {
                    var filterUrl = '/filter/DividendInvoice';
                    var $firstRow;
                    var colCount;
                    var paymentDate;
                    var dueDate;
                    var declarationNumber;
                    var balance;
                    var paid;
                    var total;
                    var status;
                    var invoiceDate;
                    var $pagination;
                    var $currentPageList;

                    server.respondWith('GET', filterUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilters)]);
                    listView = new ListView({
                        startTime : new Date(),
                        collection: dividendCollection
                    });
                    server.respond();

                    clock.tick(700);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(dividendCollection, listView);

                    dividendCollection.trigger('fetchFinished', {
                        totalRecords: dividendCollection.totalRecords,
                        currentPage : dividendCollection.currentPage,
                        pageSize    : dividendCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('#listTable')).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;

                    expect(colCount).to.be.equals(10);

                    paymentDate = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(paymentDate).not.to.be.empty;
                    expect(paymentDate).to.not.match(/object Object|undefined/);

                    dueDate = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(dueDate).not.to.be.empty;
                    expect(dueDate).to.not.match(/object Object|undefined/);

                    declarationNumber = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(declarationNumber).not.to.be.empty;
                    expect(declarationNumber).to.not.match(/object Object|undefined/);

                    balance = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(balance).not.to.be.empty;
                    expect(balance).to.not.match(/object Object|undefined/);

                    paid = $firstRow.find('td:nth-child(7)').text().trim();
                    expect(paid).not.to.be.empty;
                    expect(paid).to.not.match(/object Object|undefined/);

                    total = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(total).not.to.be.empty;
                    expect(total).to.not.match(/object Object|undefined/);

                    status = $firstRow.find('td:nth-child(9)').text().trim();
                    expect(status).not.to.be.empty;
                    expect(status).to.not.match(/object Object|undefined/);

                    invoiceDate = $firstRow.find('td:nth-child(10)').text().trim();
                    expect(invoiceDate).not.to.be.empty;
                    expect(invoiceDate).to.not.match(/object Object|undefined/);

                    expect($thisEl.find('#listTotal')).to.exist;

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
                    expect(ajaxResponse).to.have.property('url', '/invoices/');
                    expect(ajaxResponse.data).to.have.property('contentType').and.to.not.undefined;
                    expect(ajaxResponse.data).to.have.property('page', 2);
                    expect(window.location.hash).to.be.equals('#easyErp/DividendInvoice/list/p=2/c=100');
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
                    expect(window.location.hash).to.be.equals('#easyErp/DividendInvoice/list/p=1/c=25');
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
                    expect(window.location.hash).to.be.equals('#easyErp/DividendInvoice/list/p=1/c=50');
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
                    expect(window.location.hash).to.be.equals('#easyErp/DividendInvoice/list/p=1/c=100');
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
                    expect(window.location.hash).to.be.equals('#easyErp/DividendInvoice/list/p=1/c=200');
                });

                it('Try to delete item with error response', function () {
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(3) > td.notForm > input');
                    var dividendUrl = new RegExp('\/Invoice\/', 'i');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var spyResponse;

                    mainSpy.reset();

                    $needCheckBox.click();

                    server.respondWith('DELETE', dividendUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(deleteSpy.calledOnce).to.be.true;
                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to delete item good response', function () {
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var dividendUrl = new RegExp('\/invoices\/', 'i');

                    ajaxSpy.reset();

                    server.respondWith('GET', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendAfterDelete)]);
                    server.respondWith('DELETE', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "_id"             : "5742f26e7afe352f10c11c3d",
                        "_type": "dividendInvoice",
                        "dueDate": "2016-06-05T21:00:00.000Z",
                        "__v"    : 0,
                        "paymentDate": "2016-05-22T21:00:00.000Z",
                        "products"   : [],
                        "emailed"    : false,
                        "approved"   : false,
                        "removable"  : true,
                        "invoiced"   : false,
                        "attachments": [],
                        "editedBy"   : {
                            "date": "2016-05-23T12:07:10.745Z",
                            "user": "52203e707d4dba8813000003"
                        },
                        "createdBy"  : {
                            "date": "2016-05-23T12:07:10.745Z",
                            "user": "52203e707d4dba8813000003"
                        },
                        "creationDate": "2016-05-23T12:07:10.745Z",
                        "groups"      : {
                            "group": [],
                            "users": [],
                            "owner": "560c099da5d4a2e20ba5068b"
                        },
                        "whoCanRW"    : "everyOne",
                        "workflow"    : "55647d932e4aa3804a765ec9",
                        "payments"    : [],
                        "paymentInfo" : {
                            "taxes"  : 0,
                            "unTaxed": 0,
                            "balance": 0,
                            "total"  : 0
                        },
                        "paymentTerms": null,
                        "salesPerson" : null,
                        "currency"    : {
                            "rate": 1,
                            "_id" : "565eab29aeb95fa9c0f9df2d"
                        },
                        "journal"     : "572347d78ba4fd1330062726",
                        "invoiceDate" : "2016-05-22T21:00:00.000Z",
                        "paymentReference": "free",
                        "sourceDocument"  : null,
                        "supplier"        : null,
                        "forSales"        : false,
                        "name"            : "DD1",
                        "id"              : "5742f26e7afe352f10c11c3d"
                    })]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    expect(deleteSpy.calledTwice).to.be.true;
                    expect(ajaxSpy.args[1][0]).to.have.property('type', 'GET');
                    expect(ajaxSpy.args[1][0]).to.have.property('url', '/invoices/');
                });

                it('Try to go to editDialog with error response', function () {
                    mainSpy.reset();

                    var $needTd = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(3)');
                    var dividendUrl = new RegExp('\/invoices\/', 'i');

                    server.respondWith('GET', dividendUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $needTd.click();
                    server.respond();

                    expect(mainSpy.args[0][0]).to.have.property('type', 'error');
                    expect(mainSpy.args[0][0]).to.have.property('message', 'Please refresh browser');
                });

                it('Try to go to editDialog with good response', function () {
                    mainSpy.reset();

                    var $needTd = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(3)');
                    var dividendUrl = new RegExp('\/invoices\/', 'i');

                    server.respondWith('GET', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendForForm)]);
                    $needTd.click();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                /*it('Try to change tab', function(){
                 var $dialog = $('.ui-dialog');
                 var $firstTab = $dialog.find('.dialog-tabs > li').eq(0).find('a');
                 var $secondTab = $dialog.find('.dialog-tabs > li').eq(1).find('a');

                 expect($firstTab).to.have.class('active');

                 $secondTab.click();
                 expect($secondTab).to.have.class('active');

                 $firstTab.click();
                 expect($firstTab).to.have.class('active');
                 });*/

                it('Try to delete item with 403 error status response', function () {
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    var dividendUrl = new RegExp('\/invoices\/', 'i');

                    mainSpy.reset();

                    server.respondWith('DELETE', dividendUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(mainSpy.args[0][0]).to.have.property('type', 'error');
                });

                it('Try to delete item', function () {
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    var dividendUrl = new RegExp('\/invoices\/', 'i');
                    historyNavigateSpy.reset();

                    server.respondWith('GET', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendAfterDelete)]);
                    server.respondWith('DELETE', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "_id"             : "5742f26e7afe352f10c11c3d",
                        "_type": "dividendInvoice",
                        "dueDate": "2016-06-05T21:00:00.000Z",
                        "__v"    : 0,
                        "paymentDate": "2016-05-22T21:00:00.000Z",
                        "products"   : [],
                        "emailed"    : false,
                        "approved"   : false,
                        "removable"  : true,
                        "invoiced"   : false,
                        "attachments": [],
                        "editedBy"   : {
                            "date": "2016-05-23T12:07:10.745Z",
                            "user": "52203e707d4dba8813000003"
                        },
                        "createdBy"  : {
                            "date": "2016-05-23T12:07:10.745Z",
                            "user": "52203e707d4dba8813000003"
                        },
                        "creationDate": "2016-05-23T12:07:10.745Z",
                        "groups"      : {
                            "group": [],
                            "users": [],
                            "owner": "560c099da5d4a2e20ba5068b"
                        },
                        "whoCanRW"    : "everyOne",
                        "workflow"    : "55647d932e4aa3804a765ec9",
                        "payments"    : [],
                        "paymentInfo" : {
                            "taxes"  : 0,
                            "unTaxed": 0,
                            "balance": 0,
                            "total"  : 0
                        },
                        "paymentTerms": null,
                        "salesPerson" : null,
                        "currency"    : {
                            "rate": 1,
                            "_id" : "565eab29aeb95fa9c0f9df2d"
                        },
                        "journal"     : "572347d78ba4fd1330062726",
                        "invoiceDate" : "2016-05-22T21:00:00.000Z",
                        "paymentReference": "free",
                        "sourceDocument"  : null,
                        "supplier"        : null,
                        "forSales"        : false,
                        "name"            : "DD1",
                        "id"              : "5742f26e7afe352f10c11c3d"
                    })]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;
                    expect(historyNavigateSpy.calledOnce).to.be.true;
                    expect(historyNavigateSpy.args[0][0]).to.match(/#easyErp\/DividendInvoice\//);
                });

                it('Try to open not paid item and open CreatePaymentView', function (done) {
                    var $unPaidTd = $thisEl.find('#listTable > tr:nth-child(3) > td:nth-child(2)');
                    var dividendUrl = new RegExp('\/invoices\/');
                    var paymentMethodUrl = '/paymentMethod';
                    var currencyUrl = '/currency/getForDd';
                    var $dialog;
                    var $payBtn;

                    paymentCreateInitSpy.reset();

                    server.respondWith('GET', dividendUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendUnpaidFoForm)]);
                    $unPaidTd.click();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;

                    // go to payment dialog
                    $dialog = $('.ui-dialog');
                    $payBtn = $dialog.find('.newPayment');

                    server.respondWith('GET', paymentMethodUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakePaymentMethods)]);
                    server.respondWith('GET', currencyUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCurrency)]);
                    $payBtn.click();
                    server.respond();
                    server.respond();

                    clock.tick(2000);

                    expect($('.ui-dialog')).to.exist;
                    expect(paymentCreateInitSpy.calledOnce).to.be.true;
                    done();
                });

                it('Try to changePaidAmount', function (done) {
                    var $dialog = $('.ui-dialog');
                    var $amountInput = $dialog.find('#paidAmount');
                    var amountLeftUrl = new RegExp('\/payment\/amountLeftCalc', 'i');

                    debounceStub.reset();

                    server.respondWith('GET', amountLeftUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        difference: -5000
                    })]);
                    clock.tick(10000);
                    $amountInput.trigger('keyup'); // not work
                    server.respond();
                    expect($dialog.find('#differenceAmount').text().trim()).to.be.equals('-5000.00');

                    done();
                });

                it('Try to select bank account and currency', function () {
                    var $dialog = $('.ui-dialog');
                    var $bankAccount = $dialog.find('#paymentMethod');
                    var $currency = $dialog.find('#currencyDd');
                    var $next;
                    var $prev;
                    var $selectedItem;

                    // select bank account
                    $bankAccount.click();
                    $next = $dialog.find('.next');
                    $next.click();

                    expect($dialog.find('.counter').text().trim()).to.be.equals('11-13 of 13');
                    $prev = $dialog.find('.prev');
                    $prev.click();

                    expect($dialog.find('.counter').text().trim()).to.be.equals('1-10 of 13');
                    $selectedItem = $dialog.find('ul.newSelectList').first().find('li').first();
                    $selectedItem.click();
                    expect($dialog.find('#paymentMethod').text().trim()).to.be.equals('CASH UAH');

                    // select currency
                    $currency.click();
                    $selectedItem = $dialog.find('ul.newSelectList').eq(1).find('li').eq(1);
                    $selectedItem.click();
                    //expect($dialog.find('#currencyDd').text().trim()).to.be.equals('EUR');
                });

                it('Try to save payment with empty paidAmount', function () {
                    var $saveBtn = $('#create-payment-dialog');
                    var spyResponse;

                    mainSpy.reset();

                    $saveBtn.click();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please, enter Paid Amount!');
                });

                it('Try to save payment with 400 status error response', function () {
                    var $saveBtn = $('#create-payment-dialog');
                    var paymentUrl = '/payments/';
                    var $dialog = $('.ui-dialog');
                    var $amountInput = $dialog.find('#paidAmount');

                    $amountInput.val('5000');

                    server.respondWith('POST', paymentUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                });

                it('Try to save payment with 400 status error response', function () {
                    var $saveBtn = $('#create-payment-dialog');
                    var paymentUrl = '/payments/';
                    var $dialog = $('.ui-dialog');
                    var $amountInput = $dialog.find('#paidAmount');

                    $amountInput.val('5000');

                    server.respondWith('POST', paymentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect(window.location.hash).to.be.equals('#easyErp/DividendPayments/list');
                });

                it('Try to filter listView by Assigned and company', function () {
                    var url = '/invoices/';
                    var contentType = 'DividendInvoice';
                    var firstValue = 'workflow';
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var contentUrl = new RegExp(url, 'i');
                    var $firstContainer = '#' + firstValue + 'FullContainer .groupName';
                    var $firstSelector = '#' + firstValue + 'Ul > li:nth-child(1)';
                    var elementQuery = '#listTable > tr';
                    var $firstGroup;
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

                    server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeDividendDeclaration)]);
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

                    // unselect secondGroup filter
                    ajaxSpy.reset();
                    $selectedItem = $searchContainer.find($firstSelector);
                    $selectedItem.click();
                    server.respond();

                    expect(selectSpy.calledTwice).to.be.true;
                    expect($thisEl.find('#searchContainer')).to.exist;
                    //expect($thisEl.find('#startLetter')).to.exist;
                    expect($searchContainer.find('#searchFilterContainer > div')).to.have.lengthOf(0);
                    expect($searchContainer.find($firstSelector)).to.have.not.class('checkedValue');
                    elementsCount = $thisEl.find(elementQuery).length;
                    expect(elementsCount).to.be.not.equals(0);

                    ajaxResponse = ajaxSpy.args[0][0];
                    expect(ajaxResponse).to.have.property('url', url);
                    expect(ajaxResponse).to.have.property('type', 'GET');
                    expect(ajaxResponse.data).to.have.property('filter');
                    filterObject = ajaxResponse.data.filter;
                    expect(filterObject.workflow).to.not.exist;
                });
            });
        });
    });
});
