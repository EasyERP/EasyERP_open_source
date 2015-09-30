define([
        'text!templates/Pagination/PaginationTemplate.html',
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

    function (paginationTemplate, listTemplate, stagesTemplate, createView, editView, invoiceModel, listItemView, listTotalView, contentCollection, filterView, common, dataService) {
        var InvoiceListView = Backbone.View.extend({
            el                : '#content-holder',
            defaultItemsNumber: null,
            listLength        : null,
            filter            : null,
            sort              : null,
            newCollection     : null,
            page              : null, //if reload page, and in url is valid page
            contentType       : 'Invoice',//needs in view.prototype.changeLocationHash
            viewType          : 'list',//needs in view.prototype.changeLocationHash

            initialize: function (options) {
                this.startTime = options.startTime;
                this.collection = options.collection;
                _.bind(this.collection.showMore, this.collection);
                this.parrentContentId = options.collection.parrentContentId;
                this.filter = options.filter ? options.filter : {};
                this.sort = options.sort;
                this.defaultItemsNumber = this.collection.namberToShow || 100;
                this.newCollection = options.newCollection;
                this.deleteCounter = 0;
                this.page = options.collection.page;
                this.forSales = false;
                this.filter = {forSales: false};

                this.render();

                this.getTotalLength(null, this.defaultItemsNumber, this.filter);
                this.contentCollection = contentCollection;
                this.stages = [];
            },

            events: {
                "click .itemsNumber"           : "switchPageCounter",
                "click .showPage"              : "showPage",
                "change #currentShowPage"      : "showPage",
                "click #previousPage"          : "previousPage",
                "click #nextPage"              : "nextPage",
                "click .checkbox"              : "checked",
                "click .stageSelect"           : "showNewSelect",
                //"click  .list td:not(.notForm)": "gotoForm",
                "click  .list td:not(.notForm)": "goToEditDialog",
                "mouseover .currentPageList"   : "itemsNumber",
                "click"                        : "hideItemsNumber",
                "click #firstShowPage"         : "firstPage",
                "click #lastShowPage"          : "lastPage",
                "click .oe_sortable"           : "goSort",
                "click .newSelectList li"      : "chooseOption"
            },

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new contentCollection({
                    viewType        : 'list',
                    sort            : sortObject,
                    page            : this.page,
                    count           : this.defaultItemsNumber,
                    filter          : this.filter,
                    parrentContentId: this.parrentContentId,
                    contentType     : this.contentType,
                    newCollection   : this.newCollection
                });
                this.collection.bind('reset', this.renderContent, this);
                this.collection.bind('showmore', this.showMoreContent, this);
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
                    this.$el.find('.search-options').addClass('hidden');
                }
                ;
                //this.$el.find(".allNumberPerPage, .newSelectList").hide();
                //if (!el.closest('.search-view')) {
                //    $('.search-content').removeClass('fa-caret-up');
                //};
            },

            itemsNumber: function (e) {
                $(e.target).closest("button").next("ul").toggle();
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

            getTotalLength: function (currentNumber, itemsNumber, filter) {
                dataService.getData('/Invoice/totalCollectionLength', {
                    forSales     : this.forSales,
                    currentNumber: currentNumber,
                    filter       : filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    var page = context.page || 1;
                    var length = context.listLength = response.count || 0;

                    if (itemsNumber === 'all') {
                        itemsNumber = response.count;
                    }

                    if (itemsNumber * (page - 1) > length) {
                        context.page = page = Math.ceil(length / itemsNumber);
                        context.fetchSortCollection(context.sort);
                        context.changeLocationHash(page, context.defaultItemsNumber, filter);
                    }
                    context.pageElementRender(response.count, itemsNumber, page);//prototype in main.js
                }, this);
            },

            render: function () {
                $('.ui-dialog ').remove();
                var self = this;
                var currentEl = this.$el;
                var FilterView;

                currentEl.html('');
                currentEl.append(_.template(listTemplate));
                currentEl.append(new listItemView({
                    collection : this.collection,
                    page       : this.page,
                    itemsNumber: this.collection.namberToShow
                }).render());//added two parameters page and items number

                currentEl.append(new listTotalView({element: this.$el.find("#listTable"), cellSpan: 8}).render());
                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                    } else {
                        $("#top-bar-deleteBtn").hide();
                    }
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

                dataService.getData("/workflow/fetch", {
                    wId         : 'Purchase Invoice',
                    source      : 'purchase',
                    targetSource: 'invoice'
                }, function (stages) {
                    self.stages = stages;

                    dataService.getData('/invoice/getFilterValues', null, function (values) {
                        FilterView = new filterView({collection: stages, customCollection: values});
                        // Filter custom event listen ------begin
                        FilterView.bind('filter', function () {
                            self.showFilteredPage()
                        });
                        FilterView.bind('defaultFilter', function () {
                            self.showFilteredPage();
                        });
                        // Filter custom event listen ------end
                    })

                });
            },

            renderContent: function () {
                var currentEl = this.$el;
                var tBody = currentEl.find('#listTable');
                tBody.empty();
                var itemView = new listItemView({
                    collection : this.collection,
                    page       : currentEl.find("#currentShowPage").val(),
                    itemsNumber: currentEl.find("span#itemsNumber").text()
                });
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                tBody.append(itemView.render());

                currentEl.append(new listTotalView({element: tBody, cellSpan: 8}).render());

                //this.recalculateTotal();   //-----------------------------!

                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }

            },

            previousPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.prevP({
                    sort            : this.sort,
                    filter          : this.filter,
                    newCollection   : this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                dataService.getData('/Invoice/totalCollectionLength', {
                    forSales        : this.forSales,
                    filter          : this.filter,
                    newCollection   : this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
                //this.recalculate();
            },

            nextPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.nextP({
                    sort            : this.sort,
                    filter          : this.filter,
                    newCollection   : this.newCollection,
                    parrentContentId: this.parrentContentId

                });

                dataService.getData('/Invoice/totalCollectionLength', {
                    forSales        : this.forSales,
                    filter          : this.filter,
                    newCollection   : this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);

                //this.recalculate();
            },

            firstPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.firstP({
                    sort         : this.sort,
                    filter       : this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/Invoice/totalCollectionLength', {
                    forSales     : this.forSales,
                    filter       : this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            lastPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.lastP({
                    sort         : this.sort,
                    filter       : this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/Invoice/totalCollectionLength', {
                    forSales     : this.forSales,
                    filter       : this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },  //end first last page in paginations

            switchPageCounter: function (event) {
                event.preventDefault();
                this.startTime = new Date();
                var itemsNumber = event.target.textContent;

                if (itemsNumber === 'all') {
                    itemsNumber = this.listLength;
                }

                this.defaultItemsNumber = itemsNumber;
                this.getTotalLength(null, itemsNumber, this.filter);
                this.collection.showMore({
                    count        : itemsNumber,
                    page         : 1,
                    filter       : this.filter,
                    newCollection: this.newCollection
                });
                this.page = 1;
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                this.changeLocationHash(1, itemsNumber, this.filter);
            },

            showFilteredPage: function () {
                var itemsNumber;
                var self = this;
                var chosen = this.$el.find('.chosen');
                var checkedElements = $('.drop-down-filter input:checkbox:checked');
                var condition = this.$el.find('.conditionAND > input')[0];
                var showList;

                this.startTime = new Date();
                this.newCollection = false;

                this.filter = {};
                this.filter['forSales'] = false;
                this.filter['condition'] = 'and';

                if (condition && !condition.checked) {
                    self.filter['condition'] = 'or';
                }

                if (chosen) {
                    chosen.each(function (index, elem) {
                        if (elem.children[2].attributes.class.nodeValue === 'chooseDate') {
                            if (self.filter[elem.children[1].value]) {
                                self.filter[elem.children[1].value].push({
                                    start: $('#start').val(),
                                    end  : $('#end').val()
                                });

                            } else {
                                self.filter[elem.children[1].value] = [];
                                self.filter[elem.children[1].value].push({
                                    start: $('#start').val(),
                                    end  : $('#end').val()
                                });
                            }
                        } else {
                            if (self.filter[elem.children[1].value]) {
                                $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
                                    self.filter[elem.children[1].value].push($(element).val());
                                })
                            } else {
                                self.filter[elem.children[1].value] = [];
                                $($($(elem.children[2]).children('li')).children('input:checked')).each(function (index, element) {
                                    self.filter[elem.children[1].value].push($(element).val());
                                })
                            }
                        }

                    });
                }

                itemsNumber = $("#itemsNumber").text();
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                if ((checkedElements.length && checkedElements.attr('id') === 'defaultFilter') || (!chosen.length && !showList)) {
                    self.filter = {};
                    this.filter['forSales'] = false;
                }
                ;

                this.changeLocationHash(1, itemsNumber, this.filter);
                this.collection.showMore({count: itemsNumber, page: 1, filter: this.filter});
                this.getTotalLength(null, itemsNumber, this.filter);
            },

            showPage: function (event) {
                event.preventDefault();
                this.showP(event, {filter: this.filter, newCollection: this.newCollection, sort: this.sort});
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;
                holder.find("#listTable").empty();
                var itemView = new listItemView({
                    collection : newModels,
                    page       : holder.find("#currentShowPage").val(),
                    itemsNumber: holder.find("span#itemsNumber").text()
                });//added two parameters page and items number
                holder.append(itemView.render());

                holder.append(new listTotalView({element: holder.find("#listTable"), cellSpan: 8}).render());

                //this.recalculateTotal();   //-----------------------------!

                itemView.undelegateEvents();
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

            /*gotoForm: function (e) {
             App.ownContentType = true;
             var id = $(e.target).closest("tr").data("id");
             window.location.hash = "#easyErp/Invoice/form/" + id;
             },*/

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

            createItem: function () {
                //create editView in dialog here
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
                    var holder = this.$el;
                    var created = holder.find('#timeRecivingDataFromServer');
                    created.before(new listItemView({
                        collection : this.collection,
                        page       : holder.find("#currentShowPage").val(),
                        itemsNumber: holder.find("span#itemsNumber").text()
                    }).render());//added two parameters page and items number
                }

                holder.append(new listTotalView({element: holder.find("#listTable"), cellSpan: 8}).render());

                //this.recalculateTotal();   //-----------------------------!

                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
            },

            deleteItems: function () {
                var currentEl = this.$el;
                var that = this,
                    mid = 56,
                    model;
                var localCounter = 0;
                var count = $("#listTable input:checked").length;

                this.collectionLength = this.collection.length;

                $.each($("#listTable input:checked"), function (index, checkbox) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function () {
                            that.listLength--;
                            localCounter++;

                            if (index == count - 1) {
                                that.deleteCounter = localCounter;
                                that.deletePage = $("#currentShowPage").val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);

                            }
                        },
                        error  : function (model, res) {
                            if (res.status === 403 && index === 0) {
                                alert("You do not have permission to perform this action");
                            }
                            that.listLength--;
                            localCounter++;
                            if (index == count - 1) {
                                that.deleteCounter = localCounter;
                                that.deletePage = $("#currentShowPage").val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);

                            }

                        }
                    });
                });
            }

        });

        return InvoiceListView;
    });
