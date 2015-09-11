define([
        'text!templates/Pagination/PaginationTemplate.html',
        'text!templates/JobPositions/list/ListHeader.html',
        'views/JobPositions/CreateView',
        'views/JobPositions/list/ListItemView',
        'collections/JobPositions/filterCollection',
        'models/JobPositionsModel',
        'views/JobPositions/EditView',
        //'views/Filter/FilterView',
        'common',
        'dataService',
        'text!templates/stages.html'
    ],

    function (paginationTemplate, listTemplate, createView, listItemView, contentCollection, currentModel, editView,/* filterView, */common, dataService, stagesTamplate) {
        var JobPositionsListView = Backbone.View.extend({
            el: '#content-holder',
            defaultItemsNumber: null,
            listLength: null,
            sort: null,
            newCollection: null,
            page: null,
            contentType: 'JobPositions',
            viewType: 'list',

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.newCollection = options.newCollection;
                this.page = options.collection.page;
                this.filter = options.filter;

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
            },

            events: {
                "click .itemsNumber": "switchPageCounter",
                "click .showPage": "showPage",
                "change #currentShowPage": "showPage",
                "click #previousPage": "previousPage",
                "click #nextPage": "nextPage",
                "click .checkbox": "checked",
                "click  .list td:not(.notForm)": "goToEditDialog",
                "mouseover .currentPageList": "itemsNumber",
                "click": "hideItemsNumber",
                "click .oe_sortable": "goSort",
                "click .stageSelect": "showNewSelect",
                "click .newSelectList li": "chooseOption",
                "click #firstShowPage": "firstPage",
                "click #lastShowPage": "lastPage",
                "click .saveFilterButton": "saveFilter",
                "click .removeFilterButton": "removeFilter"

            },

            hideNewSelect: function (e) {
                $(".newSelectList").hide();
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

            chooseOption: function (e) {
                var afterPage = '';
                var location = window.location.hash;
                var pageSplited = location.split('/p=')[1];
                if (pageSplited) {
                    afterPage = pageSplited.split('/')[1];
                    location = location.split('/p=')[0] + '/p=1' + '/' + afterPage;
                }
                var targetElement = $(e.target).parents("td");
                var id = targetElement.attr("id").replace("stages_", '');
                var obj = this.collection.get(id);
                obj.urlRoot = '/JobPositions';
                obj.save({
                    workflow: $(e.target).attr("id"),
                    expectedRecruitment: obj.toJSON().expectedRecruitment,
                    totalForecastedEmployees: obj.toJSON().totalForecastedEmployees,
                    numberOfEmployees: obj.toJSON().numberOfEmployees
                }, {
                    headers: {
                        mid: 39
                    },
                    patch: true,
                    success: function (err, model) {
                        Backbone.history.fragment = "";
                        Backbone.history.navigate(location, { trigger: true });
                    }
                });
                this.hideNewSelect();
                return false;
            },

            pushStages: function (stages) {
                this.stages = stages;
            },

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new contentCollection({
                    viewType: 'list',
                    sort: sortObject,
                    page: this.page,
                    count: this.defaultItemsNumber,
                    filter: this.filter,
                    parrentContentId: this.parrentContentId,
                    contentType: this.contentType,
                    newCollection: this.newCollection
                });
                this.collection.bind('reset', this.renderContent, this);
                this.collection.bind('showmore', this.showMoreContent, this);
            },

            renderContent: function () {
                var currentEl = this.$el;
                var tBody = currentEl.find('#listTable');
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                tBody.empty();
                var itemView = new listItemView({ collection: this.collection, page: currentEl.find("#currentShowPage").val(), itemsNumber: currentEl.find("span#itemsNumber").text() });
                tBody.append(itemView.render());
                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
            },

            goSort: function (e) {
                this.collection.unbind('reset');
                this.collection.unbind('showmore');
                var target$ = $(e.target);
                var currentParrentSortClass = target$.attr('class');
                var sortClass = currentParrentSortClass.split(' ')[1];
                var sortConst = 1;
                var sortBy = target$.data('sort');
                var sortObject = {};
                if (!sortClass) {
                    target$.addClass('sortDn');
                    sortClass = "sortDn";
                }
                switch (sortClass) {
                    case "sortDn":
                    {
                        target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortDn').addClass('sortUp');
                        sortConst = 1;
                    }
                        break;
                    case "sortUp":
                    {
                        target$.parent().find("th").removeClass('sortDn').removeClass('sortUp');
                        target$.removeClass('sortUp').addClass('sortDn');
                        sortConst = -1;
                    }
                        break;
                }
                sortObject[sortBy] = sortConst;
                this.fetchSortCollection(sortObject);
                this.changeLocationHash(1, this.defaultItemsNumber);
                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
            },

            hideItemsNumber: function (e) {
                var el = e.target;

                this.$el.find(".allNumberPerPage, .newSelectList").hide();
                if (!el.closest('.search-view')) {
                    $('.search-content').removeClass('fa-caret-up');
                };
            },

            itemsNumber: function (e) {
                $(e.target).closest("button").next("ul").toggle();
                return false;
            },

            getTotalLength: function (currentNumber, itemsNumber, filter) {
                dataService.getData('/totalCollectionLength/JobPositions', {
                    currentNumber: currentNumber,
                    filter: filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    var page = context.page || 1;
                    var length = context.listLength = response.count || 0;
                    if (itemsNumber * (page - 1) > length) {
                        context.page = page = Math.ceil(length / itemsNumber);
                        context.fetchSortCollection(context.sort);
                        context.changeLocationHash(page, context.defaultItemsNumber);
                    }
                    context.pageElementRender(response.count, itemsNumber, page);//prototype in main.js
                }, this);
            },

            showFilteredPage: function () {
                var itemsNumber = $("#itemsNumber").text();
                var self = this;
                var chosen = this.$el.find('.chosen');
                var checkedElements = $('.drop-down-filter input:checkbox:checked');
                var condition = this.$el.find('.conditionAND > input')[0];
                var showList;

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                this.startTime = new Date();
               // this.newCollection = false;
                this.filter = {};
                this.filter['condition'] = 'and';

                if  (condition && !condition.checked) {
                    self.filter['condition'] = 'or';
                }

                if (chosen) {
                    chosen.each(function (index, elem) {
                        if (self.filter[elem.children[1].value]) {
                            $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
                                self.filter[elem.children[1].value].push($(element).next().text());
                            })
                        } else {
                            self.filter[elem.children[1].value] = [];
                            $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
                                self.filter[elem.children[1].value].push($(element).next().text());
                            })
                        }
                    });
                }

                this.changeLocationHash(1, itemsNumber, this.filter);
                this.collection.showMore({ count: itemsNumber, page: 1, filter: this.filter, newCollection: true });
                this.getTotalLength(null, itemsNumber, this.filter);

            },

            render: function () {
                $('.ui-dialog ').remove();
                var self = this;
                var currentEl = this.$el;
                var FilterView;

                currentEl.html('');
                currentEl.append(_.template(listTemplate));
                var itemView = new listItemView({ collection: this.collection, page: this.page, itemsNumber: this.collection.namberToShow });
                currentEl.append(itemView.render());
                itemView.bind('incomingStages', itemView.pushStages, itemView);

                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0)
                        $("#top-bar-deleteBtn").show();
                    else
                        $("#top-bar-deleteBtn").hide();
                });

                common.populateWorkflowsList("Job positions", null, null, "/Workflows", null, function (stages) {
                    self.stages = stages;
                    var stage = (self.filter) ? self.filter.workflow : null;
                    itemView.trigger('incomingStages', stages);

                    //dataService.getData('/jobPosition/getFilterValues', null, function (values) {
                    //   // FilterView = new filterView({ collection: stages, customCollection: values});
                    //    // Filter custom event listen ------begin
                    //    FilterView.bind('filter', function () {
                    //        self.showFilteredPage()
                    //    });
                    //    FilterView.bind('defaultFilter', function () {
                    //        self.showFilteredPage();
                    //    });
                    //    // Filter custom event listen ------end
                    //});
                });

                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });

                currentEl.append(_.template(paginationTemplate));

                var pagenation = this.$el.find('.pagination');

                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
                currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            previousPage: function (event) {
                event.preventDefault();
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                this.prevP({
                    sort: this.sort,
                    newCollection: this.newCollection,
                });
                dataService.getData('/totalCollectionLength/JobPositions', {
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            nextPage: function (event) {
                event.preventDefault();
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                this.nextP({
                    sort: this.sort,
                    newCollection: this.newCollection
                });
                dataService.getData('/totalCollectionLength/JobPositions', {
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            firstPage: function (event) {
                event.preventDefault();
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                this.firstP({
                    sort: this.sort,
                    newCollection: this.newCollection
                });
                dataService.getData('/totalCollectionLength/JobPositions', {
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            lastPage: function (event) {
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                event.preventDefault();
                this.lastP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/totalCollectionLength/JobPositions', {
                    sort: this.sort,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            switchPageCounter: function (event) {
                event.preventDefault();
                this.startTime = new Date();
                var itemsNumber = event.target.textContent;
                this.defaultItemsNumber = itemsNumber;
                this.getTotalLength(null, itemsNumber, this.filter);
                this.collection.showMore({
                    count: itemsNumber,
                    page: 1,
                    newCollection: this.newCollection
                });
                this.page = 1;
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                this.changeLocationHash(1, itemsNumber)
            },

            showPage: function (event) {
                event.preventDefault();
                this.showP(event, { newCollection: this.newCollection, sort: this.sort });
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;
                holder.find("#listTable").empty();
                holder.append(new listItemView({ collection: newModels, page: holder.find("#currentShowPage").val(), itemsNumber: holder.find("span#itemsNumber").text() }).render());
                var pagenation = holder.find('.pagination');
                if (newModels.length !== 0) {
                    pagenation.show();
                } else {
                    pagenation.hide();
                }
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            goToEditDialog: function (e) {
                e.preventDefault();
                var id = $(e.target).closest('tr').data("id");
                var model = new currentModel({ validate: false });
                model.urlRoot = '/JobPositions/form';
                model.fetch({
                    data: { id: id },
                    success: function (model) {
                        new editView({ model: model });
                    },
                    error: function () {
                        alert('Please refresh browser');
                    }
                });
            },

            createItem: function () {
                new createView();
            },

            checked: function () {
                if (this.collection.length > 0) {
                    var checkLength = $("input.checkbox:checked").length;

                    if ($("input.checkbox:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                        $('#check_all').prop('checked', false);

                        if (checkLength == this.collection.length) {
                            $('#check_all').prop('checked', true);
                        }
                    }
                    else {
                        $("#top-bar-deleteBtn").hide();
                        $('#check_all').prop('checked', false);
                    }
                }
            },

            deleteItemsRender: function (deleteCounter, deletePage) {
                dataService.getData('/totalCollectionLength/JobPositions', {
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
                this.deleteRender(deleteCounter, deletePage, {
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
            },

            deleteItems: function () {
                var that = this;
                var mid = 39;
                var model;
                var localCounter = 0;
                var count = $("#listTable input:checked").length;
                this.collectionLength = this.collection.length;
                $.each($("#listTable input:checked"), function (index, checkbox) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        success: function () {
                            that.listLength--;
                            localCounter++;
                            count--;
                            if (count === 0) {
                                that.deleteCounter = localCounter;
                                that.deletePage = $("#currentShowPage").val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);
                            }
                        },
                        error: function (model, res) {
                            if (res.status === 403 && index === 0) {
                                alert("You do not have permission to perform this action");
                            }
                            that.listLength--;
                            count--;
                            if (count === 0) {
                                that.deleteCounter = localCounter;
                                that.deletePage = $("#currentShowPage").val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);

                            }
                        }
                    });
                });
            }
        });
        return JobPositionsListView;
    });
