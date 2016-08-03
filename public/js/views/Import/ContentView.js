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
            /*var progressStatuses = [
                {name: "1", status: "1"},
                {name: "2", status: "2"},
                {name: "3", status: "3"}
            ];

            $importProgress.html(this.importProgressTemplate({
                import: progressStatuses
            }));*/
        }
    });
    return ContentView;
});