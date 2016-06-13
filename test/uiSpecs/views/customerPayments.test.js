define([
    'Backbone',
    'modules',
    'text!fixtures/index.html',
    'collections/customerPayments/filterCollection',
    'views/main/MainView',
    'views/customerPayments/list/ListView',
    'views/customerPayments/TopBarView',
    'views/customerPayments/EditView',
    'views/Filter/FilterView',
    'helpers/eventsBinder',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone, modules, fixtures, CustomerPaymentsCollection, MainView, ListView, TopBarView, EditView, FilterView, eventsBinder, $, chai, chaiJquery, sinonChai) {
    'use strict';

    var expect;
    var fakeCustomerPayments = {
        total: 300,
        data : [
            {
                _id             : "574d3b36e39a499b52ca80cc",
                total           : 708,
                supplier        : {
                    _id : "56e290f1896e98a661aa831a",
                    name: {
                        last : "",
                        first: "Game scale"
                    }
                },
                currency        : {
                    rate: 1,
                    name: "USD",
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                invoice         : {
                    _id     : "57430e2045f73e53319d8d55",
                    workflow: {
                        name: "Paid"
                    },
                    name    : "PO976_1"
                },
                assigned        : {
                    _id : "56029cc950de7f4138000005",
                    name: {
                        last : "Lendyel",
                        first: "Eugen"
                    }
                },
                forSale         : true,
                differenceAmount: 222800,
                paidAmount      : 225000,
                workflow        : "Paid",
                date            : "2016-05-30T22:00:00.000Z",
                paymentMethod   : {
                    name: "Ukrsibbank USD TM"
                },
                paymentRef      : "",
                period          : null,
                _type           : "ProformaPayment",
                removable       : true
            },
            {
                _id             : "574bf115121743fb1f5b3049",
                total           : 708,
                supplier        : {
                    _id : "561d1bc0b51032d674856acb",
                    name: {
                        last : "",
                        first: "Attrecto"
                    }
                },
                currency        : {
                    rate: 1,
                    name: "USD",
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                invoice         : {
                    _id     : "574bf0cc121743fb1f5b3048",
                    workflow: {
                        name: "Paid"
                    },
                    name    : "PO681"
                },
                assigned        : {
                    _id : "55b92ad221e4b7c40f00004b",
                    name: {
                        last : "Katona",
                        first: "Roland"
                    }
                },
                forSale         : true,
                differenceAmount: 0,
                paidAmount      : 621600,
                workflow        : "Paid",
                date            : "2016-05-29T22:00:00.000Z",
                paymentMethod   : {
                    name: "Ukrsibbank EUR TM"
                },
                paymentRef      : "",
                period          : null,
                _type           : "InvoicePayment",
                removable       : true
            },
            {
                _id             : "5745b7db97f0c30207fafd4c",
                total           : 708,
                supplier        : {
                    _id : "5717873cc6efb4847a5bc78c",
                    name: {
                        last : "",
                        first: "CEEK VR"
                    }
                },
                currency        : {
                    rate: 1,
                    name: "USD",
                    _id : "565eab29aeb95fa9c0f9df2d"
                },
                invoice         : {
                    _id     : "5745b752a5a59a9207be6377",
                    workflow: {
                        name: "Paid"
                    },
                    name    : "PO1078_1"
                },
                assigned        : {
                    _id : "56029cc950de7f4138000005",
                    name: {
                        last : "Lendyel",
                        first: "Eugen"
                    }
                },
                forSale         : true,
                differenceAmount: 0,
                paidAmount      : 300000,
                workflow        : "Paid",
                date            : "2016-05-24T22:00:00.000Z",
                paymentMethod   : {
                    name: "Ukrsibbank USD TM"
                },
                paymentRef      : "",
                period          : null,
                _type           : "ProformaPayment",
                removable       : true
            }
        ]
    };
    var customerPaymentsCollection;
    var view;
    var topBarView;
    var listView;
    var windowConfirmStub;
    var historyNavigateSpy;
    var ajaxSpy;
    var selectValuesSpy;
    var removeFilterSpy;

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('CustomerPayments View', function () {
        var $fixture;
        var $elFixture;

        before(function () {
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
            ajaxSpy = sinon.spy($, 'ajax');
            selectValuesSpy = sinon.spy(FilterView.prototype, 'selectValue');
            removeFilterSpy = sinon.spy(FilterView.prototype, 'removeFilter');
        });

        after(function () {
            view.remove();
            topBarView.remove();
            listView.remove();

            historyNavigateSpy.restore();
            ajaxSpy.restore();
            selectValuesSpy.restore();
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

                server.respondWith('GET', '/getModules', [200, {'Content-Type': 'application/json'}, JSON.stringify(modules)]);

                view = new MainView({el: $elFixture, contentType: 'customerPayments'});

                $expectedMenuEl = view.$el.find('#mainmenu-holder');
                $expectedSubMenuEl = view.$el.find('#submenu-holder');

                server.respond();

                expect($expectedMenuEl).to.exist;
                expect($expectedSubMenuEl).to.exist;
            });

            it('Should render menu and subMenu', function () {
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = view.$el.find('a[data-module-id="61"]')[0];

                $expectedMenuEl = view.$el.find('a[data-module-id="61"]').closest('li');

                $needAEl.click();

                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/customerPayments');

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

            it('Try to fetch collection with error response', function() {
                var customerPaymentsUrl = new RegExp('\/payment\/', 'i');

                historyNavigateSpy.reset();

                server.respondWith('GET', customerPaymentsUrl, [401, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomerPayments)]);
                customerPaymentsCollection = new CustomerPaymentsCollection({
                    viewType   : 'list',
                    page       : 1,
                    count      : 100,
                    contentType: 'customerPayments'
                });
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
            });

            it('Try to create TopBarView', function () {
                var customerPaymentsUrl = new RegExp('\/payment\/', 'i');

                server.respondWith('GET', customerPaymentsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify(fakeCustomerPayments)]);
                customerPaymentsCollection = new CustomerPaymentsCollection({
                    filter     : null,
                    viewType   : 'list',
                    count      : 100,
                    reset      : true,
                    showMore   : false,
                    contentType: 'monthHours'
                });
                server.respond();
                expect(customerPaymentsCollection).to.have.lengthOf(3);

                topBarView = new TopBarView({
                    collection: customerPaymentsCollection
                });

                expect(topBarView.$el.find('#createBtnHolder')).to.exist;
            });
        });

        describe('CustomerPayments list view', function () {
            var server;
            var mainSpy;
            var clock;
            var $thisEl;
            var deleteSpy;
            var sortSpy;

            before(function () {
                windowConfirmStub = sinon.stub(window, 'confirm');
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                clock = sinon.useFakeTimers();
                deleteSpy = sinon.spy(ListView.prototype, 'deleteItems');
                sortSpy = sinon.spy(ListView.prototype, 'goSort');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                clock.restore();
                windowConfirmStub.restore();
                deleteSpy.restore();
                sortSpy.restore();
            });

            describe('INITIALIZE', function () {

                it('Try to create customerPayments list view', function (done) {
                    var $firstRow;
                    var $pagination;
                    var $currentPageList;
                    var colCount;
                    var assigned;
                    var company;
                    var invoice;
                    var bankAccount;
                    var paid;
                    var paymentDate;

                    listView = new ListView({
                        collection: customerPaymentsCollection,
                        startTime : new Date()
                    });
                    clock.tick(200);

                    eventsBinder.subscribeTopBarEvents(topBarView, listView);
                    eventsBinder.subscribeCollectionEvents(customerPaymentsCollection, listView);

                    customerPaymentsCollection.trigger('fetchFinished', {
                        totalRecords: customerPaymentsCollection.totalRecords,
                        currentPage : customerPaymentsCollection.currentPage,
                        pageSize    : customerPaymentsCollection.pageSize
                    });

                    $thisEl = listView.$el;

                    expect($thisEl.find('table')).to.exist;
                    expect($thisEl.find('#listTable > tr')).to.have.lengthOf(3);
                    expect($thisEl.find('#searchContainer')).to.exist;

                    $firstRow = $thisEl.find('#listTable > tr').first();
                    colCount = $firstRow.find('td').length;
                    expect(colCount).to.be.equals(8);

                    assigned = $firstRow.find('td:nth-child(3)').text().trim();
                    expect(assigned).to.not.match(/object Object|undefined/);

                    company = $firstRow.find('td:nth-child(4)').text().trim();
                    expect(company).not.to.be.empty;
                    expect(company).to.not.match(/object Object|undefined/);

                    invoice = $firstRow.find('td:nth-child(5)').text().trim();
                    expect(invoice).not.to.be.empty;
                    expect(invoice).to.not.match(/object Object|undefined/);

                    bankAccount = $firstRow.find('td:nth-child(6)').text().trim();
                    expect(bankAccount).not.to.be.empty;
                    expect(bankAccount).to.not.match(/object Object|undefined/);

                    paid = $firstRow.find('td:nth-child(7)').text().trim();
                    expect(paid).not.to.be.empty;
                    expect(paid).to.not.match(/object Object|undefined/);

                    paymentDate = $firstRow.find('td:nth-child(8)').text().trim();
                    expect(paymentDate).not.to.be.empty;
                    expect(paymentDate).to.not.match(/object Object|undefined/);

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

                it('Try to filter listView by Assigned and company', function () {
                    var $assigned;
                    var $company;
                    var $selectedItem;
                    var $closeBtn;
                    var $searchContainer = $thisEl.find('#searchContainer');
                    var $searchArrow = $searchContainer.find('.search-content');

                    selectValuesSpy.reset();
                    removeFilterSpy.reset();

                    $searchArrow.click();
                    expect($searchContainer.find('.search-options')).to.have.not.class('hidden');

                    // select assigned
                    $assigned = $searchContainer.find('#assignedFullContainer > .groupName');
                    $assigned.click();
                    $selectedItem = $searchContainer.find('#assignedUl > li').first();
                    $selectedItem.click();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                    expect(selectValuesSpy.calledOnce)
                        .to.be.true;

                    //select company
                    $company = $searchContainer.find('#supplierFullContainer > .groupName');
                    $company.click();
                    $selectedItem = $searchContainer.find('#supplierUl > li').first();
                    $selectedItem.click();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                    expect(selectValuesSpy.calledTwice)
                        .to.be.true;

                    // uncheck company Filter

                    $selectedItem = $searchContainer.find('#supplierUl > li').first();
                    $selectedItem.click();
                    server.respond();

                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                    expect(selectValuesSpy.calledThrice)
                        .to.be.true;

                    //close filter dropdown
                    $searchArrow.click();
                    expect($searchContainer.find('.search-options')).to.have.class('hidden');

                    //close Employee filter
                    $closeBtn = $thisEl.find('span[data-value="assigned"]').next();
                    $closeBtn.click();
                    server.respond();
                    expect($thisEl.find('#listTable > tr').length).to.be.equals(3);
                    expect(removeFilterSpy.calledOnce).to.be.true;
                });

                it('Try to sort list', function () {
                    var $sortTypeBtn = listView.$el.find('th[data-sort="paidAmount"]');

                    sortSpy.reset();
                    ajaxSpy.reset();

                    $sortTypeBtn.click();
                    server.respond();
                    expect(sortSpy.calledOnce).to.be.true;
                    expect(ajaxSpy.args[0][0].data.sort).to.exist;
                    expect(ajaxSpy.args[0][0].data.sort).to.have.property('paidAmount', -1);

                    ajaxSpy.reset();

                    $sortTypeBtn.click();
                    server.respond();
                    expect(sortSpy.calledTwice).to.be.true;
                    expect(ajaxSpy.args[0][0].data.sort).to.exist;
                    expect(ajaxSpy.args[0][0].data.sort).to.have.property('paidAmount', 1);
                });

                it('Try to cancel changes', function () {
                    var $dateInput;
                    var $date = $thisEl.find('#listTable > tr:nth-child(1) > td[data-type="dtPicker"]');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');
                    var currentDateValue = $date.text().trim();

                    // Change date
                    $date.click();
                    $dateInput = $date.find('input');
                    $dateInput.val('15 Apr, 2016');
                    $dateInput.trigger('change');

                    $deleteBtn.click();
                    expect($thisEl.find('#listTable > tr:nth-child(1) > td[data-type="dtPicker"]').text().trim()).to.be.equals(currentDateValue);
                });

                it('Try to delete item with 403 error', function () {
                    var supplierPaymentsUrl = new RegExp('\/payment\/', 'i');
                    var $firstEl = listView.$el.find('#listTable > tr:nth-child(1) >.notForm > input');
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    $firstEl.click();

                    windowConfirmStub.returns(true);

                    server.respondWith('DELETE', supplierPaymentsUrl, [403, {'Content-Type': 'application/json'}, JSON.stringify({
                        success: 'Delete success'
                    })]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteSpy.calledOnce).to.be.true;
                });

                it('Try to delete item', function () {
                    var supplierPaymentsUrl = new RegExp('\/payment\/', 'i');
                    var $firstEl = $(listView.$el.find('#listTable input')[0]);
                    var $deleteBtn = topBarView.$el.find('#top-bar-deleteBtn');

                    $firstEl.prop('checked', true);
                    windowConfirmStub.returns(true);

                    server.respondWith('DELETE', supplierPaymentsUrl, [200, {'Content-Type': 'application/json'}, JSON.stringify({success: 'Delete success'})]);
                    $deleteBtn.click();
                    server.respond();

                    expect(deleteSpy.calledTwice).to.be.true;
                });

                it('Try to edit item', function () {
                    var $input;
                    var $dateInput = listView.$el.find('td[data-content="date"]')[0];
                    var $saveBtn = topBarView.$el.find('#top-bar-saveBtn');
                    var $tableContainer = listView.$el.find('table');

                    $dateInput.click();

                    $input = listView.$el.find('input.editing');
                    $input.val('16 Mar, 2016');

                    server.respondWith('PATCH', '/payment/customers/', [200, {'Content-Type': 'application/json'}, JSON.stringify({})]);
                    $saveBtn.click();
                    server.respond();

                    expect($tableContainer.find('input[type="text"].editing').length).to.equals(0);
                });

                it('Try to open edit dialog', function () {
                    var $editDialog;
                    var $needTdEl = $(listView.$el.find('td')[3]);

                    $needTdEl.click();
                    $editDialog = $('.ui-dialog');

                    expect($editDialog).to.exist;
                });

                it('Try to close EditForm', function () {
                    var $cancelBtn = $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.edit-payment-dialog.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button');

                    $cancelBtn.click();

                    expect($('.ui-dialog')).to.not.exist;
                });
            });
        });
    });
});
