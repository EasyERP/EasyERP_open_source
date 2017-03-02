define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/PayrollPayments/CreateTemplate.html',
    'moment',
    'populate',
    'helpers',
    'dataService',
    'constants',
    'helpers/keyCodeHelper'
], function (Backbone, $, _, Parent, CreateTemplate, moment, populate, helpers, dataService, CONSTANTS, keyCodes) {
    'use strict';

    var CreateView = Parent.extend({
        el           : '#content-holder',
        template     : _.template(CreateTemplate),
        changedModels: {},

        initialize: function (options) {
            this.editCollection = options.collection;
            this.editCollection.url = 'payments/salary';
            this.editCollection.on('saved', this.savedNewModel, this);
            this.responseObj = {};

            this.date = this.editCollection.length ? moment().isoWeekYear(this.editCollection.toJSON()[0].year).month(this.editCollection.toJSON()[0].month - 1).endOf('month') : new Date();

            this.render(options);

            this.$bodyContainer = this.$el.find('#payRoll-listTable');
        },

        events: {
            'click .checkbox'  : 'checked',
            'click td.editable': 'editRow',
            'change .autoCalc' : 'autoCalc',
            'change .editable' : 'setEditable',
            'keydown .editing' : 'onKeyDownInput'
            // 'click #deleteBtn'     : 'deleteItems'
        },

        onKeyDownInput: function (e) {
            var code = e.keyCode;
            if (keyCodes.isEnter(e.keyCode)) {
                this.setChangedValueToModel();
            } else if (!keyCodes.isDigitOrDecimalDot(code) && !keyCodes.isBspaceAndDelete(code)) {
                e.preventDefault();
            }
        },

        savedNewModel: function () {
            this.removeDialog();

            Backbone.history.fragment = '';
            Backbone.history.navigate('#easyErp/PayrollPayments/list', {trigger: true});
        },

        editRow: function (e) {
            var target = $(e.target);
            var isInput = target.prop('tagName') === 'INPUT';
            var tr = target.closest('tr');
            var payRollId = tr.attr('data-id');
            var tempContainer;
            var insertedInput;
            var self = this;

            var inputHtml;

            $('.newSelectList').remove();

            if (payRollId && !isInput) {
                if (this.payRollId) {
                    this.setChangedValueToModel();
                }
                this.payRollId = payRollId;
            }

            if (!isInput) {
                tempContainer = (target.text()).trim();
                inputHtml = '<input class="editing autoCalc" type="text" data-value="' +
                    tempContainer + '" value="' + tempContainer + '" />';

                target.html(inputHtml);

                target.attr('data-cash', tempContainer);

                insertedInput = target.find('input');
                insertedInput.focus();
                insertedInput[0].setSelectionRange(0, insertedInput.val().length);

            }

            return false;
        },

        chooseOption: function (e) {
            var self = this;
            var target = $(e.target);
            var targetElement = target.closest('a');
            var attr = targetElement.attr('id');
            var newCurrency = target.attr('id');
            var newCurrencyClass = helpers.currencyClass(newCurrency);
            var paymentMethods;
            var el;

            var array = this.$el.find('#paidAmountDd');
            array.attr('class', newCurrencyClass);

            if (attr === 'paymentMethod') {

                paymentMethods = self.responseObj['#paymentMethod'];

                el = _.find(paymentMethods, function (item) {
                    return item._id === newCurrency;
                });

                if (el && el.chartAccount && el.chartAccount._id) {
                    dataService.getData('/journals/getByAccount', {
                        transaction  : 'Payment',
                        creditAccount: el.chartAccount._id
                    }, function (resp) {
                        self.responseObj['#journal'] = resp.data || [];

                        self.$el.find('#journalDiv').show();

                        if (resp.data && resp.data.length) {
                            (self.$el.find('#journal').text(resp.data[0].name)).attr('data-id', resp.data[0]._id);
                        } else {
                            (self.$el.find('#journal').text('Select')).attr('data-id', null);
                            self.$el.find('#journal').addClass('errorContent');
                        }

                    });
                } else {
                    (self.$el.find('#journal').text('Select')).attr('data-id', null);
                }

                $(e.target).parents('dd').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            } else {
                $(e.target).parents('dd').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            }
        },

        setChangedValue: function () {
            if (!this.changed) {
                this.changed = true;
            }
        },

        saveItem: function () {
            var model;
            var id;
            var i;
            var keys;
            var editCollectionJSON = this.editCollection.toJSON();
            var currency = this.$el.find('#currencyDd').attr('data-id');
            var paymentMethod = this.$el.find('#paymentMethod').attr('data-id');
            var journal = this.$el.find('#journal').attr('data-id') || null;
            var date = helpers.setTimeToDate(new Date(this.$el.find('#dateOfPayment').val()));

            this.editCollection.forEach(function (el) {
                el.set('date', date);
                el.set('currency', currency);
                el.set('paymentMethod', paymentMethod);
                el.set('journal', journal);
            });

            this.setChangedValueToModel();

            keys = Object.keys(this.changedModels);

            for (i = keys.length - 1; i >= 0; i--) {
                id = keys[i];
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
            var payOld = (editModel.changed && editModel.changed.paidAmount) ? parseFloat(editModel.changed.paidAmount) : parseFloat(editModel.get('paidAmount'));
            var diffOld = (editModel.changed && editModel.changed.differenceAmount) ? parseFloat(editModel.changed.differenceAmount) : parseFloat(editModel.get('differenceAmount'));
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

                pay = pay ? parseFloat(pay) : 0;
                calc = calc ? parseFloat(calc) : 0;
                newValue = parseFloat(helpers.spaceReplacer(input.val()));

                if (!payTD.text()) {
                    subValues = newValue - pay;
                    pay = newValue;
                }

                if (calcTD.text()) {
                    subValues = newValue - calc;
                    calc = newValue;
                }

                total = parseFloat(totalEl.attr('data-cash'));

                newTotal = total - payOld + newValue - diffOld;

                totalEl.text(helpers.currencySplitter(newTotal.toFixed(2)));
                totalEl.attr('data-cash', newTotal);

                if (subValues !== 0) {

                    value = calc - pay;

                    payTD.attr('data-cash', pay);
                    payTD.text(pay);
                    calcTD.attr('data-cash', calc);

                    tdForUpdate.text(this.checkMoneyTd(tdForUpdate, value.toFixed(2)));

                    changedAttr = this.changedModels[editedElementRowId];

                    changedAttr.differenceAmount = calc - pay;

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
                editedElementOldValue = parseFloat(editedElement.closest('td').attr('data-cash'));

                editedElementValue = parseFloat(helpers.spaceReplacer(editedElement.val()));

                editedElementValue = isFinite(editedElementValue) ? editedElementValue : 0;
                editedElementOldValue = isFinite(editedElementOldValue) ? editedElementOldValue : 0;

                differenceBettwenValues = parseFloat((editedElementValue - editedElementOldValue).toFixed(2));

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
                        if (editedCol.hasClass('paidAmount')) {
                            if (!changedAttr.paidAmount) {
                                changedAttr.paidAmount = pay;
                            }

                            pay = editedElementValue;
                            changedAttr.paidAmount = pay;
                            changedAttr.differenceAmount = pay - differenceAmount;
                        }
                    }
                }

                editedElement.remove();
                editedCol.text(editedElementValue);
            }
        },

        pay: function () {
            this.saveItem();
        },

        removeDialog: function () {
            $('.edit-dialog').remove();
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
            $('.crop-images-dialog').remove();

            this.editCollection.reset();
        },

        checked: function () {

            if (this.editCollection.length > 0) {

                if (this.$el.find('input.checkbox:checked').length > 0) {
                    this.$el.find('#deleteBtn').show();

                } else {
                    this.$el.find('#deleteBtn').hide();
                }
            }
        },

        /* deleteItems: function (e) {
         var that = this;
         var answer = confirm('Really DELETE items ?!');
         var value;
         var tr;

         e.preventDefault();

         this.collectionLength = this.editCollection.length;

         if (answer) {
         $.each(that.$el.find('input:checked'), function (index, checkbox) {
         checkbox = $(checkbox);
         value = checkbox.attr('id');
         tr = checkbox.closest('tr');
         that.deleteItem(tr, value);
         });
         }

         },*/

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

                error: function (model, res) {
                    if (res.status === 403) {
                        App.render({
                            type   : 'error',
                            message: 'You do not have permission to perform this action'
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
            var self = this;
            var date = new Date(moment(self.date).endOf('month').set({
                hours  : 18,
                minutes: 1,
                seconds: 0
            }));
            var formString;

            options.currencySplitter = helpers.currencySplitter;
            date = moment(new Date(date)).format('DD MMM, YYYY');
            formString = this.template(options);

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Payment',
                width      : '900px',
                buttons    : [{
                    id   : 'payButton',
                    class: 'btn blue',
                    text : 'Pay',
                    click: function () {
                        self.pay();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.removeDialog();
                        self.changedModels = {};
                    }
                }]

            });

            populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);
            populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, true);

            this.$el.find('#journalDiv').hide();

            this.$el.find('#dateOfPayment').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : new Date(self.date),
                maxDate    : new Date(),
                onSelect   : function () {
                    // set date to model
                }
            }).datepicker('setDate', date);

            this.$el.find('#deleteBtn').hide();
            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});
