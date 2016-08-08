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


            if (App.import && App.import.stage) {
                this.stage = App.import.stage;
            } else {
                this.stage = 1;
            }

            if (e) {
                e.preventDefault();

                ++this.stage;
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
                data = this.childView.goToPreview();

                dataService.postData(url, data, function (err, data) {

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

            stageSelector = '.stage' + this.stage;

            $thisEl.find(stageSelector).addClass('active');
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
