define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/cashTransfer/list/ListHeader.html',
    'views/cashTransfer/CreateView',
    'views/cashTransfer/list/ListItemView',
    'models/cashTransferModel',
    'collections/cashTransfer/filterCollection',
    'common',
    'constants'
], function ($,
             _,
             ListViewBase,
             listTemplate,
             CreateView,
             ListItemView,
             CurrentModel,
             contentCollection,
             common,
             CONSTANTS) {
    'use strict';

    var cashTransferListView = ListViewBase.extend({

        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : 'cashTransfer',
        hasPagination    : true,

        events: {
            'click .stageSelect'     : 'showNewSelect',
            'click .newSelectList li': 'chooseOption'
        },

        initialize: function (options) {
            $(document).off('click');
            this.mId = CONSTANTS.MID[this.contentType];
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.stages = [];
            this.filter = options.filter;
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;

            ListViewBase.prototype.initialize.call(this, options);

            this.contentCollection = contentCollection;
        },

        render: function () {
            var $currentEl;
            var itemView;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            itemView = new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            });

            $currentEl.append(itemView.render());
        }

    });
    return cashTransferListView;
});
