define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/salesInvoices/list/ListHeader.html',
    'text!templates/stages.html',
    'views/salesInvoices/CreateView',
    'views/salesInvoices/EditView',
    'views/Proforma/EditView',
    'models/InvoiceModel',
    'views/salesInvoices/list/ListItemView',
    'collections/salesInvoices/filterCollection',
    'common',
    'dataService',
    'constants',
    'helpers'
], function (Backbone,
             $,
             _,
             listViewBase,
             listTemplate,
             stagesTemplate,
             CreateView,
             EditView,
             proformaEditView,
             InvoiceModel,
             ListItemView,
             contentCollection,
             common,
             dataService,
             CONSTANTS,
             helpers) {
    var InvoiceListView = listViewBase.extend({
        CreateView       : CreateView,
        listTemplate     : listTemplate,
        ListItemView     : ListItemView,
        contentCollection: contentCollection,
        contentType      : 'proforma',
        changedModels    : {},
        hasPagination    : true,
        viewType         : 'list',

        initialize: function (options) {
            this.formUrl = 'easyErp/' + this.contentType + '/tform/';
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.filter = options.filter ? options.filter : {};
            this.forSales = options.forSales || false;
            this.filter.forSales = {key: 'forSales', value: [this.forSales], type: 'boolean'};
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;

            this.baseFilter = {
                name : 'forSales',
                value: {
                    key  : 'forSales',
                    type : 'boolean',
                    value: [this.forSales]
                }
            };

            options.filter = this.filter;

            listViewBase.prototype.initialize.call(this, options);

            this.contentCollection = contentCollection;
            this.stages = [];
        },

        events: {},

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

        recalcTotal: function () {
            var self = this;
            var columns = ['balance', 'total', 'paid'];

            _.each(columns, function (col) {
                var sum = 0;

                _.each(self.collection.toJSON(), function (model) {
                    if (col === 'paid') {
                        if (model.currency && model.currency.rate) {
                            sum += parseFloat(model[col] / model.currency.rate);
                        } else {
                            sum += parseFloat(model[col]);
                        }
                    } else if (model.workflow.name !== 'Cancelled') {
                        if (model.currency && model.currency.rate) {
                            sum += parseFloat(model.paymentInfo[col] / model.currency.rate);
                        } else {
                            sum += parseFloat(model.paymentInfo[col]);
                        }
                    }
                });

                self.$el.find('#' + col).text(helpers.currencySplitter(sum.toFixed(2)));
            });
        },

        render: function () {
            var self;
            var $currentEl;
            var wId = this.forSales ? 'Sales Invoice' : 'Purchase Invoice';

            $('.ui-dialog ').remove();

            self = this;
            $currentEl = this.$el;

            $currentEl.html('');

            currentEllistRenderer(self);

            dataService.getData(CONSTANTS.WORKFLOWS_FETCH, {
                wId         : wId,
                source      : 'purchase',
                targetSource: 'invoice'
            }, function (stages) {
                self.stages = stages;
            });

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

            this.recalcTotal();

        },

        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var page = this.collection.currentPage;
            var countPerPage = this.collection.pageSize;
            var url = this.formUrl + id + '/p=' + page + '/c=' + countPerPage;

            if (this.filter) {
                url += '/filter=' + encodeURI(JSON.stringify(this.filter));
            }

            App.ownContentType = true;
            Backbone.history.navigate(url, {trigger: true});
        }

        /*goToEditDialog: function (e) {
         var self = this;
         var id = $(e.target).closest('tr').data('id');
         var model = new InvoiceModel({validate: false});
         var editView = this.forSales ? EditView : proformaEditView;

         e.preventDefault();

         model.urlRoot = '/invoices/';
         model.fetch({
         data: {
         id       : id,
         currentDb: App.currentDb,
         viewType : 'form',
         forSales : self.forSales
         },

         success: function (model) {
         return new editView({model: model, forSales: self.forSales});
         },

         error: function () {
         App.render({
         type   : 'error',
         message: 'Please refresh browser'
         });
         }
         });
         }*/

    });

    return InvoiceListView;
});

