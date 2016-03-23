define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Projects/projectInfo/salesManagersTemplate.html',
    'text!templates/Projects/projectInfo/updateSalesManager.html',
    'views/selectView/selectView',
    'common',
    'dataService'
], function (Backbone, $, _, salesManagersTemplate, updateSalesManager, selectView, common, dataService) {
    'use strict';
    var SalesManagersView = Backbone.View.extend({

        initialize: function (options) {
            this.model = options.model;
            this.responseObj = {};
            this.selectedSalesManagers = [];
            this.modelJSON = this.model.id ? this.model.toJSON() : this.model;
        },

        template: _.template(salesManagersTemplate),

        events: {
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click a.current-selected'                         : 'showNewSelect',
            'click'                                            : 'hideNewSelect',
            'click #updateSalesManager'                        : 'updateSalesManager',
            'click #saveSalesManager'                          : 'saveSalesManager',
            'click .editable'                                  : 'editNewRow',
            'click #removeSalesManager'                        : 'removeSalesManager',
            'click .salesManager-checkbox'                     : 'checkSalesManager',
            'click #check_all_salesManagers'                   : 'checkAllSalesManagers'
        },

        checkSalesManager: function (e) {
            var self = this;
            var element = e.target;
            var checked = element.checked;
            var salesManagerId = element.value;
            var countCheckbox = $('input.salesManager-checkbox').length;
            var totalCount = $('input.salesManager-checkbox:checked').length;

            if ($(element).hasClass('notRemovable')) {
                $(element).prop('checked', false);

                return false;
            }

            if (checked) {
                self.selectedSalesManagers.push(salesManagerId);
            } else if (this.selectedSalesManagers.length > 1) {
                self.selectedSalesManagers = _.without(self.selectedSalesManagers, salesManagerId);
            }

            if (totalCount === 0) {
                self.selectedSalesManagers = [];
                self.$el.find('#removeSalesManager').hide();
            } else {
                self.$el.find('#removeSalesManager').show();
            }

            if (totalCount > 0 && totalCount === countCheckbox) {
                $('#check_all_salesManagers').prop('checked', true);
            } else {
                $('#check_all_salesManagers').prop('checked', false);
            }
        },

        editNewRow : function (e){
            e.stopPropagation();
            var target = $(e.target);
            var text = target.text();
            target.html('<input class="extrainfo" type="text" name="date" id="date" value="'+ text + '" readonly="" placeholder="Date">');

            this.$el.find('#date').datepicker({
                dateFormat : "d M, yy",
                changeMonth: true,
                changeYear : true,
                minDate    : this.model.get('StartDate')
            });

        },

        hideNewSelect: function () {
            var editedElement = this.$el.find('.extrainfo');
            var editedElementValue = editedElement.val();
            var $editedCol = editedElement.closest('td');
            $editedCol.text(editedElementValue);
            editedElement.remove();

            $(".newSelectList").hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        saveSalesManager: function (e) {
            e.preventDefault();

            var thisEl = this.$el;
            var newSalesManager = thisEl.find('tr a.current-selected');
            var managerTd = newSalesManager.closest('td');
            var managerRow = newSalesManager.closest('tr');
            var elValue = newSalesManager.text();
            newSalesManager.remove();
            managerTd.text(elValue);
            thisEl.find('.editable').removeClass('editable');
            thisEl.find('.notRemovable').removeClass('notRemovable');
            managerRow.find('.salesManager-checkbox').addClass('notRemovable');

            this.rerenderNumbers();

            thisEl.find('#saveSalesManager').hide();
            thisEl.find('#updateSalesManager').show();


            this.trigger('save');
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
            if (Object.keys(this.responseObj).length) {
                this.selectView = new selectView({
                    e          : e,
                    responseObj: this.responseObj
                });
                $target.append(this.selectView.render().el);
            }

            return false;
        },


        chooseOption: function (e) {

            var target = $(e.target);
            var targetElement = target.parents('td');
            var targetRow = target.parents('tr');
            var id = target.attr('id');
            var selectorContainer;
            var i;
            var salesManagers = this.modelJSON.salesManagers;
            var prevSales = salesManagers[salesManagers.length - 1].manager._id;

            if (prevSales === id) {
                return false;
            }


            targetElement.attr('data-id', id);
            targetRow.attr('data-id', id);
            selectorContainer = targetElement.find('a.current-selected');

            selectorContainer.text(target.text());
            this.hideNewSelect();

            return false;
        },

        updateSalesManager: function (e) {
            e.preventDefault();
            var self = this;
            var target = $(e.target);


            var newElements = this.$el.find('#false');

            var date = common.utcDateToLocaleDate(new Date().toString());
            if (!newElements.length){
                this.$el.find('#salesManagersTable').append(_.template(updateSalesManager, {date : date}));
            }
            target.hide();
            self.$el.find('#saveSalesManager').show();

            if (!Object.keys(this.responseObj).length){
                dataService.getData('/employee/getByDepartments', {departments: ["BusinessDev", "PM"]}, function (employees) {
                    employees = _.map(employees.data, function (employee) {
                        employee.name = employee.name.first + ' ' + employee.name.last;

                        return employee;
                    });

                    self.responseObj['#employee'] = employees;
                });
            }
        },

        removeSalesManager: function (e) {
            e.preventDefault();

            var self = this;
            var element;

            self.selectedSalesManagers.forEach(function (salesManager) {
                element = self.$el.find("tr[data-id=" + salesManager + "]");
                element.remove();
            });

            self.selectedSalesManagers = [];
            self.$el.find('#removeSalesManager').hide();
            $('#check_all_salesManagers').prop('checked', false);
            this.rerenderNumbers();
            this.trigger('save');
        },

        rerenderNumbers: function () {
            var tableTr = $('#salesManagersTable').find('tr');

            tableTr.each(function (index) {
                $(this).find('.countNumber').text(index + 1);
            });

        },

        checkAllSalesManagers: function (e) {
            var self = this;
            var element = e.target;
            var checked = element.checked;
            var bonusId;

            if (checked) {
                $('input.salesManager-checkbox:not(.notRemovable)').each(function (key, input) {
                    $(input).prop('checked', true);
                    bonusId = input.value;
                    self.selectedSalesManagers.push(bonusId);
                    self.$el.find('#removeSalesManager').show();
                });
            } else {
                $('input.salesManager-checkbox').each(function (key, input) {
                    self.selectedSalesManagers = [];
                    $(input).prop('checked', false);
                    self.$el.find('#removeSalesManager').hide();
                });
            }
        },

        render: function () {
            var self = this;
            var salesManagers = this.model.get('salesManagers');

            self.$el.html(this.template({
                salesManagers      : salesManagers,
                utcDateToLocaleDate: common.utcDateToLocaleDate
            }));

            self.$el.find('#removeSalesManager, #saveSalesManager').hide();
            /*self.$el.find('#saveSalesManager').hide();*/

            return this;
        }
    });

    return SalesManagersView;
});