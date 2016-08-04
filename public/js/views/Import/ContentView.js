define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/ContentTemplate.html',
    'text!templates/Import/importProgress.html',
    'text!templates/Notes/importTemplate.html',
    'views/Notes/AttachView',
    'views/Import/uploadView',
    'views/Import/mappingContentView',
    'constants'
], function (Backbone, $, _, ContentTemplate, ImportProgressTemplate, ImportTemplate, AttachView, UploadView, MappingContentView, CONSTANTS) {
    'use strict';

    var ContentView = Backbone.View.extend({
        import                : true,
        contentType           : CONSTANTS.IMPORT,
        el                    : '#content-holder',
        contentTemplate       : _.template(ContentTemplate),
        importTemplate        : _.template(ImportTemplate),
        importProgressTemplate: _.template(ImportProgressTemplate),
        childView             : null,

        events: {
            'click .importBtn'   : 'importFile',
            'change .inputAttach': 'importFiles',
            'click .stageBtn'    : 'selectStage'
        },

        initialize: function (options) {
            options = options || {};

            this.stage = options.stage || 1;
            this.render();
            this.selectStage(this.stage);
        },

        selectStage: function (e) {
            var stage;


            if (e.hasOwnProperty('target')) {
                e.preventDefault();

                stage = ++this.stage;
            } else {
                stage = e;
            }

            if (this.childView) {
                this.childView.undelegateEvents();
            }

            if (stage === 1) {
                this.childView = new UploadView();
                this.listenTo(this.childView, 'uploadCompleted', this.enabledNextBtn);

            } else if (stage === 2) {
                this.childView = new MappingContentView();
            }

        },

        enabledNextBtn: function () {
            this.$el.find('.stageBtn').prop('disabled', false);
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
