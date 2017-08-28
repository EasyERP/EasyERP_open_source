define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/integrationUnlinkedProducts/BuildProductTemplate.html'
], function (Backbone,
             $,
             _,
             ParentView,
             BuildProductTemplate) {
    'use strict';
    var BuildProductView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'integrationUnlinkedProducts',
        template   : _.template(BuildProductTemplate),
        events     : {},

        initialize: function (options) {
            this.currentModel = options.model;
            this.isFromIntegration = options.isFromIntegration;

            this.render();
        },

        buildProduct: function () {
            var name = $('#name').val();
            var sku = $('#sku').val();
            var data;

            if (!name || !sku) {
                return App.render({
                    message: 'Please, fill all fields'
                });
            }

            data = {
                sku   : sku,
                name  : name,
                action: 'built'
            };

            if (this.isFromIntegration) {
                data.action = 'singleBuilt';

                if (!this.currentModel.toJSON().fields.hasOrder) {
                    data.withoutOrder = true;
                } else {
                    data.withoutOrder = false;
                }
            }

            this.currentModel.save(data, {
                patch  : true,
                success: function () {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        render: function () {
            var self = this;
            var formString = self.template({model: this.currentModel.toJSON()});

            self.$el = $(formString).dialog({
                dialogClass: 'edit-dialog',
                width      : 400,
                title      : 'Build Product',
                buttons    : {
                    save: {
                        text : 'Build it',
                        class: 'btn blue',
                        id   : 'buildProduct',
                        click: function () {
                            self.buildProduct();
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
        }

    });

    return BuildProductView;
});


