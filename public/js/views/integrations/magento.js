define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Integrations/IntegrationsTemplate.html',
    'text!templates/Integrations/IntMagentoTemplate.html',
    'text!templates/Integrations/IntConflictItems.html',
    'views/selectView/selectView',
    'dataService',
    'helpers/eventsBinder',
    'constants',
    'populate',
    'services/select'
], function (Backbone,
             $,
             _,
             IntegrationsTemplate,
             IntMagentoTemplate,
             IntConflictItems,
             selectView,
             dataService,
             eventsBinder,
             CONSTANTS,
             populate,
             select) {
    'use strict';

    var Integrations = Backbone.View.extend({
        contentType: CONSTANTS.INTEGRATIONS,
        el         : '#content-holder',

        connectionTemplate: _.template(IntegrationsTemplate),
        magentoTemplate   : _.template(IntMagentoTemplate),
        intConflictItems  : _.template(IntConflictItems),

        importLock : false,
        isConflicts: false,
        url        : '/saveIntegrations',

        events: {
            'click #saveBtn'                        : 'saveSettings',
            'click #testConnection'                 : 'testConnection',
            'click #backBtn'                        : 'goToBack',
            'click .dialog-tabs a'                  : 'changeTab',
            'click #importMagentoBtn'               : 'importMagento',
            'click #matchMyProducts'                : 'insertConflicts',
            'click .item'                           : 'checkItem',
            'click #saveChanges'                    : 'saveChanges',
            'click .newSelectList li'               : 'chooseOption',
            'click .current-selected:not(.disabled)': 'showNewSelect',
            'click .conflictBtn'                    : 'conflictUnlock',
            click                                   : 'hideNewSelect'
        },

        hideNewSelect: select.hideNewSelect,

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

        initialize: function () {
            this.responseObj = {};
            this.render();
        },

        goToBack: function () {
            Backbone.history.fragment = '';
            Backbone.history.navigate('easyErp/integrations', {trigger: true});
        },

        conflictUnlock: function (e) {
            var $thisEl = this.$el;
            var self = this;
            var $conflictBlock = $thisEl.find('#conflictItems');
            var $conflictInformation = $thisEl.find('#conflictIntormation');
            var url = '/integration/conflicts';

            if (this.isConflicts) {
                $conflictInformation.html('Loading... Please wait.');
                return;
            }

            dataService.getData(url, {}, function (result) {
                $conflictBlock.html(self.intConflictItems({
                    conflictItems: result
                }));

                if (!result || !result.length) {
                    $conflictInformation.html('Conflicts is not found!');
                }

                self.isConflicts = true;
            });
        },

        saveChanges: function () {
            var $actions = this.$el.find('div[data-sku]');
            var url = 'integration/conflicts';
            var $thisEl = this.$el;
            var conflictBlock = $thisEl.find('#conflictBlock');
            var data = [];
            var $action;

            _.each($actions, function (action) {
                $action = $(action);
                data.push({
                    action: $($action.find('.active')[0]).data('action'),
                    sku   : $action.data('sku')
                });
            });

            dataService.postData(url, {conflicts: data}, function (result) {
                conflictBlock.html('<div id="conflictInformation">Conflict items are not found</div>');
            });
        },

        checkItem: function (e) {
            var $target = $(e.target);
            var $parent = $target.closest('.changeTableCombobox');

            $parent.find('.item').removeClass('active');
            $target.addClass('active');
            $parent.toggleClass('open');
        },

        changeTab: function (e) {
            var $target = $(e.target);
            var closestEl = $target.closest('.dialog-tabs');
            var dataClass = closestEl.data('class') ? '.' + closestEl.data('class') : '';
            var selector = '.dialog-tabs-items' + dataClass;
            var itemActiveSelector = '.dialog-tabs-item' + dataClass + '.active';
            var itemSelector = '.dialog-tabs-item' + dataClass;
            var dialogHolder;
            var n;

            closestEl.find('a.active').removeClass('active');

            $target.addClass('active');

            n = $target.parents('.dialog-tabs').find('li').index($target.parent());
            dialogHolder = this.$el.find(selector);

            dialogHolder.find(itemActiveSelector).removeClass('active');
            dialogHolder.find(itemSelector).eq(n).addClass('active');
        },

        insertConflicts: function () {
            var $thisEl = this.$el;
            var self = this;
            var $conflictBlock = $thisEl.find('#conflictItems');

            dataService.getData(url, {}, function (result) {
                $conflictBlock.html(self.intConflictItems({
                    conflictItems: result
                }));
            });
        },

        importMagento: function () {
            var $thisEl = this.$el;
            var self = this;
            var $statusBlock = $thisEl.find('#statusBlock');

            if (!this.importLock) {
                this.importLock = true;
                $statusBlock.append('<li>All import</li>');
                dataService.getData('/integration/all', {}, function (result) {
                    $statusBlock.append('<li>' + result && result.success + '</li>');

                    self.isConflicts = false;
                });

                setTimeout(function () {
                    self.importLock = false;
                }, 60000);
            }
        },

        testConnection: function () {
            var url = '/testConnection';

            dataService.getData(url, {}, function (result) {
                if (result.success) {
                    return App.render({
                        type   : 'notify',
                        message: result.success
                    });
                }

                App.render({
                    type   : 'error',
                    message: result.error
                });
            });
        },

        saveSettings: function () {
            var $thisEl = this.$el;
            var baseUrl = $thisEl.find('#baseURL').val();
            var username = $thisEl.find('#apiuser').val();
            var password = $thisEl.find('#apipassword').val();
            var warehouse = $thisEl.find('#warehouse').attr('data-id');
            var location = $thisEl.find('#location').attr('data-id');
            var data;
            if (!warehouse || !location) {
                return App.render({
                    type   : 'error',
                    message: 'Please, fill warehouse and location fields'
                });
            }

            data = {
                baseUrl  : baseUrl,
                username : username,
                password : password,
                warehouse: warehouse,
                location : location
            };

            dataService.patchData(this.url, data, function (err, result) {
                if (err) {
                    return App.render({
                        type   : 'error',
                        message: err.statusText
                    });
                }

                App.render({
                    type   : 'notify',
                    message: result.success
                });
            });
        },

        render: function () {
            var $thisEl = this.$el;
            var self = this;
            var id;

            dataService.getData(this.url, {type: 'magento'}, function (result) {
                $thisEl.html(self.magentoTemplate({
                    credentials: result
                }));

                id = $('#warehouse').data('id');
                if (id) {
                    populate.get('#location', 'warehouse/location/getForDd', {warehouse: id}, 'name', self, false);
                }
            });

            populate.get('#warehouse', 'warehouse/getForDD', {}, 'name', this, false);
        }
    });

    return Integrations;
});
