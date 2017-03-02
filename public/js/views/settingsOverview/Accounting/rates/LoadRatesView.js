define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/settingsOverview/Accounting/rates/LoadTemplate.html',
    'dataService',
    'moment'
], function (Backbone, $, _, Parent, template, dataService, moment) {
    'use strict';

    var EditView = Parent.extend({
        template: _.template(template),

        initialize: function (options) {
            this.collection = options.collection;
            this.parent = options.parent;

            this.render();
        },

        load: function () {
            var self = this;
            var url = window.location.hash;
            var startDate = $.trim(this.$el.find('#startDate').val());
            var endDate = $.trim(this.$el.find('#endDate').val());

            dataService.getData('rates/syncRates', {startDate: startDate, endDate: endDate}, function (collection) {

                /*collection.forEach(function (el) {
                 el.date = moment(new Date(el.date)).format('DD MMM, YYYY');
                 });

                 self.collection.set(collection);*/

                self.parent.changeDateRange([self.parent.startDate, self.parent.endDate]);
                self.remove();
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var startDate = moment(new Date()).startOf('month');
            var endDate = moment();
            var formString = this.template({});

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Load Rates',
                width      : '500px',
                buttons    : [{
                    text : 'Load',
                    class: 'btn blue',
                    click: function () {
                        self.load();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });

            this.delegateEvents(this.events);

            this.$el.find('#startDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : endDate.toDate(),
                onSelect   : function () {
                    var targetInput = $(this);
                    var endDatePicker = self.$el.find('#endDate');
                    var endDate = moment(targetInput.datepicker('getDate'));
                    var endContainer = $(endDatePicker);

                    if (endDate > endContainer.datepicker('getDate')) {

                        endDate = endDate.toDate();

                        endContainer.datepicker('setDate', endDate);
                    }
                }
            }).datepicker('setDate', startDate.toDate());

            this.$el.find('#endDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : endDate.toDate(),
                onSelect   : function () {
                    var targetInput = $(this);
                    var endDatePicker = self.$el.find('#startDate');
                    var endDate = moment(targetInput.datepicker('getDate'));
                    var endContainer = $(endDatePicker);

                    endDate = endDate.toDate();

                    endContainer.datepicker('setDate', endDate);
                    endContainer.datepicker('option', 'maxDate', endDate);
                }
            }).datepicker('setDate', endDate.toDate());

            return this;
        }
    });

    return EditView;
});
