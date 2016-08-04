define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/ContentTemplate.html',
    'text!templates/Import/importProgress.html',
    'text!templates/Notes/importTemplate.html',
    'views/Notes/AttachView',
    'views/Import/mappingContentView',
    'constants',
    'common'
], function (Backbone, $, _, ContentTemplate, ImportProgressTemplate, ImportTemplate, AttachView, MappingContentView, CONSTANTS, common) {
    'use strict';

    var ContentView = Backbone.View.extend({
        import                : true,
        contentType           : CONSTANTS.IMPORT,
        el                    : '#content-holder',
        contentTemplate       : _.template(ContentTemplate),
        importTemplate        : _.template(ImportTemplate),
        importProgressTemplate: _.template(ImportProgressTemplate),
        childView: null,

        events: {
            'click .importBtn'   : 'importFile',
            'change .inputAttach': 'importFiles'
        },

        initialize: function () {
            this.render();
        },

        importFile: function (e) {
            var $thisEl = this.$el;
            e.preventDefault();

            $thisEl.find('#forImport').html(this.importTemplate);
            $thisEl.find('#inputAttach').click();
        },

        importFiles: function (e) {
            var importFile = new AttachView({el: '#forImport'});
            importFile.sendToServer(e, null, this);
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
        }
    });

    return ContentView;
});
