define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/ExpensesInvoice/form/FormTemplate.html',
    'text!templates/ExpensesInvoice/temps/documentTemp.html',
    'views/NoteEditor/NoteView',
    'views/Editor/AttachView',
    'views/Payment/CreateView',
    'views/refund/CreateView',
    'views/salesInvoices/EmailView',
    'views/Payment/list/ListHeaderInvoice',
    'dataService',
    'populate',
    'constants',
    'helpers',
    'services/showJournalEntries'
], function ($,
             _,
             Backbone,
             ParentView,
             EditTemplate,
             DocumentTemplate,
             NoteEditor,
             AttachView,
             PaymentCreateView,
             RefundCreateView,
             EmailVew,
             listHederInvoice,
             dataService,
             populate,
             CONSTANTS,
             helpers,
             journalService) {
    'use strict';

    var FormView = ParentView.extend({
        contentType: CONSTANTS.EXPENSESINVOICE,
        template   : _.template(EditTemplate),
        templateDoc: _.template(DocumentTemplate),

        events: {
            'click #cancelBtn'         : 'hideDialog',
            'click .details'           : 'showDetailsBox',
            'click .newPayment'        : 'newPayment',
            'click .sendEmail'         : 'sendEmail',
            'click #attachment_file'   : 'clickInput',
            'click .approve'           : 'approve',
            'click .refund'            : 'createRefund',
            'click .cancelInvoice'     : 'cancelInvoice',
            'click .setDraft'          : 'setDraft',
            'click .saveBtn'           : 'saveItem',
            'click #viewJournalEntries': journalService.showForDocs
        },

        initialize: function (options) {

            this.eventChannel = options.eventChannel;

            this.isWtrack = !!options.isWtrack;
            this.filter = options.filter;

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/invoice';
            this.responseObj = {};

            this.redirect = options.redirect;
            this.collection = options.collection;

            this.notCreate = options.notCreate ? false : true;

            App.stopPreload();
        },

        checkActiveClass: function (e) {
            var $target = $(e.target);

            if ($target.closest('li').hasClass('activeItem')) {
                return true;
            }

            return false;
        },

        createRefund: function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!this.checkActiveClass(e)) {
                return false;
            }

            return new RefundCreateView({
                model       : this.currentModel,
                dontRedirect: true
            });
        },

        clickInput: function () {
            $('.input-file .inputAttach').click();
        },

        newPayment: function (e) {
            var self = this;
            var mid = 97;
            var currency = self.currentModel.get('currency');
            var paid = parseFloat(self.currentModel.get('paymentInfo.total')) - parseFloat(self.currentModel.get('paymentInfo.balance'));

            e.preventDefault();
            e.stopPropagation();

            /*if (!this.checkActiveClass(e)) {
                return false;
            }*/

            return new PaymentCreateView({
                model       : self.currentModel,
                redirect    : self.redirect,
                collection  : self.collection,
                mid         : mid,
                currency    : currency && (typeof currency._id === 'object') ? currency._id : currency,
                eventChannel: self.eventChannel,
                paymentsSum : paid
            });

        },

        sendEmail: function (e) {
            var self = this;

            e.preventDefault();
            e.stopPropagation();

            self.hideDialog();

            return new EmailVew({
                model: self.currentModel
            });
        },

        approve: function (e) {
            var self = this;
            var model = this.currentModel.toJSON();
            var data;
            var url;
            var redirectUrl;

            e.preventDefault();
            e.stopPropagation();

            url = '/invoice/approve';
            data = {
                invoiceId  : model._id,
                invoiceDate: helpers.setTimeToDate(model.invoiceDate)
            };

            if (this.dialog) {
                return this.saveItem(function () {
                    App.startPreload();
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

                        } else {
                            App.render({
                                type   : 'error',
                                message: 'Approve fail'
                            });
                        }
                    });
                });
            }

            if (!model.dueDate) {
                App.render({
                    type   : 'error',
                    message: 'Please, click on "Edit" and then choose Due Date'
                });
            } else {
                App.startPreload();
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

                    } else {
                        App.render({
                            type   : 'error',
                            message: 'Approve fail'
                        });
                    }
                });
            }
        },

        cancelInvoice: function (e) {
            var wId;
            var self = this;
            var redirectUrl = window.location.hash;
            var answer = confirm('Do you really want to cancel Invoice? This action will change status and make reverse Journal Entry');

            e.preventDefault();
            e.stopPropagation();

            if (answer) {
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
                        workflow: workflow._id,
                        reverse : true
                    }, {
                        headers: {
                            mid: 57
                        },
                        patch  : true,
                        success: function () {
                            Backbone.history.fragment = '';
                            Backbone.history.navigate(redirectUrl, {trigger: true});
                        }
                    });
                });
            }

        },

        setDraft: function (e) {
            var self = this;
            var wId;
            var redirectUrl;
            var answer = confirm('Do you really want to cancel Invoice? This action will change status and make Invoice "Not Approved"');

            e.preventDefault();
            e.stopPropagation();

            if (answer) {
                if (self.forSales) {
                    wId = 'Sales Invoice';
                } else {
                    wId = 'Purchase Invoice';
                }

                redirectUrl = window.location.hash;

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
                        workflow: workflow._id,
                        approved: false
                    }, {
                        headers: {
                            mid: 57
                        },
                        patch  : true,
                        success: function () {
                            Backbone.history.fragment = '';
                            Backbone.history.navigate(redirectUrl, {trigger: true});
                        }
                    });
                });
            }

        },

        hideDialog: function () {
            $('.edit-invoice-dialog').remove();
        },

        render: function () {
            var $thisEl = this.$el;
            var self = this;
            var formString;
            var model = this.currentModel.toJSON();
            var wTracks;
            var project;
            var assigned;
            var customer;
            var total;
            var isFinancial;
            var paidAndNotApproved = false;
            var template;
            var paymentContainer;
            var timeLine;

            this.isPaid = (model && model.workflow) ? model.workflow.status === 'Done' : false;

            if (this.isPaid && !model.approved) {
                paidAndNotApproved = true;
            }

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
                model             : model,
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
                isFinancial       : isFinancial
            });

            template = this.templateDoc({
                model           : model,
                currencySplitter: helpers.currencySplitter,
                addressMaker    : helpers.addressMaker
            });
            timeLine = new NoteEditor({
                model: this.currentModel
            });

            $thisEl.html(formString);

            $thisEl.find('#templateDiv').html(template);

            $thisEl.find('#historyDiv').html(
                timeLine.render().el
            );
            $thisEl.find('#attachments').append(
                new AttachView({
                    model      : this.currentModel,
                    contentType: 'Invoices',
                    forDoc     : true
                }).render().el
            );

            paymentContainer = this.$el.find('#payments-container');

            if (model && model.payments && model.payments.length) {
                paymentContainer.append(
                    new listHederInvoice().render({model: this.currentModel.toJSON()}).el
                );
            }

            this.delegateEvents(this.events);

            if (isFinancial && !model.approved) {
                self.$el.find('.sendEmail').remove();
                self.$el.find('.newPayment').remove();
            }

            return this;
        }

    });

    FormView.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return FormView;
});
