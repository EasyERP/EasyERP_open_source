define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/ExpensesInvoice/form/FormView',
    'text!templates/ExpensesInvoice/form/EditTemplate.html',
    'views/Editor/AttachView',
    'views/Products/orderRows/ProductItems',
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
             ProductItemView,
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
        contentType: CONSTANTS.EXPENSESINVOICE,
        template   : _.template(EditTemplate),
        el         : '.form-holder',

        events: {
            'click .details'      : 'showDetailsBox',
            'click .newPayment'   : 'newPayment',
            'click .sendEmail'    : 'sendEmail',
            'click .cancelInvoice': 'cancelInvoice',
            'click .setDraft'     : 'setDraft',
            'click .approve'      : 'approve'
        },

        initialize: function (options) {

            _.bindAll(this, 'render', 'deleteItem');

            this.eventChannel = options.eventChannel;

            this.isWtrack = !!options.isWtrack;
            this.filter = options.filter;

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/invoice';
            this.responseObj = {};

            this.redirect = options.redirect;
            this.collection = options.collection;

            this.notCreate = options.notCreate ? false : true;

            this.render();

            App.stopPreload();
        },

        approve: function (e) {
            var self = this;
            var model = this.currentModel.toJSON();
            var data;
            var url;
            var redirectUrl;

            e.preventDefault();
            e.stopPropagation();

            url = '/expensesInvoice/approve';
            data = {
                invoiceId      : model._id,
                invoiceDate    : model.invoiceDate,
                expensesInvoice: true
            };

            this.saveItem(function () {
                App.startPreload();
                dataService.patchData(url, data, function (err) {
                    if (!err) {
                        self.currentModel.set({approved: true});

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
            var redirectUrl = self.forSales ? 'easyErp/salesInvoices' : 'easyErp/ExpensesInvoice';

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
            var redirectUrl = self.forSales ? 'easyErp/salesInvoices' : 'easyErp/ExpensesInvoice';

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

        saveItem: function (cb) {
            var self = this;
            var mid = 97;
            var $currentEl = this.$el;
            var selectedProducts = $currentEl.find('.item');
            var products = [];
            var selectedLength = selectedProducts.length;
            var targetEl;
            var quantity;
            var price;
            var whoCanRW;
            var data;
            var description;
            var i;
            var supplier = $currentEl.find('#supplier').attr('data-id');
            var invoiceDate = $currentEl.find('#invoice_date').val();
            var dueDate = $currentEl.find('#due_date').val();
            var expensesCategory = $currentEl.find('#categories').attr('data-id') || null;
            var account;
            var usersId = [];
            var groupsId = [];
            var total = helpers.spaceReplacer($currentEl.find('#totalAmount').text());
            var discount = parseFloat($currentEl.find('#discount').val()) || 0;
            var unTaxed = helpers.spaceReplacer($currentEl.find('#totalUntaxes').text());
            var balance = helpers.spaceReplacer($currentEl.find('#balance').text());
            var taxes = helpers.spaceReplacer($currentEl.find('#taxes').text());
            var subTotal;
            var taxCode;
            var payments;
            var currency;

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
                discount: discount
            };

            currency = {
                _id : $currentEl.find('#currencyDd').attr('data-id'),
                name: $.trim($currentEl.find('#currencyDd').text())
            };

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);

                    quantity = targetEl.find('[data-name="quantity"] input').val() || targetEl.find('[data-name="quantity"] span').text();
                    price = helpers.spaceReplacer(targetEl.find('[data-name="price"] input').val()) * 100;

                    if (isNaN(price) || price <= 0) {
                        return App.render({
                            type   : 'error',
                            message: 'Please, enter Unit Price!'
                        });
                    }
                    taxes = helpers.spaceReplacer(targetEl.find('.taxes .sum').text());
                    description = targetEl.find('.productDescr').val();
                    subTotal = helpers.spaceReplacer(targetEl.find('.subtotal .sum').text());
                    subTotal = parseFloat(subTotal) * 100;
                    account = targetEl.find('.accountDd').attr('data-id');
                    taxCode = targetEl.find('.current-selected.taxCode').attr('data-id') || null;

                    if (!price) {
                        return App.render({
                            type   : 'error',
                            message: 'Unit price can\'t be empty'
                        });
                    }

                    if (!quantity) {
                        return App.render({
                            type   : 'error',
                            message: 'Quantity can\'t be empty'
                        });
                    }

                    if (!account) {
                        return App.render({
                            type   : 'error',
                            message: 'Account can\'t be empty'
                        });
                    }

                    products.push({
                        unitPrice    : price,
                        quantity     : quantity,
                        description  : description,
                        subTotal     : subTotal,
                        debitAccount : account,
                        creditAccount: CONSTANTS.ACCOUNT_PAYABLE,
                        taxes        : [{
                            taxCode: taxCode || null,
                            tax    : taxes
                        }]
                    });
                }
            }

            whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
            data = {
                forSales        : false,
                supplier        : supplier,
                name            : $.trim($('#supplier_invoice_num').val()),
                invoiceDate     : invoiceDate,
                dueDate         : dueDate,
                journal         : null,
                products        : products,
                expensesCategory: expensesCategory,
                paymentInfo     : payments,
                currency        : currency,
                groups          : {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW || 'everyOne',
                workflow: this.defaultWorkflow
            };

            if (supplier) {
                this.currentModel.urlRoot = '/invoice';

                this.currentModel.set(data);

                this.currentModel.save(this.currentModel.changed, {
                    patch  : true,
                    wait   : true,
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        if (cb && typeof(cb) === 'function') {
                            return cb();
                        }
                        self.hideDialog();
                        Backbone.history.navigate('#easyErp/ExpensesInvoice', {trigger: true});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });

            } else {
                App.render({
                    type   : 'error',
                    message: 'Please fill all fields.'
                });
            }

        },

        showDetailsBox: function (e) {
            $(e.target).parent().find('.details-box').toggle();
        },

        chooseUser: function (e) {
            $(e.target).toggleClass('choosen');
        },

        /*chooseOption: function (e) {
         var holder = $(e.target).parents('dd').find('.current-selected');
         holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
         },*/

        chooseOption: function (e) {
            var $target = $(e.target).closest('li');
            var holder = $target.parents('ul').closest('.current-selected');
            var invoiceItemContainer = this.$el.find('#invoiceItemsHolder');
            var symbol;
            var currency;
            var expensesCategory;
            var accountObj;
            var category;

            if (holder.attr('id') === 'currencyDd') {
                currency = _.findWhere(this.responseObj['#currencyDd'], {_id: $target.attr('id')});
                symbol = currency ? currency.currency : '$';
                $target.closest('dd').find('.current-selected').attr('data-symbol', symbol);
                this.$el.find('.currencySymbol').text(symbol);
                this.currencySymbol = symbol;
            }

            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id')).prepend('<span class="' + $($(e.target).find('span')[0]).attr('class') + '"></div>');

            if (holder.attr('id') === 'categories') {
                category = $target.attr('id');

                expensesCategory = _.findWhere(this.responseObj['#categories'], {_id: category});

                this.account = expensesCategory && expensesCategory.account ? expensesCategory.account : null;

                accountObj = _.findWhere(this.responseObj['#accountDd'], {_id: this.account});

                accountObj = accountObj || {_id: null, name: ''};

                this.$el.find('#productList tr').each(function () {
                    $(this).find('.accountDd').text(accountObj.name).attr('data-id', accountObj._id);
                });

            }

            $(e.target).closest('td').removeClass('errorContent');
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
            var $thisEl = this.$el;
            var self = this;
            var formString;
            var model;
            var invoiceItemContainer;
            var paymentContainer;
            var buttons;
            var isFinancial;
            var $notDiv;

            model = this.currentModel.toJSON();

            this.account = (model.expensesCategory && model.expensesCategory.account) || null;

            this.isPaid = (model && model.workflow) ? model.workflow.status === 'Done' : false;

            this.notAddItem = true;

            isFinancial = CONSTANTS.INVOICE_APPROVE_PROFILES.indexOf(App.currentUser.profile._id) !== -1;

            buttons = [{
                id   : 'create-invoice-dialog',
                class: 'btn blue',
                text : 'Save',
                click: function () {
                    self.saveItem();
                }
            }, {
                text : 'Cancel',
                class: 'btn',
                click: self.hideDialog
            }, {
                text : 'Delete',
                class: 'btn',
                click: self.deleteItem
            }];

            if (model.approved) {
                buttons = [{
                    text : 'Close',
                    class: 'btn',
                    click: self.hideDialog
                }];

                this.notAddItem = true;
                this.notEditable = true;
            }

            formString = this.template({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter,
                isFinancial     : isFinancial,
                notEditable     : this.notEditable
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

            /*this.$el = $(formString).dialog({
             autoOpen   : true,
             dialogClass: 'edit-invoice-dialog',
             title      : 'Edit Expenses',
             width      : '900px',
             position   : {my: 'center bottom', at: 'center', of: window},
             buttons    : buttons

             });*/

            this.renderAssignees(this.currentModel);

            paymentContainer = this.$el.find('#payments-container');
            paymentContainer.append(
                new listHederInvoice().render({model: this.currentModel.toJSON()}).el
            );

            $notDiv = this.$el.find('#attach-container');
            this.attachView = new AttachView({
                model      : this.currentModel,
                contentType: CONSTANTS.EXPENSESINVOICE
            });
            $notDiv.append(this.attachView.render().el);

            this.delegateEvents(this.events);

            invoiceItemContainer = this.$el.find('#invoiceItemsHolder');

            this.productItemView = new ProductItemView({
                canBeSold      : false,
                expense        : true,
                balanceVisible : true,
                discountVisible: true,
                forSales       : self.forSales,
                isPaid         : this.isPaid,
                responseObj    : this.responseObj,
                notAddItem     : this.notAddItem,
                parentModel    : self.model,
                notEditable    : this.notEditable,
                account        : this.account || null
            }).render({model: model}).el;

            invoiceItemContainer.append(
                this.productItemView
            );

            if (model.approved) {
                self.$el.find('.input-file').remove();
                self.$el.find('a.deleteAttach').remove();
            }

            if (!this.notEditable) {
                this.$el.find('#invoice_date').datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true
                }).datepicker('setDate', this.currentModel.get('invoiceDate'));

                this.$el.find('#due_date').datepicker({
                    dateFormat : 'd M, yy',
                    changeMonth: true,
                    changeYear : true,
                    onSelect   : function () {
                        var targetInput = $(this);
                        targetInput.removeClass('errorContent');
                    }
                }).datepicker('setDate', this.currentModel.get('dueDate'));
            }

            if (!this.isPaid) {
                this.$el.find('.quantity').prop('disabled', false)
            }

            populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);
            populate.get('#taxCode', '/taxSettings/getForDd', {}, 'name', this, true, true);
            populate.get('#accountDd', '/chartOfAccount/getForDd', {}, 'name', this, true, true, this.account || null);
            populate.getParrentCategory('#categories', '/expensesCategories/getAll', {}, this, true, true, (model.expensesCategory && model.expensesCategory._id) || null);

            populate.get2name('#supplier', '/supplier', {}, this, false, true);
            populate.fetchWorkflow({wId: 'Purchase Invoice'}, function (response) {
                if (!response.error) {
                    self.defaultWorkflow = response._id;
                }
            });
            return this;
        }

    });

    return EditView;
});
