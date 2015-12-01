define([
        "text!templates/Journal/CreateTemplate.html",
        "helpers"
    ],
    function (CreateTemplate, helpers) {
        "use strict";

        var CreateView = Backbone.View.extend({
            el: '#content-holder',
            template: _.template(CreateTemplate),

            initialize: function () {
                this.render();
            },

            events: {
            },

            render: function () {
                var formString = this.template();
                var self = this;

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    dialogClass: "create-dialog",
                    title: "Create Journal",
                    buttons: [
                        {
                            id: "saveBtn",
                            text: "Save",
                            click: function () {
                            }
                        },

                        {
                            text: "Cancel",
                            click: function () {
                                $(this).dialog('destroy').remove();
                            }
                        }]

                });

                this.$el.find('#deleteBtn').hide();

                this.delegateEvents(this.events);

                return this;
            }

        });

        return CreateView;
    });
