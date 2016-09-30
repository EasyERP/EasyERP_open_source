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
    'dataService'
], function (Backbone, $, _, ParentView, CreateJournalView, SelectView, CreateTemplate, JournalModel, keyCodes, populate, helpers, dataService) {
    'use strict';

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        template   : _.template(CreateTemplate),
        responseObj: {},

        events: {
            'click td.editable'    : 'editRow',
            'keydown input.editing': 'keyDown',
            'change .editable'     : 'setEditable',
            'click #createBtn'     : 'createJournal'
        },

        initialize: function () {
            this.model = new JournalModel();

            this.render();
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

            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }

            if (editedElement.length) {
                editedCol = editedElement.closest('td');

                editedElementValue = editedElement.val();

                editedElementValue = editedElementValue.toString();

                editedElementValue = editedElementValue.replace(/\s+/g, '');

                editedElementValue = parseFloat(editedElementValue);

                if (editedElementValue) {
                    editedCol.removeClass('errorContent');
                }

                editedCol.text(helpers.currencySplitter(editedElementValue.toFixed(2)));

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

            if (isSelect) {
                populate.showSelect(e, prev, next, this);
            } else {
                tempContainer = el.text();
                width = el.width() - 6;
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
            var tr = this.$el.find('#dataTr');
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
                    this.$el.find('#employeesDd').show();
                }
            } else if ($element.attr('id') !== 'employeesDd') {
                this.$el.find('#employeesDd').hide();
            }

            return false;
        },

        saveItem: function (e) {
            this.setChangedValueToModel(e);

            var self = this;
            var thisEl = this.$el;
            var data = {};
            var tr = this.$el.find('#dataTr');
            var debit = parseFloat(helpers.spaceReplacer(tr.find('#debit').text()));
            var credit = parseFloat(helpers.spaceReplacer(tr.find('#credit').text()));
            var debitAccount = tr.find('#debitAccountDd').attr('data-id');
            var creditAccount = tr.find('#creditAccountDd').attr('data-id');
            var currency = this.$el.find('#currencyDd').attr('data-id');
            var journal = this.$el.find('#journalsDd').attr('data-id');
            var type = $.trim(thisEl.find('#sourceDocumentDd').attr('data-type'));
            var employee = thisEl.find('#employeesDd').attr('data-id');

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

            data.date = new Date(thisEl.find('#date').val());
            data.sourceDocument.name = $.trim(thisEl.find('#sourceDocumentDd').text());
            data.sourceDocument._id = thisEl.find('#sourceDocumentDd').attr('data-id');
            data.sourceDocument.model = type;

            if (employee) {
                data.sourceDocument.employee = employee;
            }

            data.debit = debit * 100;
            data.credit = credit * 100;

            if (!data.sourceDocument._id) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose Source Document first.'
                });
            }

            if (!creditAccount || !debitAccount) {
                return App.render({
                    type   : 'error',
                    message: 'Please, choose Account first.'
                });
            }

            if (data.debit + data.credit !== 0) {
                /*if (data.debit !== 0 && data.credit !== 0) {*/ // other side in JE
                dataService.postData('journalEntries/createManual', data, function (err, response) {
                    if (err) {
                        return self.errorNotification(err);
                    }

                    self.redirectAfterSave(self);
                });
            } else {
                return App.render({
                    type   : 'error',
                    message: 'Please, fill debits and credits correctly.' /*"Debit and Credit can't be equal 0."*/
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
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'create-dialog-manual',
                title        : 'Create Manual Journal Entry',
                buttons      : [
                    {
                        id   : 'createBtn',
                        class: 'btn blue',
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    }, {
                        text : 'Cancel',
                        class: 'btn',
                        click: self.hideDialog
                    }]

            });

            this.$el.find('#employeesDd').hide();

            populate.get('#journalsDd', '/journals/getForDd', {}, 'name', this, true, true);
            populate.get('#currencyDd', '/currency/getForDD', {}, 'name', this, true);
            populate.get2name('#employeesDd', '/employees/getForDD', {}, this);
            /* populate.get('#debitAccountDd', '/chartOfAccount/getForDd', {}, 'name', this, true);
             populate.get('#creditAccountDd', '/chartOfAccount/getForDd', {}, 'name', this, true);*/
            populate.get('#sourceDocumentDd', '/journalEntries/getSourceForDd', {}, 'name', this, true);

            this.$el.find('#date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            }).datepicker('setDate', new Date());

            this.delegateEvents(this.events);

            return this;
        }

    });

    return CreateView;
});

