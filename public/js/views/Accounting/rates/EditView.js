define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Accounting/rates/EditTemplate.html'
], function (Backbone, $, _, EditTemplate) {
    'use strict';

    var EditView = Backbone.View.extend({
        template: _.template(EditTemplate),

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.responseObj = {};

            this.render(options);
        },

        events: {
            click: 'hideNewSelect'
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var rate = thisEl.find('#rate').val();
            var data;
            rate = parseFloat(rate);

            if (isNaN(rate)) {
                return App.render({type: 'error', message: 'Rate must be a number'});
            }

            data = {
                rate: rate
            };

            this.currentModel.save(data, {
                wait   : true,
                patch  : true,
                success: function (res, model) {
                    var tr = $('#ratesTable').find('tr[data-id="' + model._id + '"]');
                    self.hideDialog();

                    tr.find('td.rates').text(rate);
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
            var formString = this.template({
                model: this.currentModel.toJSON()
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Rate',
                width      : '800px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }
                ]

            });

            return this;
        }
    });

    return EditView;
});

