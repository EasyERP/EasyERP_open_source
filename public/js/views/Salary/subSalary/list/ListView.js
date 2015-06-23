define([
        'text!templates/Salary/subSalary/list/ListHeader.html',
        'text!templates/Salary/subSalary/list/cancelEdit.html',
        'views/Salary/subSalary/list/ListItemView',
        'text!templates/Salary/subSalary/list/ListTotal.html',
        'collections/Salary/editCollection',
        'collections/Employees/employee',
        'models/SalaryModel',
        'populate',
        'dataService',
        'async'
],

function (listTemplate, cancelEdit, listItemView, subSalaryTotalTemplate, salaryEditableCollection, employeesCollection, currentModel, populate, dataService, async) {
    var subSalaryListView = Backbone.View.extend({
        viewType: 'list',//needs in view.prototype.changeLocationHash
        responseObj: {},

        initialize: function (options) {
            this.model = options.model;
            this.id = this.model.id;

            this.bodyContainer = '#subSalary-listTable' + this.id;

            this.deleteButton ='#top-bar-deleteBtn' + this.id;
            this.events['click ' + this.deleteButton] = 'deleteItems';
            this.delegateEvents();

            this.employeesArary = this.model.toJSON().employeesArray;

            this.render();
        },

        events: {
            "click .checkbox": "checked",
            "click td:not(.editable)": "tdDisable",
            "click td.editable": "editRow",
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            "click .newSelectList li.miniStylePagination": "notHide",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
            "change .editable": "setEditable"
        },

        saveItem: function (e) {
            e.preventDefault();
            this.editCollection.save();
            this.editCollection.on('saved', this.savedNewModel, this);
            this.editCollection.on('updated', this.updatedOptions, this);

            dataService.getData('/salary/recalculateSalaryCash', {}, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
            this.reRender();
        },

        savedNewModel: function(modelObject){
            var savedRow = this.$(this.bodyContainer).find('#false');
            var modelId;
            var checkbox = savedRow.find('input[type=checkbox]');

            modelObject = modelObject.success;

            if(modelObject) {
                modelId = modelObject._id
                savedRow.attr("data-id", modelId);
                checkbox.val(modelId);
                savedRow.removeAttr('id');
            }

            this.hideSaveCancelBtns();
            this.resetCollection(modelObject);
        },

        resetCollection: function(model){
            if(model && model._id){
                model = new currentModel(model);
                this.editCollection.add(model);
            } else {
                this.model.set({"employeesArray": this.editCollection.toJSON()}, {remove: false});
            }
        },

        reRender: function (deleteCounter, deletePage) {
            this.model.set({"employeesArray": this.editCollection.toJSON()});
            this.render();
        },


        deleteItems: function (e) {
            e.preventDefault();
            var currentEl = this.$el;
            var that = this,
                mid = 39,
                model;
            var localCounter = 0;
            var count = $(this.bodyContainer + " input:checked").length;
            this.collectionLength = this.editCollection.length;

            if (!this.changed) {
                var answer = confirm("Realy DELETE items ?!");
                var value;

                if (answer === true) {
                    $.each($(this.bodyContainer + " input:checked"), function (index, checkbox) {
                        value = checkbox.value;

                        if (value.length < 24) {
                            that.editCollection.remove(value);
                            that.editCollection.on('remove', function () {

                                this.listLength--;
                                localCounter++;

                                if (index === count - 1) {
                                    that.reRender();
                                }

                            }, that);
                        } else {

                            model = that.editCollection.get(value);
                            model.destroy({
                                headers: {
                                    mid: mid
                                },
                                wait: true,
                                success: function () {
                                    dataService.getData('/salary/recalculateSalaryCash');

                                    that.listLength--;
                                    localCounter++;

                                    if (index === count - 1) {
                                        that.reRender();
                                    }
                                },
                                error: function (model, res) {
                                    if (res.status === 403 && index === 0) {
                                        alert("You do not have permission to perform this action");
                                    }
                                    that.listLength--;
                                    localCounter++;
                                    if (index == count - 1) {
                                        if (index === count - 1) {
                                            that.reRender();
                                        }
                                    }

                                }
                            });
                        }
                    });
                }
            } else {
                this.cancelChanges();
            }
        },

        cancelChanges: function () {
            var self = this;
            var edited = this.edited;
            var collection = this.employeesCollection;

            async.each(edited, function (el, cb) {
                var tr = $(el).closest('tr');
                var rowNumber = tr.find('[data-content="number"]').text();
                var id = tr.data('id');
                var template = _.template(cancelEdit);
                var model;

                if (!id) {
                    return cb('Empty id');
                }

                model = collection.get(id);
                model = model.toJSON();
                model.dataKey = self.model.attributes.dataKey;
                model.index = rowNumber;
                tr.replaceWith(template({employee: model}));
                cb();
            }, function (err) {
                if (!err) {
                    self.editCollection = new salaryEditableCollection(self.employeesArary);
                    self.hideSaveCancelBtns();
                }
            });
        },

        updatedOptions: function(){
            this.hideSaveCancelBtns();
            this.resetCollection();
        },

        tdDisable: function (e) {
            e.preventDefault();
            return false;
        },

        isEditRows: function () {
            var edited = this.$(this.bodyContainer).find('.edited');

            this.edited = edited;

            return !!edited.length;
        },

        setEditable: function (td) {
            if(!td.parents) {
                td = $(td.target);
            }

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
            var createBtnEl = $('#top-bar-createBtn' + this.id);
            var saveBtnEl = $('#top-bar-saveBtn' + this.id);
            var cancelBtnEl = $('#top-bar-deleteBtn' + this.id);

            if (!this.changed) {
                createBtnEl.hide();
            }
            saveBtnEl.show();
            cancelBtnEl.show();

            return false;
        },

        hideSaveCancelBtns: function () {
            var createBtnEl = $('#top-bar-createBtn' + this.id);
            var saveBtnEl = $('#top-bar-saveBtn' + this.id);
            var cancelBtnEl = $('#top-bar-deleteBtn' + this.id);

            this.changed = false;

            saveBtnEl.hide();
            cancelBtnEl.hide();
            createBtnEl.show();

            return false;
        },

        checked: function () {
            if (this.editCollection.length > 0) {
                var checkLength = $("input.checkbox:checked").length;

                if ($("input.checkbox:checked").length > 0) {
                    $("#top-bar-deleteBtn").show();
                    if (checkLength == this.editCollection.length) {
                        $('#check_all').prop('checked', true);
                    }
                } else {
                    $("#top-bar-deleteBtn").hide();
                    $('#check_all').prop('checked', false);
                }
            }
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

            if (salaryId && el.prop('tagName') !== 'INPUT') {
                if (this.salaryId) {
                    editedElement = this.$(this.bodyContainer).find('.editing');

                    if (editedElement.length) {
                        editedCol = editedElement.closest('td');
                        editedElementRowId = editedElement.closest('tr').data('id');
                        editedElementContent = editedCol.data('content');
                        editedElementValue = editedElement.val();

                        editEmployyeModel = this.editCollection.get(editedElementRowId);
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
            var self = this;
            var currentEl = this.$el;
            var modelJSON = this.model.toJSON();

            currentEl.html('');
            currentEl.append(_.template(listTemplate, modelJSON));
            currentEl.append(new listItemView({
                el: this.bodyContainer,
                model: this.model
            }).render());//added two parameters page and items number

            currentEl.find('#subSalary-listTotal'  + this.model.id).append(_.template(subSalaryTotalTemplate, modelJSON));

            this.filterEmployeesForDD(this);

            this.hideSaveCancelBtns();
            $('#top-bar-deleteBtn' + this.id).hide();

            setTimeout(function () {
                self.employeesCollection = new salaryEditableCollection(self.employeesArary);
                self.editCollection = self.employeesCollection;

                self.editCollection.on('saved', self.savedNewModel, self);
                self.editCollection.on('updated', self.updatedOptions, self);
            }, 10);/*

            $('#top-bar-saveBtn' + self.id).click(this.saveItem);
            $('#top-bar-deleteBtn' + self.id).click(this.deleteItems);*/
            return this;
        }
    });

    return subSalaryListView;
});
