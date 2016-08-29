define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/PreviewTemplate.html',
    'constants',
    'constants/mappingFields',
    'dataService'
], function (Backbone, $, _, PreviewTemplate, CONSTANTS, mappingFields, dataService) {
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
                self.data.keys.reverse();

                self.render();
            });
        },

        render: function () {
            var $thisEl = this.$el;

            $thisEl.html(this.previewTemplate({
                fields: this.data,
                mappingFields: mappingFields
            }));
        }
    });

    return PreviewView;
});