define([
        'text!templates/JobPositions/TopBarTemplate.html',
        'custom',
        'common'
    ],
    function (ContentTopBarTemplate, Custom, Common) {
        var TopBarView = Backbone.View.extend({
            el           : '#top-bar',
            contentType  : "JobPositions",
            contentHeader: "Job Positions",
            actionType   : null, //Content, Edit, Create
            template     : _.template(ContentTopBarTemplate),

            events: {
                "click a.changeContentView"    : 'changeContentViewType',
                "click ul.changeContentIndex a": 'changeItemIndex',
                "click #top-bar-deleteBtn"     : "deleteEvent",
                "click #top-bar-discardBtn"    : "discardEvent",
                "click #top-bar-editBtn"       : "editEvent",
                "click #top-bar-createBtn"     : "createEvent"
            },

            changeContentViewType: function (e) {
                Custom.changeContentViewType(e, this.contentType, this.collection);
            },
            createEvent          : function (event) {
                event.preventDefault();
                this.trigger('createEvent');
            },

            changeItemIndex: function (e) {
                var actionType = "Content";
                Custom.changeItemIndex(e, actionType, this.contentType, this.collection);
            },
            editEvent      : function (event) {
                event.preventDefault();
                this.trigger('editEvent');
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
                $('title').text(this.contentHeader);
                var viewType = Custom.getCurrentVT();
                this.$el.html(this.template({
                    viewType     : viewType,
                    contentType  : this.contentType,
                    contentHeader: this.contentHeader
                }));
                Common.displayControlBtnsByActionType('Content', viewType);

                return this;
            },

            deleteEvent: function (event) {
                event.preventDefault();
                var answer = confirm("Really DELETE item(s) ?!");
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