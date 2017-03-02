define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/goodsOutNotes/PackNote.html',
    'views/selectView/selectView',
    'text!templates/Accounting/currencyEl.html',
    'populate',
    'helpers'
], function (Backbone, $, _, ParentView, EditTemplate, SelectView, tableEL, populate, helpers) {
    'use strict';

    var EditView = ParentView.extend({
        template: _.template(EditTemplate),

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');

            if (options.model) {
                this.currentModel = options.model;
                this.date = helpers.setTimeToDate(options.date);
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.responseObj = {};

            this.render(options);
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var text = $target.text();
            var $ul = $target.closest('ul');
            var $element = $ul.closest('div.wrapper').find('a');

            $element.attr('data-id', id);
            $element.text(text);

            $ul.remove();
        },

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;

            var trackingRef = $.trim(thisEl.find('#currencySymbol').val());
            var shippingCost = $.trim(thisEl.find('#shippingCost').val()) || 0;
            var shippingMethod = thisEl.find('#shippingMethods').attr('data-id');
            var data;

            if (!shippingMethod) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose Shipping Method first.'
                });
            }

            data = {
                'status.packed': true,
                date           : this.date,
                reference      : trackingRef,
                shippingMethod : shippingMethod,
                shippingCost   : shippingCost
            };

            this.currentModel.save(data, {
                wait   : true,
                patch  : true,
                success: function (res, model) {
                    self.hideDialog();
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
            var shippingMethod = this.model.get('shippingMethod') ? this.model.get('shippingMethod')._id : null;

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                width      : '250px',
                buttons    : [
                    {
                        text : 'Pack',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]

            });

            this.$el.find('#decPlaces').spinner({
                min: 0,
                max: 3
            });

            populate.get('#shippingMethods', '/shippingMethod/getForDd', {}, 'name', this, false, false, shippingMethod);

            return this;
        }
    });

    return EditView;
});
