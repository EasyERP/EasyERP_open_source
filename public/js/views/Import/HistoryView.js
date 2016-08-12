define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/Import/ListItemView',
    'text!templates/Import/ImportHistoryTemplate.html',
    'constants',
    'dataService',
    'moment'
], function (Backbone, $, _, ListBaseView, ListItemView, HistoryTemplate, CONSTANTS, dataService, moment) {
    'use strict';

    var HistoryView = ListBaseView.extend({
        el             : '#historyBlock',
        historyTemplate: _.template(HistoryTemplate),
        childView      : null,
        contentType      : CONSTANTS.IMPORT,
        hasPagination  : true,
        ListItemView   : ListItemView,

        initialize: function (options) {
            this.collection = options.collection;

            ListBaseView.prototype.initialize.call(this, options);

            this.collection.bind('showMore', this.render, this);
        },

        render: function () {
            var $thisEl = this.$el;
            var itemView;

            $thisEl.html(this.historyTemplate({
                history: this.collection.toJSON()
            }));

            itemView = new this.ListItemView({
                collection: this.collection
            });

            itemView.render();
        }
    });

    return HistoryView;
});
