define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/settingsOverview/settingsEmployee/languages/EditTemplate.html',
    'helpers/ga'
], function ($, _, Backbone, EditTemplate, ga) {

    var EditView = Backbone.View.extend({
        el         : '#content-holder',
        contentType: 'languages',
        template   : _.template(EditTemplate),

        initialize: function (options) {
            this.collection = options.collection;
            this.model = options.model;

            this.render();
        },

        saveItem: function () {
            var self = this;
            var model = this.model;
            var $currentEl = this.$el;
            var name = $.trim($currentEl.find('#languageName input').val());
            var data = {};

            if (!name) {
                return App.render({
                    type   : 'error',
                    message: 'Name can\'t be empty'
                });
            }
            data = {
                name: name
            };

            model.save(data, {
                headers: {
                    mid: 103 // ?
                },
                patch  : true,
                wait   : true,
                success: function (model) {
                    self.hideDialog();
                    self.collection.set(model);
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
            $('.crop-images-dialog').remove();
        },

        render: function () {
            var formString = this.template({model: this.model.toJSON()});
            var self = this;

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Language',
                width      : '900px',
                position   : {within: $('#wrapper')},
                buttons    : [{
                    id   : 'edit-language-dialog',
                    class: 'btn blue',
                    text : 'Edit',
                    click: function () {
                        self.saveItem();
                        ga && ga.trackingEditConfirm(self.contentType);
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                        ga && ga.trackingEditCancel(self.contentType);
                    }
                }]
            });

            this.delegateEvents(this.events);

            return this;
        }

    });

    return EditView;
});
