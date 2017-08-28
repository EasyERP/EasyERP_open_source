define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/invoiceAging/list/ListHeader.html',
    'views/invoiceAging/list/ListItemView',
    'collections/invoiceAging/filterCollection',
    'views/guideTours/guideNotificationView',
    'constants'
], function ($, _, listViewBase, listTemplate, ListItemView, contentCollection, GuideNotify,
             CONSTANTS) {
    'use strict';

    var ListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : CONSTANTS.INVOICEAGING, // 'invoiceAging',

        initialize: function (options) {
            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            this.render();
        },

        events: {},

        render: function () {
            var $currentEl;
            var itemView;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            itemView = new ListItemView({
                collection : this.collection,
                itemsNumber: this.collection.namberToShow
            });
            itemView.bind('incomingStages', this.pushStages, this);

            $currentEl.append(itemView.render()); // added two parameters page and items number

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        }

    });

    return ListView;
});
