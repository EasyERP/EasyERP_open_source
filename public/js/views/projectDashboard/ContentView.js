define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/projectDashboard/DashboardTemplate.html',
    'text!templates/projectDashboard/ProjectDashboard.html',
    'collections/Projects/projectInfoCollection',
    'custom',
    'dataService',
    'helpers'
], function (Backbone, $, _, DashboardTemplate, projectTemplate, contentCollection, custom, dataService, helpers) {
    var ContentView = Backbone.View.extend({
        contentType: 'Dashboard',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',
        initialize : function (options) {
            this.startTime = options.startTime;
            this.render();
        },

        events: {
            'click .choseDateRange .item': 'newRange',
            'click .oe_sortable'         : 'goSort'
        },

        goSort: function (e) {
            var target$;
            var currentParrentSortClass;
            var sortClass;
            var sortConst;
            var sortBy;
            var sortObject;

            this.collection.unbind('reset');

            target$ = $(e.target).closest('th');
            currentParrentSortClass = target$.attr('class');
            sortClass = currentParrentSortClass.split(' ')[1];
            sortConst = 1;
            sortBy = target$.data('sort');
            sortObject = {};

            if (!sortClass) {
                target$.addClass('sortUp');
                sortClass = 'sortUp';
            }
            switch (sortClass) {
                case 'sortDn':
                    target$.parent().find('th').removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                    break;
                case 'sortUp':
                    target$.parent().find('th').removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
                    break;
                // skip default;
            }
            sortObject[sortBy] = sortConst;

            this.fetchSortCollection(sortObject);
        },

        fetchSortCollection: function (sortObject) {
            this.sort = sortObject;
            this.collection = new contentCollection({
                sort: sortObject
            });
            this.collection.bind('reset', this.renderContent, this);
        },

        populateProjectForDashboard: function (url, callback) {
            dataService.getData(url, {}, function (response) {
                if (callback) {
                    callback(response);
                }
            });
        },

        renderProjectPM: function () {
            var template = _.template(projectTemplate);

            if (App.cashedData && App.cashedData.projectInfo) {
                this.collection = custom.retriveFromCash('projectInfo');

                $('#ProjectPMContent').html(template({
                    collection      : this.collection.toJSON(),
                    startNumber     : 0,
                    currencySplitter: helpers.currencySplitter,
                    weekSplitter    : helpers.weekSplitter
                }));
                if (this.collection.length === 0) {
                    $('.projectInProgress').hide();
                } else {
                    $('.projectInProgress').show();
                }
            } else {
                this.collection = new contentCollection({});

                custom.cacheToApp('projectInfo', this.collection);
            }

            this.collection.bind('reset', this.renderContent, this);
        },

        renderContent: function () {
            var template = _.template(projectTemplate);

            custom.cacheToApp('projectInfo', this.collection);

            $('#ProjectPMContent').html(template({
                collection      : this.collection.toJSON(),
                startNumber     : 0,
                currencySplitter: helpers.currencySplitter,
                weekSplitter    : helpers.weekSplitter
            }));

            if (this.collection.length === 0) {
                $('.projectInProgress').hide();
            } else {
                $('.projectInProgress').show();
            }
        },

        render: function () {
            this.$el.html(this.template());
            this.renderProjectPM();
            this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
        }
    });
    return ContentView;
});
