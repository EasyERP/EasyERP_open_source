define([
    'Underscore',
    'jQuery',
    'text!templates/Projects/projectInfo/orders/ListTemplate.html',
    'text!templates/Projects/projectInfo/orders/ListHeader.html',
    'text!templates/Pagination/PaginationTemplate.html',
    'views/salesOrder/EditView',
    'views/salesOrder/list/ListView',
    'collections/Quotation/filterCollection',
    'models/QuotationModel',
    'dataService',
    'common',
    'helpers',
    'constants'

], function (_, $, ListTemplate, lisHeader, paginationTemplate, EditView, listView, quotationCollection, OrderModel, dataService, common, helpers, CONSTANTS) {
    'use strict';

    var orderView = listView.extend({

        el               : '#orders',
        contentCollection: quotationCollection,
        templateList     : _.template(ListTemplate),
        templateHeader   : _.template(lisHeader),

        events: {
            'click .checkbox'                    : 'checked',
            'click #removeOrder'                 : 'removeItems',
            'click  .list tbody td:not(.notForm)': 'goToEditDialog'
        },

        initialize: function (options) {
            this.remove();
            this.collection = options.collection;
            this.projectID = options.projectId;
            this.customerId = options.customerId;
            this.projectManager = options.projectManager;
            this.filter = options.filter || {};
            this.defaultItemsNumber = 50;
            this.page = options.page || 1;
            this.startNumber = options.startNumber || 1;
            this.eventChannel = options.eventChannel;

            this.render(options);
        },

        showOrderDialog: function (id) {
            var self = this;
            var model = new OrderModel({validate: false});

            model.urlRoot = '/Order/';
            model.fetch({
                data   : {id: id, contentType: this.contentType},
                success: function (model) {
                    new EditView({
                        model         : model,
                        redirect      : true,
                        projectManager: self.projectManager,
                        eventChannel  : self.eventChannel
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

        goToEditDialog: function (e) {
            var self = this;
            var tr = $(e.target).closest('tr');
            var id = tr.data('id');
            var notEditable = tr.hasClass('notEditable');
            var onlyView;
            var model = new OrderModel({validate: false});

            e.preventDefault();

            if (notEditable) {
                onlyView = true;
            }

            model.urlRoot = '/Order/';
            model.fetch({
                data   : {id: id, contentType: this.contentType},
                success: function (model) {
                    new EditView({
                        model         : model,
                        redirect      : true,
                        projectManager: self.projectManager,
                        onlyView      : onlyView,
                        eventChannel  : self.eventChannel
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

        /*  renderContent: function () {
         var $currentEl = this.$el;
         var pagenation;

         $('#top-bar-deleteBtn').hide();
         $('#checkAll').prop('checked', false);

         if (this.collection.length > 0) {
         $currentEl.find('#orderTable').html(this.templateList({
         orderCollection : this.collection.toJSON(),
         startNumber     : 0,
         dateToLocal     : common.utcDateToLocaleDate,
         currencySplitter: helpers.currencySplitter,
         currencyClass   : helpers.currencyClass
         }));
         }

         pagenation = this.$el.find('.pagination');
         if (this.collection.length === 0) {
         pagenation.hide();
         } else {
         pagenation.show();
         }
         },

         goSort: function (e) {
         var target$;
         var currentParrentSortClass;
         var sortClass;
         var sortConst;
         var sortBy;
         var sortObject;

         this.collection.unbind('reset');
         this.collection.unbind('showmore');

         target$ = $(e.target).closest('th');
         currentParrentSortClass = target$.attr('class');
         sortClass = currentParrentSortClass.split(' ')[1];
         sortConst = 1;
         sortBy = target$.data('sort');
         sortObject = {};

         if (!sortClass) {
         target$.addClass('sortUp');
         sortClass = 'sortUp';
         }
         switch (sortClass) {
         case 'sortDn':
         {
         target$.parent().find('th').removeClass('sortDn').removeClass('sortUp');
         target$.removeClass('sortDn').addClass('sortUp');
         sortConst = 1;
         }
         break;
         case 'sortUp':
         {
         target$.parent().find('th').removeClass('sortDn').removeClass('sortUp');
         target$.removeClass('sortUp').addClass('sortDn');
         sortConst = -1;
         }
         break;
         }
         sortObject[sortBy] = sortConst;

         this.fetchSortCollection(sortObject);
         this.getTotalLength(null, this.defaultItemsNumber, this.filter);
         },

         getTotalLength: function (currentNumber, itemsNumber, filter) {
         var self = this;

         dataService.getData(this.totalCollectionLengthUrl, {
         currentNumber: currentNumber,
         filter       : filter,
         contentType  : this.contentType,
         newCollection: this.newCollection
         }, function (response, context) {

         var page = context.page || 1;
         var length = context.listLength = response.count || 0;

         if (itemsNumber === 'all') {
         itemsNumber = response.count;
         }

         if (itemsNumber * (page - 1) > length) {
         context.page = page = Math.ceil(length / itemsNumber);
         }

         context.pageElementRenderProject(response.count, itemsNumber, page, self);//prototype in main.js
         }, this);
         },

         renderPagination: function ($currentEl, self) {
         $currentEl.append(_.template(paginationTemplate));

         var pagenation = self.$el.find('.pagination');

         if (self.collection.length === 0) {
         pagenation.hide();
         } else {
         pagenation.show();
         }

         $(document).on('click', function (e) {
         self.hide(e);
         });
         },
         */
        removeItems: function (event) {
            var answer = confirm('Really DELETE items ?!');
            var that = this;
            var mid = 39;
            var model;
            var localCounter = 0;
            var listTableCheckedInput;
            var count;
            var table = $('#ordersTable');

            event.preventDefault();

            listTableCheckedInput = table.find("input:not('#checkAll_orders'):checked");
            count = listTableCheckedInput.length;
            this.collectionLength = this.collection.length;

            if (answer === true) {
                $.each(listTableCheckedInput, function (index, checkbox) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function (model) {
                            var id = model.get('_id');

                            table.find('[data-id="' + id + '"]').remove();

                            $('#removeOrder').hide();
                            $('#checkAll_orders').prop('checked', false);

                            if (that.eventChannel) {
                                that.eventChannel.trigger('elemCountChanged');
                            }

                            // that.deleteItemsRender(that.deleteCounter, that.deletePage);
                        },

                        error: function (model, res) {
                            if (res.status === 403 && index === 0) {
                                App.render({
                                    type   : 'error',
                                    message: 'You do not have permission to perform this action'
                                });
                            }
                            that.listLength--;
                            count--;
                            if (count === 0) {
                                that.deleteCounter = localCounter;
                                that.deletePage = $('#currentShowPage').val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);
                            }
                        }
                    });
                });
            }

        },

        checked: function (e) {
            var $targetEl = $(e.target);
            var $el = this.$el;
            var checkLength;

            if ($targetEl.hasClass('notRemovable')) {
                $targetEl.prop('checked', false);

                return false;
            }

            if (this.collection.length > 0) {
                checkLength = $el.find('input.checkbox:checked').length;

                if ($el.find('input.checkbox:checked').length > 0) {
                    $el.find('#removeOrder').show();
                    $el.find('#checkAll_orders').prop('checked', false);

                    if (checkLength === this.collection.length) {
                        $el.find('#checkAll_orders').prop('checked', true);
                    }
                } else {
                    $el.find('#removeOrder').hide();
                    $el.find('#checkAll_orders').prop('checked', false);
                }
            }
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function (options) {
            var $currentEl = this.$el;
            var self = this;
            var tabs;
            var dialogHolder;
            var n;
            var target;

            if (options && options.activeTab) {
                self.hideDialog();

                tabs = $('.chart-tabs');
                target = tabs.find('#ordersTab');

                target.closest('.chart-tabs').find('a.active').removeClass('active');
                target.addClass('active');
                n = target.parents('.chart-tabs').find('li').index(target.parent());
                dialogHolder = $('.dialog-tabs-items');
                dialogHolder.find('.dialog-tabs-item.active').removeClass('active');
                dialogHolder.find('.dialog-tabs-item').eq(n).addClass('active');
            }

            $currentEl.html('');
            $currentEl.prepend(this.templateHeader);

            $currentEl.find('#orderTable').html(this.templateList({
                orderCollection : this.collection.toJSON(),
                startNumber     : 0,
                dateToLocal     : common.utcDateToLocaleDate,
                currencySplitter: helpers.currencySplitter,
                currencyClass   : helpers.currencyClass
            }));

            this.$el.find('.fa.fa-times').hide();

            $('#checkAll_orders').click(function () {
                self.$el.find(':checkbox:not(.notRemovable)').prop('checked', this.checked);
                if ($('input.checkbox:checked').length > 0) {
                    $('#removeOrder').show();
                } else {
                    $('#removeOrder').hide();
                    $('#checkAll_orders').prop('checked', false);
                }
            });

            dataService.getData(CONSTANTS.URLS.WORKFLOWS_FETCH, {
                wId         : 'Sales Order',
                source      : 'purchase',
                targetSource: 'order'
            }, function (stages) {
                self.stages = stages;
            });

            if (self.eventChannel) {
                self.eventChannel.trigger('elemCountChanged');
            }
        }
    });

    return orderView;
});
