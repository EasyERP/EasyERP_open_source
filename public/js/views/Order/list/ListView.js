define([
        'text!templates/Order/list/ListHeader.html',
        'text!templates/stages.html',
        'views/Quotation/CreateView',
        'views/Order/list/ListItemView',
        'views/Order/list/ListTotalView',
        'views/Order/EditView',
        'models/QuotationModel',
        'models/UsersModel',
        'collections/Order/filterCollection',
        'views/Filter/FilterView',
	    'common',
        'dataService'
],

function (listTemplate, stagesTamplate, createView, listItemView, listTotalView, editView, quotationModel, usersModel, contentCollection, filterView, common, dataService) {
    var OrdersListView = Backbone.View.extend({
        el: '#content-holder',
        defaultItemsNumber: null,
        listLength: null,
        filter: null,
        sort: null,
        newCollection: null,
        page: null, //if reload page, and in url is valid page
        contentType: 'Order',//needs in view.prototype.changeLocationHash
        viewType: 'list',//needs in view.prototype.changeLocationHash
        
        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.filter = options.filter;
            this.sort = options.sort;
            this.defaultItemsNumber = this.collection.namberToShow || 50;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;

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
            "click .stageSelect": "showNewSelect",
            "click  .list tbody td:not(.notForm)": "goToEditDialog",
            "click #itemsButton": "itemsNumber",
            "click .currentPageList": "itemsNumber",
            "click": "hideItemsNumber",
            "click #firstShowPage": "firstPage",
            "click #lastShowPage": "lastPage",
            "click .oe_sortable": "goSort",
            "click .newSelectList li": "chooseOption",
            "click .saveFilterButton": "saveFilter",
            "click .removeFilterButton": "removeFilter"
        },

        chooseOption: function (e) {
            var self = this;
            var target$ = $(e.target);
            var targetElement = target$.parents("td");
            var id = targetElement.attr("id");
            var model = this.collection.get(id);

            model.save({ workflow: target$.attr("id") }, {
                headers:
                {
                    mid: 55
                },
                patch: true,
                validate: false,
                success: function () {
                    self.showFilteredPage();
                }
            });

            this.hideNewSelect();
            return false;
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

        goSort: function (e) {
            var target$ = $(e.target);
            var currentParrentSortClass = target$.attr('class');
            var sortClass = currentParrentSortClass.split(' ')[1];
            var sortConst = 1;
            var sortBy = target$.data('sort');
            var sortObject = {};

            this.collection.unbind('reset');
            this.collection.unbind('showmore');

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
                this.$el.find(".filterOptions, .filterActions, .search-options, .drop-down-filter").hide();
            };
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

        itemsNumber: function (e) {
            $(e.target).closest("button").next("ul").toggle();
            return false;
        },

        getTotalLength: function (currentNumber, itemsNumber,filter) {
                dataService.getData('/order/totalCollectionLength', {
                    contentType: this.contentType,
                    currentNumber: currentNumber,
                    filter: filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    var page = context.page || 1;
                    var length = context.listLength = response.count || 0;
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
                collection: this.collection,
                page: this.page,
                itemsNumber: this.collection.namberToShow
            }).render());//added two parameters page and items number
            currentEl.append(new listTotalView({element: this.$el.find("#listTable"), cellSpan: 6}).render());

            $('#check_all').click(function () {
                $(':checkbox').prop('checked', this.checked);
                if ($("input.checkbox:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            });

            $(document).on("click", function (e) {
                self.hideItemsNumber(e);
            });
                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                        pagenation.hide();
                } else {
                        pagenation.show();
                }
            currentEl.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");

            dataService.getData("/workflow/fetch", {
                wId: 'Purchase Order',
                source: 'purchase',
                targetSource: 'order'
            }, function (stages) {
                self.stages = stages;

                    dataService.getData('/quotation/getFilterValues', null, function (values) {

                        FilterView = new filterView({ collection: stages, customCollection: values});
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
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                tBody.empty();
                var itemView = new listItemView({ collection: this.collection,page: currentEl.find("#currentShowPage").val(), itemsNumber: currentEl.find("span#itemsNumber").text() });
                tBody.append(itemView.render());

                currentEl.append(new listTotalView({element: tBody, cellSpan:6}).render());

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
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                });
                dataService.getData('/order/totalCollectionLength', {
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId,
                    contentType: this.contentType
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

        nextPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.nextP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId

                });

                dataService.getData('/order/totalCollectionLength', {
                    contentType: this.contentType,
                    filter: this.filter,
                    newCollection: this.newCollection,
                    parrentContentId: this.parrentContentId
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
        },

            firstPage: function (event) {
                event.preventDefault();
                $('#check_all').prop('checked', false);
                $("#top-bar-deleteBtn").hide();
                this.firstP({
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/order/totalCollectionLength', {
                    contentType: this.contentType,
                    filter: this.filter,
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
                    sort: this.sort,
                    filter: this.filter,
                    newCollection: this.newCollection
                });
                dataService.getData('/order/totalCollectionLength', {
                    contentType: this.contentType,
                    filter: this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },  //end first last page in paginations

        switchPageCounter: function (event) {
                event.preventDefault();
                this.startTime = new Date();
                var itemsNumber = event.target.textContent;
                this.defaultItemsNumber = itemsNumber;
                this.getTotalLength(null, itemsNumber, this.filter);
                this.collection.showMore({
                    count: itemsNumber,
                    page: 1,
                    filter: this.filter,
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
            this.filter['condition'] = 'and';

            if  (condition && !condition.checked) {
                self.filter['condition'] = 'or';
            }

            //if (checkedElements.length && checkedElements.attr('id') !== 'defaultFilter') {
            //    showList = checkedElements.map(function() {
            //        return this.value
            //    }).get();
            //
            //    this.filter['workflow'] = showList;
            //};


            if (chosen) {
                chosen.each(function (index, elem) {
                    if (elem.children[2].attributes.class.nodeValue === 'chooseDate') {
                        if (self.filter[elem.children[1].value]) {
                            self.filter[elem.children[1].value].push({start: $('#start').val(), end: $('#end').val()});

                        } else {
                            self.filter[elem.children[1].value] = [];
                            self.filter[elem.children[1].value].push({start: $('#start').val(), end: $('#end').val()});
                        }
                    } else {
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
                    }

                });
            }
            itemsNumber = $("#itemsNumber").text();
            $("#top-bar-deleteBtn").hide();
            $('#check_all').prop('checked', false);

            if ((checkedElements.length && checkedElements.attr('id') === 'defaultFilter') || (!chosen.length && !showList)) {
                self.filter = 'empty';
            };

            this.changeLocationHash(1, itemsNumber, this.filter);
            this.collection.showMore({ count: itemsNumber, page: 1, filter: this.filter });
            this.getTotalLength(null, itemsNumber, this.filter);

            if (checkedElements.attr('id') === 'defaultFilter'){
                $(".saveFilterButton").hide();
                $(".clearFilterButton").hide();
                $(".removeFilterButton").show();
            } else {
                $(".saveFilterButton").show();
                $(".clearFilterButton").show();
                $(".removeFilterButton").show();
            }
        },

        saveFilter: function () {
            var currentUser = new usersModel(App.currentUser);
            var subMenu = $('#submenu-holder').find('li.selected').text();
            var key;
            var filterObj = {};
            var mid = 39;

            key = subMenu.trim();

            filterObj['filter'] = {};
            filterObj['filter'] = this.filter;
            filterObj['key'] = key;

            currentUser.changed = filterObj;

            currentUser.save(
                filterObj,
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    patch:true,
                    validate: false,
                    success: function (model) {
                        console.log('Filter was saved to db');
                    },
                    error: function (model,xhr) {
                        console.error(xhr);
                    },
                    editMode: false
                }
            );
            if (!App.currentUser.savedFilters){
                App.currentUser.savedFilters = {};
            }
            App.currentUser.savedFilters['Order'] = filterObj.filter;
        },

        removeFilter: function () {
            var currentUser = new usersModel(App.currentUser);
            var subMenu = $('#submenu-holder').find('li.selected').text();
            var key;
            var filterObj = {};
            var mid = 39;

            this.clearFilter();

            key = subMenu.trim();
            filterObj['key'] = key;

            currentUser.changed = filterObj;

            currentUser.save(
                filterObj,
                {
                    headers: {
                        mid: mid
                    },
                    wait: true,
                    patch:true,
                    validate: false,
                    success: function (model) {
                        console.log('Filter was remover from db');
                    },
                    error: function (model,xhr) {
                        console.error(xhr);
                    },
                    editMode: false
                }
            );

            delete App.currentUser.savedFilters['Order'];
        },

        clearFilter: function () {

            this.$el.find('.filterValues').empty();
            this.$el.find('.filter-icons').removeClass('active');
            this.$el.find('.chooseOption').children().remove();
            this.$el.find('.filterOptions').removeClass('chosen');

            $.each($('.drop-down-filter input'), function (index, value) {
                value.checked = false
            });

            this.showFilteredPage();
        },


        showPage: function (event) {
                event.preventDefault();
                this.showP(event,{filter: this.filter, newCollection: this.newCollection,sort: this.sort});
        },

        showMoreContent: function (newModels) {
                var holder = this.$el;
                holder.find("#listTable").empty();
                var itemView = new listItemView({ collection: newModels, page: holder.find("#currentShowPage").val(), itemsNumber: holder.find("span#itemsNumber").text() });//added two parameters page and items number
                holder.append(itemView.render());

                holder.append(new listTotalView({element: holder.find("#listTable"), cellSpan:6}).render());

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
        },

        createItem: function () {
            //create editView in dialog here
            new createView({visible: true});
        },

        checked: function () {
            if (this.collection.length > 0) {
                var checkLength = $("input.checkbox:checked").length;
                if ($("input.checkbox:checked").length > 0) {
                    $("#top-bar-deleteBtn").show();
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
                dataService.getData('/order/totalCollectionLength', {
                    contentType: this.contentType,
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

                var holder = this.$el;

                if (deleteCounter !== this.collectionLength) {
                    var created = holder.find('#timeRecivingDataFromServer');
                    created.before(new listItemView({ collection: this.collection, page: holder.find("#currentShowPage").val(), itemsNumber: holder.find("span#itemsNumber").text()}).render());//added two parameters page and items number
                }

                holder.append(new listTotalView({element: holder.find("#listTable"), cellSpan:6}).render());
                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                        pagenation.hide();
                } else {
                        pagenation.show();
                }
        },
        deleteItems: function () {
            var currentEl = this.$el;
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
						wait:true,
						success:function(){
							that.listLength--;
							localCounter++;

							if (index==count-1){

								that.deleteCounter =localCounter;
								that.deletePage = $("#currentShowPage").val();
								that.deleteItemsRender(that.deleteCounter, that.deletePage);
								
							}
						},
						error: function (model, res) {
							if(res.status===403&&index===0){
								alert("You do not have permission to perform this action");
							}
							that.listLength--;
							localCounter++;
							if (index==count-1){
								that.deleteCounter =localCounter;
								that.deletePage = $("#currentShowPage").val();
								that.deleteItemsRender(that.deleteCounter, that.deletePage);
								
							}

						}
                });
            });
        }

    });

    return OrdersListView;
});
