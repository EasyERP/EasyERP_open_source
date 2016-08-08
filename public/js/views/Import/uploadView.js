define([
    'Backbone',
    'jQuery',
    'Underscore',
    'models/UsersModel',
    'text!templates/Import/uploadTemplate.html',
    'text!templates/Notes/importTemplate.html',
    'views/Notes/AttachView',
    'constants'
], function (Backbone, $, _, UserModel, UploadTemplate, ImportTemplate, AttachView, CONSTANTS) {
    'use strict';

    var ContentView = Backbone.View.extend({
        import         : true,
        contentType    : CONSTANTS.IMPORT,
        contentTemplate: _.template(UploadTemplate),
        importTemplate : _.template(ImportTemplate),
        childView      : null,
        el             : '#contentBlock',
        importView     : null,

        events: {
            'click .importBtn'   : 'importFile',
            'change .inputAttach': 'importFiles'
        },

        initialize: function (options) {
            var $thisEl = this.$el;
            this.fileName = options.fileName

            this.render();

            $thisEl.find('#forImport').html(this.importTemplate);
        },

        importFile: function (e) {
            var $thisEl = this.$el;
            e.preventDefault();

            $thisEl.find('#inputAttach').click();

        },

        importFiles: function (e) {
            var timeStamp = +(new Date());
            var currentUser = App.currentUser;
            var $thisEl = this.$el;
            var fileName;
            var userModel;
            var importObj;

            if (this.importView) {
                this.importView.undelegateEvents();
            }

            fileName = $thisEl.find('#inputAttach')[0].files[0].name;

            importObj = {
                fileName : fileName,
                timeStamp: +timeStamp
            };

            this.timeStamp = +timeStamp;
            userModel = new UserModel(currentUser);

            userModel.save({
                imports: importObj
            }, {
                patch   : true,
                validate: false
            });

            App.currentUser.imports = importObj;
            this.importView = new AttachView({el: '#forImport', timeStamp: timeStamp});

            this.importView.sendToServer(e, null, this);

            $thisEl.find('.attachFileName span').html($thisEl.find('#inputAttach')[0].files[0].name);

            this.listenTo(this.importView, 'uploadCompleted', function () {
                this.trigger('uploadCompleted');
            });


        },

        render: function () {
            var $thisEl = this.$el;
            $thisEl.html(this.contentTemplate({fileName: this.fileName}));
            $thisEl.find('.importContainer').on('drop', function (e) {
                    if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
                        e.preventDefault();
                        e.stopPropagation();

                        $thisEl.find('#inputAttach').empty();
                        $thisEl.find('#inputAttach')[0].files = e.originalEvent.dataTransfer.files;
                    }
                }
            });

            $thisEl.find('.importContainer').on('dragover', function (e) {
                //console.log('DRAG OVER');
                e.preventDefault();
                e.stopPropagation();
            });

            $thisEl.find('.importContainer').on('dragenter', function (e) {
                //console.log('DRAG ENTER');
                e.preventDefault();
                e.stopPropagation();
            });
        }
    });

    return ContentView;
});
