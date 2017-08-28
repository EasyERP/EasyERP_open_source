define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/confirmTemplate.html'
], function (Backbone, $, _, template) {
    'use strict';

    var View = Backbone.View.extend({
        el      : '#content-holder',
        template: _.template(template),

        initialize: function (options) {

            this.message = options.message || '';
            this.callback = options.callback || function () {

                };

            this.render();
        },

        hideDialog: function () {
            $('.confirm-dialog').remove();
        },

        render: function () {
            var formString = this.template({message: this.message});
            var self = this;
            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'confirm-dialog',
                width      : '300',
                height     : '200',
                title      : 'Confirm',
                buttons    : {
                    save: {
                        text : 'Ok',
                        class: 'btn blue',
                        click: function () {
                            self.callback();
                            self.hideDialog();
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

            return this;
        }
    });

    return View;
});