define([
    'modules',
    'text!fixtures/index.html',
    'collections/Product/filterCollection',
    'views/main/MainView',
    'views/Product/thumbnails/ThumbnailsView',
    'views/Product/list/ListView',
    'views/Product/CreateView',
    'views/Product/EditView',
    'views/Product/TopBarView',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (modules, fixtures, ProductCollection, MainView, ThumbnailsView, ListView, CreateView, EditView, TopBarView, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var fakeProducts = {
        success: [
            {
                _id              : "55c0e4a30343b37542000005",
                __v              : 0,
                editedBy         : {
                    date: "2015-08-04T16:13:23.246Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy        : {
                    date: "2015-08-04T16:13:23.246Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate     : "2015-08-04T16:13:23.246Z",
                groups           : {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW         : "everyOne",
                workflow         : null,
                accounting       : {
                    category: {
                        name: "",
                        _id : null
                    }
                },
                info             : {
                    description: "",
                    barcode    : "",
                    isActive   : true,
                    salePrice  : 0,
                    productType: "Service"
                },
                name             : "Bank expenses",
                imageSrc         : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                canBePurchased   : true,
                eventSubscription: true,
                canBeExpensed    : true,
                canBeSold        : false,
                wTrack           : null
            },
            {
                _id              : "5540d528dacb551c24000003",
                __v              : 0,
                editedBy         : {
                    date: "2015-10-30T14:18:42.379Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy        : {
                    date: "2015-04-29T12:57:12.785Z",
                    user: null
                },
                creationDate     : "2015-04-29T12:57:12.785Z",
                groups           : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW         : "everyOne",
                workflow         : null,
                accounting       : {
                    category: {
                        name: "",
                        _id : null
                    }
                },
                info             : {
                    description: "",
                    barcode    : "",
                    isActive   : true,
                    salePrice  : 0,
                    productType: "Service"
                },
                name             : "IT services",
                imageSrc         : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                canBePurchased   : true,
                eventSubscription: true,
                canBeExpensed    : true,
                canBeSold        : true,
                wTrack           : null
            }
        ]
    };
    var fakeAlphabet = {
        data: [
            {
                _id: "B"
            },
            {
                _id: "I"
            }
        ]
    };
    var fakeProductByLetter = {
        success: [
            {
                _id              : "55c0e4a30343b37542000005",
                __v              : 0,
                editedBy         : {
                    date: "2015-08-04T16:13:23.246Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy        : {
                    date: "2015-08-04T16:13:23.246Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate     : "2015-08-04T16:13:23.246Z",
                groups           : {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW         : "everyOne",
                workflow         : null,
                accounting       : {
                    category: {
                        name: "",
                        _id : null
                    }
                },
                info             : {
                    description: "",
                    barcode    : "",
                    isActive   : true,
                    salePrice  : 0,
                    productType: "Service"
                },
                name             : "Bank expenses",
                imageSrc         : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                canBePurchased   : true,
                eventSubscription: true,
                canBeExpensed    : true,
                canBeSold        : false,
                wTrack           : null
            }
        ]
    };
    var fakeProductById = {
        _id              : "5540d528dacb551c24000003",
        __v              : 0,
        editedBy         : {
            date: "2015-10-30T14:18:42.379Z",
            user: {
                _id            : "52203e707d4dba8813000003",
                __v            : 0,
                attachments    : [],
                lastAccess     : "2016-04-18T06:14:22.257Z",
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
        createdBy        : {
            date: "2015-04-29T12:57:12.785Z",
            user: null
        },
        creationDate     : "2015-04-29T12:57:12.785Z",
        groups           : {
            group: [],
            users: [],
            owner: {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            }
        },
        whoCanRW         : "everyOne",
        workflow         : null,
        accounting       : {
            category: {
                name: "",
                _id : null
            }
        },
        info             : {
            description: "",
            barcode    : "",
            isActive   : true,
            salePrice  : 0,
            productType: {
                _id : "Service",
                name: "Service"
            }
        },
        name             : "IT services",
        imageSrc         : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
        canBePurchased   : true,
        eventSubscription: true,
        canBeExpensed    : true,
        canBeSold        : true,
        wTrack           : null
    };
    var fakeProductTypeForDD = {
        data: [
            {
                _id : "Stock",
                name: "Product"
            },
            {
                _id : "Service",
                name: "Service"
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
                _id  : "56f105f5f504b2b550af0103",
                login: "bohdana.stets"
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
            },
            {
                _id  : "56e92c7a52252ef45d219264",
                login: "yevgenia.melnyk"
            }
        ]
    };
    var fakeCategories = {
        data: [
            {
                _id         : "564591f9624e48551dfe3b23",
                __v         : 0,
                sequence    : 0,
                nestingLevel: null,
                editedBy    : {
                    user: "52203e707d4dba8813000003"
                },
                createdBy   : {
                    date: "2015-11-13T07:32:09.792Z",
                    user: "52203e707d4dba8813000003"
                },
                users       : [],
                parent      : null,
                fullName    : "All",
                name        : "All"
            },
            {
                _id         : "56459202624e48551dfe3b24",
                __v         : 0,
                sequence    : 0,
                nestingLevel: null,
                editedBy    : {
                    user: "52203e707d4dba8813000003"
                },
                createdBy   : {
                    date: "2015-11-13T07:32:18.495Z",
                    user: "52203e707d4dba8813000003"
                },
                users       : [],
                parent      : {
                    _id         : "564591f9624e48551dfe3b23",
                    __v         : 0,
                    sequence    : 0,
                    nestingLevel: null,
                    editedBy    : {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy   : {
                        date: "2015-11-13T07:32:09.792Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users       : [],
                    parent      : null,
                    fullName    : "All",
                    name        : "All"
                },
                fullName    : "All / Expenses",
                name        : "Expenses"
            },
            {
                _id         : "5645925f624e48551dfe3b26",
                __v         : 0,
                sequence    : 4,
                nestingLevel: 1,
                editedBy    : {
                    user: "52203e707d4dba8813000003"
                },
                createdBy   : {
                    date: "2015-11-13T07:33:51.900Z",
                    user: "52203e707d4dba8813000003"
                },
                users       : [],
                parent      : {
                    _id         : "56459202624e48551dfe3b24",
                    __v         : 0,
                    sequence    : 0,
                    nestingLevel: null,
                    editedBy    : {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy   : {
                        date: "2015-11-13T07:32:18.495Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users       : [],
                    parent      : "564591f9624e48551dfe3b23",
                    fullName    : "All / Expenses",
                    name        : "Expenses"
                },
                fullName    : "All / Expenses / Bonus Card",
                name        : "Bonus Card"
            },
            {
                _id         : "5645920f624e48551dfe3b25",
                __v         : 0,
                sequence    : 0,
                nestingLevel: 1,
                editedBy    : {
                    user: "52203e707d4dba8813000003"
                },
                createdBy   : {
                    date: "2015-11-13T07:32:31.085Z",
                    user: "52203e707d4dba8813000003"
                },
                users       : [],
                parent      : {
                    _id         : "56459202624e48551dfe3b24",
                    __v         : 0,
                    sequence    : 0,
                    nestingLevel: null,
                    editedBy    : {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy   : {
                        date: "2015-11-13T07:32:18.495Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users       : [],
                    parent      : "564591f9624e48551dfe3b23",
                    fullName    : "All / Expenses",
                    name        : "Expenses"
                },
                fullName    : "All / Expenses / Bonus Cash",
                name        : "Bonus Cash"
            },
            {
                _id         : "56459308abb1c35728ad7d10",
                __v         : 0,
                sequence    : 5,
                nestingLevel: 2,
                editedBy    : {
                    user: "52203e707d4dba8813000003"
                },
                createdBy   : {
                    date: "2015-11-13T07:36:40.347Z",
                    user: "52203e707d4dba8813000003"
                },
                users       : [],
                parent      : {
                    _id         : "56459202624e48551dfe3b24",
                    __v         : 0,
                    sequence    : 0,
                    nestingLevel: null,
                    editedBy    : {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy   : {
                        date: "2015-11-13T07:32:18.495Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users       : [],
                    parent      : "564591f9624e48551dfe3b23",
                    fullName    : "All / Expenses",
                    name        : "Expenses"
                },
                fullName    : "All / Expenses / Salary Card",
                name        : "Salary Card"
            },
            {
                _id         : "564592fbabb1c35728ad7d0f",
                __v         : 0,
                sequence    : 0,
                nestingLevel: 1,
                editedBy    : {
                    user: "52203e707d4dba8813000003"
                },
                createdBy   : {
                    date: "2015-11-13T07:36:27.099Z",
                    user: "52203e707d4dba8813000003"
                },
                users       : [],
                parent      : {
                    _id         : "56459202624e48551dfe3b24",
                    __v         : 0,
                    sequence    : 0,
                    nestingLevel: null,
                    editedBy    : {
                        user: "52203e707d4dba8813000003"
                    },
                    createdBy   : {
                        date: "2015-11-13T07:32:18.495Z",
                        user: "52203e707d4dba8813000003"
                    },
                    users       : [],
                    parent      : "564591f9624e48551dfe3b23",
                    fullName    : "All / Expenses",
                    name        : "Expenses"
                },
                fullName    : "All / Expenses / Salary Cash",
                name        : "Salary Cash"
            }
        ]
    };
    var fakeProductsList = {
        success: [
            {
                _id              : "55c0e4a30343b37542000005",
                __v              : 0,
                editedBy         : {
                    date: "2016-04-18T14:50:39.186Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy        : {
                    date: "2015-08-04T16:13:23.246Z",
                    user: "52203e707d4dba8813000003"
                },
                creationDate     : "2015-08-04T16:13:23.246Z",
                groups           : {
                    group: [],
                    users: [],
                    owner: "55ba28c8d79a3a3439000016"
                },
                whoCanRW         : "everyOne",
                workflow         : null,
                accounting       : {
                    category: {
                        name: "",
                        _id : null
                    }
                },
                info             : {
                    description: "",
                    barcode    : "",
                    isActive   : true,
                    salePrice  : 0,
                    productType: "Service"
                },
                name             : "Bank expenses",
                imageSrc         : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                canBePurchased   : true,
                eventSubscription: true,
                canBeExpensed    : true,
                canBeSold        : true,
                wTrack           : null
            },
            {
                _id              : "5540d528dacb551c24000003",
                __v              : 0,
                editedBy         : {
                    date: "2015-10-30T14:18:42.379Z",
                    user: "52203e707d4dba8813000003"
                },
                createdBy        : {
                    date: "2015-04-29T12:57:12.785Z",
                    user: null
                },
                creationDate     : "2015-04-29T12:57:12.785Z",
                groups           : {
                    group: [],
                    users: [],
                    owner: "560c099da5d4a2e20ba5068b"
                },
                whoCanRW         : "everyOne",
                workflow         : null,
                accounting       : {
                    category: {
                        name: "",
                        _id : null
                    }
                },
                info             : {
                    description: "",
                    barcode    : "",
                    isActive   : true,
                    salePrice  : 0,
                    productType: "Service"
                },
                name             : "IT services",
                imageSrc         : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                canBePurchased   : true,
                eventSubscription: true,
                canBeExpensed    : true,
                canBeSold        : true,
                wTrack           : null
            }
        ]
    };
    var expect;
    var view;
    var topBarView;
    var listView;
    var thumbnailsView;
    var productCollection;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('ProductView', function () {

        var $fixture;
        var $elFixture;

        after(function () {
            thumbnailsView.remove();
            listView.remove();
            topBarView.remove();
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
                view = new MainView({el: $elFixture, contentType: 'Product'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;

            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="58"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="58"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/Product');

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
                var productUrl = new RegExp('\/product\/thumbnails', 'i');
                server.respondWith('GET', productUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeProducts)]);

                productCollection = new ProductCollection({
                    viewType   : 'thumbnails',
                    contentType: 'Product',
                    page       : 1
                });
                server.respond();

                //expect(window.location.hash).to.be.equals('#login');
            });

            it('Try to create TopBarView', function () {
                var productUrl = new RegExp('\/product\/thumbnails', 'i');
                var productTotal = new RegExp('\/product\/totalCollectionLength', 'i');

                server.respondWith('GET', productTotal, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                    showMore: false,
                    count   : 2
                })]);
                server.respondWith('GET', productUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProducts)]);

                productCollection = new ProductCollection({
                    viewType   : 'thumbnails',
                    contentType: 'Product',
                    page       : 1
                });
                server.respond();
                server.respond();

                topBarView = new TopBarView({
                    collection: productCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('#template-switcher')).to.exist;
                expect(topBarView.$el.find('#forImport')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Product');
            });

        });

        describe('Product ThumbnailsView', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;
            var windowAlertStub;
            var $thisEl;
            var clock;

            before(function () {
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowAlertStub = sinon.stub(window, 'alert');
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                windowAlertStub.restore();
                mainSpy.restore();
                clock.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to product ThumbnailsView', function (done) {

                    var productAlphabetUrl = new RegExp('/product/getProductsAlphabet', 'i');

                    server.respondWith('GET', productAlphabetUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeAlphabet)]);

                    thumbnailsView = new ThumbnailsView({
                        collection: productCollection,
                        startTime : new Date()
                    });

                    server.respond();
                    clock.tick(200);

                    $thisEl = thumbnailsView.$el;

                    expect($thisEl.find('.thumbnailwithavatar').length).to.be.not.equals(0);

                    done();
                });

                it('Try to filter thumbnailsView by ProductName', function () {
                    var $productName;
                    var $selectedItem;
                    var $searchContentArrow = $thisEl.find('.search-content');
                    var productUrl = new RegExp('\/product\/thumbnails', 'i');

                    server.respondWith('GET', productUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: [fakeProducts.success[1]]})]);
                    $searchContentArrow.click();

                    expect($thisEl.find('.search-options')).to.have.not.class('hidden');

                    $productName = $thisEl.find('#nameFullContainer > .groupName');
                    $productName.click();
                    $selectedItem = $thisEl.find('#nameUl > li[data-value="5540d528dacb551c24000003"]');
                    $selectedItem.click();

                    server.respond();

                    expect($thisEl.find('#searchContainer')).to.exist;
                    expect($thisEl.find('.product')).to.exist;
                    expect($thisEl.find('.product').length).to.equals(1);

                    $searchContentArrow.click();
                    expect($thisEl.find('.search-options')).to.have.class('hidden');
                });

                it('Try to click on letter', function () {
                    var $lettersHolder = $thisEl.find('#startLetter');
                    var $needLetter = $lettersHolder.find('a:nth-child(4)');
                    var productAlphabetUrl = new RegExp('/product/getProductsAlphabet', 'i');
                    var productTotal = new RegExp('\/product\/totalCollectionLength', 'i');
                    var productUrl = new RegExp('\/product\/thumbnails', 'i');

                    server.respondWith('GET', productAlphabetUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeAlphabet)]);
                    server.respondWith('GET', productTotal, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        showMore: true,
                        count   : 1
                    })]);
                    server.respondWith('GET', productUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProductByLetter)]);
                    $needLetter.click();
                    server.respond();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('.product')).to.exist;
                    expect($thisEl.find('.product').length).to.equals(1);

                });

                it('Try to show more content', function () {
                    var $showMoreBtn = $thisEl.find('#showMore');
                    var productUrl = new RegExp('\/product\/thumbnails', 'i');
                    var productTotal = new RegExp('\/product\/totalCollectionLength', 'i');

                    server.respondWith('GET', productTotal, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        showMore: false,
                        count   : 2
                    })]);
                    server.respondWith('GET', productUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProducts)]);
                    $showMoreBtn.click();
                    server.respond();
                    server.respond();

                    expect($thisEl.find('.product')).to.exist;
                    expect($thisEl.find('.product').length).to.equals(3);
                });

                it('Try to open editView with error', function () {
                    var spyResponse;
                    var $needItem = $thisEl.find('#5540d528dacb551c24000003');
                    var productFormUrl = new RegExp('\/Product\/form\/', 'i');

                    server.respondWith('GET', productFormUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $needItem.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please refresh browser');

                });

                it('Try to open editView', function () {
                    var $needItem = $thisEl.find('#5540d528dacb551c24000003');
                    var productFormUrl = new RegExp('\/Product\/form\/', 'i');
                    var productUrl = '/product/getProductsTypeForDd';
                    var usersForDDUrl = '/users/forDd';
                    var categoryUrl = '/category';

                    server.respondWith('GET', productFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProductById)]);
                    server.respondWith('GET', productUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProductTypeForDD)]);
                    server.respondWith('GET', usersForDDUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsersForDD)]);
                    server.respondWith('GET', categoryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCategories)]);
                    $needItem.click();
                    server.respond();
                    server.respond();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to change tab', function () {
                    var $dialog = $('.ui-dialog');
                    var $firstTab = $($dialog.find('.dialog-tabs > li:nth-child(1) > a')[0]);
                    var $secondTab = $($dialog.find('.dialog-tabs > li:nth-child(2) > a')[0]);

                    expect($firstTab).to.have.class('active');

                    $firstTab.click();
                    expect($($dialog.find('.dialog-tabs > li:nth-child(1) > a')[0])).to.have.class('active');

                    $secondTab.click();
                    expect($($dialog.find('.dialog-tabs > li:nth-child(2) > a')[0])).to.have.class('active');
                });

                it('Try to edit product with error', function () {
                    var firefoxPattern = new RegExp('firefox', 'i');
                    var userAgent = navigator.userAgent;
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)')
                    var productUrl = new RegExp('\/Product\/', 'i');
                    var hashUrlProduct = new RegExp('#easyErp\/Product', 'i');

                    windowAlertStub.returns(true);

                    server.respondWith('PATCH', productUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    if (firefoxPattern.test(userAgent)) {
                        expect(hashUrlProduct.test(window.location.hash)).to.be.true;
                    } else {
                        expect(window.location.hash).to.be.equals('#easyErp/Product/thumbnails/c=100/filter=%7B%22name%22%3A%7B%22key%22%3A%22_id%22%2C%22value%22%3A%5B%225540d528dacb551c24000003%22%5D%2C%22type%22%3Anull%2C%22sort%22%3A%7B%22order%22%3A1%7D%7D%2C%22letter%22%3A%7B%22key%22%3A%22letter%22%2C%22value%22%3A%22B%22%2C%22type%22%3Anull%7D%7D');
                    }

                });

                it('Try to edit product item', function () {
                    var $productType;
                    var $selectedItem;
                    var $dialog = $('.ui-dialog');
                    var $firstTab = $($dialog.find('.dialog-tabs > li:nth-child(1) > a')[0]);
                    var $productName = $dialog.find('#product');
                    var $barCode = $dialog.find('#barcode');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)')
                    var productUrl = new RegExp('\/Product\/', 'i');
                    var firefoxPattern = new RegExp('firefox', 'i');
                    var userAgent = navigator.userAgent;
                    var hashUrlProduct = new RegExp('#easyErp\/Product', 'i');

                    $firstTab.click();

                    // creating barCode
                    $barCode.val('Test');
                    $barCode.trigger('change');

                    $productName.val('Test');
                    $productType = $dialog.find('a#productType');
                    $productType.click();
                    $selectedItem = $dialog.find('li#Stock');
                    $selectedItem.click();

                    server.respondWith('PATCH', productUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;

                    if (firefoxPattern.test(userAgent)) {
                        expect(hashUrlProduct.test(window.location.hash)).to.be.true;
                    } else {
                        expect(window.location.hash).to.be.equals('#easyErp/Product/thumbnails/c=100/filter=%7B%22name%22%3A%7B%22key%22%3A%22_id%22%2C%22value%22%3A%5B%225540d528dacb551c24000003%22%5D%2C%22type%22%3Anull%2C%22sort%22%3A%7B%22order%22%3A1%7D%7D%2C%22letter%22%3A%7B%22key%22%3A%22letter%22%2C%22value%22%3A%22B%22%2C%22type%22%3Anull%7D%7D');
                    }
                });

                it('Try to delete item for EditView with 403 error', function () {
                    var $deleteBtn;
                    var spyResponse;
                    var productFormUrl = new RegExp('\/Product\/form\/', 'i');
                    var $needItem = $thisEl.find('#55c0e4a30343b37542000005');
                    var productUrl = new RegExp('\/product\/', 'i');

                    windowConfirmStub.returns(true);

                    server.respondWith('GET', productFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProductById)]);
                    $needItem.click();
                    server.respond();

                    $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');

                    server.respondWith('DELETE', productUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Deleted success'})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[1][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'You do not have permission to perform this action');
                });

                it('Try to delete item for EditView', function () {
                    var $deleteBtn;
                    var productUrl = new RegExp('\/product\/', 'i');
                    var firefoxPattern = new RegExp('firefox', 'i');
                    var userAgent = navigator.userAgent;
                    var hashProductUrl = new RegExp('#easyErp\/Product', 'i');

                    windowConfirmStub.returns(true);

                    $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');

                    server.respondWith('DELETE', productUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Deleted success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect($('.ui-dialog')).to.not.exist;

                    if (firefoxPattern.test(userAgent)) {
                        expect(hashProductUrl.test(window.location.hash)).to.be.true;

                    } else {
                        expect(window.location.hash).to.be.equals('#easyErp/Product');
                    }
                });

                it('Try to open CreateView', function () {
                    var productUrl = '/product/getProductsTypeForDd';
                    var usersForDDUrl = '/users/forDd';
                    var categoryUrl = '/category';
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');

                    server.respondWith('GET', productUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProductTypeForDD)]);
                    server.respondWith('GET', usersForDDUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsersForDD)]);
                    server.respondWith('GET', categoryUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCategories)]);
                    $createBtn.click();
                    server.respond();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to change tab', function () {
                    var $dialog = $('.ui-dialog');
                    var $firstTab = $($dialog.find('.dialog-tabs > li:nth-child(1) > a')[0]);
                    var $secondTab = $($dialog.find('.dialog-tabs > li:nth-child(2) > a')[0]);

                    expect($firstTab).to.have.class('active');

                    $firstTab.click();
                    expect($($dialog.find('.dialog-tabs > li:nth-child(1) > a')[0])).to.have.class('active');

                    $secondTab.click();
                    expect($($dialog.find('.dialog-tabs > li:nth-child(2) > a')[0])).to.have.class('active');
                });

                it('Try to showEdit|hideEdit', function (done) {
                    var $dialog = $('.ui-dialog');
                    var $firsTab = $($dialog.find('.dialog-tabs > li:nth-child(1) > a')[0]);
                    var $dialog = $('.ui-dialog');
                    var $avatar = $dialog.find('.avatar');

                    $firsTab.click();

                    // show Edit
                    $avatar.mouseover();
                    //clock.tick(300);
                    expect($avatar.find('#inputImg')).to.exist;
                    expect($avatar.find('.upload')).to.have.css({'height': '140px'});

                    // hide Edit
                    $avatar.mouseleave();
                    //clock.tick(300);
                    expect($avatar.find('#inputImg')).to.exist;
                    expect($avatar.find('.upload')).to.have.css({'height': '0px'});

                    done();
                });

                it('Try to set correct data for creating item', function () {
                    var $productType;
                    var $selectedItem;
                    var $productCategory;
                    var $dialog = $('.ui-dialog');
                    var $canBeSoldBtn = $dialog.find('#sold');
                    var $accountingTab = $($dialog.find('.dialog-tabs > li:nth-child(2) > a')[1]);
                    var $productName = $dialog.find('#product');
                    var $salePrice = $dialog.find('#salePrice');
                    var $barCode = $dialog.find('#barcode');
                    var $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)')
                    var $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    var productUrl = new RegExp('\/Product\/', 'i');
                    var firefoxPattern = new RegExp('firefox', 'i');
                    var userAgent = navigator.userAgent;
                    var hashProductUrl = new RegExp('#easyErp\/Product', 'i');

                    // creating barCode
                    $barCode.val('Test');
                    $barCode.trigger('change');

                    $canBeSoldBtn.click();

                    $productName.val('Test');
                    $productType = $dialog.find('a#productType');
                    $productType.click();
                    $selectedItem = $dialog.find('li#Stock');
                    $selectedItem.click();
                    $salePrice.val('15000');

                    // select product category
                    $accountingTab.click();
                    $productCategory = $dialog.find('#productCategory');
                    $productCategory.click();
                    $selectedItem = $dialog.find('#56459308abb1c35728ad7d10');
                    $selectedItem.click();


                    server.respondWith('POST', productUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Created success'})]);
                    $saveBtn.click();
                    server.respond();

                    if (firefoxPattern.test(userAgent)) {
                        expect(hashProductUrl.test(window.location.hash)).to.be.true;
                    } else {
                        expect(window.location.hash).to.be.equals('#easyErp/Product');
                    }

                    $cancelBtn.click();
                    expect($('.ui-dialog')).to.not.exist;
                });

            });
        });

        describe('Product ListView', function () {
            var server;
            var mainSpy;
            var windowConfirmStub;
            var $thisEl;
            var productListCollection;

            before(function () {
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                mainSpy = sinon.spy(App, 'render');
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                mainSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create Product ListView', function () {
                    var productListUrl = new RegExp('\/product\/list', 'i');
                    var productAlphabetUrl = new RegExp('/product/getProductsAlphabet', 'i');
                    var productTotal = new RegExp('\/product\/totalCollectionLength', 'i');

                    server.respondWith('GET', productListUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProductsList)]);
                    productListCollection = new ProductCollection({
                        viewType   : 'list',
                        contentType: 'Product',
                        page       : 1
                    });
                    server.respond();

                    server.respondWith('GET', productAlphabetUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeAlphabet)]);
                    server.respondWith('GET', productTotal, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        showMore: false,
                        count   : 2
                    })]);
                    listView = new ListView({
                        collection: productListCollection,
                        startTime : new Date()
                    });
                    server.respond();
                    server.respond();

                    // bind events to topBarView
                    topBarView.bind('createEvent', listView.createItem, listView);
                    topBarView.bind('editEvent', listView.editItem, listView);
                    topBarView.bind('deleteEvent', listView.deleteItems, listView);
                    topBarView.bind('exportToCsv', listView.exportToCsv, listView);
                    topBarView.bind('exportToXlsx', listView.exportToXlsx, listView);
                    topBarView.bind('importEvent', listView.importFiles, listView);

                    // bind events to productCollection
                    productListCollection.bind('showmoreAlphabet', listView.showMoreAlphabet, listView);
                    productListCollection.bind('showmore', listView.showMoreContent, listView);

                    $thisEl = listView.$el;

                    expect($thisEl.find('#searchContainer')).to.exist;
                    expect($thisEl.find('.list')).to.exist;
                    expect($thisEl.find('#listTable')).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.equals(2);
                });

                it('Try to open EditView with error', function () {
                    var spyResponse;
                    var $needItem = $thisEl.find('#listTable > tr[data-id="5540d528dacb551c24000003"] > td:nth-child(3)');
                    var productUrl = new RegExp('\/Product\/form');

                    server.respondWith('GET', productUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeProductById)]);
                    $needItem.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                    expect(spyResponse).to.have.property('message', 'Please refresh browser');
                });

                it('Try to open EditView', function () {
                    var $cancelBtn;
                    var $needItem = $thisEl.find('#listTable > tr[data-id="5540d528dacb551c24000003"] > td:nth-child(3)');
                    var productUrl = new RegExp('\/Product\/form');

                    server.respondWith('GET', productUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProductById)]);
                    $needItem.click();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;

                    $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(2)');
                    $cancelBtn.click();
                    expect($('.ui-dialog')).to.not.exist;
                });

                it('Try to delete item', function () {
                    var firefoxPattern = new RegExp('firefox', 'i');
                    var userAgent = navigator.userAgent;
                    var $topBarDelBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var $needCheckBox = $thisEl.find('#listTable > tr[data-id="55c0e4a30343b37542000005"] > td.notForm > input');
                    var productUrl = new RegExp('\/product\/', 'i');
                    var hashUrlProduct = new RegExp('#easyErp\/Product', 'i');

                    windowConfirmStub.returns(true);
                    $needCheckBox.click();

                    server.respondWith('DELETE', productUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Deleted success'})]);
                    $topBarDelBtn.click();
                    server.respond();

                    if (firefoxPattern.test(userAgent)) {
                        expect(hashUrlProduct.test(window.location.hash)).to.be.true;
                    } else {
                        expect(window.location.hash).to.be.equals('#easyErp/Product/list/p=1/c=100');
                    }
                });

            });
        });

    });


});
