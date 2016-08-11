define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Import/ImportHistoryTemplate.html',
    'collections/Import/importHistoryCollection',
    'helpers/eventsBinder',
    'constants',
    'dataService',
    'moment'
], function (Backbone, $, _, ListBaseView, HistoryTemplate, ImportHistoryCollection, eventsBinder, CONSTANTS, dataService, moment) {
    'use strict';

    var HistoryView = ListBaseView.extend({
        el             : '#historyBlock',
        historyTemplate: _.template(HistoryTemplate),
        childView      : null,
        hasPagination  : true,


        initialize: function () {
            this.importHistoryCollection = new ImportHistoryCollection({
                reset: true});

            ListBaseView.prototype.initialize.call(this, {
                startTime: this.importHistoryCollection.startTime
            });

            this.importHistoryCollection.fetch({
                success: function(err, result) {
                    self.render();
                },
                error: function(xhr){
                    console.log(xhr);
                }
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