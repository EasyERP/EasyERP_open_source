define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Import/ImportHistoryTemplate.html',
    'collections/Import/importHistoryCollection',
    'constants',
    'dataService',
    'moment'
], function (Backbone, $, _, ListBaseView, HistoryTemplate, ImportHistoryCollection, CONSTANTS, dataService, moment) {
    'use strict';

    var HistoryView = ListBaseView.extend({
        el             : '#historyBlock',
        historyTemplate: _.template(HistoryTemplate),
        childView      : null,

        initialize: function () {
            this.importHistoryCollection = new ImportHistoryCollection({
                reset: true
            });

            this.importHistoryCollection.bind('reset', this.render, this);
        },

        render: function () {
            var $thisEl = this.$el;


            $thisEl.html(this.historyTemplate({
                history: this.importHistoryCollection.toJSON()
            }));
        }
    });

    return HistoryView;
});