define([
        'text!templates/Departments/TopBarTemplate.html',
        'custom',
        'common'
    ],
    function (ContentTopBarTemplate, Custom, Common) {
        var TopBarView = Backbone.View.extend({
            el         : '#top-bar',
            contentType: "Departments",
            headerType : "Groups",
            actionType : null,
            template   : _.template(ContentTopBarTemplate),

            events: {
                "click a.changeContentView"    : 'changeContentViewType',
                "click ul.changeContentIndex a": 'changeItemIndex',
                "click #top-bar-deleteBtn"     : "deleteEvent",
                "click #top-bar-discardBtn"    : "discardEvent",
                "click #top-bar-editBtn"       : "editEvent",
                "click #top-bar-createBtn"     : "createEvent",
                "click #top-bar-exportToCsvBtn": "exportToCsv",
                "click #top-bar-exportToXlsxBtn": "exportToXlsx",
            },

            changeContentViewType: function (e) {
                Custom.changeContentViewType(e, this.contentType, this.collection);
            },

            changeItemIndex: function (e) {
                Custom.changeItemIndex(e, "Content", this.contentType, this.collection);
            },
            createEvent    : function (event) {
                event.preventDefault();
                this.trigger('createEvent');
            },

            editEvent: function (event) {
                event.preventDefault();
                this.trigger('editEvent');
            },

            exportToCsv: function (event) {
                event.preventDefault();
                this.trigger('exportToCsv');
            },

            exportToXlsx: function (event) {
                event.preventDefault();
                this.trigger('exportToXlsx');
            },

            initialize: function (options) {
                this.actionType = options.actionType;
                if (this.actionType !== "Content") {
                    Custom.setCurrentVT("form");
                }
                if (options.collection) {
                    this.collection = options.collection;
                    this.collection.bind('reset', _.bind(this.render, this));
                }
                this.render();
            },

            render: function () {
                $('title').text(this.headerType);
                var viewType = Custom.getCurrentVT();
                this.$el.html(this.template({
                    viewType   : viewType,
                    contentType: this.contentType,
                    headerType : this.headerType
                }));
                Common.displayControlBtnsByActionType('Content', viewType);
                return this;
            },

            deleteEvent: function (event) {
                event.preventDefault();
                var answer = confirm("Really DELETE items ?!");
                if (answer == true) {
                    this.trigger('deleteEvent');
                }
            },

            discardEvent: function (event) {
                event.preventDefault();
                Backbone.history.navigate("home/content-" + this.contentType, {trigger: true});
            }
        });
        return TopBarView;
    });