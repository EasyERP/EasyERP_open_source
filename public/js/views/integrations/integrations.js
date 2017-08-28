define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Integrations/IntegrationsTemplate.html',
    'text!templates/Integrations/CreateList.html',
    'text!templates/Integrations/ChannelNameSelect.html',
    'text!templates/Integrations/GoToRemoveTemplate.html',
    'collections/integrations/filterCollection',
    'views/integrations/integrationSettings',
    'views/guideTours/guideNotificationView',
    'dataService',
    'helpers/eventsBinder',
    'constants',
    'tracker'
], function (Backbone,
             $,
             _,
             integrationsTemplate,
             createListTemplate,
             channelNameSelectTemplate,
             goToRemoveTemplate,
             IntegrationCollection,
             IntegrationSettings,
             GuideNotify,
             dataService,
             eventsBinder,
             CONSTANTS,
             tracker) {
    'use strict';

    var Integrations = Backbone.View.extend({
        contentType: CONSTANTS.INTEGRATIONS,
        el         : '#content-holder',

        integrationsTemplate     : _.template(integrationsTemplate),
        channelNameSelectTemplate: _.template(channelNameSelectTemplate),
        createTemplate           : _.template(createListTemplate),
        goToRemoveTemplate       : _.template(goToRemoveTemplate),

        events: {
            'click .current-selected:not(.disabled)': 'showNewSelect',
            'click .resConflicts'                   : 'resolveConflicts',
            'click .settingsContainer'              : 'onSettingsClick',
            'click .btn.action'                     : 'onActionFire',
            'click .goListProducts:not(.disable)'   : 'goListProducts',
            'click .goUnlinkedOrders:not(.disable)' : 'goUnlinkedOrders',
            'click .goToOrders:not(.disable)'       : 'goToOrders',
            'click .goUnlinkedProducts'             : 'goUnlinkedProducts',
            'click .connectionSwitcher'             : 'disconnect'
        },

        initialize: function (options) {
            var type = options.type;

            _.bindAll(this, 'cancel', 'onContinue', 'showNameContent');

            this.eventsChannel = App.eventsChannel || _.extend({}, Backbone.Events);

            this.listenTo(this.eventsChannel, 'retrievedInventoryCount', this.renderCount);
            this.listenTo(this.eventsChannel, 'closeDialog', this.closeDialog);
            this.listenTo(this.eventsChannel, 'closeSecondDialog', this.closeSecondDialog);
            this.listenTo(this.eventsChannel, 'showResolveConflict', this.showResolveConflictBtn);
            this.listenTo(this.eventsChannel, 'resolveConflict', this.resolveConflicts);

            this.responseObj = {};
            this.collection = new IntegrationCollection({type: type});
            //this.collection.url += ('/' + type);
            this.listenTo(this.collection, 'reset', this.render);
            // this.render();

        },

        disconnect: function (e) {
            var self = this;
            var $target = $(e.target);
            var channelId = $target.closest('div.app').attr('data-id');
            var model = this.collection.get(channelId);
            var jsonModel = model.toJSON();
            var connectedStatus = model.get('connected');

            App.startPreload();

            if (connectedStatus) {
                model.set('connected', false);

                tracker.track({
                    date       : new Date(),
                    eventType  : 'userFlow',
                    name       : 'disconnectChannel',
                    message    : 'disconnect channel',
                    email      : App.currentUser.email,
                    login      : App.currentUser.login,
                    mobilePhone: App.currentUser.mobilePhone
                });

                $target.closest('.switcherWrap').removeClass('success');
            } else {

                if (jsonModel.type === 'etsy' && jsonModel.baseUrl === 'https://openapi.etsy.com/v2') {
                    App.stopPreload();

                    tracker.track({
                        date       : new Date(),
                        eventType  : 'userFlow',
                        name       : 'connectEtsy',
                        message    : 'try connect Etsy',
                        email      : App.currentUser.email,
                        login      : App.currentUser.login,
                        mobilePhone: App.currentUser.mobilePhone
                    });

                    return App.render({
                        type   : 'notify',
                        message: 'Please, create your own ETSY Channel, Etsy doest\'t allow test accounts.'
                    });
                }
                /*else if (jsonModel.type === 'woo' && jsonModel.baseUrl === 'http://erp-woocommerce.test.thinkmobiles.com') {
                 App.stopPreload();

                 tracker.track({
                 date     : new Date(),
                 eventType: 'userFlow',
                 name     : 'connectWoo',
                 message  : 'try connect Woo',
                 email    : App.currentUser.email,
                 login    : App.currentUser.login
                 });

                 return App.render({
                 type   : 'notify',
                 message: 'WooCommerce integration is in development now.'
                 });
                 }*/

                tracker.track({
                    date       : new Date(),
                    eventType  : 'userFlow',
                    name       : 'connectChannel',
                    message    : 'connect channel',
                    email      : App.currentUser.email,
                    login      : App.currentUser.login,
                    mobilePhone: App.currentUser.mobilePhone
                });

                model.set('connected', true);

                $target.closest('.switcherWrap').addClass('success');
            }

            model.set('changeConnect', true);

            model.save(model.changed, {
                patch: true,

                success: function (model) {
                    self.collection.set(model, {remove: false});
                    App.stopPreload();
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                    App.stopPreload();
                }
            });
        },

        showResolveConflictBtn: function () {
            tracker.track({
                date       : new Date(),
                eventType  : 'userFlow',
                name       : 'resolveConflicts',
                message    : 'resolve conflicts',
                email      : App.currentUser.email,
                login      : App.currentUser.login,
                mobilePhone: App.currentUser.mobilePhone
            });

            this.$el.find('.resConflicts').removeClass('hidden');
        },

        goToOrders: function (e) {
            var $target = $(e.target);
            var hash = 'easyErp/order/list/filter=';
            var channel = $target.closest('.app').attr('data-id');
            var filter = {
                channel: {
                    key  : 'channel._id',
                    value: [channel]
                }
            };
            var href = hash + encodeURIComponent(JSON.stringify(filter));

            tracker.track({
                date       : new Date(),
                eventType  : 'userFlow',
                name       : 'syncedOrders',
                message    : 'synced orders',
                email      : App.currentUser.email,
                login      : App.currentUser.login,
                mobilePhone: App.currentUser.mobilePhone
            });

            Backbone.history.fragment = '';
            Backbone.history.navigate(href, {trigger: true});
        },

        goListProducts: function (e) {
            var $target = $(e.target);
            var hash = '#easyErp/Products/list/filter=';
            var channel = $target.closest('.app').attr('data-id');

            var filter = {
                channelLinks: {
                    key  : 'channelLinks.channel',
                    value: [channel],
                    type : 'unpublish'
                },
                toExpand    : true
            };

            var href = (hash + encodeURIComponent(JSON.stringify(filter)));

            Backbone.history.fragment = '';
            Backbone.history.navigate(href, {trigger: true});
        },

        goUnlinkedOrders: function (e) {
            var $target = $(e.target);
            var hash = 'easyErp/order/list/filter=';
            var channel = $target.closest('.app').attr('data-id');
            var filter = {
                channel: {
                    key  : 'channel._id',
                    value: [channel]
                },

                workflow: {
                    key  : 'workflow._id',
                    value: [CONSTANTS.DEFAULT_UNLINKED_WORKFLOW_ID]
                }
            };
            var href = hash + encodeURIComponent(JSON.stringify(filter));

            tracker.track({
                date       : new Date(),
                eventType  : 'userFlow',
                name       : 'unlinkedOrders',
                message    : 'unlinked orders',
                email      : App.currentUser.email,
                login      : App.currentUser.login,
                mobilePhone: App.currentUser.mobilePhone
            });

            Backbone.history.fragment = '';
            Backbone.history.navigate(href, {trigger: true});
        },

        goUnlinkedProducts: function (e) {
            var $target = $(e.target);
            var hash = 'easyErp/unlinkedProducts/filter=';
            var channel = $target.closest('.app').attr('data-id');
            var filter = {
                channel        : channel,
                fromIntegration: true
            };
            var href = hash + encodeURIComponent(JSON.stringify(filter));

            tracker.track({
                date       : new Date(),
                eventType  : 'userFlow',
                name       : 'unlinkeProducts',
                message    : 'unlinked products',
                email      : App.currentUser.email,
                login      : App.currentUser.login,
                mobilePhone: App.currentUser.mobilePhone
            });

            Backbone.history.fragment = '';
            Backbone.history.navigate(href, {trigger: true});
        },

        onContinue: function () {
            var $dialog = this.$dialogEl;
            var $channelNameContainer = $dialog.closest('#channelNameContainer');
            var type = $channelNameContainer.attr('data-type');
            var $nameInput = $dialog.find('#channelName');
            var name = $.trim($nameInput.val());

            if (!name) {
                return App.render({
                    message: 'Please fill <b>Name</b> field correctly'
                });
            }

            $dialog.remove();
            this.$dialog = new IntegrationSettings({
                eventsChannel: this.eventsChannel,
                type         : type,
                name         : name
            });

            this.$dialogEl = this.$dialog.$el;
        },

        closeDialog: function () {
            this.$dialogEl.remove();
        },

        closeSecondDialog: function () {
            this.$dialog.removeSecondDialog();
        },

        renderCount: function (options) {
            var importedProductsArr;
            var importedOrdersArr;
            var conflictedProductsArr;
            var unlinkedOrdersArr;
            var $container;
            var self = this;
            var $el = this.$el;

            if (!options) {
                return;
            }

            $container = $el.find('._appsWrap');
            importedProductsArr = options.importedProducts;
            importedOrdersArr = options.importedOrders;
            conflictedProductsArr = options.conflictProducts;
            unlinkedOrdersArr = options.unlinkedOrders;

            importedProductsArr.forEach(function (elementData) {
                self.updateProductsCount($container, elementData);
            });

            importedOrdersArr.forEach(function (elementData) {
                self.updateOrdersCount($container, elementData);
            });

            conflictedProductsArr.forEach(function (elementData) {
                self.updateConflictedProductsCount($container, elementData);
            });

            unlinkedOrdersArr.forEach(function (elementData) {
                self.updateUnlinkedOrdersCount($container, elementData);
            });

            if (unlinkedOrdersArr.length) {
                $el.find('#unlinkedOrders').removeClass('hidden');
            } else {
                $el.find('#unlinkedOrders').addClass('hidden');
            }

            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        updateProductsCount: function ($targetEl, elementData) {
            var $container;
            var $importedProductsContainer;

            if ($targetEl && elementData) {
                $container = $targetEl.find('[data-id="' + elementData._id + '"]');
                $importedProductsContainer = $container.find('[data-content="list"] .channelRowValue span');
                $importedProductsContainer.text(elementData.count);
            }
        },

        updateOrdersCount: function ($targetEl, elementData) {
            var $container;
            var $importedProductsContainer;

            if ($targetEl && elementData) {
                $container = $targetEl.find('[data-id="' + elementData._id + '"]');
                $importedProductsContainer = $container.find('[data-content="order"] .channelRowValue span');
                $importedProductsContainer.text(elementData.count);
            }
        },

        updateConflictedProductsCount: function ($targetEl, elementData) {
            var $container;
            var $conflictedProductsContainer;
            var $goUnlinkedProducts;
            var count;

            if ($targetEl && elementData) {
                count = elementData.count;
                $container = $targetEl.find('[data-id="' + elementData._id + '"]');
                $goUnlinkedProducts = $container.find('.goUnlinkedProducts');
                $conflictedProductsContainer = $goUnlinkedProducts.find('.channelRowValue span');
                $conflictedProductsContainer.text(count);

                if (count) {
                    $goUnlinkedProducts.removeClass('disable');
                }
            }
        },

        updateUnlinkedOrdersCount: function ($targetEl, elementData) {
            var $container;
            var $unlinkedOrdersContainer;
            var $goUnlinkedOrders;
            var count;

            if ($targetEl && elementData) {
                count = elementData.count;
                $container = $targetEl.find('[data-id="' + elementData._id + '"]');
                $goUnlinkedOrders = $container.find('.goUnlinkedOrders');
                $unlinkedOrdersContainer = $goUnlinkedOrders.find('.channelRowValue span');
                $unlinkedOrdersContainer.text(count);

                if (count) {
                    $goUnlinkedOrders.removeClass('disable');
                }
            }
        },

        cancel: function () {
            this.closeDialog();
        },

        showNameContent: function (e) {
            var $target = $(e.target);
            var type = $target.closest('.miniApp').attr('data-type');
            var self = this;
            var dialogOptions = {
                dialogClass: 'edit-dialog',
                width      : 400,
                buttons    : {
                    continue: {
                        text : 'Continue',
                        class: 'btn blue',
                        id   : 'continueBtn',
                        click: self.onContinue
                    },

                    cancel: {
                        text : 'Cancel',
                        id   : 'cancelBtn',
                        class: 'btn',
                        click: self.cancel
                    }
                }
            };
            var dialogContent = this.channelNameSelectTemplate({type: type});

            this.$dialogEl.remove();
            this.$dialogEl = $(dialogContent).dialog(dialogOptions);

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        },

        bindEventsToDialog: function () {
            this.$dialogEl.on('click', '.miniApp', this.showNameContent);
        },

        resolveConflicts: function (e) {
            var filter = {
                channel        : this,
                fromIntegration: true
            };
            var href = hash + encodeURIComponent(JSON.stringify(filter));

            if (e) {
                e.preventDefault();
            }

            tracker.track({
                date       : new Date(),
                eventType  : 'userFlow',
                name       : 'resolveConflicts',
                message    : 'resolve conflicts',
                email      : App.currentUser.email,
                login      : App.currentUser.login,
                mobilePhone: App.currentUser.mobilePhone
            });

            Backbone.history.fragment = '';
            Backbone.history.navigate(href, {trigger: true});
        },

        showAddDialog: function (e) {
            var dialogContent = this.createTemplate();
            var self = this;

            var dialogOptions = {
                dialogClass: 'edit-dialog',
                width      : 900,
                buttons    : {
                    cancel: {
                        text : 'Cancel',
                        id   : 'cancelBtn',
                        class: 'btn',
                        click: self.cancel
                    }
                }
            };

            tracker.track({
                date       : new Date(),
                eventType  : 'userFlow',
                name       : 'createChannel',
                message    : 'create channel',
                email      : App.currentUser.email,
                login      : App.currentUser.login,
                mobilePhone: App.currentUser.mobilePhone
            });

            this.$dialogEl = $(dialogContent).dialog(dialogOptions);
            this.bindEventsToDialog();

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        },

        syncChannels: function (e) {
            // var $target = $(e.target);
            // var action = $target.attr('data-action');

            tracker.track({
                date       : new Date(),
                eventType  : 'userFlow',
                name       : 'sync',
                message    : 'sync channels',
                email      : App.currentUser.email,
                login      : App.currentUser.login,
                mobilePhone: App.currentUser.mobilePhone
            });

            dataService.getData('/integration/sync', null, function (resp) {
                if (resp.error && resp.error.responseJSON) {
                    return App.render({
                        type   : 'error',
                        message: resp.error.responseJSON.error
                    });
                }

                App.render({
                    type   : 'notify',
                    message: 'Your request is in process.  Imported data will be available in a few minutes.'
                });
            });

        },

        onSettingsClick: function (e) {
            var $target = $(e.target);
            var $parrent = $target.closest('div.app');
            var id = $parrent.attr('data-id');

            var model = this.collection.get(id);

            this.$dialog = new IntegrationSettings({
                eventsChannel: this.eventsChannel,
                model        : model
            });

            tracker.track({
                date       : new Date(),
                eventType  : 'userFlow',
                name       : 'channelSettings',
                message    : 'channel settings',
                email      : App.currentUser.email,
                login      : App.currentUser.login,
                mobilePhone: App.currentUser.mobilePhone
            });

            this.$dialogEl = this.$dialog.$el;
        },

        onActionFire: function (e, action) {
            var $target = e ? $(e.target) : null;
            var action = $target ? $target.attr('data-action') : action;

            var actionsContainer = {
                add: function (e) {
                    return this.showAddDialog(e);
                },

                sync: function (e) {
                    return this.syncChannels(e);
                }
            };

            return actionsContainer[action] && actionsContainer[action].call(this, e);
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var $topBar = $('#top-bar');
            var collection = this.collection;
            var items = collection.toJSON();
            var showUnlinkedBtn = collection.stats && collection.stats.unlinkedOrders && collection.stats.unlinkedOrders.length;

            $('title').text(CONSTANTS.INTEGRATIONS.toUpperCase());

            $topBar.empty();
            $thisEl.html(this.integrationsTemplate({items: items, showUnlinkedBtn: showUnlinkedBtn}));

            /* dataService.getData('/integration/conflicts', {}, function (result) {
             if (result && Object.keys(result).length) {
             $thisEl.find('.resConflicts').removeClass('hidden');
             }

             self.conflicts = result;
             });*/

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }

            return this;
        }
    });

    return Integrations;
});
