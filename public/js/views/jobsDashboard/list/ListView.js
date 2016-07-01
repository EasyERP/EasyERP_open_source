define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/jobsDashboard/DashboardHeader.html',
    'collections/Jobs/filterCollection',
    'views/jobsDashboard/list/ListItemView',
    'views/Projects/projectInfo/journalEntriesForJob/dialogView',
    'constants'
], function ($, _, ListViewBase, DashboardHeader, JobsCollection, ListItemView, ReportView, CONSTANTS) {
    'use strict';
    var ContentView = ListViewBase.extend({
        page             : null,
        sort             : null,
        listTemplate     : DashboardHeader,
        ListItemView     : ListItemView,
        contentType      : CONSTANTS.JOBSDASHBOARD, // needs in view.prototype.changeLocationHash
        changedModels    : {},
        contentCollection: JobsCollection,
        exportToXlsxUrl  : '/jobs/exportToXlsx/',
        hasPagination    : true,

        events: {
            'click .jobs': 'showReport'
        },

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.filter = options.filter || {};
            this.sort = options.sort || {};
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;

            ListViewBase.prototype.initialize.call(this, options);
        },

        showReport: function (e) {
            var el = $(e.target);
            var id = el.attr('data-id');

            return new ReportView({_id: id});
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

            // this.renderFilter();
            // this.renderPagination($currentEl, this);

            // $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

            return this;
        }
    });

    return ContentView;
});
