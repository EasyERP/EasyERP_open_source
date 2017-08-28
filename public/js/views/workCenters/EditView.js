define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/workCenters/EditTemplate.html',
    'views/dialogViewBase',
    'helpers/keyValidator'
], function (Backbone, $, _, EditTemplate, ParentView, keyValidator) {

    var EditView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'workCenters',
        template   : _.template(EditTemplate),

        events: {
            'keypress .forNum': 'keypressHandler'
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        initialize: function (options) {
            this.currentModel = options.model;

            this.render();
        },

        saveItem: function () {
            var $el = this.$el;
            var self = this;
            var name = $el.find('#name').val();
            var code;
            var description;
            var costPerHour;

            if (!name) {
                return App.render({
                    type   : 'error',
                    message: "Name can't be empty."
                });
            }

            code = $el.find('#code').val();

            if (!code) {
                return App.render({
                    type   : 'error',
                    message: "Code can't be empty."
                });
            }

            description = $el.find('#description').val();

            if (!description) {
                return App.render({
                    type   : 'error',
                    message: "Description can't be empty."
                });
            }

            costPerHour = $el.find('#costPerHour').val();

            if (!costPerHour) {
                return App.render({
                    type   : 'error',
                    message: "Cost per hour can't be empty."
                });
            }

            costPerHour = costPerHour * 100;

            var data = {
                name       : _.escape(name),
                description: _.escape(description),
                costPerHour: _.escape(costPerHour),
                code       : _.escape(code)
            };

            this.currentModel.set(data);

            this.currentModel.save(this.currentModel.changed, {
                patch  : true,
                success: function (model, response) {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var formString = this.template({model: this.currentModel.toJSON()});

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 600,
                title      : 'Edit Work Center',
                buttons    : {
                    save: {
                        text : 'Save',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                }
            });

            this.delegateEvents(self.events);

            return this;
        }

    });

    return EditView;
});
