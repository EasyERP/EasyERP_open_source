define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Users/list/ListHeader.html',
    'views/Users/CreateView',
    'views/Users/list/ListItemView',
    'collections/Users/filterCollection',
    'dataService'
], function ($, _, ListViewBase, listTemplate, CreateView, ListItemView, ContentCollection) {
    'use strict';

    var UsersListView = ListViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: ContentCollection,
        contentType      : 'Users', // needs in view.prototype.changeLocationHash
        formUrl          : '#easyErp/Users/form/',

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;
            this.sort = options.sort;
            this.contentCollection = ContentCollection;

            this.render();
        },

        render: function () {
            var $currentEl;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());

            this.renderPagination($currentEl, this);

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        }

    });

    return UsersListView;
});
