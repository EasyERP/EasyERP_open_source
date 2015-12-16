define([
        'views/listViewBase',
        'text!templates/Order/list/ListHeader.html',
        'text!templates/stages.html',
        'views/Quotation/CreateView',
        'views/Order/list/ListItemView',
        'views/Order/list/ListTotalView',
        'views/Order/EditView',
        'models/QuotationModel',
        'collections/Order/filterCollection',
        'views/Filter/FilterView',
        'common',
        'dataService'
    ],

    function (listViewBase, listTemplate, stagesTamplate, createView, listItemView, listTotalView, editView, quotationModel, contentCollection, filterView, common, dataService) {
        var OrdersListView = listViewBase.extend({
            createView              : createView,
            filterView              : filterView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            totalCollectionLengthUrl: '/order/totalCollectionLength',
            contentType             : 'Order',

            events: {
                "click .stageSelect"                : "showNewSelect",
                "click .list tbody td:not(.notForm)": "goToEditDialog",
                "click .newSelectList li"           : "chooseOption"
            },

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.filter = options.filter ? options.filter : {};
                this.filter.forSales = {
                    key  : 'forSales',
                    value: ['false']
                };
                this.forSales = false;
                this.sort = options.sort;
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
            }
            ,

            chooseOption: function (e) {
                var self = this;
                var target$ = $(e.target);
                var targetElement = target$.parents("td");
                var id = targetElement.attr("id");
                var model = this.collection.get(id);

                model.save({
                    workflow: target$.attr("id")
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
            }
            ,

            showNewSelect: function (e) {
                if ($(".newSelectList").is(":visible")) {
                    this.hideNewSelect();
                    return false;
                } else {
                    $(e.target).parent().append(_.template(stagesTamplate, {stagesCollection: this.stages}));
                    return false;
                }
            }
            ,

            hideNewSelect: function (e) {
                $(".newSelectList").remove();
            }
            ,

            render: function () {
                var self;
                var $currentEl;
                $('.ui-dialog ').remove();

                self = this;
                $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(_.template(listTemplate));
                $currentEl.append(new listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());//added two parameters page and items number
                $currentEl.append(new listTotalView({element: this.$el.find("#listTable"), cellSpan: 4}).render());

                this.renderCheckboxes();
                this.renderPagination($currentEl, this);
                this.renderFilter(self);

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                dataService.getData("/workflow/fetch", {
                    wId         : 'Purchase Order',
                    source      : 'purchase',
                    targetSource: 'order'
                }, function (stages) {
                    self.stages = stages;

                });
            },

            goToEditDialog: function (e) {
                e.preventDefault();

                var tr = $(e.target).closest('tr');
                var id = tr.data("id");
                var notEditable = tr.hasClass('notEditable');
                var model = new quotationModel({validate: false});

                if (notEditable) {
                    return false;
                }

                model.urlRoot = '/Order/form/' + id;
                model.fetch({
                    data   : {contentType: this.contentType},
                    success: function (model) {
                        new editView({model: model});
                    },
                    error  : function () {
                        alert('Please refresh browser');
                    }
                });
            }

        });
        return OrdersListView;
    })
;
