define([
        "text!templates/PayrollPayments/CreateTemplate.html",
        "helpers"
    ],
    function (CreateTemplate, helpers) {
        "use strict";

        var CreateView = Backbone.View.extend({
            el           : '#content-holder',
            template     : _.template(CreateTemplate),
            changedModels: {},

            initialize: function (options) {
                this.editCollection = options.collection;
                this.editCollection.url = 'payment/salary';
                this.editCollection.on('saved', this.savedNewModel, this);

                this.render(options);

                this.$bodyContainer = this.$el.find('#payRoll-listTable');
            },

            events: {
                "click .checkbox"      : "checked",
                "click td.editable"    : "editRow",
                "change .autoCalc"     : "autoCalc",
                "change .editable"     : "setEditable",
                "keydown input.editing": "keyDown",
                "click #deleteBtn"     : "deleteItems"
            },

            savedNewModel: function () {
                this.removeDialog();

                Backbone.history.fragment = '';
                Backbone.history.navigate("#easyErp/PayrollPayments/list", {trigger: true});
            },

            editRow: function (e, prev, next) {
                $(".newSelectList").remove();

                var self = this;
                var target = $(e.target);
                var isInput = target.prop("tagName") === 'INPUT';
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

                if (!isInput) {
                    tempContainer = (target.text()).trim();
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

            setChangedValue: function () {
                if (!this.changed) {
                    this.changed = true;
                }
            },

            saveItem: function () {
                var model;

                for (var id in this.changedModels) {
                    model = this.editCollection.get(id);
                    model.changed = this.changedModels[id];
                    delete this.changedModels[id];
                }
                this.editCollection.save();
            },

            autoCalc: function (e) {
                var el = $(e.target);
                var td = $(el.closest('td'));
                var tr = el.closest('tr');
                var input = tr.find('input.editing');
                var editedElementRowId = tr.attr('data-id');
                var editModel = this.editCollection.get(editedElementRowId);
                var changedAttr;
                var total;
                var newTotal;
                var totalEl = this.$el.find('#total');
                var payOld = editModel.changed.paidAmount ? parseFloat(editModel.changed.paidAmount) : parseFloat(editModel.get('paidAmount'));
                var diffOld = editModel.changed.differenceAmount ? parseFloat(editModel.changed.differenceAmount) : parseFloat(editModel.get('differenceAmount'));
                var diffOnCash = tr.find('.differenceAmount[data-content="onCash"]');
                var value;
                var tdForUpdate;
                var pay;
                var calc;
                var payTD;
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
                    tdForUpdate = diffOnCash;
                    payTD = tr.find('.paidAmount[data-content="onCash"]');
                    calcTD = tr.find('.calc[data-content="onCash"]');
                }

                if (tdForUpdate) {
                    pay = payTD.attr('data-cash');
                    calc = calcTD.attr('data-cash');

                    pay = pay ? parseInt(pay) : 0;
                    calc = calc ? parseInt(calc) : 0;
                    newValue = parseInt(input.val());

                    if (payTD.text()) {
                        pay = pay;
                    } else {
                        subValues = newValue - pay;
                        pay = newValue;
                    }

                    if (calcTD.text()) {
                        calc = calc;
                    } else {
                        subValues = newValue - calc;
                        calc = newValue;
                    }

                    total = parseFloat(totalEl.attr('data-cash'));

                    newTotal = total - payOld + newValue - diffOld;

                    totalEl.text(helpers.currencySplitter(newTotal.toFixed(2)));
                    totalEl.attr('data-cash', newTotal);

                    if (subValues !== 0) {

                        value = pay - calc;

                        payTD.attr('data-cash', pay);
                        payTD.text(pay);
                        calcTD.attr('data-cash', calc);

                        tdForUpdate.text(this.checkMoneyTd(tdForUpdate, value));

                        changedAttr = this.changedModels[editedElementRowId];

                        changedAttr['differenceAmount'] = pay - calc;

                    }
                }
            },

            isEditRows: function () {
                var edited = this.$bodyContainer.find('.edited');

                this.edited = edited;

                return !!edited.length;
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

            keyDown: function (e) {
                if (e.which === 13) {
                    this.setChangedValueToModel();
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
                var differenceAmount;

                var pay;

                var differenceBettwenValues;

                if (editedElement.length) {
                    editedCol = editedElement.closest('td');
                    editedElementRow = editedElement.closest('tr');
                    editedElementRowId = editedElementRow.attr('data-id');
                    //editedElementContent = editedCol.data('content');
                    editedElementOldValue = parseInt(editedElement.attr('data-cash'));

                    editedElementValue = parseInt(editedElement.val());
                    editedElementValue = isFinite(editedElementValue) ? editedElementValue : 0;

                    editedElementOldValue = isFinite(editedElementOldValue) ? editedElementOldValue : 0;

                    differenceBettwenValues = editedElementValue - editedElementOldValue;

                    if (differenceBettwenValues !== 0) {

                        editModel = this.editCollection.get(editedElementRowId);

                        if (!this.changedModels[editedElementRowId]) {
                            if (!editModel.id) {
                                this.changedModels[editedElementRowId] = editModel.attributes;
                            } else {
                                this.changedModels[editedElementRowId] = {};
                            }
                        }

                        differenceAmount = _.clone(editModel.get('differenceAmount'));
                        pay = _.clone(editModel.get('paidAmount'));

                        changedAttr = this.changedModels[editedElementRowId];

                        if (changedAttr) {
                            if (editedCol.hasClass('pay')) {
                                if (!changedAttr.paidAmount) {
                                    changedAttr.paidAmount = pay;
                                }

                                pay = editedElementValue;
                                changedAttr['paidAmount'] = pay;
                                changedAttr['differenceAmount'] = pay - differenceAmount;
                            }
                        }
                    }

                    editedElement.remove();
                    editedCol.text(editedElementValue);
                }
            },

            pay: function () {
                this.saveItem();

                //this.removeDialog();
            },

            removeDialog: function () {
                $(".edit-dialog").remove();
                $(".add-group-dialog").remove();
                $(".add-user-dialog").remove();
                $(".crop-images-dialog").remove();

                this.editCollection.reset();
            },

            checked: function (e) {

                if (this.editCollection.length > 0) {

                    if (this.$el.find("input.checkbox:checked").length > 0) {
                        this.$el.find('#deleteBtn').show();

                    } else {
                        this.$el.find('#deleteBtn').hide();
                    }
                }
            },

            deleteItems: function (e) {
                e.preventDefault();
                var that = this;

                this.collectionLength = this.editCollection.length;

                if (!this.changed) {
                    var answer = confirm("Really DELETE items ?!");
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
                var mid = 66;

                model = this.editCollection.get(id);
                model.destroy({
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function () {
                        delete self.changedModels[id];
                        self.deleteItemsRender(tr, id);
                    },
                    error  : function (model, res) {
                        if (res.status === 403 && index === 0) {
                            App.render({
                                type: 'error',
                                message: "You do not have permission to perform this action"
                            });
                        }
                    }
                });
            },

            deleteItemsRender: function (tr, id) {
                tr.remove();

                this.editCollection.remove(id);
                this.hideSaveCancelBtns();
            },

            hideSaveCancelBtns: function () {
                var cancelBtnEl = $('#deleteBtn');

                this.changed = false;

                cancelBtnEl.hide();

                return false;
            },

            render: function (options) {
                options.currencySplitter = helpers.currencySplitter;
                var formString = this.template(options);
                var self = this;

                this.$el = $(formString).dialog({
                    closeOnEscape: false,
                    autoOpen     : true,
                    resizable    : true,
                    dialogClass  : "edit-dialog",
                    title        : "Create Payment",
                    width        : "900px",
                    buttons      : [
                        {
                            id   : "payButton",
                            text : "Pay",
                            click: function () {
                                self.pay();
                            }
                        },

                        {
                            text : "Cancel",
                            click: function () {
                                self.removeDialog();
                            }
                        }]

                });

                this.$el.find('#deleteBtn').hide();

                this.delegateEvents(this.events);

                return this;
            }

        });

        return CreateView;
    });
