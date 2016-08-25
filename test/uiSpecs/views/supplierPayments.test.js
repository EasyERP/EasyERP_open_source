define([
    'Backbone',
    'Underscore',
    'modules',
    'text!fixtures/index.html',
    'collections/supplierPayments/filterCollection',
    'views/main/MainView',
    'views/supplierPayments/list/ListView',
    'views/supplierPayments/TopBarView',
    'views/supplierPayments/CreateView',
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
             SupplierPaymentsCollection,
             MainView,
             ListView,
             TopBarView,
             CreateView,
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

    var fakeSupplierPayments = {
        total: 300,
        data : [
            {
                _id             : "55b92ae421e4b7c40f0014cf",
                total           : 33,
                supplier        : {
                    _id : "55b92ad221e4b7c40f00004a",
                    name: {
                        last : "Ostroverkh",
                        first: "Oleg"
                    }
                },
                currency        : {
                    rate: 1,
                    name: "USD",
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                invoice         : {
                    _id : "56698afcc9393366139f06f6",
                    name: "forPayOutBonus"
                },
                forSale         : false,
                differenceAmount: 0,
                paidAmount      : 200000,
                workflow        : "Paid",
                date            : "2015-12-11T04:00:00.233Z",
                bonus           : true,
                paymentRef      : "Sales/Head 10%",
                year            : 2015,
                month           : 1,
                period          : null,
                removable       : true
            },
            {
                _id             : "55b92ae421e4b7c40f0014d0",
                total           : 33,
                supplier        : {
                    _id : "55b92ad221e4b7c40f00005f",
                    name: {
                        last : "Voloshchuk",
                        first: "Peter"
                    }
                },
                currency        : {
                    rate: 1,
                    name: "USD",
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                invoice         : {
                    _id : "56698afcc9393366139f06f6",
                    name: "forPayOutBonus"
                },
                forSale         : false,
                differenceAmount: 0,
                paidAmount      : 20000,
                workflow        : "Paid",
                date            : "2015-12-11T04:00:00.233Z",
                bonus           : true,
                paymentRef      : "Sales/Usual 8%",
                year            : 2014,
                month           : 8,
                period          : null,
                removable       : true
            },
            {
                _id             : "55b92ae421e4b7c40f0014d1",
                total           : 33,
                supplier        : {
                    _id : "55b92ad221e4b7c40f000063",
                    name: {
                        last : "Gusti",
                        first: "Yana"
                    }
                },
                currency        : {
                    rate: 1,
                    name: "USD",
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                invoice         : {
                    _id : "56698afcc9393366139f06f6",
                    name: "forPayOutBonus"
                },
                forSale         : false,
                differenceAmount: 0,
                paidAmount      : 9000,
                workflow        : "Paid",
                date            : "2015-12-11T04:00:00.233Z",
                bonus           : true,
                paymentRef      : "Sales/QA 16%",
                year            : 2014,
                month           : 11,
                period          : null,
                removable       : true
            }
        ]
    };
    var fakeBonusTypeForDD = {
        data: [
            {
                _id : "55b92ad521e4b7c40f00060b",
                name: "PM Base/Junior"
            },
            {
                _id : "55b92ad521e4b7c40f00060a",
                name: "PM Junior/Usual 1.5%"
            },
            {
                _id : "55b92ad521e4b7c40f000609",
                name: "Sales/Head 10%"
            },
            {
                _id : "55b92ad521e4b7c40f000602",
                name: "Sales/Head 8%"
            },
            {
                _id : "55b92ad521e4b7c40f000606",
                name: "Sales/QA 14%"
            },
            {
                _id : "55b92ad521e4b7c40f000605",
                name: "Sales/QA 16%"
            },
            {
                _id : "55b92ad521e4b7c40f000607",
                name: "Sales/QA 8%"
            },
            {
                _id : "55b92ad521e4b7c40f000604",
                name: "Sales/Ref 2%"
            },
            {
                _id : "560eaaa5c90e2fb026ce061e",
                name: "Sales/Usual 4%"
            },
            {
                _id : "55b92ad521e4b7c40f000603",
                name: "Sales/Usual 6%"
            },
            {
                _id : "55b92ad521e4b7c40f000608",
                name: "Sales/Usual 8%"
            },
            {
                _id : "56e2fb7e3abb6ba70f73ae94",
                name: "df"
            },
            {
                _id : "56e2ed3f3abb6ba70f73ae93",
                name: "dfg"
            },
            {
                _id : "56053965cdc112333a000009",
                name: "hjkhg"
            },
            {
                _id : "5605396a82ca87623a00000b",
                name: "hjkhgytryt"
            }
        ]
    };
    var fakeEmplForDD = {
        data: [
            {
                _id       : "55b92ad221e4b7c40f000030",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    first: "Alex",
                    last : "Svatuk"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000031",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Gleba",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00003e",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Lapchuk",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000044",
                department: {
                    _id           : "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name      : {
                    last : "Devezenko",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00004f",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Sokhanych",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000057",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Roman",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000058",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Makhanets",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00006c",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Sich",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00006d",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Tutunnik",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000084",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Dahno",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00009e",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Michenko",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000a7",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Ryabcev",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000ac",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Volkov",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000ce",
                department: {
                    _id           : "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name      : {
                    last : "Storojenko",
                    first: "Alex"
                }
            },
            {
                _id       : "5638aa635d23a8eb04e80af0",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Siladii",
                    first: "Alex"
                }
            },
            {
                _id       : "564dac3e9b85f8b16b574fea",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Filchak",
                    first: "Alex"
                }
            },
            {
                _id       : "565f0fa6f6427f253cf6bf19",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Lysachenko",
                    first: "Alex"
                }
            },
            {
                _id       : "566ede9e8453e8b464b70b71",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Tonkovid",
                    first: "Alex"
                }
            },
            {
                _id       : "56b8b99e6c411b590588feb9",
                department: {
                    _id           : "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name      : {
                    last : "Ovcharenko",
                    first: "Alex"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000ba",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Klochkova",
                    first: "Alexandra"
                }
            },
            {
                _id       : "55c330d529bd6ccd0b000007",
                department: {
                    _id           : "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name      : {
                    last : "Yurenko",
                    first: "Alina"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000cb",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Yelahina",
                    first: "Alona"
                }
            },
            {
                _id       : "565c66633410ae512364dc00",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Timochchenko",
                    first: "Alona"
                }
            },
            {
                _id       : "560264bb8dc408c632000005",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Lyakh",
                    first: "Anastas"
                }
            },
            {
                _id       : "55ded6b3ae2b22730b00004e",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Dimova",
                    first: "Anastasia"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000059",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Dalekorey",
                    first: "Anatoliy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000b5",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Lemko",
                    first: "Andriana"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000045",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Tivodar",
                    first: "Andriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00006e",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Hanchak",
                    first: "Andriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000096",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Herasymyuk",
                    first: "Andriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000098",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Krupka",
                    first: "Andriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000a3",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Karpenko",
                    first: "Andriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000a8",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    first: "Andriy",
                    last : "Korneychuk"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000a9",
                department: {
                    _id           : "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name      : {
                    last : "Loboda",
                    first: "Andriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000b3",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Sarkanych",
                    first: "Andriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000bf",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Fizer",
                    first: "Andriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000c2",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Mistetskiy",
                    first: "Andriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000cd",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    first: "Andriy",
                    last : "Vovk"
                }
            },
            {
                _id       : "561bb90a9ebb48212ea838c7",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Svyd",
                    first: "Andriy"
                }
            },
            {
                _id       : "561bc5ca9ebb48212ea838c8",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Sokalskiy",
                    first: "Andriy"
                }
            },
            {
                _id       : "564da59f9b85f8b16b574fe9",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Chuprov",
                    first: "Andriy"
                }
            },
            {
                _id       : "566fe2348453e8b464b70ba6",
                department: {
                    _id           : "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name      : {
                    last : "Lukashchuk",
                    first: "Andriy"
                }
            },
            {
                _id       : "5693b24bd87c9004552b63a1",
                department: {
                    _id           : "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name      : {
                    last : "Horak",
                    first: "Andriy"
                }
            },
            {
                _id       : "56965733d87c9004552b63be",
                department: {
                    _id           : "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name      : {
                    last : "Samokhin",
                    first: "Andriy"
                }
            },
            {
                _id       : "569cce1dcf1f31f925c026fa",
                department: {
                    _id           : "56802eb31afe27f547b7ba52",
                    departmentName: "JS"
                },
                name      : {
                    last : "Stupchuk",
                    first: "Andriy"
                }
            },
            {
                _id       : "56c19971dfd8a81466e2f6dc",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Khainus",
                    first: "Andriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000b8",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Lobas",
                    first: "Anna"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00006f",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    last : "Karabeinikov",
                    first: "Anton"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00008c",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Gychka",
                    first: "Anton"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000094",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    last : "Yarosh",
                    first: "Anton"
                }
            },
            {
                _id       : "55c0656ad011746b0b000006",
                department: {
                    _id           : "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name      : {
                    last : "Nizhegorodov",
                    first: "Anton"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000083",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Zhuk",
                    first: "Antonina"
                }
            },
            {
                _id       : "5629e27046bca6e4591f4919",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Petrov",
                    first: "Artem"
                }
            },
            {
                _id       : "56b9ccd88f23c5696159cd09",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Antonenko",
                    first: "Artem"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000042",
                department: {
                    _id           : "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name      : {
                    last : "Myhalko",
                    first: "Artur"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000032",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Sakalo",
                    first: "Bogdan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00005a",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Cheypesh",
                    first: "Bogdan"
                }
            },
            {
                _id       : "569e63df044ae38173244cfd",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Danyliuk",
                    first: "Bogdan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000070",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Pozhidaev",
                    first: "Daniil"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000b1",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Korniyenko",
                    first: "Daniil"
                }
            },
            {
                _id       : "55fbcb65f9210c860c000005",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Shamolina",
                    first: "Daria"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000046",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Udod",
                    first: "Denis"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000b6",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Vengrin",
                    first: "Denis"
                }
            },
            {
                _id       : "55ca0145cbb0f4910b000009",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Zinkovskyi",
                    first: "Denis"
                }
            },
            {
                _id       : "55effafa8f1e10e50b000006",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    first: "Denis",
                    last : "Pavlenko"
                }
            },
            {
                _id       : "5640741570bbc2b740ce89ec",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Lukashov",
                    first: "Denis"
                }
            },
            {
                _id       : "565c2793f4dcd63b5dbd7372",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Yaremenko",
                    first: "Denis"
                }
            },
            {
                _id       : "566add9aa74aaf316eaea6fc",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Saranyuk",
                    first: "Denis"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000033",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Bruso",
                    first: "Dmitriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00006b",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Kanivets",
                    first: "Dmitriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000071",
                department: {
                    _id           : "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name      : {
                    last : "Masalovich",
                    first: "Dmitriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00009f",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Dzuba",
                    first: "Dmitriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000bc",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Demchenko",
                    first: "Dmitriy"
                }
            },
            {
                _id       : "55cdffa59b42266a4f000015",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Magar",
                    first: "Dmitriy"
                }
            },
            {
                _id       : "5600031ba36a8ca10c000028",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Mostiv",
                    first: "Dmitriy"
                }
            },
            {
                _id       : "5614d4c7ab24a83b1dc1a7a8",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    last : "Babilia",
                    first: "Dmytro"
                }
            },
            {
                _id       : "567ac0a48365c9a205406f33",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Kolochynsky",
                    first: "Dmytro"
                }
            },
            {
                _id       : "564a03d1ad4bc9e53f1f6195",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Tanchenec",
                    first: "Edgard"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00005b",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Chori",
                    first: "Eduard"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000067",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Rudenko",
                    first: "Eduard"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000092",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Dedenok",
                    first: "Eduard"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000066",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Gromadskiy",
                    first: "Egor"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000041",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Oleynikov",
                    first: "Eugen"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000072",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Bernikevich",
                    first: "Eugen"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00008b",
                department: {
                    _id           : "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name      : {
                    last : "Ugolkov",
                    first: "Eugen"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000a4",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Sokolenko",
                    first: "Eugen"
                }
            },
            {
                _id       : "55c32e0d29bd6ccd0b000005",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Alexeev",
                    first: "Eugen"
                }
            },
            {
                _id       : "55c98aa7cbb0f4910b000005",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Rechun",
                    first: "Eugen"
                }
            },
            {
                _id       : "56029cc950de7f4138000005",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Lendyel",
                    first: "Eugen"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000090",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    last : "Shterr",
                    first: "Gabriella"
                }
            },
            {
                _id       : "56b9d3eb8f23c5696159cd0b",
                department: {
                    _id           : "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name      : {
                    last : "Mykhailova",
                    first: "Galina"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00003d",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    first: "German",
                    last : "Kravets"
                }
            },
            {
                _id       : "568158fc9cceae182b907756",
                department: {
                    _id           : "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name      : {
                    last : "Belous",
                    first: "Herman"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000a2",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Stan",
                    first: "Igor"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000bb",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Shepinka",
                    first: "Igor"
                }
            },
            {
                _id       : "56966c82d87c9004552b63c7",
                department: {
                    _id           : "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name      : {
                    last : "Kuzma",
                    first: "Ihor"
                }
            },
            {
                _id       : "56a0d4b162d172544baf0e3a",
                department: {
                    _id           : "56802eb31afe27f547b7ba52",
                    departmentName: "JS"
                },
                name      : {
                    last : "Ilnytskyi",
                    first: "Ihor"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000c6",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Kramarenko",
                    first: "Illia"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000035",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Mondok",
                    first: "Ilya"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000047",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Khymych",
                    first: "Ilya"
                }
            },
            {
                _id       : "56090fae86e2435a33000008",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Nukhova",
                    first: "Inna"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000073",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Grab",
                    first: "Irina"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000034",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Nazarovich",
                    first: "Ishtvan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00005c",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Irchak",
                    first: "Ivan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000074",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Kornyk",
                    first: "Ivan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000087",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Kostromin",
                    first: "Ivan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00008e",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Grab",
                    first: "Ivan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00009c",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Feltsan",
                    first: "Ivan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000a0",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    last : "Bilak",
                    first: "Ivan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000aa",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Lyashenko",
                    first: "Ivan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000c8",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    last : "Bizilya",
                    first: "Ivan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000cc",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    first: "Ivan",
                    last : "Lyakh"
                }
            },
            {
                _id       : "55c98b86cbb0f4910b000006",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Kovalenko",
                    first: "Ivan"
                }
            },
            {
                _id       : "55dd71eaf09cc2ec0b000007",
                department: {
                    _id           : "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name      : {
                    last : "Khartov",
                    first: "Ivan"
                }
            },
            {
                _id       : "56a5ef86aa157ca50f21fb1d",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    last : "Pasichnyuk",
                    first: "Ivan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000048",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Chupova",
                    first: "Katerina"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000068",
                department: {
                    _id           : "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name      : {
                    last : "Bartish",
                    first: "Katerina"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00009a",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Pasichnyuk",
                    first: "Katerina"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000ab",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Olkhovik",
                    first: "Katerina"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000085",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Gorbushko",
                    first: "Kirill"
                }
            },
            {
                _id       : "55e419094983acdd0b000012",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    first: "Kirill",
                    last : "Paliiuk"
                }
            },
            {
                _id       : "56b9d49d8f23c5696159cd0c",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Bed",
                    first: "Kirill"
                }
            },
            {
                _id       : "56b2287b99ce8d706a81b2bc",
                department: {
                    _id           : "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name      : {
                    last : "Mudrenok",
                    first: "Kostiantyn"
                }
            },
            {
                _id       : "55d1e234dda01e250c000015",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    last : "Rimar",
                    first: "Kristian"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00009b",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Popp",
                    first: "Larysa"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000075",
                department: {
                    _id           : "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name      : {
                    last : "Gvozdyo",
                    first: "Lilia"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000c7",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Mykhailova",
                    first: "Liliya"
                }
            },
            {
                _id       : "55bf45cf65cda0810b00000a",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    first: "Liliya",
                    last : "Shustur"
                }
            },
            {
                _id       : "564a0186ad4bc9e53f1f6193",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Orlenko",
                    first: "Liliya"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00005d",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    last : "Gerevich",
                    first: "Lubomir"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000c1",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Zasukhina",
                    first: "Maria"
                }
            },
            {
                _id       : "5684ec1a1fec73d05393a2a4",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Zaitseva",
                    first: "Maria"
                }
            },
            {
                _id       : "560115cf536bd29228000006",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Myhalko",
                    first: "Marianna"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00003f",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Kubichka",
                    first: "Marina"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000043",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Geraschenko",
                    first: "Maxim"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000089",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Sychov",
                    first: "Maxim"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000a5",
                department: {
                    _id           : "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name      : {
                    last : "Holubka",
                    first: "Maxim"
                }
            },
            {
                _id       : "55c06411d011746b0b000005",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Rachytskyy",
                    first: "Maxim"
                }
            },
            {
                _id       : "566ada96a74aaf316eaea69d",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Gladovskyy",
                    first: "Maxim"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000036",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Yemets",
                    first: "Michael"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000049",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Kapustey",
                    first: "Michael"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000055",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Rogach",
                    first: "Michael"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00005e",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Didenko",
                    first: "Michael"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000069",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Afendikov",
                    first: "Michael"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000076",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Glagola",
                    first: "Michael"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000077",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Soyma",
                    first: "Michael"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000b2",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Yeremenko",
                    first: "Michael"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000bd",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Vashkeba",
                    first: "Michael"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000c4",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    last : "Myronyshyn",
                    first: "Michael"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000c5",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Gajdan",
                    first: "Michael"
                }
            },
            {
                _id       : "55dd7776f09cc2ec0b000009",
                department: {
                    _id           : "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name      : {
                    last : "Kavka",
                    first: "Michael"
                }
            },
            {
                _id       : "5600042ca36a8ca10c000029",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Filchak",
                    first: "Michael"
                }
            },
            {
                _id       : "5667f310a3fc012a68f0d5f5",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Sopko",
                    first: "Michael"
                }
            },
            {
                _id       : "56b3412299ce8d706a81b2cd",
                department: {
                    _id           : "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name      : {
                    last : "Kholtobin",
                    first: "Mykola"
                }
            },
            {
                _id       : "565c306af4dcd63b5dbd7373",
                department: {
                    _id           : "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name      : {
                    last : "Matrafayilo",
                    first: "Myroslav"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000b7",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Polovka",
                    first: "Myroslava"
                }
            },
            {
                _id       : "56bdf283dfd8a81466e2f6d0",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Shishko",
                    first: "Nadiya"
                }
            },
            {
                _id       : "56938d2cd87c9004552b639e",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Makarova",
                    first: "Nastya"
                }
            },
            {
                _id       : "561ba8639ebb48212ea838c4",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Yartysh",
                    first: "Nataliya"
                }
            },
            {
                _id       : "566aa49f4f817b7f51746ec0",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Burtnyk",
                    first: "Nataliya"
                }
            },
            {
                _id       : "56af32e174d57e0d56d6bee5",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Sichko",
                    first: "Nataliya"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000a6",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Citrak",
                    first: "Norbert"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000be",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Borys",
                    first: "Oksana"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000c0",
                department: {
                    _id           : "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name      : {
                    last : "Kordas",
                    first: "Oksana"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00003c",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    last : "Stasiv",
                    first: "Oleg"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00004a",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Ostroverkh",
                    first: "Oleg"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000078",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    last : "Boyanivskiy",
                    first: "Oleg"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00008a",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Mahobey",
                    first: "Oleg"
                }
            },
            {
                _id       : "561ba7039ebb48212ea838c3",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Maliavska",
                    first: "Oleksandra"
                }
            },
            {
                _id       : "56b9cbb48f23c5696159cd08",
                department: {
                    _id           : "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name      : {
                    last : "Kovalenko",
                    first: "Oleksii"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000037",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Shanghin",
                    first: "Oleksiy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000079",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Gerasimov",
                    first: "Oleksiy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000095",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Kuropyatnik",
                    first: "Oleksiy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000c9",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    first: "Oleksiy",
                    last : "Fedosov"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000b9",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Melnyk",
                    first: "Olena"
                }
            },
            {
                _id       : "55e96ab13f3ae4fd0b000009",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    last : "Pavliuk",
                    first: "Oles"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000c3",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    first: "Olesia",
                    last : "Prokoshkina"
                }
            },
            {
                _id       : "56123232c90e2fb026ce064b",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    last : "Sikora",
                    first: "Olga"
                }
            },
            {
                _id       : "55c84a4aaa36a0e60a000005",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Muratov",
                    first: "Pavlo"
                }
            },
            {
                _id       : "56964a03d87c9004552b63ba",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Skyba",
                    first: "Pavlo"
                }
            },
            {
                _id       : "56a7956faa157ca50f21fb25",
                department: {
                    _id           : "56802eb31afe27f547b7ba52",
                    departmentName: "JS"
                },
                name      : {
                    last : "Demko",
                    first: "Pavlo"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00005f",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Voloshchuk",
                    first: "Peter"
                }
            },
            {
                _id       : "55e549309624477a0b000005",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Rospopa",
                    first: "Petro"
                }
            },
            {
                _id       : "56a78c75aa157ca50f21fb24",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Iyber",
                    first: "Renata"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000051",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Mozes",
                    first: "Richard"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00007a",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Fogash",
                    first: "Robert"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00004b",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Katona",
                    first: "Roland"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000038",
                department: {
                    _id           : "566ee11b8453e8b464b70b73",
                    departmentName: "Ruby on Rails"
                },
                name      : {
                    last : "Babunich",
                    first: "Roman"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000060",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Buchuk",
                    first: "Roman"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00007b",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Guti",
                    first: "Roman"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000086",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    last : "Kubichka",
                    first: "Roman"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000b0",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Donchenko",
                    first: "Roman"
                }
            },
            {
                _id       : "55dd73d1f09cc2ec0b000008",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Vizenko",
                    first: "Roman"
                }
            },
            {
                _id       : "55eef3fd6dceaee10b000020",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Saldan",
                    first: "Roman"
                }
            },
            {
                _id       : "5667f43da3fc012a68f0d5f6",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Katsala",
                    first: "Roman"
                }
            },
            {
                _id       : "568bbdfd5827e3b24d8123a7",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Chaban",
                    first: "Roman"
                }
            },
            {
                _id       : "568cd341b2bcba971ba6f5c4",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Rosul",
                    first: "Roman"
                }
            },
            {
                _id       : "568cd4c0b2bcba971ba6f5c5",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Osadchuk",
                    first: "Roman"
                }
            },
            {
                _id       : "569e3a73044ae38173244cfb",
                department: {
                    _id           : "56802eb31afe27f547b7ba52",
                    departmentName: "JS"
                },
                name      : {
                    last : "Martyniuk",
                    first: "Roman"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000056",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Labjak",
                    first: "Ruslan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000097",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Abylgazinov",
                    first: "Samgash"
                }
            },
            {
                _id       : "568cdd375527d6691cb68b22",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Melnik",
                    first: "Sergey"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000064",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    last : "Tilishevsky",
                    first: "Sergiy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00007c",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Sheba",
                    first: "Sergiy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000a1",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Stepaniuk",
                    first: "Sergiy"
                }
            },
            {
                _id       : "55d1a2b18f61e2c90b000023",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Degtyar",
                    first: "Sergiy"
                }
            },
            {
                _id       : "55dd63f8f09cc2ec0b000006",
                department: {
                    _id           : "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name      : {
                    last : "Ihnatko",
                    first: "Sergiy"
                }
            },
            {
                _id       : "5649b8ccad4bc9e53f1f6192",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Gevelev",
                    first: "Sergiy"
                }
            },
            {
                _id       : "5652dd95c4d12cf51e7f7e0b",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Petakh",
                    first: "Sergiy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00004c",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    first: "Sofia",
                    last : "Nayda"
                }
            },
            {
                _id       : "561b756f9ebb48212ea838c0",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    last : "Romanyuk",
                    first: "Stanislav"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000039",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Rikun",
                    first: "Stas"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00007d",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Volskiy",
                    first: "Stas"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000ad",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Krovspey",
                    first: "Stepan"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00008d",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Kira",
                    first: "Svitlana"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000ae",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Dolottseva",
                    first: "Tamara"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000061",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Mondok",
                    first: "Tamas"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000050",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Holovatska",
                    first: "Tamila"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00007e",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Zmiy",
                    first: "Taras"
                }
            },
            {
                _id       : "564a02e0ad4bc9e53f1f6194",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Dvorian",
                    first: "Taras"
                }
            },
            {
                _id       : "56813fe29cceae182b907755",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Ukrainskiy",
                    first: "Taras"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000099",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Smertina",
                    first: "Tetyana"
                }
            },
            {
                _id       : "55c98df0cbb0f4910b000007",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Berezhnoi",
                    first: "Timur"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00006a",
                department: {
                    _id           : "55b92ace21e4b7c40f000012",
                    departmentName: ".NET/WP"
                },
                name      : {
                    last : "Tsipf",
                    first: "Vadim"
                }
            },
            {
                _id       : "56011186536bd29228000005",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Khruslov",
                    first: "Valentyn"
                }
            },
            {
                _id       : "561bb5329ebb48212ea838c6",
                department: {
                    _id           : "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name      : {
                    last : "Ladomiryak",
                    first: "Valerii"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000af",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Tokareva",
                    first: "Valeriya"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00007f",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    last : "Klimchenko",
                    first: "Vasilisa"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00003a",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Agosta",
                    first: "Vasiliy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000040",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Almashiy",
                    first: "Vasiliy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000053",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Seredniy",
                    first: "Vasiliy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000062",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Cheypesh",
                    first: "Vasiliy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000080",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Barchiy",
                    first: "Vasiliy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000093",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Lupchey",
                    first: "Vasiliy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000b4",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Prokopyshyn",
                    first: "Vasiliy"
                }
            },
            {
                _id       : "55d1d860dda01e250c000010",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Hoshovsky",
                    first: "Vasiliy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000088",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    last : "Buchok",
                    first: "Viktor"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000091",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Kiver",
                    first: "Viktor"
                }
            },
            {
                _id       : "55f9298456f79c9c0c000006",
                department: {
                    _id           : "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name      : {
                    last : "Manhur",
                    first: "Viktor"
                }
            },
            {
                _id       : "5626278d750d38934bfa1313",
                department: {
                    _id           : "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name      : {
                    last : "Rogachenko",
                    first: "Viktoria"
                }
            },
            {
                _id       : "5637710e5d23a8eb04e80aed",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Kovalenko",
                    first: "Viktoria"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00003b",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    last : "Bizilya",
                    first: "Vitaliy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00004e",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Shuba",
                    first: "Vitaliy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000081",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    last : "Sokhanych",
                    first: "Vitaliy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000052",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    last : "Gerasimenko",
                    first: "Vladimir"
                }
            },
            {
                _id       : "561bb1269ebb48212ea838c5",
                department: {
                    _id           : "56802e9d1afe27f547b7ba51",
                    departmentName: "CSS/FrontEnd"
                },
                name      : {
                    last : "Pogorilyak",
                    first: "Vladimir"
                }
            },
            {
                _id       : "55eeed546dceaee10b00001e",
                department: {
                    _id           : "55bb1f40cb76ca630b000007",
                    departmentName: "PM"
                },
                name      : {
                    last : "Turytskyi",
                    first: "Vladyslav"
                }
            },
            {
                _id       : "568bbf935827e3b24d8123a8",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Hamalii",
                    first: "Vladyslav"
                }
            },
            {
                _id       : "55eee9c26dceaee10b00001d",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Stepanchuk",
                    first: "Volodymyr"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00004d",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Kopinets",
                    first: "Vyacheslav"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000063",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    last : "Gusti",
                    first: "Yana"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000ca",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Vengerova",
                    first: "Yana"
                }
            },
            {
                _id       : "55f7c20a6d43203d0c000005",
                department: {
                    _id           : "55bb1f14cb76ca630b000006",
                    departmentName: "Design"
                },
                name      : {
                    last : "Samaryk",
                    first: "Yana"
                }
            },
            {
                _id       : "5602a01550de7f4138000008",
                department: {
                    _id           : "55b92ace21e4b7c40f000014",
                    departmentName: "BusinessDev"
                },
                name      : {
                    last : "Dufynets",
                    first: "Yana"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000082",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Fuchko",
                    first: "Yaroslav"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f0000cf",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Denysiuk",
                    first: "Yaroslav"
                }
            },
            {
                _id       : "568bc0b55827e3b24d8123a9",
                department: {
                    _id           : "55b92ace21e4b7c40f000010",
                    departmentName: "Android"
                },
                name      : {
                    last : "Syrota",
                    first: "Yaroslav"
                }
            },
            {
                _id       : "56014cc8536bd29228000007",
                department: {
                    _id           : "560c0b83a5d4a2e20ba5068c",
                    departmentName: "Finance"
                },
                name      : {
                    last : "Bezyk",
                    first: "Yevgenia"
                }
            },
            {
                _id       : "55ed5a437221afe30b000006",
                department: {
                    _id           : "55b92ace21e4b7c40f000013",
                    departmentName: "Marketing"
                },
                name      : {
                    last : "Porokhnitska",
                    first: "Yulia"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000054",
                department: {
                    _id           : "55b92ace21e4b7c40f000016",
                    departmentName: "Web"
                },
                name      : {
                    last : "Derevenko",
                    first: "Yuriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f000065",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Sirko",
                    first: "Yuriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00008f",
                department: {
                    _id           : "55b92ace21e4b7c40f00000f",
                    departmentName: "iOS"
                },
                name      : {
                    last : "Holovatskyi",
                    first: "Yuriy"
                }
            },
            {
                _id       : "55b92ad221e4b7c40f00009d",
                department: {
                    _id           : "55b92ace21e4b7c40f000015",
                    departmentName: "HR"
                },
                name      : {
                    last : "Fedynec",
                    first: "Yuriy"
                }
            },
            {
                _id       : "55f7c3736d43203d0c000006",
                department: {
                    _id           : "56802ec21afe27f547b7ba53",
                    departmentName: "PHP/WordPress"
                },
                name      : {
                    last : "Bodak",
                    first: "Yuriy"
                }
            },
            {
                _id       : "56090d77066d979a33000009",
                department: {
                    _id           : "55b92ace21e4b7c40f000011",
                    departmentName: "QA"
                },
                name      : {
                    first: "Yuriy",
                    last : "Bysaha"
                }
            }
        ]
    };
    var fakeFilter = {
        _id       : null,
        supplier  : [
            {
                _id       : "55b92ad221e4b7c40f00004b",
                name      : "Roland Katona",
                isEmployee: false
            },
            {
                _id       : "55b92ad221e4b7c40f000063",
                name      : "Yana Gusti",
                isEmployee: true
            },
            {
                _id       : "55b92ad221e4b7c40f00005f",
                name      : "Peterr Voloshchuk",
                isEmployee: true
            },
            {
                _id       : "55b92ad221e4b7c40f00004a",
                name      : "Oleg Ostroverkh",
                isEmployee: false
            }
        ],
        paymentRef: [
            {
                _id : "Sales/Head 8%",
                name: "Sales/Head 8%"
            },
            {
                _id : "Sales/Usual 8%",
                name: "Sales/Usual 8%"
            },
            {
                _id : "Sales/QA 14%",
                name: "Sales/QA 14%"
            },
            {
                _id : "Sales/QA 16%",
                name: "Sales/QA 16%"
            },
            {
                _id : "Sales/Head 10%",
                name: "Sales/Head 10%"
            }
        ],
        year      : [
            {
                _id : 2014,
                name: 2014
            },
            {
                _id : 2015,
                name: 2015
            }
        ],
        month     : [
            {
                _id : 3,
                name: 3
            },
            {
                _id : 4,
                name: 4
            },
            {
                _id : 9,
                name: 9
            },
            {
                _id : 5,
                name: 5
            },
            {
                _id : 10,
                name: 10
            },
            {
                _id : 2,
                name: 2
            },
            {
                _id : 12,
                name: 12
            },
            {
                _id : 11,
                name: 11
            },
            {
                _id : 8,
                name: 8
            },
            {
                _id : 1,
                name: 1
            }
        ],
        workflow  : [
            {
                _id : "Paid",
                name: "Paid"
            }
        ]
    };
    var fakeResponseSavedFilter = {
        "success": {
            "_id"            : "52203e707d4dba8813000003",
            "__v"            : 0,
            "attachments"    : [],
            "lastAccess"     : "2016-06-29T10:24:11.395Z",
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
            }, {"_id": "5773be29d523f12a494382a9", "contentType": "supplierPayments", "byDefault": false}],
            "kanbanSettings" : {
                "tasks"        : {"foldWorkflows": ["Empty"], "countPerPage": 10},
                "applications" : {"foldWorkflows": ["Empty"], "countPerPage": 87},
                "opportunities": {"foldWorkflows": ["528cdf1cf3f67bc40b00000b"], "countPerPage": 10}
            },
            "credentials"    : {"access_token": "", "refresh_token": ""},
            "pass"           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
            "email"          : "info@thinkmobiles.com",
            "login"          : "admin"
        }
    };
    var supplierPaymentsCollecion;
    var view;
    var topBarView;
    var listView;
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

    describe('SupplierPayments View', function () {
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

            if ($('.ui-dialog').length) {
                $('.ui-dialog').remove();
            }

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

                view = new MainView({el: $elFixture, contentType: 'supplierPayments'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="60"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="60"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/supplierPayments');
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

            it('Try to fetch collection with error response', function () {
                var supplierPaymentsUrl = new RegExp('\/payment\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', supplierPaymentsUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                supplierPaymentsCollecion = new SupplierPaymentsCollection({
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'supplierPayments'
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
                expect(historyNavigateSpy.args[0][0]).to.be.equals('#login');
            });

            it('Try to create TopBarView', function () {
                var supplierPaymentsUrl = new RegExp('\/payment\/', 'i');

                server.respondWith('GET', supplierPaymentsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeSupplierPayments)]);
                supplierPaymentsCollecion = new SupplierPaymentsCollection({
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'supplierPayments'
                });
                server.respond();

                expect(supplierPaymentsCollecion).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    collection: supplierPaymentsCollecion
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
            });

        });

        describe('SupplierPayments list view', function () {
            var server;
            var mainSpy;
            var $thisEl;
            var clock;
            var windowConfirmStub;
            var sortSpy;
            var cancelChangesSpy;
            var deleteSpy;

            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                sortSpy = sinon.spy(ListView.prototype, 'goSort');
                cancelChangesSpy = sinon.spy(ListView.prototype, 'cancelChanges');
                deleteSpy = sinon.spy(ListView.prototype, 'deleteItems');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                clock.restore();
                windowConfirmStub.restore();
                sortSpy.restore();
                cancelChangesSpy.restore();
                deleteSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create supplierPayments list view', function (done) {
                    var filterUrl = '/filter/supplierPayments';
                    var $firstRow;
                    var colCount;
                    var employee;
                    var bonusType;
                    var year;
                    var month;
                    var paid;
                    var amount;
                    var dateOfPaid;
                    var $pagination;
                    var $currentPageList;

                    server.respondWith('GET', filterUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilter)]);
                    server.respondWith('GET', '/bonusType/getForDD', [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeBonusTypeForDD)]);
                    server.respondWith('GET', '/employees/getForDD', [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeEmplForDD)]);
                    listView = new ListView({
                        collection: supplierPaymentsCollecion,
                        startTime : new Date()
                    });
                    server.respond();

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(supplierPaymentsCollecion, listView);

                    supplierPaymentsCollecion.trigger('fetchFinished', {
                        totalRecords: supplierPaymentsCollecion.totalRecords,
                        currentPage : supplierPaymentsCollecion.currentPage,
                        pageSize    : supplierPaymentsCollecion.pageSize
                    });

                    clock.tick(200);

                    $thisEl = listView.$el;

                    expect($thisEl.find('table')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
                    expect($thisEl.find('#searchContainer')).to.exist;

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;

                    expect(colCount).to.be.equals(9);

                    employee = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(employee).to.not.match(/object Object|undefined/);

                    bonusType = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(bonusType).to.not.match(/object Object|undefined/);

                    year = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(year).to.not.match(/object Object|undefined/);

                    month = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(month).to.not.match(/object Object|undefined/);

                    paid = $firstRow.find('td:nth-child(7)').text().trim();
                    expect(paid).not.to.be.empty;
                    expect(paid).to.not.match(/object Object|undefined/);

                    amount = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(amount).not.to.be.empty;
                    expect(amount).to.not.match(/object Object|undefined/);

                    dateOfPaid = $firstRow.find('td:nth-child(9)').text().trim();
                    expect(dateOfPaid).not.to.be.empty;
                    expect(dateOfPaid).to.not.match(/object Object|undefined/);

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
                    expect(ajaxResponse).to.have.property('url', '/payments/');
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

                it('Try to sort up list', function () {
                    var $sortTypeBtn = $thisEl.find('th[data-sort="month"]');
                    var supplierPayments = new RegExp('\/payment\/', 'i');
                    var $firstTableRow;

                    sortSpy.reset();

                    server.respondWith('GET', supplierPayments, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        total: 300,
                        data : [fakeSupplierPayments.data[2], fakeSupplierPayments.data[1], fakeSupplierPayments.data[0]]
                    })]);
                    $sortTypeBtn.click();
                    server.respond();

                    $firstTableRow = $thisEl.find('#listTable > tr:nth-child(1)');
                    expect(sortSpy.calledOnce).to.be.true;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
                    expect($firstTableRow.attr('data-id')).to.be.equals('55b92ae421e4b7c40f0014d1');

                    server.respondWith('GET', supplierPayments, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeSupplierPayments)]);
                    $sortTypeBtn.click();
                    server.respond();

                    $firstTableRow = $thisEl.find('#listTable > tr:nth-child(1)');
                    expect(sortSpy.calledTwice).to.be.true;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
                    expect($firstTableRow.attr('data-id')).to.be.equals('55b92ae421e4b7c40f0014cf');
                });

                it('Try to delete item with 403 server error', function () {
                    var supplierPaymentsUrl = new RegExp('\/payment\/', 'i');
                    var $firstEl = $(listView.$el.find('#listTable input')[1]);
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var spyResponse;

                    mainSpy.reset();

                    $firstEl.prop('checked', true);
                    server.respondWith('DELETE', supplierPaymentsUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to delete item', function () {
                    var supplierPaymentsUrl = new RegExp('\/payment\/', 'i');
                    var $firstEl = $(listView.$el.find('#listTable input')[1]);
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    deleteSpy.reset();

                    $firstEl.prop('checked', true);

                    server.respondWith('DELETE', supplierPaymentsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteSpy.calledOnce).to.be.true;
                });

                it('Try to create item', function () {
                    var $emplInput;
                    var $bonusTypeInput;
                    var $yearInput;
                    var $monthInput;
                    var $paidInput;
                    var $amountInput;
                    var $dateOfPaidInput;
                    var $input;
                    var $createBtn = topBarView.$el.find('#top-bar-createBtn');
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $newSelectEl;

                    $createBtn.click();
                    expect($thisEl.find('#listTable > tr').first()).to.have.id('false');

                    $emplInput = listView.$el.find('td[data-content="employee"]')[0];
                    $bonusTypeInput = listView.$el.find('td[data-content="bonusType"]')[0];
                    $yearInput = listView.$el.find('td[data-content="year"]')[0];
                    $monthInput = listView.$el.find('td[data-content="month"]')[0];
                    $paidInput = listView.$el.find('td[data-content="paid"]')[0];
                    $amountInput = listView.$el.find('td[data-content="paidAmount"]')[0];
                    $dateOfPaidInput = listView.$el.find('td[data-content="date"]')[0];

                    $emplInput.click();
                    $newSelectEl = listView.$el.find('.newSelectList li')[0];
                    $newSelectEl.click();

                    $bonusTypeInput.click();
                    $newSelectEl = listView.$el.find('.newSelectList li')[0];
                    $newSelectEl.click();

                    $yearInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('2016');
                    $input.focusout();

                    $monthInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('1');
                    $input.focusout();

                    $paidInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('1000');
                    $input.focusout();

                    $amountInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('1000000000');
                    $input.focusout();

                    $dateOfPaidInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('2 Mar, 2016');
                    $input.focusout();

                    server.respondWith('POST', '/payments/ ', [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect(listView.$el.find('input[type="text"].editing').length).to.equals(0);
                });

                it('Try to edit item', function () {
                    var $input;
                    var $monthInput = listView.$el.find('td[data-content="month"]')[0];
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $tableContainer = listView.$el.find('table');

                    $monthInput.click();
                    $input = listView.$el.find('input.editing');
                    $input.val('2');
                    $input.trigger('change');

                    server.respondWith('PATCH', '/payments/supplier/', [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect($tableContainer.find('input[type="text"].editing').length).to.equals(0);
                    expect($(listView.$el.find('td[data-content="month"]')[0]).text()).to.be.equals('2');

                });

                it('Try to filter listView by Employee and Bonus Type', function () {
                    var url = '/payments/';
                    var contentType = 'supplierPayments';
                    var firstValue = 'supplier';
                    var secondValue = 'paymentRef';
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

                    server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeSupplierPayments)]);
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
                    var secondValue = 'paymentRef';
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
