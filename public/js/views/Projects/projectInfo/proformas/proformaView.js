define([
    'jQuery',
    'Underscore',
    'views/Proforma/list/ListView',
    'text!templates/Projects/projectInfo/proformaTemplate.html',
    'views/Proforma/EditView',
    'views/Proforma/list/ListItemView',
    'collections/Proforma/filterCollection',
    'models/InvoiceModel',
    'common',
    'helpers',
    'dataService',
    'async',
    'helpers/eventsBinder'
], function ($, _, ListView, invoiceTemplate, EditView, listItemView, invoiceCollection, InvoiceModel, common, helpers, dataService, async, eventsBinder) {
    var invoiceView = ListView.extend({

        el                  : '#proforma',
        ListItemView        : listItemView,
        preventChangLocation: true,
        contentCollection   : invoiceCollection,
        changedModels       : {},
        contentType         : 'proforma',

        initialize: function (options) {
            this.remove();
            this.collection = options.collection;
            this.filter = options.filter ? options.filter : {};

            eventsBinder.subscribeCollectionEvents(this.collection, this);

            this.eventChannel = options.eventChannel;

            this.render(options);
        },

        template: _.template(invoiceTemplate),

        events: {
            'click .checkbox'        : 'checked',
            /*
             'click  .list tbody td': 'goToEditDialog',
             */
            'click #removeProforma'  : 'deleteItems',
            'click #saveProforma'    : 'saveItems',
            'click .selectList'      : 'showSelects',
            'click .newSelectList li': 'chooseOption'
        },

        deleteItems: function (e) {
            var that = this;
            var model;
            var orderId;
            var id;
            var tr;
            var listTableCheckedInput;
            var table = this.$el.find('#listTable');
            listTableCheckedInput = table.find("input:not('#checkAll_proforma'):checked");

            e.preventDefault();

            this.collectionLength = this.collection.length;
            async.each(listTableCheckedInput, function (checkbox, cb) {
                model = that.collection.get(checkbox.value);
                model.destroy({
                    wait   : true,
                    success: function (model) {
                        orderId = model.get('sourceDocument');
                        orderId = orderId && orderId._id ? orderId._id : orderId;
                        id = model.get('_id');
                        tr = $('[data-id=' + orderId + ']');

                        table.find("[data-id='" + id + "']").remove();

                        tr.find('.workflow').html('<a href="javascript:;" class="">Not Invoiced</a>');

                        tr.removeClass('notEditable');
                        tr.find('.checkbox').removeClass('notRemovable');

                        $('#removeProforma').hide();
                        $('#checkAll_proforma').prop('checked', false);

                        that.collection.remove(checkbox.value);

                        cb();
                    },

                    error: function (model, res) {
                        if (res.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        }

                        cb();
                    }
                });

            }, function () {
                if (that.eventChannel) {
                    that.eventChannel.trigger('proformaRemove');
                }
                if (that.collection.length) {
                    that.recalcTotal();
                } else {
                    that.$el.find('#listTotal').hide();
                }
            });
        },

        recalcTotal: function () {
            var self = this;
            var collection = this.collection.toJSON();
            var balance = 0;
            var paid = 0;
            var total = 0;

            async.forEach(collection, function (model, cb) {
                balance += parseInt(model.paymentInfo.balance, 10);
                paid += parseInt(model.paymentInfo.unTaxed, 10);
                total += parseInt(model.paymentInfo.total, 10);

                cb();
            }, function () {
                self.$el.find('#balance').text(helpers.currencySplitter(balance.toFixed(2)));
                self.$el.find('#paid').text(helpers.currencySplitter(paid.toFixed(2)));
                self.$el.find('#total').text(helpers.currencySplitter(total.toFixed(2)));
            });
        },

        showDialog: function (proformaId) {
            var self = this;
            var invoice = _.find(this.collection.toJSON(), function (el) {
                return (el._id.toString() === proformaId.toString());
            });

            var model = new InvoiceModel({validate: false});

            model.urlRoot = '/invoices/';
            model.fetch({
                data: {
                    id       : invoice._id,
                    viewType : 'form',
                    currentDb: App.currentDb
                },

                success: function (model) {
                    return new EditView({
                        model       : model,
                        redirect    : true,
                        collection  : this.collection,
                        notCreate   : true,
                        eventChannel: self.eventChannel,
                        forSales    : true
                    });
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });

        },

        gotoForm: function (e) {
            var self = this;
            var id = $(e.target).closest('tr').data('id');
            var model = new InvoiceModel({validate: false});

            e.stopPropagation();
            e.preventDefault();

            model.urlRoot = '/invoices/';
            model.fetch({
                data: {
                    id       : id,
                    viewType : 'form',
                    currentDb: App.currentDb
                },

                success: function (model) {
                    return new EditView({
                        model       : model,
                        redirect    : true,
                        collection  : this.collection,
                        notCreate   : true,
                        eventChannel: self.eventChannel,
                        forSales    : true
                    });
                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        },

        checked: function (e) {
            var $targetEl = $(e.target);
            var $el = this.$el;
            var checkLength;
            var checkAll$;
            var removeBtnEl;

            if ($targetEl.hasClass('notRemovable')) {
                $targetEl.prop('checked', false);

                return false;
            }

            if (this.collection.length > 0) {
                checkLength = $el.find('input.checkbox:checked:not(.notRemovable)').length;
                checkAll$ = $el.find('#checkAll_proforma');
                removeBtnEl = $('#removeProforma');

                if (checkLength > 0) {
                    checkAll$.prop('checked', false);
                    removeBtnEl.show();

                    if (checkLength === this.collection.length) {

                        checkAll$.prop('checked', true);
                    }
                } else {
                    removeBtnEl.hide();
                    checkAll$.prop('checked', false);
                }
            }
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
            $('.ui-dialog').remove();
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
            $('.crop-images-dialog').remove();
        },

        showMoreContent: function (newModels) {
            var $currentEl = this.$el;
            var tBody = $currentEl.find('#listTable');
            var itemView;
            var pagenation;

            tBody.empty();

            this.hideDeleteBtnAndUnSelectCheckAll();

            if (newModels.length > 0) {
                itemView = new this.ListItemView({
                    collection : newModels,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                });
                tBody.append(itemView.render({thisEl: tBody}));
            }

            pagenation = this.$el.find('.pagination');

            if (newModels.length === 0) {
                pagenation.hide();
            } else {
                pagenation.show();
            }
        },

        render: function (options) {
            var $currentEl = this.$el;
            var template = _.template(invoiceTemplate);
            var self = this;
            var tabs;
            var dialogHolder;
            var n;
            var target;

            $currentEl.html('');

            if (options && options.activeTab) {
                self.hideDialog();

                tabs = $('.chart-tabs');
                target = tabs.find('#proformaTab');

                target.closest('.chart-tabs').find('a.active').removeClass('active');
                target.addClass('active');
                n = target.parents('.chart-tabs').find('li').index(target.parent());
                dialogHolder = $('.dialog-tabs-items');
                dialogHolder.find('.dialog-tabs-item.active').removeClass('active');
                dialogHolder.find('.dialog-tabs-item').eq(n).addClass('active');

                App.projectInfo = App.projectInfo || {};
                App.projectInfo.currentTab = 'proforma';
            }

            $currentEl.append(template({
                collection         : this.collection.toJSON(),
                startNumber        : 0,
                utcDateToLocaleDate: common.utcDateToLocaleDate,
                currencySplitter   : helpers.currencySplitter,
                currencyClass      : helpers.currencyClass
            }));

            this.renderPagination($currentEl, this);

            this.$el.find('#removeProforma').hide();
            this.$el.find('#saveProforma').hide();

            $('#checkAll_proforma').click(function () {

                self.$el.find(':checkbox:not(.notRemovable)').prop('checked', this.checked);

                if (self.$el.find('input.checkbox:checked').length > 0) {
                    self.$el.find('#removeProforma').show();
                } else {
                    self.$el.find('#removeProforma').hide();
                    $('#checkAll_proforma').prop('checked', false);
                }
            });

            return this;
        }
    });

    return invoiceView;
});
