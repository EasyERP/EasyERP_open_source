define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/payrollStructureTypes/EditTemplate.html',
    'models/PayrollStructureTypesModel'
], function ($, _, Backbone, EditTemplate, PayrollStructureTypesModel) {

    var EditView = Backbone.View.extend({
        el         : '#content-holder',
        contentType: 'payrollComponentTypes',
        template   : _.template(EditTemplate),

        initialize: function (options) {
            var self = this;

            options = options || {};

            self.model = options.model;
            self.type = options.type;
            self.eventChannel = options.eventChannel;

            self.render();
        },

        saveItem: function () {
            var self = this;
            var model;
            var $currentEl = this.$el;

            var name = $.trim($currentEl.find('#payrollStructureName').val());

            var data = {
                name: name
            };

            if (!name) {
                return App.render({
                    type   : 'error',
                    message: 'name can\'t be empty'
                });
            }

            model = new PayrollStructureTypesModel();
            model.urlRoot = function () {
                return 'payrollStructureTypes';
            };

            model.save(data, {
                patch  : true,
                wait   : true,
                success: function () {
                    self.hideDialog();
                    self.eventChannel.trigger('updatePayrollStructureTypes');
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
            var self = this;
            var formString = this.template({
                model: self.model.toJSON(),
                type : self.type
            });

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'edit-dialog',
                title        : 'Edit Payroll Structure Types',
                width        : '900px',
                position     : {within: $('#wrapper')},
                buttons      : [
                    {
                        text : 'Save',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        click: function () {
                            self.hideDialog();
                        }
                    }]

            });

            this.delegateEvents(this.events);

            return this;
        }

    });

    return EditView;
});
