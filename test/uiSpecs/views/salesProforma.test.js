define([
    'Backbone',
    'Underscore',
    'modules',
    'text!fixtures/index.html',
    'collections/salesProforma/filterCollection',
    'views/main/MainView',
    'views/salesProforma/list/ListView',
    'views/salesProforma/TopBarView',
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
             ProformaCollection,
             MainView,
             ListView,
             TopBarView,
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
    var fakeProformas = {
        total: 300,
        data : [
            {
                _id        : "570f7f05983b1a8e4f9bbfa9",
                total      : 30,
                salesPerson: {
                    name: {
                        last : "Romanyuk",
                        first: "Stanislav"
                    }
                },
                workflow   : {
                    _id   : "56fabcf0e71823e438e4e1ca",
                    status: "Done",
                    name  : "Invoiced"
                },
                supplier   : {
                    _id : "5735a3501fe93b5647add58e",
                    name: {
                        last : "",
                        first: "Foxtrapp Limited"
                    }
                },
                project    : {
                    _id : "56ab891074d57e0d56d6be1f",
                    name: "Serial Box"
                },
                forSales   : true,
                currency   : {
                    rate: 1,
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                paymentInfo: {
                    taxes  : 0,
                    balance: 0,
                    unTaxed: 277500,
                    total  : 277500
                },
                invoiceDate: "2016-02-07T23:00:00.000Z",
                name       : "PO782",
                paymentDate: "2016-02-15T04:00:00.000Z",
                dueDate    : "2016-02-21T23:00:00.000Z",
                approved   : true,
                _type      : "Proforma",
                removable  : true,
                paid       : 2775
            },
            {
                _id        : "570f8d09a2489b5b7ba831cb",
                total      : 30,
                salesPerson: {
                    name: {
                        last : "Ostroverkh",
                        first: "Oleg"
                    }
                },
                workflow   : {
                    _id   : "56fabcf0e71823e438e4e1ca",
                    status: "Done",
                    name  : "Invoiced"
                },
                supplier   : {
                    _id : "562bed4062461bfd59ef58d1",
                    name: {
                        last : "",
                        first: "TreatMe"
                    }
                },
                project    : {
                    _id : "562beda846bca6e4591f4930",
                    name: "TreatMe"
                },
                forSales   : true,
                currency   : {
                    _id : "565eab29aeb95fa9c0f9df2d",
                    rate: 1
                },
                paymentInfo: {
                    total  : 700000,
                    unTaxed: 700000,
                    balance: 0,
                    taxes  : 0
                },
                invoiceDate: "2015-10-28T04:00:00.000Z",
                name       : "PO970",
                paymentDate: "2015-11-04T04:00:00.000Z",
                dueDate    : "2015-11-11T04:00:00.000Z",
                approved   : true,
                _type      : "Proforma",
                removable  : true,
                paid       : 7000
            },
            {
                _id        : "570f8d4d983b1a8e4f9bbfb3",
                total      : 30,
                salesPerson: {
                    name: {
                        last : "Ostroverkh",
                        first: "Oleg"
                    }
                },
                workflow   : {
                    _id   : "56fabcf0e71823e438e4e1ca",
                    status: "Done",
                    name  : "Invoiced"
                },
                supplier   : {
                    _id : "562bed4062461bfd59ef58d1",
                    name: {
                        last : "",
                        first: "TreatMe"
                    }
                },
                project    : {
                    _id : "562beda846bca6e4591f4930",
                    name: "TreatMe"
                },
                forSales   : true,
                currency   : {
                    _id : "565eab29aeb95fa9c0f9df2d",
                    rate: 1
                },
                paymentInfo: {
                    total  : 400000,
                    unTaxed: 400000,
                    balance: 0,
                    taxes  : 0
                },
                invoiceDate: "2015-11-19T04:00:00.000Z",
                name       : "PO970",
                paymentDate: "2015-11-29T04:00:00.000Z",
                dueDate    : "2015-12-03T04:00:00.000Z",
                approved   : true,
                _type      : "Proforma",
                removable  : true,
                paid       : 4000
            }
        ]
    };
    var fakeInvoiceById = {
        _id             : "570f8d09a2489b5b7ba831cb",
        _type       : "Proforma",
        project     : {
            _id: "562beda846bca6e4591f4930"
        },
        products    : [
            {
                unitPrice  : 700000,
                subTotal   : 700000,
                taxes      : 0,
                jobs       : {
                    _id      : "566424cd08ed794128637c23",
                    invoice  : "572b4a9c35b6dafc05d3bce9",
                    quotation: "570f8cf76f3bd57c48cdb091",
                    budget   : {
                        budgetTotal: {
                            minDate   : 201543,
                            maxDate   : 201610,
                            hoursSum  : 4458,
                            revenueSum: 1669999.9999999998,
                            costSum   : 15043
                        },
                        projectTeam: [
                            {
                                budget    : {
                                    hoursSum  : 656,
                                    revenueSum: 245742.4854194706,
                                    costSum   : 0
                                },
                                employee  : {
                                    name       : {
                                        first: "Ivan",
                                        last : "Grab"
                                    },
                                    jobPosition: {
                                        name: "Junior iOS",
                                        _id : "55b92acf21e4b7c40f00002c"
                                    },
                                    _id        : "55b92ad221e4b7c40f00008e"
                                },
                                department: {
                                    departmentName: "iOS",
                                    _id           : "55b92ace21e4b7c40f00000f"
                                }
                            },
                            {
                                budget    : {
                                    hoursSum  : 160,
                                    revenueSum: 59937.19156572453,
                                    costSum   : 15043
                                },
                                employee  : {
                                    name       : {
                                        first: "Timur",
                                        last : "Berezhnoi"
                                    },
                                    jobPosition: {
                                        name: "Junior JS",
                                        _id : "55b92acf21e4b7c40f000017"
                                    },
                                    _id        : "55c98df0cbb0f4910b000007"
                                },
                                department: {
                                    departmentName: "Web",
                                    _id           : "55b92ace21e4b7c40f000016"
                                }
                            },
                            {
                                budget    : {
                                    hoursSum  : 564,
                                    revenueSum: 211278.60026917903,
                                    costSum   : 0
                                },
                                employee: {
                                    name       : {
                                        first: "Michael",
                                        last : "Vashkeba"
                                    },
                                    jobPosition: {
                                        name: "Junior JS",
                                        _id : "55b92acf21e4b7c40f000017"
                                    },
                                    _id        : "55b92ad221e4b7c40f0000bd"
                                },
                                department: {
                                    departmentName: "Web",
                                    _id           : "55b92ace21e4b7c40f000016"
                                }
                            },
                            {
                                budget    : {
                                    hoursSum  : 376,
                                    revenueSum: 140852.40017945267,
                                    costSum   : 0
                                },
                                employee: {
                                    name       : {
                                        first: "Sergiy",
                                        last : "Degtyar"
                                    },
                                    jobPosition: {
                                        name: "Junior iOS",
                                        _id : "55b92acf21e4b7c40f00002c"
                                    },
                                    _id        : "55d1a2b18f61e2c90b000023"
                                },
                                department: {
                                    departmentName: "iOS",
                                    _id           : "55b92ace21e4b7c40f00000f"
                                }
                            },
                            {
                                budget    : {
                                    hoursSum  : 248,
                                    revenueSum: 92902.64692687303,
                                    costSum   : 0
                                },
                                employee: {
                                    name       : {
                                        first: "Ishtvan",
                                        last : "Nazarovich"
                                    },
                                    jobPosition: {
                                        name: "Middle JS",
                                        _id : "55b92acf21e4b7c40f00001c"
                                    },
                                    _id        : "55b92ad221e4b7c40f000034"
                                },
                                department: {
                                    departmentName: "Web",
                                    _id           : "55b92ace21e4b7c40f000016"
                                }
                            },
                            {
                                budget    : {
                                    hoursSum  : 235,
                                    revenueSum: 88032.75011215793,
                                    costSum   : 0
                                },
                                employee: {
                                    name       : {
                                        first: "Liliya",
                                        last : "Orlenko"
                                    },
                                    jobPosition: {
                                        name: "Junior Designer",
                                        _id : "55b92acf21e4b7c40f000028"
                                    },
                                    _id        : "564a0186ad4bc9e53f1f6193"
                                },
                                department: {
                                    departmentName: "Design",
                                    _id           : "55bb1f14cb76ca630b000006"
                                }
                            },
                            {
                                budget    : {
                                    hoursSum  : 236,
                                    revenueSum: 88407.3575594437,
                                    costSum   : 0
                                },
                                employee: {
                                    name       : {
                                        first: "Valerii",
                                        last : "Ladomiryak"
                                    },
                                    jobPosition: {
                                        name: "CSS",
                                        _id : "55ddd8a2f09cc2ec0b000030"
                                    },
                                    _id        : "561bb5329ebb48212ea838c6"
                                },
                                department: {
                                    departmentName: "CSS/FrontEnd",
                                    _id           : "56802e9d1afe27f547b7ba51"
                                }
                            },
                            {
                                budget    : {
                                    hoursSum  : 560,
                                    revenueSum: 209780.1704800359,
                                    costSum   : 0
                                },
                                employee: {
                                    name       : {
                                        first: "Ivan",
                                        last : "Lyashenko"
                                    },
                                    jobPosition: {
                                        name: "Junior JS",
                                        _id : "55b92acf21e4b7c40f000017"
                                    },
                                    _id        : "55b92ad221e4b7c40f0000aa"
                                },
                                department: {
                                    departmentName: "Web",
                                    _id           : "55b92ace21e4b7c40f000016"
                                }
                            },
                            {
                                budget    : {
                                    hoursSum  : 784,
                                    revenueSum: 293692.23867205024,
                                    costSum   : 0
                                },
                                employee: {
                                    name       : {
                                        first: "Michael",
                                        last : "Glagola"
                                    },
                                    jobPosition: {
                                        name: "Middle iOS",
                                        _id : "55b92acf21e4b7c40f00001d"
                                    },
                                    _id        : "55b92ad221e4b7c40f000076"
                                },
                                department: {
                                    departmentName: "iOS",
                                    _id           : "55b92ace21e4b7c40f00000f"
                                }
                            },
                            {
                                budget    : {
                                    hoursSum  : 535,
                                    revenueSum: 200414.9842978914,
                                    costSum   : 0
                                },
                                employee: {
                                    name       : {
                                        first: "Oleg",
                                        last : "Stasiv"
                                    },
                                    jobPosition: {
                                        name: "Junior QA",
                                        _id : "55b92acf21e4b7c40f000018"
                                    },
                                    _id        : "55b92ad221e4b7c40f00003c"
                                },
                                department: {
                                    departmentName: "QA",
                                    _id           : "55b92ace21e4b7c40f000011"
                                }
                            },
                            {
                                budget    : {
                                    hoursSum  : 104,
                                    revenueSum: 38959.174517720945,
                                    costSum   : 0
                                },
                                employee: {
                                    name       : {
                                        first: "Yuriy",
                                        last : "Derevenko"
                                    },
                                    jobPosition: {
                                        name: "Junior JS",
                                        _id : "55b92acf21e4b7c40f000017"
                                    },
                                    _id        : "55b92ad221e4b7c40f000054"
                                },
                                department: {
                                    departmentName: "Web",
                                    _id           : "55b92ace21e4b7c40f000016"
                                }
                            }
                        ]
                    },
                    project  : "562beda846bca6e4591f4930",
                    wTracks  : [
                        "5707d4e83094378f405ed41e",
                        "5707c14b66ef2b474164f335",
                        "5707bc1d66ef2b474164f332",
                        "5703d107ed3f15af0782f19d",
                        "5703d107e7050b54043a69cc",
                        "5703d107c3a5da3e0347a496",
                        "5703d107b50d351f04817ca0",
                        "5703d10769c37d5903700b89",
                        "5703b935e7050b54043a69c0",
                        "5703b6a7ed3f15af0782f185",
                        "5703b621e7050b54043a69be",
                        "5703b3b6c3a5da3e0347a486",
                        "5703b34669c37d5903700b72",
                        "5703b134c3a5da3e0347a485",
                        "5703b0270bbb61c30355b54d",
                        "57035b00e7050b54043a6995",
                        "5702f0c3ec814f7c039b806b",
                        "5702bcfbed3f15af0782f15b",
                        "56e95f1d9c44f71b3c1b4157",
                        "56e7e772dae0bc904da269ad",
                        "56e7e61bdae0bc904da269ac",
                        "56e7e26e87b309154e4e448f",
                        "56e7e27ac64e96844ef3d6aa",
                        "56e67de7ef05acd9418dff33",
                        "5707c14b27a2fa52402a8db2",
                        "56e67dc881046d9741fb66f9",
                        "565d5f84f6427f253cf6be23",
                        "565d6309f6427f253cf6be3f",
                        "56e041777e101f9873feca2f",
                        "5702f220c3a5da3e0347a46b",
                        "564050a970bbc2b740ce89bd",
                        "562beeb9f9ccedb2591836e7",
                        "567d05328365c9a205406f44",
                        "563b8b0bab9698be7c9df70a",
                        "5707bc1d9bc121fe40812252",
                        "563b8b05ab9698be7c9df709",
                        "56e7e786dae0bc904da269ae",
                        "563b88f3ab9698be7c9df704",
                        "563b8bf0ab9698be7c9df70f",
                        "56e00e64f20b938426716710",
                        "563b8799ab9698be7c9df701",
                        "562bef58129820ab5994e8de",
                        "566427aa08ed794128637c27",
                        "5702eb79ec814f7c039b806a",
                        "562beefb84deb7cb59d61b7a",
                        "562beee7f9ccedb2591836e9",
                        "563b874fab9698be7c9df6ff",
                        "566057578a0c9ef2053e5249",
                        "562beec8f9ccedb2591836e8",
                        "563b8beaab9698be7c9df70e",
                        "5703b33169c37d5903700b71",
                        "56e2738f1f2850d361927dcd",
                        "56cc247b541812c07197355f",
                        "563b8647ab9698be7c9df6fa",
                        "563b88e5ab9698be7c9df702",
                        "562bef2cd2d9ab425a6dd075",
                        "56e00be8b2ba0d1b26c50c0c",
                        "5707d66e497452d7405810e5",
                        "562bef4346bca6e4591f4931",
                        "562beec2b4677e225aa31e0c",
                        "563b878fab9698be7c9df700",
                        "566427bf08ed794128637c28",
                        "562bef354a431b5a5a31120b",
                        "562beef462461bfd59ef58d2",
                        "5664281108ed794128637c2c",
                        "56c46ef6b81fd51e19207f67",
                        "563b8b3eab9698be7c9df70b",
                        "563b8bc6ab9698be7c9df70d",
                        "562beeedf9ccedb2591836ea",
                        "56e95efa5b2485993c163e23",
                        "562bee85129820ab5994e8dd",
                        "562bef3d62461bfd59ef58d3",
                        "563b860fab9698be7c9df6f9",
                        "5664281108ed794128637c2d",
                        "568110dbc699b1b24862bd5b",
                        "56405dd170bbc2b740ce89e6",
                        "562bef6ad2d9ab425a6dd076",
                        "563b8b9cab9698be7c9df70c",
                        "5703547ee7050b54043a6992",
                        "567d055c8365c9a205406f45",
                        "563b86a2ab9698be7c9df6fb",
                        "56d953758230197c0e08903c",
                        "563b86a9ab9698be7c9df6fc",
                        "566e828b8453e8b464b709ce",
                        "563b85ffab9698be7c9df6f8",
                        "563b86b7ab9698be7c9df6fd",
                        "56c474b7d2b48ede4ba421ee",
                        "5664278208ed794128637c26",
                        "567d05158365c9a205406f43",
                        "563b88edab9698be7c9df703",
                        "566427e108ed794128637c29",
                        "5664281108ed794128637c2a",
                        "5664281108ed794128637c2b",
                        "56e7e28349e358ee4d71399a",
                        "5664290a08ed794128637c2f",
                        "5664290a08ed794128637c30",
                        "569cafc6cf1f31f925c026f1",
                        "5664290a08ed794128637c31",
                        "570757fbac6351f52432f9fe",
                        "5664290a08ed794128637c32",
                        "56642ac708ed794128637c3c",
                        "5703b700ec814f7c039b8092",
                        "5664294608ed794128637c36",
                        "563b8a82ab9698be7c9df706",
                        "56642a4108ed794128637c37",
                        "5707e75f66ef2b474164f33a",
                        "56cac9915b5327a650b82dd7",
                        "56e00be8b2ba0d1b26c50c0e",
                        "563b8a07ab9698be7c9df705",
                        "568110e3c699b1b24862bd5e",
                        "56936350d87c9004552b6373",
                        "5707f091497452d7405810ec",
                        "5693640cd87c9004552b637c",
                        "569cb01ccf1f31f925c026f2",
                        "56e67df268e298b241985656",
                        "564050b070bbc2b740ce89c0",
                        "563b8ae5ab9698be7c9df707",
                        "56aa1f26b4dc0d09232bd7a0",
                        "56aa1f7eb4dc0d09232bd7a2",
                        "5702ee850bbb61c30355b52e",
                        "563b8afeab9698be7c9df708",
                        "56aa2ce6b4dc0d09232bd7ab",
                        "563b8bf6ab9698be7c9df710",
                        "56aa1f2eb4dc0d09232bd7a1",
                        "5664294608ed794128637c35",
                        "56b0bf2ad6ef38a708dfc299",
                        "56bc4a46cccd9a3d059f38b9",
                        "5703d107e7050b54043a69cd",
                        "56cac9c35b5327a650b82dd8",
                        "56d808d88df756130e1e9ca4",
                        "562bef7146bca6e4591f4932",
                        "56d81156ae35cc4f0e721071",
                        "56e67dd63d5bc25541857e30",
                        "56e00be8b2ba0d1b26c50c0a",
                        "56e00be8b2ba0d1b26c50c0d",
                        "56e273c21f2850d361927dce",
                        "56e00e5ef20b93842671670e",
                        "562bef7962461bfd59ef58d4",
                        "56e13efb21de3dfb527b9327",
                        "56e2737bf9e1c56461b971cd"
                    ],
                    type     : "Invoiced",
                    workflow : "56337c675d49d8d6537832ea",
                    name     : "Main sprint",
                    __v      : 0,
                    payments : [
                        "56642edb08ed794128637c4a"
                    ],
                    editedBy : {
                        date: "2016-05-05T13:29:43.938Z",
                        user: "563f673270bbc2b740ce89ae"
                    },
                    createdBy: {
                        user: null,
                        date: "2015-11-09T07:52:09.421Z"
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
                quantity   : 4644
            }
        ],
        approved    : false,
        removable   : true,
        invoiced    : true,
        editedBy    : {
            user: {
                _id            : "563f673270bbc2b740ce89ae",
                profile: 1387275598000,
                savedFilters: [
                    {
                        _id      : "564f2dabe91e851912a2024c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "564f2dc4e91e851912a2024d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56573baebfd103f108eb4abb",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56574882bfd103f108eb4af6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "565853f7bfd103f108eb4b42",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "565bf2a1a9a4e40204299eb3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5662dfacf13e46fd14535337",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "569e3c58044ae38173244cfc",
                        viewType: "",
                        byDefault: "Dashboard"
                    },
                    {
                        _id      : "56b117f55b84a7c8083d1c92",
                        viewType: "",
                        byDefault: "salaryReport"
                    },
                    {
                        _id      : "56c0b323199ed6e66578f123",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "56d853618230197c0e089039",
                        viewType: "",
                        byDefault: "Leads"
                    },
                    {
                        _id      : "56f2490ff5b5bf6750f5916a",
                        viewType: "",
                        byDefault: "jobsDashboard"
                    },
                    {
                        _id      : "570b7dcd25a185a8548d7d6a",
                        viewType: "",
                        byDefault: "Projects"
                    }
                ],
                kanbanSettings: {
                    tasks        : {
                        foldWorkflows: [],
                        countPerPage : 10
                    },
                    applications: {
                        foldWorkflows: [],
                        countPerPage : 10
                    },
                    opportunities: {
                        foldWorkflows: [],
                        countPerPage : 10
                    }
                },
                credentials   : {
                    access_token : "",
                    refresh_token: ""
                },
                pass          : "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                email         : "info@thinkmobiles.com",
                login         : "alex.sokhanych",
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                __v           : 0,
                lastAccess    : "2016-05-05T15:23:35.898Z",
                relatedEmployee: null
            },
            date: "2016-04-14T12:29:34.637Z"
        },
        createdBy   : {
            user: {
                _id            : "563f673270bbc2b740ce89ae",
                profile: 1387275598000,
                savedFilters: [
                    {
                        _id      : "564f2dabe91e851912a2024c",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "564f2dc4e91e851912a2024d",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56573baebfd103f108eb4abb",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "56574882bfd103f108eb4af6",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "565853f7bfd103f108eb4b42",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "565bf2a1a9a4e40204299eb3",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "5662dfacf13e46fd14535337",
                        viewType: "",
                        byDefault: ""
                    },
                    {
                        _id      : "569e3c58044ae38173244cfc",
                        viewType: "",
                        byDefault: "Dashboard"
                    },
                    {
                        _id      : "56b117f55b84a7c8083d1c92",
                        viewType: "",
                        byDefault: "salaryReport"
                    },
                    {
                        _id      : "56c0b323199ed6e66578f123",
                        viewType: "",
                        byDefault: "salesInvoice"
                    },
                    {
                        _id      : "56d853618230197c0e089039",
                        viewType: "",
                        byDefault: "Leads"
                    },
                    {
                        _id      : "56f2490ff5b5bf6750f5916a",
                        viewType: "",
                        byDefault: "jobsDashboard"
                    },
                    {
                        _id      : "570b7dcd25a185a8548d7d6a",
                        viewType: "",
                        byDefault: "Projects"
                    }
                ],
                kanbanSettings: {
                    tasks        : {
                        foldWorkflows: [],
                        countPerPage : 10
                    },
                    applications: {
                        foldWorkflows: [],
                        countPerPage : 10
                    },
                    opportunities: {
                        foldWorkflows: [],
                        countPerPage : 10
                    }
                },
                credentials   : {
                    access_token : "",
                    refresh_token: ""
                },
                pass          : "55b51e191ac4282ad166db8b33614be98759b21a395b152732f7fffc9bfd2577",
                email         : "info@thinkmobiles.com",
                login         : "alex.sokhanych",
                imageSrc      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
                __v           : 0,
                lastAccess    : "2016-05-05T15:23:35.898Z",
                relatedEmployee: null
            },
            date: "2016-04-14T12:28:39.744Z"
        },
        creationDate: "2016-04-14T12:28:39.744Z",
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
            _id   : "56fabcf0e71823e438e4e1ca",
            status: "Done",
            name  : "Invoiced"
        },
        payments    : [
            {
                _id       : "570f8d45983b1a8e4f9bbfb1",
                paymentRef: "",
                name      : "PP_344",
                date      : "2015-11-04T04:00:00.000Z",
                paidAmount: 700000
            }
        ],
        paymentInfo : {
            total  : 700000,
            unTaxed: 700000,
            balance: 0,
            taxes  : 0
        },
        paymentTerms: null,
        salesPerson : "55b92ad221e4b7c40f00004a",
        currency    : {
            _id : {
                _id     : "565eab29aeb95fa9c0f9df2d",
                name: "USD",
                sequence: 0
            },
            rate: 1
        },
        journal     : "57035e4321f9b0c4313d4146",
        invoiceDate : "2015-10-28T04:00:00.000Z",
        paymentReference: "PO970",
        sourceDocument  : {
            _id           : "570f8cf76f3bd57c48cdb091",
            editedBy: {
                date: "2016-05-05T13:28:59.766Z",
                user: "563f673270bbc2b740ce89ae"
            },
            createdBy: {
                user: "563f673270bbc2b740ce89ae",
                date: "2016-04-14T12:28:39.744Z"
            },
            creationDate: "2016-04-14T12:28:39.744Z",
            groups      : {
                group: [],
                users: [],
                owner: "560c099da5d4a2e20ba5068b"
            },
            whoCanRW    : "everyOne",
            workflow    : "55647b962e4aa3804a765ec6",
            products    : [
                {
                    scheduledDate: "",
                    jobs         : "566424cd08ed794128637c23",
                    description  : "",
                    product      : "5540d528dacb551c24000003",
                    unitPrice    : 1670000,
                    subTotal     : 1670000,
                    taxes        : null,
                    quantity     : 4458
                }
            ],
            paymentInfo : {
                taxes  : 0,
                unTaxed: 1670000,
                total  : 1670000
            },
            paymentTerm : null,
            invoiceRecived: false,
            invoiceControl: null,
            incoterm      : null,
            destination   : null,
            name          : "PO970",
            expectedDate  : "2015-10-10T22:00:00.000Z",
            orderDate     : "2015-10-10T22:00:00.000Z",
            deliverTo     : "55543831d51bdef79ea0d58c",
            project       : "562beda846bca6e4591f4930",
            supplier      : "562bed4062461bfd59ef58d1",
            isOrder       : true,
            type          : "Not Invoiced",
            forSales      : true,
            currency      : {
                _id : "565eab29aeb95fa9c0f9df2d",
                rate: 1
            },
            __v           : 0,
            attachments   : [
                {
                    uploaderName: "alex.sokhanych",
                    uploadDate  : "2016-05-05T13:28:59.685Z",
                    size        : "0.175&nbsp;Mb",
                    shortPas    : "..%2Froutes%2Fuploads%2F570f8cf76f3bd57c48cdb091%2Fnot%20correct%20invoice.pdf",
                    name        : "not correct invoice.pdf",
                    _id         : "572b4a9bbb0c85d606b23d93"
                }
            ]
        },
        supplier        : {
            _id : "562bed4062461bfd59ef58d1",
            name: {
                last : "",
                first: "TreatMe"
            }
        },
        forSales        : true,
        name            : "PO970",
        __v             : 0,
        dueDate         : "2015-11-11T04:00:00.000Z",
        reconcile       : true,
        attachments     : [],
        paymentDate     : "2015-11-04T04:00:00.000Z"
    };
    var fakeFilters = {
        _id     : null,
        supplier: [
            {
                _id : "57554158a4b85346765d3e1c",
                name: "Casper Hallas"
            },
            {
                _id : "5735a1a609f1f719488087ed",
                name: "Social Media Wave, GmbH "
            },
            {
                _id : "5735cc12e9e6c01a47f07b09",
                name: "Hipteam "
            }
        ],

        salesPerson: [
            {
                _id : "566d4bc3abccac87642cb523",
                name: "Scatch"
            },
            {
                _id : "563767135d23a8eb04e80aec",
                name: "Coach App"
            },
            {
                _id : "55cf4fc74a91e37b0b000103",
                name: "Legal Application"
            }
        ]
    };
    var fakeResponseSavedFilter = {
        "success": {
            "_id"            : "52203e707d4dba8813000003",
            "__v": 0,
            "attachments": [],
            "lastAccess" : "2016-06-29T08:36:54.760Z",
            "profile"    : 1387275598000,
            "relatedEmployee": "55b92ad221e4b7c40f00004f",
            "savedFilters"   : [{"_id": "5773914af2ec5e1517865734", "contentType": "salesProforma", "byDefault": false}],
            "kanbanSettings" : {
                "tasks"        : {"foldWorkflows": ["Empty"], "countPerPage": 10},
                "applications": {"foldWorkflows": ["Empty"], "countPerPage": 87},
                "opportunities": {"foldWorkflows": ["Empty"], "countPerPage": 10}
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
    var proformaCollection;
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

    describe('SalesProformaView', function () {

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
                view = new MainView({el: $elFixture, contentType: 'salesProforma'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="99"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="99"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/salesProforma');
            });

        });

        describe('TopBarView', function () {
            var server;
            var clock;

            before(function () {
                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
            });

            after(function () {
                server.restore();
                clock.restore();
            });

            it('Try to fetch collection with error', function () {
                var proformaUrl = new RegExp('\/Proforma\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', proformaUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                proformaCollection = new ProformaCollection({
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'salesProforma'
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
            });

            it('Try to create TopBarView', function () {
                var proformaUrl = new RegExp('\/Proforma\/', 'i');
                var $topBarEl;

                server.respondWith('GET', proformaUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProformas)]);
                proformaCollection = new ProformaCollection({
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'salesProforma'
                });
                server.respond();

                expect(proformaCollection).to.have.lengthOf(3);

                server.respondWith('GET', '/currentDb', [200, {'Content-Type': 'application/json'}, 'micheldb']);
                topBarView = new TopBarView({
                    actionType: 'Content',
                    collection: proformaCollection
                });
                server.respond();
                clock.tick(200);

                $topBarEl = topBarView.$el;
                expect($topBarEl.find('h3')).to.exist;
                expect($topBarEl.find('#createBtnHolder'));
                expect($topBarEl.find('h3').text()).to.be.equals('Proforma');
            });
        });

        describe('ProformaListView', function () {
            var server;
            var clock;
            var $thisEl;
            var mainSpy;
            var windowConfirmStub;
            var deleteItemSpy;

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

                server = sinon.fakeServer.create();
                clock = sinon.useFakeTimers();
                mainSpy = sinon.spy(App, 'render');
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                deleteItemSpy = sinon.spy(ListView.prototype, 'deleteItems');
            });

            after(function () {
                server.restore();
                clock.restore();
                mainSpy.restore();
                windowConfirmStub.restore();
                deleteItemSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to invoice ListView', function (done) {
                    var filterUrl = '/filter/salesProforma';
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
                    var invDate;
                    var $pagination;
                    var $pageList;

                    server.respondWith('GET', filterUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilters)]);
                    listView = new ListView({
                        startTime : new Date(),
                        collection: proformaCollection
                    });
                    server.respond();

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(proformaCollection, listView);

                    proformaCollection.trigger('fetchFinished', {
                        totalRecords: proformaCollection.totalRecords,
                        currentPage : proformaCollection.currentPage,
                        pageSize    : proformaCollection.pageSize
                    });

                    $thisEl = listView.$el;
                    expect(listView.$el.find('.list')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
                    expect($thisEl.find('#searchContainer')).to.exist;

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;
                    expect(colCount).to.be.equals(12);

                    customer = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(customer).to.not.match(/object Object|undefined/);

                    invNumber = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(invNumber).to.not.empty;
                    expect(invNumber).to.not.match(/object Object|undefined/);

                    payDate = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(payDate).to.not.match(/object Object|undefined/);

                    assigned = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(assigned).to.not.empty;
                    expect(assigned).to.not.match(/object Object|undefined/);

                    due = $firstRow.find('td:nth-child(7) > span').text().trim();
                    expect(due).to.not.empty;
                    expect(due).to.not.match(/object Object|undefined/);

                    balance = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(balance).to.not.empty;
                    expect(balance).to.not.match(/object Object|undefined/);

                    paid = $firstRow.find('td:nth-child(9)').text().trim();
                    expect(paid).to.not.empty;
                    expect(paid).to.not.match(/object Object|undefined/);

                    total = $firstRow.find('td:nth-child(10)').text().trim();
                    expect(total).to.not.empty;
                    expect(total).to.not.match(/object Object|undefined/);

                    status = $firstRow.find('td:nth-child(11) > span').text().trim();
                    expect(status).to.not.empty;
                    expect(status).to.not.match(/object Object|undefined/);

                    invDate = $firstRow.find('td:nth-child(12)').text().trim();
                    expect(invDate).to.not.empty;
                    expect(invDate).to.not.match(/object Object|undefined/);

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

                it('Try to delete item', function (done) {
                    var $needCheckBox = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var deleteUrl = new RegExp('\/Invoice\/', 'i');
                    var invoiceTotalUrl = new RegExp('\/Invoice\/totalCollectionLength', 'i');
                    var $deleteBtn;

                    $needCheckBox.click();
                    $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    server.respondWith('DELETE', deleteUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        _id: '57172daf20c8d9397a7a6d43'
                    })]);
                    server.respondWith('GET', invoiceTotalUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        count: 30
                    })]);
                    $deleteBtn.click();
                    server.respond();
                    server.respond();

                    clock.tick(200);

                    expect(deleteItemSpy.calledOnce).to.be.true;

                    done();
                });

                it('Try to go to edit form with error response', function () {
                    var spyResponse;
                    var $needTd = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var invoiceUrl = new RegExp('\/Invoice\/form', 'i');

                    mainSpy.reset();

                    server.respondWith('GET', invoiceUrl, [400, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoiceById)]);
                    $needTd.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to go to edit form', function (done) {
                    var $needTd = $thisEl.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var invoiceUrl = new RegExp('\/Invoices\/', 'i');
                    var $dialog;

                    App.currentDb = 'michelDb';

                    server.respondWith('GET', '/currentDb', [200, {'Content-Type': 'application/json'}, 'micheldb']);
                    server.respondWith('GET', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeInvoiceById)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    clock.tick(200);

                    $dialog = $('.ui-dialog');
                    expect($dialog).to.exist;

                    $dialog.remove();
                    done();
                });

                it('Try to filter listView by supplier and salesPerson', function () {
                    var url = '/proforma/';
                    var contentType = 'salesProforma';
                    var firstValue = 'supplier';
                    var secondValue = 'salesPerson';
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

                    server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeProformas)]);
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
                    var secondValue = 'salesManager';
                    var $searchContainer = $('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');
                    var $secondContainer = '#' + secondValue + 'FullContainer .groupName';
                    var $secondSelector = '#' + secondValue + 'Ul > li:nth-child(1)';
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
                    ajaxSpy.reset();
                    removeFilterSpy.reset();

                    $removeBtn = $searchContainer.find('.removeValues');
                    $removeBtn.click();
                    server.respond();

                    expect(removeFilterSpy.calledOnce).to.be.true;
                    expect(ajaxSpy.calledOnce).to.be.true;
                });
            });
        });
    });
});
