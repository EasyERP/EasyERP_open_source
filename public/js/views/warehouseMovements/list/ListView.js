define([
    'Backbone',
    'jQuery',
    'Underscore',
    'models/CustomReportsModel',
    'views/listViewBase',
    'text!templates/warehouseMovements/list/ListHeader.html',
    'views/warehouseMovements/list/ListItemView',
], function (Backbone,
             $,
             _,
             CustomReportsModel,
             ListViewBase,
             listTemplate,
             ListItemView) {
    'use strict';

    var ContentView = ListViewBase.extend({
        listTemplate: _.template(listTemplate),

        viewType    : 'list',
        contentType : 'warehouseMovements',
        ListItemView: ListItemView,

        initialize: function (options) {
            this.collection = options.collection;
            this.sort = options.sort;
            this.page = options.collection.currentPage;
            this.modelId = options.modelId;

            if (!this.filter) {
                this.filter = {};
            }

            this.filter.date = {
                value: [this.collection.startDate, this.collection.endDate]
            };

            App.filtersObject.filter = this.filter;

            ListViewBase.prototype.initialize.call(this, options);
        },

        changeDateRange: function (dateArray) {
            var searchObject;

            if (!this.filter) {
                this.filter = {};
            }

            this.filter.date = {
                value: dateArray
            };

            searchObject = {
                page  : 1,
                filter: this.filter
            };

            this.collection.getFirstPage(searchObject);

            App.filtersObject.filter = this.filter;
        },

        render: function () {
            var $thisEl = this.$el;
            var self = this;
            var itemView;

            $thisEl.html('');
            $thisEl.append(this.listTemplate());

            itemView = new ListItemView({
                collection: this.collection
            });

            $thisEl.append(itemView.render({}));
        }
    });

    return ContentView;
});
