define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/ExpensesInvoice/EditTemplate.html',
    'views/Notes/AttachView',
    'views/Invoices/InvoiceProductItems',
    'views/salesInvoices/wTrack/wTrackRows',
    'views/Payment/CreateView',
    'views/salesInvoices/EmailView',
    'views/Payment/list/ListHeaderInvoice',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants',
    'helpers'
], function ($,
             _,
             Backbone,
             ParentView,
             EditTemplate,
             AttachView,
             InvoiceItemView,
             wTrackRows,
             PaymentCreateView,
             EmailVew,
             listHederInvoice,
             common,
             Custom,
             dataService,
             populate,
             CONSTANTS,
             helpers) {
    'use strict';

    var EditView = ParentView.extend({
        contentType: 'Invoices',
        template   : _.template(EditTemplate),

        events: {
            'click #saveBtn'      : 'saveItem',
            'click .details'      : 'showDetailsBox',
            'click .newPayment'   : 'newPayment',
            'click .sendEmail'    : 'sendEmail',
            'click .approve'      : 'approve',
            'click .cancelInvoice': 'cancelInvoice',
            'click .setDraft'     : 'setDraft'

        },

        initialize: function (options) {

            _.bindAll(this, 'render', 'deleteItem');

            this.eventChannel = options.eventChannel;

            this.isWtrack = !!options.isWtrack;
            this.filter = options.filter;

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/Invoices';
            this.responseObj = {};

            this.redirect = options.redirect;
            this.collection = options.collection;

            this.notCreate = options.notCreate ? false : true;

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
                mid         : 97,
                currency    : model.currency,
                eventChannel: self.eventChannel
            });

        },

        cancelInvoice: function (e) {
            var wId;
            var self = this;
            var redirectUrl = self.forSales ? 'easyErp/salesInvoice' : 'easyErp/Invoice';

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
            var redirectUrl = self.forSales ? 'easyErp/salesInvoice' : 'easyErp/Invoice';

            e.preventDefault();

            if (self.forSales) {
                wId = 'Sales Invoice';
            } else {
                wId = 'Purchase Invoice';
            }

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

        showDetailsBox: function (e) {
            $(e.target).parent().find('.details-box').toggle();
        },

        chooseUser: function (e) {
            $(e.target).toggleClass('choosen');
        },

        chooseOption: function (e) {
            var holder = $(e.target).parents('dd').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
        },

        deleteItem: function (event) {
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            event.preventDefault();

            if (answer) {
                this.currentModel.destroy({
                    success: function () {
                        $('.edit-invoice-dialog').remove();

                        self.hideDialog();

                        if (self.eventChannel) {
                            self.eventChannel.trigger('invoiceRemove');
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
            var isFinancial;

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
                    click: self.hideDialog
                }, {
                    text : 'Delete',
                    click: self.deleteItem
                }
            ];

            this.$el = $(formString).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                resizable    : true,
                dialogClass  : 'edit-invoice-dialog',
                title        : 'Edit Invoice',
                width        : '900',
                position     : {my: 'center bottom', at: 'center', of: window},
                buttons      : buttons

            });

            this.renderAssignees(this.currentModel);

            paymentContainer = this.$el.find('#payments-container');
            paymentContainer.append(
                new listHederInvoice().render({model: this.currentModel.toJSON()}).el
            );

            this.delegateEvents(this.events);

            invoiceItemContainer = this.$el.find('#invoiceItemsHolder');

            invoiceItemContainer.append(
                new InvoiceItemView({
                    balanceVisible: true,
                    forSales      : self.forSales,
                    isPaid        : this.isPaid,
                    notAddItem    : this.notAddItem
                }).render({model: model}).el
            );

            notDiv = this.$el.find('#attach-container');
            notDiv.append(
                new AttachView({
                    model: this.currentModel,
                    url  : '/uploadInvoiceFiles'
                }).render().el
            );

            if (model.approved) {
                self.$el.find('.input-file').remove();
                self.$el.find('a.deleteAttach').remove();
            }

            if (model.groups) {
                if (model.groups.users.length > 0 || model.groups.group.length) {
                    $('.groupsAndUser').show();
                    model.groups.group.forEach(function (item) {
                        $('.groupsAndUser').append("<tr data-type='targetGroups' data-id='" + item._id + "'><td>" + item.name + "</td><td class='text-right'></td></tr>");
                        $('#targetGroups').append("<li id='" + item._id + "'>" + item.name + '</li>');
                    });
                    model.groups.users.forEach(function (item) {
                        $('.groupsAndUser').append("<tr data-type='targetUsers' data-id='" + item._id + "'><td>" + item.login + "</td><td class='text-right'></td></tr>");
                        $('#targetUsers').append("<li id='" + item._id + "'>" + item.login + '</li>');
                    });

                }
            }

            return this;
        }

    });

    return EditView;
});
