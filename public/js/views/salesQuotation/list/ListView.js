define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/salesQuotation/list/ListHeader.html',
    'text!templates/stages.html',
    'views/salesQuotation/CreateView',
    'views/salesQuotation/list/ListItemView',
    'views/salesQuotation/EditView',
    'models/QuotationModel',
    'collections/salesQuotation/filterCollection',
    'views/Filter/FilterView',
    'dataService',
    'constants',
    'helpers'
], function ($,
             _,
             listViewBase,
             listTemplate,
             stagesTemplate,
             CreateView,
             ListItemView,
             EditView,
             CurrentModel,
             ContentCollection,
             FilterView,
             dataService,
             CONSTANTS,
             helpers) {
    'use strict';

    var QuotationListView = listViewBase.extend({

        listTemplate: listTemplate,
        ListItemView: ListItemView,

        ContentCollection: ContentCollection,
        CreateView       : CreateView,
        EditView         : EditView,

        viewType   : 'list',
        contentType: CONSTANTS.SALESQUOTATION,

        events: {
            'click .stageSelect'                 : 'showNewSelect',
            'click  .list tbody td:not(.notForm)': 'goToEditDialog',
            'click .newSelectList li'            : 'chooseOption'
        },

        initialize: function (options) {
            this.filter = options.filter || {};
            this.filter.forSales = {
                key  : 'forSales',
                value: ['true']
            };

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.page = options.collection.currentPage;

            this.render();
            this.stages = [];
        },

        recalcTotal: function () {
            var total = 0;

            _.each(this.collection.toJSON(), function (model) {
                if (model.currency && model.currency.rate) {
                    total += parseFloat(model.paymentInfo.total / model.currency.rate);
                } else {
                    total += parseFloat(model.paymentInfo.total);
                }
            });

            this.$el.find('#total').text(helpers.currencySplitter(total.toFixed(2)));
        },

        chooseOption: function (event) {
            var self = this;
            var $eventTarget = $(event.target);
            var $parentTd = $eventTarget.parents('td');
            var id = $parentTd.attr('id');
            var model = this.collection.get(id);

            model.save({
                workflow: {
                    _id : $eventTarget.attr('id'),
                    name: $eventTarget.text()
                }
            }, {
                patch   : true,
                validate: false,
                waite   : true,
                success : function () {
                    self.showFilteredPage({}, self);
                }
            });

            this.hideNewSelect();
            return false;
        },

        showNewSelect: function (event) {
            var $eventTarget = $(event.target);
            var compiledStagesTemplate = _.template(stagesTemplate, {
                stagesCollection: this.stages
            });

            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
                return false;
            }

            $eventTarget.parent().append(compiledStagesTemplate);
            return false;
        },

        hideNewSelect: function () {
            $('.newSelectList').remove();
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var template = _.template(listTemplate);

            $('.ui-dialog').remove();

            $thisEl.html('');
            $thisEl.append(template);
            $thisEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render()); // added two parameters page and items number

            this.renderFilter();
            this.renderPagination($thisEl, this);
            this.recalcTotal();

            $thisEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');

            dataService.getData(CONSTANTS.URLS.WORKFLOWS_FETCH, {
                wId         : 'Sales Order',
                source      : 'purchase',
                targetSource: 'quotation'
            }, function (stages) {
                self.stages = stages;
            });

            return this;
        },

        goToEditDialog: function (event) {
            var $eventTarget = $(event.target);
            var $closestTr = $eventTarget.closest('tr');
            var id = $closestTr.data('id');
            var quotationModel = new CurrentModel({
                validate: false
            });

            event.preventDefault();

            quotationModel.urlRoot = '/quotation/';
            quotationModel.fetch({
                data: {
                    id      : id,
                    viewType: 'form'
                },

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
