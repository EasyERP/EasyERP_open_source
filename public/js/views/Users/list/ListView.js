define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Users/list/ListHeader.html',
    'views/Users/CreateView',
    'views/Users/list/ListItemView',
    'views/Users/EditView',
    'collections/Users/filterCollection',
    'dataService'
], function ($, _, ListViewBase, listTemplate, CreateView, ListItemView, EditView, ContentCollection) {
    'use strict';

    var UsersListView = ListViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: ContentCollection,
        contentType      : 'Users', // needs in view.prototype.changeLocationHash
        formUrl          : '#easyErp/Users/form/',

        events: {
            'click .list td:not(.notForm, .checkbox)': 'gotoEditDialog'
        },

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

        gotoEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = this.collection.getElement(id);

            if (!model) {
                return;
            }


            App.ownContentType = true;

            return new EditView({model: model});
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
