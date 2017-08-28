define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/order/list/ListHeader.html',
    'text!templates/stages.html',
    'views/order/CreateView',
    'views/order/list/ListItemView',
    'views/order/list/ListTotalView',
    'views/order/EditView',
    'models/orderModel',
    'collections/order/filterCollection',
    'common',
    'dataService',
    'helpers',
    'constants'
], function (Backbone, $, _, listViewBase, listTemplate, stagesTamplate, createView, ListItemView, ListTotalView, EditView, OrderModel, contentCollection, common, dataService, helpers, CONSTANTS) {
    'use strict';
    var OrdersListView = listViewBase.extend({
        CreateView       : createView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : 'order',
        hasPagination    : true,

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.filter = options.filter || {};
            this.filter.forSales = {
                key  : 'forSales',
                type : 'boolean',
                value: ['true']
            };
            this.formUrl = 'easyErp/' + this.contentType + '/tform/';
            this.forSales = true;
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;

            listViewBase.prototype.initialize.call(this, options);

            this.contentCollection = contentCollection;
        },

        recalcTotal: function () {
            var total = 0;
            var balance = 0;
            var paid = 0;

            _.each(this.collection.toJSON(), function (model) {
                total += parseFloat(model.paymentInfo.total);
                balance += parseFloat(model.paymentBalance);
                paid += parseFloat(model.paymentsPaid);
            });

            this.$el.find('#total').text(helpers.currencySplitter(total.toFixed(2)));
            this.$el.find('#balance').text(helpers.currencySplitter((balance / 100).toFixed(2)));
            this.$el.find('#paid').text(helpers.currencySplitter((paid / 100).toFixed(2)));
        },

        chooseOption: function (e) {
            var self = this;
            var target$ = $(e.target);
            var targetElement = target$.parents('td');
            var id = targetElement.attr('id');
            var model = this.collection.get(id);

            model.save({
                workflow: target$.attr('id')
            }, {
                headers: {
                    mid: 55
                },

                patch   : true,
                validate: false,
                success : function () {
                    self.showFilteredPage(self.filter, self);
                }
            });

            this.hideNewSelect();
            return false;
        },

        importFromMagento: function () {
            var url = '/integration/salesOrders';
            var self = this;

            dataService.getData(url, {}, function (err, result) {
                if (err) {
                    return self.errorNotification(err);
                }

                self.render();
            });
        },

        exportToMagento: function () {
            var url = '/integration/salesOrders';
            var data = {};
            var self = this;
            var $thisEl = this.$el;
            var $table = $thisEl.find('#listTable');
            var temportaryArr = [];
            var orders = [];
            var $checkedInputs;
            var $el;

            $checkedInputs = $table.find('input:checked');

            $.each($checkedInputs, function () {
                $el = $(this);

                orders.push($el.val());
            });

            data = {
                salesOrders: orders
            };

            dataService.postData(url, data, function (err, result) {
                if (err) {
                    return self.errorNotification(err);
                }
                alert(result.success);
            });
        },

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
                return false;
            }
            $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: this.stages}));
            return false;

        },

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var page = this.collection.currentPage;
            var countPerPage = this.collection.pageSize;
            var url = this.formUrl + id + '/p=' + page + '/c=' + countPerPage;

            if (this.filter) {
                url += '/filter=' + encodeURI(JSON.stringify(this.filter));
            }

            if ($(e.target).closest('tfoot').length) {
                return;
            }

            App.ownContentType = true;
            Backbone.history.navigate(url, {trigger: true});
        },

        hideNewSelect: function () {
            $('.newSelectList').remove();
        },

        render: function () {
            var self;
            var $currentEl;
            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render()); // added two parameters page and items number
            $currentEl.append(new ListTotalView({element: this.$el.find('#listTable'), cellSpan: 7}).render());

            this.recalcTotal();

            // this.renderPagination($currentEl, this);
            // this.renderFilter();

            // $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

            dataService.getData(CONSTANTS.URLS.WORKFLOWS_FETCH, {
                wId         : 'Purchase Order',
                source      : 'purchase',
                targetSource: 'order'
            }, function (stages) {
                self.stages = stages;
            });
        }

        /* goToEditDialog: function (e) {
         var tr = $(e.target).closest('tr');
         var id = tr.data('id');
         var url = 'easyErp/' + this.contentType + '/form/' + id;
         var notEditable = tr.hasClass('notEditable');
         var model = new QuotationModel({validate: false});
         var onlyView = false;

         e.preventDefault();

         if (notEditable) {
         onlyView = true;
         }


         /!*model.urlRoot = '/orders/';
         model.fetch({
         data: {
         id      : id,
         viewType: 'form'
         },

         success: function (model) {
         return new EditView({model: model, onlyView: onlyView});
         },

         error: function () {
         App.render({
         type   : 'error',
         message: 'Please refresh browser'
         });
         }
         });*!/

         Backbone.history.navigate(url, {trigger: true});
         }*/

    });
    return OrdersListView;
});
