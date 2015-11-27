/**
 * Created by lilya on 09/11/15.
 */
define([
        "text!templates/jobsDashboard/DashboardHeader.html",
        "text!templates/jobsDashboard/DashboardTemplate.html",
        "text!templates/jobsDashboard/FooterDashboard.html",
        'collections/Projects/projectInfoCollection',
        'collections/salesQuotation/filterCollection',
        'collections/Jobs/filterCollection',
        "custom",
        "dataService",
        "helpers",
        "async"
    ],
    function (DashboardHeader, DashboardTemplate, FooterDashboard, contentCollection, QuotationCollection, JobsCollection, custom, dataService, helpers, async) {
        var ContentView = Backbone.View.extend({
            contentType: "Dashboard",
            actionType : "Content",
            template   : _.template(DashboardHeader),
            el         : '#content-holder',
            initialize : function (options) {
                this.startTime = options.startTime;

                this.render();
            },

            events: {
                //"click .choseDateRange .item": "newRange",
                "click .oe_sortable": "goSort",
                "click #project"    : "showJobs"
            },

            showJobs: function (e) {
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
                this.collection = new JobsCollection({
                    sort: sortObject,
                    joinWithQuotation: true
                });

                this.collection.bind('reset', this.renderContent, this);
            },

            renderJobs: function () {
                var self = this;
                var template = _.template(DashboardTemplate);
                var footer = _.template(FooterDashboard);

                function fetchQuotations(cb){
                    var quotationCollection = new QuotationCollection({
                        count      : 50,
                        viewType   : 'list',
                        contentType: 'salesQuotation'
                    });

                    quotationCollection.bind('reset', sendCB);

                    function sendCB(){
                        cb(null, quotationCollection);
                    }
                };

                function fetchJobs(cb){
                    var jobsCollection = new JobsCollection({
                        viewType: 'list',
                        joinWithQuotation: true
                    });

                    jobsCollection.bind('reset', sendCB);

                    function sendCB(){
                        cb(null, jobsCollection);
                    }
                };

                async.parallel([fetchJobs], function(err, result){
                    self.collection = result[0];
                   // self.quotationCollection = result[0];

                    self.$el.find('#jobsContent').html(template({
                        collection         : self.collection.toJSON(),
                       // quotationCollection: self.quotationCollection.toJSON(),
                        startNumber        : 0,
                        currencySplitter   : helpers.currencySplitter
                    }));

                    //self.$el.find('#footer').html(footer({
                    //    collection      : self.collection.toJSON(),
                    //    currencySplitter: helpers.currencySplitter
                    //}));
                });
            },

            renderContent: function () {
                var self = this;
                var template = _.template(DashboardTemplate);

                self.$el.find('#jobsContent').html(template({
                    collection         : self.collection.toJSON(),
                    quotationCollection: self.quotationCollection.toJSON(),
                    startNumber        : 0,
                    currencySplitter   : helpers.currencySplitter
                }));
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
