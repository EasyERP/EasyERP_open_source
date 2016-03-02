define([
        'jQuery',
        'Underscore',
        'Backbone',
        'text!templates/Pagination/PaginationTemplate.html',
        'text!templates/Alpabet/AphabeticTemplate.html',
        'text!templates/Notes/importTemplate.html',
        'views/Notes/AttachView',
        'common',
        'dataService'
    ],

    function ($, _, Backbone, paginationTemplate, aphabeticTemplate, importForm, attachView, common, dataService) {
        'use strict';
        var ListViewBase = Backbone.View.extend({
            el                : '#content-holder',
            defaultItemsNumber: null,
            listLength        : null,
            filter            : null,
            newCollection     : null,
            page              : null,
            viewType          : 'list',

            events: {
                "click #previousPage, #nextPage, #firstShowPage, #lastShowPage": "checkPage",
                "click .itemsNumber"                                           : "switchPageCounter",
                "click .showPage"                                              : "showPage",
                "change #currentShowPage"                                      : "showPage",
                "click .checkbox"                                              : "checked",
                "click .list td:not(.notForm)"                                 : "gotoForm",
                "mouseover .currentPageList"                                   : "showPagesPopup",
                "click"                                                        : "hidePagesPopup",
                "click .oe_sortable"                                           : "goSort"
            },

            //to remove zombies was needed for event after recieveInvoice on projectInfo
            remove: function () {
                this.$el.empty().off();
                this.stopListening();

                return this;
            },

            //<editor-fold desc="Logic">

            fetchSortCollection: function (sortObject) {
                this.sort = sortObject;
                this.collection = new this.contentCollection({
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

            goSort: function (e) {
                var target$;
                var currentParrentSortClass;
                var sortClass;
                var sortConst;
                var sortBy;
                var sortObject;
                var newRows = this.$el.find('#false');

                if ((this.changedModels && Object.keys(this.changedModels).length) || (this.isNewRow ? this.isNewRow() : newRows.length)) {
                    return App.render({
                        type   : 'notify',
                        message: 'Please, save previous changes or cancel them!'
                    });
                }

                this.collection.unbind('reset');
                this.collection.unbind('showmore');

                target$ = $(e.target).closest('th');
                currentParrentSortClass = target$.attr('class');
                sortClass = currentParrentSortClass.split(' ')[1];
                sortConst = 1;
                sortBy = target$.data('sort');
                sortObject = {};

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

            getTotalLength: function (currentNumber, itemsNumber, filter) {
                dataService.getData(this.totalCollectionLengthUrl, {
                    currentNumber: currentNumber,
                    filter       : filter,
                    contentType  : this.contentType,
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

            gotoForm: function (e) {
                if (!this.formUrl) {
                    return;
                }
                App.ownContentType = true;
                var id = $(e.target).closest("tr").data("id");
                window.location.hash = this.formUrl + id;
            },

            createItem: function () {
                new this.createView();
            },

            checked: function (e) {
                e.stopPropagation();

                var checkLength;
                var checkAll$;

                if (this.collection.length > 0) {

                    checkLength = $("input.checkbox:checked").length;
                    if (checkLength > 0) {
                        $("#top-bar-deleteBtn").show();
                        checkAll$ = $('#check_all');
                        checkAll$.prop('checked', false);

                        if (checkLength === this.collection.length) {
                            checkAll$.prop('checked', true);
                        }
                    }
                    else {
                        $("#top-bar-deleteBtn").hide();
                        checkAll$ = $('#check_all');
                        checkAll$.prop('checked', false);
                    }
                }
                if (typeof(this.setAllTotalVals) === "function") {   // added in case of existing setAllTotalVals in View
                    this.setAllTotalVals();
                }
            },

            deleteItems: function () {
                var that = this;
                var mid = 39;
                var model;
                var localCounter = 0;
                var listTableCheckedInput;
                var count;
                listTableCheckedInput = $("#listTable").find("input:checked");

                count = listTableCheckedInput.length;
                this.collectionLength = this.collection.length;
                $.each(listTableCheckedInput, function (index, checkbox) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function () {
                            that.listLength--;
                            localCounter++;
                            count--;
                            if (count === 0) {
                                if (this.hasAlphabet) {
                                    common.buildAphabeticArray(that.collection, function (arr) {
                                        $("#startLetter").remove();
                                        that.alphabeticArray = arr;
                                        $('#searchContainer').after(_.template(aphabeticTemplate, {
                                            alphabeticArray   : that.alphabeticArray,
                                            selectedLetter    : (that.selectedLetter == "" ? "All" : that.selectedLetter),
                                            allAlphabeticArray: that.allAlphabeticArray
                                        }));
                                        var currentLetter = (that.filter) ? that.filter.letter : null;
                                        if (currentLetter) {
                                            $('#startLetter').find('a').each(function () {
                                                var target = $(this);
                                                if (target.text() == currentLetter) {
                                                    target.addClass("current");
                                                }
                                            });
                                        }
                                    });
                                }

                                that.deleteCounter = localCounter;
                                that.deletePage = $("#currentShowPage").val();
                                that.deleteItemsRender(that.deleteCounter, that.deletePage);
                            }
                        },
                        error  : function (model, res) {
                            if (res.status === 403 && index === 0) {
                                App.render({
                                    type   : 'error',
                                    message: "You do not have permission to perform this action"
                                });
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
            },

            //</editor-fold>

            //<editor-fold desc="Pagination">

            // carried off eventHandlers for pages in one
            checkPage: function (event) {
                var newRows = this.$el.find('#false');
                var elementId = $(event.target).attr('id');
                var data = {
                    sort         : this.sort,
                    filter       : this.filter,
                    newCollection: this.newCollection
                };

                event.preventDefault();

                if ((this.changedModels && Object.keys(this.changedModels).length) || (this.isNewRow ? this.isNewRow() : newRows.length)) {
                    return App.render({
                        type   : 'notify',
                        message: 'Please, save previous changes or cancel them!'
                    });
                }

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                switch (elementId) {
                    case 'previousPage':
                        this.prevP(data);
                        break;

                    case 'nextPage':
                        this.nextP(data);
                        break;

                    case 'firstShowPage':
                        this.firstP(data);
                        break;

                    case 'lastShowPage':
                        this.lastP(data);
                        break;
                }

                dataService.getData(this.totalCollectionLengthUrl, {
                    sort  : this.sort,
                    filter: this.filter
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);
            },

            switchPageCounter: function (event) {
                var newRows = this.$el.find('#false');

                event.preventDefault();

                if ((this.changedModels && Object.keys(this.changedModels).length) || (this.isNewRow ? this.isNewRow() : newRows.length)) {
                    return App.render({
                        type   : 'notify',
                        message: 'Please, save previous changes or cancel them!'
                    });
                }

                var targetEl = $(event.target);
                var itemsNumber;

                if (this.previouslySelected) {
                    this.previouslySelected.removeClass("selectedItemsNumber");
                }

                this.previouslySelected = targetEl;
                targetEl.addClass("selectedItemsNumber");

                this.startTime = new Date();
                itemsNumber = targetEl.text();

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

            showPagesPopup: function (e) {
                $(e.target).closest("button").next("ul").toggle();
                return false;
            },

            hidePagesPopup: function (e) {
                var el = e.target;

                if (this.selectView) {
                    this.selectView.remove();
                }

                this.$el.find(".allNumberPerPage, .newSelectList").hide();
                if (!el.closest('.search-view')) {
                    $('.search-content').removeClass('fa-caret-up');
                    this.$el.find('.search-options').addClass('hidden');
                }

                if (typeof(this.setChangedValueToModel) === "function" && el.tagName !== 'SELECT') { //added for SetChangesToModel in ListView
                    this.setChangedValueToModel();
                }
            },

            //</editor-fold>

            //<editor-fold desc="Show">

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

                context.changeLocationHash(1, itemsNumber, filter);
                context.collection.showMore({count: itemsNumber, page: 1, filter: filter});
                context.getTotalLength(null, itemsNumber, filter);
            },

            showPage: function (event) {
                var newRows = this.$el.find('#false');

                event.preventDefault();

                if ((this.changedModels && Object.keys(this.changedModels).length) || (this.isNewRow ? this.isNewRow() : newRows.length)) {
                    return App.render({
                        type   : 'notify',
                        message: 'Please, save previous changes or cancel them!'
                    });
                }
                this.showP(event, {filter: this.filter, newCollection: this.newCollection, sort: this.sort});
            },

            showMoreContent: function (newModels) {
                var holder = this.$el;
                var itemView;
                var page = holder.find("#currentShowPage").val();

                holder.find("#listTable").empty();

                itemView = new this.listItemView({
                    collection : newModels,
                    page       : page,
                    itemsNumber: this.defaultItemsNumber
                });

                holder.append(itemView.render());

                itemView.undelegateEvents();

                var pagenation = holder.find('.pagination');
                if (newModels.length !== 0) {
                    pagenation.show();
                } else {
                    pagenation.hide();
                }
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                /*if (this.filterView) {
                 this.filterView.renderFilterContent();
                 }*/

                holder.find('#timeRecivingDataFromServer').remove();
                holder.append("<div id='timeRecivingDataFromServer'>Created in " + (new Date() - this.startTime) + " ms</div>");
            },

            showMoreAlphabet: function (newModels) {
                var holder = this.$el;
                var alphaBet = holder.find('#startLetter');
                var created = holder.find('#timeRecivingDataFromServer');
                this.countPerPage = newModels.length;
                content.remove();
                holder.append(this.template({collection: newModels.toJSON()}));
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);
                this.getTotalLength(null, itemsNumber, this.filter);
                created.text("Created in " + (new Date() - this.startTime) + " ms");
                holder.prepend(alphaBet);
                holder.append(created);
            },

            //</editor-fold>

            //<editor-fold desc="Renders">

            renderContent: function () {
                var $currentEl = this.$el;
                var tBody = $currentEl.find('#listTable');
                var itemView;
                var pagenation;

                tBody.empty();
                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                if (this.collection.length > 0) {
                    itemView = new this.listItemView({
                        collection : this.collection,
                        page       : this.page,
                        itemsNumber: this.collection.namberToShow
                    });
                    tBody.append(itemView.render());
                }

                pagenation = this.$el.find('.pagination');

                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }

                if (this.editCollection) { // add for reset editCollection after sort
                    this.editCollection.reset(this.collection.models);
                }
            },

            alpabeticalRender: function (e) {
                var target = $(e.target);
                var selectedLetter = target.text();
                var itemsNumber = $("#itemsNumber").text();

                this.startTime = new Date();

                this.filter = (this.filter) ? this.filter : {};
                this.filter['letter'] = selectedLetter;

                if ($(e.target).text() == "All") {
                    selectedLetter = "";
                    this.filter = {};
                }

                target.parent().find(".current").removeClass("current");
                target.addClass("current");

                $("#top-bar-deleteBtn").hide();
                $('#check_all').prop('checked', false);

                this.changeLocationHash(1, itemsNumber, this.filter);
                this.collection.showMore({count: itemsNumber, page: 1, filter: this.filter});
                this.getTotalLength(null, itemsNumber, this.filter);
            },

            renderCheckboxes: function () {
                var self = this;
                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0) {
                        $("#top-bar-deleteBtn").show();
                    } else {
                        $("#top-bar-deleteBtn").hide();
                    }
                    if (typeof(self.setAllTotalVals) === "function") {   // added in case of existing setAllTotalVals method in View
                        self.setAllTotalVals();
                    }
                });
            },

            renderAlphabeticalFilter: function () {
                this.hasAlphabet = true;
                var self = this;

                common.buildAphabeticArray(this.collection, function (arr) {
                    $("#startLetter").remove();
                    self.alphabeticArray = arr;
                    //$currentEl.prepend(_.template(aphabeticTemplate, { alphabeticArray: self.alphabeticArray, selectedLetter: (self.selectedLetter == "" ? "All" : self.selectedLetter), allAlphabeticArray: self.allAlphabeticArray }));
                    $('#searchContainer').after(_.template(aphabeticTemplate, {
                        alphabeticArray   : self.alphabeticArray,
                        allAlphabeticArray: self.allAlphabeticArray
                    }));
                    var currentLetter = (self.filter && self.filter.letter) ? self.filter.letter : "All";
                    if (currentLetter) {
                        $('#startLetter').find('a').each(function () {
                            var target = $(this);
                            if (target.text() == currentLetter) {
                                target.addClass("current");
                            }
                        });
                    }
                });
            },

            renderPagination: function ($currentEl, self) {
                var countNumber;
                var pagenation;

                $currentEl.append(_.template(paginationTemplate));

                pagenation = self.$el.find('.pagination');

                if (self.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                    // This is for counterPages at start
                    countNumber = ([100, 200, 500].indexOf(this.defaultItemsNumber) !== -1) ? this.defaultItemsNumber : "all"; // changed in case of bad view after refreshing with not default counter

                    this.previouslySelected = $('.itemsNumber:contains(' + countNumber + ')');
                    this.previouslySelected.addClass('selectedItemsNumber');
                    // end
                }

                $(document).on("click", function (e) {
                    self.hidePagesPopup(e);
                });

            },

            renderFilter: function (self, baseFilter) {
                self.filterView = new this.filterView({
                    contentType: self.contentType
                });

                self.filterView.bind('filter', function (filter) {
                    if (baseFilter) {
                        filter[baseFilter.name] = baseFilter.value;
                    }
                    self.showFilteredPage(filter, self);
                });
                self.filterView.bind('defaultFilter', function () {
                    if (baseFilter) {
                        filter[baseFilter.name] = baseFilter.value;
                    }
                    self.showFilteredPage({}, self);
                });

                self.filterView.render();

            },

            deleteItemsRender: function (deleteCounter, deletePage) {
                $('#check_all').prop('checked', false);
                dataService.getData(this.totalCollectionLengthUrl, {
                    filter       : this.filter,
                    newCollection: this.newCollection
                }, function (response, context) {
                    context.listLength = response.count || 0;
                }, this);

                this.deleteRender(deleteCounter, deletePage, {
                    filter       : this.filter,
                    newCollection: this.newCollection
                });

                var pagenation = this.$el.find('.pagination');
                if (this.collection.length === 0) {
                    pagenation.hide();
                } else {
                    pagenation.show();
                }
            },

            exportToCsv: function () {
                //todo change after routes refactoring
                if (this.exportToCsvUrl) {
                    window.location = this.exportToCsvUrl;
                } else {
                    if (this.collection) {
                        window.location = this.collection.url + '/exportToCsv';
                    }
                }
            },

            exportToXlsx        : function () {
                //todo change after routes refactoring
                if (this.exportToXlsxUrl) {
                    if (this.filter){
                        this.exportToXlsxUrl += '/' + encodeURIComponent(JSON.stringify(this.filter));
                    }
                    window.location = this.exportToXlsxUrl;
                } else {
                    if (this.collection) {
                        window.location = this.collection.url + '/exportToXlsx';
                    }
                }
            },
            fileSizeIsAcceptable: function (file) {
                if (!file) {
                    return false;
                }
                return file.size < App.File.MAXSIZE;
            },

            importFiles: function (context) {
                new attachView({
                    modelName: context.contentType,
                    import   : true
                });
            }

        });

        ListViewBase.extend = function (child) {
            var view = Backbone.View.extend.apply(this, arguments);
            var key;
            var protoEvents = this.prototype.events;
            var protoKeys = Object.keys(protoEvents);
            var viewEvents = view.prototype.events;

            for (var i = 0, length = protoKeys.length; i < length; i++) {
                key = protoKeys[i];
                if (viewEvents.hasOwnProperty(key)) {
                    continue;
                }
                viewEvents[key] = protoEvents[key];
            }

            return view;
        };

        return ListViewBase;
    });
