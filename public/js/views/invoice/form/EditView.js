define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/invoice/form/FormView',
    'text!templates/invoice/baseForm/baseFormTemplate.html',
    'views/Notes/AttachView',
    'views/Notes/NoteView',
    'views/Products/orderRows/ProductItems',
    'views/Payment/CreateView',
    'views/salesInvoices/EmailView',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants',
    'helpers',
    'moment'
], function ($,
             _,
             Backbone,
             ParentView,
             EditTemplate,
             AttachView,
             NoteView,
             InvoiceItemView,
             PaymentCreateView,
             EmailVew,
             common,
             Custom,
             dataService,
             populate,
             CONSTANTS,
             helpers,
             moment) {
    'use strict';

    var FormView = ParentView.extend({
        contentType: CONSTANTS.INVOICE, // 'Invoices',
        template   : _.template(EditTemplate),
        el         : '.form-holder',

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');

            this.eventChannel = options.eventChannel;

            this.isWtrack = !!options.isWtrack;
            this.filter = options.filter;
            this.forSales = options.forSales;

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/invoice';
            this.responseObj = {};

            this.redirect = options.redirect;
            this.collection = options.collection;

            this.dialog = options.dialog;

            this.notCreate = options.notCreate ? false : true;

            App.stopPreload();
        },

        hideDialog: function () {
            $('.edit-invoice-dialog').remove();
        },

        saveItem: function (paymentCb) {
            var self = this;
            var mid = 56;

            var $thisEl = this.$el;

            var errors = $thisEl.find('.errorContent');
            var data;
            var currency = {
                _id : $thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim($thisEl.find('#currencyDd').text())
            };

            var invoiceDate = $thisEl.find('#invoice_date').val();
            var dueDate = $thisEl.find('#due_date').val();

            var supplier = $thisEl.find('#supplier').attr('data-id');

            var total = helpers.spaceReplacer($thisEl.find('#totalAmount').text());
            var discount = parseFloat($thisEl.find('#discount').val());
            var unTaxed = helpers.spaceReplacer($thisEl.find('#totalUntaxes').text());
            var balance = helpers.spaceReplacer($thisEl.find('#balance').text());
            var taxes = helpers.spaceReplacer($thisEl.find('#taxes').text());
            var payments;
            var salesPersonId;
            var paymentTermId;
            var paymentMethodId;
            var journalId;

            var usersId;
            var groupsId;

            var whoCanRW;

            this.gaTrackingEditConfirm();

            total = parseFloat(total);
            balance = parseFloat(balance);
            unTaxed = parseFloat(unTaxed);
            taxes = parseFloat(taxes);

            payments = {
                total   : total * 100,
                taxes   : taxes * 100,
                unTaxed : unTaxed * 100,
                balance : balance * 100,
                discount: discount * 100
            };

            salesPersonId = $thisEl.find('#salesPerson').attr('data-id') || null;
            paymentTermId = $thisEl.find('#paymentTerm').attr('data-id') || null;
            paymentMethodId = $thisEl.find('#paymentMethod').attr('data-id') || null;
            journalId = $thisEl.find('#journal').attr('data-id') || null;

            usersId = [];
            groupsId = [];

            whoCanRW = $thisEl.find("[name='whoCanRW']:checked").val();

            if (errors.length) {
                App.stopPreload();

                return App.render({
                    type   : 'error',
                    message: 'Please fill all required fields.'
                });
            }

            $('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).data('id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).data('id'));
                }

            });

            data = {
                currency      : currency,
                supplier      : supplier,
                fiscalPosition: null,
                name          : $.trim(this.$el.find('#supplier_invoice_num').val()),
                dueDate       : dueDate,
                account       : null,
                journal       : journalId,
                salesPerson   : salesPersonId,
                paymentTerms  : paymentTermId,
                paymentMethod : paymentMethodId,
                paymentInfo   : payments,

                groups: {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW

            };

            if (this.model.toJSON().invoiceDate !== invoiceDate) {
               invoiceDate = helpers.setTimeToDate(invoiceDate);

               data.invoiceDate = invoiceDate;
            }

            if (supplier) {
                this.model.set(data);
                this.model.save(this.model.changed, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    patch  : true,
                    success: function (err, result) {
                        var $dueDateEl;
                        var url = window.location.hash;

                        self.hideDialog();

                        if (paymentCb && typeof paymentCb === 'function') {
                            return paymentCb(null, currency);
                        }

                        if (self.eventChannel) {
                            self.eventChannel.trigger('invoiceUpdated', null, null, true);
                        }

                        $dueDateEl = $('[data-id="' + result.id + '"]').closest('tr').find('.date');
                        $dueDateEl.text(result.dueDate);
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(url, {trigger: true});

                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);

                        if (paymentCb && typeof paymentCb === 'function') {
                            return paymentCb(xhr.text);
                        }
                    }
                });

            } else {
                App.render({
                    type   : 'error',
                    message: CONSTANTS.RESPONSES.CREATE_QUOTATION
                });
            }
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var holder = $target.closest('.current-selected');
            var $dueDate = this.$el.find('#due_date');
            var invoiceDate = this.$el.find('#invoice_date').val();
            holder.text($target.text()).attr('data-id', $target.attr('id')).attr('data-level', $target.attr('data-level'));

            if (holder.attr('id') === 'paymentTerm' && $.trim($target.text()) !== 'Custom') {
                if ($target.attr('data-level')) {
                    holder.attr('data-level', $target.attr('data-level'));
                    $dueDate.val(moment(new Date(invoiceDate)).add($target.attr('data-level'), 'days').format('D MMM, YYYY'));
                    $dueDate.removeClass('errorContent');
                } else {
                    $dueDate.val(invoiceDate);
                    $dueDate.removeClass('errorContent');
                }

            }

        },

        deleteItem: function (event) {
            var self = this;
            var answer;

            event.preventDefault();

            answer = confirm('Really DELETE items ?!');
            if (answer) {
                this.currentModel.destroy({
                    success: function () {
                        var url = window.location.hash;

                        $('.edit-invoice-dialog').remove();

                        self.hideDialog();

                        if (self.eventChannel) {
                            self.eventChannel.trigger('invoiceRemove');
                        } else {
                            Backbone.history.fragment = '';
                            Backbone.history.navigate(url, {trigger: true});
                        }
                    },

                    error: function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        }
                    }
                });
            }

        },

        render: function () {
            var $thisEl = this.$el;
            var self = this;
            var formString;
            var notDiv;
            var model;
            var invoiceItemContainer;
            var paymentContainer;
            var wTracks;
            var project;
            var assigned;
            var customer;
            var total;
            var invoiceDate;
            var isFinancial;
            var dueDate;
            var paidAndNotApproved = false;
            var needNotes = false;
            var buttons;

            if (!this.onlyView) {
                buttons = [
                    {
                        text : 'Save',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                        }
                    }, {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }/*, {
                     text : 'Delete',
                     class: 'btn',
                     click: function (e) {
                     self.deleteItem(e);
                     }
                     }*/
                ];
            } else {
                buttons = [
                    {
                        text : 'Close',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ];
            }

            model = this.currentModel.toJSON();
            invoiceDate = model.invoiceDate;
            dueDate = model.dueDate;

            if (!model.approved) {
                needNotes = true;
            }

            this.isPaid = (model && model.workflow) ? model.workflow.status === 'Done' : false;

            if (this.isPaid && !model.approved) {
                paidAndNotApproved = true;
            }

            this.notAddItem = true;

            if (this.isWtrack) {
                wTracks = _.map(model.products, function (product) {
                    return product.product;
                });
                project = model.project;
                assigned = model.salesPerson;
                customer = model.supplier;
                total = model.paymentInfo ? model.paymentInfo.total : '0.00';
            }

            isFinancial = CONSTANTS.INVOICE_APPROVE_PROFILES.indexOf(App.currentUser.profile._id) !== -1;

            formString = this.template({
                model             : this.currentModel.toJSON(),
                isWtrack          : self.isWtrack,
                isPaid            : this.isPaid,
                paidAndNotApproved: paidAndNotApproved,
                forSales          : this.forSales,
                notAddItem        : this.notAddItem,
                wTracks           : wTracks,
                project           : project,
                assigned          : assigned,
                customer          : customer,
                total             : total,
                currencySplitter  : helpers.currencySplitter,
                currencyClass     : helpers.currencyClass,
                isFinancial       : isFinancial,
                dialog            : this.dialog
            });

            if (!this.dialog) {
                $thisEl.html(formString);
            } else {
                this.$el = $(formString).dialog({
                    autoOpen   : true,
                    dialogClass: 'edit-invoice-dialog',
                    title      : 'Edit Invoice',
                    width      : '1100px',
                    buttons    : buttons
                });

                this.$el.find('.saveBtn').remove();
            }

            if (!model.approved) {
                populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);

                if (!model.paymentMethod && model.project && model.project.paymentMethod) {
                    populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, false, true, null, model.project.paymentMethod);
                } else {
                    populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, false, true, null, model.paymentMethod);
                }

                if (!model.paymentTerms && model.project && model.project.paymentTerms) {
                    populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, true, true, null, model.project.paymentTerms);
                } else {
                    populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, false, true);
                }

                if (model.journal) {
                    populate.get('#journal', '/journals/getForDd', {}, 'name', this, true, true, null, model.journal._id);
                } else {
                    populate.get('#journal', '/journals/getForDd', {}, 'name', this, true, true);
                }
            }

            this.$el.find('#invoice_date').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                disabled   : model.approved,
                maxDate    : 0,
                minDate    : invoiceDate,
                onSelect   : function () {
                    var dueDatePicker = $('#due_date');
                    var endDate = $(this).datepicker('getDate');
                    var count = self.$el.find('#paymentTerm').attr('data-level');

                    endDate.setDate(endDate.getDate());

                    dueDatePicker.datepicker('option', 'minDate', endDate);
                    if (count) {
                        dueDatePicker.val(moment(endDate).add(count, 'days').format('D MMM, YYYY'));
                        dueDatePicker.removeClass('errorContent');
                    }
                    if ($.trim(self.$el.find('#paymentTerm').text()) === 'Due on Receipt') {
                        dueDatePicker.val($(this).val());
                        dueDatePicker.removeClass('errorContent');
                    }
                }
            });

            this.$el.find('#due_date').datepicker({
                defaultValue: invoiceDate,
                dateFormat  : 'd M, yy',
                changeMonth : true,
                disabled    : model.approved,
                changeYear  : true,
                onSelect    : function () {
                    var targetInput = $(this);
                    var customTerm = _.findWhere(self.responseObj['#paymentTerm'], {name: 'Custom'});
                    var holder = self.$el.find('#paymentTerm').parents('dd').find('.current-selected');

                    targetInput.removeClass('errorContent');

                    holder.text(customTerm ? customTerm.name : '').attr('data-id', customTerm ? customTerm._id : '');

                }
            }).datepicker('option', 'minDate', invoiceDate);

            this.delegateEvents(this.events);

            if (isFinancial && !model.approved) {
                self.$el.find('.sendEmail').remove();
                self.$el.find('.newPayment').remove();
            }

            invoiceItemContainer = this.$el.find('#productItemsHolder');

            invoiceItemContainer.append(
                new InvoiceItemView({
                    balanceVisible    : true,
                    discountVisible   : true,
                    forSales          : self.forSales,
                    isPaid            : this.isPaid,
                    availableVisible  : false,
                    paidAndNotApproved: paidAndNotApproved,
                    notAddItem        : this.notAddItem,
                    parentModel       : self.model,
                    notEditable       : true
                }).render().el
            );

            return this;
        }

    });

    return FormView;
});
