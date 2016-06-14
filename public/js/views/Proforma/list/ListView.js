define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/salesInvoices/list/ListHeader.html',
    'text!templates/stages.html',
    'views/salesInvoices/CreateView',
    'views/salesInvoices/EditView',
    'models/InvoiceModel',
    'views/salesInvoices/list/ListItemView',
    'collections/salesInvoices/filterCollection',
    'common',
    'dataService',
    'constants'
], function ($, _, listViewBase, listTemplate, stagesTemplate, CreateView, editView, InvoiceModel, ListItemView, contentCollection, common, dataService, CONSTANTS) {
    var InvoiceListView = listViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : 'Proforma',
        changedModels    : {},

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.filter = options.filter ? options.filter : {};
            this.filter.forSales = {key: 'forSales', value: [true]};
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;

            this.render();

            this.contentCollection = contentCollection;
            this.stages = [];
        },

        events: {
            'click  .list tbody td:not(.notForm, .validated)': 'goToEditDialog'
        },

        saveItem: function () {
            var model;
            var self = this;
            var keys = Object.keys(this.changedModels);
            var i;
            var id;

            for (i = keys.length - 1; i >= 0; i--) {
                id = keys[i];
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

            this.changedModels = {};
        },

        chooseOption: function (e) {
            var self = this;
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

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');

            currentEllistRenderer(self);

            self.renderPagination($currentEl, self);
            self.renderFilter(self, {name: 'forSales', value: {key: 'forSales', value: [true]}});

            dataService.getData(CONSTANTS.WORKFLOWS_FETCH, {
                wId         : 'Sales Invoice',
                source      : 'purchase',
                targetSource: 'invoice'
            }, function (stages) {
                self.stages = stages;
            });

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

            function currentEllistRenderer(self) {
                var itemView;

                $currentEl.append(_.template(listTemplate, {currentDb: App.weTrack}));
                itemView = new ListItemView({
                    collection : self.collection,
                    page       : self.page,
                    itemsNumber: self.collection.namberToShow
                });
                itemView.bind('incomingStages', self.pushStages, self);

                $currentEl.append(itemView.render());

            }

        },

        goToEditDialog: function (e) {

            var id = $(e.target).closest('tr').data('id');
            var model = new InvoiceModel({validate: false});

            e.preventDefault();

            model.urlRoot = '/Invoices';
            model.fetch({
                data: {
                    id       : id,
                    viewType : 'form',
                    currentDb: App.currentDb
                },

                success: function (model) {
                    return new editView({model: model});
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

