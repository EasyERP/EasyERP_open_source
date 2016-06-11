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
             contentCollection,
             FilterView,
             dataService,
             CONSTANTS,
             helpers) {
    'use strict';

    var QuotationListView = listViewBase.extend({
        createView              : CreateView,
        listTemplate            : listTemplate,
        ListItemView            : ListItemView,
        contentCollection       : contentCollection,
        viewType                : 'list',
        contentType             : CONSTANTS.SALESQUOTATION,

        events: {
            'click .stageSelect'                 : 'showNewSelect',
            'click  .list tbody td:not(.notForm)': 'goToEditDialog',
            'click .newSelectList li'            : 'chooseOption'
        },

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
                value: ['true']
            };
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

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

        chooseOption: function (e) {
            var self = this;
            var target$ = $(e.target);
            var targetElement = target$.parents('td');
            var id = targetElement.attr('id');
            var model = this.collection.get(id);

            model.save({
                workflow: {
                    _id : target$.attr('id'),
                    name: target$.text()
                }
            }, {
                headers: {
                    mid: 55
                },

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

        render: function () {
            var $currentEl;
            var templ;

            $('.ui-dialog ').remove();

            $currentEl = this.$el;

            $currentEl.html('');

            templ = _.template(listTemplate);
            $currentEl.append(templ);
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render()); // added two parameters page and items number

            this.renderFilter();

            this.renderPagination($currentEl, this);

            this.recalcTotal();

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + ' ms</div>');
            
            return this;
        },

        goToEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new CurrentModel({validate: false});

            e.preventDefault();

            model.urlRoot = '/quotation/';
            model.fetch({
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
