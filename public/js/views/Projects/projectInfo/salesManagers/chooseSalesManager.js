define(['Backbone',
        'Underscore',
        'jQuery',
        'text!templates/Projects/projectInfo/chooseSalesManager.html',
        'views/selectView/selectView',
        'dataService',
        'common'
    ],
    function (Backbone, _, $, chooseSalesManager, selectView, dataService, common) {
        'use strict';

        var ChooseSalesView = Backbone.View.extend({
            template   : _.template(chooseSalesManager),
            responseObj: {},

            events: {
                "click "                                            : "hideNewSelect",
                "click .newSelectList li:not(.miniStylePagination)" : "chooseOption",
                "click a.current-selected"                          : "showNewSelect"
            },

            initialize: function (options) {
                this.model = options.model;

                this.modelJSON = this.model.id ? this.model.toJSON() : this.model;

                this.render();
            },

            hideDialog: function () {
                $('.salesManagerDialog').remove();
            },

            hideNewSelect: function () {
                $(".newSelectList").hide();

                if (this.selectView) {
                    this.selectView.remove();
                }
            },

            showNewSelect: function (e) {
                var $target = $(e.target);
                e.stopPropagation();

                if ($target.attr('id') === 'selectInput') {
                    return false;
                }

                if (this.selectView) {
                    this.selectView.remove();
                }

                this.selectView = new selectView({
                    e          : e,
                    responseObj: this.responseObj
                });
               if (Object.keys(this.responseObj)){
                   $target.append(this.selectView.render().el);
               }

                return false;
            },

            saveItems: function () {
                var self = this;
                var thisEl = this.$el;
                var newSalesManager;
                var data = this.modelJSON.salesManagers;

                var date = thisEl.find('#date').val() || this.modelJSON.StartDate;
                var manager = thisEl.find('th[data-id]').attr('data-id');
                if (manager && manager !== this.modelJSON.projectmanager._id) {
                    newSalesManager = {
                        manager: manager,
                        date   : date
                    };
                    data.push(newSalesManager);
                }

                this.model.save(
                    {salesManagers: data}, {
                        wait   : true,
                        success: function () {
                            var url = window.location.hash;

                            self.hideDialog();

                            Backbone.history.fragment = '';
                            Backbone.history.navigate(url, {trigger: true});
                        },
                        error  : function (model, xhr) {
                            self.errorNotification(xhr);
                        }
                    });

            },

            chooseOption: function (e) {
                var target = $(e.target);
                var targetElement = target.parents("th");
                var id = target.attr("id");
                var selectorContainer;

                targetElement.attr('data-id', id);
                selectorContainer = targetElement.find('a.current-selected');

                selectorContainer.text(target.text());
                this.hideNewSelect();

                return false;
            },

            render: function () {
                var self = this;
                var salesManager = this.modelJSON.salesManagers[this.modelJSON.salesManagers.length - 1];
                var dialog = this.template({
                    salesManager       : salesManager,
                    utcDateToLocaleDate: common.utcDateToLocaleDate
                });

                this.$el = $(dialog).dialog({
                    dialogClass: "salesManagerDialog",
                    width      : 500,
                    title      : "Sales Manager",
                    buttons    : {
                        save  : {
                            text : "Save",
                            class: "btn",
                            id   : "saveBtn",
                            click: function () {
                                self.saveItems();
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

                this.$el.find('#date').datepicker({
                    dateFormat : "d M, yy",
                    changeMonth: true,
                    changeYear : true,
                    minDate    : this.modelJSON.StartDate
                });

                dataService.getData('/employee/getByDepartments', {departments: ["BusinessDev", "PM"]}, function (employees) {
                    employees = _.map(employees.data, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;

                        return employee;
                    });

                    self.responseObj['#employee'] = employees;
                });

                return this;
            }
        });

        return ChooseSalesView;
    })