define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/salesQuotation/list/ListHeader.html',
    'text!templates/salesOrder/list/ListHeader.html',
    'text!templates/stages.html',
    'views/salesQuotation/CreateView',
    'views/salesOrder/list/ListItemView',
    'views/supplierPayments/list/ListTotalView',
    'views/salesOrder/EditView',
    'models/QuotationModel',
    'collections/salesQuotation/filterCollection',
    'dataService',
    'constants',
    'helpers',
    'helpers'
], function ($, 
             _,
             ListViewBase, 
             listTemplate, 
             listForWTrack, 
             stagesTemplate,
             createView, 
             ListItemView, 
             ListTotalView, 
             EditView, 
             QuotationModel,
             contentCollection,
             dataService, 
             CONSTANTS, 
             helpers) {
    'use strict';

    var OrdersListView = ListViewBase.extend({

        createView              : createView,
        listTemplate            : listTemplate,
        ListItemView            : ListItemView,
        contentCollection       : contentCollection,
        contentType             : 'salesOrder', // needs in view.prototype.changeLocationHash

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;

            this.filter = options.filter || {};
            this.filter.forSales = {
                key  : 'forSales',
                value: ['true']
            };

            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;
            this.contentCollection = contentCollection;

            this.render();
        },

        showFilteredPage: function (filter) {
            var itemsNumber = $("#itemsNumber").text();
            
            $('#top-bar-deleteBtn').hide();
            $('#checkAll').prop('checked', false);

            this.startTime = new Date();
            this.newCollection = false;

            this.filter = Object.keys(filter).length === 0 ? {} : filter;

            this.filter.forSales = {
                key  : 'forSales',
                value: ['true']
            };

            this.changeLocationHash(1, itemsNumber, filter);
            this.collection.showMore({count: itemsNumber, page: 1, filter: filter});
            this.getTotalLength(null, itemsNumber, filter);
        },

        events: {
            'click .stageSelect'                 : 'showNewSelect',
            'click  .list tbody td:not(.notForm)': 'goToEditDialog',
            'click .newSelectList li'            : 'chooseOption'
        },

        chooseOption: function (e) {
            var self = this;
            var $target = $(e.target);
            var $targetElement = $target.parents('td');
            var id = $targetElement.attr('id');
            var model = this.collection.get(id);

            model.save({
                workflow: $target.attr('id')
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

        recalcTotal: function () {
            var total = 0;

            _.each(this.collection.toJSON(), function (model) {
                total += parseFloat(model.paymentInfo.total);
            });

            this.$el.find('#total').text(helpers.currencySplitter(total.toFixed(2)));
        },

        render: function () {
            var self;
            var $currentEl;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');

            $currentEl.append(_.template(listForWTrack));
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render());

            // added two parameters page and items number
            $currentEl.append(new ListTotalView({element: this.$el.find('#listTable'), cellSpan: 5}).render());

            this.renderPagination($currentEl, this);
            this.renderFilter(self);

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

            dataService.getData(CONSTANTS.URLS.WORKFLOWS_FETCH, {
                wId         : 'Sales Order',
                source      : 'purchase',
                targetSource: 'order'
            }, function (stages) {
                self.stages = stages;
            });
        },

        goToEditDialog: function (e) {
            var $tr = $(e.target).closest('tr');
            var id = $tr.data('id');
            var notEditable = $tr.hasClass('notEditable');
            var onlyView;
            var model = new QuotationModel({validate: false});

            e.preventDefault();

            if (notEditable) {
                onlyView = true;
            }

            model.urlRoot = '/Order/form/' + id;
            model.fetch({
                data   : {contentType: this.contentType},
                success: function (model) {
                    return new EditView({
                        model: model, 
                        onlyView: onlyView
                    });
                },
                
                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Please refresh browser'
                    });
                }
            });
        }

    });

    return OrdersListView;
});
