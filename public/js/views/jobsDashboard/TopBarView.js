/**
 * Created by lilya on 09/11/15.
 */
define([
        'text!templates/jobsDashboard/TopBarTemplate.html',
        'custom',
        "common"
    ],
    function (TopBarTemplate, Custom, Common) {
        var TopBarView = Backbone.View.extend({
            el         : '#top-bar',
            contentType: "Dashboard",
            actionType : null, //Content, Edit, Create
            template   : _.template(TopBarTemplate),

            events: {
                "click #top-bar-deleteBtn" : "deleteEvent",
                "click #top-bar-nextBtn"   : "nextEvent",
                "click #top-bar-discardBtn": "discardEvent",
                "click #top-bar-editBtn"   : "editEvent",
                "click #top-bar-createBtn" : "createEvent"
            },

            nextEvent  : function (event) {
                event.preventDefault();
                this.trigger('nextEvent');
            },
            deleteEvent: function () {
                event.preventDefault();
                if (confirm('Delete profile?')) {
                    this.trigger('deleteEvent');
                }
            },

            createEvent  : function (event) {
                event.preventDefault();
                this.trigger('createEvent');
            },
            discardEvent : function () {
                Backbone.history.navigate("home/content-" + this.contentType, {trigger: true});
            },
            editEvent    : function () {
                event.preventDefault();
                this.trigger('editEvent');

                /*var id = this.getIdFromHash(window.location.hash);
                 Backbone.history.navigate("#home/action-Profiles/Edit/" + id, { trigger: true });*/
            },
            getIdFromHash: function (hash) {
                var hashItems = hash.split('/');
                return hashItems[hashItems.length - 1];
            },
            initialize   : function (options) {
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
