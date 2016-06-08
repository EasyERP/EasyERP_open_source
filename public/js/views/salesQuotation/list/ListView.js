define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/salesQuotation/list/ListHeader.html',
    'text!templates/salesQuotation/list/ListHeader.html',
    'text!templates/stages.html',
    'views/salesQuotation/CreateView',
    'views/salesQuotation/list/ListItemView',
    'views/supplierPayments/list/ListTotalView',
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
             listForWTrack,
             stagesTemplate,
             CreateView,
             ListItemView,
             ListTotalView,
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
        listItemView            : ListItemView,
        contentCollection       : contentCollection,
        FilterView              : FilterView,
        totalCollectionLengthUrl: '/quotation/totalCollectionLength',
        viewType                : 'list', // needs in view.prototype.changeLocationHash
        contentType             : CONSTANTS.SALESQUOTATION, // needs in view.prototype.changeLocationHash

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

            /* this.startTime = options.startTime;
             this.collection = options.collection;
             this.filter = options.filter || {};

             this.sort = options.sort;
             this.defaultItemsNumber = this.collection.namberToShow || 100;
             this.newCollection = options.newCollection;
             this.deleteCounter = 0;
             this.page = options.collection.page;

             this.render();

             this.getTotalLength(null, this.defaultItemsNumber, this.filter);
             this.contentCollection = contentCollection;*/

        },

        recalcTotal: function () {
            var total = 0;

            _.each(this.collection.toJSON(), function (model) {
                total += parseFloat(model.paymentInfo.total);
            });

            this.$el.find('#total').text(helpers.currencySplitter(total.toFixed(2)));
        },

        showFilteredPage: function (filter) {
            var itemsNumber = $('#itemsNumber').text();

                $("#top-bar-deleteBtn").hide();
                $('#checkAll').prop('checked', false);

            this.startTime = new Date();
            this.newCollection = false;

            this.filter = Object.keys(filter).length === 0 ? {} : filter;

            this.filter.forSales = {
                key  : 'forSales',
                value: ['true']
            };

            this.changeLocationHash(1, itemsNumber, filter);
            // this.collection.showMore({count: itemsNumber, page: 1, filter: filter});
            // this.getTotalLength(null, itemsNumber, filter);
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

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();

                return false;
            }
            $(e.target).parent().append(_.template(stagesTemplate, {
                stagesCollection: this.stages
            }));
            return false;
        },

        hideNewSelect: function () {
            $('.newSelectList').remove();
        },

        render: function () {
            var self;
            var $currentEl;
            var templ;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');

            templ = _.template(listForWTrack);
            $currentEl.append(templ);
            $currentEl.append(new ListItemView({
                collection : this.collection,
                page       : this.page,
                itemsNumber: this.collection.namberToShow
            }).render()); // added two parameters page and items number

            $currentEl.append(new ListTotalView({
                element : $currentEl.find('#listTable'),
                cellSpan: 5
            }).render());

                this.renderPagination($currentEl, this);
                this.renderFilter(self);

            this.renderPagination($currentEl, this);

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

            dataService.getData(CONSTANTS.URLS.WORKFLOWS_FETCH, {
                wId         : 'Sales Order',
                source      : 'purchase',
                targetSource: 'quotation'
            }, function (stages) {
                self.stages = stages;
            });

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
                    new EditView({model: model});
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
