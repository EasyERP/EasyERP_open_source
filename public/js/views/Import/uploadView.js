define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/uploadTemplate.html',
    'text!templates/Notes/importTemplate.html',
    'views/Notes/AttachView',
    'constants'
], function (Backbone, $, _, UploadTemplate, ImportTemplate, AttachView, CONSTANTS) {
    'use strict';

    var ContentView = Backbone.View.extend({
        import         : true,
        contentType    : CONSTANTS.IMPORT,
        contentTemplate: _.template(UploadTemplate),
        importTemplate : _.template(ImportTemplate),
        childView      : null,
        el             : '#contentBlock',

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

            this.listenTo(importFile, 'uploadCompleted', function (){
                alert('file is loaded!!!');
                this.trigger('uploadCompleted');
            });
        },

        render: function () {
            this.$el.html(this.contentTemplate);
        }
    });

    return ContentView;
});
