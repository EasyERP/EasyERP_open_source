define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/PayrollExpenses/EditTemplate.html',
    'helpers'
], function (Backbone, _, $, template, helpers) {
    'use strict';

    var CreateView = Backbone.View.extend({
        el         : '#content-holder',
        template   : _.template(template),
        responseObj: {},

        initialize: function (options) {
            this.render(options);
        },

        hideDialog: function () {
            $('.reportDialog').remove();
        },

        render: function (options) {
            var self = this;
            var model = options.model.toJSON()[0];
            var dialog = this.template({
                model: model
            });

            this.data = options.data;

            this.$el = $(dialog).dialog({
                dialogClass: 'reportDialog',
                width      : 900,
                title      : 'Report',
                buttons    : {
                    cancel: {
                        text : 'Close',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                }
            });

            this.delegateEvents(this.events);
            App.stopPreload();

            return this;
        }
    });
    return CreateView;
});
