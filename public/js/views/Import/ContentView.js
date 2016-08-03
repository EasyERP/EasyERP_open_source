define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/ContentTemplate.html',
    'text!templates/Import/importProgress.html',
    'constants',
    'common'
], function (Backbone, $, _, ContentTemplate, ImportProgressTemplate, CONSTANTS, common) {
    'use strict';

    var ContentView = Backbone.View.extend({
        el                    : '#content-holder',
        contentTemplate       : _.template(ContentTemplate),
        importProgressTemplate: _.template(ImportProgressTemplate),

        initialize: function () {
            this.render();
        },

        render: function () {
            var $thisEl = this.$el;
            var $importProgress;
            var $topBar = $('#top-bar');

            $topBar.html('');
            $thisEl.html(this.contentTemplate);
            $importProgress = $thisEl.find('#importProgress')
            $importProgress.html(this.importProgressTemplate);
        }
    });

    return ContentView;
});
