define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Import/ContentTemplate.html',
    'text!templates/Import/importProgress.html',
    'text!templates/Notes/importTemplate.html',
    'models/UsersModel',
    'collections/Import/importHistoryCollection',
    'views/Import/HistoryView',
    'views/Notes/AttachView',
    'views/Import/uploadView',
    'views/Import/mappingContentView',
    'views/Import/previewContentView',
    'views/Import/comparingContentView',
    'dataService',
    'helpers/eventsBinder',
    'constants'
], function (Backbone,
             $,
             _,
             ContentTemplate,
             ImportProgressTemplate,
             ImportTemplate,
             UserModel,
             HistoryCollection,
             ImportHistoryView,
             AttachView,
             UploadView,
             MappingContentView,
             PreviewView,
             ComparingView,
             dataService,
             eventsBinder,
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
        historyView           : null,

        events: {
            'click .importBtn'   : 'importFile',
            'change .inputAttach': 'importFiles',
            'click #cancelBtn'   : 'cancelStage',
            'click .stageBtn'    : 'selectStage',
            'click .saveChanges' : 'saveChanges'
        },

        initialize: function (options) {
            var usersImport = App.currentUser.imports || {};

            this.startTime = options.startTime;
            this.timeStamp = usersImport.timeStamp;
            this.fileName = usersImport.fileName;
            this.page = options.page;
            this.count = options.count;
            this.stage = usersImport.stage || 1;
            this.map = {};

            this.$el.find('.stageBtnNext').prop('disabled', true);

            this.render();
            this.selectStage();
        },

        cancelStage: function () {
            App.currentUser.imports = {};
            App.currentUser.checkedComboImport = 'Persons';

            this.stage = 1;

            this.updateCurrentUser({
                stage: this.stage
            });
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

            delete App.currentUser.imports.conflictedItems;
        },

        selectStage: function (e) {
            var $thisEl = this.$el;
            var data;
            var $target;
            var self = this;
            var $nextBtn = this.$el.find('.stageBtnNext');

            if (e) {
                $target = $(e.target);
                e.preventDefault();

                if ($target.hasClass('back')) {
                    this.stage = this.stage > 1 ? --this.stage : 1;

                } else {
                    this.stage = this.stage < 4 ? ++this.stage : 5;
                }
            }

            this.fileName = App.currentUser && App.currentUser.imports && App.currentUser.imports.fileName;
            this.timeStamp = App.currentUser && App.currentUser.imports && App.currentUser.imports.timeStamp;

            if (this.childView) {
                this.childView.undelegateEvents();
            }

            if (this.stage === 1) {
                this.$el.find('.stageBtnBack').hide();
                this.$el.find('#cancelBtn').hide();
                $nextBtn.addClass('btnDisable');
                $nextBtn.prop('disabled', true);
                this.childView = new UploadView({fileName: this.fileName});

                if (this.timeStamp) {
                    this.enabledNextBtn();
                }

                this.listenTo(this.childView, 'uploadCompleted', this.enabledNextBtn);

            } else if (this.stage === 2) {
                if (this.childView && this.childView.updateUser) {
                    this.childView.updateUser(this.timeStamp);
                } else {
                    this.updateCurrentUser({
                        stage    : this.stage,
                        timeStamp: this.timeStamp
                    });
                }

                this.$el.find('.stageBtnBack').show();
                this.$el.find('#cancelBtn').show();
                this.enabledNextBtn();

                this.childView = new MappingContentView({
                    timeStamp: this.timeStamp,
                    fileName : this.fileName
                });

                $thisEl.find('#fileName').text(this.fileName);
            } else if (this.stage === 3) {
                this.enabledNextBtn();

                if (this.childView) {
                    data = this.childView.getDataWithFields();

                    if (Object.keys(data).length) {
                        data.timeStamp = this.timeStamp;
                        this.map = data;

                        this.updateCurrentUser({
                            stage: this.stage,
                            map  : this.map
                        }, function () {
                            self.childView = new PreviewView({timeStamp: self.timeStamp});
                        });
                    } else {
                        this.stage = 2;
                        //this.selectStage();
                    }
                } else {
                    this.childView = new PreviewView({timeStamp: this.timeStamp});
                }

            } else if (this.stage === 4) {
                //this.enabledNextBtn();
                self.$el.find('.stageBtnNext').hide();

                if (this.childView) {

                    this.startImport(function (data) {

                        self.updateCurrentUser({
                            stage          : self.stage,
                            skipped        : data.skippedArray,
                            importedCount  : data.imported,
                            conflictedItems: data.conflictedItems
                        }, function () {
                            self.childView = new ComparingView({
                                timeStamp    : self.timeStamp,
                                updateHistory: self.insertHistoryView
                            });
                        });

                    });
                } else {
                    self.childView = new ComparingView({
                        timeStamp    : self.timeStamp,
                        updateHistory: self.insertHistoryView
                    });
                }

                $thisEl.find('.left').remove();
            } else if (this.stage === 5) {
                if (this.childView && this.childView.finishStep) {
                    this.childView.finishStep();
                    this.$el.find('.stageBtnNext').hide();

                    this.historyView.collection.getFirstPage();
                }
            }

            this.changeStage(this.stage);
        },

        startImport: function (callback) {
            var currentUser = App.currentUser;
            var importData = currentUser.imports;
            var url = '/importFile/imported';

            dataService.postData(url, importData, function (err, result) {
                callback(result);
            });

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
            var $nextBtn = this.$el.find('.stageBtnNext');

            $nextBtn.show();
            $nextBtn.removeClass('btnDisable');
            $nextBtn.prop('disabled', false);
        },

        insertHistoryView: function () {
            var importHistoryCollection = new HistoryCollection({
                viewType   : 'list',
                reset      : true,
                contentType: CONSTANTS.IMPORT,
                showMore   : false
            });

            importHistoryCollection.bind('reset', _.bind(createView, this));

            function createView() {

                importHistoryCollection.unbind('reset');

                this.historyView = new ImportHistoryView({
                    collection: importHistoryCollection,
                    startTime : this.startTime
                });

                eventsBinder.subscribeCollectionEvents(importHistoryCollection, this.historyView);

                importHistoryCollection.trigger('fetchFinished', {
                    totalRecords: importHistoryCollection.totalRecords,
                    currentPage : importHistoryCollection.currentPage,
                    pageSize    : importHistoryCollection.pageSize
                });
            }
        },

        render: function () {
            var $thisEl = this.$el;
            var $importProgress;
            var $topBar = $('#top-bar');

            $topBar.html('');
            $thisEl.html(this.contentTemplate({
                fileName: this.fileName || ''
            }));
            $importProgress = $thisEl.find('#importProgress');
            $importProgress.html(this.importProgressTemplate);

            this.insertHistoryView();
        }
    });

    return ContentView;
});
