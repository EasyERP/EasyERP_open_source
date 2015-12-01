define([
        "text!templates/Journal/CreateTemplate.html",
        'populate'
    ],
    function (CreateTemplate, populate) {
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

                populate.get("#debitDd", "/chartOfAccount/getForDd", {}, 'name', this, true);

                this.delegateEvents(this.events);

                return this;
            }

        });

        return CreateView;
    });
