define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/Proforma/form/FormTemplate.html',
    'views/Assignees/AssigneesView',
    'views/Notes/NoteView',
    'views/Proforma/InvoiceProductItems',
    'views/Products/InvoiceOrder/ProductItems',
    'views/salesInvoices/wTrack/wTrackRows',
    'views/Payment/ProformaCreateView',
    'views/Payment/list/ListHeaderInvoice',
    'common',
    'custom',
    'dataService',
    'populate',
    'constants',
    'helpers'
], function (Backbone,
             $,
             _,
             ParentView,
             EditTemplate,
             AssigneesView,
             NoteView,
             InvoiceItemView,
             ProductItemView,
             wTrackRows,
             PaymentCreateView,
             ListHederInvoice,
             common,
             Custom,
             dataService,
             populate,
             CONSTANTS,
             helpers) {
    'use strict';

    var EditView = ParentView.extend({
        contentType: 'Proforma',
        template   : _.template(EditTemplate),

        events: {
            'click .saveBtn'      : 'saveItem',
            'click .details'      : 'showDetailsBox',
            'click .newPayment'   : 'newPayment',
            'click .approve'      : 'approve',
            'click .cancelInvoice': 'cancelInvoice',
            'click .setDraft'     : 'setDraft'
        },

        initialize: function (options) {
            var self = this;

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

            this.notCreate = !!options.notCreate;

            if (!App || !App.currentDb) {
                dataService.getData('/currentDb', null, function (response) {
                    if (response && !response.error) {
                        App.currentDb = response;
                        App.weTrack = true;
                    } else {
                        console.log('can\'t fetch current db');
                    }

                    self.render();
                });
            } else {
                this.render();
            }
        },

        newPayment: function (e) {
            var paymentView;
            var self = this;
            var mid = this.forSales ? 99 : 95;
            var currency = self.currentModel.get('currency');

            e.preventDefault();

            this.saveItem(function (err, currency) {
                if (!err) {
                    paymentView = new PaymentCreateView({
                        model       : self.currentModel,
                        redirect    : self.redirect,
                        collection  : self.collection,
                        mid         : mid,
                        currency    : currency && (typeof currency._id === 'object') ? currency._id : currency,
                        eventChannel: self.eventChannel
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

        chooseUser: function (e) {
            $(e.target).toggleClass('choosen');
        },

        approve: function (e) {
            var self = this;
            var data;
            var url;
            var proformaId;
            var $li;
            var $tr;
            var $priceInputs;
            var payBtnHtml;
            var $currencyDd;
            var invoiceDate;
            var redirectUrl;
            var journal = this.$el.find('#journal').attr('data-id') || null;

            e.preventDefault();

            this.saveItem(function (err) {
                if (journal) {
                    if (!err) {

                        proformaId = self.currentModel.get('_id');
                        $li = $('button.approve').parent('li');
                        $tr = $('tr[data-id=' + proformaId + ']');
                        $priceInputs = self.$el.find('td[data-name="price"]');
                        $currencyDd = self.$el.find('#currencyDd');
                        invoiceDate = self.$el.find('#invoice_date').val();

                        App.startPreload();

                        payBtnHtml = '<button class="btn newPayment"><span>Pay</span></button>';
                        url = '/invoices/approve';
                        data = {
                            invoiceId  : proformaId,
                            invoiceDate: helpers.setTimeToDate(invoiceDate)
                        };

                        dataService.patchData(url, data, function (err, response) {
                            if (!err) {

                                self.currentModel.set({approved: true});
                                $li.html(payBtnHtml);
                                $currencyDd.removeClass('current-selected');
                                $priceInputs.each(function () {
                                    var $td = $(this);
                                    var price = $td.find('input').val();

                                    $td.html('<span>' + price + '</span>');
                                });

                                self.$el.find('.input-file').remove();
                                self.$el.find('a.deleteAttach').remove();

                                App.stopPreload();

                                if (self.eventChannel) {
                                    $('.edit-dialog').remove();
                                    self.eventChannel.trigger('savedProforma');
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
                } else {
                    App.render({
                        type   : 'error',
                        message: 'Please, choose journal first.'
                    });
                }
            });

        },

        saveItem: function (paymentCb) {
            var self = this;
            var mid = 56;

            var $thisEl = this.$el;

            var errors = $thisEl.find('.errorContent');
            var selectedProducts = $thisEl.find('.productItem');
            var products = [];
            var selectedLength = selectedProducts.length;
            var targetEl;
            var jobDescription;
            var productId;
            var quantity;
            var price;
            var description;
            var jobs;
            var subTotal;
            var data;
            var workflow = this.currentModel.workflow ? this.currentModel.workflow : this.currentModel.get('workflow');
            var productsOld = this.currentModel.products ? this.currentModel.products : this.currentModel.get('products');
            var currency = {
                _id : $thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim($thisEl.find('#currencyDd').text())
            };

            var invoiceDate = $thisEl.find('#invoice_date').val() || $thisEl.find('#inv_date').text();
            var dueDate = $thisEl.find('#due_date').val() || $thisEl.find('#inv_date').text();

            var supplier = $thisEl.find('#supplier').attr('data-id');

            var total = helpers.spaceReplacer($thisEl.find('#totalAmount').text());
            var unTaxed = helpers.spaceReplacer($thisEl.find('#totalUntaxes').text());
            var balance = helpers.spaceReplacer($thisEl.find('#balance').text()) || total;
            var taxes = helpers.spaceReplacer($thisEl.find('#taxes').text());

            var paymentTermId = $thisEl.find('#payment_terms').attr('data-id') || null;
            var journalId = $thisEl.find('#journal').attr('data-id') || null;
            var usersId = [];

            var groupsId = [];
            var whoCanRW = $thisEl.find("[name='whoCanRW']:checked").val();

            var payments;
            var i;

            total = parseFloat(total) * 100;
            unTaxed = parseFloat(unTaxed) * 100;
            balance = parseFloat(balance) * 100;
            taxes = parseFloat(taxes) * 100;

            payments = {
                total  : total,
                unTaxed: unTaxed,
                balance: balance,
                taxes  : taxes
            };

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
                        quantity = targetEl.find('[data-name="quantity"] input').val() || $thisEl.find('[data-name="quantity"]').text();
                        price = helpers.spaceReplacer(targetEl.find('[data-name="price"] input').val()) || helpers.spaceReplacer(targetEl.find('[data-name="price"] .sum').text());
                        price = parseFloat(price) * 100;

                        if (isNaN(price) || price <= 0) {
                            return App.render({
                                type   : 'error',
                                message: 'Please, enter Unit Price!'
                            });
                        }
                        jobs = targetEl.find('[data-name="jobs"]').attr('data-content') || null;
                        taxes = helpers.spaceReplacer(targetEl.find('.taxes .sum').text());
                        taxes = parseFloat(taxes) * 100;
                        jobDescription = targetEl.find('textarea.jobsDescription').val();
                        description = targetEl.find('.productDescr').val();
                        subTotal = helpers.spaceReplacer(targetEl.find('.subtotal .sum').text());
                        if (subTotal == '') {
                            subTotal = helpers.spaceReplacer(targetEl.find('.amount .sum').text());
                        }

                        subTotal = parseFloat(subTotal) * 100;

                        products.push({
                            product       : productId,
                            jobs          : jobs,
                            unitPrice     : price,
                            quantity      : quantity,
                            jobDescription: jobDescription,
                            description   : $.trim(description),
                            taxes         : taxes,
                            subTotal      : subTotal
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
                currency             : currency,
                supplier             : supplier,
                fiscalPosition       : null,
                // sourceDocument: $.trim(this.$el.find('#source_document').val()),
                supplierInvoiceNumber: $.trim(this.$el.find('#supplier_invoice_num').val()),
                // name                 : $.trim(this.$el.find('#supplier_invoice_num').val()), //changed For Yana
                // paymentReference: $.trim(this.$el.find('#payment_reference').val()),
                invoiceDate          : helpers.setTimeToDate(invoiceDate),
                dueDate              : dueDate,
                account              : null,
                journal              : journalId,
                paymentTerms         : paymentTermId,

                products   : products,
                paymentInfo: payments,

                groups: {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW,
                workflow: workflow && workflow._id ? workflow._id : workflow
            };

            if (this.model.get('approved')) {
                delete data.products;
            }

            if (supplier) {
                this.model.save(data, {
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    patch  : true,
                    success: function (err, result) {
                        var $dueDateEl;
                        var url = window.location.hash;
                        var redirectUrl;
                        //var redirectUrl = self.forSales ? 'easyErp/salesProforma' : 'easyErp/proforma';

                        self.hideDialog();

                        if (paymentCb && typeof paymentCb === 'function') {
                            return paymentCb(null, currency);
                        }

                        if (self.eventChannel) {
                            self.eventChannel.trigger('savedProforma');
                        }

                        redirectUrl = window.location.hash;

                        Backbone.history.fragment = '';

                        Backbone.history.navigate(redirectUrl, {trigger: true});
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
            var symbol;
            var currency;

            if ($target.closest('a').attr('id') === 'currencyDd') {
                currency = _.findWhere(this.responseObj['#currencyDd'], {_id: $target.attr('id')});
                symbol = currency ? currency.currency : '$';
                $target.closest('dd').find('.current-selected').attr('data-symbol', symbol);
                this.$el.find('.currencySymbol').text(symbol);
            }

            holder.text($target.text()).attr('data-id', $target.attr('id'));
        },

        deleteItem: function (event) {
            var url = window.location.hash;
            var self = this;
            var answer = confirm('Really DELETE items ?!');

            event.preventDefault();

            if (answer === true) {
                this.currentModel.destroy({
                    success: function () {
                        $('.edit-invoice-dialog').remove();
                        self.hideDialog();

                        if (self.eventChannel) {
                            self.eventChannel.trigger('proformaRemove');
                        } else {
                            Backbone.history.fragment = '';
                            Backbone.history.navigate(url, {trigger: true});
                        }
                    },

                    error: function (model, err) {
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
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
            var wTracksDom;
            var buttons;
            var invoiceDate;
            var isFinancial;
            var needNotes = false;
            var productItemContainer;
            var service = this.forSales;

            model = this.currentModel.toJSON();
            invoiceDate = model.invoiceDate;

            // need to check with which statuses can add attachment and notes
            if (!model.approved) {
                needNotes = true;
            }

            this.isPaid = !!(model && model.workflow && model.workflow.status !== 'New');

            this.notAddItem = true;

            if (this.isWtrack) {
                wTracks = _.map(model.products, function (product) {
                    return product.product;
                });
                project = model.project;
                customer = model.supplier;
                total = model.paymentInfo ? model.paymentInfo.total : '0.00';
            }

            isFinancial = CONSTANTS.INVOICE_APPROVE_PROFILES.indexOf(App.currentUser.profile._id) !== -1;

            formString = this.template({
                model           : this.currentModel.toJSON(),
                isWtrack        : self.isWtrack,
                isPaid          : this.isPaid,
                notAddItem      : this.notAddItem,
                approved        : this.currentModel.get('approved'),
                wTracks         : wTracks,
                project         : project,
                customer        : customer,
                total           : total,
                currencySplitter: helpers.currencySplitter,
                isFinancial     : isFinancial
            });

            $thisEl.html(formString);

            /*
             this.$el = $(formString).dialog({
             autoOpen     : true,
             resizable    : true,
             dialogClass  : 'edit-invoice-dialog',
             title        : 'Edit Invoice',
             width        : self.isWtrack ? '1200' : '900',
             position     : {my: 'center bottom', at: 'center', of: window},
             buttons      : buttons

             });
             */

            paymentContainer = this.$el.find('#payments-container');
            paymentContainer.append(
                new ListHederInvoice().render({model: this.currentModel.toJSON()}).el
            );

            populate.get2name('#supplier', '/supplier', {}, this, false);
            populate.get2name('#salesPerson', CONSTANTS.EMPLOYEES_RELATEDUSER, {}, this, true, true);
            populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, true, true);
            populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);

            if (!this.currentModel.toJSON().approved) {
                populate.get('#journal', '/journals/getForDd', {}, 'name', this, true, true, this.currentModel.toJSON().journal._id);
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

                    endDate.setDate(endDate.getDate());

                    dueDatePicker.datepicker('option', 'minDate', endDate);
                }
            });

            this.$el.find('#due_date').datepicker({
                defaultValue: invoiceDate,
                dateFormat  : 'd M, yy',
                changeMonth : true,
                changeYear  : true,
                disabled    : model.approved,
                onSelect    : function () {
                    var targetInput = $(this);

                    targetInput.removeClass('errorContent');
                }
            }).datepicker('option', 'minDate', invoiceDate);

            this.delegateEvents(this.events);

            invoiceItemContainer = this.$el.find('#invoiceItemsHolder');

            /*if (!model.approved) {
             productItemContainer = this.$el.find('#productItemsHolder');
             productItemContainer.append(
             new ProductItemView({
             editable : true,
             canBeSold: true,
             service  : service,
             editable
             forSales : self.forSales
             }).render({model: model}).el
             );
             }*/

            invoiceItemContainer.append(
                new InvoiceItemView({
                    balanceVisible: true,
                    forSales      : self.forSales,
                    isPaid        : this.isPaid,
                    notAddItem    : this.notAddItem,
                    paid          : this.model.get('paymentInfo').paid,
                    approved      : model.approved
                }).render({model: model}).el
            );

            notDiv = this.$el.find('#attach-container');
            notDiv.append(
                new NoteView({
                    model      : this.currentModel,
                    contentType: 'Proforma',
                    needNotes  : needNotes
                }).render().el
            );

            if (model.approved || model.workflow.status === 'Done') {
                self.$el.find('.input-file').remove();
                self.$el.find('a.deleteAttach').remove();
            }

            App.stopPreload();

            return this;
        }

    });

    return EditView;
});
