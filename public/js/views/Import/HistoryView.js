define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Import/ImportHistoryTemplate.html', ,
    'constants',
    'dataService',
    'moment'
], function (Backbone, $, _, ListBaseView, HistoryTemplate, CONSTANTS, dataService, moment) {
    'use strict';

    var HistoryView = ListBaseView.extend({
        el             : '#historyBlock',
        historyTemplate: _.template(HistoryTemplate),
        childView      : null,
        hasPagination  : true,


        initialize: function (options) {
            this.collection = options.collection;

            ListBaseView.prototype.initialize.call(this, options);

            this.collection.bind('showMore', this.render, this);
        },

        render: function () {
            var $thisEl = this.$el;

            $thisEl.html(this.historyTemplate({
                history: this.collection.toJSON()
            }));
        }
    });

    return HistoryView;
});
