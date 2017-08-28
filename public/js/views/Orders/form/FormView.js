define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/Orders/form/FormTemplate.html',
    'text!templates/Orders/temps/documentTemp.html',
    'views/dialogViewBase',
    'views/Projects/projectInfo/proformas/proformaView',
    'views/Products/InvoiceOrder/ProductItems',
    'views/Projects/projectInfo/orders/orderView',
    'collections/Quotations/filterCollection',
    'collections/Proforma/filterCollection',
    'views/NoteEditor/NoteView',
    'views/Editor/AttachView',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants',
    'helpers/keyValidator',
    'helpers'
], function (Backbone,
             $,
             _,
             EditTemplate,
             DocumentTemplate,
             BaseView,
             ProformaView,
             ProductItemView,
             OrdersView,
             QuotationCollection,
             ProformaCollection,
             NoteEditor,
             AttachView,
             common,
             Custom,
             dataService,
             populate,
             CONSTANTS,
             keyValidator,
             helpers) {
    'use strict';

    var FormView = BaseView.extend({
        contentType: 'Orders',
        imageSrc   : '',
        template   : _.template(EditTemplate),
        templateDoc: _.template(DocumentTemplate),
        forSales   : false,

        initialize: function (options) {
            if (options) {
                this.visible = options.visible;
                this.eventChannel = options.eventChannel;
            }

            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }

            this.currentModel.urlRoot = '/orders';
        },

        events: {
            'click .receiveInvoice' : 'receiveInvoice',
            'click .cancelOrder'    : 'cancelOrder',
            'click .setDraft'       : 'setDraft',
            'click #attachment_file': 'clickInput'
        },

        cancelOrder: function (e) {
            var self = this;

            e.preventDefault();

            populate.fetchWorkflow({
                wId   : 'Purchase Order',
                status: 'Cancelled',
                order : 1
            }, function (workflow) {
                var redirectUrl = self.forSales ? 'easyErp/salesOrders' : 'easyErp/Orders';

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
        
        receiveInvoice: function (e) {
            var self = this;
            var url = '/invoices/receive';
            var journal = this.forSales ? CONSTANTS.INVOICE_JOURNAL : CONSTANTS.INVOICE_PURCHASE;
            var data = {
                forSales: this.forSales,
                orderId : this.currentModel.id,
                currency: this.currentModel.currency,
                journal : journal
            };

            e.preventDefault();

            dataService.postData(url, data, function (err) {
                var redirectUrl = self.forSales ? 'easyErp/salesInvoices' : 'easyErp/Invoices';

                if (err) {
                    App.render({
                        type   : 'error',
                        message: 'Can\'t create invoice'
                    });
                } else {
                    Backbone.history.navigate(redirectUrl, {trigger: true});
                }
            });

        },

        setDraft: function (e) {
            var self = this;

            e.preventDefault();

            populate.fetchWorkflow({
                wId: 'Quotation'
            }, function (workflow) {
                var redirectUrl = self.forSales ? 'easyErp/salesOrders' : 'easyErp/Orders';

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

        redirectAfter: function (content) {
            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        render: function () {
            var $thisEl = this.$el;
            var model = this.currentModel.toJSON();
            var formString = this.template({
                model        : model,
                visible      : this.visible,
                hidePrAndCust: this.hidePrAndCust
            });
            var template;
            var timeLine;

            $thisEl.html(formString);

            template = this.templateDoc({
                model            : model,
                currencySplitter : helpers.currencySplitter
            });

            timeLine = new NoteEditor({
                model : this.currentModel
            });

            $thisEl.find('#templateDiv').html(template);

            $thisEl.find('#historyDiv').html(
                timeLine.render().el
            );
            $thisEl.find('#attachments').append(
                new AttachView({
                    model      : this.currentModel,
                    contentType: 'quotations',
                    forDoc     : true
                }).render().el
            );

            this.delegateEvents(this.events);

            App.stopPreload();

            return this;
        }
    });

    return FormView;
});
