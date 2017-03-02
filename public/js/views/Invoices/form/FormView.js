define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/Invoices/form/FormTemplate.html',
    'text!templates/Invoices/temps/documentTemp.html',
    'views/NoteEditor/NoteView',
    'views/Editor/AttachView',
    'views/Payment/CreateView',
    'views/salesInvoices/EmailView',
    'views/Payment/list/ListHeaderInvoice',
    'dataService',
    'populate',
    'constants',
    'helpers'
], function ($,
             _,
             Backbone,
             ParentView,
             EditTemplate,
             DocumentTemplate,
             NoteEditor,
             AttachView,
             PaymentCreateView,
             EmailVew,
             listHederInvoice,
             dataService,
             populate,
             CONSTANTS,
             helpers) {
    'use strict';

    var FormView = ParentView.extend({
        contentType: CONSTANTS.INVOICES, // 'Invoices',
        template   : _.template(EditTemplate),
        templateDoc: _.template(DocumentTemplate),

        events: {
            'click #cancelBtn'      : 'hideDialog',
            'click .details'        : 'showDetailsBox',
            'click .newPayment'     : 'newPayment',
            'click .sendEmail'      : 'sendEmail',
            'click #attachment_file': 'clickInput',
            'click .approve'        : 'approve',
            'click .cancelInvoice'  : 'cancelInvoice',
            'click .setDraft'       : 'setDraft'
        },

        initialize: function (options) {

            this.eventChannel = options.eventChannel;

            this.isWtrack = !!options.isWtrack;
            this.filter = options.filter;

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/Invoices';
            this.responseObj = {};

            this.redirect = options.redirect;
            this.collection = options.collection;

            this.notCreate = options.notCreate ? false : true;

            App.stopPreload();
        },

        newPayment: function (e) {
            var self = this;
            var mid = this.forSales ? 56 : 109;
            var currency = self.currentModel.get('currency');

            e.preventDefault();

            new PaymentCreateView({
                model       : self.currentModel,
                redirect    : self.redirect,
                collection  : self.collection,
                mid         : mid,
                currency    : currency && (typeof currency._id === 'object') ? currency._id : currency,
                eventChannel: self.eventChannel
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
            var model = this.currentModel.toJSON();
            var data;
            var url;
            var redirectUrl;

            e.preventDefault();

            url = '/invoices/approve';
            data = {
                invoiceId  : model._id,
                invoiceDate: model.invoiceDate
            };

            if (!model.journal) {
                App.render({
                    type   : 'error',
                    message: 'Please, click on "Edit" and then choose Journal'
                });
            } else if (!model.dueDate) {
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
                currencySplitter: helpers.currencySplitter
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

    return FormView;
});
