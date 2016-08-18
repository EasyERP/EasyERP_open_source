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
            this.keys = [
                'date',
                'fileName',
                'filePath',
                'user',
                'type',
                'status',
                'reportFile',
                'reportFileName'
            ];

            this.headers = {
                date: 'Date of import',
                fileName: 'Source File',
                user: 'User',
                type: 'Type',
                status: 'Status',
                reportFileName: 'Skipped file'
            };

            this.collection = options.collection;

            ListBaseView.prototype.initialize.call(this, options);

            this.collection.bind('showMore', this.render, this);
        },

        render: function () {
            var $thisEl = this.$el;
            var itemView;

            $thisEl.html(this.historyTemplate({
                history: this.collection.toJSON(),
                keys: this.keys,
                headers: this.headers
            }));

            itemView = new this.ListItemView({
                collection: this.collection,
                keys: this.keys
            });

            itemView.render();
        }
    });

    return HistoryView;
});
