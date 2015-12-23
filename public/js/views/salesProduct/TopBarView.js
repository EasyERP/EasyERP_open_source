define([
        'text!templates/Product/TopBarTemplate.html',
        'custom',
        'common',
        'constants'
    ],
    function (ContentTopBarTemplate, Custom, Common, CONSTANTS) {
        var TopBarView = Backbone.View.extend({
            el         : '#top-bar',
            contentType: CONSTANTS.SALESPRODUCT,
            actionType : null, //Content, Edit, Create
            template   : _.template(ContentTopBarTemplate),

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

            changeItemIndex: function (e) {
                var actionType = "Content";
                Custom.changeItemIndex(e, actionType, this.contentType, this.collection);
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

            render     : function () {
                $('title').text(this.contentType);
                var viewType = Custom.getCurrentVT();

                this.$el.html(this.template({viewType: viewType, contentType: this.contentType}));
                Common.displayControlBtnsByActionType(this.actionType, viewType);

                return this;
            },
            editEvent  : function (event) {
                event.preventDefault();
                this.trigger('editEvent');
            },
            createEvent: function (event) {
                event.preventDefault();
                this.trigger('createEvent');
            },
            deleteEvent: function (event) {
                event.preventDefault();

                var checkBoxes = $("input.checkbox:checked");
                var values = [];

                $.each(checkBoxes, function (el) {
                    values.push($(el).val());
                });
                var permission = true;

                values.forEach(function (val) {
                    if (val === CONSTANTS.PRODUCRSERVICE) {
                        permission = false;
                        return permission;
                    }
                });

                if (!permission) {
                    return App.render({
                        type: 'error',
                        message: "You do not have permission to perform this action"
                    });
                }

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