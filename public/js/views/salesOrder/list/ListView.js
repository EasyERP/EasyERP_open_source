define([
        'views/listViewBase',
        'text!templates/salesQuotation/list/ListHeader.html',
        'text!templates/salesOrder/wTrack/ListHeader.html',
        'text!templates/stages.html',
        'views/salesQuotation/CreateView',
        'views/salesOrder/list/ListItemView',
        'views/supplierPayments/list/ListTotalView',
        'views/salesOrder/EditView',
        'models/QuotationModel',
        'collections/salesQuotation/filterCollection',
        'views/Filter/FilterView',
        'common',
        'dataService'
    ],

    function (listViewBase, listTemplate, listForWTrack, stagesTamplate, createView, listItemView, listTotalView, editView, quotationModel, contentCollection, filterView, common, dataService) {
        var OrdersListView = listViewBase.extend({

            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            filterView              : filterView,
            contentType: 'salesOrder',//needs in view.prototype.changeLocationHash
            totalCollectionLengthUrl:'/order/totalCollectionLength',

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;

                this.filter = options.filter ? options.filter : {};
                this.filter.forSales = {
                    key: 'forSales',
                    value: ['true']
                };

                this.sort = options.sort;
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
            },

            showFilteredPage: function (filter, context) {
                var itemsNumber = $("#itemsNumber").text();

                var alphaBet = this.$el.find('#startLetter');
                var selectedLetter = $(alphaBet).find('.current').length ? $(alphaBet).find('.current')[0].text : '';

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                if (selectedLetter === "All") {
                    selectedLetter = '';
                }

                context.startTime = new Date();
                context.newCollection = false;

                this.filter = Object.keys(filter).length === 0 ? {} : filter;

                this.filter.forSales = {
                    key: 'forSales',
                    value: ['true']
                };

                context.changeLocationHash(1, itemsNumber, filter);
                context.collection.showMore({count: itemsNumber, page: 1, filter: filter});
                context.getTotalLength(null, itemsNumber, filter);
            },

            events: {

                "click .stageSelect": "showNewSelect",
                "click  .list tbody td:not(.notForm)": "goToEditDialog",
                "click .newSelectList li": "chooseOption"
            },

            chooseOption: function (e) {
                var self = this;
                var target$ = $(e.target);
                var targetElement = target$.parents("td");
                var id = targetElement.attr("id");
                var model = this.collection.get(id);

                model.save({ workflow: {
                    _id: target$.attr("id"),
                    name:target$.text()
                } }, {
                    headers:
                    {
                        mid: 55
                    },
                    patch: true,
                    validate: false,
                    success: function () {
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
                    $(e.target).parent().append(_.template(stagesTamplate, { stagesCollection: this.stages }));
                    return false;
                }
            },

            hideNewSelect: function (e) {
                $(".newSelectList").remove();
            },

            render: function () {
                var self;
                var currentEl;

                $('.ui-dialog ').remove();

                self = this;
                currentEl = this.$el;

                currentEl.html('');
                if (App.weTrack) {
                    currentEl.append(_.template(listForWTrack));
                    currentEl.append(new listItemView({
                        collection: this.collection,
                        page: this.page,
                        itemsNumber: this.collection.namberToShow
                    }).render());
                }else {
                    currentEl.append(_.template(listTemplate));
                    currentEl.append(new listItemView({
                        collection: this.collection,
                        page: this.page,
                        itemsNumber: this.collection.namberToShow
                    }).render());
                }
                //added two parameters page and items number
                currentEl.append(new listTotalView({element: this.$el.find("#listTable"), cellSpan: 5}).render());

                this.renderCheckboxes();
                this.renderPagination(currentEl, this);
                this.renderFilter(self);

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                dataService.getData("/workflow/fetch", {
                    wId: 'Sales Order',
                    source: 'purchase',
                    targetSource: 'order'
                }, function (stages) {
                    self.stages = stages;
                });
            },

            goToEditDialog: function (e) {
                e.preventDefault();

                var id = $(e.target).closest('tr').data("id");
                var model = new quotationModel({ validate: false });

                model.urlRoot = '/Order/form/' + id;
                model.fetch({
                    data: {contentType: this.contentType},
                    success: function (model) {
                        new editView({ model: model });
                    },
                    error: function () {
                        alert('Please refresh browser');
                    }
                });
            }

      });

        return OrdersListView;
    });
