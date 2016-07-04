define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/WriteOff/EditTemplate.html',
    'views/Notes/AttachView',
    'views/Invoices/InvoiceProductItems',
    'views/salesInvoices/wTrack/wTrackRows',
    'views/Payment/CreateView',
    'views/salesInvoices/EmailView',
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

            e.preventDefault();

            this.saveItem(function (err) {
                if (!err) {
                    $selfEl.find('button.approve').hide();

                    invoiceId = self.currentModel.get('_id');
                    invoiceDate = self.$el.find('#invoice_date').val();
                    $tr = $('tr[data-id=' + invoiceId + ']');
                    $span = $tr.find('td').eq(10).find('span');

                    App.startPreload();

                    $buttons = $selfEl.find('button.sendEmail, button.newPayment');
                    url = '/invoices/approve';
                    data = {
                        invoiceId  : invoiceId,
                        invoiceDate: helpers.setTimeToDate(invoiceDate)
                    };

                    dataService.patchData(url, data, function (err) {
                        if (!err) {
                            self.currentModel.set({approved: true});
                            $buttons.show();

                            App.stopPreload();

                            if (self.eventChannel) {
                                self.eventChannel.trigger('invoiceUpdated');
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
            var redirectUrl = self.forSales ? 'easyErp/salesInvoices' : 'easyErp/Invoices';

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
                    text : 'Save',
                    click: self.saveItem
                }, {
                    text : 'Delete',
                    click: self.deleteItem
                },
                {
                    text : 'Close',
                    click: self.hideDialog
                }
            ];
            if (model.approved) {

                buttons = [
                    {
                        text : 'Close',
                        click: self.hideDialog
                    }, {
                        text : 'Delete',
                        click: self.deleteItem
                    }
                ];
            }

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
            populate.get('#currencyDd', CONSTANTS.URLS.CURRENCY_FORDD, {}, 'name', this, true);

            if (model.approved) {
                self.$el.find('.input-file').remove();
                self.$el.find('a.deleteAttach').remove();
            } else {
                this.$el.find('#invoice_date').datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true
                }).datepicker('setDate', new Date());

                this.$el.find('#due_date').datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true
                });
            }

            return this;
        }

    });

    return EditView;
});
