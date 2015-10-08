define([
        'views/listViewBase',
        'text!templates/salesQuotation/list/ListHeader.html',
        'text!templates/stages.html',
        'views/salesQuotation/CreateView',
        'views/salesQuotation/list/ListItemView',
        'views/supplierPayments/list/ListTotalView',
        'views/salesQuotation/EditView',
        'models/QuotationModel',
        'collections/salesQuotation/filterCollection',
        'views/Filter/FilterView',
        'common',
        'dataService',
        'constants'
    ],

    function (listViewBase, listTemplate, stagesTemplate, createView, listItemView, listTotalView, editView, currentModel, contentCollection, filterView, common, dataService, CONSTANTS) {
        var QuotationListView = listViewBase.extend({
            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            contentType             : CONSTANTS.SALESQUOTATION, //needs in view.prototype.changeLocationHash
            viewType                : 'list',//needs in view.prototype.changeLocationHash
            totalCollectionLengthUrl: '/quotation/totalCollectionLength',

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;

                this.filter = options.filter ? options.filter : {};
                this.filter.forSales = true;

                this.sort = options.sort;
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
                this.stages = [];
            },

            events: {
                "click .stageSelect"                 : "showNewSelect",
                "click  .list tbody td:not(.notForm)": "goToEditDialog",
                "click .newSelectList li"            : "chooseOption"
            },

            chooseOption: function (e) {
                var self = this;
                var target$ = $(e.target);
                var targetElement = target$.parents("td");
                var id = targetElement.attr("id");
                var model = this.collection.get(id);

                model.save({workflow: target$.attr("id")}, {
                    headers : {
                        mid: 55
                    },
                    patch   : true,
                    validate: false,
                    success : function () {
                        self.showFilteredPage();
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
                    $(e.target).parent().append(_.template(stagesTemplate, {stagesCollection: this.stages}));
                    return false;
                }
            },

            hideNewSelect: function (e) {
                $(".newSelectList").remove();
            },

            render: function () {
                var self;
                var currentEl;
                var FilterView = filterView;
                $('.ui-dialog ').remove();

                self = this;
                currentEl = this.$el;

                currentEl.html('');
                currentEl.append(_.template(listTemplate));
                currentEl.append(new listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());//added two parameters page and items number

                currentEl.append(new listTotalView({element: currentEl.find("#listTable"), cellSpan: 6}).render());

                this.renderCheckboxes();
                this.renderPagination(currentEl, this);

                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                dataService.getData("/workflow/fetch", {
                    wId         : 'Sales Order',
                    source      : 'purchase',
                    targetSource: 'quotation'
                }, function (stages) {
                    self.stages = stages;

                    dataService.getData('/quotation/getFilterValues', null, function (values) {
                        FilterView = new filterView({collection: stages, customCollection: values});
                        // Filter custom event listen ------begin
                        FilterView.bind('filter', function () {
                            //showList = $('.drop-down-filter input:checkbox:checked').map(function() {return this.value;}).get();
                            self.showFilteredPage()
                        });
                        FilterView.bind('defaultFilter', function () {
                            var showList = _.pluck(self.stages, '_id');
                            self.showFilteredPage(showList);
                        });
                        // Filter custom event listen ------end
                    })

                });
                return this
            },

            goToEditDialog: function (e) {
                e.preventDefault();

                var id = $(e.target).closest("tr").data("id");
                var model = new currentModel({validate: false});

                model.urlRoot = '/quotation/form/' + id;
                model.fetch({
                    success: function (model) {
                        new editView({model: model});
                    },
                    error  : function () {
                        alert('Please refresh browser');
                    }
                });
            }

        });

        return QuotationListView;
    });
