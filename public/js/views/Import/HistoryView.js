define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/ImportHistoryTemplate.html',
    'constants',
    'dataService'
], function (Backbone, $, _, HistoryTemplate, CONSTANTS, dataService) {
    'use strict';

    var HistoryView = Backbone.View.extend({
        el             : '#contentBlock',
        historyTemplate: _.template(HistoryTemplate),
        childView      : null,

        initialize: function (options) {
            var self = this;
            var url = '/importFile/preview';

            options = options || {};
            this.timeStamp = options.timeStamp;

            dataService.getData(url, {timeStamp: this.timeStamp}, function (data) {
                self.data = data;
                self.render();
            });
        },

        render: function () {
            var $thisEl = this.$el;

            $thisEl.html(this.historyTemplate({
                fields: this.data
            }));
        }
    });

    return HistoryView;
});