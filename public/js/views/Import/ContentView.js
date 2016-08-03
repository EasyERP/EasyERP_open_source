define([
    'Backbone',
    'Underscore',
    'text!templates/Import/ContentTemplate.html',
    'text!templates/Import/importProgress.html',
    'constants',
    'common'
], function (Backbone, _, ContentTemplate, ImportProgressTemplate, CONSTANTS, common) {
    'use strict';

    var ContentView = Backbone.View.extend({
        el        : '#import-content-holder',
        contentTemplate  : _.template(ContentTemplate),
        importProgressTemplate: _.template(ImportProgressTemplate),
        initialize: function (options) {
            this.render();
        },

        render: function () {
            var $thisEl = this.$el;
            var $contentBlock = $thisEl.find('#contentBlock');
            var $importProgress = $thisEl.find('#importProgress');

            $importProgress.html();
        }
    });
    return ContentView;
});