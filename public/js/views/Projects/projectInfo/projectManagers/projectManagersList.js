define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Projects/projectInfo/projectManagers/projectManagersTemplate.html',
    'text!templates/Projects/projectInfo/projectManagers/updateProjectManager.html',
    'views/selectView/selectView',
    'common',
    'dataService'
], function (Backbone, $, _, salesManagersTemplate, updateSalesManager, SelectView, common, dataService) {
    'use strict';

    var ProjectManagersView = Backbone.View.extend({

        initialize: function (options) {
            this.model = options.model;
            this.responseObj = {};
            this.modelJSON = this.model.id ? this.model.toJSON() : this.model;
        },

        template: _.template(salesManagersTemplate),

        events: {
            'click'                                            : 'hideNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click a.current-selected'                         : 'showNewSelect',
            'click #addPM'                                     : 'addPM',
            'click .editable'                                  : 'editNewRow',
            'click .fa-trash'                                  : 'removeSalesManager'
        },

        editLastPM: function () {
            var table = this.$el.find('#projectManagersTable');
            var trs = table.find('tr');
            var removeBtn = '<a href="javascript;" class="fa fa-trash"></a>';
            var lastPm;

            trs.find('td:first-child').text('');

            if (trs.length > 1){
                trs.last().find('td').first().html(removeBtn);
            }

            trs.last().find('.projectManagerDate').addClass('editable');
            lastPm = trs.last().find('td').last().text() || 'Select';
            trs.last().find('td').last().html('<a id="employee" class="current-selected" href="javascript:;">'+ lastPm +'</a>');
        },

        editNewRow: function (e) {
            var target = $(e.target);
            var row = target.parent('tr');
            var prevSalesDate = row.prev().find('.salesManagerDate').text();
            var prevDate = common.utcDateToLocaleDate(prevSalesDate);
            var text;
            if (target.prop('tagName') !== 'INPUT') {
                this.hideNewSelect();
            }
            text = (target.text()).trim();

            target.html('<input class="extrainfo" type="text" name="date" id="date" value="' + text + '" readonly="" placeholder="Date">');

            this.$el.find('#date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : prevDate || this.model.get('StartDate'),
                onSelect   : function (dateText) {
                    var $editedCol = target.closest('td');
                    $editedCol.text(dateText);
                    $('#top-bar-saveBtn').show();
                }
            });
            this.$el.find('#date').datepicker('show');

            return false;
        },

        hideNewSelect: function () {
            var $editedDate = this.$el.find('.extrainfo');
            var $editedCol = $editedDate.closest('td');

            $editedCol.text($editedDate.val());
            $('.newSelectList').hide();

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
            if (Object.keys(this.responseObj).length) {
                this.selectView = new SelectView({
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
            var prevSales = targetRow.prev().attr('data-id');
            var selectorContainer;

            if (prevSales === id) {
                return App.render({
                    type   : 'error',
                    message: 'Please choose another Sales Manager'
                });
            }

            targetRow.attr('data-id', id);
            selectorContainer = targetElement.find('a.current-selected');

            selectorContainer.text(target.text());
            $('#top-bar-saveBtn').show();

            this.hideNewSelect();

            return false;
        },

        addPM: function (e) {
            var employeeSelect = this.$el.find('.current-selected');
            var emptyPm = this.$el.find('#employee').text() === 'Select';
            var prevDate = this.$el.find('#projectManagersTable .salesManagerDate').last().text();
            var date = common.utcDateToLocaleDate(prevDate || this.model.get('StartDate'));

            e.preventDefault();

            if (emptyPm) {
                return App.render({
                    type   : 'error',
                    message: 'Please select Project Manager first.'
                });
            }

            if (this.$el.find('.editable').length && employeeSelect.length) {
                this.$el.find('.editable').removeClass('editable');
                employeeSelect.parent('td').text(employeeSelect.text());
                employeeSelect.remove();
            }

            this.$el.find('#projectManagersTable').append(_.template(updateSalesManager, {date: date}));

            $('#top-bar-saveBtn').show();
            this.editLastPM();
        },

        removeSalesManager: function (e) {
            var target = $(e.target);
            var row = target.closest('tr');

            e.preventDefault();
            row.remove();
            $('#top-bar-saveBtn').show();

            this.editLastPM();
        },

        render: function () {
            var self = this;
            var projectManagers = this.model.get('projectManagers');

            self.$el.html(this.template({
                projectManagers      : projectManagers,
                utcDateToLocaleDate: common.utcDateToLocaleDate
            }));

            dataService.getData('/employee/getForDD', {salesDepartments: true, isEmployee: true}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#employee'] = employees;
            });

            this.editLastPM();

            return this;
        }
    });

    return ProjectManagersView;
});
