define([
    'Backbone',
    'Underscore',
    'modules',
    'text!fixtures/index.html',
    'collections/salesOrders/filterCollection',
    'views/main/MainView',
    'views/salesOrders/list/ListView',
    'views/salesOrders/EditView',
    'views/salesOrders/TopBarView',
    'views/Filter/filterView',
    'views/Filter/filtersGroup',
    'views/Filter/savedFiltersView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai',
    'constants/filters'
], function (Backbone, _, modules, fixtures, OrderCollection, MainView, ListView, EditView, TopBarView, FilterView, FilterGroup, SavedFilters, eventsBinder, $, chai, chaiJquery, sinonChai, FILTER_CONSTANTS) {
    'use strict';

    var expect;
    var view;
    var topBarView;
    var listView;
    var orderCollection;
    var fakeOrders = {
        total: 300,
        data : [
            {
                _id            : "5756aaafa6d2f5e9754631ef",
                total          : 717,
                salesManager   : {
                    name: {
                        last : "Voloshchuk",
                        first: "Peterr"
                    }
                },
                name           : "PO1105",
                paymentInfo    : {
                    total: 116000
                },
                orderDate      : "2016-06-06T22:00:00.000Z",
                workflow       : {
                    _id   : "55647b932e4aa3804a765ec5",
                    name  : "Not Invoiced",
                    status: "New"
                },
                supplier       : {
                    _id : "56030d81fa3f91444e00000c",
                    name: {
                        last : "",
                        first: "Peter F"
                    }
                },
                currency       : {
                    _id: "565eab29aeb95fa9c0f9df2d"
                },
                project        : {
                    _id : "56030dbffa3f91444e00000d",
                    name: "Firderberg"
                },
                proformaCounter: 0
            },
            {
                _id            : "574c586988a366d779b01601",
                total          : 693,
                salesManager   : {
                    name: {
                        last : "Dufynets",
                        first: "Yana"
                    }
                },
                name           : "PO1087",
                paymentInfo    : {
                    total: 96600
                },
                orderDate      : "2016-05-29T22:00:00.000Z",
                workflow       : {
                    _id   : "55647b962e4aa3804a765ec6",
                    name  : "Invoiced",
                    status: "Done"
                },
                supplier       : {
                    _id : "56dff2c6622d25002676ffcd",
                    name: {
                        last : "Tauman",
                        first: "Menachem"
                    }
                },
                currency       : {
                    _id: "565eab29aeb95fa9c0f9df2d"
                },
                project        : {
                    _id : "56dff43eb07e2ad226b6893b",
                    name: "Smart360"
                },
                proformaCounter: 0
            },
            {
                _id            : "574c00fe8f7e1eb31f9dfdb1",
                total          : 693,
                salesManager   : {
                    name: {
                        last : "Popp",
                        first: "Larysa"
                    }
                },
                name           : "PO1085",
                paymentInfo    : {
                    total: 74800
                },
                orderDate      : "2016-05-29T22:00:00.000Z",
                workflow       : {
                    _id   : "55647b962e4aa3804a765ec6",
                    name  : "Invoiced",
                    status: "Done"
                },
                supplier       : {
                    _id : "570f54362927bcd57ec29251",
                    name: {
                        last : "",
                        first: "OnePageCRM"
                    }
                },
                currency       : {
                    _id: "565eab29aeb95fa9c0f9df2d"
                },
                project        : {
                    _id : "57396de5b77243ed6040ec2d",
                    name: "OnePageCRM"
                },
                proformaCounter: 1
            }
        ]
    };
    var fakeOrderById = {
        _id            : "572b22b45aa8d58049019174",
        __v            : 0,
        proformaCounter: 0,
        editedBy       : {
            date: "2016-05-19T10:23:41.422Z",
            user: "52203e707d4dba8813000003"
        },
        createdBy      : {
            date: "2016-05-05T10:38:44.116Z",
            user: "563f673270bbc2b740ce89ae"
        },
        creationDate   : "2016-05-05T10:38:44.116Z",
        groups         : {
            group: [],
            users: [],
            owner: {
                _id  : "560c099da5d4a2e20ba5068b",
                login: "AlexSvatuk"
            }
        },
        attachments    : [],
        whoCanRW       : "everyOne",
        workflow       : {
            _id   : "55647b932e4aa3804a765ec5",
            name  : "Not Invoiced",
            status: "New"
        },
        products       : [
            {
                scheduledDate: "",
                jobs         : {
                    _id : "56e296543c074d636203bbd1",
                    name: "comics design"
                },
                description  : "",
                product      : {
                    _id : "5540d528dacb551c24000003",
                    name: "IT services"
                },
                unitPrice    : 70000,
                subTotal     : 70000,
                taxes        : 0,
                quantity     : 192
            }
        ],
        paymentInfo    : {
            taxes  : 0,
            unTaxed: 70000,
            total  : 70000
        },
        paymentTerm    : null,
        invoiceRecived : false,
        invoiceControl : null,
        incoterm       : null,
        destination    : null,
        name           : "PO1035",
        expectedDate   : "2016-05-04T22:00:00.000Z",
        orderDate      : "2016-05-04T22:00:00.000Z",
        deliverTo      : {
            _id : "55543831d51bdef79ea0d58c",
            name: "YourCompany"
        },
        project        : {
            _id        : "56e005f0f20b93842671670d",
            projectName: "Spoon Comics"
        },
        supplier       : {
            _id     : "56dffe038594da632689f1ca",
            name    : {
                last : "",
                first: "Takumi Networks"
            },
            fullName: "Takumi Networks ",
            id      : "56dffe038594da632689f1ca"
        },
        isOrder        : true,
        type           : "Not Invoiced",
        forSales       : true,
        currency       : {
            rate: 1,
            _id : {
                _id     : "565eab29aeb95fa9c0f9df2d",
                sequence: 0,
                name    : "USD"
            }
        }
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
    var fakeIncoterm = {
        data: [
            {
                _id : "55537115475b7be475f33602",
                code: "CIP",
                name: "CARRIAGE AND INSURANCE PAID TO"
            },
            {
                _id : "55537115475b7be475f33601",
                code: "CPT",
                name: "CARRIAGE PAID TO"
            },
            {
                _id : "55537115475b7be475f335ff",
                code: "CFR",
                name: "COST AND FREIGHT"
            },
            {
                _id : "55537115475b7be475f33600",
                code: "CIF",
                name: "COST, INSURANCE AND FREIGHT"
            },
            {
                _id : "55537115475b7be475f33603",
                code: "DAF",
                name: "DELIVERED AT FRONTIER"
            },
            {
                _id : "55537115475b7be475f33608",
                code: "DAP",
                name: "DELIVERED AT PLACE"
            },
            {
                _id : "55537115475b7be475f33607",
                code: "DAT",
                name: "DELIVERED AT TERMINAL"
            },
            {
                _id : "55537115475b7be475f33609",
                code: "DDP",
                name: "DELIVERED DUTY PAID"
            },
            {
                _id : "55537115475b7be475f33606",
                code: "DDU",
                name: "DELIVERED DUTY UNPAID"
            },
            {
                _id : "55537115475b7be475f33605",
                code: "DEQ",
                name: "DELIVERED EX QUAY"
            },
            {
                _id : "55537115475b7be475f33604",
                code: "DES",
                name: "DELIVERED EX SHIP"
            },
            {
                _id : "55537115475b7be475f335fb",
                code: "EXW",
                name: "EX WORKS"
            },
            {
                _id : "55537115475b7be475f335fd",
                code: "FAS",
                name: "FREE ALONGSIDE SHIP"
            },
            {
                _id : "55537115475b7be475f335fc",
                code: "FCA",
                name: "FREE CARRIER"
            },
            {
                _id : "55537115475b7be475f335fe",
                code: "FOB",
                name: "FREE ON BOARD"
            }
        ]
    };
    var fakeFilter = {
        _id    : null,
        project: [
            {
                _id : "5755446ee99e78c875401453",
                name: "responsive website"
            },
            {
                _id : "57063f34c3a5da3e0347a4b9",
                name: "PriceBox WEB"
            },
            {
                _id : "574823a1d4e3d608249c8105",
                name: "Recovan"
            }
        ],

        supplier: [
            {
                _id : "570f3f2fe3b40faf4f238ac3",
                name: "MyVote Today "
            },
            {
                _id : "57554158a4b85346765d3e1c",
                name: "Casper Hallas"
            },
            {
                _id : "57358f3e4403a33547ee1e36",
                name: "Move for Less, Inc "
            }
        ]
    };
    var fakeResponseSavedFilter = {
        "success": {
            "_id"            : "52203e707d4dba8813000003",
            "__v"            : 0,
            "attachments"    : [],
            "lastAccess"     : "2016-06-28T12:01:02.817Z",
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
            }, {"_id": "577272f0e9ca30965178c762", "contentType": "salesOrders", "byDefault": false}],
            "kanbanSettings" : {
                "tasks"        : {"foldWorkflows": ["Empty"], "countPerPage": 10},
                "applications" : {"foldWorkflows": ["Empty"], "countPerPage": 87},
                "opportunities": {"foldWorkflows": ["Empty"], "countPerPage": 10}
            },
            "credentials"    : {"access_token": "", "refresh_token": ""},
            "pass"           : "082cb718fc4389d4cf192d972530f918e78b77f71c4063f48601551dff5d86a9",
            "email"          : "info@thinkmobiles.com",
            "login"          : "admin"
        }
    };
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

    describe('SalesOrder View', function () {
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
            var $dialogs = $('.ui-dialog');

            listView.remove();
            topBarView.remove();
            view.remove();

            if ($dialogs.length) {
                $dialogs.remove();
            }

            selectSpy.restore();
            removeFilterSpy.restore();
            saveFilterSpy.restore();
            removedFromDBSpy.restore();
            debounceStub.restore();
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
                view = new MainView({el: $elFixture, contentType: 'salesOrders'});
                server.respond();

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="63"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="63"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/salesOrders');
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
                var orderUrl = new RegExp('\/quotations\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', orderUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeOrders)]);
                orderCollection = new OrderCollection({
                    viewType   : 'list',
                    contentType: 'salesOrder',
                    page       : 1
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
                expect(historyNavigateSpy.args[0][0]).to.be.equals('#login');
            });

            it('Try to create TopBarView', function () {
                var orderUrl = new RegExp('\/quotations\/', 'i');

                server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOrders)]);
                orderCollection = new OrderCollection({
                    contentType: 'salesOrder',
                    filter     : null,
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    reset      : true,
                    showMore   : false
                });
                server.respond();

                expect(orderCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    collection: orderCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
                expect(topBarView.$el.find('h3')).to.exist;
                expect(topBarView.$el.find('h3').text()).to.be.equals('Orders');
            });
        });

        describe('SalesOrder ListView', function () {
            var server;
            var $thisEl;
            var windowConfirmStub;
            var mainSpy;
            var clock;
            var deleteItemSpy;
            var receiveSpy;
            var saveItemSpy;

            before(function () {
                server = sinon.fakeServer.create();
                windowConfirmStub = sinon.stub(window, 'confirm');
                windowConfirmStub.returns(true);
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                deleteItemSpy = sinon.spy(EditView.prototype, 'deleteItem');
                receiveSpy = sinon.spy(EditView.prototype, 'receiveInvoice');
                saveItemSpy = sinon.spy(EditView.prototype, 'saveItem');
            });

            after(function () {
                server.restore();
                windowConfirmStub.restore();
                mainSpy.restore();
                clock.restore();
                deleteItemSpy.restore();
                receiveSpy.restore();
                saveItemSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to SalesOrder ListView', function (done) {
                    var filterUrl = '/filter/salesOrders';
                    var $firstRow;
                    var colCount;
                    var project;
                    var customer;
                    var salesPerson;
                    var total;
                    var status;
                    var date;
                    var $pagination;
                    var $currentPageList;

                    server.respondWith('GET', filterUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeFilter)]);
                    listView = new ListView({
                        collection: orderCollection
                    });
                    server.respond();

                    clock.tick(200);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(orderCollection, listView);

                    orderCollection.trigger('fetchFinished', {
                        totalRecords: orderCollection.totalRecords,
                        currentPage : orderCollection.currentPage,
                        pageSize    : orderCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('.list')).to.exist;
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                    expect($thisEl.find('#searchContainer')).to.exist;

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;
                    expect(colCount).to.be.equals(8);

                    project = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(project).not.to.be.empty;
                    expect(project).to.not.match(/object Object|undefined/);

                    customer = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(customer).not.to.be.empty;
                    expect(customer).to.not.match(/object Object|undefined/);

                    salesPerson = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(salesPerson).to.not.match(/object Object|undefined/);

                    total = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(total).not.to.be.empty;
                    expect(total).to.not.match(/object Object|undefined/);

                    status = $firstRow.find('td:nth-child(7)').text().trim();
                    expect(status).not.to.be.empty;
                    expect(status).to.not.match(/object Object|undefined/);

                    date = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(date).not.to.be.empty;
                    expect(date).to.not.match(/object Object|undefined/);

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

                it('Try to check disabled checkbox', function () {
                    var $checkBox = $thisEl.find('#listTable > tr:nth-child(3) > td.notForm > input');
                    var $topBarEl = topBarView.$el;

                    expect($checkBox.prop('disabled')).to.be.true;

                    $checkBox.click();
                    expect($checkBox.prop('checked')).to.be.false;
                    expect($topBarEl.find('#top-bar-deleteBtn')).to.have.css('display', 'none');
                });

                it('Try to delete item', function () {
                    var $deleteBtn;
                    var $checkBox = $thisEl.find('#listTable > tr:nth-child(1) > td.notForm > input');
                    var orderUrl = new RegExp('\/quotation\/', 'i');

                    $checkBox.click();
                    $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    server.respondWith('DELETE', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "success": {
                            "_id"           : "56fcd6fc0bbb61c30355b4fd",
                            "expectedDate"  : "2016-03-31T00:00:00.000Z",
                            "__v"           : 0,
                            "editedBy"      : {
                                "date": "2016-03-31T07:52:04.451Z",
                                "user": "55b9fc0fd79a3a3439000008"
                            },
                            "createdBy"     : {
                                "date": "2016-03-31T07:51:24.623Z",
                                "user": "55b9fc0fd79a3a3439000008"
                            },
                            "creationDate"  : "2016-03-31T07:51:24.623Z",
                            "groups"        : {
                                "group": [],
                                "users": [],
                                "owner": "560c099da5d4a2e20ba5068b"
                            },
                            "whoCanRW"      : "everyOne",
                            "workflow"      : "55647b962e4aa3804a765ec6",
                            "products"      : [{
                                "scheduledDate": "2016-03-31T00:00:00.000Z",
                                "subTotal"     : 3000,
                                "taxes"        : 0,
                                "unitPrice"    : 3000,
                                "jobs"         : "564cfdd06584412e618421de",
                                "description"  : "",
                                "product"      : "5540d528dacb551c24000003",
                                "quantity"     : 530
                            }],
                            "paymentInfo"   : {
                                "taxes"  : 0,
                                "unTaxed": 3000,
                                "total"  : 3000
                            },
                            "paymentTerm"   : null,
                            "invoiceRecived": false,
                            "invoiceControl": null,
                            "incoterm"      : null,
                            "destination"   : null,
                            "name"          : "PO918",
                            "orderDate"     : "2016-03-31T00:00:00.000Z",
                            "deliverTo"     : "55543831d51bdef79ea0d58c",
                            "project"       : "55b92ad621e4b7c40f000686",
                            "supplier"      : "55b92ad621e4b7c40f00064b",
                            "isOrder"       : true,
                            "type"          : "Not Invoiced",
                            "forSales"      : true,
                            "currency"      : {
                                "rate": 1,
                                "_id" : "565eab29aeb95fa9c0f9df2d"
                            }
                        }
                    })]);
                    $deleteBtn.click();
                    server.respond();
                });

                it('Try to go to edit form', function () {
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var orderUrl = new RegExp('\/orders\/', 'i');
                    var usersUrl = new RegExp('\/users\/forDd', 'i');
                    var incotermUrl = '/incoterm';

                    server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOrderById)]);
                    server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsers)]);
                    server.respondWith('GET', incotermUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeIncoterm)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;
                });

                it('Try to change tab in EditView', function () {
                    var $dialogEl = $('.ui-dialog');
                    var $firstTab = $dialogEl.find('.dialog-tabs > li:nth-child(1) > a');
                    var $secondTab = $dialogEl.find('.dialog-tabs > li:nth-child(2) > a');

                    expect($firstTab).to.have.class('active');

                    $secondTab.click();
                    expect($secondTab).to.have.class('active');

                    $firstTab.click();
                    expect($firstTab).to.have.class('active');
                });

                it('Try to delete NotInvoiced Order with error response from editView', function () {
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    var orderUrl = new RegExp('\/orders\/', 'i');
                    var spyResponse;

                    deleteItemSpy.reset();

                    server.respondWith('DELETE', orderUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $deleteBtn.click();
                    server.respond();

                    spyResponse = mainSpy.args[0][0];
                    expect(deleteItemSpy.calledOnce).to.be.true;
                    expect(spyResponse).to.have.property('type', 'error');
                });

                it('Try to delete NotInvoiced Order from editView', function () {
                    var $deleteBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(3)');
                    var orderUrl = new RegExp('\/orders\/', 'i');
                    var $dialog = $('.ui-dilaog');

                    server.respondWith('DELETE', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                        "success": {
                            "_id"            : "56c6ebd80769bba2647ae701",
                            "__v"            : 0,
                            "proformaCounter": 0,
                            "editedBy"       : {
                                "date": "2016-04-11T07:01:01.309Z",
                                "user": "52203e707d4dba8813000003"
                            },
                            "createdBy"      : {
                                "date": "2016-02-19T10:18:00.060Z",
                                "user": "52203e707d4dba8813000003"
                            },
                            "creationDate"   : "2016-02-19T10:18:00.060Z",
                            "groups"         : {
                                "group": [],
                                "users": [],
                                "owner": "55ba28c8d79a3a3439000016"
                            },
                            "attachments"    : [],
                            "whoCanRW"       : "everyOne",
                            "workflow"       : "55647b932e4aa3804a765ec5",
                            "products"       : [{
                                "scheduledDate": "",
                                "jobs"         : "56afda4cf5c2bcd4555cb2f1",
                                "description"  : "",
                                "product"      : "5540d528dacb551c24000003",
                                "unitPrice"    : 360000,
                                "subTotal"     : 360000,
                                "taxes"        : 0,
                                "quantity"     : 42
                            }],
                            "paymentInfo"    : {
                                "taxes"  : 0,
                                "unTaxed": 360000,
                                "total"  : 360000
                            },
                            "paymentTerm"    : null,
                            "invoiceRecived" : false,
                            "invoiceControl" : null,
                            "incoterm"       : null,
                            "destination"    : null,
                            "name"           : "PO825",
                            "expectedDate"   : "2016-02-19T00:00:00.000Z",
                            "orderDate"      : "2016-02-19T00:00:00.000Z",
                            "deliverTo"      : "55543831d51bdef79ea0d58c",
                            "project"        : "56030dbffa3f91444e00000d",
                            "supplier"       : "56030d81fa3f91444e00000c",
                            "isOrder"        : true,
                            "type"           : "Not Invoiced",
                            "forSales"       : true,
                            "currency"       : {
                                "rate": 1,
                                "_id" : "565eab29aeb95fa9c0f9df2d"
                            }
                        }
                    })]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteItemSpy.calledTwice).to.be.true;
                    expect($dialog).to.not.exist;
                });

                it('Try to receive invoice', function () {

                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var usersUrl = new RegExp('\/users\/forDd', 'i');
                    var incotermUrl = '/incoterm';
                    var orderUrl = new RegExp('\/orders\/', 'i');
                    var invoiceUrl = '/invoices/receive';
                    var $receiveInvoiceBtn;
                    var $dialog;

                    receiveSpy.reset();

                    server.respondWith('GET', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOrderById)]);
                    server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsers)]);
                    server.respondWith('GET', incotermUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeIncoterm)]);
                    $needTd.click();
                    server.respond();
                    server.respond();
                    server.respond();

                    expect($('.ui-dialog')).to.exist;

                    $dialog = $('.ui-dialog');
                    $receiveInvoiceBtn = $dialog.find('.receiveInvoice');
                    server.respondWith('PATCH', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    server.respondWith('POST', invoiceUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Created success'})]);
                    $receiveInvoiceBtn.click();
                    server.respond();
                    server.respond();

                    expect(receiveSpy.calledOnce).to.be.true;
                    expect($('.ui-dialog')).to.not.exist;
                    expect(window.location.hash).to.be.equals('#easyErp/salesInvoices');
                });

                it('Try to edit item', function () {
                    var $selectUsersEl;
                    var $dialog;
                    var $secondTab;
                    var $saveBtn;
                    var orderUrl = new RegExp('\/orders\/', 'i');
                    var orderFormUrl = new RegExp('\/orders\/form', 'i');
                    var usersUrl = new RegExp('\/users\/forDd', 'i');
                    var $needTd = listView.$el.find('#listTable > tr:nth-child(1) > td:nth-child(2)');
                    var $selectedItem;
                    var $next;
                    var $prev;

                    saveItemSpy.reset();

                    server.respondWith('GET', orderFormUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOrderById)]);
                    server.respondWith('GET', usersUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeUsers)]);
                    $needTd.click();
                    server.respond();
                    server.respond();

                    $selectUsersEl = $('.assignees-info a');
                    $dialog = $('.ui-dialog');
                    $secondTab = $dialog.find('.dialog-tabs > li:nth-child(2) > a');
                    $saveBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)');

                    $secondTab.click();
                    $selectUsersEl.click();
                    $next = $dialog.find('.next');
                    $next.click();
                    $prev = $dialog.find('.prev');
                    $prev.click();
                    $selectedItem = $dialog.find('#55ba28c8d79a3a3439000016');
                    $selectedItem.click();

                    server.respondWith('PATCH', orderUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Updated success'})]);
                    $saveBtn.click();
                    server.respond();

                    expect(saveItemSpy.calledOnce).to.be.true;
                });

                it('Try to filter listView by Customer and salesPerson', function () {
                    var url = '/quotations/';
                    var contentType = 'salesOrders';
                    var firstValue = 'project';
                    var secondValue = 'supplier';
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

                    server.respondWith('GET', contentUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeOrders)]);
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
                    var secondValue = 'supplier';
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
