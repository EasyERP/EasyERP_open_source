define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/DividendInvoice/list/ListHeader.html',
    'views/DividendInvoice/CreateView',
    'views/DividendInvoice/EditView',
    'models/InvoiceModel',
    'views/DividendInvoice/list/ListItemView',
    'collections/salesInvoice/filterCollection',
    'views/Filter/FilterView',
    'common',
    'dataService',
    'constants',
    'helpers'
], function ($, _, listViewBase, listTemplate, CreateView, EditView, invoiceModel, ListItemView, contentCollection, filterView, common, dataService, CONSTANTS, helpers) {
    var InvoiceListView = listViewBase.extend({
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        filterView       : filterView,
        contentType      : 'DividendInvoice',
        changedModels    : {},

        initialize: function (options) {
            $(document).off('click');

            this.EditView = EditView;
            this.CreateView = CreateView;

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            this.render();
        },

        events: {
            'click  .list tbody td:not(.notForm, .validated)': 'goToEditDialog',
            'click .newSelectList li'                        : 'chooseOption',
            'click .selectList'                              : 'showSelects'
        },

        showSelects: function (e) {
            e.preventDefault();

            $(e.target).parent('td').append('<ul class="newSelectList"><li>Draft</li><li>Done</li></ul>');

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

        render: function () {
            var self;
            var $currentEl;
            var itemView;

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');

            currentEllistRenderer(self);

            self.renderPagination($currentEl, self);
            self.renderFilter(self, {name: 'forSales', value: {key: 'forSales', value: [false]}});

            this.recalcTotal();

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

            function currentEllistRenderer(self) {
                $currentEl.append(_.template(listTemplate, {currentDb: true}));
                itemView = new ListItemView({
                    collection : self.collection,
                    page       : self.page,
                    itemsNumber: self.collection.namberToShow
                });
                itemView.bind('incomingStages', self.pushStages, self);

                $currentEl.append(itemView.render());

            }

        },

        recalcTotal: function () {
            var self = this;
            var columns = ['balance', 'paid', 'total'];

            _.each(columns, function (col) {
                var sum = 0;

                _.each(self.collection.toJSON(), function (model) {
                    sum += parseFloat(model.paymentInfo[col]);
                });

                self.$el.find('#' + col).text(helpers.currencySplitter(sum.toFixed(2)));
            });
        },

        goToEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = new invoiceModel({validate: false});
            var self = this;

            e.preventDefault();

            model.urlRoot = '/Invoice/';
            model.fetch({
                data: {
                    viewType   : 'form',
                    id         : id,
                    currentDb  : App.currentDb,
                    forSales   : 'false',
                    contentType: self.contentType
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
        },

        deleteItemsRender: function (deleteCounter, deletePage) {
            dataService.getData('/Invoice/totalCollectionLength', {
                filter       : this.filter,
                newCollection: this.newCollection
            }, function (response, context) {
                context.listLength = response.count || 0;
            }, this);
            this.deleteRender(deleteCounter, deletePage, {
                filter          : this.filter,
                newCollection   : this.newCollection,
                parrentContentId: this.parrentContentId
            });
            if (deleteCounter !== this.collectionLength) {
                var holder = this.$el;
                var created = holder.find('#timeRecivingDataFromServer');
                created.before(new ListItemView({
                    collection : this.collection,
                    page       : holder.find('#currentShowPage').val(),
                    itemsNumber: holder.find('span#itemsNumber').text()
                }).render());
            }

            var pagenation = this.$el.find('.pagination');
            if (this.collection.length === 0) {
                pagenation.hide();
            } else {
                pagenation.show();
            }
        }

    });

    return InvoiceListView;
});

