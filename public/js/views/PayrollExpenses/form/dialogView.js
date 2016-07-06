define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/PayrollExpenses/form/dialogTemplate.html',
    'dataService',
    'helpers',
    'common'
], function (Backbone, _, $, template, dataService, helpers, common) {
    'use strict';

    var CreateView = Backbone.View.extend({
       // el         : '#content-holder',
        template   : _.template(template),
        responseObj: {},

        initialize: function (options) {
            var self = this;
            this._id = options._id;
            this.dataKey = options.dataKey;

            dataService.getData('journalEntries/getPayrollForReport', {
                _id    : self._id,
                dataKey: self.dataKey
            }, function (result) {
                self.render(result);
            });
        },

        hideDialog: function () {
            $('.reportDialog').remove();
        },

        render: function (options) {
            var self = this;
            var wagesPayable = options.data;
            var template = this.template({
                wagesPayable    : wagesPayable,
                currencySplitter: helpers.currencySplitter,
                dateFormat      : common.utcDateToLocaleFullDateTime
            });

            this.data = options.data;

            this.$el.append(template);

            /*this.$el = $(dialog).dialog({
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
            });*/

           // this.delegateEvents(this.events);
            App.stopPreload();

            return this;
        }
    });
    return CreateView;
});
