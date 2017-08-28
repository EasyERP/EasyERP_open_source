define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Integrations/ChannelSettings.html',
    'text!templates/Integrations/GoToRemoveTemplate.html',
    'models/integrationChannel',
    'views/dialogViewBase',
    'views/selectView/selectView',
    'views/settingsOverview/productDetails/priceLists/CreateView',
    'views/warehouse/CreateView',
    'services/select',
    'dataService',
    'constants',
    'populate',
    'tracker',
    'helpers'
], function (Backbone,
             $,
             _,
             channelSettingsTemplate,
             goToRemoveTemplate,
             Model,
             DialogViewBase,
             selectView,
             CreatePriceListView,
             CreateWarehouseView,
             select,
             dataService,
             CONSTANTS,
             populate,
             tracker,
             helpers) {
    'use strict';

    var Integrations = DialogViewBase.extend({
        contentType            : CONSTANTS.INTEGRATIONS,
        channelSettingsTemplate: _.template(channelSettingsTemplate),
        goToRemoveTemplate     : _.template(goToRemoveTemplate),
        url                    : '/channels',
        events                 : {
            'click .newSelectList li'               : 'chooseOption',
            'click .current-selected:not(.disabled)': 'showNewSelect',
            click                                   : 'hideNewSelect',
            'click #createOwn'                      : 'onCreatePriceList',
            'click #createWarehouse'                : 'onCreateWarehouse',
            'click .syncProducts'                   : 'syncProducts'
        },

        initialize: function (options) {
            _.bindAll(this, 'save', 'cancel', 'remove');

            this.eventsChannel = options.eventsChannel;
            this.listenTo(this.eventsChannel, 'saveWarehouse', this.saveWarehouse);
            this.listenTo(this.eventsChannel, 'closeCreateWarehouse', this.closeCreateWarehouse);
            this.listenTo(this.eventsChannel, 'savePriceList', this.savePriceList);
            this.listenTo(this.eventsChannel, 'closeCreatePriceList', this.closeCreatePriceList);
            this.responseObj = {};
            this.render(options);
        },

        syncProducts: function (e) {
            var model = this.model.toJSON();

            App.render({type: 'notify', message: 'Please, wait few minutes. Your request is in process'});

            this.cancel();

            dataService.getData('/channels/getOnlyProducts', {
                type   : model.type,
                channel: model._id
            }, function (response) {

            });
        },

        reloadTempShips: function (e) {
            e.preventDefault();

            populate.get('#shippingTemps', 'integration/etsy/shippingTemplate', {channel: this.model.get('_id')}, 'name', this);

            return false;
        },

        removeChannelButtons: function (e, self, conflicted, unlinked) {
            var $target = e ? $(e.target) : null;
            var data = $target ? $target.attr('data-type') : 'remove';
            var url = '#easyErp/unlinkedProducts/filter=';
            var filter = {
                channel: this.model.toJSON()._id
            };

            url = url + encodeURIComponent(JSON.stringify(filter)) + '?fromIntegration=true';

            if (data === 'remove') {
                return self.remove();
            }

            self.cancel();
            self.cancelTwoDialog();

            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});

        },

        showNewSelect: function (e) {
            var $target = $(e.target);

            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            this.selectView = new selectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        chooseOption: function (e) {
            var $target = $(e.target).closest('li');
            var id = $target.attr('id');
            var $thisEl = this.$el;
            var type = $target.closest('a').attr('id');

            if (type === 'warehouse') {
                populate.get('#location', 'warehouse/location/getForDd', {warehouse: id}, 'name', this, false);

                $thisEl.find('.jobs').removeClass('jobs');
                $thisEl.find('#location').text('Select').attr('data-id', '');
            }

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

            this.hideNewSelect();

            return false;
        },

        hideNewSelect: select.hideNewSelect,

        save: function () {
            var $thisEl = this.$el;
            var channelName = $thisEl.find('#channelName').val();
            var baseUrl = $thisEl.find('#baseURL').val();
            var shopname = $thisEl.find('#apishop').val();
            var username = $thisEl.find('#apiuser').val();
            var password = $thisEl.find('#apipassword').val();
            var version = $thisEl.find('#version').val();
            var sharedSecret = $thisEl.find('#sharedSecret').val();
            var warehouse = $thisEl.find('#warehouse').attr('data-id');
            var location = $thisEl.find('#location').attr('data-id');
            var priceList = $thisEl.find('#priceList').attr('data-id');
            var shippingTemp = $thisEl.find('#shippingTemps').attr('data-id');
            var shippingName = $thisEl.find('#shippingTemps').text();
            var bankAccount = $thisEl.find('#bankAccount').attr('data-id');
            var shippingStatus = $thisEl.find('#shippingStatus').prop('checked');
            var shippingMethod = $thisEl.find('#shippingMethod').prop('checked');
            var isCreate = $thisEl.find('#automatingGetProducts').prop('checked');
            var dateFrom = helpers.setTimeToDate(new Date($thisEl.find('#dateFrom').val()));
            var url = this.url + '/' + this.type;
            var model = this.model || new Model({type: this.type});
            var errorContainer = 'password';
            var isNew;
            var data;

            function triggerGetAll(result) {
                App.render({
                    type   : 'notify',
                    message: 'Syncing has been added to the queue. You\'ll be notified after completion.'
                });

                if (result && result.login_url) {
                    window.open(result.login_url, 'mywindow', 'width=500,height=600');
                }

                Backbone.history.fragment = '';
                Backbone.history.navigate('#easyErp/integrations', {replace: true, trigger: true});
            }

            if (!warehouse || !location) {
                return App.render({
                    type   : 'error',
                    message: 'Select warehouse and location fields, please.'
                });
            }

            if (!priceList) {
                return App.render({
                    type   : 'error',
                    message: 'Select price list, please.'
                });
            }

            if (!bankAccount && this.type === 'etsy') {
                return App.render({
                    type   : 'error',
                    message: 'Select bankAccount field, please.'
                });
            }

            if (!password) {
                if (this.type === 'woo') {
                    errorContainer = 'consumer secret';
                }

                return App.render({
                    type   : 'error',
                    message: 'Please, enter ' + errorContainer + ' first'
                });
            }

            data = {
                channelName         : channelName,
                baseUrl             : baseUrl,
                username            : username,
                password            : password,
                warehouse           : warehouse,
                priceList           : priceList,
                location            : location,
                bankAccount         : bankAccount,
                updateShippingStatus: shippingStatus,
                updateShippingMethod: shippingMethod,
                version             : version,
                sharedSecret        : sharedSecret,
                automatingGetProduct: isCreate,
                ordersDate          : dateFrom
            };

            if (this.type === 'etsy') {
                data.shopname = shopname;
            }

            isNew = !!model.isNew();

            if (isNew) {
                data.connected = false;
                model.urlRoot = url;
            }

            model.set(data);
            model.save(null, {
                success: function (model) {
                    /*if (isNew) {
                        tracker.track({
                            date       : new Date(),
                            eventType  : 'userFlow',
                            name       : 'createChannel',
                            message    : 'create channel',
                            email      : App.currentUser.email,
                            login      : App.currentUser.login,
                            mobilePhone: App.currentUser.mobilePhone
                        });

                        model = model && model.toJSON();
                        return triggerGetAll(model);
                    }*/

                    tracker.track({
                        date       : new Date(),
                        eventType  : 'userFlow',
                        name       : 'updateChannel',
                        message    : 'update channel',
                        email      : App.currentUser.email,
                        login      : App.currentUser.login,
                        mobilePhone: App.currentUser.mobilePhone
                    });

                    App.render({
                        type   : 'notify',
                        message: 'Updated successfully'
                    });

                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#easyErp/integrations', {replace: true, trigger: true});
                },

                error: function (model, xhr) {
                    return App.render({
                        message: xhr.responseJSON && xhr.responseJSON.error || xhr.statusText
                    });
                }
            });
        },

        onCreatePriceList: function () {
            this.createPricelist = new CreatePriceListView({
                eventsChannel: this.eventsChannel
            });
        },

        onCreateWarehouse: function () {
            this.createWarehouse = new CreateWarehouseView({
                eventChannel: this.eventsChannel
            });
        },

        saveWarehouse: function (model) {
            var warehouse = model.toJSON();
            var $thisEl = this.$el;
            var $warehouseEl = $thisEl.find('#warehouse');
            var $locationEl = $thisEl.find('#location');
            var id = warehouse._id;
            var name = warehouse.name;
            var locationId = warehouse.locations[0]._id;
            var locationName = warehouse.locations[0].name;

            $warehouseEl.text(name).attr('data-id', id);
            $locationEl.text(locationName).attr('data-id', locationId);

            this.responseObj['#warehouse'].push({
                name      : name,
                _id       : id,
                isEmployee: false
            });

            if (this.responseObj.hasOwnProperty('#location')) {
                this.responseObj['#location'].push({
                    name      : locationName,
                    _id       : locationId,
                    isEmployee: false
                });
            } else {
                this.responseObj['#location'] = [{
                    name      : locationName,
                    _id       : locationId,
                    isEmployee: false
                }];
            }

            this.createWarehouse.remove();
        },

        savePriceList: function (model) {
            var priceList = model.toJSON();
            var $thisEl = this.$el;
            var $priceListEl = $thisEl.find('#priceList');

            $priceListEl.attr('data-id', priceList._id);
            $priceListEl.text(priceList.name);

            this.createPricelist.remove();
        },

        closeCreateWarehouse: function () {
            this.createWarehouse.remove();
        },

        closeCreatePriceList: function () {
            this.createPricelist.remove();
        },

        cancel: function () {
            this.eventsChannel.trigger('closeDialog');
        },

        cancelTwoDialog: function () {
            this.eventsChannel.trigger('closeSecondDialog');
        },

        removeSecondDialog: function () {
            this.secondDialog.remove();
        },

        goToRemove: function () {
            var self = this;
            var stats = this.model.toJSON().stats;
            var answer;
            var conflicted;
            var unlinked;
            var dialogOptions = {
                dialogClass: 'edit-dialog',
                width      : 600,
                buttons    : {
                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.cancelTwoDialog();
                        }
                    }
                }
            };
            var dialogContent;

            dialogContent = this.goToRemoveTemplate({model: this.model});

            conflicted = stats && stats.products && stats.products.conflicted && stats.products.conflicted.count;
            unlinked = stats && stats.orders && stats.orders.unlinked && stats.orders.unlinked.count;

            if (conflicted || unlinked) {
                this.secondDialog = $(dialogContent).dialog(dialogOptions);

                this.secondDialog.on('click', '.removeChannelButtons', function (e) {
                    self.removeChannelButtons(e, self, conflicted, unlinked);
                });
            } else {
                answer = confirm('Do you confirm the deletion of the channel?');

                if (answer) {
                    self.removeChannelButtons(null, self);
                }
            }

        },

        remove: function () {
            tracker.track({
                date       : new Date(),
                eventType  : 'userFlow',
                name       : 'removeChannel',
                message    : 'remove channel',
                email      : App.currentUser.email,
                login      : App.currentUser.login,
                mobilePhone: App.currentUser.mobilePhone
            });

            this.model.destroy({
                success: function () {
                    // self.eventsChannel.trigger('closeDialog');
                    Backbone.history.fragment = '';
                    Backbone.history.navigate('#easyErp/integrations', {replace: true, trigger: true});
                }
            });
        },

        render: function (options) {
            var model = this.model;
            var type = options.type || model && model.get('type');
            var name = options.name || model && model.get('channelName');
            var ordersDate = model && model.get('ordersDate');
            var self = this;
            var isCreate = true;
            var dialogTitle = 'Add channel details';
            var dialogOptions = {
                dialogClass: 'edit-dialog',
                width      : 400,
                buttons    : {
                    save: {
                        text : 'Save',
                        class: 'btn blue',
                        click: self.save
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.cancel
                    }
                }
            };
            var dialogContent;

            if (!name) {
                return App.render({
                    message: 'Please fill <b>Name</b> field correctly'
                });
            }

            this.type = type;
            this.channelName = name;

            if (model && model.id) {
                dialogTitle = 'Edit channel details';
                isCreate = false;

                dialogOptions.buttons.delete = {
                    text : 'Delete',
                    class: 'btn',
                    click: /*self.goToRemove*/ function () {
                        self.goToRemove();
                    }
                };
            }

            dialogContent = this.channelSettingsTemplate({
                dialogTitle: dialogTitle,
                type       : type,
                channelName: name,
                credentials: model && model.toJSON(),
                isCreate   : isCreate
            });

            this.$el = $(dialogContent).dialog(dialogOptions);

            //populate.get('#warehouse', 'warehouse/getForDD', {}, 'name', this);

            dataService.getData('warehouse/getForDD', {}, function (response) {
                if (response && !response.error) {
                    self.responseObj['#warehouse'] = response.data;
                }
                self.responseObj['#warehouse'].push({
                    name      : 'CREATE NEW',
                    _id       : 'createWarehouse',
                    isEmployee: false
                });
            });

            populate.get('#bankAccount', '/paymentMethod', {}, 'name', this, true, true);

            dataService.getData('priceList/getForDd', {}, function (response) {
                if (response && !response.error) {
                    self.responseObj['#priceList'] = response.data;
                }
                self.responseObj['#priceList'].push({
                    name      : 'CREATE NEW',
                    _id       : 'createOwn',
                    isEmployee: false
                });
            });

            this.$el.find('#dateFrom').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : new Date()
            }).datepicker('setDate', new Date(ordersDate));

            this.delegateEvents(this.events);

            return this;
        }
    });

    return Integrations;
});
