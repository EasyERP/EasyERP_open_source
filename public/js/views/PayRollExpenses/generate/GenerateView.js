/**
 * Created by lilya on 10/11/15.
 */
define([
        "text!templates/PayRollExpenses/generate/generate.html",
        "moment",
        "populate"
    ],
    function (GenetareTemplate, moment, populate) {
        "use strict";
        var CreateView = Backbone.View.extend({
                template: _.template(GenetareTemplate),

                events: {
                },

                initialize: function (options) {

                    this.render();
                },

                setChangedValue: function(){
                    var editedElement = $('.edit');
                    var self = this;

                    if (editedElement.length) {

                        self.month = $('#month').val();
                        self.year = $('#year').val();

                    }
                },

                generateItems: function () {
                    var self = this;
                    var url;
                    var filter;
                    var key;

                    var editedElement = $('.edit');

                    if (editedElement.length) {
                        self.month = $('#month').val();
                        self.year = $('#year').val();
                    }

                    key = parseInt(self.year) * 100 + parseInt(self.month);

                    filter = {
                        "dataKey": {
                            key: "dataKey",
                            value: [key]
                        }
                    };


                    var data = {};

                    data.month = this.month;
                    data.year = this.year;

                    $.ajax({
                        type: 'POST',
                        url: '/payroll/generate/',
                        contentType: "application/json",
                        data: JSON.stringify(data),

                        success: function () {
                            $('.edit-dialog').remove();

                            url = "#easyErp/Payroll/list/p=1/c=100";

                            Backbone.history.fragment = '';
                            Backbone.history.navigate(url + '/filter=' + encodeURI(JSON.stringify(filter)), {trigger: true});

                        },
                        error: function () {
                            alert('error');
                        }
                    });
                },

            hideDialog: function(){
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
                        year: year
                    });

                    newDialog = $(dialog);

                    this.$el = newDialog.dialog({
                        dialogClass: "edit-dialog",
                        width: 300,
                        title: "Generate Payroll Expenses",
                        buttons: {
                            save: {
                                text: "Generate",
                                class: "btn",
                                id: "generateBtn",
                                click: self.generateItems
                            },
                            cancel: {
                                text: "Cancel",
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