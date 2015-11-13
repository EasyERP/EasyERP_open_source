define([
        'text!templates/PayrollExpenses/list/ListHeader.html',
        'text!templates/PayrollExpenses/list/cancelEdit.html',
        'text!templates/PayrollExpenses/list/ListTotal.html',
        'views/listViewBase',
        'views/Filter/FilterView',
        'views/PayrollExpenses/generate/GenerateView',
        'views/PayrollExpenses/CreateView',
        "views/PayrollPayments/CreateView",
        'collections/PayrollExpenses/editCollection',
        'collections/PayrollExpenses/oneMonthCollection',
        'collections/Employees/employee',
        'models/PayRollModel',
        'populate',
        'dataService',
        'async',
        'moment',
        'helpers'
    ],

    function (headerTemplate, cancelEditTemplate, totalTemplate, listViewBase, filterView, GenerateView, createView, PaymentCreateView, editCollection, monthCollection, employeesCollection, currentModel, populate, dataService, async, moment, helpers) {
        var payRollListView = listViewBase.extend({
            el: '#content-holder',
            contentType: 'PayrollExpenses',
            viewType: 'list',//needs in view.prototype.changeLocationHash
            responseObj: {},
            whatToSet: {},
            headerTemplate: _.template(headerTemplate),
            totalTemplate: _.template(totalTemplate),
            // rowTemplate   : _.template(rowTemplate),
            cancelTemplate: _.template(cancelEditTemplate),
            changedModels: {},

            events: {
                "click .checkbox": "checked",
                "click td.editable": "editRow",
                "click .newSelectList li": "chooseOption",
                "change .autoCalc": "autoCalc",
                "change .editable": "setEditable",
                "keydown input.editing": "keyDown",
                "click #mainRow td:not(.notForm)": "showRows",
                "click #expandAll": "expandAll",
                "click": "removeNewSelect",
                "click .check_all": "checkAll",
                "click .diff": "newPayment"
            },


            initialize: function (options) {
                var collectionsObjects;

                this.collection = options.collection;
                collectionsObjects = this.collection.toJSON()[0];
                this.collectionOnMonth = new monthCollection(collectionsObjects.collection);

                this.total = collectionsObjects.total;
                this.allCollection = collectionsObjects.allCollection;
                this.startTime = options.startTime;

                this.render();

                this.$bodyContainer = this.$el.find('#payRoll-listTable');
            },

            newPayment: function (e) {
                var checkbox = this.$el.find("input.checkbox:checked");
                var checkboxes = checkbox ? checkbox : [];
                var tr;
                var dataId;
                var model;
                var jsonModel;
                var modelPayment;

                if (checkboxes.length) {
                    for (var i = checkboxes.length - 1; i >= 0; i--) {
                        dataId = $(checkboxes[i]).attr('id');
                        model = this.editCollection.get(dataId);
                        jsonModel = model.toJSON();

                        if (jsonModel.diff < 0) {

                            modelPayment = {
                                "paidAmount": jsonModel.diff * (-1),
                                "workflow": "Draft",
                                "differenceAmount": 0,
                                "month": jsonModel.month,
                                "year": jsonModel.year,
                                "supplier": {
                                    "_id": jsonModel.employee._id,
                                    "fullName": jsonModel.employee.name
                                },
                                "paymentMethod": {
                                    "_id": jsonModel.type._id,
                                    "name": jsonModel.type.name
                                },
                                "period": jsonModel.year + '-' + jsonModel.month + '-01'
                            };

                            this.forPayments.add(modelPayment);
                        }

                    }
                } else if (e.target) {
                    tr = $(e.target).closest('tr');
                    dataId = tr.attr('data-id');

                    model = this.editCollection.get(dataId);
                    jsonModel = model.toJSON();

                    if (jsonModel.diff < 0) {

                        modelPayment = {
                            "paidAmount": jsonModel.diff * (-1),
                            "workflow": "Draft",
                            "differenceAmount": 0,
                            "month": jsonModel.month,
                            "year": jsonModel.year,
                            "supplier": {
                                "_id": jsonModel.employee._id,
                                "fullName": jsonModel.employee.name
                            },
                            "paymentMethod": {
                                "_id": jsonModel.type._id,
                                "name": jsonModel.type.name
                            },
                            "period": jsonModel.year + '-' + jsonModel.month + '-01'
                        };

                        this.forPayments.add(modelPayment);
                    }
                }


                if (this.forPayments.length) {
                    new PaymentCreateView({
                        redirect: this.redirect,
                        collection: this.forPayments
                    });
                } else {
                    return alert("Please, check at most one unpaid item.")
                }

            },

            removeNewSelect: function () {
                $('.newSelectList').remove();
            },

            generate: function () {
                new GenerateView({});
            },

            copy: function () {
                this.hideGenerateCopy();

                var checkedRows = this.$el.find('input.checkbox:checked');
                var selectedRow = checkedRows[0];
                var self = this;
                var target = $(selectedRow);
                var id = target.val();
                var row = target.closest('tr');
                var model = self.editCollection.get(id);
                var _model;
                var tdsArr;
                var cid;
                var calc = (model.changed && model.changed.calc) ? model.changed.calc : model.get('calc');

                $(selectedRow).attr('checked', false);

                model.set({"paid": 0});
                model.set({"diff": calc * (-1)});
                model = model.toJSON();

                delete model._id;
                _model = new currentModel(model);

                this.showSaveCancelBtns();
                this.editCollection.add(_model);

                cid = _model.cid;

                if (!this.changedModels[cid]) {
                    this.changedModels[cid] = model;
                }

                this.$el.find('#payRoll-listTable').prepend('<tr id="false" data-id="' + cid + '">' + row.html() + '</tr>');

                row = this.$el.find('#false');

                tdsArr = row.find('td');
                $(tdsArr[0]).text(1);
                $(tdsArr[3]).addClass('editable');
            },

            hideGenerateCopy: function () {
                $('#top-bar-copy').hide();
            },

            expandAll: function (e) {
                var target = this.$el.find('#expandAll');
                var subRowCheck = this.$el.find('.jobsDashboard');
                var icon = this.$el.find('.expand');

                if (icon.html() === '-') {
                    $(target).text('Expand All');
                    icon.html('+');
                    $(subRowCheck).hide();
                } else {
                    $(target).text('Collapse All');
                    icon.html('-');
                    $(subRowCheck).show();
                }
            },

            showRows: function (e) {
                var target = e.target;
                var dataKey = $(target).parents("tr").attr("data-id");
                var subId = dataKey;
                var subRowCheck = $('.' + subId);
                var container = $(target).parents("tr")[0];
                var icon = $(container).find('.expand');


                if (icon.html() === '-') {
                    icon.html('+');
                    $(subRowCheck).hide();
                } else {
                    icon.html('-');
                    $(subRowCheck).show();
                }

            },

            keyDown: function (e) {
                if (e.which === 13) {
                    this.setChangedValueToModel();
                }
            },

            autoCalc: function (e) {
                var el = $(e.target);
                var td = $(el.closest('td'));
                var tr = el.closest('tr');
                var classTr = tr.attr('class');
                var classArr = classTr.split(' ');
                var parentTr = this.$el.find("[data-id=" + classArr[0] + "]");
                var input = tr.find('input.editing');
                var editedElementRowId = tr.attr('data-id');
                var editModel = this.editCollection.get(editedElementRowId);
                var changedAttr;

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
                var parentKey;

                var diffOnCardRealValue;
                var diffOnCashRealValue;

                var paidTD;
                var calcTD;

                var newValue;
                var subValues = 0;

                if (!this.changedModels[editedElementRowId]) {
                    if (!editModel.id) {
                        this.changedModels[editedElementRowId] = editModel.attributes;
                    } else {
                        this.changedModels[editedElementRowId] = {};
                    }
                }

                if ($(td).hasClass('cash')) {
                    calcKey = 'onCash';
                    tdForUpdate = diffOnCash;
                    paidTD = tr.find('.paid[data-content="onCash"]');
                    calcTD = tr.find('.calc[data-content="onCash"]');
                } else if ($(td).hasClass('card')) {
                    calcKey = 'onCard';
                    tdForUpdate = diffOnCard;
                    paidTD = tr.find('.paid[data-content="onCard"]');
                    calcTD = tr.find('.calc[data-content="onCard"]');
                }

                if (tdForUpdate) {
                    paid = paidTD.attr('data-cash');
                    calc = calcTD.attr('data-cash');

                    paid = paid ? parseInt(paid) : 0;
                    calc = calc ? parseInt(calc) : 0;
                    newValue = parseInt(input.val());

                    if (paidTD.text()) {
                        paid = paid;
                    } else {
                        subValues = newValue - paid;
                        paid = newValue;
                        parentKey = 'paid';
                    }

                    if (calcTD.text()) {
                        calc = calc;
                    } else {
                        subValues = newValue - calc;
                        calc = newValue;
                        parentKey = 'calc';
                    }

                    /*paid = paidTD.text() ? parseInt(paid) : input.val();
                     calc = calcTD.text() ? parseInt(calc) : input.val();*/

                    if (subValues !== 0) {

                        value = paid - calc;

                        paidTD.attr('data-cash', paid);
                        calcTD.attr('data-cash', calc);

                        tdForUpdate.text(this.checkMoneyTd(tdForUpdate, value));

                        diffOnCashRealValue = diffOnCash.attr('data-value');
                        diffOnCashRealValue = diffOnCashRealValue ? diffOnCashRealValue : diffOnCash.text();

                        diffOnCardRealValue = diffOnCard.attr('data-value');
                        diffOnCardRealValue = diffOnCardRealValue ? diffOnCardRealValue : diffOnCard.text();

                        totalValue = parseInt(diffOnCashRealValue) + parseInt(diffOnCardRealValue);
                        diffTotal.text(this.checkMoneyTd(diffTotal, totalValue));

                        changedAttr = this.changedModels[editedElementRowId];

                        if (changedAttr.diff) {
                            diffObj = _.clone(changedAttr.diff);
                        } else {
                            diffObj = _.clone(editModel.get('diff'));
                        }

                        diffObj['total'] = totalValue;
                        diffObj[calcKey] = value;

                        changedAttr['diff'] = diffObj;

                        this.getTotal(subValues, parentKey + '_' + calcKey, parentTr);
                    }
                }
            },

            checkMoneyTd: function (td, value) {
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

            getTotal: function (diff, calcKey, tr) {
                var totalElement;
                var prefVal;
                var totalDiff;
                var totalCalc;
                var diffVal;
                var calc = parseInt(tr.find('.total_calc_salary').attr('data-cash'));

                totalCalc = tr.find('.total_calc_salary');
                totalElement = tr.find('.total_' + calcKey);

                totalDiff = tr.find('.total_diff_onCash');

                prefVal = parseInt(totalElement.attr('data-cash'));

                totalElement.text(prefVal + diff);
                totalElement.attr('data-cash', prefVal + diff);

                if (calcKey === "calc_onCash") {
                    totalCalc.text(calc + diff);
                    totalCalc.attr('data-cash', calc + diff);
                }

                diffVal = (prefVal ? prefVal : 0) + diff - calc;

                totalDiff.text(diffVal);
                totalDiff.attr('data-cash', diffVal);
            },

            saveItem: function () {
                var model;

                this.editCollection.on('saved', this.savedNewModel, this);
                this.editCollection.on('updated', this.updatedOptions, this);

                for (var id in this.changedModels) {
                    model = this.editCollection.get(id);
                    model.changed = this.changedModels[id];
                }
                this.editCollection.save();
            },

            createItem: function () {
                var newDate = moment(new Date());
                var month = newDate.get('month');
                var year = newDate.get('year');
                var dataKey = parseInt(year) * 100 + parseInt(month);

                var startData = {
                    dataKey: dataKey,
                    type: "",
                    month: month,
                    year: year,
                    diff: 0,
                    paid: 0,
                    calc: 0,
                    employee: {
                        name: '',
                        _id: null
                    }
                };

                var model = new currentModel(startData);

                startData.cid = model.cid;

                if (!this.isNewRow()) {
                    this.showSaveCancelBtns();
                    this.editCollection.add(model);
                    this.changed = true;

                    new createView({model: startData});
                }
            },

            isNewRow: function () {
                var newRow = $('#false');

                return !!newRow.length;
            },

            savedNewModel: function (modelObject) {
                var savedRow = this.$bodyContainer.find('#false');
                var modelId;
                var checkbox = savedRow.find('input[type=checkbox]');

                modelObject = modelObject.success;

                if (modelObject) {
                    modelId = modelObject._id;
                    savedRow.attr("data-id", modelId);
                    checkbox.val(modelId);
                    savedRow.removeAttr('id');
                }

                this.hideSaveCancelBtns();
                this.resetCollection(modelObject);
            },

            resetCollection: function (model) {
                if (model && model._id) {
                    model = new currentModel(model);

                    this.editCollection.add(model);
                } else {
                    for (var id in this.changedModels) {
                        model = this.editCollection.get(id);
                        model.set(this.changedModels[id]);
                    }

                    this.collectionOnMonth.set(this.editCollection.models, {remove: false});
                }

                this.bindingEventsToEditedCollection(this);
            },

            bindingEventsToEditedCollection: function (context, collection) {
                if (!context.editCollection) {
                    context.editCollection = new editCollection(collection);
                } else {
                    context.editCollection.unbind();
                    context.editCollection.add(collection);
                }

                context.editCollection.on('saved', context.savedNewModel, context);
                context.editCollection.on('updated', context.updatedOptions, context);
            },

            deleteRender: function () {
                this.resetCollection();
                this.render();
                this.$bodyContainer = $(this.bodyContainerId);
                this.getTotal();

                dataService.getData('/payroll/recalculateSalaryCash', {}, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            deleteItems: function () {
                var that = this;

                this.collectionLength = this.collectionOnMonth.length;

                if (!this.changed) {
                    var answer = confirm("Realy DELETE items ?!");
                    var value;
                    var tr;

                    if (answer === true) {
                        $.each(that.$el.find("input:checked"), function (index, checkbox) {
                            checkbox = $(checkbox);
                            value = checkbox.attr('id');
                            tr = checkbox.closest('tr');
                            that.deleteItem(tr, value);
                        });
                    }
                } else {
                    this.cancelChanges();
                }
            },

            deleteItem: function (tr, id) {
                var self = this;
                var model;
                var mid = 39;

                if (id.length < 24) {
                    this.editCollection.remove(id);
                    delete this.changedModels[id];
                    self.deleteItemsRender(tr, id);
                } else {
                    model = this.editCollection.get(id);
                    //model = new currentModel(model);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function () {
                            delete self.changedModels[id];
                            self.deleteItemsRender(tr, id);
                        },
                        error: function (model, res) {
                            if (res.status === 403 && index === 0) {
                                alert("You do not have permission to perform this action");
                            }
                        }
                    });
                }
            },

            deleteItemsRender: function (tr, id) {
                tr.remove();

                this.editCollection.remove(id);
                this.hideSaveCancelBtns();
            },

            cancelChanges: function () {
                this.isEditRows();

                var self = this;
                var edited = this.edited;
                var collection = this.capacityObject;
                var listTotalEl;

                async.each(edited, function (el, cb) {
                    var tr = $(el).closest('tr');
                    var rowNumber = tr.find('[data-content="number"]').text();
                    var id = tr.attr('data-id');
                    var model;

                    if (!id) {
                        return cb('Empty id');
                    } else if (id.length < 24) {
                        tr.remove();
                        model = self.changedModels;

                        if (model) {
                            delete model[id];
                        }

                        return cb();
                    }

                    collection.get(id);
                    model = model.toJSON();
                    model.dataKey = self.model.attributes.dataKey;
                    model.index = rowNumber;
                    tr.replaceWith(this.cancelTemplate(model));
                    cb();
                }, function (err) {
                    if (!err) {
                        self.bindingEventsToEditedCollection(self);
                        self.hideSaveCancelBtns();
                    }
                });

                listTotalEl = this.$el.find('#listTotal');

                //listTotalEl.html('');
                //listTotalEl.append(_.template(listTotal, {array: this.getTotal(this.collectionOnMonth.toJSON())}));
            },

            updatedOptions: function () {
                this.hideSaveCancelBtns();
                this.resetCollection();
            },

            isEditRows: function () {
                var edited = this.$bodyContainer.find('.edited');

                this.edited = edited;

                return !!edited.length;
            },

            setEditable: function (td) {

                if (!td.parents) {
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
                var createBtnEl = $('#top-bar-createBtn');
                var saveBtnEl = $('#top-bar-saveBtn');
                var cancelBtnEl = $('#top-bar-deleteBtn');
                var payBtnEl = $('#topBarPaymentGenerate');

                if (!this.changed) {
                    createBtnEl.hide();
                }
                saveBtnEl.show();
                cancelBtnEl.show();
                payBtnEl.show();

                return false;
            },

            hideSaveCancelBtns: function () {
                var createBtnEl = $('#top-bar-createBtn');
                var saveBtnEl = $('#top-bar-saveBtn');
                var cancelBtnEl = $('#top-bar-deleteBtn');
                var copyBtnEl = $('#top-bar-copy');
                var paymentBtnEl = $('#topBarPaymentGenerate');

                this.changed = false;

                saveBtnEl.hide();
                cancelBtnEl.hide();
                createBtnEl.show();
                copyBtnEl.hide();
                paymentBtnEl.hide();

                return false;
            },

            checked: function (e) {
                var checkLength;
                var target;
                var dataId;
                var oneTypeInput;

                if (this.editCollection.length > 0) {
                    checkLength = $("input.checkbox:checked").length;
                    target = e.target;
                    dataId = $(target).attr('data-id');

                    oneTypeInput = this.$el.find('[data-id=' + dataId + ']').length - 1;

                    if ($("input.checkbox:checked").length > 0) {
                        $('#top-bar-deleteBtn').show();
                        $('#topBarPaymentGenerate').show();
                        if (checkLength === 1) {
                            $('#top-bar-copy').show();
                        } else {
                            $('#top-bar-copy').hide();
                        }
                        if (checkLength == oneTypeInput) {
                            this.$el.find('#' + dataId).prop('checked', true);
                        } else {
                            this.$el.find('#' + dataId).prop('checked', false);
                        }
                    } else {
                        this.$el.find('#' + dataId).prop('checked', false);
                        $('#top-bar-deleteBtn').hide();
                        $('#topBarPaymentGenerate').hide();
                        $('#top-bar-copy').hide();
                    }
                }
            },

            setChangedValueToModel: function () {
                var editedElement = this.$el.find('.editing');
                var editedCol;
                var editedElementRow;
                var editedElementRowId;
                var editedElementContent;
                var editedElementValue;
                var editModel;
                var editedElementOldValue;
                var changedAttr;

                var calc;
                var paid;

                var differenceBettwenValues;

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementRow = editedElement.closest('tr');
                    editedElementRowId = editedElementRow.attr('data-id');
                    editedElementContent = editedCol.data('content');
                    editedElementOldValue = parseInt(editedElement.attr('data-cash'));
                    if (editedElementContent === "dataKey") {
                        var oldStr = editedElement.val();
                        var newStr = oldStr.slice(0, 2) + oldStr.slice(3, 7);
                        var month = parseInt(oldStr.slice(0, 2));
                        var year = parseInt(oldStr.slice(3, 7));
                        editedElementValue = parseInt(newStr) ? parseInt(newStr) : 0;
                    } else {
                        editedElementValue = parseInt(editedElement.val());
                        editedElementValue = isFinite(editedElementValue) ? editedElementValue : 0;

                        editedElementOldValue = isFinite(editedElementOldValue) ? editedElementOldValue : 0;

                        differenceBettwenValues = editedElementValue - editedElementOldValue;
                    }

                    if (differenceBettwenValues !== 0) {

                        editModel = this.editCollection.get(editedElementRowId);

                        if (!this.changedModels[editedElementRowId]) {
                            if (!editModel.id) {
                                this.changedModels[editedElementRowId] = editModel.attributes;
                            } else {
                                this.changedModels[editedElementRowId] = {};
                            }
                        }

                        calc = _.clone(editModel.get('calc'));
                        paid = _.clone(editModel.get('paid'));

                        changedAttr = this.changedModels[editedElementRowId];

                        if (month || year) {
                            changedAttr.dataKey = year * 100 + month;
                            changedAttr.month = month;
                            changedAttr.year = year;
                        }

                        if (editedElementContent === "dataKey") {
                            editedCol.text(oldStr);
                        } else {
                            editedCol.text(editedElementValue);
                        }

                        if (changedAttr) {
                            if (editedCol.hasClass('calc')) {
                                if (editedCol.attr('data-content') === 'salary') {
                                    changedAttr['baseSalary'] = editedElementValue;
                                } else {
                                    if (!changedAttr.calc) {
                                        changedAttr.calc = calc;
                                    }

                                    calc = editedElementValue;
                                    changedAttr['calc'] = calc;
                                }
                            } else if (editedCol.hasClass('paid')) {
                                if (!changedAttr.paid) {
                                    changedAttr.paid = paid;
                                }

                                paid = editedElementValue;
                                changedAttr['paid'] = paid;
                                changedAttr['diff'] = paid - calc;
                            }
                        }
                    }
                    if (editedElementContent === "dataKey") {
                        editedCol.text(oldStr);
                    } else {
                        editedCol.text(editedElementValue);
                    }
                    editedElement.remove();
                }
            },

            editRow: function (e, prev, next) {
                $(".newSelectList").remove();

                var self = this;
                var target = $(e.target);
                var isInput = target.prop("tagName") === 'INPUT';
                var dataContent = target.attr('data-content');
                var tr = target.closest('tr');
                var payRollId = tr.attr('data-id');
                var tempContainer;
                var insertedInput;

                var inputHtml;

                if (payRollId && !isInput) {
                    if (this.payRollId) {
                        this.setChangedValueToModel();
                    }
                    this.payRollId = payRollId;
                    this.setChangedValueToModel();
                }

                if (dataContent === 'employee') {
                    populate.showSelect(e, prev, next, this);
                } else if (dataContent === 'paymentType') {
                    populate.showSelect(e, prev, next, this);
                } else if (dataContent === 'dataKey') {

                    tempContainer = target.text();
                    inputHtml = '<input type="text" class="datapicker editing" value="' + tempContainer + '" readonly />';

                    target.html(inputHtml);

                    $('.datapicker').datepicker({
                        dateFormat: "mm/yy",
                        changeMonth: true,
                        changeYear: true,
                        onSelect: function (text, datPicker) {
                            var targetInput = $(this);
                            var td = targetInput.closest('tr');
                            var endDatePicker = td.find('.endDateDP');
                            var endDate = moment(targetInput.datepicker('getDate'));
                            var endContainer = $(endDatePicker);

                            endDate.add(7, 'days');
                            endDate = endDate.toDate();

                            endContainer.datepicker('option', 'minDate', endDate);

                            self.setChangedValueToModel(targetInput);

                            return false;
                        }
                    }).removeClass('datapicker');

                    insertedInput = target.find('input');
                    insertedInput.focus();
                    insertedInput[0].setSelectionRange(0, insertedInput.val().length);

                } else if (!isInput) {
                    tempContainer = target.text();
                    inputHtml = '<input class="editing" type="text" data-value="' +
                    tempContainer + '" value="' + tempContainer +
                    '"  maxLength="4" style="display: block;" />';

                    target.html(inputHtml);

                    target.attr('data-cash', tempContainer);

                    insertedInput = target.find('input');
                    insertedInput.focus();
                    insertedInput[0].setSelectionRange(0, insertedInput.val().length);
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

                dataService.getData("/category/getExpenses", null, function (paymentType) {

                    content.responseObj['#paymentType'] = paymentType;
                });
            },

            showNewSelect: function (e, prev, next) {
                e.stopPropagation();
                populate.showSelect(e, prev, next, this);

                return false;
            },

            hideNewSelect: function () {
                $(".newSelectList").remove();
            },

            chooseOption: function (e) {
                e.preventDefault();

                var self = this;
                var target = $(e.target);
                var closestTD = target.closest("td");
                var targetElement = closestTD.length ? closestTD : target.closest("th").find('a');
                var tr = target.closest("tr");
                var modelId = tr.attr('data-id');
                var id = target.attr("id");
                var attr = targetElement.attr("id") || targetElement.attr("data-content");
                var elementType = '#' + attr;
                var element = _.find(this.responseObj[elementType], function (el) {
                    return el._id === id;
                });

                var editModel;
                var employee;
                var changedAttr;

                if (modelId) {
                    editModel = this.editCollection.get(modelId);

                    if (!this.changedModels[modelId]) {
                        if (!editModel.id) {
                            this.changedModels[modelId] = editModel.attributes;
                        } else {
                            this.changedModels[modelId] = {};
                        }
                    }

                    changedAttr = this.changedModels[modelId];
                }

                if (elementType === '#employee') {
                    tr.find('[data-content="employee"]').text(element.name);

                    employee = _.clone(editModel.get('employee'));

                    employee._id = element._id;
                    employee.name = target.text();

                    changedAttr.employee = employee;

                    this.hideNewSelect();
                    this.setEditable(targetElement);

                    return false;
                } else if (elementType === '#paymentType') {
                    tr.find('[data-content="paymentType"]').text(element.name);

                    changedAttr.type = {};
                    changedAttr.type._id = element._id;
                    changedAttr.type.name = element.name;

                    this.hideNewSelect();
                    this.setEditable(targetElement);

                    return false;
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

            renderFilter: function (self) {
                self.filters = new filterView({
                    contentType: self.contentType
                });

                self.filters.bind('filter', function (filter) {
                    self.showFilteredPage(filter, self)
                });

                self.filters.render({
                    dataKey: {
                        sort: {
                            key: '_id',
                            order: -1
                        }
                    }
                });
            },

            showMoreContent: function (newCollection) {
                var collectionsObjects;

                var holder = this.$el;
                var currentEl = holder.find("#payRoll-TableBody");

                this.collection = newCollection;
                collectionsObjects = this.collection.toJSON()[0];
                this.collectionOnMonth = new monthCollection(collectionsObjects.collection);
                this.total = collectionsObjects.total;

                currentEl.empty();
                currentEl.append(this.totalTemplate({
                    collection: this.collectionOnMonth.toJSON(),
                    total: this.total,
                    currencySplitter: helpers.currencySplitter,
                    weekSplitter: helpers.weekSplitter
                }));

                $("#top-bar-deleteBtn").hide();
                $("#topBarPaymentGenerate").hide();
                $('#check_all').prop('checked', false);

                if (this.filterView) {
                    this.filterView.renderFilterContent();
                }

                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            checkAll: function (e) {
                var target = e.target;
                var classTr = $(target).attr('id');
                var checked = $(target).checked;

                this.$el.find('[data-id=' + classTr + ']').prop('checked', checked);
                if (this.$el.find("input.checkbox:checked").length > 0) {
                    $("#top-bar-deleteBtn").show();
                    $("#topBarPaymentGenerate").show();
                } else {
                    $("#top-bar-deleteBtn").hide();
                    $("#topBarPaymentGenerate").hide();
                }
            },

            render: function () {
                var self = this;
                var currentEl = this.$el;

                /*Add header*/

                currentEl.html('');
                currentEl.append(headerTemplate);

                /*Render table template*/

                currentEl.find('#payRoll-TableBody').append(this.totalTemplate({
                    collection: this.collectionOnMonth.toJSON(),
                    total: this.total,
                    currencySplitter: helpers.currencySplitter,
                    weekSplitter: helpers.weekSplitter
                }));

                /*Get data for employee select*/

                this.filterEmployeesForDD(this);

                this.hideSaveCancelBtns();

                $('#top-bar-deleteBtn').hide();

                /*Checkbox all click*/

                $('.check_all').click(function (e) {
                    var target = e.target;
                    var classTr = $(target).attr('id');

                    currentEl.find('[data-id=' + classTr + ']').prop('checked', this.checked);
                    if (self.$el.find("input.checkbox:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                        $("#topBarPaymentGenerate").show();
                    } else {
                        $("#top-bar-deleteBtn").hide();
                        $("#topBarPaymentGenerate").hide();
                    }
                });

                this.renderFilter(self);

                setTimeout(function () {
                    self.editCollection = new editCollection(self.allCollection);
                    self.forPayments = new editCollection();

                    self.forPayments.on('saved', self.savedNewModel, self);
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('updated', self.updatedOptions, self);
                }, 10);

                return this;
            }
        });

        return payRollListView;
    });
