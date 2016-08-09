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
            this.map = {};

            this.render();
            this.selectStage();
        },

        updateCurrentUser: function (options, callback) {
            var userModel;
            var currentUser = App.currentUser;

            if (App.currentUser.imports) {
                for (var i in options) {
                    App.currentUser.imports[i] = options[i];
                }
            } else {
                App.currentUser.imports = options;
            }


            userModel = new UserModel(currentUser);

            userModel.save({
                imports: App.currentUser.imports
            }, {
                validate: false,
                patch   : true,
                success : function () {

                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                }
            });
        },

        selectStage: function (e) {
            var data;
            var $target;
            var url = '/importFile/preview';
            var self = this;

            if (e) {
                $target = $(e.target);
                e.preventDefault();

                if ($target.hasClass('left')) {
                    --this.stage;

                } else {
                    ++this.stage;
                }
            }

            this.fileName = App.currentUser && App.currentUser.imports && App.currentUser.imports.fileName;
            this.timeStamp = App.currentUser && App.currentUser.imports && App.currentUser.imports.timeStamp;

            if (this.childView) {
                this.childView.undelegateEvents();
            }

            if (this.stage === 1) {
                this.childView = new UploadView({fileName: this.fileName});

                if (this.timeStamp) {
                    this.enabledNextBtn();
                }

                this.updateCurrentUser({
                    fileName: this.fileName,
                    stage   : this.stage
                });

                this.listenTo(this.childView, 'uploadCompleted', this.enabledNextBtn);

            } else if (this.stage === 2) {
                this.childView = new MappingContentView({
                    timeStamp: this.timeStamp,
                    fileName : this.fileName
                });

                this.updateCurrentUser({
                    stage: this.stage
                });
            } else if (this.stage === 3) {

                if (this.childView) {
                    data = this.childView.getDataWithFields();
                    data.timeStamp = this.timeStamp;
                    this.map = data;

                    this.updateCurrentUser({
                        stage: this.stage,
                        map  : this.map
                    }, function () {
                        self.childView = new PreviewView({timeStamp: self.timeStamp});
                    });
                } else {
                    this.childView = new PreviewView({timeStamp: this.timeStamp});

                }

            }

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
