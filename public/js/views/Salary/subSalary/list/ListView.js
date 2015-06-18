define([
        'text!templates/Salary/subSalary/list/ListHeader.html',
        'views/Salary/subSalary/list/ListItemView',
        'collections/Employees/employee',
        'populate',
        'dataService'
],

function (listTemplate, listItemView, employeesCollection, populate, dataService) {
    var subSalaryListView = Backbone.View.extend({
        el: '#subSalary-holder',
        viewType: 'list',//needs in view.prototype.changeLocationHash
        
        initialize: function (options) {

            var paretntSalaryModel = Backbone.Model.extend({
                idAttribute: "_id"
            });

            this.parentSalaryCollection = Backbone.Collection.extend({
                model: paretntSalaryModel
            })

            this.model = options.model;
            this.responseObj = {};

            this.render();
        },

        events: {
            "click .checkbox": "checked",
            "click td.editable": "editRow",
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            "click .newSelectList li.miniStylePagination": "notHide",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
            "change .editable ": "setEditable"
        },

        isEditRows: function () {
            var edited = this.$('#subSalary-listTable').find('.edited');

            this.edited = edited;

            return !!edited.length;
        },

        setEditable: function (td) {
            var tr = $(td).closest('tr');

            td.addClass('edited');

            if (this.isEditRows()) {
                this.setChangedValue();
            }

            return false;
        },

        setChangedValue: function () {
            if (!this.changed) {
                this.changed = true;
                this.showSaveCancelBtns()
            }
        },

        showSaveCancelBtns: function () {
            var createBtnEl = $('#top-bar-createBtn');
            var saveBtnEl = $('#top-bar-saveBtn');
            var cancelBtnEl = $('#top-bar-deleteBtn');

            if (!this.changed) {
                createBtnEl.hide();
            }
            saveBtnEl.show();
            cancelBtnEl.show();

            return false;
        },

        editRow: function (e, prev, next) {
            $(".newSelectList").hide();

            var el = $(e.target);
            var tr = $(e.target).closest('tr');
            var salaryId = tr.data('id');
            var colType = el.data('type');
            var isSelect = colType !== 'input' && el.prop("tagName") !== 'INPUT';
            var tempContainer;
            var width;
            var editEmployyeModel;
            var editedElement;
            var editedCol;
            var editedElementRowId;
            var editedElementValue;
            var editedElementContent;
            var curRowModel = this.model.toJSON();

            if (salaryId && el.prop('tagName') !== 'INPUT') {
                if (this.salaryId) {
                    editedElement = this.$('#subSalary-listTable').find('.editing');

                    if (editedElement.length) {
                        editedCol = editedElement.closest('td');
                        editedElementRowId = editedElement.closest('tr').data('id');
                        editedElementContent = editedCol.data('content');
                        editedElementValue = editedElement.val();

                        curRowModel.employeesArray = new this.parentSalaryCollection(curRowModel.employeesArray);

                        editEmployyeModel = curRowModel.employeesArray.get(editedElementRowId);
                        editEmployyeModel.set(editedElementContent, editedElementValue);

                        editedCol.text(editedElementValue);
                        editedElement.remove();
                    }
                }
                this.salaryId = salaryId;
            }


            if (isSelect) {
                populate.showSelect(e, prev, next, this);
            } else {
                tempContainer = el.text();
                width = el.width() - 6;
                el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="4" style="width:' + width + 'px">');
            }

            return false;
        },

        filterEmployeesForDD: function (content) {
            dataService.getData("/employee/getForDD", null, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee
                });

                content.responseObj['#employee'] = employees;
            });
        },

        showNewSelect: function (e, prev, next) {
            e.stopPropagation();
            populate.showSelect(e, prev, next, this);

            return false;
        },


        notHide: function () {
            return false;
        },

        hideNewSelect: function () {
            $(".newSelectList").hide();
        },

        chooseOption: function (e) {
            e.preventDefault();
            var target = $(e.target);
            var targetElement = target.closest("td");
            var tr = target.closest("tr");
            var modelId = tr.data('id');
            var id = target.attr("id");
            var attr = targetElement.attr("id") || targetElement.data("content");
            var elementType = '#' + attr;
            var element = _.find(this.responseObj[elementType], function (el) {
                return el._id === id;
            });

            var editSalaryModel = this.model;

            if (elementType === '#employee') {
                tr.find('[data-content="employee"]').text(element.name);

                editSalaryModel.set({
                    employee: {
                        _id: element._id,
                        name: target.text()
                    }
                });
            }

            targetElement.text(target.text());

            this.hideNewSelect();
            this.setEditable(targetElement);

            return false;
        },
        nextSelect: function (e) {
            this.showNewSelect(e, false, true);
        },
        prevSelect: function (e) {
            this.showNewSelect(e, true, false);
        },
        
        render: function () {
            var currentEl = this.$el;

            currentEl.html('');
            currentEl.append(_.template(listTemplate));
            currentEl.append(new listItemView({
                model: this.model
            }).render());//added two parameters page and items number

            $('#check_all').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            });

            this.filterEmployeesForDD(this);
        }
    });

    return subSalaryListView;
});
