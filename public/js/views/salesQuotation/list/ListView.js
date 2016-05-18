define([
        'views/listViewBase',
        'text!templates/salesQuotation/list/ListHeader.html',
        'text!templates/salesQuotation/wTrack/ListHeader.html',
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
        'constants',
        'helpers'
    ],

    function (listViewBase, listTemplate, listForWTrack, stagesTemplate, createView, listItemView, listTotalView, editView, currentModel, contentCollection, filterView, common, dataService, CONSTANTS, helpers) {
        var QuotationListView = listViewBase.extend({
            createView              : createView,
            listTemplate            : listTemplate,
            listItemView            : listItemView,
            contentCollection       : contentCollection,
            contentType             : CONSTANTS.SALESQUOTATION, //needs in view.prototype.changeLocationHash
            viewType                : 'list',//needs in view.prototype.changeLocationHash
            totalCollectionLengthUrl: '/quotation/totalCollectionLength',
            filterView              : filterView,

            events: {
                "click .stageSelect"                 : "showNewSelect",
                "click  .list tbody td:not(.notForm)": "goToEditDialog",
                "click .newSelectList li"            : "chooseOption"
            },

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;

                this.filter = options.filter ? options.filter : {};
                //this.filter.forSales = true;
                this.filter.forSales = {
                    key  : 'forSales',
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
                this.stages = [];
            },

            recalcTotal: function () {
                var total = 0;

                _.each(this.collection.toJSON(), function (model) {
                    total += parseFloat(model.paymentInfo.total);
                });

                this.$el.find('#total').text(helpers.currencySplitter(total.toFixed(2)));
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
                    key  : 'forSales',
                    value: ['true']
                };

                context.changeLocationHash(1, itemsNumber, filter);
                context.collection.showMore({count: itemsNumber, page: 1, filter: filter});
                context.getTotalLength(null, itemsNumber, filter);
            },

            chooseOption: function (e) {
                var self = this;
                var target$ = $(e.target);
                var targetElement = target$.parents("td");
                var id = targetElement.attr("id");
                var model = this.collection.get(id);

                model.save({
                    workflow: {
                        _id : target$.attr("id"),
                        name: target$.text()
                    }
                }, {
                    headers : {
                        mid: 55
                    },
                    patch   : true,
                    validate: false,
                    waite   : true,
                    success : function () {
                        self.showFilteredPage({}, self);
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
                var FilterView = filterView;
                var templ;

                $('.ui-dialog ').remove();

                self = this;
                $currentEl = this.$el;

                $currentEl.html('');

                templ = _.template(listForWTrack);
                $currentEl.append(templ);
                $currentEl.append(new listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());//added two parameters page and items number

                $currentEl.append(new listTotalView({
                    element : $currentEl.find("#listTable"),
                    cellSpan: 5
                }).render());

                this.renderCheckboxes();
                this.renderPagination($currentEl, this);
                this.renderFilter(self);

                $currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

                dataService.getData("/workflow/fetch", {
                    wId         : 'Sales Order',
                    source      : 'purchase',
                    targetSource: 'quotation'
                }, function (stages) {
                    self.stages = stages;
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
                        App.render({
                            type: 'error',
                            message: "Please refresh browser"
                        });
                    }
                });
            }

        });

        return QuotationListView;
    });
