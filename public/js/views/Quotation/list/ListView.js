define([
        'jQuery',
        'Underscore',
        'views/listViewBase',
        'text!templates/Quotation/list/ListHeader.html',
        'text!templates/stages.html',
        'views/Quotation/CreateView',
        'views/Quotation/list/ListItemView',
        'views/Order/list/ListTotalView',
        'views/Quotation/EditView',
        'models/QuotationModel',
        'collections/Quotation/filterCollection',
        'views/Filter/FilterView',
        'dataService',
        'constants'
    ],

    function ($, _, listViewBase, listTemplate, stagesTemplate, createView, listItemView, ListTotalView, EditView, CurrentModel, contentCollection, filterView, dataService, CONSTANTS) {
        'use strict';

        var QuotationListView = listViewBase.extend({
            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            contentType             : 'Quotation',//needs in view.prototype.changeLocationHash
            viewType                : 'list',//needs in view.prototype.changeLocationHash
            totalCollectionLengthUrl: '/quotation/totalCollectionLength',
            filterView              : filterView,

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.filter = options.filter || {};
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
            },

            showNewSelect: function (e) {
                if ($(".newSelectList").is(":visible")) {
                    this.hideNewSelect();
                    return false;
                }
                $(e.target).parent().append(_.template(stagesTemplate, {stagesCollection: this.stages}));
                return false;

            },

            hideNewSelect: function () {
                $(".newSelectList").remove();
            },

            render: function () {
                var self;
                var $currentEl;
                $('.ui-dialog ').remove();

                self = this;
                $currentEl = this.$el;

                $currentEl.html('');
                $currentEl.append(_.template(this.listTemplate));
                $currentEl.append(new this.listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());//added two parameters page and items number

                $currentEl.append(new ListTotalView({element: $currentEl.find("#listTable"), cellSpan: 5}).render());

                this.renderCheckboxes();
                this.renderPagination($currentEl, this);

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                this.renderFilter(self);

                dataService.getData(CONSTANTS.URLS.WORKFLOWS_FETCH, {
                    wId         : 'Purchase Order',
                    source      : 'purchase',
                    targetSource: 'quotation'
                }, function (stages) {
                    self.stages = stages;
                });
            },

            goToEditDialog: function (e) {
                e.preventDefault();

                var id = $(e.target).closest("tr").data("id");
                var model = new CurrentModel({validate: false});

                model.urlRoot = '/quotation/form/' + id;
                model.fetch({
                    success: function (model) {
                        new EditView({model: model});
                    },
                    error  : function () {
                        App.render({
                            type   : 'error',
                            message: "Please refresh browser"
                        });
                    }
                });
            }
        });
        return QuotationListView;
    });
