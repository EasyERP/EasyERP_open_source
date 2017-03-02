define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/settingsOverview/MainTemplate.html',
    'views/settingsOverview/orgSettings/ContentView',
    'views/settingsOverview/Accounting/ContentView',
    'views/settingsOverview/productDetails/ContentView',
    'views/settingsOverview/settingsEmployee/ContentView',
    'async',
    'dataService'
], function (Backbone, $, _, mainTemplate, organizationView, accountingView, productDetailsView, settingsEmployeeView, async, dataService) {
    'use strict';

    var ContentView = Backbone.View.extend({
        contentType: 'settingsOverview',
        actionType : 'Content',
        template   : _.template(mainTemplate),
        el         : '#content-holder',

        initialize: function (options) {
            this.startTime = options.startTime;

            this.views = {};

            this.views.organizationView = {
                view       : organizationView,
                redirectRef: '#easyErp/organizationSettings'
            };
            this.views.accountingView = {
                view       : accountingView,
                redirectRef: '#easyErp/Accounts'
            };

            this.views.productsView = {
                view       : productDetailsView,
                redirectRef: '#easyErp/productsSettings'
            };

            this.views.employeesView = {
                view       : settingsEmployeeView,
                redirectRef: '#easyErp/settingsEmployee'
            };

            this.views.usersView = {
                redirectRef: '#easyErp/Users',
                trigger    : true
            };

            this.views.profilesView = {
                redirectRef: '#easyErp/Profiles',
                trigger    : true
            };

            this.views.departmentsView = {
                redirectRef: '#easyErp/Departments',
                trigger    : true
            };

            this.views.workflowsView = {
                redirectRef: '#easyErp/Workflows',
                trigger    : true
            };

            this.views.integrationsView = {
                redirectRef: '#easyErp/integrations',
                trigger    : true
            };

            this.render();
        },

        events: {
            'click .mainSettings': 'chooseDetails'
        },

        selectMenuItem: function (url) {
            var $rootElement = $('#submenuHolder').find('li.root');
            var li;

            $rootElement.find('li.opened').removeClass('opened');
            $rootElement.find('ul.opened').removeClass('opened');
            $rootElement.find('li.active').removeClass('active');
            $rootElement.find('li.selected').removeClass('selected');

            li = $rootElement.find('[href="' + url + '"]').closest('li');

            li.addClass('selected');
            li.closest('ul').closest('li').addClass('active opened');
        },

        chooseDetails: function (e) {
            var $target = $(e.target);
            var $parentDiv = $target.closest('.mainSettings');
            var id = $parentDiv.attr('id');
            var viewObject = this.views[id];
            var View = viewObject.view;
            var url = viewObject.redirectRef;
            var options = viewObject.trigger ? {trigger: true} : {};

            Backbone.history.navigate(url, options);

            $('#content-holder').html('');
            $('#top-bar').hide();

            if (View) {
                this.selectMenuItem(url);
                return new View({});
            }

        },

        render: function () {
            this.$el.html(this.template({
                data: [{
                    _id : 'organizationView',
                    name: 'Organization Profile'
                }, {
                    _id : 'accountingView',
                    name: 'Accounting'
                }, {
                    _id : 'productsView',
                    name: 'Products Configurations'
                }, {
                    _id : 'employeesView',
                    name: 'Employees Details'
                }, {
                    _id : 'profilesView',
                    name: 'Access Profiles'
                }, {
                    _id : 'usersView',
                    name: 'System Users'
                }, {
                    _id : 'departmentsView',
                    name: 'Departments'
                }, {
                    _id : 'workflowsView',
                    name: 'Workflows'
                }, {
                    _id : 'integrationsView',
                    name: 'Integrations'
                }]
            }));

            $('#top-bar').show();

            return this;
        }

    });

    return ContentView;
});

