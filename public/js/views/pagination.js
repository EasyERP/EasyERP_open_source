define([
    'Backbone',
    'jQuery',
    'Underscore',
    'constants',
    'common'
], function (Backbone, $, _, CONSTANTS, common) {
    var View = Backbone.View.extend({
        el    : '#content-holder',
        filter: null,

        events: {
            'click .oe_sortable': 'goSort',
            'click #checkAll'   : 'checkAll',
            click               : 'hide'
        },

        hideDeleteBtnAndUnSelectCheckAll: function () {
            $('#top-bar-deleteBtn').hide();
            this.$el.find('#checkAll').prop('checked', false);
        },

        checkAll: function (e) {
            var $thisEl = this.$el;
            var $el = e ? $(e.target) : $thisEl.find('#checkAll');
            var self = this;
            var $checkedContent = (this.viewType === 'thumbnails') ?
                $thisEl.find('.thumbnailsItems') :
                $thisEl.find('.listTable');

            var $checkboxes = $checkedContent.find(':checkbox:not(.notRemovable)');
            var check = $el.prop('checked');

            $checkboxes.prop('checked', check);

            // todo change for this.$topBar...
            if ($checkboxes.length > 0) {
                $('#top-bar-deleteBtn').show();
            } else {
                $('#top-bar-deleteBtn').hide();
            }

            if (typeof(self.setAllTotalVals) === 'function') {   // added in case of existing setAllTotalVals method in View
                self.setAllTotalVals();
            }

            this.inputClick(e);
        },

        inputClick: function (e) {
            var $thisEl = this.$el;
            var $checkBoxes = $thisEl.find('input[type="checkbox"]:checked:not(#checkAll,notRemovable)');
            var $currentChecked = e ? $(e.target) : $thisEl.find('#checkAll');
            var checkAllBool = ($checkBoxes.length === this.collection.length);

            if ($currentChecked.attr('id') !== 'checkAll') {
                if (checkAllBool) {
                    this.$el.find('#checkAll').prop('checked', true);
                } else {
                    this.$el.find('#checkAll').prop('checked', false);
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

            if (e) {
                e.stopPropagation();
            }
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

            this.startTime = new Date();

            if ((this.changed && this.changedModels && Object.keys(this.changedModels).length) ||
                (this.isNewRow ? this.isNewRow() : newRows.length)) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, save previous changes or cancel them!'
                });
            }

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
                    target$.parent().find('th').removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                    break;
                case 'sortUp':
                    target$.parent().find('th').removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
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
            this.collection.getFirstPage(data);
        },

        showPagesPopup: function (e) {
            $(e.target).closest('button').next('ul').toggle();
            return false;
        },

        hide: function (e) { // hide all popups and selects, filterView and set changes to model
            var $el = $(e.target);
            var $thisEl = this.$el;

            if (this.selectView) {
                this.selectView.remove();
            }

            $thisEl.find('.allNumberPerPage, .newSelectList').hide();
            $thisEl.find('.health-container ul').hide();

            if (!$el.closest('.search-view').length) {
                $thisEl.find('.search-content').removeClass('fa-caret-up');
                $thisEl.find('.search-options').addClass('hidden');
            }

            if (!$el.closest('.filter-check-list').length) {
                $thisEl.find('.allNumberPerPage').hide();
                //  if ($('.filter-check-list').is(':visible')) {
                //     $('.filter-check-list').hide();
                //     this.showFilteredPage();
                // }
            }

            if (typeof(this.setChangedValueToModel) === 'function' && $el.tagName !== 'SELECT') { // added for SetChangesToModel in ListView
                this.setChangedValueToModel();
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

        checkPage: function (event) {
            var newRows = this.$el.find('#false');
            var elementId = $(event.target).attr('id');
            var data = {
                sort    : this.sort,
                filter  : this.filter,
                viewType: this.viewType
            };

            this.startTime = new Date();

            event.preventDefault();
            $('#checkAll').prop('checked', false);

            if ((this.changedModels && Object.keys(this.changedModels).length) || (this.isNewRow ? this.isNewRow() : newRows.length)) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, save previous changes or cancel them!'
                });
            }

            switch (elementId) {
                case 'previousPage':
                    this.previousPage(data);
                    break;

                case 'nextPage':
                    this.nextPage(data);
                    break;

                case 'firstShowPage':
                    this.firstPage(data);
                    break;

                case 'lastShowPage':
                    this.lastPage(data);
                    break;

                // skip default case
            }
        },

        // when click in list of pages
        showPage: function (e) {
            var newRows = this.$el.find('#false');
            var $targetEl = $(e.target);
            var $inputPage = this.$el.find('#currentShowPage');
            var page = $targetEl.text();

            this.startTime = new Date();

            if (!page) {
                page = $inputPage.val() || 1;
            }

            e.preventDefault();

            if ((this.changedModels && Object.keys(this.changedModels).length) ||
                (this.isNewRow ? this.isNewRow() : newRows.length)) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, save previous changes or cancel them!'
                });
            }

            this.getPage({page: page, viewType: this.viewType});
        },

        nextPage: function (options) {
            var page = options.page;
            var count = options.count;
            var collection = this.collection;

            options = options || {};
            count = count || collection.pageSize;
            options = _.extend(options, {
                filter: this.filter,
                count : count
            });

            this.collection.getNextPage(options);
            this.changeLocationHash(page, count);
        },

        previousPage: function (options) {
            var page = options.page;
            var count = options.count;
            var collection = this.collection;

            options = options || {};
            count = count || collection.pageSize;
            options = _.extend(options, {
                filter: this.filter,
                count : count
            });

            this.collection.getPreviousPage(options);
            this.changeLocationHash(page, count);
        },

        firstPage: function (options) {
            var collection = this.collection;
            var count = options.count || collection.pageSize;

            options = options || {count: count};

            options.filter = this.filter;

            collection.getFirstPage(options);
            this.changeLocationHash(1, count);
        },

        showFilteredPage: function (filter) {
            this.$el.find('.thumbnailElement').remove();
            this.startTime = new Date();

            if (filter && Object.keys(filter).length !== 0) {
                this.filter = filter;
            }

            this.changeLocationHash(null, this.collection.pageSize, this.filter);
            this.collection.getFirstPage({
                filter     : this.filter,
                viewType   : this.viewType,
                contentType: this.contentType
            });
        },

        lastPage: function (options) {
            var count = options.count;
            var collection = this.collection;

            options = options || {};
            count = count || collection.pageSize;
            options = _.extend(options, {
                filter: this.filter,
                count : count
            });

            this.collection.getLastPage(options);
            this.changeLocationHash(collection.lastPage, count);
        },

        getPage: function (options) {
            var count = options.count;
            var collection = this.collection;
            var filter = this.filter || {};
            var page;

            options = options || {};
            count = count || collection.pageSize;
            page = options.page;

            options = _.extend(options, {
                filter: filter,
                count : count
            });

            collection.getPage(page, options);
            this.changeLocationHash(page, count);
        },

        // when tap in elementPerPage (50, 100, 200, ...)
        switchPageCounter: function (e) {
            var $targetEl = $(e.target);
            var newRows = this.$el.find('#false');
            var itemsNumber = $(e.target).text();

            this.startTime = new Date();

            e.preventDefault();

            // todo change it for call method checkAll from setPagination
            // this.$el.find('#checkAll').prop('checked', false);
            if ((this.changedModels && Object.keys(this.changedModels).length) || (this.isNewRow ? this.isNewRow() : newRows.length)) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, save previous changes or cancel them!'
                });
            }

            if (this.previouslySelected) {
                this.previouslySelected.removeClass('selectedItemsNumber');
            }

            this.previouslySelected = $targetEl;
            $targetEl.addClass('selectedItemsNumber');

            if (itemsNumber === 'all') {
                itemsNumber = this.collection.pageSize;
            }

            // hide delete & deselect checkAll

            this.collection.getPage(1, {
                count   : itemsNumber,
                page    : 1,
                filter  : this.filter,
                viewType: this.viewType
            });

            this.changeLocationHash(1, itemsNumber);
        },

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

        createItem: function () {
            var CreateView = this.CreateView || Backbone.View.extend({});

            return new CreateView();
        },

        editItem: function () {
            var EditView = this.EditView || Backbone.View.extend({});

            return new EditView({collection: this.collection});
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

        setPagination: function (options) {
            var $thisEl = this.$el;
            var $pageList = $thisEl.find('#pageList');
            var $curPageInput = $thisEl.find('#currentShowPage');
            var $itemsNumber = $thisEl.find('.itemsNumber');

            var $gridStart = $thisEl.find('#gridStart');
            var $gridEnd = $thisEl.find('#gridEnd');
            var $gridCount = $thisEl.find('#gridCount');

            var $lastPage = $thisEl.find('#lastPage');
            var $nextPage = $thisEl.find('#nextPage');
            var $previousPage = $thisEl.find('#previousPage');
            var $firstShowPage = $thisEl.find('#firstShowPage');
            var $lastShowPage = $thisEl.find('#lastShowPage');

            var itemsOnPage = 7;

            var gridCount;
            var currentPage;
            var totalRecords;
            var itemsNumber;
            var gridStartValue;
            var gridEndValue;
            var pageNumber;
            var i;

            options = options || {};

            currentPage = parseInt(options.currentPage, 10) || parseInt($curPageInput.val(), 10);
            itemsNumber = parseInt(options.pageSize, 10) || parseInt($($itemsNumber[0]).text(), 10);
            totalRecords = parseInt(options.totalRecords, 10) || parseInt($($itemsNumber[0]).text(), 10);

            currentPage = isNaN(currentPage) ? 1 : currentPage;
            totalRecords = isNaN(totalRecords) ? 0 : totalRecords;

            if (isNaN(itemsNumber)) {
                itemsNumber = CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE;
            }

            gridCount = totalRecords >= 0 ? totalRecords : parseInt($gridCount.text(), 10);
            gridStartValue = (currentPage - 1) * itemsNumber;
            gridEndValue = gridStartValue + itemsNumber;

            if (gridEndValue > gridCount) {
                gridEndValue = gridCount;
            }

            if (totalRecords === 0) {
                $gridStart.text(0);
                $gridEnd.text(0);
                $gridCount.text(0);

                $nextPage.prop('disabled', true);
                $previousPage.prop('disabled', true);
                $firstShowPage.prop('disabled', true);
                $lastShowPage.prop('disabled', true);

                $pageList.empty();
                $curPageInput.val(0);
                $lastPage.text(0);
            } else {
                pageNumber = Math.ceil(gridCount / itemsNumber);
                $pageList.html('');

                pageNumber = pageNumber || 1;

                $gridCount.text(gridCount);
                $gridStart.text((gridCount === 0) ? 0 : gridStartValue + 1);
                $gridEnd.text(gridEndValue);

                if (pageNumber <= itemsOnPage) {
                    for (i = 1; i <= pageNumber; i++) {
                        $pageList.append('<li class="showPage">' + i + '</li>');
                    }
                } else if (pageNumber >= itemsOnPage && currentPage <= itemsOnPage) {
                    for (i = 1; i <= itemsOnPage; i++) {
                        $pageList.append('<li class="showPage">' + i + '</li>');
                    }
                } else if (pageNumber >= itemsOnPage && currentPage > 3 && currentPage <= pageNumber - 3) {
                    for (i = currentPage - 3; i <= currentPage + 3; i++) {
                        $pageList.append('<li class="showPage">' + i + '</li>');
                    }
                } else if (currentPage >= pageNumber - 3) {
                    for (i = pageNumber - 6; i <= pageNumber; i++) {
                        $pageList.append('<li class="showPage">' + i + '</li>');
                    }
                }


                $lastPage.text(pageNumber);

                if (pageNumber <= 1) {
                    $nextPage.prop('disabled', true);
                    $previousPage.prop('disabled', true);
                    $lastShowPage.prop('disabled', true);
                    $firstShowPage.prop('disabled', true);
                } else {
                    $previousPage.prop('disabled', gridStartValue + 1 === 1);
                    $firstShowPage.prop('disabled', gridStartValue + 1 === 1);
                    $nextPage.prop('disabled', gridEndValue === gridCount);
                    $lastShowPage.prop('disabled', gridEndValue === gridCount);
                }
            }

            if (options.itemsNumber) {
                $itemsNumber.text(itemsNumber);
            }

            $curPageInput.val(currentPage);

            this.checkAll();
            this.hideDeleteBtnAndUnSelectCheckAll();
        }
    });

    View.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return View;
});
