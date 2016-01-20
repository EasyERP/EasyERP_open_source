/**
 * Created by liliy on 20.01.2016.
 */
define([
        "Backbone",
        "jQuery",
        "Underscore",
        'views/listViewBase',
        "text!templates/jobsDashboard/DashboardHeader.html",
        "text!templates/jobsDashboard/DashboardTemplate.html",
        'collections/Jobs/filterCollection',
        'views/Filter/FilterView',
        'views/jobsDashboard/list/ListItemView',
        "constants"
    ],
    function (Backbone, $, _, listViewBase, DashboardHeader, DashboardTemplate, JobsCollection, FilterView, ListItemView, CONSTANTS) {
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

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.filter = options.filter ? options.filter : {};
                this.sort = options.sort ? options.sort : {};
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
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