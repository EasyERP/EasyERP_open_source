define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/workCenters/CreateTemplate.html',
    'views/dialogViewBase',
    'models/WorkCenterModel',
    'helpers/keyValidator'
], function (Backbone, $, _, CreateTemplate, ParentView, WorkCenterModel, keyValidator) {

    var CreateView = ParentView.extend({
        el                  : '#content-holder',
        template            : _.template(CreateTemplate),
        imageSrc            : '',
        searchProdCollection: null,

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.render();
        },

        events: {
            'keypress .forNum': 'keypressHandler'
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        saveItem: function (e) {
            var workCenterModel = new WorkCenterModel();
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

            workCenterModel.save({
                name       : _.escape(name),
                description: _.escape(description),
                costPerHour: _.escape(costPerHour),
                code       : _.escape(code)
            }, {
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
            var formString = self.template({});

            this.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 600,
                title      : 'Create Product',
                buttons    : {
                    save: {
                        text : 'Create',
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

    return CreateView;
});
