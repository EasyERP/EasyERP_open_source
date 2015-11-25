/**
 * Created by lilya on 10/11/15.
 */
define([
        "text!templates/PayrollExpenses/generate/generate.html",
        "moment",
        "populate"
    ],
    function (GenetareTemplate, moment, populate) {
        "use strict";
        var CreateView = Backbone.View.extend({
            template: _.template(GenetareTemplate),

            events: {
                "click input"   : "setAttr",
                "keyup input"   : "onKeyUpInput",
                "focusout input": "onChangeInput"
            },

            initialize: function (options) {

                this.keys = options.keys;

                this.render();
            },

            setAttr: function (e) {
                var input = $(e.target);
                var id = input.attr('id');

                if (id === 'month') {
                    input.attr({
                        "min"      : 1,
                        "max"      : 12,
                        "maxLength": 2
                    });
                } else if (id === 'year') {
                    input.attr({
                        "min"      : 1980,
                        "maxLength": 4
                    });
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
                var max = parseInt(element.max);
                var min = parseInt(element.min);
                var value = parseInt(element.value);

                if (max && value > max) {
                    element.value = max;
                }

                if (min && value < min) {
                    element.value = min;
                }
            },

            setChangedValue: function () {
                var editedElement = $('.edit');
                var self = this;

                if (editedElement.length) {

                    self.month = $('#month').val();
                    self.year = $('#year').val();

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

                key = parseInt(self.year) * 100 + parseInt(self.month);

                if (this.keys.indexOf(key.toString()) > -1) {
                    return alert("Please, choose empty month!");
                }

                data.month = this.month;
                data.year = this.year;

                $.ajax({
                    type       : 'POST',
                    url        : '/payroll/generate/',
                    contentType: "application/json",
                    data       : JSON.stringify(data),

                    success: function () {
                        $('.edit-dialog').remove();

                        url = window.location.hash;

                        Backbone.history.fragment = '';
                        Backbone.history.navigate(url, {trigger: true});

                    },
                    error  : function () {
                        alert('error');
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

                var newDate = moment([month + 1, year]);

                var dialog = this.template({
                    month: newDate.get('month'),
                    year : year
                });

                newDialog = $(dialog);

                this.$el = newDialog.dialog({
                    dialogClass: "edit-dialog",
                    width      : 300,
                    title      : "Generate Payroll Expenses",
                    buttons    : {
                        save  : {
                            text : "Generate",
                            class: "btn",
                            id   : "generateBtn",
                            click: function () {
                                // self.generateItems()
                                self.generate()
                            }
                        },
                        cancel: {
                            text : "Cancel",
                            class: "btn",
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
    })
;