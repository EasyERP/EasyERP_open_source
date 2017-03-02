define([
    'Backbone',
    'text!fixtures/index.html',
    'collections/integrations/filterCollection',
    'modules',
    'testConstants/currentUser',
    'testConstants/organizationProfile',
    'testConstants/fakeChannels',
    'testConstants/fakeWarehouses',
    'testConstants/fakeChartsOfAccountForDD',
    'testConstants/fakeCurenciesForDD',
    'views/main/MainView',
    'views/integrations/integrations',
    'views/integrations/integrationSettings',
    'jQuery',
    'chai',
    'chai-jquery',
    'sinon-chai'
], function (Backbone,
             fixtures,
             IntegrationCollection,
             modules,
             currentUser,
             organizationProfile,
             fakeChannels,
             fakeWarehouses,
             fakeChartsOfAccountForDD,
             fakeCurenciesForDD,
             MainView,
             IntegrationView,
             IntegrationSettingsView,
             $,
             chai,
             chaiJquery,
             sinonChai) {
    'use strict';

    var integrationCollection;
    var expect;
    var view;

    var fakeWarehouseData = {
        "_id"      : "5852c1706f6ab787530ab3e8",
        "account"  : {
            "_id"     : "565eb53a6aa50532e5df0bc8",
            "code"    : 100000,
            "account" : "Fixed Asset Account",
            "type"    : "57da4d62713d3fe825f074b2",
            "name"    : "100000 Fixed Asset Account",
            "editedBy": {"date": "2015-12-02T14:19:59.504Z", "user": "52203e707d4dba8813000003"},
            "category": "5810c75b2b225158086d7f82"
        },
        "address"  : {
            "country": "Afghanistan",
            "zip"    : "80000",
            "state"  : "werw",
            "city"   : "wrwerw",
            "street" : "erwer"
        },
        "main"     : false,
        "name"     : "erwerwer",
        "isOwn"    : true,
        "locations": [{"_id": "5852c1706f6ab787530ab3e9", "name": "0.0.0.0"}],
        "zones"    : []
    };
    var fakeLocation = {
        data: [
            {
                _id : "5852c1706f6ab787530ab3e9",
                name: "0.0.0.0"
            }
        ]
    };
    var fakePriceListData = {
        "_id"           : "5853bd1f96583c8d5b40c648",
        "cost"          : false,
        "name"          : "Test Price List",
        "priceListCode" : "TPL",
        "currencyId"    : "USD",
        "currencyName"  : "USD- United States Dollar",
        "currencySymbol": ""
    };
    var fakeStats = {
        importedOrders  : [
            {
                _id  : "584fc1a7150bde5a2d9a686c",
                count: 5
            },
            {
                _id  : "584fb3461e5d070ece3a521d",
                count: 5
            }
        ],
        importedProducts: [
            {
                _id  : "584fb3461e5d070ece3a521d",
                count: 5
            },
            {
                _id  : "584fc1a7150bde5a2d9a686c",
                count: 5
            }
        ],
        conflictProducts: [
            {
                _id  : "584fc1a7150bde5a2d9a686c",
                count: 5
            },
            {
                _id  : "584fb3461e5d070ece3a521d",
                count: 5
            }
        ],
        unlinkedOrders  : [
            {
                _id  : "584fc1a7150bde5a2d9a686c",
                count: 5
            },
            {
                _id  : "584fb3461e5d070ece3a521d",
                count: 5
            }
        ]
    };

    chai.use(chaiJquery);
    chai.use(sinonChai);
    expect = chai.expect;

    describe('IntegrationsView', function () {
        var $fixture;
        var $elFixture;
        var historyNavigateSpy;

        before(function () {
            historyNavigateSpy = sinon.spy(Backbone.history, 'navigate');
        });

        after(function () {
            view.remove();
            historyNavigateSpy.restore();
        });

        describe('#initialize() Main View', function () {
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
                var currentUserUrl = '/users/current';
                var organizationSettingsUrl = '/organizationSettings';
                var $contentWrapper;
                var $topBarMenu;
                var $subMenu;
                var $thisEl;

                server.respondWith('GET', '/modules/', [200, {"Content-Type": "application/json"}, JSON.stringify(modules)]);
                server.respondWith('GET', currentUserUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(currentUser)]);
                server.respondWith('GET', organizationSettingsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(organizationProfile)]);
                view = new MainView({el: $elFixture, contentType: 'integrations'});
                server.respond();
                server.respond();

                $thisEl = view.$el;
                $topBarMenu = $thisEl.find('#topbar-holder');
                $contentWrapper = $thisEl.find('#content-holder');
                $subMenu = $thisEl.find('#submenuHolder');

                expect($topBarMenu).to.exist;
                expect($topBarMenu.find('#logo')).to.exist;
                expect($topBarMenu.find('#loginPanel')).to.exist;
                expect($subMenu).to.exist;
                expect($contentWrapper).to.exist;

            });

            it('Should render menu and subMenu', function () {
                var $thisEl = view.$el;
                var $expectedMenuEl;
                var $needAEl;

                $needAEl = $thisEl.find('a[href="#easyErp/integrations"]')[0];
                $expectedMenuEl = $($needAEl).closest('li');

                $needAEl.click();
                expect($expectedMenuEl).to.have.class('selected');
                expect(window.location.hash).to.be.equals('#easyErp/integrations');
            });
        });

        describe('Integration ContentView', function () {
            var channelsUrl = '/channels';
            var integrationContentViewSpy;
            var collectionSpy;
            var integrationView;
            var mainSpy;
            var server;
            var saveWarehouseSpy;
            var savePriceListSpy;
            var saveChannelSpy;
            var importedProductsSpy;
            var conflictedProductsSpy;
            var importedOrdersSpy;
            var unlinkedOrdersSpy;


            before(function () {
                server = sinon.fakeServer.create();
                mainSpy = sinon.spy(App, 'render');
                integrationContentViewSpy = sinon.spy(IntegrationView.prototype, 'initialize');
                collectionSpy = sinon.spy(IntegrationCollection.prototype, 'initialize');
                saveWarehouseSpy = sinon.spy(IntegrationSettingsView.prototype, 'saveWarehouse');
                savePriceListSpy = sinon.spy(IntegrationSettingsView.prototype, 'savePriceList');
                saveChannelSpy = sinon.spy(IntegrationSettingsView.prototype, 'save');
                importedProductsSpy = sinon.spy(IntegrationView.prototype, 'updateProductsCount');
                conflictedProductsSpy = sinon.spy(IntegrationView.prototype, 'updateConflictedProductsCount');
                importedOrdersSpy = sinon.spy(IntegrationView.prototype, 'updateOrdersCount');
                unlinkedOrdersSpy = sinon.spy(IntegrationView.prototype, 'updateUnlinkedOrdersCount');
            });

            after(function () {
                server.restore();
                mainSpy.restore();
                integrationContentViewSpy.restore();
                collectionSpy.restore();
                saveWarehouseSpy.restore();
                savePriceListSpy.restore();
                saveChannelSpy.restore();

                importedProductsSpy.restore();
                conflictedProductsSpy.restore();
                importedOrdersSpy.restore();
                unlinkedOrdersSpy.restore();

                integrationView.remove();
            });

            it('Should create empty integration ListView', function () {
                var $thisEl;

                server.respondWith('GET', channelsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify({})]);
                integrationView = new IntegrationView();
                server.respond();

                $thisEl = integrationView.$el;

                expect(integrationContentViewSpy.calledOnce).to.be.true;
                expect(collectionSpy.calledOnce).to.be.true;
                expect(integrationView).to.have.property('collection');
                expect(integrationView.collection.length).to.be.equals(0);
                expect($thisEl.find('span')).to.contain('Please Add One');

                integrationView.undelegateEvents();
            });

            it('Should create integration ListView with 2 channels', function () {
                var $firstChannel;
                var $thisEl;

                integrationContentViewSpy.reset();
                collectionSpy.reset();

                server.respondWith('GET', channelsUrl, [200, {"Content-Type": "application/json"}, JSON.stringify(fakeChannels)]);
                integrationView = new IntegrationView();
                server.respond();

                $thisEl = integrationView.$el;

                expect(integrationContentViewSpy.calledOnce).to.be.true;
                expect(collectionSpy.calledOnce).to.be.true;

                expect(integrationView).to.have.property('collection');
                expect(integrationView.collection.length).to.be.equals(2);

                expect($thisEl.find('.app')).to.have.length(2);

                $firstChannel = $thisEl.find('.app').first();

                expect($firstChannel.find('.goUnlinkedProducts')).to.exist;
                expect($firstChannel.find('.goUnlinkedOrders')).to.exist;
                expect($firstChannel.find('.settingsContainer')).to.exist;
            });

            it('Try to open channel settings', function () {
                var $thisEl = integrationView.$el;
                var $firstChannel = $thisEl.find('.app').first();
                var $settingsBtn = $firstChannel.find('.settingsContainer');

                expect($('.ui-dialog')).to.not.exist;
                $settingsBtn.click();
                expect($('.ui-dialog')).to.exist;
            });

            it('Try to cancel channel settings', function () {
                var $dialog = $('.ui-dialog');
                var $cancelBtn = $dialog.find('.ui-button-text').eq(2);

                expect($('.ui-dialog')).to.exist;
                $cancelBtn.click();
                expect($('.ui-dialog')).to.not.exist;
            });

            it('Try to delete channel', function () {
                var $thisEl = integrationView.$el;
                var $firstChannel = $thisEl.find('.app').first();
                var $settingsBtn = $firstChannel.find('.settingsContainer');
                var $dialog;
                var $deleteBtn;

                historyNavigateSpy.reset();
                server.respondWith('GET', 'warehouse/getForDD', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWarehouses)]);
                server.respondWith('GET', 'priceList/getForDd', [200, {"Content-Type": "application/json"}, JSON.stringify({
                    data: [
                        {
                            _id          : "5853bd1f96583c8d5b40c648",
                            __v          : 0,
                            cost         : false,
                            currency     : "USD",
                            name         : "Test Price List",
                            priceListCode: "TPL"
                        }
                    ]
                })]);
                $settingsBtn.click();
                server.respond();

                expect($('.ui-dialog')).to.exist;

                $dialog = $('.ui-dialog');
                $deleteBtn = $dialog.find('.ui-button-text').eq(3);

                server.respondWith('DELETE', channelsUrl + '/584fb3461e5d070ece3a521d', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeChannels)]);
                $deleteBtn.click();
                server.respond();

                expect(historyNavigateSpy.calledOnce).to.be.true;
            });

            it('Try to save channel with status=400', function () {
                var $thisEl = integrationView.$el;
                var $dialog;
                var $saveBtn;

                historyNavigateSpy.reset();

                $dialog = $('.ui-dialog');
                $saveBtn = $dialog.find('.ui-button-text').eq(1);

                mainSpy.reset();

                server.respondWith('PUT', channelsUrl + '/584fb3461e5d070ece3a521d', [400, {"Content-Type": "application/json"}, JSON.stringify({})]);
                $saveBtn.click();
                server.respond();

                expect(mainSpy.calledOnce).to.be.true;
                expect(mainSpy.args[0][0]).to.have.property('message', 'Bad Request');
            });

            it('Try to select create new Warehouse', function () {
                var $dialog = $('.ui-dialog');
                var $selectWarehouseBtn = $dialog.find('#warehouse');
                var $chartsOfAccountBtn;
                var $saveWarehouseBtn;
                var $wareHouseDialog;
                var $newSelectList;
                var $firstBtn;

                $selectWarehouseBtn.click();
                expect($selectWarehouseBtn.find('.newSelectList')).to.exist;

                $newSelectList = $selectWarehouseBtn.find('.newSelectList');
                $firstBtn = $newSelectList.find('li').eq(0);

                server.respondWith('GET', '/chartOfAccount/getForDd', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeChartsOfAccountForDD)]);
                $firstBtn.click();
                server.respond();

                expect($selectWarehouseBtn.find('.newSelectList')).to.not.exist;
                expect($('.ui-dialog')).to.have.length(2);

                $wareHouseDialog = $('.ui-dialog').eq(1);
                $saveWarehouseBtn = $('#create-dialog');

                // set values to warehouse create view
                $wareHouseDialog.find('#name').val('Test');
                $wareHouseDialog.find('#street').val('Test');
                $wareHouseDialog.find('#city').val('Test');
                $wareHouseDialog.find('#state').val('Test');
                $wareHouseDialog.find('#zip').val('88000');
                $chartsOfAccountBtn = $wareHouseDialog.find('#account');

                $chartsOfAccountBtn.click();
                expect($chartsOfAccountBtn.find('.newSelectList')).to.be.exist;
                $chartsOfAccountBtn.find('.newSelectList li').eq(0).click();
                expect($chartsOfAccountBtn.find('.newSelectList')).to.not.exist;
                expect($chartsOfAccountBtn).contain('100000 Fixed Asset Account');

                server.respondWith('POST', '/warehouse/', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWarehouseData)]);
                $saveWarehouseBtn.click();
                server.respond();
                expect(saveWarehouseSpy.calledOnce).to.be.true;

                $('.ui-dialog').eq(1).remove();
            });

            it('Try to create price list', function () {
                var $dialog = $('.ui-dialog');
                var $priceListBtn = $dialog.find('#priceList');
                var $createNewPriceListBtn;
                var $createPriceListDialog;
                var $priceListName;
                var $priceListCode;
                var $currencyBtn;
                var $savePriceListBtn;

                $priceListBtn.click();
                expect($priceListBtn.find('.newSelectList')).to.be.exist;

                $createNewPriceListBtn = $priceListBtn.find('li').eq(0);

                server.respondWith('GET', '/currency/getForDd', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeCurenciesForDD)]);
                $createNewPriceListBtn.click();
                server.respond();

                expect($('.ui-dialog')).to.have.length(2);

                $createPriceListDialog = $('.ui-dialog').eq(1);
                $priceListName = $createPriceListDialog.find('#priceListName');
                $priceListCode = $createPriceListDialog.find('#priceListCode');
                $currencyBtn = $createPriceListDialog.find('#currencyDd');

                $priceListName.val('Test Price List');
                $priceListCode.val('TPL');

                $currencyBtn.click();
                expect($currencyBtn.find('.newSelectList')).to.be.exist;

                $currencyBtn.find('li').eq(1).click();
                expect($currencyBtn.find('.newSelectList')).to.be.not.exist;
                expect($currencyBtn).contain('USD- United States Dollar');
                expect($currencyBtn).to.have.data('id', 'USD');

                $savePriceListBtn = $createPriceListDialog.find('.btn').first();
                server.respondWith('POST', '/priceList/', [200, {"Content-Type": "application/json"}, JSON.stringify(fakePriceListData)]);
                $savePriceListBtn.click();
                server.respond();

                expect(savePriceListSpy.calledOnce).to.be.true;

                $createPriceListDialog.remove();
            });

            it('Try to select exist price list', function () {
                var $dialog = $('.ui-dialog');
                var $priceListBtn = $dialog.find('#priceList');
                var $existPrice;

                $priceListBtn.click();
                expect($priceListBtn.find('.newSelectList')).to.be.exist;

                $existPrice = $dialog.find('li').eq(1);

                $existPrice.click();
                expect($priceListBtn.find('.newSelectList')).to.be.not.exist;
                expect($priceListBtn).contain('Test Price List');
                expect($priceListBtn).to.have.data('id', '5853bd1f96583c8d5b40c648');
            });

            it('Try to save channel with empty warehouse and location', function () {
                var $dialog = $('.ui-dialog');
                var $saveChannelBtn = $dialog.find('.btn').eq(0);

                mainSpy.reset();
                $saveChannelBtn.click();

                expect(mainSpy.calledOnce).to.be.true;
                expect(mainSpy.args[0][0]).to.have.property('message', 'Please, fill warehouse and location fields');
            });

            it('Try to select warehouse in integrationSettings View', function () {
                var $dialog = $('.ui-dialog');
                var $selectWarehouseBtn = $dialog.find('#warehouse');
                var $locationBtn = $dialog.find('#location');
                var $secondWarehouse;
                var $newSelectList;

                $selectWarehouseBtn.click();
                expect($selectWarehouseBtn.find('.newSelectList')).to.exist;

                $newSelectList = $selectWarehouseBtn.find('.newSelectList');
                $secondWarehouse = $newSelectList.find('li').eq(1);

                server.respondWith('GET', 'warehouse/location/getForDd?warehouse=5851621e7cb03908492739a0', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeLocation)]);
                $secondWarehouse.click();
                server.respond();

                $locationBtn.click();
                expect($locationBtn.find('.newSelectList')).to.be.exist;

                $locationBtn.find('li').eq(0).click();
                expect($locationBtn).contain('0.0.0.0');
                expect($selectWarehouseBtn.find('.newSelectList')).to.not.exist;
                expect($dialog.find('#warehouse')).contain('fewfwefwe');
            });

            it('Try to save channel with status=200', function () {
                var $dialog = $('.ui-dialog');
                var $password = $dialog.find('#apipassword');
                var $saveChannelBtn = $dialog.find('.btn').eq(0);

                saveChannelSpy.reset();
                historyNavigateSpy.reset();

                $password.val('ffss333ggdsd');

                server.respondWith('PUT', channelsUrl + '/584fb3461e5d070ece3a521d', [200, {"Content-Type": "application/json"}, JSON.stringify({"success": "Connection is OK!"})]);
                $saveChannelBtn.click();
                server.respond();

                $('.ui-dialog').remove();

                expect(saveChannelSpy.calledOnce).to.be.true;
                expect(historyNavigateSpy.calledOnce).to.be.true;
            });

            it('Try to go to unlinked orders', function () {
                var $thisEl = integrationView.$el;
                var $unlinkedOrdersBtn = $thisEl.find('.goUnlinkedOrders').eq(0);

                historyNavigateSpy.reset();

                $unlinkedOrdersBtn.click();
                expect(historyNavigateSpy.calledOnce).to.be.true;
            });

            it('Try to go to unlinked products', function () {
                var $thisEl = integrationView.$el;
                var $unlinkedProductsBtn = $thisEl.find('.goUnlinkedProducts').eq(0);

                historyNavigateSpy.reset(0);

                $unlinkedProductsBtn.click();
                expect(historyNavigateSpy.calledOnce).to.be.true;
            });

            it('Try to click sync button', function () {
                var $thisEl = integrationView.$el;
                var $syncBtn = $thisEl.find('.actionSync');

                mainSpy.reset();

                $syncBtn.click();
                expect(mainSpy.calledOnce).to.be.true;
                expect(mainSpy.args[0][0]).to.have.property('type', 'notify');
                expect(mainSpy.args[0][0]).to.have.property('message', 'Syncing has been added to the queue. You\'ll be notified after completion.');
            });

            it('Try to emulate "retrievedInventoryCount" event with options=undefined', function () {
                var $thisEl = integrationView.$el;

                integrationView.eventsChannel.trigger('retrievedInventoryCount');

                expect(importedProductsSpy.calledTwice).to.be.false;
                expect(conflictedProductsSpy.calledTwice).to.be.false;
                expect(importedOrdersSpy.calledTwice).to.be.false;
                expect(unlinkedOrdersSpy.calledTwice).to.be.false;

            });

            it('Try to emulate "retrievedInventoryCount" event with options', function () {
                var $thisEl = integrationView.$el;

                integrationView.eventsChannel.trigger('retrievedInventoryCount', fakeStats);

                expect(importedProductsSpy.calledTwice).to.be.true;
                expect(conflictedProductsSpy.calledTwice).to.be.true;
                expect(importedOrdersSpy.calledTwice).to.be.true;
                expect(unlinkedOrdersSpy.calledTwice).to.be.true;

                // expect($thisEl.find('.app').eq(0).find('.goUnlinkedProducts > .channelRowValue > span')).contain('5');
                // expect($thisEl.find('.app').eq(0).find('.goUnlinkedOrders > .channelRowValue > span')).contain('5');
                // expect($thisEl.find('.app').eq(1).find('.goUnlinkedProducts > .channelRowValue > span')).contain('5');
                // expect($thisEl.find('.app').eq(1).find('.goUnlinkedOrders > .channelRowValue > span')).contain('5');
            });

            it('Try to click add channel', function () {
                var $thisEl = integrationView.$el;
                var $addChannelBtn = $thisEl.find('.actionAddNew');

                $addChannelBtn.click();
                expect($('.ui-dialog')).to.be.exist;
            });

            it('Press "cancel" button', function () {
                var $dialog = $('.ui-dialog');
                var $cancelBtn = $dialog.find('.btn');

                expect($('.ui-dialog')).to.be.exist;
                $cancelBtn.click();
                expect($('.ui-dialog')).to.be.not.exist;
            });

            it('Try to create one of possibles channel', function () {
                var $thisEl = integrationView.$el;
                var $addChannelBtn = $thisEl.find('.actionAddNew');
                var $channelNameDialog;
                var $saveChannelBtn;
                var $channelBtn;
                var $dialog;

                $addChannelBtn.click();
                expect($('.ui-dialog')).to.be.exist;

                $dialog = $('.ui-dialog');
                $channelBtn = $dialog.find('.miniApp').eq(0);


                mainSpy.reset();

                $channelBtn.click();
                expect($('.ui-dialog')).to.exist;

                $channelNameDialog = $('.ui-dialog');
                expect($channelNameDialog.find('#channelImgContainer')).to.be.exist;
                expect($channelNameDialog.find('#channelName')).to.be.exist;

                $saveChannelBtn = $channelNameDialog.find('.btn').eq(0);

                $saveChannelBtn.click();
                expect(mainSpy.calledOnce).to.be.true;
                expect(mainSpy.args[0][0]).to.have.property('message', 'Please fill <b>Name</b> field correctly');

                $channelNameDialog.find('#channelName').val('Test channel');

                server.respondWith('GET', 'warehouse/getForDD', [200, {"Content-Type": "application/json"}, JSON.stringify(fakeWarehouses)]);
                server.respondWith('GET', 'priceList/getForDd', [200, {"Content-Type": "application/json"}, JSON.stringify({
                    data: [
                        {
                            _id          : "5853bd1f96583c8d5b40c648",
                            __v          : 0,
                            cost         : false,
                            currency     : "USD",
                            name         : "Test Price List",
                            priceListCode: "TPL"
                        }
                    ]
                })]);
                $saveChannelBtn.click();
                server.respond();
                expect($('.ui-dialog')).to.be.exist;
            });

            it('Try to go to resolve conflicts', function () {
                var $thisEl = integrationView.$el;
                var $resolveConflictsBtn = $thisEl.find('.resConflicts');

                historyNavigateSpy.reset();

                $resolveConflictsBtn.click();

                expect(historyNavigateSpy.calledOnce).to.be.true;
            });
        });
    });
});

