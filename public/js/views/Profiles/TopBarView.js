define([
        'text!templates/Profiles/TopBarTemplate.html',
        'custom',
        'dataService',
        "common"
    ],
    function (TopBarTemplate, Custom, dataService, Common) {
        var TopBarView = Backbone.View.extend({
            el: '#top-bar',
            contentType: "Profiles",
            actionType: null, //Content, Edit, Create
            template: _.template(TopBarTemplate),

            events: {
                "click #top-bar-deleteBtn": "deleteEvent",
                "click #top-bar-nextBtn": "nextEvent",
                "click #top-bar-discardBtn": "discardEvent",
                "click #top-bar-editBtn": "editEvent",
                "click #top-bar-createBtn": "createEvent",
                "click #top-bar-saveBtn": "saveEvent"
            },

            nextEvent: function (event) {
                event.preventDefault();
                this.trigger('nextEvent');
            },
            deleteEvent: function (event) {
                var self = this;
                event.preventDefault();
                var selectedProfileId = $('#profilesList > li.active > a').data('id');
                if (selectedProfileId == "1387275598000" || selectedProfileId == "1387275504000") {
                    alert("You cannot delete this profile");
                    return;
                }
                dataService.getData('/UserWithProfile', {_id: selectedProfileId}, function (res) {
                    if (res.count == 0) {
                        if (confirm('Delete profile?'))
                            self.trigger('deleteEvent');
                    } else {

                        if (confirm('Delete profile? Users ' + res.data.join(', ') + ' will be assigned to banned profile!')) {
                            self.trigger('deleteEvent');
                            if (res.isOwnProfile)
                                window.location = "/logout";

                        }
                    }

                });

            },

            createEvent: function (event) {
                event.preventDefault();
                this.trigger('createEvent');
            },
            discardEvent: function () {
                Backbone.history.navigate("home/content-" + this.contentType, {trigger: true});
            },
            editEvent: function (event) {
                event.preventDefault();
                this.trigger('editEvent');

                /*var id = this.getIdFromHash(window.location.hash);
                 Backbone.history.navigate("#home/action-Profiles/Edit/" + id, { trigger: true });*/
            },
            saveEvent: function (event) {
                event.preventDefault();
                this.trigger('saveEvent');
            },
            getIdFromHash: function (hash) {
                var hashItems = hash.split('/');
                return hashItems[hashItems.length - 1];
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
