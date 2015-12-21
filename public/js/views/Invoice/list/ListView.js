define([
        'views/listViewBase',
        'text!templates/Invoice/list/ListHeader.html',
        'text!templates/stages.html',
        'views/Invoice/CreateView',
        'views/Invoice/EditView',
        'models/InvoiceModel',
        'views/Invoice/list/ListItemView',
        'views/Order/list/ListTotalView',
        'collections/Invoice/filterCollection',
        'views/Filter/FilterView',
        'common',
        'dataService'
    ],

    function (listViewBase, listTemplate, stagesTemplate, CreateView, editView, invoiceModel, listItemView, listTotalView, contentCollection, filterView, common, dataService) {
        var InvoiceListView = listViewBase.extend({
            createView              : CreateView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            filterView              : filterView,
            totalCollectionLengthUrl: '/Invoice/totalCollectionLength',
            contentType             : 'Invoice', //

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.collection.unbind();
                _.bind(this.collection.showMore, this.collection);
                this.parrentContentId = options.collection.parrentContentId;
                this.filter = options.filter ? options.filter : {};
                this.sort = options.sort;
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;
                this.forSales = false;
                this.filter = {'forSales': {key: 'forSales', value: ['false']}};

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
                this.stages = [];
            },

            events: {
                "click .stageSelect"           : "showNewSelect",
                "click  .list td:not(.notForm)": "goToEditDialog",
                "click .newSelectList li"      : "chooseOption"
            },

            chooseOption: function (e) {
                var self = this;
                var target$ = $(e.target);
                var targetElement = target$.parents("td");
                var id = targetElement.attr("id");
                var status = target$.attr("data-status");
                var model = this.collection.get(id);

                model.save({
                    workflow: {
                        _id   : target$.attr("id"),
                        name  : target$.text(),
                        status: status
                    }
                }, {
                    headers : {
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

            showNewSelect: function (e) {
                if ($(".newSelectList").is(":visible")) {
                    this.hideNewSelect();

                    return false;
                } else {
                    $(e.target).parent().append(_.template(stagesTemplate, {
                        stagesCollection: this.stages
                    }));
                    return false;
                }
            },

            hideNewSelect: function (e) {
                $(".newSelectList").remove();
            },

            render: function () {
                var self;
                var $currentEl;
                var itemView;

                $('.ui-dialog ').remove();

                self = this;
                $currentEl = this.$el;
                $currentEl.html('');

                $currentEl.append(_.template(listTemplate, {currentDb: App.weTrack}));
                itemView = new listItemView({
                    collection : self.collection,
                    page       : self.page,
                    itemsNumber: self.collection.namberToShow
                });

                itemView.bind('incomingStages', this.pushStages, this);

                $currentEl.append(itemView.render());

                $currentEl.append(new listTotalView({element: this.$el.find("#listTable"), cellSpan: 7}).render());

                this.renderCheckboxes();

                this.renderPagination($currentEl, this);

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                dataService.getData("/workflow/fetch", {
                    wId         : 'Purchase Invoice',
                    source      : 'purchase',
                    targetSource: 'invoice'
                }, function (stages) {
                    self.stages = stages;

                    dataService.getData('/invoice/getFilterValues', null, function (values) {
                        self.renderFilter(self, stages, values);
                    })

                });
            },

            goToEditDialog: function (e) {
                var self = this;

                e.preventDefault();
                var id = $(e.target).closest('tr').data("id");
                var model = new invoiceModel({validate: false});
                model.urlRoot = '/Invoice/form';
                model.fetch({
                    data   : {
                        id      : id,
                        forSales: self.forSales
                    },
                    success: function (model) {
                        new editView({model: model});
                    },
                    error  : function () {
                        alert('Please refresh browser');
                    }
                });
            },

            renderFilter: function (self, stages, values) {
                self.filterView = new this.filterView({collection: stages, customCollection: values});

                self.filterView.bind('filter', function (filter) {
                    filter.forSales = {key: 'forSales', value: false};
                    self.showFilteredPage(filter, self)
                });
                self.filterView.bind('defaultFilter', function () {
                    filter.forSales = {key: 'forSales', value: false};
                    self.showFilteredPage({}, self);
                });

                //self.filterView.render();

            },

            deleteItemsRender: function (deleteCounter, deletePage) {
                var holder = this.$el;
                var pagenation = holder.find('.pagination');
                var created;

                dataService.getData('/Invoice/totalCollectionLength', {
                    forSales     : this.forSales,
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

                    created = holder.find('#timeRecivingDataFromServer');
                    created.before(new listItemView({
                        collection : this.collection,
                        page       : holder.find("#currentShowPage").val(),
                        itemsNumber: holder.find("span#itemsNumber").text()
                    }).render());//added two parameters page and items number
                }

                holder.append(new listTotalView({element: holder.find("#listTable"), cellSpan: 7}).render());

                //this.recalculateTotal();   //-----------------------------!
                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
            }

        });
        return InvoiceListView;
    });
