define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'views/journal/CreateView',
    'views/selectView/selectView',
    'text!templates/manualEntry/CreateTemplate.html',
    'models/journalEntry',
    'helpers/keyCodeHelper',
    'populate',
    'helpers',
    'dataService',
    'helpers/ga'
], function (Backbone, $, _, ParentView, CreateJournalView, SelectView, CreateTemplate, JournalModel, keyCodes, populate, helpers, dataService, ga) {
    'use strict';

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'manualEntry',
        template   : _.template(CreateTemplate),
        responseObj: {},

        events: {
            'click td.editable'    : 'editRow',
            'keydown input.editing': 'keyDown',
            //'change .editable'     : 'setEditable',
            'click #createBtn'     : 'createJournal',
            'click #addNewRow'     : 'addNewRow',
            'click .removeRow'     : 'removeRow',
            click                  : 'setChangedValueToModel'
        },

        initialize: function () {
            this.model = new JournalModel();

            this.render();
        },

        removeRow: function (e) {
            var $target = $(e.target);
            var tr = $target.closest('tr');

            tr.remove();
        },

        addNewRow: function () {
            var body = this.$el.find('#manualTableBody');
            var tr = '<tr id="dataTr" class="trsAdded"><td><a href="javascript:;" id="account" class="current-selected">Select</a></td><td class="editable money debit" data-type="input">0</td><td class="editable money credit" data-type="input">0</td><td><span title="Delete" class="icon-close5 removeRow"></span></td>></tr>';

            body.append(tr);
        },

        showNewSelect: function (e) {
            var self = this;
            var $target = $(e.target);
            var closestAId = $target.closest('a').attr('id');

            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            if (closestAId === 'journalsDd') {
                dataService.getData('/journals/getForDD', {}, function (resp) {
                    self.responseObj['#journalsDd'] = resp.data;

                    self.selectView = new SelectView({
                        e          : e,
                        responseObj: self.responseObj
                    });

                    $target.append(self.selectView.render().el);

                });
            } else {
                this.selectView = new SelectView({
                    e          : e,
                    responseObj: this.responseObj
                });

                $target.append(this.selectView.render().el);

            }

            return false;
        },

        createJournal: function () {
            return new CreateJournalView({notRedirect: true});
        },

        keyDown: function (e) {
            var code = e.keyCode;

            if (keyCodes.isEnter(e.keyCode)) {
                this.setChangedValueToModel(e);
            } else if (!keyCodes.isDigitOrDecimalDot(code) && !keyCodes.isBspaceAndDelete(code)) {
                e.preventDefault();
            }
        },

        setChangedValueToModel: function (e) {
            var editedElement = this.$el.find('.editing');
            var editedCol;
            var editedElementValue;
            var tr;

            if (this.selectView) {
                this.selectView.remove();
            }

            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }

            if (editedElement.length) {
                editedCol = editedElement.closest('td');

                tr = editedCol.closest('tr').attr('class');

                editedElementValue = editedElement.val();

                editedElementValue = editedElementValue.toString();

                editedElementValue = editedElementValue.replace(/\s+/g, '');

                editedElementValue = parseFloat(editedElementValue) || 0;

                if (editedElementValue) {
                    editedCol.removeClass('errorContent');
                }

                editedCol.text(helpers.currencySplitter(editedElementValue.toFixed(2)));

                if (tr === 'trsAdded') {
                    if (editedCol.hasClass('debit') && editedElementValue) {
                        editedCol.closest('tr').find('td.credit').text(0);
                    } else if (editedElementValue) {
                        editedCol.closest('tr').find('td.debit').text(0);
                    }
                }

                editedElement.remove();
            }
        },

        hideDialog: function () {
            $('.create-dialog-manual').remove();
        },

        keyDownHandler: function (e) {
            switch (e.which) {
                case 27:
                    this.hideDialog();
                    break;
                default:
                    break;
            }
        },

        editRow: function (e, prev, next) {
            var el = $(e.target);
            var tr = $(e.target).closest('tr');
            var colType = el.data('type');
            var isSelect = colType !== 'input' && el.prop('tagName') !== 'INPUT';
            var tempContainer;
            var width;

            e.stopPropagation();

            if (el.prop('tagName') !== 'INPUT') {
                this.setChangedValueToModel(e);
            }

            if (isSelect) {
                populate.showSelect(e, prev, next, this);
            } else if (colType) {
                tempContainer = el.text();
                width = el.width() - 16;
                el.html('<input class="editing" type="text" value="' + tempContainer + '"  style="width:' + width + 'px">');
            }

            return false;
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var id = $target.attr('id');
            var text = $target.text();
            var $ul = $target.closest('ul');
            var $element = $ul.closest('a');
            var item;
            var tr = this.$el.find('.trs');
            var debitAccount = tr.find('#debitAccountDd');
            var creditAccount = tr.find('#creditAccountDd');
            var debit = tr.find('#debit');
            var credit = tr.find('#credit');
            var question;

            if ($element.attr('id') === 'journalsDd') {
                item = _.find(this.responseObj['#journalsDd'], function (el) {
                    return el._id.toString() === id;
                });

                if (item) {
                    debitAccount.text(item.debitAccount.name);
                    creditAccount.text(item.creditAccount.name);
                    creditAccount.attr('data-id', item.creditAccount._id);
                    debitAccount.attr('data-id', item.debitAccount._id);
                }
            } else if ($element.attr('id') === 'sourceDocumentDd') {
                item = _.find(this.responseObj['#sourceDocumentDd'], function (el) {
                    return el._id.toString() === id;
                });
            }

            if ($element.attr('id') === 'currencyDd') {
                debit.addClass(helpers.currencyClass(id));
                credit.addClass(helpers.currencyClass(id));
            }

            $element.attr('data-id', id);

            if (item && item.type) {
                $element.attr('data-type', item.type);
            }

            $element.text(text);

            $ul.remove();

            if (item && item.type === 'jobs') {
                question = confirm('Do you want to assign Employee to job?');

                if (question) {
                    this.$el.find('#employeesDdWrap').show();
                }
            } else if ($element.attr('id') !== 'employeesDd') {
                this.$el.find('#employeesDdWrap').hide();
            }

            return false;
        },

        saveItem: function (e) {
            this.setChangedValueToModel(e);

            var self = this;
            var thisEl = this.$el;
            var data = {};
            var trDebit = this.$el.find('#dataTrDebit');
            var trCredit = this.$el.find('#dataTrCredit');
            var debit = parseFloat(helpers.spaceReplacer(trDebit.find('.debit').text()));
            var credit = parseFloat(helpers.spaceReplacer(trCredit.find('.credit').text()));
            var debitAccount = trDebit.find('#debitAccountDd').attr('data-id');
            var creditAccount = trCredit.find('#creditAccountDd').attr('data-id');
            var currency = this.$el.find('#currencyDd').attr('data-id');
            var journal = this.$el.find('#journalsDd').attr('data-id') || null;
            var type = $.trim(thisEl.find('#sourceDocumentDd').attr('data-type')) || 'Manual';
            var employee = thisEl.find('#employeesDd').attr('data-id');
            var otherAccounts = [];
            var otherTrs = thisEl.find('.trsAdded');
            var debitSum = 0;
            var creditSum = 0;
            var validation = true;
            var timestamp = new Date();

            timestamp = timestamp.getTime();

            otherAccounts.push({
                account: debitAccount,
                debit  : debit * 100,
                credit : 0
            }, {
                account: creditAccount,
                debit  : 0,
                credit : credit * 100
            });

            otherTrs.each(function () {
                var object = {};
                var account;

                account = $(this).find('#account').attr('data-id') || null;
                object.debit = parseFloat(helpers.spaceReplacer($(this).find('.debit').text())) * 100;
                object.credit = parseFloat(helpers.spaceReplacer($(this).find('.credit').text())) * 100;

                if (account) {
                    if (object.debit) {
                        object.account = account;
                    } else if (object.credit) {
                        object.account = account;
                    }

                    if (object.debit || object.credit) {
                        otherAccounts.push(object);
                    }
                } else {
                    validation = false;
                    App.render({
                        type   : 'error',
                        message: 'Please, choose Account first.'
                    });
                }

            });

            otherAccounts.forEach(function (el) {
                debitSum += el.debit;
                creditSum += el.credit;
            });

            if (debitSum !== creditSum) {
                return App.render({
                    type   : 'error',
                    message: 'Debit summary must be equal Credit summary.'
                });
            } else if (debitSum === 0 || creditSum === 0) {
                return App.render({
                    type   : 'error',
                    message: 'Debit summary and Credit summary must be greater than zero.'
                });
            }

            switch (type) {
                case 'InvoicePayment':
                    type = 'Payment';
                    break;
                case 'Employees':
                    type = 'Employees';
                    break;
                case 'jobs':
                    if (employee) {
                        type = 'wTrack';
                    }
                    type = 'jobs';
                    break;
                case 'wTrackInvoice':
                    type = 'Invoice';
                    break;
                case 'Proforma':
                    type = 'Proforma';
                    break;
                case 'ProformaPayment':
                    type = 'Payment';
                    break;
            }

            data.sourceDocument = {};

            data.currency = currency;
            data.journal = journal;

            data.date = helpers.setTimeToDate(new Date(thisEl.find('#date').val()));
            data.sourceDocument.name = $.trim(thisEl.find('#sourceDocumentDd').text()) === 'Select' ? 'None' : $.trim(thisEl.find('#sourceDocumentDd').text());
            data.sourceDocument._id = thisEl.find('#sourceDocumentDd').attr('data-id') || null;
            data.sourceDocument.model = type;

            data.timestamp = timestamp;

            if (employee) {
                data.sourceDocument.employee = employee;
            }

            data.accountsItems = otherAccounts;

            /*if (!data.sourceDocument._id) {
             return App.render({
             type   : 'error',
             message: 'Please, choose Source Document first.'
             });
             }*/

            if (!creditAccount || !debitAccount) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose Journal or all Accounts first.'
                });
            }

            if (validation) {
                dataService.postData('journalEntries/createManual', data, function (err, response) {
                    if (err) {
                        return self.errorNotification(err);
                    }

                    self.redirectAfterSave(self);
                });
            }

        },

        redirectAfterSave: function (content) {
            var redirectUrl = 'easyErp/manualEntry';

            content.hideDialog();
            Backbone.history.navigate(redirectUrl, {trigger: true});
        },

        hideSaveCancelBtns: function () {
            var $topBar = $('#top-bar');
            var createBtnEl = $topBar.find('#top-bar-createBtn');
            var saveBtnEl = $topBar.find('#top-bar-saveBtn');
            var cancelBtnEl = $topBar.find('#top-bar-deleteBtn');

            this.changed = false;

            saveBtnEl.hide();
            cancelBtnEl.hide();
            createBtnEl.show();

            return false;
        },

        render: function () {
            var self = this;
            var formString = this.template();

            this.hideSaveCancelBtns();

            this.$el = $(formString).dialog({
                autoOpen   : true,
                width      : '500px',
                dialogClass: 'create-dialog-manual',
                title      : 'Create Manual Journal Entry',
                buttons    : [
                    {
                        id   : 'createBtn',
                        class: 'btn blue',
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    }, {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                            ga && ga.trackingEditCancel();
                        }
                    }]

            });

            this.$el.find('#employeesDdWrap').hide();

            populate.get('#journalsDd', '/journals/getForDd', {}, 'name', this, true, true);
            populate.get('#currencyDd', '/currency/getForDD', {}, 'name', this, true);
            // populate.get2name('#employeesDd', '/employees/getForDD', {}, this, true, true);
            populate.get('#account', '/chartOfAccount/getForDd', {}, 'name', this, true);
            populate.get('#creditAccountDd', '/chartOfAccount/getForDd', {}, 'name', this);
            populate.get('#debitAccountDd', '/chartOfAccount/getForDd', {}, 'name', this);
            populate.get('#sourceDocumentDd', '/journalEntries/getSourceForDd', {}, 'name', this, true, true);

            this.$el.find('#date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                maxDate    : new Date()
            }).datepicker('setDate', new Date());

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});

