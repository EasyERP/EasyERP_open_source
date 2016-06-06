define([
    'Backbone',
    'jQuery',
    'Underscore',
    'constants',
    'common'
], function (Backbone, $, _, CONSTANTS, common) {
    var View = Backbone.View.extend({
        /*listLength        : null,*/
        /*defaultItemsNumber: null,*/
        /*newCollection     : null,*/
        $pagination: null,
        /*rowClicks         : 0,*/

        events: {
            'click .oe_sortable': 'goSort',
            'click #check_all'  : 'checkAll',
            click               : 'hide'
        },

        hideDeleteBtnAndUnSelectCheckAll: function () {
            $('#top-bar-deleteBtn').hide();
            $('#check_all').prop('checked', false);
        },

        checkAll: function (e) {
            var $el = $(e.target);
            var $thisEl = this.$el;

            var $checkedContent = (this.viewType === 'thumbnails') ?
                $thisEl.find('.thumbnailsItems') :
                $thisEl.find('.listTable');

            var $checkboxes = $checkedContent.find('input[type="checkbox"]');
            var check = $el.prop('checked');

            $checkboxes.prop('checked', check);

            this.inputClick(e);
        },

        inputClick: function (e) {
            var $checkBoxes = this.$el.find('input[type="checkbox"]:checked:not(#check_all)');
            var $currentChecked = $(e.target);
            var checkAllBool = ($checkBoxes.length === this.collection.length);

            if ($currentChecked.attr('id') !== 'check_all') {
                if (checkAllBool) {
                    this.$el.find('#check_all').prop('checked', true);
                } else {
                    this.$el.find('#check_all').prop('checked', false);
                }
            }

            this.trigger('selectedElementsChanged', {
                length  : $checkBoxes.length,
                $element: $currentChecked,
                checkAll: checkAllBool
            });

            if (typeof(this.setAllTotalVals) === 'function') {   // added in case of existing setAllTotalVals in View
                this.setAllTotalVals();
            }

            e.stopPropagation();
        },

        goSort: function (e) {
            var newRows = this.$el.find('#false');
            var filter = this.filter || {};
            var target$;
            var currentParrentSortClass;
            var sortClass;
            var sortConst;
            var sortBy;
            var sortObject;
            var data;

            if ((this.changed && this.changedModels && Object.keys(this.changedModels).length) ||
                (this.isNewRow ? this.isNewRow() : newRows.length)) {
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
                target$.addClass('sortUp');
                sortClass = 'sortUp';
            }

            switch (sortClass) {
                case 'sortDn':
                {
                    target$.parent().find('th').removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                }
                    break;
                case 'sortUp':
                {
                    target$.parent().find('th').removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
                }
                    break;
                // skip default case
            }

            sortObject[sortBy] = sortConst;

            data = {
                sort: sortObject
            };

            data.filter = filter;

            if (this.viewType) {
                data.viewType = this.viewType;
            }
            if (this.parrentContentId) {
                data.parrentContentId = this.parrentContentId;
            }
            if (this.contentType) {
                data.contentType = this.contentType;
            }

            data.page = 1;

            this.changeLocationHash(null, this.collection.pageSize);
            this.collection.getFirstPage({filter: filter, viewType: this.viewType});
            this.collection.getFirstPage(data);
        },

        makeRender: function (options) {
            var self = this;

            _.bindAll(this, 'render', 'afterRender', 'beforeRender');

            this.render = _.wrap(this.render, function (render) {
                self.beforeRender(options);
                render();
                self.afterRender(options);

                return self;
            });
        },

        beforeRender: function (options) {
            // this.contentType = options.contentType;
        },

        afterRender: function (options) {
            var contentType = options.contentType || null;

            /*$curEl.find('.scrollable').mCustomScrollbar();
             $curEl.find('.tabs').tabs();

             this.runClickItem = _.debounce(this.clickItem, 300);
             this.runClickThumbnail = _.debounce(this.clickThumbnail, 300);*/
        },

        appFiltersCollectionLoaded: function (options) {
            var $curEl = this.$el;
            var contentType = options.contentType || null;
            var $filterBar = $curEl.find('.filterBar');
            var self = this;
            var filterHolder;

            if (!$filterBar.length) {
                $filterBar = $curEl.siblings('.topBarHolder').find('.filterBar');
            }

            if ($filterBar.length) {
                if (this.domainsArray.indexOf(contentType) !== -1) {
                    $filterBar.html(this.filterBarTemplate({
                        showHeader : false,
                        showClear  : false,
                        contentType: contentType
                    }));
                } else {
                    $filterBar.html(this.filterBarTemplate({
                        contentType: contentType,
                        showHeader : true,
                        showClear  : true
                    }));
                }

                filterHolder = $filterBar.find('.filtersFullHolder');

                options.el = filterHolder;

                this.filterView = new FilterView(options);
                this.filterView.render();

                this.filterView.bind('filter', function (filter) {
                    self.filter = filter;

                    if (!self.$el.hasClass("ui-dialog-content ui-widget-content") && !self.$el.parents(".ui-dialog").length) {
                        self.changeLocationHash(1, CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE, filter);
                    }

                    self.trigger('filter');
                });
            }
        },

        changeLocationHash: function (page, count, filter) {
            var location = Backbone.history.fragment;
            var mainLocation = '#easyErp/' + this.contentType + '/' + this.viewType;
            var pId = (location.split('/pId=')[1]) ? location.split('/pId=')[1].split('/')[0] : '';
            var url;
            var thumbnails;
            var locationFilter;
            var value = false;

            if (!page && this.viewType === 'list') {
                page = (location.split('/p=')[1]) ? location.split('/p=')[1].split('/')[0] : 1;
            }

            if (isNaN(page)) {
                page = 1;
            }

            if (!count) {
                thumbnails = location.split('thumbnails')[0];
                count = (location.split('/c=')[1]) ? location.split('/c=')[1].split('/')[0] : CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE;

                if (isNaN(count)) {
                    count = CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE;
                }

                if (thumbnails && count < CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE) {
                    count = CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE;
                }
            }

            url = mainLocation;
            if (pId) {
                url += '/pId=' + pId;

                if (pId.split(',')[1] === 'true') {
                    value = true;
                }
            }

            if (page) {
                url += '/p=' + page;
            }
            if (count) {
                url += '/c=' + count;
            }

            if (!filter) {
                locationFilter = location.split('/filter=')[1];
                if (locationFilter) {
                    url += '/filter=' + locationFilter;
                }
            } else {
                url += '/filter=' + encodeURIComponent(JSON.stringify(filter));
            }

            Backbone.history.navigate(url, {replace: true});
        },

        nextPage: function (options) {
            var page = options.page;
            var count = options.count;

            options = options || {count: count};

            options.filter = this.filter;

            this.collection.getNextPage(options);
            this.changeLocationHash(page, count);
        },

        previousPage: function (options) {
            var page = options.page;
            var itemsNumber = options.itemsNumber;

            options = options || {count: itemsNumber};

            options.filter = this.filter;

            this.collection.getPreviousPage(options);
            this.changeLocationHash(page, itemsNumber);
        },

        firstPage: function (options) {
            var itemsNumber = $('#itemsNumber').text();
            var currentShowPage = $('#currentShowPage');
            var page = 1;
            var lastPage = $('#lastPage').text();
            var i;

            currentShowPage.val(page);

            $('#firstShowPage').prop('disabled', true);

            $('#pageList').empty();

            if (lastPage >= 7) {
                for (i = 1;
                     i <= 7;
                     i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            } else {
                for (i = 1;
                     i <= lastPage;
                     i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }
            $("#gridStart").text((page - 1) * itemsNumber + 1);

            if (this.listLength <= 1 * itemsNumber) {
                $("#gridEnd").text(this.listLength);
            } else {
                $("#gridEnd").text(page * itemsNumber);
            }

            $("#previousPage").prop("disabled", true);
            $("#nextPage").prop("disabled", false);
            $("#lastShowPage").prop("disabled", false);

            options = options || {
                    count : itemsNumber,
                    filter: this.filter
                };

            this.collection.getFirstPage(options);
            this.changeLocationHash(1, itemsNumber);
        },

        lastPage: function (options) {
            var itemsNumber = $("#itemsNumber").text();
            var page = $("#lastPage").text();
            var i;

            $("#firstShowPage").prop("disabled", true);
            $("#pageList").empty();

            if (page >= 7) {
                for (i = page - 6;
                     i <= page;
                     i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            } else {
                for (i = 1;
                     i <= page;
                     i++) {
                    $("#pageList").append('<li class="showPage">' + i + '</li>');
                }
            }

            $("#currentShowPage").val(page);
            $("#gridStart").text((page - 1) * itemsNumber + 1);

            if (this.listLength <= page * itemsNumber) {
                $("#gridEnd").text(this.listLength);
                $("#nextPage").prop("disabled", true);
            } else {
                $("#gridEnd").text(page * itemsNumber);
            }

            $("#nextPage").prop("disabled", true);
            $("#lastShowPage").prop("disabled", true);
            $("#previousPage").prop("disabled", false);
            $("#firstShowPage").prop("disabled", false);

            options = options || {
                    page  : page,
                    count : itemsNumber,
                    filter: this.filter
                };

            this.collection.getLastPage(options);
            this.changeLocationHash(page, itemsNumber);
        },

        getPage: function (options) {
            var itemsNumber = options.count;
            var page = options.page;
            var filter = this.filter || {};
            var collectionOptions = {
                count : itemsNumber,
                filter: filter
            };

            var filterExtension = this.getFilterExtention();

            collectionOptions.filter = _.extend(collectionOptions.filter, filterExtension);

            /*this.defFilter = $.extend({}, collectionOptions.filter);
             this.filter = $.extend({}, collectionOptions.filter);  */

            this.collection.getPage(page, collectionOptions);
            this.changeLocationHash(page, itemsNumber);
        },

        switchPageCounter: function (e) {
            e.preventDefault();

            var self = this;
            var itemsNumber = e.target.textContent;

            this.defaultItemsNumber = itemsNumber;
            this.$el.find('#checkAll').prop('checked', false);

            this.collection.getPage(1, {
                count        : itemsNumber,
                page         : 1,
                filter       : this.filter,
                newCollection: false
            });

            this.changeLocationHash(1, itemsNumber);
        },

        // </editor-fold>

        // <editor-fold desc="Checkboxes">

        checked: function (e) {
            e.stopPropagation();
        },

        checklistRow: function (e) {
            var $targetEl = $(e.target);
            var $targetDivContainer = $targetEl.closest('.listRow');
            var $checkbox = $targetDivContainer.find('input[type="checkbox"]');
            var checked = $checkbox.prop('checked');

            $checkbox.prop('checked', !checked);
            this.inputClick(e);
        },

        createItem: function (modelForDuplicate) {
            var contentType = this.contentType;
            var viewType = this.viewType;
            var parentId = this.parentId;
            var self = this;
            var CreateView = this.CreateView;


            return new CreateView();
        },

        editItem: function (id) {
            var contentType = this.contentType;
            var viewType = this.viewType;
            var parentId = this.parentId;
            var translation = this.translation;
            var currentId = id || this.$el.find('input[type="checkbox"]:checked:not(#checkAll)').attr('id');
            var model = this.collection.get(currentId);
            var self = this;

            var editView = new this.EditView({
                model      : model,
                contentType: contentType,
                viewType   : viewType,
                parentId   : parentId,
                translation: translation
            });

            editView.on('itemArchived', function () {
                self.collection.getPage(1);
            });

            editView.on('modelSaved', function (model) {

                if (App.currentUser._id === model.get('_id')) {
                    App.currentUser = model.toJSON();
                    self.trigger('renderCurrentUserInfo');
                }

                self.addReplaceRow(model);
            });
        },

        deleteItems: function () {
            var self = this;
            var $thisEl = this.$el;
            var $table = $thisEl.find('#listTable');
            var mid = CONSTANTS.MID[this.contentType];
            var model;
            var localCounter = 0;
            var $checkedInputs;
            var count;

            $checkedInputs = $table.find('input:checked');
            $.each($checkedInputs, function (index, checkbox) {
                model = self.collection.get(checkbox.value);
                model.destroy({
                    headers: {
                        mid: mid
                    },
                    wait   : true,
                    success: function () {
                        if (self.hasAlphabet) {
                            common.buildAphabeticArray(self.collection, function (arr) {
                                var currentLetter = (self.filter && self.filter.letter) ? self.filter.letter.value : null;
                                var $startLetter = $('#startLetter');

                                self.alphabeticArray = arr;
                                $startLetter = $startLetter.replaceWith(_.template(aphabeticTemplate, {
                                    alphabeticArray   : self.alphabeticArray,
                                    selectedLetter    : (self.selectedLetter === '' ? 'All' : self.selectedLetter),
                                    allAlphabeticArray: self.allAlphabeticArray
                                }));

                                if (currentLetter) {
                                    $startLetter.find('a').each(function () {
                                        var $target = $(this);

                                        if ($target.text() === currentLetter) {
                                            $target.addClass('current');
                                        }
                                    });
                                }
                            });
                        }

                        self.collection.remove(model);
                        // self.deleteItemsRender(self.deleteCounter, self.deletePage);
                    },

                    error: function (_model, xhr) {
                        if (xhr.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        }
                    }
                });
            });
        },

        clickItem: function (e) {
            var clicks = this.rowClicks;

            this.rowClicks = 0;

            if (clicks === 1) {
                this.checklistRow(e);
            } else {
                this.listRowClick(e);
            }
        },

        showFilteredContent: function (tabName) {
            var itemsNumber = $("#itemsNumber").text();
            var creationOptions;

            var defaultFilters = new DefFilters(App.currentUser._id);
            var filter = defaultFilters.getDefFilter(this.contentType, tabName);

            var filterExtension = this.getFilterExtention();

            this.tabName = tabName;

            creationOptions = {
                viewType     : this.viewType,
                filter       : filter,
                parentId     : this.parentId,
                newCollection: false
            };

            creationOptions.filter = _.extend(creationOptions.filter, filterExtension);

            this.defFilter = $.extend({}, creationOptions.filter);
            this.filter = $.extend({}, creationOptions.filter);

            if (this.filterView) {
                this.filterView.trigger('tabsChanged', this.defFilter);
            }

            this.changeLocationHash(1, itemsNumber, filter);
            this.collection.getPage(1, creationOptions);
        },

        setPagination: function (options) {
            var $thisEl = this.$el;
            var $pageList = $thisEl.find('#pageList');
            var $curPageInput = $thisEl.find('#currentShowPage');
            var $itemsNumber = $thisEl.find('.itemsNumber');

            var $gridStart = $thisEl.find('#gridStart');

            var $gridEnd = $thisEl.find('#gridEnd');
            var $gridCount = $thisEl.find('#gridCount');

            var gridCount;
            var currentPage;
            var tottalRecords;
            var itemsNumber;
            var gridStartValue;
            var gridEndValue;
            var pageNumber;
            var $lastPage;
            var i;

            options = options || {};

            currentPage = parseInt(options.currentPage, 10) || parseInt($curPageInput.val(), 10);
            itemsNumber = parseInt(options.pageSize, 10) || parseInt($($itemsNumber[0]).text(), 10);
            tottalRecords = parseInt(options.totalRecords, 10) || parseInt($($itemsNumber[0]).text(), 10);

            currentPage = isNaN(currentPage) ? 1 : currentPage;
            tottalRecords = isNaN(tottalRecords) ? 0 : tottalRecords;

            if (isNaN(itemsNumber)) {
                itemsNumber = CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE;
            }

            gridCount = tottalRecords >= 0 ? tottalRecords : parseInt($gridCount.text(), 10);
            gridStartValue = (currentPage - 1) * itemsNumber;
            gridEndValue = gridStartValue + itemsNumber;

            $gridCount.text(gridCount);

            if (gridEndValue > gridCount) {
                gridEndValue = gridCount;
            }

            $gridStart.text((gridCount === 0) ? 0 : gridStartValue + 1);
            $gridEnd.text(gridEndValue);

            if (tottalRecords === 0) {
                $lastPage = $thisEl.find('#lastPage');
                pageNumber = Math.ceil(gridCount / itemsNumber);
                $pageList.html('');

                pageNumber = pageNumber || 1;

                for (i = 1; i <= pageNumber; i++) {
                    $pageList.append('<li class="showPage">' + i + '</li>');
                }

                $lastPage.text(pageNumber);

                if (pageNumber <= 1) {
                    $thisEl.find('#nextPage').prop('disabled', true);
                    $thisEl.find('#previousPage').prop('disabled', true);
                } else {
                    $thisEl.find('#previousPage').prop('disabled', gridStartValue + 1 === 1);
                    $thisEl.find('#nextPage').prop('disabled', gridEndValue === gridCount);
                }
            }

            if (options.itemsNumber) {
                $itemsNumber.text(itemsNumber);
            }

            $curPageInput.val(currentPage);
        }
    });

    View.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return View;
});
