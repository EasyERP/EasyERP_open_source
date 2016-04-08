/**
 * Created by liliy on 20.01.2016.
 */
define([
        "jQuery",
        "Underscore",
        'views/listViewBase',
        "text!templates/jobsDashboard/DashboardHeader.html",
        'collections/Jobs/filterCollection',
        'views/Filter/FilterView',
        'views/jobsDashboard/list/ListItemView',
        'views/Projects/projectInfo/journalEntriesForJob/dialogView',
        "constants"
    ],
    function ($, _, listViewBase, DashboardHeader, JobsCollection, FilterView, ListItemView, ReportView, CONSTANTS) {
        'use strict';
        var ContentView = listViewBase.extend({
            page                    : null,
            sort                    : null,
            listTemplate            : DashboardHeader,
            listItemView            : ListItemView,
            contentType             : CONSTANTS.JOBSDASHBOARD,//needs in view.prototype.changeLocationHash
            changedModels           : {},
            totalCollectionLengthUrl: '/jobs/totalCollectionLength',
            contentCollection       : JobsCollection,
            filterView              : FilterView,

            events: {
                'click .jobs': "showReport"
            },

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.filter = options.filter || {};
                this.sort = options.sort || {};
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            },

            showReport: function (e) {
                var el = $(e.target);
                var id = el.attr('data-id');

                new ReportView({_id: id});

            },

            render: function () {
                var $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(_.template(this.listTemplate));
                $currentEl.append(new ListItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());

                this.renderFilter(this);
                this.renderPagination($currentEl, this);

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                return this;
            }
        });
        return ContentView;
    }
);