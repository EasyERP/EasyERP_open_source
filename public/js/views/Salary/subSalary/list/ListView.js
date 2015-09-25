define([
        'text!templates/Salary/subSalary/list/ListHeader.html',
        'text!templates/Salary/subSalary/list/cancelEdit.html',
        'views/Salary/subSalary/CreateView',
        'views/Salary/subSalary/list/ListItemView',
        'text!templates/Salary/subSalary/list/ListTotal.html',
        'collections/Salary/editCollection',
        'collections/Employees/employee',
        'models/SalaryModel',
        'populate',
        'dataService',
        'async',
        'moment',
        'helpers'
],

function (listTemplate, cancelEdit, createView, listItemView, subSalaryTotalTemplate, salaryEditableCollection, employeesCollection, currentModel, populate, dataService, async, moment, helpers) {
    var subSalaryListView = Backbone.View.extend({
        viewType: 'list',//needs in view.prototype.changeLocationHash
        responseObj: {},
        editCollection: null,
        bodyContainerId: '',
        bodyContainer: null,
        whatToSet: {},

        initialize: function (options) {
            this.model = options.model;
            this.id = this.model.id;

            this.bodyContainerId = '#subSalary-listTable' + this.id;

            this.deleteButton ='#top-bar-createBtn' + this.id;
            this.events['click ' + this.deleteButton] = 'createItem';
            this.delegateEvents();

            this.deleteButton ='#top-bar-deleteBtn' + this.id;
            this.events['click ' + this.deleteButton] = 'deleteItems';
            this.delegateEvents();

            this.deleteButton ='#top-bar-saveBtn' + this.id;
            this.events['click ' + this.deleteButton] = 'saveItem';
            this.delegateEvents();

            this.employeesArary = this.model.toJSON().employeesArray;

            this.employeesStartCollection = new salaryEditableCollection(this.employeesArary);

            this.render();
            this.contentCollection = salaryEditableCollection;
        },

        events: {
            "click td:not(.editable, .notForm)": "tdDisable",
            "click .checkbox": "checked",
            "click .newSelectList li.miniStylePagination .next:not(.disabled)": "nextSelect",
            "click .newSelectList li.miniStylePagination .prev:not(.disabled)": "prevSelect",
            "click td.editable": "editRow",
            "click .newSelectList li:not(.miniStylePagination)": "chooseOption",
            "change .autoCalc": "autoCalc",
            "change .editable": "setEditable",
            "click .oe_sortable_sub": "goSort",
            "keydown input.editing ": "keyDown"
        },

        keyDown: function (e) {
            if (e.which === 13) {
                var editedElement = this.bodyContainer.find('.editing');
                var editedCol;
                var editedElementValue;

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementValue = editedElement.val();

                    editedCol.text(editedElementValue);
                    editedElement.remove();
                }
            }
        },

        goSort: function (e) {
            e.preventDefault();
            var target$ = $(e.target);
            var currentParrentSortClass = target$.attr('class');
            var sortClass = currentParrentSortClass.split(' ')[1];
            var sortField = target$.attr('data-sort');
            var sortConst = 1;

            if (!sortClass) {
                target$.addClass('sortDn');
                sortClass = "sortDn";
            }
            switch (sortClass) {
                case "sortDn":
                {
                    target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                }
                    break;
                case "sortUp":
                {
                    target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
                }
                    break;
            }

            this.sortByOrder({orderField: sortField, order: sortConst});

            this.renderTable();
        },

        sortByOrder: function(options) {
            var collection;
            var order = options.order || 1;
            var orderField = options.orderField || 'employee.name';

            collection = this.model.get('employeesArray');
            collection = _.sortBy(collection, function(model) {
                var orderField1;
                var orderField2;
                var fullField = orderField.split(".");

                orderField1 = fullField[0];
                orderField2 = fullField[1];

                if (orderField2) {
                    return model[orderField1][orderField2];
                } else {
                    return model[orderField1];
                }
            });

            if (order < 0) {
                collection.reverse();
            }

            this.model.set('employeesArray', collection);
        },

        renderTable: function() {
            var itemView;

            this.$el.find(this.bodyContainerId).html('');
            itemView = new listItemView({
                el: this.bodyContainerId,
                model: this.model
            });
            $(this.bodyContainerId).append(itemView.render());
        },

        autoCalc: function (e) {
            var el = $(e.target);
            var td = $(el.closest('td'));
            var tr = el.closest('tr');
            var input = tr.find('input.editing');
            var salaryId = tr.data('id');
            var editEmployeeModel = this.editCollection.get(salaryId);

            var diffOnCash = tr.find('.diff[data-content="onCash"]');
            var diffOnCard = tr.find('.diff[data-content="onCard"]');
            var diffTotal = tr.find('.diff[data-content="total"]');

            var value;
            var totalValue;
            var calcKey;
            var tdForUpdate;
            var paid;
            var calc;
            var diffObj;

            var diffOnCardRealValue;
            var diffOnCashRealValue;

            if ($(td).hasClass('cash')) {
                calcKey = 'onCash';
                tdForUpdate = diffOnCash;
                paid = tr.find('.paid[data-content="onCash"]').text() ;
                calc = tr.find('.calc[data-content="onCash"]').text();
            } else if ($(td).hasClass('card')) {
                calcKey = 'onCard';
                tdForUpdate = diffOnCard;
                paid = tr.find('.paid[data-content="onCard"]').text();
                calc = tr.find('.calc[data-content="onCard"]').text();
            }

            if (tdForUpdate) {

                paid = paid ? parseInt(paid) : input.val();
                calc = calc ? parseInt(calc) : input.val();

                value = paid - calc;

                tdForUpdate.text(this.checkMoneyTd(tdForUpdate, value));

                diffOnCashRealValue = diffOnCash.attr('data-value');
                diffOnCashRealValue = diffOnCashRealValue ? diffOnCashRealValue : diffOnCash.text();

                diffOnCardRealValue = diffOnCard.attr('data-value');
                diffOnCardRealValue = diffOnCardRealValue ? diffOnCardRealValue : diffOnCard.text();

                totalValue = parseInt(diffOnCashRealValue) + parseInt(diffOnCardRealValue);
                diffTotal.text(this.checkMoneyTd(diffTotal, totalValue));

                diffObj = _.clone(editEmployeeModel.get('diff'));
                diffObj['total'] = totalValue;
                diffObj[calcKey] = value;

                this.whatToSet['diff'] = diffObj;
            }

            this.getTotal(td);
        },

        checkMoneyTd: function(td, value) {
            var moneyClassCheck = $(td).hasClass('money');
            var negativeMoneyClass = $(td).hasClass('negativeMoney');

            if (value < 0) {
                if (moneyClassCheck) {
                    $(td).removeClass('money');
                }
                $(td).addClass('negativeMoney');
                $(td).attr('data-value', value);
                value *= -1;
            } else {
                if (negativeMoneyClass) {
                    $(td).removeClass('negativeMoney');
                }
                $(td).addClass('money');
            }
            return value;
        },

        getTotal: function (td) {
            var self = this;
            var className;

            if (td && td.hasClass('calc')) {
                className = 'calc';
            } else if (td && td.hasClass('paid')) {
                className = 'paid';
            };

            function setTotal (name, className) {
                var tdVal;
                var addVal = 0;
                var calcVal = 0;
                var input;

                var diffNameVal = 0;
                var diffTotalVal = 0;

                var diffOnCash;
                var diffOnCard;

                var diffByNameElement;

                self.bodyContainer.find('.' + className + '[data-content="' + name +'"]').each(function() {
                    input = $(this).find('input.editing');
                    tdVal = $(this).attr('data-value');
                    tdVal = tdVal ? tdVal : $(this).text();
                    if (tdVal.length === 0){
                        tdVal = '0';
                    }
                    addVal = tdVal ? parseInt(tdVal) :  parseInt(input.val());
                    calcVal += addVal;
                });

                $('#subSalary-listTotal' + self.id).find('.total_' + className + '_' + name).text(calcVal);
                $('tr[data-id="' + self.id + '"]').find('.total_' + className + '_' + name).text(calcVal);

                if ( name === 'onCard' || name === 'onCash' ) {
                    diffByNameElement = $('#subSalary-listTotal' + self.id).find('.total_diff_' + name);

                    diffNameVal = parseFloat($('#subSalary-listTotal' + self.id).find('.total_calc_' + name).text()) - parseFloat($('#subSalary-listTotal' + self.id).find('.total_paid_' + name).text());

                    diffByNameElement.text(self.checkMoneyTd(diffByNameElement, diffNameVal));
                    $('tr[data-id="' + self.id + '"]').find('.total_diff_' + name).text(diffNameVal);

                    diffOnCash = parseFloat($('#subSalary-listTotal' + self.id).find('.total_diff_onCash').text());
                    diffOnCard = parseFloat($('#subSalary-listTotal' + self.id).find('.total_diff_onCard').text());

                    diffTotalVal = parseInt(diffOnCash) + parseInt(diffOnCard);
                    $('#subSalary-listTotal' + self.id).find('.total_diff').text(diffTotalVal);
                }
            };

            if (td) {
                setTotal(td.data('content'), className);
            } else {
                setTotal('onCash', 'calc');
                setTotal('onCash', 'paid');

                setTotal('onCard', 'calc');
                setTotal('onCard', 'paid');

                setTotal('salary', 'calc');
            }
        },

        saveItem: function (e) {
            e.preventDefault();

            this.editCollection.save();
            this.editCollection.on('saved', this.savedNewModel, this);
            this.editCollection.on('updated', this.updatedOptions, this);

            dataService.getData('/salary/recalculateSalaryCash', {}, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        createItem: function (e) {
            e.preventDefault();

            var month = this.model.get('month');
            var year = this.model.get('year');

            var momentYear = moment().year(year).format('YY');
            var momentMonth = moment().month(month - 1).format('MMM');


            var startData = {
                dataKey: momentMonth + "/" + momentYear,
                baseSalary: 0,
                month: month,
                year: year,
                diff: {
                    onCash: 0,
                    onCard: 0,
                    total: 0
                },
                paid: {
                    onCash: 0,
                    onCard: 0
                },
                calc: {
                    onCash: 0,
                    onCard: 0,
                    salary: 0
                },
                employee: {
                    name: '',
                    _id: null
                }
            }

            var model = new currentModel(startData);



            startData.cid = model.cid;

            if (!this.isNewRow()) {
                this.showSaveCancelBtns();
                this.editCollection.add(model);

                new createView({model: startData, el: "#subSalary-listTable" + this.id});
            }
        },

        isNewRow: function () {
            var newRow = $('#false');

            return !!newRow.length;
        },

        savedNewModel: function(modelObject){
            var savedRow = this.bodyContainer.find('#false');
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

        deleterender: function() {
            this.resetCollection();
            this.render();
            this.bodyContainer = $(this.bodyContainerId);
            this.getTotal();

            dataService.getData('/salary/recalculateSalaryCash', {}, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
        },

        deleteItems: function (e) {
            e.preventDefault();
            var that = this,
                mid = 39,
                model;
            var count = $(this.bodyContainerId + " input:checked").length;
            this.collectionLength = this.editCollection.length;

            if (!this.changed) {
                var answer = confirm("Realy DELETE items ?!");
                var value;
                var localCounter = 0;

                if (answer === true) {
                    $.each($(this.bodyContainerId + " input:checked"), function (index, checkbox) {
                        value = checkbox.value;

                        if (value.length < 24) {
                            that.editCollection.remove(value);
                            that.editCollection.on('remove', function () {
                                localCounter ++;
                                if (localCounter === count) {
                                    that.deleterender();
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
                                    localCounter ++;
                                    if (localCounter === count) {
                                        that.deleterender();
                                    }
                                },
                                error: function (model, res) {
                                    if (res.status === 403 && index === 0) {
                                        alert("You do not have permission to perform this action");
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
            var collection = this.employeesStartCollection;

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
            var edited = this.bodyContainer.find('.edited');

            this.edited = edited;

            return !!edited.length;
        },

        setEditable: function (td) {

            if(!td.parents) {
                td = $(td.target).closest('td');
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
                    $('#top-bar-deleteBtn' + this.id).show();
                    if (checkLength == this.editCollection.length) {
                        $('#check_all' + this.id).prop('checked', true);
                    }
                } else {
                    $('#top-bar-deleteBtn' + this.id).hide();
                    $('#check_all' + this.id).prop('checked', false);
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
            var editEmployeeModel;
            var editedElement;
            var editedCol;
            var editedElementRowId;
            var editedElementValue;
            var editedElementContent;

            var calc;
            var paid;

            if (salaryId && el.prop('tagName') !== 'INPUT') {
                if (this.salaryId) {
                    editedElement = this.bodyContainer.find('.editing');

                    if (editedElement.length) {
                        editedCol = editedElement.closest('td');
                        editedElementRowId = editedElement.closest('tr').data('id');
                        editedElementContent = editedCol.data('content');
                        editedElementValue = editedElement.val();

                        editEmployeeModel = this.editCollection.get(editedElementRowId);
                        calc = _.clone(editEmployeeModel.get('calc'));
                        paid = _.clone(editEmployeeModel.get('paid'));

                        if (editedCol.hasClass('calc')) {
                            if (editedCol.data('content') === 'salary') {
                                this.whatToSet['baseSalary'] = editedElementValue;
                            }// else {
                                calc[editedElementContent] = editedElementValue;
                                this.whatToSet['calc'] = calc;
                            //}
                        } else if (editedCol.hasClass('paid')) {
                            paid[editedElementContent] = editedElementValue;
                            this.whatToSet['paid'] = paid;
                        } else {
                            this.whatToSet[editedElementContent] = editedElementValue;
                        }

                        editEmployeeModel.set(this.whatToSet);

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

            var editSalaryModel = this.editCollection.get(modelId);

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
                el: this.bodyContainerId,
                model: this.model
            }).render());//added two parameters page and items number

            var temp = _.template(subSalaryTotalTemplate, modelJSON, helpers.currencySplitter);
            currentEl.find('#subSalary-listTotal'  + this.model.id).append(temp);
            this.filterEmployeesForDD(this);

            this.hideSaveCancelBtns();
            $('#top-bar-deleteBtn' + this.id).hide();

            $('#check_all' + this.model.id).click(function () {
                $(self.bodyContainerId).find('.checkbox').prop('checked', this.checked);
                if ($(self.bodyContainerId).find("input.checkbox:checked").length > 0) {
                    $("#top-bar-deleteBtn" + self.model.id).show();
                } else {
                    $("#top-bar-deleteBtn" + self.model.id).hide();
                }
            });

            setTimeout(function () {
                self.editCollection = new salaryEditableCollection(self.employeesArary);

                self.editCollection.on('saved', self.savedNewModel, self);
                self.editCollection.on('updated', self.updatedOptions, self);

                self.bodyContainer = $(self.bodyContainerId);
            }, 10);/*

            $('#top-bar-saveBtn' + self.id).click(this.saveItem);
            $('#top-bar-deleteBtn' + self.id).click(this.deleteItems);*/
            return this;
        }
    });

    return subSalaryListView;
});
