define([
    'jQuery',
    'Underscore',
    'views/customerPayments/list/ListView',
    'text!templates/Projects/projectInfo/paymentTemplate.html',
    'views/customerPayments/list/ListItemView',
    'views/customerPayments/EditView',
    'collections/customerPayments/filterCollection',
    'collections/customerPayments/editCollection',
    'models/PaymentModel',
    'helpers',
    'common',
    'async',
    'helpers/eventsBinder'
], function ($, _, ListView, paymentTemplate, listItemView, EditView, paymentCollection, editCollection, PaymentModel, helpers, common, async, eventsBinder) {
    var paymentView = ListView.extend({

        el                  : '#payments',
        ListItemView        : listItemView,
        preventChangLocation: true,
        contentCollection   : paymentCollection,

        initialize: function (options) {
            this.remove();
            this.collection = options.collection;
            this.filter = options.filter ? options.filter : {};

            this.eventChannel = options.eventChannel;

            eventsBinder.subscribeCollectionEvents(this.collection, this);

            if (options.activate) {
                this.render({activeTab: true});
            } else {
                this.render();
            }

        },

        template: _.template(paymentTemplate),

        events: {
            'click .checkbox'                        : 'checked',
            'click #savePayment'                     : 'saveItem',
            'click #removePayment'                   : 'deleteItems',
            'click tbody td:not(.checkbox, .notForm)': 'goToEditDialog'
        },

        goToEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = this.collection.get(id);

            e.preventDefault();

            return new EditView({model: model});
        },

        deleteItems: function (e) {
            var that = this;
            var model;
            var listTableCheckedInput;
            var answer;

            listTableCheckedInput = $('#paymentsTable').find("input:not('#checkAll_payments'):checked");
            this.collectionLength = this.collection.length;

            if (listTableCheckedInput.length == 1) {
                answer = confirm('Do you really want to remove this payment?');
            } else {
                answer = confirm('Do you really want to remove those payments?');
            }

            if (answer) {
                App.startPreload();

                async.eachSeries(listTableCheckedInput, function (checkbox, cb) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        wait   : true,
                        success: function (model) {
                            var id = model.get('_id');

                            that.$listTable.find('[data-id="' + id + '"]').remove();

                            $('#removePayment').hide();
                            $('#checkAll_payments').prop('checked', false);

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
                        that.eventChannel.trigger('paymentRemoved');
                    }
                });
            }
        },

        recalcTotal: function () {
            var self = this;
            var collection = this.collection.toJSON();
            var totalPaidAmount = 0;
            var total = 0;

            async.forEach(collection, function (model, cb) {
                totalPaidAmount += parseFloat(model.paidAmount);
                total += parseFloat(model.paidAmount / model.currency.rate) + parseFloat(model.differenceAmount);

                cb();
            }, function () {
                self.$el.find('#totalPaidAmount').text(helpers.currencySplitter(totalPaidAmount.toFixed(2)));
                self.$el.find('#total').text(helpers.currencySplitter(total.toFixed(2)));
            });
        },

        checked: function (e) {
            var el = this.$el;
            var $targetEl = $(e.target);
            var checkLength = el.find('input.checkbox:checked').length;
            var checkAll$ = el.find('#checkAll_payments');
            var removeBtnEl = $('#removePayment');

            e.stopPropagation();

            if ($targetEl.hasClass('notRemovable')) {
                $targetEl.prop('checked', false);

                return false;
            }

            if (this.collection.length > 0) {
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
            var $holder = this.$el;
            var tBody = $holder.find('#listTable');
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

            pagenation = $holder.find('.pagination');

            if (newModels.length !== 0) {
                pagenation.show();
            } else {
                pagenation.hide();
            }

            if (typeof (this.recalcTotal) === 'function') {
                this.recalcTotal();
            }
        },

        render: function (options) {
            var $currentEl = this.$el;
            var self = this;
            var tabs;
            var dialogHolder;
            var n;
            var target;
            var template = _.template(paymentTemplate);

            $currentEl.html('');

            if (options && options.activeTab) {
                self.hideDialog();

                tabs = $('.chart-tabs');
                target = tabs.find('#paymentsTab');

                target.closest('.chart-tabs').find('a.active').removeClass('active');
                target.addClass('active');
                n = target.parents('.chart-tabs').find('li').index(target.parent());
                dialogHolder = $('.dialog-tabs-items');
                dialogHolder.find('.dialog-tabs-item.active').removeClass('active');
                dialogHolder.find('.dialog-tabs-item').eq(n).addClass('active');
            }

            $currentEl.append(template({
                paymentCollection  : this.collection.toJSON(),
                startNumber        : 0,
                utcDateToLocaleDate: common.utcDateToLocaleDate,
                currencySplitter   : helpers.currencySplitter,
                currencyClass      : helpers.currencyClass
            }));

            this.renderPagination($currentEl, this);

            this.$el.find('#savePayment').hide();
            this.$el.find('#removePayment').hide();

            $('#checkAll_payments').click(function () {
                self.$el.find(':checkbox:not(.notRemovable)').prop('checked', this.checked);
                if (self.$el.find('input.checkbox:checked').length > 0) {
                    self.$el.find('#removePayment').show();
                } else {
                    self.$el.find('#removePayment').hide();
                }
            });

            setTimeout(function () {
                self.editCollection = new editCollection(self.collection.toJSON());
                self.editCollection.on('updated', self.updatedOptions, self);

                self.$listTable = $('#paymentsTable');
            }, 10);

            self.eventChannel.trigger('elemCountChanged');

            return this;
        }
    });

    return paymentView;
});
