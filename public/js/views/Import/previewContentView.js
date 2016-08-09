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

        events: {
            'click .mrgBut': 'checkRadio'
        },

        initialize: function (options) {
            var self = this

            options = options || {};
            this.timeStamp = options.timeStamp;

            dataService.getData(url, {timeStamp: this.timeStamp}, function (err, data) {
                self.data = data;
                this.render();
            });
        },

        checkRadio: function (e) {
            var $target = $(e.target).find('input');

            $target[0].checked = true;
        },

        render: function () {
            var $thisEl = this.$el;

            $thisEl.find('#contentBlock').html(this.previewTemplate({
                fields: this.data
            }));
        }
    });

    return PreviewView;
});