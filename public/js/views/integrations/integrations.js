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
    'dataService',
    'helpers/eventsBinder',
    'constants'
], function (Backbone,
             $,
             _,
             integrationsTemplate,
             createListTemplate,
             channelNameSelectTemplate,
             goToRemoveTemplate,
             IntegrationCollection,
             IntegrationSettings,
             dataService,
             eventsBinder,
             CONSTANTS) {
    'use strict';

    var Integrations = Backbone.View.extend({
        contentType: CONSTANTS.INTEGRATIONS,
        el         : '#content-holder',

        integrationsTemplate     : _.template(integrationsTemplate),
        channelNameSelectTemplate: _.template(channelNameSelectTemplate),
        createTemplate           : _.template(createListTemplate),
        goToRemoveTemplate       : _.template(goToRemoveTemplate),

        events: {
            'click .current-selected:not(.disabled)' : 'showNewSelect',
            'click .resConflicts'                    : 'resolveConflicts',
            'click .settingsContainer'               : 'onSettingsClick',
            'click .btn.action'                      : 'onActionFire',
            'click .goUnlinkedOrders:not(.disable)'  : 'goUnlinkedOrders',
            'click .goUnlinkedProducts:not(.disable)': 'goUnlinkedProducts',
            'click .disconnect'                      : 'disconnect'
        },

        initialize: function () {
            _.bindAll(this, 'cancel', 'onContinue', 'showNameContent');

            this.eventsChannel = App.eventsChannel || _.extend({}, Backbone.Events);

            this.listenTo(this.eventsChannel, 'retrievedInventoryCount', this.renderCount);
            this.listenTo(this.eventsChannel, 'closeDialog', this.closeDialog);
            this.listenTo(this.eventsChannel, 'closeSecondDialog', this.closeSecondDialog);
            this.listenTo(this.eventsChannel, 'showResolveConflict', this.showResolveConflictBtn);
            this.listenTo(this.eventsChannel, 'resolveConflict', this.resolveConflicts);

            this.responseObj = {};
            this.collection = new IntegrationCollection();
            this.listenTo(this.collection, 'reset', this.render);
            // this.render();
        },

        disconnect: function (e) {
            var self = this;
            var $target = $(e.target);
            var channelId = $target.closest('div.app').attr('data-id');
            var model = this.collection.get(channelId);
            var connectedStatus = model.get('connected');

            App.startPreload();

            if (connectedStatus) {
                model.set('connected', false);

                $target.closest('.connection').removeClass('success').addClass('blue');
                $target.closest('.connection').text('DISCONNECTED');
            } else {

                if (channelId === '58a3016677f606c49beaad66') {
                    App.stopPreload();
                    
                    return App.render({
                        type: 'notify',
                        message: 'Please, create your own ETSY Channel, Etsy doest\'t allow test accounts.'
                    });
                }

                model.set('connected', true);

                $target.closest('.connection').addClass('success');
                $target.closest('.connection').text('Connected');
            }

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
            this.$el.find('.resConflicts').removeClass('hidden');
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

            Backbone.history.fragment = '';
            Backbone.history.navigate(href, {trigger: true});
        },

        goUnlinkedProducts: function (e) {
            var $target = $(e.target);
            var hash = 'easyErp/integrationUnlinkedProducts/list/filter=';
            var channel = $target.closest('.app').attr('data-id');
            var filter = {
                channel: channel
            };
            var href = hash + encodeURIComponent(JSON.stringify(filter)) + '?fromIntegration=true';

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

            if ($targetEl && elementData) {
                $container = $targetEl.find('[data-id="' + elementData._id + '"]');
                $conflictedProductsContainer = $container.find('.goUnlinkedProducts .channelRowValue span');
                $conflictedProductsContainer.text(elementData.count);
            }
        },

        updateUnlinkedOrdersCount: function ($targetEl, elementData) {
            var $container;
            var $unlinkedOrdersContainer;

            if ($targetEl && elementData) {
                $container = $targetEl.find('[data-id="' + elementData._id + '"]');
                $unlinkedOrdersContainer = $container.find('.goUnlinkedOrders .channelRowValue span');
                $unlinkedOrdersContainer.text(elementData.count);
            }
        },

        cancel: function () {
            this.closeDialog();
        },

        showNameContent: function (e) {
            var $target = $(e.target);
            var type = $target.closest('div.miniApp').attr('data-type');
            var self = this;
            var dialogOptions = {
                dialogClass: 'edit-dialog',
                width      : 400,
                buttons    : {
                    continue: {
                        text : 'Continue',
                        class: 'btn blue',
                        click: self.onContinue
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.cancel
                    }
                }
            };
            var dialogContent = this.channelNameSelectTemplate({type: type});

            this.$dialogEl.remove();
            this.$dialogEl = $(dialogContent).dialog(dialogOptions);
        },

        bindEventsToDialog: function () {
            this.$dialogEl.on('click', '.miniApp', this.showNameContent);
        },

        resolveConflicts: function (e) {
            if (e) {
                e.preventDefault();
            }

            Backbone.history.fragment = '';
            Backbone.history.navigate('#easyErp/resolveConflicts', {trigger: true});
        },

        showAddDialog: function (e) {
            var dialogContent = this.createTemplate();
            var self = this;

            var dialogOptions = {
                dialogClass: 'edit-dialog',
                width      : 580,
                buttons    : {
                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.cancel
                    }
                }
            };

            this.$dialogEl = $(dialogContent).dialog(dialogOptions);
            this.bindEventsToDialog();
        },

        syncChannels: function (e) {
            // var $target = $(e.target);
            // var action = $target.attr('data-action');

            dataService.getData('/integration/sync', null, function () {

            });

            App.render({
                type   : 'notify',
                message: 'Syncing has been added to the queue. You\'ll be notified after completion.'
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

            dataService.getData('/integration/conflicts', {}, function (result) {
                if (result && Object.keys(result).length) {
                    $thisEl.find('.resConflicts').removeClass('hidden');
                }

                self.conflicts = result;
            });
        }
    });

    return Integrations;
});
