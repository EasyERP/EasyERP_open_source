define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/Quotation/list/ListHeader.html',
    'text!templates/stages.html',
    'views/Quotation/CreateView',
    'views/Quotation/list/ListItemView',
    'views/Order/list/ListTotalView',
    'views/Quotation/EditView',
    'models/QuotationModel',
    'collections/Quotation/filterCollection',
    'views/Filter/filterView',
    'dataService',
    'constants',
    'helpers'
], function ($, _, ListViewBase, listTemplate, stagesTemplate, CreateView, ListItemView, ListTotalView, EditView, CurrentModel, contentCollection, FilterView, dataService, CONSTANTS, helpers) {
    'use strict';

    var QuotationListView = ListViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : 'Quotation', // needs in view.prototype.changeLocationHash
        viewType         : 'list', // needs in view.prototype.changeLocationHash
        FilterView       : FilterView,

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter || {};
            this.filter.forSales = {
                key  : 'forSales',
                value: ['false']
            };
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            this.render();

            this.stages = [];
        },

        events: {
            'click .stageSelect'                 : 'showNewSelect',
            'click  .list tbody td:not(.notForm)': 'goToEditDialog',
            'click .newSelectList li'            : 'chooseOption'
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

        recalcTotal: function () {
            var total = 0;
            var unTaxed = 0;

            _.each(this.collection.toJSON(), function (model) {
                total += parseFloat(model.paymentInfo.total);
                unTaxed += parseFloat(model.paymentInfo.unTaxed);
            });

            this.$el.find('#total').text(helpers.currencySplitter(total.toFixed(2)));
            this.$el.find('#unTaxed').text(helpers.currencySplitter(unTaxed.toFixed(2)));
        },

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
                return false;
            }
            $(e.target).parent().append(_.template(stagesTemplate, {stagesCollection: this.stages}));
            return false;

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
            $currentEl.append(_.template(this.listTemplate));
            $currentEl.append(new this.ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render()); // added two parameters page and items number

            $currentEl.append(new ListTotalView({element: $currentEl.find('#listTable'), cellSpan: 4}).render());

            this.renderPagination($currentEl, this);

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

            this.renderFilter();

            dataService.getData(CONSTANTS.URLS.WORKFLOWS_FETCH, {
                wId         : 'Purchase Order',
                source      : 'purchase',
                targetSource: 'quotation'
            }, function (stages) {
                self.stages = stages;
            });
        },

        goToEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new CurrentModel({validate: false});

            e.preventDefault();

            model.urlRoot = '/quotation/form/' + id;
            model.fetch({
                success: function (model) {
                    return new EditView({model: model});
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
    return QuotationListView;
});
