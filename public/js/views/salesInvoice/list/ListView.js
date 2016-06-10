define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/salesInvoice/list/ListHeader.html',
    'views/salesInvoice/CreateView',
    'views/salesInvoice/EditView',
    'models/InvoiceModel',
    'views/salesInvoice/list/ListItemView',
    'collections/salesInvoice/filterCollection',
    'views/Filter/FilterView',
    'common',
    'dataService',
    'helpers',
    'constants'
], function ($,
             _,
             listViewBase,
             listTemplate,
             CreateView,
             EditView,
             invoiceModel,
             listItemView,
             contentCollection,
             FilterView,
             common,
             dataService,
             helpers,
             CONSTANTS) {
    'use strict';

    var InvoiceListView = listViewBase.extend({
        createView              : CreateView,
        listTemplate            : listTemplate,
        listItemView            : listItemView,
        contentCollection       : contentCollection,
        FilterView              : FilterView,
        contentType             : CONSTANTS.SALESINVOICE, // 'salesInvoice', //'Invoice',//needs in view.prototype.changeLocationHash
        changedModels           : {},

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter ? options.filter : {};
            this.filter.forSales = {key: 'forSales', value: [true]};
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            this.render();
        },

        events: {
            // 'click .stageSelect'                       : 'showNewSelect',
            'click  .list tbody td:not(.notForm, .validated)': 'goToEditDialog',
            'click .newSelectList li'                        : 'chooseOption',
            'click .selectList'                              : 'showSelects'
        },

        showSelects: function (e) {
            e.preventDefault();

            $(e.target).parent('td').append("<ul class='newSelectList'><li>Draft</li><li>Done</li></ul>");

            e.stopPropagation();
        },

        saveItem: function () {
            var model;
            var self = this;
            var id;

            for (id in this.changedModels) {
                model = this.collection.get(id);

                model.save({
                    validated: self.changedModels[id].validated
                }, {
                    headers: {
                        mid: 55
                    },

                    patch   : true,
                    validate: false,
                    success : function () {
                        $('#top-bar-saveBtn').hide();
                    }
                });
            }

            for (id in this.changedModels) {
                delete this.changedModels[id];
            }
        },

        chooseOption: function (e) {
            var target$ = $(e.target);
            var targetElement = target$.parents('td');
            var targetTr = target$.parents('tr');
            var id = targetTr.attr('data-id');

            if (!this.changedModels[id]) {
                this.changedModels[id] = {};
            }

            if (!this.changedModels[id].hasOwnProperty('validated')) {
                this.changedModels[id].validated = target$.text();
                this.changesCount++;
            }

            targetElement.find('.selectList').text(target$.text());

            this.hideNewSelect();

            $('#top-bar-saveBtn').show();

            return false;
        },

        currentEllistRenderer: function (self) {
            var $currentEl = self.$el;
            var itemView;

            $currentEl.append(_.template(listTemplate, {currentDb: true}));
            itemView = new listItemView({
                collection : self.collection,
                page       : self.page,
                itemsNumber: self.collection.namberToShow
            });
            itemView.bind('incomingStages', self.pushStages, self);

            $currentEl.append(itemView.render());
        },

        render: function () {
            var self;
            var $currentEl;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');

            this.currentEllistRenderer(self);

                self.renderPagination($currentEl, self);
                self.renderFilter(self, {name: 'forSales', value: {key: 'forSales', value: [true]}});

            this.recalcTotal();

            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
        },

        recalcTotal: function () {
            var self = this;
            var columns = ['balance', 'total', 'paid'];

            _.each(columns, function (col) {
                var sum = 0;

                _.each(self.collection.toJSON(), function (model) {
                    if (col === 'paid') {
                        sum += parseFloat(model[col]);
                    } else {
                        sum += parseFloat(model.paymentInfo[col]);
                    }
                });

                self.$el.find('#' + col).text(helpers.currencySplitter(sum.toFixed(2)));
            });
        },

        goToEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new invoiceModel({validate: false});

            e.preventDefault();

            model.urlRoot = '/Invoice/';
            model.fetch({
                data: {
                    id       : id,
                    currentDb: App.currentDb,
                    viewType : 'form'
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

    return InvoiceListView;
});
