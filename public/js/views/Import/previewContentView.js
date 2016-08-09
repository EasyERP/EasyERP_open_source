define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/PreviewTemplate.html',
    'constants'
], function (Backbone, $, _, PreviewTemplate,  CONSTANTS) {
    'use strict';

    var PreviewView = Backbone.View.extend({
        el                    : '#content-holder',
        previewTemplate       : _.template(PreviewTemplate),
        childView             : null,

        events: {
        },

        initialize: function (options) {
            options = options || {};

            this.fields = options.data;


            this.render();
        },

        render: function () {
            var $thisEl = this.$el;
            var self = this;

            $thisEl.find('#contentBlock').html(this.previewTemplate({
                fields: self.fields
            }));
        }
    });

    return PreviewView;
});