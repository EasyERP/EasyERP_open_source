define([
        "text!templates/Journal/CreateTemplate.html",
        'populate'
    ],
    function (CreateTemplate, populate) {
        "use strict";

        var CreateView = Backbone.View.extend({
            el         : '#content-holder',
            template   : _.template(CreateTemplate),
            responseObj: {},

            events: {
                "click .current-selected"                          : "showNewSelect",
                "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            },

            initialize: function () {
                this.render();
            },

            showNewSelect: function (e, prev, next) {
                e.preventDefault();

                populate.showSelect(e, prev, next, this);
                return false;
            },

            chooseOption: function (e) {
                var $target = $(e.target);
                var id = $target.attr("id");
                var text = $target.text();
                var $ul = $target.closest('ul');
                var $element = $ul.closest('dd').find('a');

                $element.attr('data-id', id);
                $element.text(text);

                $ul.remove();

                return false;
            },

            render: function () {
                var formString = this.template();

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : true,
                    dialogClass  : "create-dialog",
                    title        : "Create Journal",
                    buttons      : [
                        {
                            id   : "saveBtn",
                            text : "Save",
                            click: function () {
                            }
                        },

                        {
                            text : "Cancel",
                            click: function () {
                                $(this).dialog('destroy').remove();
                            }
                        }]

                });

                populate.get("#debitDd", "/chartOfAccount/getForDd", {}, 'name', this, true, true);
                populate.get("#creditDd", "/chartOfAccount/getForDd", {}, 'name', this, true, true);

                this.delegateEvents(this.events);

                return this;
            }

        });

        return CreateView;
    });
