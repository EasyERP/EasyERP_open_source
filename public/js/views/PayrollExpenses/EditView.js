define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/dialogViewBase',
    'text!templates/PayrollExpenses/EditTemplate.html',
    'views/PayrollExpenses/form/dialogView',
    'helpers'
], function (Backbone, _, $, Parent, template, ReportView, helpers) {
    'use strict';

    var CreateView = Parent.extend({
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
            var model = options.model.toJSON();
            var $journalDiv;

            var dialog = this.template({
                model           : model,
                currencySplitter: helpers.currencySplitter
            });

            this.data = options.data;

            this.$el = $(dialog).dialog({
                dialogClass: 'reportDialog',
                width      : 1200,
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

            $journalDiv = this.$el.find('#journalEntries');

            $journalDiv.append(
                new ReportView({
                    _id    : model.employee._id,
                    dataKey: model.dataKey,
                    el     : $journalDiv
                })
            );

            return this;
        }
    });
    return CreateView;
});
