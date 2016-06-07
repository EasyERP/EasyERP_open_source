define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/PayrollExpenses/generate/generate.html',
    'moment'
], function (Backbone, $, _, GenetareTemplate, moment) {
    'use strict';

    var CreateView = Backbone.View.extend({
        template: _.template(GenetareTemplate),

        events: {
            'click input'   : 'setAttr',
            'keyup input'   : 'onKeyUpInput',
            'focusout input': 'onChangeInput',
            'keydown input' : 'onKeyDownInput'
        },

        initialize: function (options) {

            this.keys = options.keys;

            this.url = options.url || '/payroll/generate/';

            this.title = options.url ? 'Close Month' : 'Generate Payroll Expenses';

            this.render();
        },

        setAttr: function (e) {
            var input = $(e.target);
            var id = input.attr('id');

            if (id === 'month') {
                input.attr({
                    min      : 1,
                    max      : 12,
                    maxLength: 2
                });
            } else if (id === 'year') {
                input.attr({
                    min      : 1980,
                    maxLength: 4
                });
            }
        },
        
        onKeyDownInput: function (e) {
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 || (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }

            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        },

        onKeyUpInput: function (e) {
            var element = e.target;

            if (element.maxLength && element.value.length > element.maxLength) {
                element.value = element.value.slice(0, element.maxLength);
            }
        },

        onChangeInput: function (e) {
            var element = e.target;
            var max = parseInt(element.max, 10);
            var min = parseInt(element.min, 10);
            var value = parseInt(element.value, 10);

            if (max && value > max) {
                element.value = max;
            }

            if (min && value < min) {
                element.value = min;
            }
        },

        generate: function () {
            this.generateItems();
        },

        generateItems: function () {
            var self = this;
            var data = {};
            var url;
            var key;

            var editedElement = $('.edit');

            if (editedElement.length) {
                self.month = $('#month').val();
                self.year = $('#year').val();
            }

            key = parseInt(self.year, 10) * 100 + parseInt(self.month, 10);

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

            var dialog = this.template({
                month: month,
                year : year
            });

            newDialog = $(dialog);

            this.$el = newDialog.dialog({
                dialogClass: 'edit-dialog',
                width      : 300,
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
