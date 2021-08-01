﻿define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/salesInvoices/wTrack/CreateTemplate.html',
    'models/InvoiceModel',
    'common',
    'populate',
    'views/salesInvoices/wTrack/wTrackRows',
    'views/Assignees/AssigneesView',
    'views/Payment/list/ListHeaderInvoice',
    'dataService',
    'constants',
    'moment'
], function (Backbone,
             $,
             _,
             CreateTemplate,
             InvoiceModel,
             common,
             populate,
             wTrackRows,
             AssigneesView,
             listHederInvoice,
             dataService,
             CONSTANTS,
             moment) {

    var CreateView = Backbone.View.extend({
        el                    : '#content-holder',
        contentType           : 'Invoice',
        template              : _.template(CreateTemplate),
        $linwoiceGenerateTable: null,

        initialize: function (options) {
            var self = this;
            var projectId = options.project ? options.project._id : null;

            _.bindAll(this, 'saveItem', 'render');

            this.model = new InvoiceModel(options);
            this.model.bind('change:paymentInfo', this.changeTotal, this);
            this.responseObj = {};

            dataService.getData('/invoices/generateName?projectId=' + projectId, null, function (name) {
                if (name) {
                    options.name = name;
                }
                self.render(options);
            });
        },

        events: {
            keydown                                            : 'keydownHandler',
            'click td.editable'                                : 'editRow',
            'click .dialog-tabs a'                             : 'changeTab',
            'click .current-selected'                          : 'showNewSelect',
            'change .editing'                                  : 'changeValue',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption'
        },

        showNewSelect: function (e, prev, next) {
            populate.showSelect(e, prev, next, this);

            return false;
        },

        chooseOption: function (e) {
            $(e.target).parents('dd').find('.current-selected').text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            $('.newSelectList').hide();
        },

        changeTotal: function (model, val) {
            this.$el.find('#totalAmount').text(val.total);
            this.$el.find('#totalUntaxes').text(val.total);
        },

        changeValue: function (e) {
            var paymentInfo;
            var total = 0;
            var targetEl = $(e.target);
            var editableArr = this.$el.find('.editable:not(:has(input))');

            editableArr.each(function (index, el) {
                total += parseFloat($(el).text());
            });

            paymentInfo = _.clone(this.model.get('paymentInfo'));
            paymentInfo.total = parseFloat(targetEl.val()) + total;

            this.model.set('paymentInfo', paymentInfo);
        },

        keydownHandler: function (e) {
            switch (e.which) {
                case 27:
                    this.hideDialog();
                    break;
                default:
                    break;
            }
        },

        editRow: function (e) {
            var el = $(e.target);
            var tr = el.closest('tr');
            var wTrackId = tr.data('id');
            var tempContainer;
            var width;
            var editedElement;
            var editedCol;
            var editedElementValue;

            if (wTrackId && el.prop('tagName') !== 'INPUT') {
                if (this.wTrackId) {
                    editedElement = this.$linwoiceGenerateTable.find('.editing');

                    if (editedElement.length) {

                        editedCol = editedElement.closest('td');
                        editedElementValue = editedElement.val();

                        editedCol.text(editedElementValue);
                        editedElement.remove();
                    }
                }
                this.wTrackId = wTrackId;
            }

            tempContainer = el.text();
            width = el.width() - 6;
            el.html('<input class="editing" type="text" value="' + tempContainer + '"  maxLength="4" style="width:' + width + 'px">');

            return false;
        },

        changeTab: function (e) {
            var holder = $(e.target);
            var n;
            var dialogHolder;
            var closestEl = holder.closest('.dialog-tabs');
            var dataClass = closestEl.data('class');
            var selector = '.dialog-tabs-items.' + dataClass;
            var itemActiveSelector = '.dialog-tabs-item.' + dataClass + '.active';
            var itemSelector = '.dialog-tabs-item.' + dataClass;

            closestEl.find('a.active').removeClass('active');
            holder.addClass('active');

            n = holder.parents('.dialog-tabs').find('li').index(holder.parent());
            dialogHolder = $(selector);

            dialogHolder.find(itemActiveSelector).removeClass('active');
            dialogHolder.find(itemSelector).eq(n).addClass('active');
        },

        saveItem: function () {
            var self = this;

            var thisEl = this.$el;

            var usersId = [];
            var groupsId = [];

            var selectedProducts = thisEl.find('.productItem');
            var products = [];
            var selectedLength = selectedProducts.length;
            var targetEl;
            var productId;
            var quantity;
            var price;
            var taxes;
            var amount;
            var description;

            var supplier = thisEl.find('#supplier');
            var supplierId = supplier.data('id') || null;
            var supplierName = supplier.text() || null;
            var salesPerson = thisEl.find('#assigned');
            var salesPersonId = salesPerson.data('id') || null;
            var salesPersonName = salesPerson.text() ? salesPerson.text() : null;
            var paymentTermId = thisEl.find('#paymentTerms').data('id') || null;
            var invoiceDate = thisEl.find('#invoiceDate').val();
            var dueDate = thisEl.find('#dueDate').val();
            var name = thisEl.find('#invoiceName').val();

            var total = parseFloat(thisEl.find('#totalAmount').text());
            var unTaxed = parseFloat(thisEl.find('#totalUntaxes').text());

            var project = thisEl.find('#project');
            var projectId = project.data('id');
            var projectName = project.text();

            var payments = {
                total  : total,
                unTaxed: /* unTaxed*/0,
                balance: total
            };
            var i;
            var whoCanRW;
            var data;
            var model;

            if (selectedLength) {
                for (i = selectedLength - 1; i >= 0; i--) {
                    targetEl = $(selectedProducts[i]);
                    productId = targetEl.data('id');
                    if (productId) {
                        quantity = targetEl.find('[data-name="quantity"]').text() || 1;
                        price = targetEl.find('[data-name="price"]').text();
                        description = targetEl.find('[data-name="productDescr"]').text();
                        taxes = targetEl.find('.taxes').text();
                        amount = targetEl.find('.amount').text();

                        products.push({
                            product    : productId,
                            description: description,
                            unitPrice  : price,
                            quantity   : quantity,
                            taxes      : taxes,
                            subTotal   : amount
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

            whoCanRW = this.$el.find("[name='whoCanRW']:checked").val();
            data = {
                supplier    : supplierId,
                invoiceDate : invoiceDate,
                dueDate     : dueDate,
                project     : projectId,
                salesPerson : salesPersonId,
                paymentTerms: paymentTermId,
                products    : products,
                paymentInfo : payments,
                groups      : {
                    owner: this.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW,
                workflow: this.defaultWorkflow._id,
                name    : name
            };

            if (supplier) {
                model = new InvoiceModel();
                model.save(data, {
                    wait   : true,
                    success: function () {
                        self.hideDialog();
                        Backbone.history.navigate('tinyERP/salesInvoices', {trigger: true});
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });

            } else {
                App.render({
                    type   : 'error',
                    message: CONSTANTS.RESPONSES.CREATE_QUOTATION
                });
            }

        },

        hideDialog: function () {
            $('.edit-dialog').remove();
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
            $('.crop-images-dialog').remove();
        },

        render: function (options) {
            var notDiv;
            var now = new Date();
            var self = this;
            var paymentContainer;
            var invoiceContainer;
            var dueDate = moment().add(15, 'days').toDate();
            var formString;

            options.model = null;
            options.balanceVisible = null;
            options.total = (options.total).toFixed(2);

            formString = this.template(options);

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Invoice',
                width      : '1200',
                position   : {within: $('#wrapper')},
                buttons    : [
                    {
                        id   : 'create-invoice-dialog',
                        text : 'Create',
                        click: function () {
                            self.saveItem();
                        }
                    },

                    {
                        text : 'Cancel',
                        click: function () {
                            self.hideDialog();
                        }
                    }]
            });

            notDiv = this.$el.find('.assignees-container');
            notDiv.append(
                new AssigneesView({
                    model: this.currentModel
                }).render().el
            );

            invoiceContainer = new wTrackRows(options);

            paymentContainer = this.$el.find('#payments-container');
            paymentContainer.append(
                new listHederInvoice().render().el
            );

            populate.get('#paymentTerms', '/paymentTerm', {}, 'name', this, true);
            populate.fetchWorkflow({
                wId         : 'Sales Invoice',
                source      : 'purchase',
                targetSource: 'invoice'
            }, function (response) {
                if (!response.error) {
                    self.defaultWorkflow = response;
                }
            });

            this.$el.find('#invoiceDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            }).datepicker('setDate', now);

            this.$el.find('#dueDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true
            }).datepicker('setDate', dueDate);

            this.delegateEvents(this.events);
            this.$linwoiceGenerateTable = this.$el.find('#linwoiceGenerateTable');

            return this;
        }

    });

    return CreateView;
});
