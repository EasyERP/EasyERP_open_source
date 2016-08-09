define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/ContentTemplate.html',
    'text!templates/Import/importProgress.html',
    'text!templates/Notes/importTemplate.html',
    'models/UsersModel',
    'views/Notes/AttachView',
    'views/Import/uploadView',
    'views/Import/mappingContentView',
    'views/Import/previewContentView',
    'dataService',
    'constants'
], function (Backbone,
             $,
             _,
             ContentTemplate,
             ImportProgressTemplate,
             ImportTemplate,
             UserModel,
             AttachView,
             UploadView,
             MappingContentView,
             PreviewView,
             dataService,
             CONSTANTS) {
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

        initialize: function () {
            var usersImport = App.currentUser.imports || {};

            this.timeStamp = usersImport.timeStamp;
            this.fileName = usersImport.fileName;
            this.stage = usersImport.stage || 1;

            this.render();
            this.selectStage();
        },

        selectStage: function (e) {
            var $thisEl = this.$el;
            var currentUser = App.currentUser;
            var stageSelector;
            var userModel;
            var data;
            var stage;
            var $target;
            var url = '/importFile/imported';
            var fields;


            if (e) {
                $target = $(e.target);
                e.preventDefault();

                if ($target.hasClass('left')) {
                    --this.stage;

                } else {
                    ++this.stage;
                }
            }

            if (this.childView) {
                this.childView.undelegateEvents();
            }

            if (this.stage === 1) {
                this.childView = new UploadView({fileName: this.fileName});

                if (this.timeStamp) {
                    this.enabledNextBtn();
                }

                this.listenTo(this.childView, 'uploadCompleted', this.enabledNextBtn);

            } else if (this.stage === 2) {
                this.childView = new MappingContentView({
                    timeStamp: this.timeStamp,
                    fileName : this.fileName
                });
            } else if (this.stage === 3) {

                if (this.childView) {
                    data = this.childView.getDataWithFields();
                }

                fields = data;

                dataService.postData(url, data, function (err, data) {
                   /* if (err) {
                        App.render({
                            type   : 'error',
                            message: err
                        });

                        return;
                    }*/

                    new PreviewView({data: fields});
                });
            }

            if (currentUser.imports) {
                App.currentUser.imports.stage = this.stage;
            } else {
                App.currentUser.imports = {
                    stage    : this.stage,
                    timeStamp: this.timeStamp,
                    fileName : this.fileName
                };
            }

            userModel = new UserModel(currentUser);

            userModel.save({
                imports: App.currentUser.imports
            }, {
                validate: false,
                patch   : true
            });

            this.changeStage(this.stage);
        },

        changeStage: function (stage) {
            var $thisEl = this.$el;
            var stageSelector;

            $thisEl.find('.tabListItem').removeClass('active');

            for (var i = 1; i <= stage; i++) {
                stageSelector = '.stage' + i;
                $thisEl.find(stageSelector).addClass('active');
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
