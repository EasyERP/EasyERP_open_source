define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/dialogViewBase',
    'text!templates/Invoices/EditTemplate.html',
    'views/Notes/AttachView',
    'views/Notes/NoteView',
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
             NoteView,
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
        contentType: CONSTANTS.INVOICES, // 'Invoices',
        template   : _.template(EditTemplate),

        events: {
            'click #saveBtn'      : 'saveItem',
            'click #cancelBtn'    : 'hideDialog',
            'click .details'      : 'showDetailsBox',
            'click .newPayment'   : 'newPayment',
            'click .sendEmail'    : 'sendEmail',
            'click .approve'      : 'approve',
            'click .cancelInvoice': 'cancelInvoice',
            'click .setDraft'     : 'setDraft'
        },

        initialize: function (options) {

            _.bindAll(this, 'render', 'saveItem');
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
            var mid = this.forSales ? 56 : 109;

            e.preventDefault();

            this.saveItem(function (err, currency) {
                if (!err) {
                    paymentView = new PaymentCreateView({
                        model       : self.currentModel,
                        redirect    : self.redirect,
                        collection  : self.collection,
                        mid         : mid,
                        currency    : currency,
                        eventChannel: self.eventChannel
                    });
                }
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
            var data;
            var url;
            var invoiceId;
            var $li;
            var $tr;
            var $span;
            var $buttons;
            var $selfEl = self.$el;
            var invoiceDate;
            var redirectUrl;
            var journal = this.$el.find('#journal').attr('data-id') || null;

            e.preventDefault();

            this.saveItem(function (err) {
                if (journal) {
                    if (!err) {
                        $selfEl.find('button.approve').hide();

                        invoiceId = self.currentModel.get('_id');
                        invoiceDate = self.$el.find('#invoice_date').val();
                        $tr = $('tr[data-id=' + invoiceId + ']');
                        $span = $tr.find('td').eq(10).find('span');

                        App.startPreload();

                        url = '/invoices/approve';
                        data = {
                            invoiceId  : invoiceId,
                            invoiceDate: helpers.setTimeToDate(invoiceDate)
                        };

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
                } else {
                    App.render({
                        type   : 'error',
                        message: 'Please, choose journal first.'
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

        hideDialog: function () {
            $('.edit-invoice-dialog').remove();
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
            var productId;
            var quantity;
            var price;
            var description;
            var jobs;
            var taxes;
            var amount;
            var data;
            var workflow = this.currentModel.workflow ? this.currentModel.workflow : this.currentModel.get('workflow');
            var currency = {
                _id : $thisEl.find('#currencyDd').attr('data-id'),
                name: $.trim($thisEl.find('#currencyDd').text())
            };

            var invoiceDate = $thisEl.find('#invoice_date').val();
            var dueDate = $thisEl.find('#due_date').val();

            var supplier = $thisEl.find('#supplier').attr('data-id');

            var total = parseFloat($thisEl.find('#totalAmount').text());
            var unTaxed = parseFloat($thisEl.find('#totalUntaxes').text());
            var balance = parseFloat($thisEl.find('#balance').text());
            var jobDescription;

            var salesPersonId = $thisEl.find('#salesPerson').attr('data-id') || null;
            var paymentMethod = $thisEl.find('#paymentMethod').attr('data-id') || null;
            var paymentTermId = $thisEl.find('#payment_terms').attr('data-id') || null;
            var journalId = $thisEl.find('#journal').attr('data-id') || null;

            var usersId = [];
            var groupsId = [];

            var whoCanRW = $thisEl.find("[name='whoCanRW']:checked").val();
            var i;

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
                        quantity = parseFloat(targetEl.find('[data-name="quantity"] span').text());
                        price = helpers.spaceReplacer(targetEl.find('[data-name="price"] .sum').text());
                        price = parseFloat(price) * 100;
                        jobs = targetEl.find('[data-id="jobs"]').attr('data-content');
                        description = targetEl.find('.productDescr').val();
                        jobDescription = targetEl.find('textarea.jobsDescription').val();
                        taxes = helpers.spaceReplacer(targetEl.find('.taxes .sum').text());
                        taxes = parseFloat(taxes) * 100;
                        amount = helpers.spaceReplacer(targetEl.find('.amount .sum').text());
                        amount = parseFloat(amount) * 100;

                        products.push({
                            product       : productId,
                            description   : description,
                            jobs          : jobs,
                            jobDescription: jobDescription,
                            unitPrice     : price,
                            quantity      : quantity,
                            taxes         : taxes,
                            subTotal      : amount
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
                currency      : currency,
                supplier      : supplier,
                fiscalPosition: null,
                name          : $.trim(this.$el.find('#supplier_invoice_num').val()),
                invoiceDate   : helpers.setTimeToDate(invoiceDate),
                dueDate       : dueDate,
                account       : null,
                journal       : journalId,
                products      : products,

                salesPerson  : salesPersonId,
                paymentTerms : paymentTermId,
                paymentMethod: paymentMethod,
                groups       : {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW,
                workflow: workflow._id || null

            };

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
                        var redirectUrl = self.forSales ? 'easyErp/salesInvoices' : 'easyErp/Invoices';

                        self.hideDialog();

                        if (paymentCb && typeof paymentCb === 'function') {
                            return paymentCb(null, currency);
                        }

                        if (self.redirect) {

                            if (self.eventChannel) {
                                self.eventChannel.trigger('invoiceUpdated');
                            }

                            Backbone.history.navigate(url, {trigger: true});
                            $dueDateEl = $('#' + result.id).closest('tr').find('[data-content="dueDate"]');
                            $dueDateEl.text(result.dueDate);
                        } else {
                            Backbone.history.navigate(redirectUrl, {trigger: true});
                        }

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
            var holder = $(e.target).parents('dd').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
        },

        deleteItem: function (event) {
            var self = this;
            var answer;

            event.preventDefault();

            answer = confirm('Really DELETE items ?!');
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
            var invoiceDate;
            var isFinancial;
            var dueDate;
            var paidAndNotApproved = false;
            var needNotes = false;

            model = this.currentModel.toJSON();
            invoiceDate = model.invoiceDate;
            dueDate = model.dueDate;

            if (!model.approved) {
                needNotes = true;
            }

            this.isPaid = (model && model.workflow) ? model.workflow.status === 'Done' : false;

            if (this.isPaid && !model.approved) {
                paidAndNotApproved = true;
            }

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
                model             : this.currentModel.toJSON(),
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
                currencyClass     : helpers.currencyClass,
                isFinancial       : isFinancial
            });

            if (this.isWtrack || this.isPaid && dueDate.length) {
                buttons = [
                    {
                        text : this.isPaid ? 'Close' : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ];
            } else {
                buttons = [
                    {
                        text : 'Save',
                        class: 'btn blue',
                        click: self.saveItem
                    },

                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }/*,
                     {
                     text : 'Delete',
                     class: 'btn',
                     click: self.deleteItem
                     }*/
                ];
            }

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-invoice-dialog',
                title      : 'Edit Invoice',
                width      : self.isWtrack ? '1200' : '900',
                position   : {my: 'center bottom', at: 'center', of: window},
                buttons    : buttons

            });

            this.renderAssignees(this.currentModel);

            paymentContainer = this.$el.find('#payments-container');
            paymentContainer.append(
                new listHederInvoice().render({model: this.currentModel.toJSON()}).el
            );

            populate.get2name('#supplier', '/supplier', {}, this, false);
            populate.get2name('#salesPerson', CONSTANTS.URLS.EMPLOYEES_RELATEDUSER, {}, this, true, true);
            populate.get('#currencyDd', '/currency/getForDd', {}, 'name', this, true);

            if (!model.paymentMethod && model.project && model.project.paymentMethod) {
                populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, true, true, model.project.paymentMethod);
            } else {
                populate.get('#paymentMethod', '/paymentMethod', {}, 'name', this, true, true);
            }
            if (!model.paymentTerms && model.project && model.project.paymentTerms) {
                populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, true, true, model.project.paymentTerms);
            } else {
                populate.get('#paymentTerm', '/paymentTerm', {}, 'name', this, false, true);
            }

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
                disabled    : model.approved,
                changeYear  : true,
                onSelect    : function () {
                    var targetInput = $(this);

                    targetInput.removeClass('errorContent');
                }
            }).datepicker('option', 'minDate', invoiceDate);

            this.delegateEvents(this.events);

            invoiceItemContainer = this.$el.find('#invoiceItemsHolder');

            invoiceItemContainer.append(
                new InvoiceItemView({
                    balanceVisible    : true,
                    forSales          : self.forSales,
                    isPaid            : this.isPaid,
                    paidAndNotApproved: paidAndNotApproved,
                    notAddItem        : this.notAddItem
                }).render({model: model}).el
            );

            notDiv = this.$el.find('#attach-container');
            notDiv.append(
                new NoteView({
                    model      : this.currentModel,
                    contentType: CONSTANTS.INVOICES,
                    needNotes  : needNotes
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
