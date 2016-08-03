define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/ContentTemplate.html',
    'text!templates/Import/importProgress.html',
    'views/Import/mappingContentView',
    'constants',
    'common'
], function (Backbone, $, _, ContentTemplate, ImportProgressTemplate, MappingContentView, CONSTANTS, common) {
    'use strict';

    var ContentView = Backbone.View.extend({
        el                    : '#content-holder',
        contentTemplate       : _.template(ContentTemplate),
        importProgressTemplate: _.template(ImportProgressTemplate),
        childView: null,

        initialize: function () {
            this.render();
        },

        goToMapping: function () {
            var $thisEl = this.$el;

            this.childView = new MappingContentView();
        },

        render: function () {
            var $thisEl = this.$el;
            var $importProgress;
            var $topBar = $('#top-bar');

            $topBar.html('');
            $thisEl.html(this.contentTemplate);
            $importProgress = $thisEl.find('#importProgress');
            $importProgress.html(this.importProgressTemplate);

            this.goToMapping();
        }
    });

    return ContentView;
});
