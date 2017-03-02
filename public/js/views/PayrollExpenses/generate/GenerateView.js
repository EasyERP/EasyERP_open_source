define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/PayrollExpenses/generate/generate.html',
    'moment',
    'constants'
], function (Backbone, $, _, Parent, GenetareTemplate, moment, CONSTANTS) {
    'use strict';

    var CreateView = Parent.extend({
        template   : _.template(GenetareTemplate),
        responseObj: {},

        events: {
            'click input': 'setAttr'
        },

        initialize: function (options) {
            var i;

            this.keys = options.keys;

            this.url = options.url || '/payroll/generate/';

            this.title = options.url ? 'Close Month' : 'Process Payroll';

            this.responseObj['#month'] = [];

            for (i = 12; i >= 1; i--) {
                this.responseObj['#month'].push({_id: i, name: i.toString()});
            }

            this.render();
        },

        chooseOption: function (e) {
            $(e.target).parents('a').text($(e.target).text());
            $(e.target).parents('a').attr('data-id', $(e.target).attr('data-id'));

            this.hideNewSelect();
        },

        generate: function () {
            this.generateItems();
        },

        generateItems: function () {
            var self = this;
            var data = {};
            var url;
            var key;

            self.month = $.trim(this.$el.find('#month').text());
            self.year = $.trim(this.$el.find('#year').text());

            key = parseInt(self.year, 10) * 100 + parseInt(self.month, 10);

            if (key > this.maxKey) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose some previous month and year!'
                });
            }

            if (this.keys.indexOf(key.toString()) > -1) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose empty month!'
                });
            }

            data.month = this.month;
            data.year = this.year;

            $.ajax({
                type       : 'POST',
                url        : this.url,
                contentType: 'application/json',
                data       : JSON.stringify(data),

                success: function () {
                    $('.edit-dialog').remove();

                    url = window.location.hash;

                    Backbone.history.fragment = '';
                    Backbone.history.navigate(url, {trigger: true});

                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'error'
                    });
                }
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var month = moment(new Date()).get('month');
            var year = moment(new Date()).get('year');
            var newDialog;
            var i;
            var minDate = new Date(CONSTANTS.MIN_DATE);
            var minYear = moment(minDate).get('year');
            var dialog;

            if (month === 0) {
                month = 12;
                year -= 1;
            }

            dialog = this.template({
                month: month,
                year : year,
                title: this.title
            });

            this.responseObj['#year'] = [];
            this.maxKey = year * 100 + month;

            for (i = year; i >= minYear; i--) {
                this.responseObj['#year'].push({_id: i, name: i.toString()});
            }

            newDialog = $(dialog);

            this.$el = newDialog.dialog({
                dialogClass: 'edit-dialog',
                width      : 500,
                title      : self.title,
                buttons    : {
                    save: {
                        text : 'Generate',
                        class: 'btn',
                        id   : 'generateBtn',
                        click: function () {
                            self.generate();
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
    return CreateView;
});
