define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/listViewBase',
    'text!templates/salesProforma/list/ListHeader.html',
    'text!templates/stages.html',
    'views/salesInvoice/CreateView',
    'views/Proforma/EditView',
    'models/InvoiceModel',
    'views/salesProforma/list/ListItemView',
    'views/salesProforma/list/ListTotalView',
    'collections/salesProforma/filterCollection',
    'views/Filter/FilterView',
    'common',
    'dataService',
    'constants'
], function ($,
             _,
             Backbone,
             listViewBase,
             listTemplate,
             stagesTemplate,
             CreateView,
             EditView,
             invoiceModel,
             listItemView,
             listTotalView,
             contentCollection,
             FilterView,
             common,
             dataService,
             CONSTANTS) {
    var InvoiceListView = listViewBase.extend({
        createView              : CreateView,
        listTemplate            : listTemplate,
        listItemView            : listItemView,
        contentCollection       : contentCollection,
        FilterView              : FilterView,
        totalCollectionLengthUrl: '/Proforma/totalCollectionLength',
        contentType             : CONSTANTS.SALESPROFORMA, // 'salesProforma', //'Invoice',//needs in view.prototype.changeLocationHash
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
            this.stages = [];
        },

        events: {
            'click .stageSelect'                             : 'showNewSelect',
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

        showNewSelect: function (e) {
            if ($('.newSelectList').is(':visible')) {
                this.hideNewSelect();
                return false;
            } else {
                $(e.target).parent().append(_.template(stagesTemplate, {stagesCollection: this.stages}));
                return false;
            }
        },

        hideNewSelect: function (e) {
            $('.newSelectList').remove();
        },

        currentEllistRenderer: function (self) {
            var $currentEl = self.$el;
            var itemView;

            $currentEl.append(_.template(listTemplate, {currentDb: App.weTrack}));
            itemView = new listItemView({
                collection : self.collection,
                page       : self.page,
                itemsNumber: self.collection.namberToShow
            });
            itemView.bind('incomingStages', self.pushStages, self);

            $currentEl.append(itemView.render());

        },

        render: function () {
            var self = this;
            var $currentEl;

            $('.ui-dialog ').remove();


            $currentEl = this.$el;

            $currentEl.html('');

            this.currentEllistRenderer(self);

            /* if (!App || !App.currentDb) {
             dataService.getData('/currentDb', null, function (response) {
             if (response && !response.error) {
             App.currentDb = response;
             App.weTrack = true;
             }

             this.currentEllistRenderer(self);
             });
             } else {
             }*/

            $currentEl.append(new listTotalView({element: this.$el.find('#listTable'), cellSpan: 7}).render());

                self.renderPagination($currentEl, self);
                self.renderFilter(self, {name: 'forSales', value: {key: 'forSales', value: [true]}});

            dataService.getData(CONSTANTS.WORKFLOWS_FETCH, {
                wId         : 'Sales Invoice',
                source      : 'purchase',
                targetSource: 'invoice'
            }, function (stages) {
                self.stages = stages;
            });


            $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
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
        },

        deleteItemsRender: function (deleteCounter, deletePage) {
            var pagenation;
            var holder;
            var created;

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
                holder = this.$el;
                created = holder.find('#timeRecivingDataFromServer');
                created.before(new listItemView({
                    collection : this.collection,
                    page       : holder.find('#currentShowPage').val(),
                    itemsNumber: holder.find('span#itemsNumber').text()
                }).render());
            }

            pagenation = this.$el.find('.pagination');
            if (this.collection.length === 0) {
                pagenation.hide();
            } else {
                pagenation.show();
            }
        }

    });

    return InvoiceListView;
});
