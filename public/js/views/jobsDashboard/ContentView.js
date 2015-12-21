/**
 * Created by lilya on 09/11/15.
 */
define([
        'views/listViewBase',
        "text!templates/jobsDashboard/DashboardHeader.html",
        "text!templates/jobsDashboard/DashboardTemplate.html",
        "text!templates/jobsDashboard/FooterDashboard.html",
        'collections/Projects/projectInfoCollection',
        'collections/salesQuotation/filterCollection',
        'collections/Jobs/filterCollection',
        'views/Filter/FilterView',
        "custom",
        "dataService",
        "helpers",
        "async"
    ],
    function (listViewBase, DashboardHeader, DashboardTemplate, FooterDashboard, contentCollection, QuotationCollection, JobsCollection, FilterView, custom, dataService, helpers, async) {
        var ContentView = Backbone.View.extend({
            contentType: "Dashboard",
            actionType : "Content",
            viewType   : "list",
            filterView : FilterView,
            template   : _.template(DashboardHeader),
            el         : '#content-holder',

            initialize: function (options) {
                this.startTime = options.startTime;
                this.filter = options.filter;

                this.render();
            },

            events: {
                "click .oe_sortable": "goSort"
            },

            showFilteredPage: function (filter, context) {
                var url = '#easyErp/jobsDashboard';

                this.filter = Object.keys(filter).length === 0 ? {} : filter;

                if (this.filter) {
                    url += '/filter=' + encodeURIComponent(JSON.stringify(this.filter));

                    Backbone.history.navigate(url);
                }

                context.collection = new JobsCollection({
                    viewType: 'list',
                    filter  : filter
                });
            },

            renderFilter: function (self, baseFilter) {
                self.filterView = new this.filterView({
                    contentType: self.contentType
                });

                self.filterView.bind('filter', function (filter) {
                    if (baseFilter) {
                        filter[baseFilter.name] = baseFilter.value;
                    }
                    self.showFilteredPage(filter, self)
                });
                self.filterView.bind('defaultFilter', function () {
                    if (baseFilter) {
                        filter[baseFilter.name] = baseFilter.value;
                    }
                    self.showFilteredPage({}, self);
                });

                self.filterView.render();

            },

            goSort: function (e) {
                var target$;
                var currentParrentSortClass;
                var sortClass;
                var sortConst;
                var sortBy;
                var sortObject;

                target$ = $(e.target);
                currentParrentSortClass = target$.attr('class');
                sortClass = currentParrentSortClass.split(' ')[1];
                sortConst = 1;
                sortBy = target$.data('sort');
                sortObject = {};

                if (!sortClass) {
                    target$.addClass('sortDn');
                    sortClass = "sortDn";
                }
                switch (sortClass) {
                    case "sortDn":
                    {
                        target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortDn').addClass('sortUp');
                        sortConst = 1;
                    }
                        break;
                    case "sortUp":
                    {
                        target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortUp').addClass('sortDn');
                        sortConst = -1;
                    }
                        break;
                }
                sortObject[sortBy] = sortConst;

                this.fetchSortCollection(sortObject);
            },

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                new JobsCollection({
                    sort    : sortObject,
                    filter  : this.filter,
                    viewType: 'list',
                    forDashboard: true
                });
            },

            //

            getClass: function (job) {
                "use strict";
                return job.payment && job.invoice && job.invoice.paymentInfo.total !== job.payment.paid && job.workflow.name !== 'In Progress' ? 'redBorder' : '';
            },

            renderJobs: function () {
                var self = this;

                this.collection = new JobsCollection({
                    viewType: 'list',
                    filter  : this.filter,
                    forDashboard: true
                });

                this.collection.bind('reset', renderContent);

                function renderContent(models) {
                    var template = _.template(DashboardTemplate);

                    self.$el.find('#jobsContent').html(template({
                        collection      : models.toJSON(),
                        currencySplitter: helpers.currencySplitter,
                        getClass        : self.getClass
                    }));
                }
            },

            render: function () {
                var filter = this.filter;
                var url = '#easyErp/jobsDashboard';
                this.$el.html(this.template());

                this.renderJobs();

                this.renderFilter(this);

                if (filter) {
                    url += '/filter=' + encodeURIComponent(JSON.stringify(filter));

                    Backbone.history.navigate(url);
                }

                this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                return this;
            }
        });
        return ContentView;
    }
);
