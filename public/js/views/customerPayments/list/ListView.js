define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/supplierPayments/list/ListHeader.html',
    'text!templates/customerPayments/list/cancelTemplate.html',
    'views/customerPayments/list/ListItemView',
    'views/Filter/FilterView',
    'views/customerPayments/EditView',
    'collections/customerPayments/filterCollection',
    'collections/customerPayments/editCollection',
    'models/PaymentModel',
    'dataService',
    'populate',
    'async',
    'helpers'
], function (Backbone, $, _, ListViewBase, listTemplate, cancelEdit, ListItemView, filterView, EditView, paymentCollection, EditCollection, CurrentModel, dataService, populate, async, helpers) {
    'use strict';

    var PaymentListView = ListViewBase.extend({

        listTemplate     : listTemplate,
        listItemView     : ListItemView,
        filterView       : filterView, // if reload page, and in url is valid page
        contentType      : 'customerPayments', // needs in view.prototype.changeLocationHash
        modelId          : null,
        $listTable       : null,
        editCollection   : null,
        contentCollection: paymentCollection,
        changedModels    : {},
        responseObj      : {},
        template         : _.template(listTemplate),

        events: {
            'click td.editable'                                : 'editRow',
            'change .editable '                                : 'setEditable',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click tbody td:not(.checkbox, .date)'             : 'goToEditDialog'
        },

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = paymentCollection;

            this.render();
        },

        goToEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = this.collection.get(id);

            e.preventDefault();

            new EditView({model: model});
        },

        recalcTotal: function () {
            var amount = 0;

            _.each(this.collection.toJSON(), function (model) {
                amount += parseFloat(model.paidAmount);
            });

            this.$el.find('#totalPaidAmount').text(helpers.currencySplitter(amount.toFixed(2)));
        },

        deleteItems: function () {
            var that = this;
            var mid = 68;
            var model;
            var localCounter = 0;
            var checked = this.$el.find('#listTable input:checked');
            var count = checked.length;
            var value;

            this.collectionLength = this.collection.length;

            if (!this.changed) {

                $.each(checked, function (index, checkbox) {
                    value = checkbox.value;

                    if (value.length < 24) {
                        that.editCollection.remove(value);
                        that.editCollection.on('remove', function () {
                            this.listLength--;
                            localCounter++;

                            that.deleteCounter = localCounter;
                            that.deletePage = $('#currentShowPage').val();
                            that.deleteItemsRender(that.deleteCounter, that.deletePage);

                        }, that);
                    } else {

                        model = that.collection.get(value);
                        model.urlRoot = 'payment';
                        model.destroy({
                            headers: {
                                mid: mid
                            },
                            wait   : true,
                            success: function () {
                                that.listLength--;
                                localCounter++;

                                that.deleteCounter = localCounter;
                                that.deletePage = $('#currentShowPage').val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);
                            },

                            error: function (model, res) {
                                if (res.status === 403 && index === 0) {
                                    App.render({
                                        type   : 'error',
                                        message: 'You do not have permission to perform this action'
                                    });
                                }
                                that.listLength--;
                                localCounter++;
                                if (index === count - 1) {

                                    that.deleteCounter = localCounter;
                                    that.deletePage = $('#currentShowPage').val();
                                    that.deleteItemsRender(that.deleteCounter, that.deletePage);
                                }

                            }
                        });
                    }
                });
            } else {
                this.cancelChanges();
            }
        },

        checked: function (e) {
            var el = this.$el;
            var $targetEl = $(e.target);
            var checkLength = el.find('input.checkbox:checked').length;
            var checkAll$ = el.find('#checkAll');
            var removeBtnEl = $('#top-bar-deleteBtn');

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

        cancelChanges: function () {
            var self = this;
            var edited = this.edited;
            var collection = this.collection;
            var copiedCreated;
            var dataId;

            async.each(edited, function (el, cb) {
                var tr = $(el).closest('tr');
                var rowNumber = tr.find('[data-content="number"]').text();
                var id = tr.attr('data-id');
                var template = _.template(cancelEdit);
                var model;

                if (!id) {
                    return cb('Empty id');
                }

                model = collection.get(id);
                model = model.toJSON();
                model.startNumber = rowNumber;
                tr.replaceWith(template({model: model, currencySplitter: helpers.currencySplitter}));
                cb();
            }, function (err) {
                if (!err) {
                    self.editCollection = new EditCollection(collection.toJSON());
                    self.editCollection.on('saved', self.savedNewModel, self);
                    self.editCollection.on('updated', self.updatedOptions, self);
                    self.hideSaveCancelBtns();
                }
            });

            copiedCreated = this.$el.find('#false');
            dataId = copiedCreated.attr('data-id');
            this.editCollection.remove(dataId);
            delete this.changedModels[dataId];
            copiedCreated.remove();

            self.changedModels = {};
        },

        render: function () {
            var self;
            var $currentEl;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(this.template);
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());

            this.recalcTotal();
            
            this.renderPagination($currentEl, this);

            this.renderFilter(self);

            this.editCollection = new EditCollection(this.collection.toJSON());

            this.$listTable = $('#listTable');

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + 'ms</div>');

            return this;
        }
    });

    return PaymentListView;
});
