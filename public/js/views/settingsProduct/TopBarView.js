define([
        'text!templates/Profiles/TopBarTemplate.html',
        'custom',
        'dataService',
        "common"
    ],
    function (TopBarTemplate, Custom, dataService, Common) {
        var TopBarView = Backbone.View.extend({
            el: '#top-bar',
            contentType: "Product Settings",
            actionType: null, //Content, Edit, Create
            template: _.template(TopBarTemplate),

            events: {
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-editBtn": "editEvent",
                "click #top-bar-createBtn": "createEvent",
                "click #top-bar-saveBtn": "saveEvent"
            },


            createEvent: function (event) {
                event.preventDefault();

                this.trigger('createEvent');
            },

            editEvent: function (event) {
                event.preventDefault();

                this.trigger('editEvent');
            },

            saveEvent: function (event) {
                event.preventDefault();

                this.trigger('saveEvent');
            },

            initialize: function (options) {
                this.actionType = options.actionType;

                this.render();
            },

            render: function () {
                $('title').text(this.contentType);

                this.$el.html(this.template({contentType: this.contentType}));
                Common.displayControlBtnsByActionType(this.actionType);

                return this;
            }
        });

        return TopBarView;
    });
