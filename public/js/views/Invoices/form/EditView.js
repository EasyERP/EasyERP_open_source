define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/Invoices/form/EditTemplate.html',
    'views/Notes/AttachView',
    'views/Notes/NoteView',
    'views/Invoices/InvoiceProductItems',
    'views/salesInvoices/wTrack/wTrackRows',
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
             wTrackRows,
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
        contentType: CONSTANTS.INVOICES, // 'Invoices',
        template   : _.template(EditTemplate),
        el         : '.form-holder',

        events: {
            'click #saveBtn'      : 'saveItem',
            'click #cancelBtn'    : 'hideDialog',
            'click .details'      : 'showDetailsBox',
            'click .newPayment'   : 'newPayment',
            'click .sendEmail'    : 'sendEmail',
            'click .approve'      : 'approve',
            'click .cancelInvoice': 'cancelInvoice',
            'click .setDraft'     : 'setDraft',
            'click .saveBtn'      : 'saveItem'
        },

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');
            _.bindAll(this, 'render', 'deleteItem');

            this.eventChannel = options.eventChannel;

            this.isWtrack = !!options.isWtrack;
            this.filter = options.filter;
            this.forSales = options.forSales;

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/Invoices';
            this.responseObj = {};

            this.redirect = options.redirect;
            this.collection = options.collection;

            this.notCreate = options.notCreate ? false : true;

            App.stopPreload();
        },

       /* newPayment: function (e) {
            var paymentView;
            var self = this;
            var mid = this.forSales ? 56 : 109;

            e.preventDefault();

            this.saveItem(function (err, currency) {
                if (!err) {
                    paymentView = new PaymentCreateView({
                        model       : self.currentModel,
                        redirect    : self.redirect,
                        collection  : self.collection,
                        mid         : mid,
                        currency    : currency,
                        eventChannel: self.eventChannel
                    });
                }
            });
        },

        sendEmail: function (e) {
            var self = this;

            e.preventDefault();

            self.hideDialog();

            return new EmailVew({
                model: self.currentModel
            });
        },

        approve: function (e) {
            var self = this;
            var data;
            var url;
            var invoiceId;
            var $li;
            var $tr;
            var $span;
            var $buttons;
            var $selfEl = self.$el;
            var invoiceDate;
            var redirectUrl;
            var journal = this.$el.find('#journal').attr('data-id') || null;

            e.preventDefault();

            this.saveItem(function (err) {
                if (!err) {

                    if (journal) {

                        $selfEl.find('button.approve').hide();

                        invoiceId = self.currentModel.get('_id');
                        invoiceDate = self.$el.find('#invoice_date').val();
                        $tr = $('tr[data-id=' + invoiceId + ']');
                        $span = $tr.find('td').eq(10).find('span');

                        App.startPreload();

                        url = '/invoices/approve';
                        data = {
                            invoiceId  : invoiceId,
                            invoiceDate: helpers.setTimeToDate(invoiceDate)
                        };

                        dataService.patchData(url, data, function (err) {
                            if (!err) {
                                self.currentModel.set({approved: true});
                                // $buttons.show();

                                App.stopPreload();

                                if (self.eventChannel) {
                                    self.eventChannel.trigger('invoiceUpdated');
                                } else {
                                    redirectUrl = window.location.hash;

                                    Backbone.history.fragment = '';
                                    Backbone.history.navigate(redirectUrl, {trigger: true});
                                }

                                self.$el.find('.input-file').remove();
                                self.$el.find('a.deleteAttach').remove();
                            } else {
                                App.render({
                                    type   : 'error',
                                    message: 'Approve fail'
                                });
                            }
                        });
                    }
                } else {
                    App.render({
                        type   : 'error',
                        message: 'Please, choose journal first.'
                    });
                }
            });
        },

        cancelInvoice: function (e) {
            var wId;
            var self = this;
            var redirectUrl = self.forSales ? 'easyErp/salesInvoices' : 'easyErp/Invoices';

            e.preventDefault();

            if (self.forSales) {
                wId = 'Sales Invoice';
            } else {
                wId = 'Purchase Invoice';
            }

            populate.fetchWorkflow({
                wId         : wId,
                source      : 'purchase',
                targetSource: 'invoice',
                status      : 'Cancelled',
                order       : 1
            }, function (workflow) {
                if (workflow && workflow.error) {
                    return App.render({
                        type   : 'error',
                        message: workflow.error.statusText
                    });
                }

                self.currentModel.save({
                    workflow: workflow._id
                }, {
                    headers: {
                        mid: 57
                    },
                    patch  : true,
                    success: function () {
                        Backbone.history.navigate(redirectUrl, {trigger: true});
                    }
                });
            });
        },

        setDraft: function (e) {
            var self = this;
            var wId;
            var redirectUrl;

            e.preventDefault();

            if (self.forSales) {
                wId = 'Sales Invoice';
            } else {
                wId = 'Purchase Invoice';
            }

            redirectUrl = self.forSales ? 'easyErp/salesInvoices' : 'easyErp/Invoices';

            populate.fetchWorkflow({
                wId: wId
            }, function (workflow) {
                if (workflow && workflow.error) {
                    return App.render({
                        type   : 'error',
                        message: workflow.error.statusText
                    });
                }

                self.currentModel.save({
                    workflow: workflow._id
                }, {
                    headers: {
                        mid: 57
                    },
                    patch  : true,
                    success: function () {
                        Backbone.history.navigate(redirectUrl, {trigger: true});
                    }
                });
            });
        },

        chooseUser: function (e) {
            $(e.target).toggleClass('choosen');
        },*/

        hideDialog: function () {
            $('.edit-invoice-dialog').remove();
        },

        saveItem: function (paymentCb) {
            var self = this;
            var mid = 56;

            var $thisEl = this.$el;

            var errors = $thisEl.find('.errorContent');
            var selectedProducts = $thisEl.find('.productItem');
            var products = [];
            var selectedLength = selectedProducts.length;
            var jobDescription;
            var targetEl;
            var productId;
            var quantity;
            var price;
            var description;
            var taxes;
            var amount;
            var data;
            var currency = {
                _id : $thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim($thisEl.find('#currencyDd').text())
            };

            var invoiceDate = $thisEl.find('#invoice_date').val();
            var dueDate = $thisEl.find('#due_date').val();
            var jobs;

            var supplier = $thisEl.find('#supplier').attr('data-id');

            var total = helpers.spaceReplacer($thisEl.find('#totalAmount').text());
            var discount = parseFloat($thisEl.find('#discount').val());
            var unTaxed = helpers.spaceReplacer($thisEl.find('#totalUntaxes').text());
            var balance = helpers.spaceReplacer($thisEl.find('#balance').text());

            total = parseFloat(total);
            balance = parseFloat(balance);
            unTaxed = parseFloat(unTaxed);

            var payments = {
                total  : total*100,
                unTaxed: unTaxed*100,
                balance: balance*100,
                discount : discount
            };

            var salesPersonId = $thisEl.find('#salesPerson').attr('data-id') || null;
            var paymentTermId = $thisEl.find('#paymentTerm').attr('data-id') || null;
            var paymentMethodId = $thisEl.find('#paymentMethod').attr('data-id') || null;
            var journalId = $thisEl.find('#journal').attr('data-id') || null;

            var usersId = [];
            var groupsId = [];

            var whoCanRW = $thisEl.find("[name='whoCanRW']:checked").val();
            var i;

            if (errors.length) {
                App.stopPreload();

                return App.render({
                    type   : 'error',
                    message: 'Please fill all required fields.'
                });
            }

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    productId = targetEl.data('id');

                    if (productId) {
                        quantity = parseFloat(targetEl.find('[data-name="quantity"] span').text());
                        price = helpers.spaceReplacer(targetEl.find('[data-name="price"] .sum').text());
                        price = parseFloat(price) * 100;
                        jobs = targetEl.find('[data-id="jobs"]').attr('data-content');
                        description = targetEl.find('.productDescr').val();
                        jobDescription = targetEl.find('textarea.jobsDescription').val();
                        taxes = helpers.spaceReplacer(targetEl.find('.taxes .sum').text());
                        taxes = parseFloat(taxes) * 100;
                        amount = helpers.spaceReplacer(targetEl.find('.subtotal .sum').text());
                        amount = parseFloat(amount) * 100;

                        products.push({
                            product       : productId,
                            description   : description,
                            jobs          : jobs,
                            jobDescription: jobDescription,
                            unitPrice     : price,
                            quantity      : quantity,
                            taxes         : taxes,
                            subTotal      : amount
                        });
                    }
                }
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
                invoiceDate   : invoiceDate,
                dueDate       : dueDate,
                products      : products,
                account       : null,
                journal       : journalId,
                salesPerson  : salesPersonId,
                paymentTerms : paymentTermId,
                paymentMethod: paymentMethodId,
                paymentInfo  : payments,

                groups: {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW

            };

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
            var holder = $target.parents('dd').find('.current-selected');
            var $dueDate =  this.$el.find('#due_date');
            var invoiceDate = this.$el.find('#invoice_date').val();
            holder.text($target.text()).attr('data-id', $target.attr('id')).attr('data-level', $target.attr('data-level'));

            if (holder.attr('id') === 'paymentTerm' && $.trim($target.text()) !== 'Custom'){
                if ($target.attr('data-level')){
                    holder.attr('data-level', $target.attr('data-level'));
                    $dueDate.val(moment(new Date(invoiceDate)).add($target.attr('data-level'), 'days').format("D MMM, YYYY"));
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
            var buttons;
            var invoiceDate;
            var isFinancial;
            var dueDate;
            var paidAndNotApproved = false;
            var needNotes = false;

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
                isFinancial       : isFinancial
            });

            $thisEl.html(formString);

            populate.get2name('#supplier', '/supplier', {}, this, false);
            populate.get2name('#salesPerson', CONSTANTS.EMPLOYEES_RELATEDUSER, {}, this, true, true);
            populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);

            if (!model.paymentMethod && model.project && model.project.paymentMethod) {
                populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, true, true, model.project.paymentMethod);
            } else {
                populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, true, true, model.paymentMethod);
            }

            if (!model.paymentTerms && model.project && model.project.paymentTerms) {
                populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, true, true, model.project.paymentTerms);
            } else {
                populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, false, true);
            }

            if (!model.approved && model.journal) {
                populate.get('#journal', '/journals/getForDd', {}, 'name', this, true, true, model.journal._id);
            } else {
                populate.get('#journal', '/journals/getForDd', {}, 'name', this, true, true);
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
                    if (count){
                        dueDatePicker.val(moment(endDate).add(count, 'days').format("D MMM, YYYY"));
                        dueDatePicker.removeClass('errorContent');
                    }
                    if ($.trim(self.$el.find('#paymentTerm').text()) === 'Due on Receipt'){
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
                    var customTerm = _.findWhere(self.responseObj['#paymentTerm'], {name : 'Custom'});
                    var holder = self.$el.find('#paymentTerm').parents('dd').find('.current-selected');

                    targetInput.removeClass('errorContent');

                    holder.text(customTerm ? customTerm.name : '').attr('data-id', customTerm ? customTerm._id : '');

                }
            }).datepicker('option', 'minDate', invoiceDate);

            this.delegateEvents(this.events);

            invoiceItemContainer = this.$el.find('#invoiceItemsHolder');

            invoiceItemContainer.append(
                new InvoiceItemView({
                    balanceVisible    : true,
                    discountVisible   : true,
                    forSales          : self.forSales,
                    isPaid            : this.isPaid,
                    paidAndNotApproved: paidAndNotApproved,
                    notAddItem        : this.notAddItem
                }).render({model: model}).el
            );

            return this;
        }

    });

    return FormView;
});
