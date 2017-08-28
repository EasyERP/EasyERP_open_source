define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/purchaseOrders/form/FormTemplate.html',
    'text!templates/purchaseOrders/temps/documentTemp.html',
    'views/NoteEditor/NoteView',
    'views/Editor/AttachView',
    'views/Payment/CreateView',
    'views/refund/CreateView',
    'views/stockReturns/CreateView',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants',
    'helpers',
    'services/showJournalEntries',
    'views/guideTours/guideNotificationView'
], function (Backbone, $, _, ParentView, EditTemplate, DocumentTemplate, NoteEditor, AttachView, PaymentCreateView, RefundCreateView, ReturnSalesView, common, Custom, dataService, populate, CONSTANTS, helpers, journalService, GuideNotify) {

    var FormView = ParentView.extend({
        contentType: 'purchaseOrders',
        imageSrc   : '',
        template   : _.template(EditTemplate),
        forSales   : false,
        service    : false,
        templateDoc: _.template(DocumentTemplate),

        initialize: function (options) {
            var modelObj;

            if (options) {
                this.visible = options.visible;
            }

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/purchaseOrders';
            this.responseObj = {};
            this.editablePrice = this.currentModel.get('workflow').status === 'New' || false;
            this.warehouse = this.currentModel.get('warehouse');
            this.editable = options.editable || true;
            this.balanceVissible = false;
            modelObj = this.currentModel.toJSON();
            this.onlyView = (modelObj.workflow && modelObj.workflow.status === 'Done');
        },

        events: {
            'click .prepay'            : 'createPrepayment',
            'click .refund'            : 'createRefund',
            'click #salesReturn'       : 'returnSales',
            'click .receiveInvoice'    : 'receiveInvoice',
            'click .cancelOrder'       : 'cancelOrderView',
            'click .receiveInventory'  : 'receiveInventory',
            'click #resetPrices'       : 'resetPrices',
            'click .saveBtn'           : 'saveOrder',
            'click #attachment_file'   : 'clickInput',
            'click #viewJournalEntries': journalService.showForDocs
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

        cancelOrderView: function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!this.checkActiveClass(e)) {
                return false;
            }

            return new ReturnSalesView({
                model     : this.currentModel,
                purchase  : true,
                parentView: this,
                cancel    : true
            });
        },

        returnSales: function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!this.checkActiveClass(e)) {
                return false;
            }

            return new ReturnSalesView({
                model   : this.currentModel,
                purchase: true
            });
        },

        createPrepayment: function (e) {
            var self = this;
            var currency = self.currentModel.get('currency');
            var data = {};

            if (!this.checkActiveClass(e)) {
                return false;
            }

            e.preventDefault();
            e.stopPropagation();

            dataService.getData('/payments/getPrepayments', {
                id      : self.currentModel.get('_id'),
                currency: currency
            }, function (response) {
                data.totalAmount = self.currentModel.get('paymentInfo').total;
                data.paymentAmount = response.sumInCurrency / 100;
                data.invoiceCurrency = currency._id.name;
                data.paymentCurrency = 'USD';
                data.date = new Date();

                dataService.getData(CONSTANTS.URLS.PAYMENT_AMOUNT_LEFT, data,
                    function (res) {
                        return new PaymentCreateView({
                            model      : self.currentModel,
                            currency   : currency && (typeof currency._id === 'object') ? currency._id : currency,
                            title      : 'Get payment',
                            prepayment : true,
                            mid        : 129,
                            paymentsSum: data.paymentAmount
                        });
                    });

            });
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var formString;
            var template;
            var timeLine;

            this.template = _.template(EditTemplate);

            formString = this.template({
                model   : this.currentModel.toJSON(),
                visible : this.visible,
                onlyView: this.onlyView,
                forSales: this.forSales
            });

            $thisEl.html(formString);

            template = this.templateDoc({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter,
                addressMaker    : helpers.addressMaker
            });

            $thisEl.find('#templateDiv').html(template);

            timeLine = new NoteEditor({
                model: this.currentModel
            });

            $thisEl.find('#historyDiv').html(
                timeLine.render().el
            );

            $thisEl.find('#attachments').append(
                new AttachView({
                    model      : this.currentModel,
                    contentType: 'order',
                    forDoc     : true
                }).render().el
            );

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }

            this.delegateEvents(this.events);

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
