define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/contractJobs/list/ListHeader.html',
    'views/contractJobs/list/ListItemView',
    'collections/contractJobs/filterCollection'
], function ($, _, ListViewBase, listTemplate, ListItemView, contentCollection) {
    'use strict';
    var EmployeesListView = ListViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        hasPagination    : true,
        contentType      : 'contractJobs',

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;

            this.filter = options.filter;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            ListViewBase.prototype.initialize.call(this, options);
        },

        render: function () {
            var $currentEl;

            $('.ui-dialog ').remove();
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(this.listTemplate));
            $currentEl.append(new this.ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());
        }

    });

    return EmployeesListView;
});
