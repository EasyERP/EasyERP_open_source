define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/PreviewTemplate.html',
    'constants',
    'dataService'
], function (Backbone, $, _, PreviewTemplate, CONSTANTS, dataService) {
    'use strict';

    var PreviewView = Backbone.View.extend({
        el             : '#contentBlock',
        previewTemplate: _.template(PreviewTemplate),
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

            $thisEl.html(this.previewTemplate({
                fields: this.data
            }));
        }
    });

    return PreviewView;
});