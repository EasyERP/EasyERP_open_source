define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/DividendInvoice/EditTemplate.html',
    'views/dialogViewBase',
    'views/DividendInvoice/InvoiceProductItems',
    'views/salesInvoices/wTrack/wTrackRows',
    'views/DividendPayments/CreateView',
    'views/salesInvoices/EmailView',
    'views/Payment/list/ListHeaderInvoice',
    'populate',
    'constants',
    'helpers'
], function ($,
             _,
             Backbone,
             EditTemplate,
             ParentView,
             InvoiceItemView,
             wTrackRows,
             PaymentCreateView,
             EmailVew,
             ListHeaderInvoice,
             populate,
             CONSTANTS,
             helpers) {
    'use strict';

    var EditView = ParentView.extend({
        contentType: 'Invoices',
        template   : _.template(EditTemplate),

        events: {
            'click #saveBtn'      : 'saveItem',
            'click #cancelBtn'    : 'hideDialog',
            'click .details'      : 'showDetailsBox',
            'click .newPayment'   : 'newPayment',
            'click .sendEmail'    : 'sendEmail',
            'click .approve'      : 'approve',
            'click .cancelInvoice': 'cancelInvoice',
            // 'click .refund': 'refund',
            'click .setDraft'     : 'setDraft'

        },

        initialize: function (options) {

            _.bindAll(this, 'render', 'deleteItem');

            this.eventChannel = options.eventChannel;

            this.isWtrack = !!options.isWtrack;
            this.filter = options.filter;

            this.currentModel = options.model || options.collection.getElement();
            this.currentModel.urlRoot = '/invoices';
            this.responseObj = {};

            this.redirect = options.redirect;
            this.collection = options.collection;

            this.notCreate = options.notCreate;

            this.render();

            App.stopPreload();
        },

        newPayment: function (e) {
            var paymentView;
            var self = this;
            var model = self.currentModel.toJSON();

            model.currency.name = model.currency._id.name;
            model.currency._id = model.currency._id._id;

            self.currentModel.set({currency: model.currency});

            e.preventDefault();

            self.hideDialog();

            paymentView = new PaymentCreateView({
                model       : self.currentModel,
                redirect    : self.redirect,
                collection  : self.collection,
                mid         : 100,
                currency    : model.currency,
                eventChannel: self.eventChannel
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
        },

        chooseOption: function (e) {
            var holder = $(e.target).parents('dd').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
        },

        deleteItem: function (event) {
            var url = window.location.hash;
            var self = this;
            var answer = confirm('Really DELETE items ?!');
            // var redirectUrl = this.forSales ? url : 'easyErp/Invoice';

            event.preventDefault();

            if (answer) {
                this.currentModel.destroy({
                    success: function () {

                        $('.edit-dialog').remove();

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
            var self = this;
            var formString;
            var model;
            var invoiceItemContainer;
            var paymentContainer;
            var wTracks;
            var project;
            var assigned;
            var customer;
            var total;
            var buttons;
            var isFinancial;
            var $thisEl;

            model = this.currentModel.toJSON();

            this.isPaid = (model && model.workflow) ? model.workflow.status === 'Done' : false;

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
                model           : this.currentModel.toJSON(),
                isWtrack        : self.isWtrack,
                isPaid          : this.isPaid,
                notAddItem      : this.notAddItem,
                wTracks         : wTracks,
                project         : project,
                assigned        : assigned,
                customer        : customer,
                total           : total,
                currencySplitter: helpers.currencySplitter,
                isFinancial     : isFinancial
            });

            buttons = [
                {
                    text : 'Close',
                    class: 'btn blue',
                    click: function () {
                        self.hideDialog();
                    }
                }, {
                    text : 'Delete',
                    class: 'btn',
                    click: self.deleteItem
                }
            ];

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Invoice',
                width      : '900',
                position   : {my: 'center bottom', at: 'center', of: window},
                buttons    : buttons

            });

            $thisEl = this.$el;

            this.renderAssignees();

            paymentContainer = $thisEl.find('#payments-container');
            paymentContainer.append(
                new ListHeaderInvoice().render({model: this.currentModel.toJSON()}).el
            );

            this.delegateEvents(this.events);

            invoiceItemContainer = $thisEl.find('#invoiceItemsHolder');

            invoiceItemContainer.append(
                new InvoiceItemView({
                    balanceVisible: true,
                    forSales      : self.forSales,
                    isPaid        : this.isPaid,
                    notAddItem    : this.notAddItem
                }).render({model: model}).el
            );

            return this;
        }

    });

    return EditView;
});
