/**
 * Created by lilya on 09/11/15.
 */
define([
        "text!templates/jobsDashboard/DashboardHeader.html",
        "text!templates/jobsDashboard/DashboardTemplate.html",
        "text!templates/jobsDashboard/FooterDashboard.html",
        'collections/Projects/projectInfoCollection',
        "custom",
        "dataService",
        "helpers"
    ],
    function (DashboardHeader, DashboardTemplate, FooterDashboard, contentCollection, custom, dataService, helpers) {
        var ContentView = Backbone.View.extend({
            contentType: "Dashboard",
            actionType: "Content",
            template: _.template(DashboardHeader),
            el: '#content-holder',
            initialize: function (options) {
                this.startTime = options.startTime;

                this.render();
            },

            events: {
                //"click .choseDateRange .item": "newRange",
                "click .oe_sortable": "goSort",
                "click #project": "showJobs"
            },

            showJobs: function(e){
                var target = e.target;
                var projectId = $(target).parents("tr").attr("data-id");
                var subId = "subRow" + projectId;
                var subRowCheck = $('.' + subId);
                var jobContainer = $(target).parents("tr");
                var icon = $(jobContainer).find('.expand');


                if (icon.html() === '-') {
                    icon.html('+');
                    $(subRowCheck).hide();
                } else {
                    icon.html('-');
                    $(subRowCheck).show();
                }

            },

            goSort: function (e) {
                var target$;
                var currentParrentSortClass;
                var sortClass;
                var sortConst;
                var sortBy;
                var sortObject;

                this.collection.unbind('reset');

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
                this.collection = new contentCollection({
                    sort: sortObject
                });

                this.collection.bind('reset', this.renderContent, this);
            },

            renderJobs: function () {
                var template = _.template(DashboardTemplate);
                var footer = _.template(FooterDashboard);

                if (App.cashedData && App.cashedData.projectInfo) {
                    this.collection = custom.retriveFromCash('projectInfo');

                    this.$el.find('#jobsContent').html(template({
                        collection: this.collection.toJSON(),
                        startNumber: 0,
                        currencySplitter: helpers.currencySplitter
                    }));

                    this.$el.find('#footer').html(footer({
                        collection: this.collection.toJSON(),
                        currencySplitter: helpers.currencySplitter,
                    }))
                } else {
                    this.collection = new contentCollection({});

                    custom.cacheToApp('projectInfo', this.collection);
                }

                this.collection.bind('reset', this.renderContent, this);
            },

            renderContent: function () {
                var template = _.template(DashboardTemplate);
                var footer = _.template(FooterDashboard);

                custom.cacheToApp('projectInfo', this.collection);

                this.$el.find('#jobsContent').html(template({
                    collection: this.collection.toJSON(),
                    startNumber: 0,
                    currencySplitter: helpers.currencySplitter
                }));

                this.$el.find('#footer').html(footer({
                    collection: this.collection.toJSON(),
                    currencySplitter: helpers.currencySplitter,
                }))

            },

            render: function () {
                this.$el.html(this.template());

                this.renderJobs();

                this.$el.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                return this;
            }
        });
        return ContentView;
    }
);
