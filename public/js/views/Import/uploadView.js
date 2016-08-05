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
            var $thisEl = this.$el;

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
            var $thisEl = this.$el;

            $thisEl.html(this.contentTemplate);
            $thisEl.on('drop', function(e){
                    var importFile = new AttachView({el: "#forImport"});
                    if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length){
                        e.preventDefault();
                        e.stopPropagation();
                        importFile.sendToServer(e, null, this, true, e.originalEvent.dataTransfer.files);
                    }

                }
            );

            $thisEl.on('dragover', function(e){
                //console.log('DRAG OVER');
                e.preventDefault();
                e.stopPropagation();
            });

            $thisEl.on('dragenter', function(e){
                //console.log('DRAG ENTER');
                e.preventDefault();
                e.stopPropagation();
            });
        }
    });

    return ContentView;
});
