/*
define([
    'modules',
    'text!fixtures/index.html',
    'collections/Invoices/filterCollection',
    'views/main/MainView',
    'views/Invoices/list/ListView',
    'views/Invoices/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'custom'
], function (modules, fixtures, InvoiceCollection, MainView, ListView, TopBarView, $, chai, chaiJquery, sinonChai, Custom) {
    'use strict';
    
    var fakeInvoice = [
        {
            _id: "55b92ae121e4b7c40f001275",
            paymentDate: "2015-01-29T04:00:00.000Z",
            dueDate: "2015-02-13T12:09:15.273Z",
            editedBy: {
                user: {
                    _id: "52203e707d4dba8813000003",
                    __v: 0,
                    attachments: [ ],
                    credentials: {
                        access_token: "",
                        refresh_token: ""
                    },
                    email: "info@thinkmobiles.com",
                    kanbanSettings: {
                        applications: {
                            countPerPage: 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks: {
                            countPerPage: 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess: "2016-05-18T07:28:11.790Z",
                    login: "admin",
                    pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile: 1387275598000,
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters: [
                        {
                            _id: "56213057c558b13c1bbf874d",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5621307bc558b13c1bbf874f",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56213103c558b13c1bbf8750",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56213197c558b13c1bbf8751",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56215e86c558b13c1bbf8755",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56229009184ec5a427913306",
                            viewType: "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id: "562506bb19a2ecca01ca84b3",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56265005d53978de6e9ea440",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "562b83ccb4677e225aa31df6",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "564dd4ce9fb8bc3f2195662c",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56570d714d96962262fd4b55",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56572368bfd103f108eb4a24",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56604795ccc590f32c577ece",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "566047c6ccc590f32c577ed1",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5661a7bf7d284423697e34a8",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5665429e9294f4d728bcafaa",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "566eba768453e8b464b70a40",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56c711ab0769bba2647ae710",
                            viewType: "",
                            byDefault: "Projects"
                        },
                        {
                            _id: "56daf5322e7b62c613ff2552",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56dd69d991cb620c19ff60c2",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56dd6af71e6cb7131892b2ba",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56dfe8e56e2877d85455a6bb",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id: "56f3d039c1785edc507e81ea",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5708ca211d118cb6401008cc",
                            viewType: "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy: {
                user: {
                    _id: "52203e707d4dba8813000003",
                    __v: 0,
                    attachments: [ ],
                    credentials: {
                        access_token: "",
                        refresh_token: ""
                    },
                    email: "info@thinkmobiles.com",
                    kanbanSettings: {
                        applications: {
                            countPerPage: 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks: {
                            countPerPage: 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess: "2016-05-18T07:28:11.790Z",
                    login: "admin",
                    pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile: 1387275598000,
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters: [
                        {
                            _id: "56213057c558b13c1bbf874d",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5621307bc558b13c1bbf874f",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56213103c558b13c1bbf8750",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56213197c558b13c1bbf8751",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56215e86c558b13c1bbf8755",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56229009184ec5a427913306",
                            viewType: "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id: "562506bb19a2ecca01ca84b3",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56265005d53978de6e9ea440",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "562b83ccb4677e225aa31df6",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "564dd4ce9fb8bc3f2195662c",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56570d714d96962262fd4b55",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56572368bfd103f108eb4a24",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56604795ccc590f32c577ece",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "566047c6ccc590f32c577ed1",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5661a7bf7d284423697e34a8",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5665429e9294f4d728bcafaa",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "566eba768453e8b464b70a40",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56c711ab0769bba2647ae710",
                            viewType: "",
                            byDefault: "Projects"
                        },
                        {
                            _id: "56daf5322e7b62c613ff2552",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56dd69d991cb620c19ff60c2",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56dd6af71e6cb7131892b2ba",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56dfe8e56e2877d85455a6bb",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id: "56f3d039c1785edc507e81ea",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5708ca211d118cb6401008cc",
                            viewType: "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow: {
                _id: "55647d982e4aa3804a765ecb",
                sequence: 2,
                status: "Done",
                name: "Paid",
                wId: "Sales Invoice",
                color: "#2C3E50",
                __v: 0,
                source: "purchase",
                targetSource: [
                    "invoice"
                ],
                wName: "invoice",
                visible: true
            },
            payments: [
                "55b92ae221e4b7c40f00138f"
            ],
            paymentInfo: {
                taxes: 0,
                unTaxed: 100000,
                balance: 0,
                total: 100000
            },
            invoiceDate: "2015-01-27T04:00:00.273Z",
            project: {
                _id: "55b92ad621e4b7c40f0006ad",
                EndDate: null,
                StartDate: null,
                ID: 49,
                bonus: [
                    {
                        employeeId: "55b92ad221e4b7c40f00004b",
                        bonusId: "55b92ad521e4b7c40f000608",
                        startDate: null,
                        endDate: null,
                        _id: "55b92ae521e4b7c40f00155c"
                    },
                    {
                        employeeId: "55b92ad221e4b7c40f00004a",
                        bonusId: "55b92ad521e4b7c40f000604",
                        startDate: null,
                        endDate: null,
                        _id: "55b92ae521e4b7c40f001585"
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2015-10-13T14:02:10.131Z",
                    user: "55b9dd237a3632120b000005"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.339Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: "528ce82df3f67bc40b000025",
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                projectmanager: null,
                customer: "55b92ad621e4b7c40f000645",
                task: [ ],
                projectName: "KX keyboard",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    projectTeam: [
                        "564cfd8ba6e6390160c9ee70",
                        "564cfd8ba6e6390160c9ee00",
                        "564cfd8ba6e6390160c9ee2c"
                    ]
                },
                salesmanager: "55b92ad221e4b7c40f00004b"
            },
            sourceDocument: {
                _id: "564cfd8ba6e6390160c9efa3",
                editedBy: {
                    date: "2015-11-18T22:36:59.697Z",
                    user: null
                },
                createdBy: {
                    date: "2015-11-18T22:36:59.696Z",
                    user: null
                },
                creationDate: "2015-11-18T22:36:59.696Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                workflow: "55647b962e4aa3804a765ec6",
                products: [
                    {
                        scheduledDate: "2015-01-27T12:09:15.273Z",
                        jobs: "564cfd8ba6e6390160c9ee2c",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        unitPrice: 100000,
                        subTotal: 100000,
                        taxes: 0,
                        quantity: 104
                    }
                ],
                paymentInfo: {
                    total: 100000,
                    unTaxed: 100000,
                    taxes: 0
                },
                paymentTerm: null,
                invoiceRecived: true,
                invoiceControl: null,
                incoterm: null,
                destination: null,
                name: "PO17",
                orderDate: "2015-01-27T12:09:15.273Z",
                deliverTo: null,
                project: "55b92ad621e4b7c40f0006ad",
                supplier: "55b92ad621e4b7c40f000645",
                isOrder: true,
                forSales: true,
                __v: 0,
                type: "Invoiced",
                currency: {
                    rate: 1,
                    _id: "565eab29aeb95fa9c0f9df2d"
                }
            },
            supplier: {
                _id: "55b92ad621e4b7c40f000645",
                ID: 34,
                companyInfo: {
                    size: null,
                    industry: null
                },
                editedBy: {
                    date: "2015-07-29T19:34:46.018Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy: {
                    date: "2015-07-29T19:34:46.018Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [ ],
                attachments: [ ],
                notes: [ ],
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    receiveMessages: 0,
                    language: "English",
                    reference: "",
                    active: true,
                    implementedBy: null,
                    salesTeam: null,
                    salesPerson: null,
                    isSupplier: false,
                    isCustomer: true
                },
                title: "",
                internalNotes: "",
                contacts: [ ],
                phones: {
                    fax: "",
                    mobile: "",
                    phone: ""
                },
                skype: "",
                jobPosition: "",
                website: "",
                address: {
                    country: "Romania",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                name: {
                    last: "",
                    first: "Vlad"
                },
                isOwn: false,
                type: "Person",
                __v: 0
            },
            forSales: true,
            name: "49-30/01/15",
            _type: "wTrackInvoice",
            currency: {
                _id: "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            approved: true,
            removable: false,
            paid: 1000,
            salesPerson: {
                _id: "55b92ad221e4b7c40f00004b",
                dateBirth: "1992-07-11T00:00:00.000Z",
                ID: 39,
                isLead: 2,
                fire: [ ],
                hire: [
                    "2013-05-19T21:00:00.000Z"
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Full-time",
                gender: "male",
                marital: "unmarried",
                contractEnd: {
                    date: "2015-07-29T19:34:42.434Z",
                    reason: ""
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-05-02T19:33:55.100Z",
                    user: "55b9fc0fd79a3a3439000008"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 23,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "",
                coach: null,
                manager: "55b92ad221e4b7c40f00004a",
                jobPosition: "55b92acf21e4b7c40f00001e",
                department: "55b92ace21e4b7c40f000013",
                visibility: "Public",
                relatedUser: "561e37f7d6c741e8235f42cb",
                officeLocation: "",
                skype: "roland.katona7000",
                workPhones: {
                    phone: "",
                    mobile: "+380956937000"
                },
                personalEmail: "roland.katona@thinkmobiles.com",
                workEmail: "roland.katona@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Katona",
                    first: "Roland"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: true,
                __v: 0,
                transfer: [
                    {
                        date: "2013-05-20T01:00:00.000Z",
                        isDeveloper: false,
                        info: "плюс %",
                        salary: 0,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014",
                        status: "hired"
                    },
                    {
                        date: "2015-12-31T02:00:00.000Z",
                        isDeveloper: false,
                        info: "плюс %",
                        salary: 450,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001f",
                        department: "55b92ace21e4b7c40f000014",
                        status: "transfer"
                    },
                    {
                        date: "2016-01-01T02:00:00.000Z",
                        isDeveloper: false,
                        info: "Update",
                        salary: 450,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f000025",
                        department: "55b92ace21e4b7c40f000013",
                        status: "updated"
                    },
                    {
                        date: "2016-03-01T02:00:00.000Z",
                        isDeveloper: false,
                        info: "Update",
                        salary: 800,
                        jobType: "Full-time",
                        manager: "55b92ad221e4b7c40f00004a",
                        jobPosition: "55b92acf21e4b7c40f00001e",
                        department: "55b92ace21e4b7c40f000013",
                        status: "updated"
                    }
                ]
            }
        },
        {
            _id: "55b92ae121e4b7c40f001287",
            paymentDate: "2014-12-05T04:00:00.000Z",
            dueDate: "2015-02-09T15:33:42.303Z",
            editedBy: {
                user: {
                    _id: "52203e707d4dba8813000003",
                    __v: 0,
                    attachments: [ ],
                    credentials: {
                        access_token: "",
                        refresh_token: ""
                    },
                    email: "info@thinkmobiles.com",
                    kanbanSettings: {
                        applications: {
                            countPerPage: 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks: {
                            countPerPage: 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess: "2016-05-18T07:28:11.790Z",
                    login: "admin",
                    pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile: 1387275598000,
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters: [
                        {
                            _id: "56213057c558b13c1bbf874d",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5621307bc558b13c1bbf874f",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56213103c558b13c1bbf8750",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56213197c558b13c1bbf8751",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56215e86c558b13c1bbf8755",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56229009184ec5a427913306",
                            viewType: "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id: "562506bb19a2ecca01ca84b3",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56265005d53978de6e9ea440",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "562b83ccb4677e225aa31df6",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "564dd4ce9fb8bc3f2195662c",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56570d714d96962262fd4b55",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56572368bfd103f108eb4a24",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56604795ccc590f32c577ece",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "566047c6ccc590f32c577ed1",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5661a7bf7d284423697e34a8",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5665429e9294f4d728bcafaa",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "566eba768453e8b464b70a40",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56c711ab0769bba2647ae710",
                            viewType: "",
                            byDefault: "Projects"
                        },
                        {
                            _id: "56daf5322e7b62c613ff2552",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56dd69d991cb620c19ff60c2",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56dd6af71e6cb7131892b2ba",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56dfe8e56e2877d85455a6bb",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id: "56f3d039c1785edc507e81ea",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5708ca211d118cb6401008cc",
                            viewType: "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            createdBy: {
                user: {
                    _id: "52203e707d4dba8813000003",
                    __v: 0,
                    attachments: [ ],
                    credentials: {
                        access_token: "",
                        refresh_token: ""
                    },
                    email: "info@thinkmobiles.com",
                    kanbanSettings: {
                        applications: {
                            countPerPage: 10,
                            foldWorkflows: [
                                "Empty"
                            ]
                        },
                        opportunities: {
                            countPerPage: 10
                        },
                        tasks: {
                            countPerPage: 10,
                            foldWorkflows: [
                                "528ce3caf3f67bc40b000013",
                                "528ce3acf3f67bc40b000012",
                                "528ce30cf3f67bc40b00000f",
                                "528ce35af3f67bc40b000010"
                            ]
                        }
                    },
                    lastAccess: "2016-05-18T07:28:11.790Z",
                    login: "admin",
                    pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                    profile: 1387275598000,
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    savedFilters: [
                        {
                            _id: "56213057c558b13c1bbf874d",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5621307bc558b13c1bbf874f",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56213103c558b13c1bbf8750",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56213197c558b13c1bbf8751",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56215e86c558b13c1bbf8755",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56229009184ec5a427913306",
                            viewType: "",
                            byDefault: "salesInvoice"
                        },
                        {
                            _id: "562506bb19a2ecca01ca84b3",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56265005d53978de6e9ea440",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "562b83ccb4677e225aa31df6",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "564dd4ce9fb8bc3f2195662c",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56570d714d96962262fd4b55",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56572368bfd103f108eb4a24",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56604795ccc590f32c577ece",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "566047c6ccc590f32c577ed1",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5661a7bf7d284423697e34a8",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5665429e9294f4d728bcafaa",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "566eba768453e8b464b70a40",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56c711ab0769bba2647ae710",
                            viewType: "",
                            byDefault: "Projects"
                        },
                        {
                            _id: "56daf5322e7b62c613ff2552",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56dd69d991cb620c19ff60c2",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56dd6af71e6cb7131892b2ba",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "56dfe8e56e2877d85455a6bb",
                            viewType: "",
                            byDefault: "Leads"
                        },
                        {
                            _id: "56f3d039c1785edc507e81ea",
                            viewType: "",
                            byDefault: ""
                        },
                        {
                            _id: "5708ca211d118cb6401008cc",
                            viewType: "",
                            byDefault: "Employees"
                        }
                    ],
                    relatedEmployee: "55b92ad221e4b7c40f00004f"
                }
            },
            workflow: {
                _id: "55647d982e4aa3804a765ecb",
                sequence: 2,
                status: "Done",
                name: "Paid",
                wId: "Sales Invoice",
                color: "#2C3E50",
                __v: 0,
                source: "purchase",
                targetSource: [
                    "invoice"
                ],
                wName: "invoice",
                visible: true
            },
            payments: [
                "55b92ae321e4b7c40f0013a6"
            ],
            paymentInfo: {
                taxes: 0,
                unTaxed: 377000,
                balance: 0,
                total: 377000
            },
            invoiceDate: "2014-11-28T04:00:00.000Z",
            project: {
                _id: "55b92ad621e4b7c40f0006a4",
                EndDate: null,
                StartDate: null,
                ID: 25,
                bonus: [
                    {
                        employeeId: "55b92ad221e4b7c40f00004a",
                        bonusId: "55b92ad521e4b7c40f000602",
                        startDate: null,
                        endDate: null,
                        _id: "55b92ae421e4b7c40f001549"
                    },
                    {
                        employeeId: "55b92ad221e4b7c40f00004a",
                        bonusId: "55b92ad521e4b7c40f000604",
                        startDate: null,
                        endDate: null,
                        _id: "55b92ae421e4b7c40f00154a"
                    }
                ],
                health: 1,
                editedBy: {
                    date: "2015-10-14T08:37:18.117Z",
                    user: "55cb7302fea413b50b000007"
                },
                attachments: [ ],
                notes: [ ],
                projecttype: "",
                createdBy: {
                    date: "2015-07-29T19:34:46.335Z",
                    user: "52203e707d4dba8813000003"
                },
                progress: 0,
                remaining: 0,
                logged: 0,
                estimated: 0,
                workflow: "528ce82df3f67bc40b000025",
                parent: null,
                sequence: 0,
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                projectmanager: null,
                customer: "55b92ad521e4b7c40f00061d",
                task: [ ],
                projectName: "iOS Periop",
                projectShortDesc: "emptyProject",
                __v: 0,
                budget: {
                    projectTeam: [
                        "564cfd8ba6e6390160c9ee3e"
                    ],
                    bonus: [
                        {
                            percentage: "Sales/Head 8%",
                            resource: "Oleg Ostroverkh",
                            bonus: 30160.000000000004
                        },
                        {
                            percentage: "Sales/Ref 2%",
                            resource: "Oleg Ostroverkh",
                            bonus: 7540.000000000001
                        }
                    ]
                },
                salesmanager: "55b92ad221e4b7c40f00004a"
            },
            sourceDocument: {
                _id: "564cfd8ca6e6390160c9f0ad",
                editedBy: {
                    date: "2015-11-18T22:37:00.788Z",
                    user: null
                },
                createdBy: {
                    date: "2015-11-18T22:37:00.788Z",
                    user: null
                },
                creationDate: "2015-11-18T22:37:00.788Z",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: null
                },
                whoCanRW: "everyOne",
                workflow: "55647b962e4aa3804a765ec6",
                products: [
                    {
                        scheduledDate: "2015-01-26T15:33:42.303Z",
                        jobs: "564cfd8ba6e6390160c9ee3e",
                        description: "",
                        product: "5540d528dacb551c24000003",
                        unitPrice: 377000,
                        subTotal: 377000,
                        taxes: 0,
                        quantity: 472
                    }
                ],
                paymentInfo: {
                    total: 377000,
                    unTaxed: 377000,
                    taxes: 0
                },
                paymentTerm: null,
                invoiceRecived: true,
                invoiceControl: null,
                incoterm: null,
                destination: null,
                name: "PO283",
                orderDate: "2015-01-26T15:33:42.303Z",
                deliverTo: null,
                project: "55b92ad621e4b7c40f0006a4",
                supplier: "55b92ad521e4b7c40f00061d",
                isOrder: true,
                forSales: true,
                __v: 0,
                type: "Invoiced",
                currency: {
                    rate: 1,
                    _id: "565eab29aeb95fa9c0f9df2d"
                }
            },
            supplier: {
                _id: "55b92ad521e4b7c40f00061d",
                ID: 2,
                companyInfo: {
                    size: "50-200",
                    industry: null
                },
                editedBy: {
                    user: "55b9dd7a7a3632120b000006",
                    date: "2015-07-30T09:41:24.950Z"
                },
                createdBy: {
                    date: "2015-07-29T19:34:45.997Z",
                    user: "52203e707d4dba8813000003"
                },
                history: [ ],
                attachments: [ ],
                notes: [ ],
                groups: {
                    owner: "52203e707d4dba8813000003",
                    users: [ ],
                    group: [ ]
                },
                whoCanRW: "everyOne",
                social: {
                    LI: "",
                    FB: ""
                },
                color: "#4d5a75",
                relatedUser: null,
                salesPurchases: {
                    isCustomer: true,
                    isSupplier: false,
                    active: false,
                    salesPerson: null,
                    reference: "",
                    language: ""
                },
                title: "",
                internalNotes: "",
                contacts: [ ],
                phones: {
                    phone: "+61 3 9039 9999",
                    mobile: ""
                },
                skype: "",
                jobPosition: "",
                website: "http://www.buzinga.com.au/",
                address: {
                    street: "Level 1, 225 - 227 Swan St",
                    city: "Richmond",
                    state: "Melbourne",
                    zip: "3121",
                    country: "Australia"
                },
                timezone: "UTC",
                department: null,
                company: null,
                email: "jason@buzinga.com.au",
                imageSrc: "data:image/jpeg;base64,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",
                name: {
                    first: "Buzinga",
                    last: ""
                },
                isOwn: false,
                type: "Company",
                __v: 0
            },
            forSales: true,
            name: "25-26/01/15",
            _type: "wTrackInvoice",
            currency: {
                _id: "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            approved: true,
            removable: false,
            paid: 3770,
            salesPerson: {
                _id: "55b92ad221e4b7c40f00004a",
                dateBirth: "1987-10-25T03:00:00.000Z",
                ID: 34,
                isLead: 2,
                fire: [
                    "2016-03-14T22:00:00.000Z"
                ],
                hire: [
                    "2014-05-25T21:00:00.000Z"
                ],
                social: {
                    FB: "",
                    LI: ""
                },
                sequence: 0,
                jobType: "Select",
                gender: "male",
                marital: "married",
                contractEnd: {
                    reason: "Fired",
                    date: "2016-03-14T22:00:00.000Z"
                },
                attachments: [ ],
                editedBy: {
                    date: "2016-04-04T15:36:05.882Z",
                    user: "563f673270bbc2b740ce89ae"
                },
                createdBy: {
                    date: "2015-07-29T19:34:42.433Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate: "2015-07-29T19:34:42.433Z",
                color: "#4d5a75",
                otherInfo: "",
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                active: false,
                referredBy: "",
                source: "",
                age: 28,
                homeAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                otherId: "",
                bankAccountNo: "",
                nationality: "Ukrainian",
                coach: null,
                manager: "55b92ad221e4b7c40f00004f",
                jobPosition: "55b92acf21e4b7c40f000024",
                department: "55b92ace21e4b7c40f000014",
                visibility: "Public",
                relatedUser: null,
                officeLocation: "",
                skype: "bdm.mobilez365",
                workPhones: {
                    mobile: "+380951132334",
                    phone: ""
                },
                personalEmail: "OOstroverkh@gmail.com",
                workEmail: "oleg.ostroverkh@thinkmobiles.com",
                workAddress: {
                    country: "",
                    zip: "",
                    state: "",
                    city: "",
                    street: ""
                },
                tags: [
                    ""
                ],
                name: {
                    last: "Ostroverkh",
                    first: "Oleg"
                },
                subject: "",
                imageSrc: "data:image/jpeg;base64,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",
                isEmployee: false,
                __v: 0,
                lastFire: 201611,
                transfer: [
                    {
                        date: "2014-05-26T01:00:00.000Z",
                        isDeveloper: true,
                        info: "",
                        salary: 600,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014",
                        status: "hired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date: "2014-08-01T01:00:00.000Z",
                        isDeveloper: true,
                        info: "плюс %",
                        salary: 450,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014",
                        status: "updated",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    },
                    {
                        date: "2016-03-15T02:00:00.000Z",
                        isDeveloper: true,
                        info: "Fired",
                        salary: 450,
                        jobType: "Select",
                        manager: "55b92ad221e4b7c40f00004f",
                        jobPosition: "55b92acf21e4b7c40f000024",
                        department: "55b92ace21e4b7c40f000014",
                        status: "fired",
                        weeklyScheduler: "57332c3b94ee1140b6bb49e2"
                    }
                ],
                weeklyScheduler: "57332c3b94ee1140b6bb49e2"
            }
        }
    ];
    var fakeInvoiceById = {
        _id: "55b92ae121e4b7c40f001275",
        paymentDate: "2015-07-29T19:34:59.185Z",
        dueDate: "2015-02-13T12:09:15.273Z",
        ID: 141,
        editedBy: {
            date: "2015-07-29T19:34:57.678Z",
            user: {
                _id: "52203e707d4dba8813000003",
                __v: 0,
                attachments: [ ],
                credentials: {
                    access_token: "",
                    refresh_token: ""
                },
                email: "info@thinkmobiles.com",
                kanbanSettings: {
                    applications: {
                        countPerPage: 10,
                        foldWorkflows: [
                            "Empty"
                        ]
                    },
                    opportunities: {
                        countPerPage: 14
                    },
                    tasks: {
                        countPerPage: 10,
                        foldWorkflows: [
                            "528ce3caf3f67bc40b000013",
                            "528ce3acf3f67bc40b000012",
                            "528ce30cf3f67bc40b00000f",
                            "528ce35af3f67bc40b000010"
                        ]
                    }
                },
                lastAccess: "2016-05-04T05:51:37.469Z",
                login: "admin",
                pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                profile: 1387275598000,
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                savedFilters: [
                    {
                        _id: "56213057c558b13c1bbf874d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5621307bc558b13c1bbf874f",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213103c558b13c1bbf8750",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213197c558b13c1bbf8751",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56215e86c558b13c1bbf8755",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56229009184ec5a427913306",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id: "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id: "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    },
                    {
                        _id: "56f3d039c1785edc507e81ea",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5717252b526673490fa188a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5717256e526673490fa188a9",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "57172598526673490fa188ac",
                        viewType: "",
                        byDefault: ""
                    }
                ],
                relatedEmployee: "55b92ad221e4b7c40f00004f"
            }
        },
        createdBy: {
            date: "2015-07-29T19:34:57.678Z",
            user: {
                _id: "52203e707d4dba8813000003",
                __v: 0,
                attachments: [ ],
                credentials: {
                    access_token: "",
                    refresh_token: ""
                },
                email: "info@thinkmobiles.com",
                kanbanSettings: {
                    applications: {
                        countPerPage: 10,
                        foldWorkflows: [
                            "Empty"
                        ]
                    },
                    opportunities: {
                        countPerPage: 14
                    },
                    tasks: {
                        countPerPage: 10,
                        foldWorkflows: [
                            "528ce3caf3f67bc40b000013",
                            "528ce3acf3f67bc40b000012",
                            "528ce30cf3f67bc40b00000f",
                            "528ce35af3f67bc40b000010"
                        ]
                    }
                },
                lastAccess: "2016-05-04T05:51:37.469Z",
                login: "admin",
                pass: "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
                profile: 1387275598000,
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                savedFilters: [
                    {
                        _id: "56213057c558b13c1bbf874d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5621307bc558b13c1bbf874f",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213103c558b13c1bbf8750",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56213197c558b13c1bbf8751",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56215e86c558b13c1bbf8755",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56229009184ec5a427913306",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id: "562506bb19a2ecca01ca84b3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56265005d53978de6e9ea440",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "562b83ccb4677e225aa31df6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "564dd4ce9fb8bc3f2195662c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56570d714d96962262fd4b55",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56572368bfd103f108eb4a24",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56604795ccc590f32c577ece",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566047c6ccc590f32c577ed1",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5661a7bf7d284423697e34a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5665429e9294f4d728bcafaa",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "566eba768453e8b464b70a40",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56c711ab0769bba2647ae710",
                        viewType: "",
                        byDefault: "Projects"
                    },
                    {
                        _id: "56daf5322e7b62c613ff2552",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd69d991cb620c19ff60c2",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dd6af71e6cb7131892b2ba",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "56dfe8e56e2877d85455a6bb",
                        viewType: "",
                        byDefault: "Leads"
                    },
                    {
                        _id: "56f3d039c1785edc507e81ea",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5717252b526673490fa188a8",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "5717256e526673490fa188a9",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id: "57172598526673490fa188ac",
                        viewType: "",
                        byDefault: ""
                    }
                ],
                relatedEmployee: "55b92ad221e4b7c40f00004f"
            }
        },
        creationDate: "2015-07-29T19:34:57.678Z",
        groups: {
            group: [ ],
            users: [ ],
            owner: null
        },
        whoCanRW: "everyOne",
        workflow: {
            _id: "55647d982e4aa3804a765ecb",
            status: "Done",
            name: "Paid"
        },
        products: [
            {
                subTotal: 100000,
                unitPrice: 100000,
                taxes: 0,
                jobs: null,
                description: "",
                product: {
                    _id: "5540d528dacb551c24000003",
                    editedBy: {
                        date: "2015-10-30T14:18:42.379Z",
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy: {
                        date: "2015-04-29T12:57:12.785Z",
                        user: null
                    },
                    creationDate: "2015-04-29T12:57:12.785Z",
                    groups: {
                        group: [ ],
                        users: [ ],
                        owner: "560c099da5d4a2e20ba5068b"
                    },
                    whoCanRW: "everyOne",
                    workflow: null,
                    info: {
                        description: "",
                        barcode: "",
                        isActive: true,
                        salePrice: 0,
                        productType: "Service"
                    },
                    name: "IT services",
                    imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                    canBePurchased: true,
                    eventSubscription: true,
                    canBeExpensed: true,
                    canBeSold: true,
                    __v: 0,
                    accounting: {
                        category: {
                            name: ""
                        }
                    }
                },
                quantity: 1
            }
        ],
        payments: [
            {
                _id: "55b92ae221e4b7c40f00138f",
                paymentRef: "",
                name: "1125_2516",
                date: "2015-01-29T00:00:00.000Z",
                paidAmount: 100000
            }
        ],
        paymentInfo: {
            taxes: 0,
            unTaxed: 100000,
            balance: 0,
            total: 100000
        },
        paymentTerms: null,
        salesPerson: {
            _id: "55b92ad221e4b7c40f00004b",
            name: {
                last: "Katona",
                first: "Roland"
            }
        },
        invoiceDate: "2015-01-27T12:09:15.273Z",
        project: "55b92ad621e4b7c40f0006ad",
        paymentReference: "free",
        sourceDocument: {
            _id: "564cfd8ba6e6390160c9efa3",
            editedBy: {
                date: "2015-11-18T22:36:59.697Z",
                user: null
            },
            createdBy: {
                date: "2015-11-18T22:36:59.696Z",
                user: null
            },
            creationDate: "2015-11-18T22:36:59.696Z",
            groups: {
                group: [ ],
                users: [ ],
                owner: null
            },
            whoCanRW: "everyOne",
            workflow: "55647b962e4aa3804a765ec6",
            products: [
                {
                    unitPrice: 1000,
                    subTotal: 1000,
                    taxes: 0,
                    scheduledDate: "2015-01-27T12:09:15.273Z",
                    jobs: "564cfd8ba6e6390160c9ee2c",
                    description: "",
                    product: "5540d528dacb551c24000003",
                    quantity: 1
                }
            ],
            paymentInfo: {
                taxes: 0,
                unTaxed: 1000,
                total: 1000
            },
            paymentTerm: null,
            invoiceRecived: true,
            invoiceControl: null,
            incoterm: null,
            destination: null,
            name: "PO17",
            orderDate: "2015-01-27T12:09:15.273Z",
            deliverTo: null,
            project: "55b92ad621e4b7c40f0006ad",
            supplier: "55b92ad621e4b7c40f000645",
            isOrder: true,
            forSales: true,
            __v: 0,
            type: "Invoiced",
            currency: {
                rate: 1,
                _id: "565eab29aeb95fa9c0f9df2d"
            }
        },
        supplier: {
            _id: "55b92ad621e4b7c40f000645",
            name: {
                last: "",
                first: "Vlad"
            }
        },
        forSales: true,
        invoiceType: "wTrack",
        name: "49-30/01/15",
        __v: 0,
        _type: "wTrackInvoice",
        currency: {
            rate: 1,
            _id: {
                _id: "565eab29aeb95fa9c0f9df2d",
                name: "USD",
                sequence: 0
            }
        }
    };
    var fakeProduct = {
        success: [
            {
                _id: "5540d528dacb551c24000003",
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
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                workflow: null,
                accounting: {
                    category: {
                        name: "",
                        _id: null
                    }
                },
                info: {
                    description: "",
                    barcode: "",
                    isActive: true,
                    salePrice: 0,
                    productType: "Service"
                },
                name: "IT services",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                canBePurchased: true,
                eventSubscription: true,
                canBeExpensed: true,
                canBeSold: true,
                wTrack: null
            },
            {
                _id: "55c0e4a30343b37542000005",
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
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW: "everyOne",
                workflow: null,
                accounting: {
                    category: {
                        name: "",
                        _id: null
                    }
                },
                info: {
                    description: "",
                    barcode: "",
                    isActive: true,
                    salePrice: 0,
                    productType: "Service"
                },
                name: "Bank expenses",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                canBePurchased: true,
                eventSubscription: true,
                canBeExpensed: true,
                canBeSold: true,
                wTrack: null
            },
            {
                _id: "5715fdf09a56725721b14df0",
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
                groups: {
                    group: [ ],
                    users: [ ],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW: "everyOne",
                workflow: null,
                accounting: {
                    category: {
                        name: "All ",
                        _id: "564591f9624e48551dfe3b23"
                    }
                },
                info: {
                    description: "",
                    barcode: "Test",
                    isActive: true,
                    salePrice: 0,
                    productType: null
                },
                name: "TEST",
                imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                canBePurchased: true,
                eventSubscription: true,
                canBeExpensed: false,
                canBeSold: false,
                wTrack: null
            }
        ]
    };
    var expect;
    var view;
    var topBarView;
    var listView;
    var invoiceCollection;
    
    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;
    
    describe('InvoiceView', function () {
        var $fixture;
        var $elFixture;

        after(function () {
            view.remove();
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
                view = new MainView({el: $elFixture, contentType: 'Invoice'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;

            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="56"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="56"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Invoice');
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
                var invoiceUrl = new RegExp('\/Invoice\/list', 'i');

                server.respondWith('GET', invoiceUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                invoiceCollection = new InvoiceCollection({
                    page       : 1,
                    count      : 2,
                    viewType   : 'list',
                    contentType: 'salesInvoice'
                });
                server.respond();
            });

            it('Try to create TopBarView', function () {
                var invoiceUrl = new RegExp('\/Invoice\/list', 'i');

                server.respondWith('GET', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoice)]);
                invoiceCollection = new InvoiceCollection({
                    page       : 1,
                    viewType   : 'list',
                    contentType: 'salesInvoice'
                });
                server.respond();

                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: invoiceCollection
                });

                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Invoices');
            });

        });

        describe('InvoiceListView', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var windowConfirmStub;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to invoice ListView', function (done) {
                    var invoiceUrl = new RegExp('\/Invoice\/list', 'i');
                    var invoiceTotalUrl = new RegExp('\/Invoice\/totalCollectionLength', 'i');

                    server.respondWith('GET', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoice)]);
                    server.respondWith('GET', invoiceTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count: 2
                    })]);

                    listView = new ListView({
                        startTime : new Date(),
                        collection: invoiceCollection
                    });
                    server.respond();
                    server.respond();

                    clock.tick(200);

                    $thisEl = listView.$el;

                    expect($thisEl.find('.list')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.be.not.equals(0);

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

                    invoiceCollection.bind('showmore', listView.showMoreContent, listView);

                    done();
                });

                it('Try to showMore invoices with error', function(){
                    var spyResponse;
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var invoiceUrl = new RegExp('\/Invoice\/list', 'i');

                    server.respondWith('GET', invoiceUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoice)]);
                    $needBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Some Error.');
                });

                it('Try to showMore invoices', function(){
                    var $pageList = $thisEl.find('.pageList');
                    var $needBtn = $pageList.find('a:nth-child(2)');
                    var invoiceUrl = new RegExp('\/Invoice\/list', 'i');
                    var invoiceTotalUrl = new RegExp('\/Invoice\/totalCollectionLength', 'i');

                    server.respondWith('GET', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoice)]);
                    server.respondWith('GET', invoiceTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count: 2
                    })]);
                    $needBtn.click();
                    server.respond();
                    server.respond();

                    expect(listView.$el.find('.list')).to.exist;
                });

                it('Try to delete item', function () {
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var invoiceUrl = new RegExp('\/Invoice\/');
                    var invoiceTotalUrl = new RegExp('\/Invoice\/totalCollectionLength', 'i');

                    $needCheckBox.click();
                    server.respondWith('GET', invoiceTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count: 2
                    })]);
                    server.respondWith('DELETE', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Deleted success'})]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(2);
                });

                it('Try to go to edit dialog', function () {
                    var spyResponse;
                    var $needTd = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var invoiceUrl = new RegExp('\/Invoice\/form', 'i');

                    server.respondWith('GET', invoiceUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoiceById)]);
                    $needTd.click();
                    server.respond();

                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please refresh browser');
                });

                it('Try to go to edit dialog', function () {
                    var $needTd = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var invoiceUrl = new RegExp('\/Invoice\/form', 'i');
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

                    expect($('.ui-dialog')).to.exist;
                });

            });
        });

    });
});*/
