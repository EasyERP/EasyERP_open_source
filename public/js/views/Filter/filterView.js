define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/Filter/FilterTemplate.html',
    'text!templates/Filter/searchGroupLiTemplate.html',
    'text!templates/Filter/filterIconElement.html',
    'views/Filter/filtersGroup',
    'views/Filter/savedFiltersView',
    'collections/Filter/filterCollection',
    'custom',
    'common',
    'constants/filters',
    'async',
    'helpers/ga',
    'constants/googleAnalytics'
], function (Backbone, _, $, ContentFilterTemplate,
             searchGroupLiTemplate, FilterIconElement, valuesView,
             SavedFiltersView, filterValuesCollection, custom,
             Common, FILTERS, async, ga, GA) {
    'use strict';

    var FilterView = Backbone.View.extend({
        // el                 : '#searchContainer',
        contentType        : 'Filter',
        savedFilters       : {},
        filterIcons        : {},
        groupsViews        : {},
        currentCollection  : {},
        searchResultObject : {},
        searchResult       : [],
        template           : _.template(ContentFilterTemplate),
        searchGroupTemplate: _.template(searchGroupLiTemplate),
        filterIcon         : _.template(FilterIconElement),

        events: {
            'click .search-content'                : 'showSearchContent',
            'click .filter-dialog-tabs .filterTabs': 'showFilterContent',
            'click .groupName'                     : 'showHideValues',
            'click .removeValues'                  : 'removeFilter',
            'click .showLast'                      : 'showManyFilters',
            'keydown #searchInput'                 : 'searchInputKeyDown'
        },

        initialize: function (options) {
            this.contentType = options.contentType;
            this.viewType = options.viewType;
            this.constantsObject = FILTERS[this.contentType];

            this.enable = true;

            if (App.filtersObject.savedFilters[this.contentType]) {
                this.savedFilters = App.filtersObject.savedFilters[this.contentType];
            }

            this.setDbOnce = function () {
                this.trigger('filter', App.filtersObject.filter);
            };

            _.bindAll(this, 'setDbOnce');

            _.bindAll(this, 'renderFilterContent');
        },

        searchInputKeyDown: function (e) {
            var $searchInput = $(e.currentTarget);
            var searchInputVal = $searchInput.text();
            var searchFilterContainer;

            var allResults;
            if (e.which === 8) {
                if (searchInputVal.length === 0) {
                    searchFilterContainer = $('#searchFilterContainer').children('div:last');
                    if (searchFilterContainer.length !== 0) {
                        e.target = searchFilterContainer.find('.removeValues');
                        this.removeFilter(e);
                    }
                }
            } else if (e.which === 13) {
                allResults = $searchInput.next().find('.ui-autocomplete-category');

                if (allResults.length) {
                    this.clickSearchResult(allResults);
                    /* .first()
                     .find('.subUl li')
                     .first()*/

                }

                if (!allResults.length && $searchInput.html()) {  // added message in case of search unsuccessful
                    App.render({
                        type   : 'error',
                        message: 'No such result'
                    });
                }

                $searchInput.catcomplete('close');
                $searchInput.html('');// to prevent appearing value in Search after selecting
                e.preventDefault();  // to prevent appearing previous values by pressing Backspace
            }
        },

        showManyFilters: function () {
            this.$el.find('.forFilterIcons').slice(0, 3).toggle();
            this.$el.find('#searchInput').focus();
        },

        showFilterIcons: function (filter) {
            var self = this;
            var $curEl = this.$el;
            var $filterValues = $curEl.find('#searchFilterContainer');
            var filterKeys;
            var groupName;
            var defaultFilterName = App.storage.find(this.contentType + '.savedFilter');

            if (filter && filter.hasOwnProperty('undefined')) { // lifehack untill fix
                delete filter.undefined;
            }

            filterKeys = filter ? Object.keys(filter) : [];

            $filterValues.empty();

            if (!defaultFilterName) {
                _.forEach(filterKeys, function (key) {
                    if ($filterValues.find('.forFilterIcons').length > 2 && !self.$el.find('.showLast').length) {
                        $filterValues.append('<span class="showLast"> ...&nbsp </span>');
                    }

                    if ((key !== 'forSales') && (key !== 'viewType') && (key !== 'startDate') && (key !== 'endDate') && (key !== 'workflowId') && (key !== 'date') && (key !== 'toExpand') && (key !== 'channelLinks')) {
                        groupName = self.constantsObject[key] ? self.constantsObject[key].displayName : 'letter';
                    } else {
                        groupName = null;
                    }

                    if (groupName) {
                        $filterValues.append(self.filterIcon({
                            filterName : groupName,
                            key        : key,
                            savedFilter: false
                        }));
                    }
                });
            } else {
                $filterValues.html(this.filterIcon({
                    filterName : defaultFilterName,
                    savedFilter: true
                }));
            }
        },

        removeFilter: function (e) {
            var self = this;
            var $target = $(e.target);
            var $forFilterContainer = $target.closest('.forFilterIcons');
            var favouriteIconState = $forFilterContainer.find('.icon-star2').length;
            var $groupEl = $target.prev();
            var filterView = $groupEl.attr('data-value');
            var $alphabetHolder = $('#startLetter');

            var filtersKeysForRemove;

            function setStatusFalse(key, callback) {
                var valuesArray = App.filtersObject.filter[key] ? App.filtersObject.filter[key].value || App.filtersObject.filter[key] : [];
                var filterCollection = self.currentCollection[key];

                if (filterCollection && filterCollection.length) {
                    for (var i = valuesArray.length - 1; i >= 0; i--) {
                        if (filterCollection.get(valuesArray[i])) {
                            filterCollection.get(valuesArray[i]).set({status: false});
                        }

                    }
                }

                delete App.filtersObject.filter[key];

                callback();
            }

            if (filterView === 'productCategory') {
                delete App.filtersObject.filter.productCategory;

                self.setDbOnce();
                self.showFilterIcons(App.filtersObject.filter);
                this.trigger('categoryRemoved');
            } else if (filterView !== 'letter') {
                if (filterView) {
                    filtersKeysForRemove = [filterView];
                } else {
                    filtersKeysForRemove = Object.keys(App.filtersObject.filter || {});
                }

                async.each(filtersKeysForRemove, setStatusFalse, function () {
                    self.$el.find('#searchInput').empty();

                    if (favouriteIconState) {
                        self.savedFiltersView.$el
                            .find('.checkedValue')
                            .removeClass('checkedValue');

                        App.storage.remove(self.contentType + '.savedFilter');
                    }
                });
            } else {
                delete App.filtersObject.filter.letter;

                self.setDbOnce();

                $target
                    .closest('.forFilterIcons')
                    .remove();

                $alphabetHolder
                    .children()
                    .removeClass('current');

                $alphabetHolder
                    .find(':first-child')
                    .addClass('current');
            }
        },

        showHideValues: function (e) {
            var filterGroupContainer = $(e.target).closest('.filterGroup');

            if (this.previousGroupContainer && (this.previousGroupContainer.html() !== filterGroupContainer.html()) && this.previousGroupContainer.find('.ulContent').is(':visible')) {
                this.toggleGroup(this.previousGroupContainer);
            }

            this.previousGroupContainer = filterGroupContainer;
            this.toggleGroup(filterGroupContainer);

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL[filterGroupContainer[0].id]
            });
        },

        toggleGroup: function (filterGroupContainer) {
            filterGroupContainer.find('.ulContent').toggleClass('hidden');
            filterGroupContainer.toggleClass('activeGroup');
        },

        renderFilterContent: function (options, cb) {
            var self = this;
            var keys = this.constantsObject.array || Object.keys(this.constantsObject);
            var groupOptions;

            if (keys.length) {
                async.each(keys, function (key, eachCB) {
                    var constants = self.constantsObject[key];
                    var displayName = constants.displayName;
                    var filterBackend = constants.backend;
                    var filterType = constants.type;

                    groupOptions = options && options[key] ? options[key] : null;

                    self.renderGroup({
                        displayName  : displayName,
                        filterView   : key,
                        filterBackend: filterBackend,
                        groupOptions : groupOptions,
                        filterType   : filterType
                    }, eachCB);
                }, cb);
            }
        },

        renderGroup: function (options, cb) {
            var self = this;
            var displayName = options.displayName || '';
            var filterType = options.filterType || null;
            var filterView = options.filterView;
            var filterBackend = options.filterBackend || null;
            var groupStatus = options.groupStatus || null;
            var groupOptions = options.groupOptions || {};
            var intFiltersArray = ['week', 'month', 'year', 'paymentsCount'];
            var $filtersSelector = this.$el.find('#filtersContent');

            groupOptions.sort = {};
            groupOptions.sort.order = 1;

            if (!App.filtersObject.filtersValues || !App.filtersObject.filtersValues[self.contentType]) {
                return setTimeout(function () {
                    self.renderGroup({
                        displayName  : displayName,
                        filterView   : filterView,
                        filterType   : filterType,
                        filterBackend: filterBackend,
                        groupStatus  : groupStatus
                    }, cb);
                }, 10);
            }

            this.filterObject = App.filtersObject.filtersValues[this.contentType];

            this.currentCollection[filterView] = new filterValuesCollection(this.filterObject[filterView]);

            if (intFiltersArray.indexOf(filterView) !== -1) {
                groupOptions.sort.key = 'name';
                groupOptions.sort.int = true;
            }

            if (App.filtersObject.filter && App.filtersObject.filter[filterView]) {
                this.setStatus(filterView);
            }

            this.groupsViews[filterView] = new valuesView({
                id               : filterView + 'FullContainer',
                className        : 'filterGroup',
                displayName      : displayName,
                filterViewName   : filterView,
                filterBackendName: filterBackend,
                filterType       : filterType,
                collection       : this.currentCollection[filterView],
                sortOptions      : groupOptions.sort
            });

            this.groupsViews[filterView].on('valueSelected', function (state) {
                if (state) {
                    self.savedFiltersView.$el
                        .find('.checkedValue')
                        .removeClass('checkedValue');

                    App.storage.remove(self.contentType + '.savedFilter');
                }
                self.setDbOnce();
                self.showFilterIcons(App.filtersObject.filter);
            });

            $filtersSelector.append(this.groupsViews[filterView].$el);

            this.searchResultObject[filterView] = this.getAutoCompleteResult({
                filterView   : filterView,
                displayName  : displayName,
                filterBackend: filterBackend
            });

            this.searchResult = this.searchResult.concat(this.searchResultObject[filterView]);

            cb();
        },

        getAutoCompleteResult: function (options) {
            var filterView = options.filterView;
            var displayName = options.displayName;
            var filterBackend = options.filterBackend;

            return _.map(this.currentCollection[filterView].toJSON(), function (dataItem) {
                return {
                    category       : displayName,
                    categoryView   : filterView,
                    categoryBackend: filterBackend,
                    label          : dataItem.name,
                    value          : dataItem.name,
                    data           : dataItem._id
                };
            });
        },

        toggleSearchResultGroup: function (e) {
            var target = $(e.target).closest('li');
            var name = target.attr('data-view');
            var elements = target.find('#' + name + 'Ul');

            elements.toggle();
        },

        clickSearchResult: function (e) {
            var intVal;
            var value;
            var $currentElement = e.target ? $(e.target).closest('li') : e;

            var container = $currentElement.closest('.ui-autocomplete');
            var checkOnGroup = $currentElement.hasClass('ui-autocomplete-category');

            var filterObjectName = $currentElement.attr('data-view');
            var groupType = $currentElement.attr('data-back');
            var elements = container.find('.' + filterObjectName);

            // var groupName = this.$el.find('#' + filterObjectName).text(); //  added groupname for finding constantsObject filter
            var filterType = this.constantsObject[filterObjectName].type; // filterType searches in types of constantsObject filters

            if (!App.filtersObject.filter) {
                App.filtersObject.filter = {};
            }

            if (!App.filtersObject.filter[filterObjectName]) {
                App.filtersObject.filter[filterObjectName] = {
                    key  : groupType,
                    value: [],
                    type : filterType || null // added type for filterMapper (bug of no searching in searchfield on wTrack)
                };
            }

            if (checkOnGroup) {
                $.each(elements, function (index, element) {
                    value = $(element).attr('data-content');
                    intVal = parseInt(value, 10);
                    value = (isNaN(intVal) || value.length === 24) ? value : intVal;

                    App.filtersObject.filter[filterObjectName].value.push(value);
                });
            } else {
                value = $currentElement.attr('data-content');
                intVal = parseInt(value, 10);
                value = (isNaN(intVal) || value.length === 24) ? value : intVal;
                App.filtersObject.filter[filterObjectName].value.push(value);
            }

            this.setStatus(filterObjectName);

            // this.setDbOnce();
            // this.showFilterIcons(App.filtersObject.filter);

        },

        showAndSelectFilter: function (options) {
            var self = this;
            var name = options.name;
            var keys = Object.keys(App.filtersObject.filter);

            for (var key in this.currentCollection) {
                this.currentCollection[key].reset(this.filterObject[key]);
            }

            keys.forEach(function (key) {
                self.setStatus(key);
            });

            this.showFilterIcons(name);
        },

        renderSavedFilters: function () {
            var self = this;

            this.savedFiltersView = new SavedFiltersView({
                contentType: this.contentType
            });

            this.savedFiltersView.on('selectFavorite', self.showAndSelectFilter, self);
            this.savedFiltersView.on('savedFilterDeleted', function (name) {
                var savedFilterName = App.storage.find(this.contentType + '.savedFilter');

                if (savedFilterName === name) {
                    App.storage.remove(this.contentType + '.savedFilter');
                    return this.showFilterIcons(App.filtersObject.filter);
                }

                this.showFilterIcons();
            }, self);

            this.savedFiltersView.render();
        },

        setStatus: function (filterKey) {
            var valuesArray;
            var collectionElement;

            valuesArray = App.filtersObject.filter[filterKey].value;

            if (!this.currentCollection[filterKey] || this.currentCollection[filterKey].length === 0) {
                return;
            }

            for (var i = valuesArray.length - 1; i >= 0; i--) {
                collectionElement = this.currentCollection[filterKey].findWhere({_id: valuesArray[i]});

                if (collectionElement) {
                    collectionElement.set({status: true});
                }
            }
        },

        showSearchContent: function () {
            var el = this.$el.find('.search-content');
            var searchOpt = this.$el.find('.search-options');
            var selector = 'caretUp';

            searchOpt.removeClass('hidden');

            if (el.hasClass(selector)) {
                el.removeClass(selector);
                this.$el.find('.search-options').addClass('hidden');
            } else {
                el.addClass(selector);
            }

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.SHOW_SEARCH_CONTENT
            });
        },

        showFilterContent: function (e) {

            var $el = $(e.target).closest('.filterTabs');
            var $tabItems = this.$('.filterTabs');
            var currentValue = $el.attr('data-value');

            if (!$el.hasClass('active')) {
                $tabItems.removeClass('active');
                $el.addClass('active');
            }

            this.$el.find(currentValue)
                .removeClass('hidden')
                .siblings()
                .addClass('hidden');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL[currentValue.slice(1)]
            });
        },

        render: function (options) {
            var self = this;
            var $curEl = this.$el;
            var $searchInput;
            var filterName = this.contentType + '.filter';
            var filters = custom.retriveFromCash(filterName) || App.filtersObject.filter;
            var allResults;

            App.filtersObject.filter = filters;
            $curEl.html(this.template());

            $searchInput = $curEl.find('#searchInput');

            this.renderFilterContent(options, function () {
                $searchInput.catcomplete({
                    source  : self.searchResult,
                    appendTo: $searchInput.closest('#searchGlobalContainer'),
                    response: function (event, ui) {
                        if (ui.content.length === 0) {
                            $searchInput.next().empty();
                        }
                    }
                });
            });
            this.showFilterIcons(filters);
            this.renderSavedFilters();

            $.widget('custom.catcomplete', $.ui.autocomplete, {
                _create    : function () {
                    this._super();
                    this.widget().menu('option', 'items', '> :not(.ui-autocomplete-category)');
                },
                _renderMenu: function (ul, items) {
                    var that = this;
                    var currentCategory = '';

                    that._renderItemData = function (ul, item) {
                        ul.hide();
                        return $('<li>')
                            .data('item.autocomplete', item)
                            .append(item.label)
                            .appendTo(ul);
                    };

                    $.each(items, function (index, item) {
                        var li;
                        var categoryLi;

                        item.text = that.element.text();

                        categoryLi = $(self.searchGroupTemplate({item: item}));

                        if (item.category !== currentCategory) {
                            ul.append(categoryLi);
                            categoryLi.find('.searchGroupDropDown').click(function (e) {
                                self.toggleSearchResultGroup(e);
                            });
                            categoryLi.find('.searchGroupResult').click(function (e) {
                                self.clickSearchResult(e);
                            });
                            currentCategory = item.category;
                        }
                        li = that._renderItemData(ul.find('#' + item.categoryView + 'Ul'), item);
                        if (item.category) {
                            li.click(function (e) {
                                self.clickSearchResult(e);
                            });
                            li.attr('data-back', item.categoryBackend);
                            li.attr('data-view', item.categoryView);
                            li.attr('class', item.categoryView);
                            li.attr('data-content', item.data);
                        }
                    });
                }
            });

            //$searchInput = $curEl.find('#searchInput');

            /*$searchInput.keydown(function (e) {
             if (e.which === 13) {
             allResults = $searchInput.next().find('.ui-autocomplete-category');

             /!*allResults.each(function () {
             var element = $(this);

             self.clickSearchResult(element);
             });*!/

             if (allResults.length) {
             self.clickSearchResult(allResults.first());
             }

             if (!allResults.length && $searchInput.html()) {  // added message in case of search unsuccessful
             App.render({
             type   : 'error',
             message: 'No such result'
             });
             }

             // allResults.remove(); // to prevent appearing last filters after selecting new
             $searchInput.catcomplete('close');
             $searchInput.html('');// to prevent appearing value in Search after selecting
             e.preventDefault();  // to prevent appearing previous values by pressing Backspace
             }
             });*/

            return this;
        }
    });

    return FilterView;
});
