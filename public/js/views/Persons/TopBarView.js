define([
        'text!templates/Persons/TopBarTemplate.html',
        'text!templates/Notes/importTemplate.html',
        'views/Notes/AttachView',
        'custom',
        'common'
    ],
    function (ContentTopBarTemplate, importTemplate, attachView, Custom, Common) {
        var TopBarView = Backbone.View.extend({
            el         : '#top-bar',
            contentType: "Persons",
            template   : _.template(ContentTopBarTemplate),

            events: {
                "click a.changeContentView"     : 'changeContentViewType',
                "click #top-bar-deleteBtn"      : "deleteEvent",
                "click #top-bar-editBtn"        : "editEvent",
                "click #top-bar-createBtn"      : "createEvent",
                "click #top-bar-exportBtn"      : "export",
                "click #top-bar-exportToCsvBtn" : "exportToCsv",
                "click #top-bar-exportToXlsxBtn": "exportToXlsx",
                "click #top-bar-importBtn"      : "importEvent",
                "change .inputAttach"           : "importFiles"
            },

            changeContentViewType: function (e) {
                Custom.changeContentViewType(e, this.contentType, this.collection);
            },

            initialize: function (options) {
                if (options.collection) {
                    this.collection = options.collection;
                }
                this.render();
            },

            exportToCsv: function (event) {
                event.preventDefault();
                this.trigger('exportToCsv');
            },

            exportToXlsx: function (event) {
                event.preventDefault();
                this.trigger('exportToXlsx');
            },

            createEvent: function (event) {
                event.preventDefault();
                this.trigger('createEvent');
            },

            render: function () {
                $('title').text(this.contentType);
                var viewType = Custom.getCurrentVT();
                this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));

                Common.displayControlBtnsByActionType('Content', viewType);
                return this;
            },

            editEvent: function (event) {
                event.preventDefault();
                this.trigger('editEvent');
            },

            importEvent: function (event) {
                var template = _.template(importTemplate);
                this.$el.find('#forImport').html(template);
                event.preventDefault();
                this.$el.find('#inputAttach').click();
                this.trigger('importEvent');
            },

            importFiles: function (e) {
                var importFile = new attachView({});

                this.import = true;

                importFile.sendToServer(e, null, this);
            },

            deleteEvent: function (event) {
                event.preventDefault();
                var answer = confirm("Realy DELETE items ?!");
                if (answer == true) {
                    this.trigger('deleteEvent');
                }
            }
        });

        return TopBarView;
    });
