define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/Filter/filterView',
    'views/confirmDialogBase',
    'text!templates/Alpabet/AphabeticTemplate.html', // added alphabeticalRender
    'constants',
    'constants/filters',
    'common',
    'async',
    'dataService',
    'helpers',
    'custom',
    'helpers/ga',
    'constants/googleAnalytics'
], function (Backbone, $, _, FilterView, ConfirmView, aphabeticTemplate, CONSTANTS, FILTERS, common, async, dataService, helpers, custom, ga, GA) {
    var View = Backbone.View.extend({
        el        : '#content-holder',
        filter    : null,
        FilterView: FilterView,

        events: {
            'click .oe_sortable'       : 'goSort',
            'click #checkAll'          : 'checkAll',
            'click td.notRemovable'    : 'onDisabledClick',
            'click .letter:not(.empty)': 'alpabeticalRender',
            'click .allPage'           : 'togglePagesList',
            click                      : 'hide'
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
            if (this.viewType === 'thumbnails') {
                this.$el.html('');
                this.$el
                    .append('<div id="searchContainer"></div>')
                    .append('<div id="thumbnailContent" class="thumbnailContent"></div>');
            }
        },

        afterRender: function (options) {
            var createdInTag;
            var $curEl = this.$el;
            var contentType = options.contentType || null;
            var paginationEl = options.paginationEl || null;
            var filterObj = FILTERS[contentType];
            var ifFilter = filterObj && filterObj.array && filterObj.array.length;
            var $paginationContainer;

            if (ifFilter) {
                if (!App || !App.filtersObject || !App.filtersObject.filtersValues || !App.filtersObject.filtersValues[this.contentType]) {
                    custom.getFiltersValues({contentType: this.contentType}, this.renderFilter(this.baseFilter));
                } else {
                    this.renderFilter(this.baseFilter);
                }
            }

            if (this.hasAlphabet) {
                this.renderAlphabeticalFilter();
            }

            if (this.hasPagination) {
                if (paginationEl) {
                    $paginationContainer = $curEl.find(paginationEl);
                } else {
                    $paginationContainer = $curEl;
                }
                this.renderPagination($paginationContainer, this);
            }

            if (this.contentType === 'Products') {
                this.$el.find('.product').draggable({
                    revert: true
                });
            }

            if (!this.noNeedCreatedIn) {
                createdInTag = '<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + 'ms </div>';
                $curEl.append(createdInTag);
            }
        },

        hideDeleteBtnAndUnSelectCheckAll: function () {
            $('#top-bar-toPublishBtn').hide();
            $('#top-bar-toUnpublishBtn').hide();
            $('#top-bar-toUnlinkBtn').hide();
            $('#top-bar-deleteBtn').hide();
            $('#top-bar-generateBtn').hide();
            $('#top-bar-copyBtn').hide();
            $('#top-bar-createBtn').show();

            this.$el.find('#checkAll').prop('checked', false);
        },

        checkAll: function (e) {
            var $thisEl = this.$el;
            var $el = e ? $(e.target) : $thisEl.find('#checkAll');
            var $checkedContent = (this.viewType === 'thumbnails') ?
                $thisEl.find('.thumbnailsItems') :
                $thisEl.find('.list');

            var $checkboxes = $checkedContent.find(':checkbox:not(.notRemovable)');
            var check = $el.prop('checked');

            if (e) {
                e.stopPropagation();
                this.checked(e);
            }

            $checkboxes.prop('checked', check);
        },

        onDisabledClick: function () {
            App.render({
                type   : 'error',
                message: 'Can\'t be selected'
            });
        },

        checked: function (e) {
            var $thisEl = this.$el;
            var $topBar = $('#top-bar');
            var $checkBoxes = $thisEl.find('.checkbox:checked:not(#checkAll,notRemovable,.productCategory)');
            var notRemovable = $thisEl.find('.notRemovable');
            var $checkAll = $thisEl.find('#checkAll');
            var $currentChecked = e ? $(e.target) : $thisEl.find('#checkAll');
            var isCheckedAll = $currentChecked.attr('id') === 'checkAll';
            var checkAllBool = (($checkBoxes.length + notRemovable.length) === this.collection.length);
            var $deleteButton = $topBar.find('#top-bar-deleteBtn');
            var $createButton = $topBar.find('#top-bar-createBtn');
            var $copyButton = $topBar.find('#top-bar-copyBtn');
            var $saveButton = $topBar.find('#top-bar-saveBtn');
            var $publishButton = $topBar.find('#top-bar-toPublishBtn');
            var $unPublishButton = $topBar.find('#top-bar-toUnpublishBtn');
            var $unLinkButton = $topBar.find('#top-bar-toUnlinkBtn');
            var spesialContentTypes = CONSTANTS.SPECIAL_CONTENT_TYPES;
            var contentType = this.contentType;
            var changedRows;
            var haveNewRow;
            var action = App.publishProductState;

            changedRows = this.changedModels ? Object.keys(this.changedModels) : null;
            haveNewRow = $thisEl.find('#false, .false').length;

            if (e) {
                e.stopPropagation();
            }

            $checkAll.prop('checked', checkAllBool);

            if ((!isCheckedAll && $checkBoxes.length) || (isCheckedAll && !checkAllBool)) {
                $deleteButton.show();
                $copyButton.show();
                $createButton.hide();

                if (typeof(this.hidePublish) === 'function') {
                    this.hidePublish();
                }

                if (action === 'publish') {
                    $publishButton.show();
                } else if (action === 'unpublish') {
                    $unPublishButton.show();
                } else if (action === 'unlink') {
                    $unLinkButton.show();
                }
            } else {
                $publishButton.hide();
                $unPublishButton.hide();
                $unLinkButton.hide();
                $deleteButton.hide();
                $copyButton.hide();
                $createButton.show();

                if (typeof(this.showPublish) === 'function') {
                    this.showPublish();
                }
            }

            if (contentType && spesialContentTypes.indexOf(contentType) !== -1 && haveNewRow) {
                if ((changedRows && changedRows.length) || haveNewRow) {
                    $saveButton.show();
                    $createButton.hide();
                    $deleteButton.show();
                } else {
                    $saveButton.hide();
                }
            }

            /* this.trigger('selectedElementsChanged', {
             length  : $checkBoxes.length,
             $element: $currentChecked,
             checkAll: checkAllBool
             }); */

            if (typeof(this.setAllTotalVals) === 'function') {   // added in case of existing setAllTotalVals in View
                this.setAllTotalVals();
            }
        },

        goSort: function (e) {
            var $targetEl;
            var newRows = this.$el.find('#false').length ? this.$el.find('#false') : this.$el.find('.false');
            var filter = this.filter || App.filtersObject.filter;
            var target$;
            var currentParrentSortClass;
            var sortClass;
            var sortConst;
            var sortBy;
            var sortObject;
            var data;
            var el = 'th';

            this.startTime = new Date();

            if ((this.changed && this.changedModels && Object.keys(this.changedModels).length) ||
                (this.isNewRow ? this.isNewRow() : newRows.length)) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, save previous changes or cancel them!'
                });
            }

            // target$ = $(e.target).closest('th');

            if ($(e.target).closest('th') && $(e.target).closest('th').length) {
                target$ = $(e.target).closest('th');
            } else {
                target$ = $(e.target).closest('li');
                el = 'li';
            }

            currentParrentSortClass = target$.attr('class');
            sortClass = currentParrentSortClass.split(' ')[1];
            sortConst = 1;
            sortBy = target$.data('sort').split(' ');
            sortObject = {};

            if (!sortClass) {
                target$.addClass('sortUp');
                sortClass = 'sortUp';
            }

            switch (sortClass) {
                case 'sortDn':
                    target$.parent().find(el).removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                    break;
                case 'sortUp':
                    target$.parent().find(el).removeClass('sortDn').removeClass('sortUp');
                    target$.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
                    break;
                // skip default case
            }

            sortBy.forEach(function (sortField) {
                sortObject[sortField] = sortConst;
            });

            this.sort = sortObject;

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

                if (this.contentType === 'reports') {
                    data.modelId = this.modelId;
                }
            }

            data.page = 1;

            this.changeLocationHash(null, this.collection.pageSize);
            this.collection.getFirstPage(data);
        },

        hide: function (e) { // hide all popups and selects, filterView and set changes to model
            var $el = $(e.target);
            var $thisEl = this.$el;

            if ($el.attr('id') === 'loading') {
                return;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            $thisEl.find('.newSelectList').hide();
            $thisEl.find('.allPage').removeClass('open');
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

            if (!$el.closest('#variantsCategoriesBlock').length) {
                $el.find('#variantsCategoriesBlock').removeClass('open');
            }

            if (typeof(this.setChangedValueToModel) === 'function' && $el.tagName !== 'SELECT') { // added for SetChangesToModel in ListView
                this.setChangedValueToModel();
            }
        },

        changeLocationHash: function (page, count, filter, options) {
            var location = Backbone.history.fragment;
            var mainLocation = '#easyErp/' + this.contentType + '/' + this.viewType;
            var pId = (location.split('/pId=')[1]) ? location.split('/pId=')[1].split('/')[0] : '';
            var url;
            var thumbnails;
            var value = false;

            if (this.viewType === 'tform') {
                mainLocation += '/' + this.selectedId;
            }

            if (this.preventChangLocation) {
                return false;
            }

            if (!options || !options.hasOwnProperty('replace')) {
                options = options || {};
                options.replace = true;
            }

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

            if (filter) {
                url += '/filter=' + encodeURIComponent(JSON.stringify(filter));
            }

            Backbone.history.navigate(url, options);
        },

        checkPage: function (event) {
            var newRows = this.$el.find('#false');
            var elementId = $(event.target).closest('button').attr('id');
            var data = {
                sort       : this.sort,
                filter     : this.filter,
                viewType   : this.viewType,
                contentType: this.contentType
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

        // todo fixit
        alpabeticalRender: function (e) {  // added from listViewBase and small refactor for thumbnails
            var target;
            var itemsNumber = $('.selectedItemsNumber').text() || this.collection.pageSize;
            var selectedLetter;

            this.startTime = new Date();

            if (e && e.target) {
                target = $(e.target);
                selectedLetter = $(e.target).text();

                if (!this.filter) {
                    this.filter = {};
                }
                this.filter.letter = {
                    key  : this.letterKey || 'name',
                    value: selectedLetter,
                    type : 'letter'
                };

                target.parent().find('.current').removeClass('current');
                target.addClass('current');

                if ($(e.target).text() === 'All') {
                    delete this.filter;
                    delete App.filtersObject.filter.letter;
                } else {
                    if (!App.filtersObject) {
                        App.filtersObject = {};
                    }

                    if (!App.filtersObject.filter) {
                        App.filtersObject.filter = {};
                    }

                    App.filtersObject.filter.letter = this.filter.letter;
                }
            }

            this.filter = App.filtersObject.filter;
            this.newCollection = false;
            this.$el.find('.thumbnailElement').remove();

            this.filterView.showFilterIcons(this.filter);
            /*_.debounce(
             function () {
             this.trigger('filter', App.filtersObject.filter);
             }, 10);*/

            $('#top-bar-deleteBtn').hide();
            $('#checkAll').prop('checked', false);

            this.changeLocationHash(1, itemsNumber, this.filter);
            this.collection.getFirstPage({
                count      : itemsNumber,
                filter     : this.filter,
                viewType   : this.viewType,
                contentType: this.contentType
            });

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.FILTER_BY_LETTER + ' "' + selectedLetter + '"'
            });
        },

        togglePagesList: function (e) {
            $targetEl = $(e.target).closest('.allPage');
            e.stopPropagation();

            $targetEl.toggleClass('open');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.TOGGLE_PAGE_LIST
            });
        },

        renderAlphabeticalFilter: function () { // added from listViewBase
            var self = this;
            var currentLetter;

            common.buildAphabeticArray(this.collection, function (arr) {
                self.$el.find('#startLetter').remove();
                self.alphabeticArray = arr;
                self.$el.find('#searchContainer').after(_.template(aphabeticTemplate, {
                    alphabeticArray   : self.alphabeticArray,
                    allAlphabeticArray: self.allAlphabeticArray
                }));

                currentLetter = (self.filter && self.filter.letter) ? self.filter.letter.value : 'All';

                if (currentLetter) {
                    $('#startLetter').find('a').each(function () {
                        var target = $(this);
                        if (target.text() === currentLetter) {
                            target.addClass('current');
                        }
                    });
                }
            });
        },

        // when click in list of pages
        showPage: function (e) {
            var newRows = this.$el.find('#false');
            var $targetEl = $(e.target);
            var $inputPage = this.$el.find('#currentShowPage');
            var page = $targetEl.text();
            var eventLabel = GA.EVENT_LABEL.PAGE_LIST;

            this.startTime = new Date();

            if (!page) {
                page = $inputPage.val() || 1;
                eventLabel = GA.EVENT_LABEL.PAGE_INPUT;
            }

            e.preventDefault();

            if ((this.changedModels && Object.keys(this.changedModels).length) ||
                (this.isNewRow ? this.isNewRow() : newRows.length)) {
                return App.render({
                    type   : 'notify',
                    message: 'Please, save previous changes or cancel them!'
                });
            }

            this.getPage({
                page       : page,
                viewType   : this.viewType,
                contentType: this.contentType,
                sort       : this.sort
            });

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : eventLabel
            });
        },

        nextPage: function (options) {
            var collection = this.collection;
            var filter = this.filter;
            var count;
            var page;

            options = options || {};
            count = options.count;
            count = count || collection.pageSize;
            page = options.page || collection.currentPage + 1;
            options = _.extend({
                filter: filter,
                count : count
            }, options);

            this.collection.getNextPage(options);
            this.changeLocationHash(page, count, filter);

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.NEXT_PAGE
            });
        },

        previousPage: function (options) {
            var collection = this.collection;
            var filter = this.filter;
            var count;
            var page;

            options = options || {};
            count = options.count;
            count = count || collection.pageSize;
            page = options.page || collection.currentPage - 1;
            options = _.extend({
                filter: filter,
                count : count
            }, options);

            this.collection.getPreviousPage(options);
            this.changeLocationHash(page, count, filter);

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.PREV_PAGE
            });
        },

        firstPage: function (options) {
            var collection = this.collection;
            var filter = this.filter;
            var count;

            options = options || {};
            count = options.count;
            count = count || collection.pageSize;
            options = _.extend({
                filter: filter,
                count : count
            }, options);

            collection.getFirstPage(options);
            this.changeLocationHash(1, count, filter);

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.FIRST_PAGE
            });
        },

        showFilteredPage: function (filter) {
            this.$el.find('.thumbnailElement').remove();
            this.startTime = new Date();

            if (filter && Object.keys(filter).length !== 0) {
                this.filter = filter;
            } else {
                this.filter = null;
            }

            this.changeLocationHash(null, this.collection.pageSize, this.filter, {replace: false});
            this.collection.getFirstPage({
                filter     : this.filter,
                viewType   : this.viewType,
                contentType: this.contentType
            });
        },

        lastPage: function (options) {
            var collection = this.collection;
            var filter = this.filter;
            var count;

            options = options || {};
            count = options.count;
            count = count || collection.pageSize;
            options = _.extend({
                filter: filter,
                count : count
            }, options);

            this.collection.getLastPage(options);
            this.changeLocationHash(collection.lastPage, count, filter);

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.LAST_PAGE
            });
        },

        getPage: function (options) {
            var collection = this.collection;
            var filter = this.filter;
            var count;
            var page;

            options = options || {};
            count = options.count;
            count = count || collection.pageSize;
            page = options.page;

            options = _.extend({
                filter     : filter,
                count      : count,
                viewType   : this.viewType,
                contentType: this.contentType
            }, options);

            collection.getPage(page, options);
            this.changeLocationHash(page, count, filter);
        },

        // when tap in elementPerPage (50, 100, 200, ...)
        switchPageCounter: function (e) {
            var $targetEl = $(e.target);
            var newRows = this.$el.find('#false');
            var itemsNumber = $(e.target).text();
            var filter = this.filter;

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
                count      : itemsNumber,
                page       : 1,
                filter     : filter,
                viewType   : this.viewType,
                contentType: this.contentType
            });

            this.changeLocationHash(1, itemsNumber, filter);

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : itemsNumber + ' ' + GA.EVENT_LABEL.PER_PAGE
            });
        },

        createItem: function () {
            var CreateView = this.CreateView || Backbone.View.extend({});
            var startData = {};
            var cid;
            var model;

            this.CurrentModel = this.CurrentModel || Backbone.Model.extend();
            model = new this.CurrentModel();

            cid = model.cid;

            startData.cid = cid;

            if (!this.isNewRow()) {
                if (this.editCollection) {
                    this.changed = true;
                    this.showSaveCancelBtns();
                    this.editCollection.add(model);
                }
            }

            return new CreateView(model);
        },

        isNewRow: function () {
            var newRow = this.$el.find('#false').length ? this.$el.find('#false') : this.$el.find('.false');

            return !!newRow.length;
        },

        editItem: function () {
            var EditView = this.EditView || Backbone.View.extend({});

            return new EditView({collection: this.collection});
        },

        deleteItems: function (confirmDelete) {
            var self = this;
            var $thisEl = this.$el;
            var $table = $thisEl.find('#listTable');
            var collection = this.collection;
            var url = collection.url;
            var $checkedInputs;
            var ids = [];
            var answer;
            var edited = this.edited || $thisEl.find('tr.false, #false');
            var dontConfirmContentTypes = ['Persons', 'Opportunities', 'order', 'invoice', 'Projects', 'Tasks', 'jobs', 'Employees', 'Applications', 'JobPositions', 'ChartOfAccount', 'journal', 'bonusType', 'Products', 'goodsOutNotes', 'productCategories', 'currency'];
            var answerConfirm = true;

            if (!edited.length) { // ToDo refactor
                this.changed = false;
            }

            if (this.changed) {
                return this.cancelChanges();
            }

            $checkedInputs = $table.find('input:checked');

            $.each($checkedInputs, function () {
                var $el = $(this);

                ids.push($el.val());
            });

            ids = _.compact(ids);

            if (!confirmDelete && dontConfirmContentTypes.indexOf(this.contentType) < 0) {
                answerConfirm = confirm('Do you really want to DELETE this items?!');
            }

            if (answerConfirm) {
                dataService.deleteData(url, {
                    contentType  : this.contentType,
                    ids          : ids,
                    confirmDelete: confirmDelete
                }, function (err, response) {
                    if (err) {

                        if (err.responseJSON && err.responseJSON.error) {
                            return App.render({
                                type   : 'error',
                                message: err.responseJSON.error
                            });
                        }
                    }

                    if (!confirmDelete && $table && response && response.ids) {
                        response.ids.forEach(function (id) {
                            $table.find('[data-id="' + id + '"]').addClass('red');
                        });

                        return new ConfirmView({
                            message : 'Red items have related documents. They won\'t be deleted, ok ?!',
                            callback: function () {
                                self.deleteItems(true);
                            }
                        });
                    }

                    self.getPage();
                });
            }

        },

        cancelChanges: function () {
            var self = this;
            var $copyButton = $('#top-bar-copyBtn');
            var edited = this.edited || this.$el.find('#false'); // ToDo refactor
            var collection = this.collection || new Backbone.Collection();
            var template = _.template(this.cancelEdit);
            var copiedCreated;
            var dataId;
            var enable;

            async.each(edited, function (el, cb) {
                var $tr = $(el).closest('tr');
                var rowNumber = $tr.find('[data-content="number"]').text();
                var id = $tr.attr('data-id');
                var model;

                if (!id) {
                    return cb('Empty id');
                } else if (id.length < 24) {
                    $tr.remove();
                    model = self.changedModels;

                    if (model) {
                        delete model[id];
                    }

                    return cb();
                }

                model = collection.get(id);
                model = model.toJSON();
                model.startNumber = rowNumber;
                enable = model && model.workflow && model.workflow.name !== 'Closed';

                $tr.replaceWith(template({model: model, enable: enable, currencySplitter: helpers.currencySplitter}));

                cb();
            }, function (err) {
                if (!err) {
                    self.bindingEventsToEditedCollection(self);
                    self.hideSaveCancelBtns();
                    $copyButton.hide();
                }
            });

            if (this.createdCopied) {
                copiedCreated = this.$el.find('.false');
                copiedCreated.each(function () {
                    dataId = $(this).attr('data-id');
                    self.editCollection.remove(dataId);

                    delete self.changedModels[dataId];

                    $(this).remove();
                });

                this.createdCopied = false;
            }

            self.changedModels = {};

            if (self.responseObj && self.responseObj['#jobs']) {
                self.responseObj['#jobs'] = [];
            }
        },

        showSaveCancelBtns: function () {
            var $topBar = $('#top-bar');
            var saveBtnEl = $topBar.find('#top-bar-saveBtn');
            var cancelBtnEl = $topBar.find('#top-bar-deleteBtn');
            var createBtnEl = $topBar.find('#top-bar-createBtn');

            if (!this.changed) {
                createBtnEl.hide();
            }
            saveBtnEl.show();
            cancelBtnEl.show();
            createBtnEl.hide();

            return false;
        },

        hideSaveCancelBtns: function () {
            var $topBar = $('#top-bar');
            var createBtnEl = $topBar.find('#top-bar-createBtn');
            var saveBtnEl = $topBar.find('#top-bar-saveBtn');
            var cancelBtnEl = $topBar.find('#top-bar-deleteBtn');

            this.changed = false;

            saveBtnEl.hide();
            cancelBtnEl.hide();
            createBtnEl.show();

            return false;
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
                } else if (currentPage >= 5 && currentPage <= itemsOnPage) {
                    for (i = currentPage - 3; i <= currentPage + 3; i++) {
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

            $thisEl.find('#checkAll').attr('checked', false);
            this.hideDeleteBtnAndUnSelectCheckAll();
        },

        renderFilter: function (baseFilter) {
            var self = this;
            var $searchContainer = self.$el.find('#searchContainer');

            $searchContainer = $searchContainer.length ? $searchContainer : $('#searchContainer');

            if ($searchContainer.length) {
                self.filterView = new self.FilterView({
                    el         : $searchContainer,
                    contentType: self.contentType
                });

                self.filterView.bind('filter', function (filter) {
                    if (baseFilter) {
                        filter[baseFilter.name] = baseFilter.value;
                    }
                    self.showFilteredPage(filter);
                });
                self.filterView.bind('defaultFilter', function (filter) {
                    if (baseFilter) {
                        filter[baseFilter.name] = baseFilter.value;
                    }
                    self.showFilteredPage();
                });

                self.filterView.render();
            }
        }
    });

    View.extend = function (childView) {
        var view = Backbone.View.extend.apply(this, arguments);

        view.prototype.events = _.extend({}, this.prototype.events, childView.events);

        return view;
    };

    return View;
});
