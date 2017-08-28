define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/order/form/FormTemplate.html',
    'text!templates/order/temps/documentTemp.html',
    'views/NoteEditor/NoteView',
    'views/Editor/AttachView',
    'views/Payment/CreateView',
    'views/refund/CreateView',
    'views/stockReturns/CreateView',
    'views/settingsOverview/Accounting/paymentMethod/paymentMethodCreate',
    'dataService',
    'constants',
    'helpers',
    'services/showJournalEntries',
    'helpers/ga',
    'views/guideTours/guideNotificationView'
], function (Backbone, $, _, ParentView, EditTemplate, DocumentTemplate, NoteEditor, AttachView, PaymentCreateView, RefundCreateView, ReturnSalesView, CreatePaymentMethod, dataService, CONSTANTS, helpers, journalService, ga, GuideNotify) {

    var FormView = ParentView.extend({
        contentType: 'order',
        imageSrc   : '',
        template   : _.template(EditTemplate),
        forSales   : true,
        service    : false,
        templateDoc: _.template(DocumentTemplate),

        initialize: function (options) {
            var modelObj;

            if (options) {
                this.visible = options.visible;
            }

            this.eventsChannel = App.eventsChannel || _.extend({}, Backbone.Events);

            this.listenTo(this.eventsChannel, 'createdPaymentMethod', this.reloadPage);

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/order';
            this.responseObj = {};
            this.warehouse = this.currentModel.get('warehouse');
            this.eventChannel = options.eventChannel;
            this.editable = options.editable || true;
            this.balanceVissible = false;
            modelObj = this.currentModel.toJSON();
            this.onlyView = (modelObj.workflow && modelObj.workflow.status === 'Done');
        },

        events: {
            'click .details'            : 'showDetailsBox',
            'click .prepay'             : 'createPrepayment',
            'click .refund'             : 'createRefund',
            'click #salesReturn'        : 'returnSales',
            'click .receiveInvoice'     : 'receiveInvoice',
            'click .cancelOrder'        : 'cancelOrder',
            'click .setDraft'           : 'setDraft',
            'click #resetPrices'        : 'resetPrices',
            'click #fulfillAll'         : 'fullfillShip',
            'click #fulfilAndShip'      : 'fullfillShip',
            'click #splitFulfil'        : 'splitFulfil',
            'click #allocateAll'        : 'allocateAll',
            'click #unallocateAll'      : 'deleteAllocation',
            'click .saveBtn'            : 'saveOrder',
            'change #allocated'         : 'changeAllocation',
            'click #attachment_file'    : 'clickInput',
            'click #viewJournalEntries' : journalService.showForDocs,
            'click #createPaymentMethod': 'createPaymentMethod'
        },

        checkActiveClass: function (e) {
            var $target = $(e.target);

            if ($target.closest('li').hasClass('activeItem')) {
                return true;
            }

            return false;
        },

        createPaymentMethod: function () {
            var paymentValue = _.find(this.currentModel.toJSON().conflictTypes, function (el) {
                return el.type === 'paymentMethod';
            });

            return new CreatePaymentMethod({channel: this.eventsChannel, model: paymentValue});
        },

        reloadPage: function () {
            var url = window.location.hash;

            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});
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

        returnSales: function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!this.checkActiveClass(e)) {
                return false;
            }

            return new ReturnSalesView({
                model: this.currentModel
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

                return new PaymentCreateView({
                    model       : self.currentModel,
                    currency    : currency && (typeof currency._id === 'object') ? currency._id : currency,
                    title       : 'Get payment',
                    prepayment  : true,
                    mid         : 123,
                    eventChannel: self.eventChannel,
                    paymentsSum : data.paymentAmount // parseFloat(self.currentModel.get('prepayment')) / 100
                });
            });
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var formString;
            var productItemContainer;
            var buttons;
            var template;
            var timeLine;

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
                    }, {
                        text : 'Delete',
                        class: 'btn',
                        click: self.deleteItem
                    }
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

            this.template = _.template(EditTemplate);

            formString = this.template({
                model             : this.currentModel.toJSON(),
                visible           : this.visible,
                onlyView          : this.onlyView,
                forSales          : this.forSales,
                dialog            : this.dialog,
                unlinkedWorkflowId: CONSTANTS.DEFAULT_UNLINKED_WORKFLOW_ID
            });

            if (!this.dialog) {
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

            } else {
                this.$el = $(formString).dialog({
                    autoOpen   : true,
                    dialogClass: 'edit-dialog',
                    title      : 'Edit Order',
                    width      : '1100px',
                    buttons    : buttons
                });

                this.$el.find('.saveBtn').remove();
            }

            this.delegateEvents(this.events);

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
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
