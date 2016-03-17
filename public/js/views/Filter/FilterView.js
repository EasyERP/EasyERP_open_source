define([
        'jQuery',
        'Underscore',
        'Backbone',
        'text!templates/Filter/FilterTemplate.html',
        'text!templates/Filter/filterFavourites.html',
        'text!templates/Filter/searchGroupLiTemplate.html',
        'views/Filter/FilterValuesView',
        'views/Filter/savedFiltersView',
        'collections/Filter/filterCollection',
        'custom',
        'common',
        'constants',
        'models/UsersModel',
        'dataService',
        "async"
    ],
    function ($, _, Backbone, ContentFilterTemplate, savedFilterTemplate, searchGroupLiTemplate, valuesView, savedFiltersView, filterValuesCollection, custom, Common, CONSTANTS, usersModel, dataService, async) {
        var FilterView;
        FilterView = Backbone.View.extend({
            el                 : '#searchContainer',
            contentType        : "Filter",
            savedFilters       : {},
            filterIcons        : {},
            template           : _.template(ContentFilterTemplate),
            searchGroupTemplate: _.template(searchGroupLiTemplate),

            events: {
                "mouseover .search-content"            : 'showSearchContent',
                "mouseleave .search-options"           : 'showSearchContent',
                "click .search-content"                : 'showSearchContent',
                "click .filter-dialog-tabs .filterTabs": 'showFilterContent',
                'click #applyFilter'                   : 'applyFilter',
                'click .condition li'                  : 'conditionClick',
                'click .groupName'                     : 'showHideValues',
                "click .filterValues li"               : "selectValue",
                "click .filters"                       : "useFilter",
                "click #saveFilterButton"              : "saveFilter",
                "click .removeSavedFilter"             : "removeFilterFromDB",
                "click .removeValues"                  : "removeFilter",
                "keydown #forFilterName"               : "keyDown",
                "click .showLast"                      : "showManyFilters"   // toDO overflow for many filters
            },

            keyDown: function (e) {
                if (e.which === 13) {
                    this.saveFilter();
                }
            },

            showManyFilters: function () {
                this.$el.find('.forFilterIcons').slice(0, 3).toggle();
            },

            initialize: function (options) {
                this.parentContentType = options.contentType;
                this.viewType = options.viewType;
                this.constantsObject = CONSTANTS.FILTERS[this.parentContentType];

                this.enable = true;

                //App.filter = {};

                this.currentCollection = {};
                this.searchRessult = [];

                if (App.savedFilters[this.parentContentType]) {
                    this.savedFilters = App.savedFilters[this.parentContentType];
                }

                this.parseFilter();

                this.setDbOnce = _.debounce(
                    function () {
                        this.trigger('filter', App.filter);
                    }, 500);
            },

            useFilter: function (e) {
                var target = $(e.target);
                var savedFilters;
                var self = this;
                var length;
                var targetId = target.attr('id');
                var keys;

                dataService.getData('/currentUser', null, function (response) {
                    if (response && !response.error) {
                        App.currentUser = response.user;
                        App.savedFilters = response.savedFilters;

                        length = App.savedFilters[self.parentContentType].length;
                        savedFilters = App.savedFilters[self.parentContentType];
                        for (var i = length - 1; i >= 0; i--) {
                            if (savedFilters[i]['_id']['_id'] === targetId) {
                                keys = Object.keys(savedFilters[i]['_id']['filter']);
                                App.filter = savedFilters[i]['_id']['filter'][keys[0]];
                            }
                        }

                        self.selectedFilter(targetId);

                        self.trigger('filter', App.filter);
                        self.renderFilterContent();
                        self.showFilterName(keys[0]);
                    } else {
                        console.log('can\'t get savedFilters');
                    }
                });

            },

            cloneFilter: function (filter) {
                var newFilter = {};
                var filterKeys = Object.keys(filter);
                var filterKey;
                var filterValue;
                var newFilterValue = [];

                _.forEach(filterKeys, function (filterkey) {
                    filterKey = filter[filterkey]['key'];
                    newFilterValue = [];
                    if (filterKey) {
                        filterValue = filter[filterkey]['value'];
                        for (var i = filterValue.length - 1; i >= 0; i--) {
                            newFilterValue.push(filterValue[i]);
                        }
                    } else {
                        filterKey = 'letter';
                        newFilterValue = filter[filterkey];
                    }
                    newFilter[filterkey] = {
                        key  : filterKey,
                        value: newFilterValue
                    };
                });

                return newFilter;
            },

            saveFilter: function () {
                var currentUser = new usersModel(App.currentUser);
                var key;
                var id;
                var filterObj = {};
                var mid = 39;
                var filterName = this.$el.find('#forFilterName').val();
                var byDefault = this.$el.find('.defaultFilter').prop('checked') ? this.parentContentType : "";
                var viewType = this.viewType ? this.viewType : "";
                var self = this;
                var filters;
                var favouritesContent = this.$el.find('#favoritesContent');
                var filterForSave = {};
                var updatedInfo = {};
                var allFilterNames = this.$el.find('.filters');
                var allowName = true;

                if (!filterName.length) {
                    return App.render({type: 'error', message: 'Please, enter filter name'});
                }

                allFilterNames.each(function (index, elem) {
                    if (elem.innerHTML === filterName) {
                        return allowName = false;
                    }
                });

                key = this.parentContentType;

                filterForSave[filterName] = self.cloneFilter(App.filter);

                if (!App.savedFilters[this.parentContentType]) {
                    App.savedFilters[this.parentContentType] = [];
                }

                if (byDefault.length) {
                    App.savedFilters[this.parentContentType].forEach(function (el) {
                        el.byDefault = '';
                    });
                }

                if (!allowName) {
                    return App.render({
                        type   : 'error',
                        message: 'Filter with same name already exists! Please, change filter name.'
                    });
                }

                if ((Object.keys(App.filter)).length === 0) {
                    return App.render({type: 'error', message: 'Please, use some filter!'});
                }

                filterObj['filter'] = {};
                filterObj['filter'][filterName] = {};
                filterObj['filter'][filterName] = App.filter;
                filterObj['key'] = key;
                filterObj['useByDefault'] = byDefault;
                filterObj['viewType'] = viewType;

                currentUser.changed = filterObj;

                currentUser.save(
                    filterObj,
                    {
                        headers : {
                            mid: mid
                        },
                        wait    : true,
                        patch   : true,
                        validate: false,
                        success : function (model) {
                            updatedInfo = model.get('success');
                            filters = updatedInfo['savedFilters'];
                            length = filters.length;
                            id = filters[length - 1]['_id'];
                            App.savedFilters[self.parentContentType].push(
                                {
                                    _id      : {
                                        _id        : id,
                                        contentView: key,
                                        filter     : filterForSave
                                    },
                                    byDefault: byDefault,
                                    viewType : viewType
                                }
                            );
                            favouritesContent.append('<li class="filters"  id ="' + id + '">' + filterName + '</li><button class="removeSavedFilter" id="' + id + '">' + 'x' + '</button>');
                            self.$el.find('.defaultFilter').attr('checked', false);
                            // added for changing name after saving favourite filter
                            self.showFilterName(filterName);
                            //self.$el.find('.forFilterIcons').html('<span class="fa fa-star funnelIcon"></span><span class="filterValues">' + filterName + '</span><span class="removeValues">x</span>');
                            self.selectedFilter(id);
                        },
                        error   : function (model, xhr) {
                            console.error(xhr);
                        },
                        editMode: false
                    });

                this.$el.find('#forFilterName').val('');
            },

            removeFilterFromDB: function (e) {
                var currentUser = new usersModel(App.currentUser);
                var filterObj = {};
                var mid = 39;
                var savedFilters = App.savedFilters[this.parentContentType];
                var filterID = $(e.target).attr('id'); //chosen current filter id
                var i = 0;

                filterObj['deleteId'] = filterID;
                filterObj['byDefault'] = this.parentContentType;

                currentUser.changed = filterObj;

                currentUser.save(
                    filterObj,
                    {
                        headers : {
                            mid: mid
                        },
                        wait    : true,
                        patch   : true,
                        validate: false,
                        success : function (model) {
                        },
                        error   : function (model, xhr) {
                            console.error(xhr);
                        },
                        editMode: false
                    }
                );

                $.find('#' + filterID)[0].remove();
                $.find('#' + filterID)[0].remove();

                for (var i = savedFilters.length - 1; i >= 0; i--) {
                    if (savedFilters[i]['_id']['_id'] === filterID) {
                        App.savedFilters[this.parentContentType].splice(i, 1);
                    }
                }
            },

            selectValue: function (e) {
                var $currentElement = $(e.target);
                var currentValue = $currentElement.attr('data-value');
                var filterGroupElement = $currentElement.closest('.filterGroup');
                var groupType = filterGroupElement.attr('data-value');
                var groupNameElement = filterGroupElement.find('.groupName');
                var constantsName = $.trim(groupNameElement.text());
                var filterObjectName = this.constantsObject[constantsName].view;
                var currentCollection = this.currentCollection[filterObjectName];
                var filterType = this.constantsObject[constantsName].type;
                var collectionElement;
                var intVal;
                var index;
                var self = this;

                if ($currentElement.hasClass('checkedValue')) {
                    $currentElement.removeClass('checkedValue');
                } else {
                    $currentElement.addClass('checkedValue');
                }

                //$currentElement.toggleClass('checkedValue');

                intVal = parseInt(currentValue);

                currentValue = (isNaN(intVal) || currentValue.length === 24) ? currentValue : intVal;

                collectionElement = currentCollection.findWhere({_id: currentValue});

                if ($currentElement.hasClass('checkedValue')) {

                    if (!App.filter[filterObjectName]) {
                        App.filter[filterObjectName] = {
                            key  : groupType,
                            value: [],
                            type : filterType || null
                        };
                    }

                    App.filter[filterObjectName]['value'].push(currentValue);
                    collectionElement.set({status: true});

                    groupNameElement.addClass('checkedGroup');

                    //var inputFilterValue = filterGroupElement.find('input').val();
                    (_.debounce(
                        function () {
                            self.renderFilterContent();
                        }, 500))();

                    //filterGroupElement.find('input').val(inputFilterValue);

                } else {
                    index = App.filter[filterObjectName]['value'].indexOf(currentValue);

                    if (index >= 0) {
                        App.filter[filterObjectName]['value'].splice(index, 1);
                        collectionElement.set({status: false});

                        if (App.filter[filterObjectName]['value'].length === 0) {
                            delete App.filter[filterObjectName];
                            groupNameElement.removeClass('checkedGroup');
                        }
                    }

                    (_.debounce(
                        function () {
                            self.renderFilterContent();
                        }, 500))();

                }

                //this.trigger('filter', App.filter);
                this.setDbOnce();
                this.showFilterIcons(App.filter);
            },

            showFilterIcons: function (filter) {
                var filterIc = this.$el.find('.filter-icons');
                var filterValues = this.$el.find('.search-field #searchFilterContainer');
                var filter = Object.keys(filter);
                var self = this;
                var groupName;

                filterValues.empty();
                _.forEach(filter, function (key, value) {
                    if (filterValues.find('.forFilterIcons').length > 2 && !self.$el.find(".showLast").length) {  // toDO  overflow for many filters
                        filterValues.append('<span class="showLast"> ...&nbsp </span>');
                    }

                    groupName = $('#' + key).text();

                    if (groupName.length > 0) {
                        filterIc.addClass('active');
                        filterValues.prepend('<div class="forFilterIcons"><span class="fa fa-filter funnelIcon"></span><span data-value="' + key + '" class="filterValues">' + groupName + '</span><span class="removeValues">x</span></div>');
                        //filterValues.append('<div class="forFilterIcons"><span class="fa fa-filter funnelIcon"></span><span data-value="' + key + '" class="filterValues">' + groupName + '</span><span class="removeValues">x</span></div>');
                    } else {
                        if ((key !== 'forSales') && (key !== 'startDate') && (key !== 'endDate')) {
                            groupName = 'Letter';
                            filterIc.addClass('active');
                            filterValues.prepend('<div class="forFilterIcons"><span class="fa fa-filter funnelIcon"></span><span data-value="' + key + '" class="filterValues">' + groupName + '</span><span class="removeValues">x</span></div>');
                            //filterValues.append('<div class="forFilterIcons"><span class="fa fa-filter funnelIcon"></span><span data-value="' + 'letter' + '" class="filterValues">' + groupName + '</span><span class="removeValues">x</span></div>');
                        }
                    }
                });
            },

            showFilterName: function (filterName) {
                var filterValues = this.$el.find('.forFilterIcons');
                filterValues.remove();

                this.$el.find('#searchFilterContainer').html('<div class="forFilterIcons"></div>');

                filterValues = this.$el.find('.forFilterIcons');

                filterValues.html('<span class="fa fa-star funnelIcon"></span><span class="filterValues">' + filterName + '</span><span class="removeValues">x</span>');

            },

            removeFilter: function (e) {
                var target = $(e.target);
                var groupName = target.prev().text();
                var filterView = target.prev().attr('data-value');

                $('#searchInput').empty();

                var valuesArray;
                var collectionElement;

                if (filterView) {
                    valuesArray = App.filter[filterView]['value'];
                } else {
                    App.filter = {};
                    this.removeSelectedFilter();
                }

                if (valuesArray) {
                    if (this.currentCollection[filterView].length !== 0) {
                        for (var i = valuesArray.length - 1; i >= 0; i--) {
                            collectionElement = this.currentCollection[filterView].findWhere({_id: valuesArray[i]});
                            collectionElement.set({status: false});
                        }
                    }
                    delete App.filter[filterView];

                    this.renderGroup(groupName);
                } else {
                    if (filterView) {
                        delete App.filter['letter'];
                    }
                }

                $(e.target).closest('div').remove();

                this.renderFilterContent();
                this.trigger('filter', App.filter);
            },

            showHideValues: function (e) {

                var filterGroupContainer = $(e.target).closest('.filterGroup');
                if (this.previousGroupContainer) {
                    this.toggleGroup(this.previousGroupContainer)
                }
                this.previousGroupContainer = filterGroupContainer;
                this.toggleGroup(filterGroupContainer);

            },

            toggleGroup: function (filterGroupContainer) {
                filterGroupContainer.find('.ulContent').toggleClass('hidden');
                filterGroupContainer.toggleClass('activeGroup');
            },

            renderFilterContent: function (options) {
                var filtersGroupContainer;
                var self = this;
                var keys = Object.keys(this.constantsObject);
                var containerString;
                var filterBackend;
                var filterView;
                var groupStatus;
                var groupContainer;
                var groupOptions;

                filtersGroupContainer = this.$el.find('#filtersContent');

                if (keys.length) {
                    async.each(keys, function (key, cb) {
                        filterView = self.constantsObject[key].view;
                        filterBackend = self.constantsObject[key].backend;

                        groupContainer = self.$el.find('#' + filterView + 'Container');

                        if (groupContainer.length) {
                            groupStatus = groupContainer.hasClass('hidden');
                        } else {
                            groupStatus = true;
                        }

                        containerString = '<div id="' + filterView + 'FullContainer" data-value="' + filterBackend + '" class="filterGroup"></div>';

                        if (!self.$el.find('#' + filterView).length) {
                            filtersGroupContainer.append(containerString);
                        }
                        groupOptions = options && options[filterView] ? options[filterView] : null;

                        self.renderGroup(key, filterView, filterBackend, groupStatus, groupOptions, cb);
                    }, function () {
                        self.showFilterIcons(App.filter);
                    });
                }
            },

            renderGroup: function (key, filterView, filterBackend, groupStatus, groupOptions, cb) {
                var itemView;
                var idString = '#' + filterView + 'FullContainer';
                var container = this.$el.find(idString);
                var status;
                var self = this;
                var mapData;
                var sortOptions;
                var intFiltersArray = ['week', 'month', 'year'];

                if (!groupOptions) {
                    groupOptions = {};
                }

                groupOptions.sort = {};
                groupOptions.sort.order = 1;

                if (!App.filtersValues || !App.filtersValues[self.parentContentType]) {
                    return setTimeout(function () {
                        self.renderGroup(key, filterView, groupStatus, null, null, cb);
                    }, 10);
                }

                this.filterObject = App.filtersValues[this.parentContentType];

                this.currentCollection[filterView] = new filterValuesCollection(this.filterObject[filterView]);

                if (intFiltersArray.indexOf(filterView) !== -1) {
                    groupOptions.sort.key = 'name';
                    groupOptions.sort.int = true;
                }

                if (groupOptions && groupOptions.sort) {
                    sortOptions = groupOptions.sort;
                    this.currentCollection[filterView].sortBy(sortOptions);
                }

                mapData = _.map(this.currentCollection[filterView].toJSON(), function (dataItem) {
                    return {
                        category       : key,
                        categoryView   : filterView,
                        categoryBackend: filterBackend,
                        label          : dataItem.name,
                        value          : dataItem.name,
                        data           : dataItem._id
                    };
                });

                this.searchRessult = this.searchRessult.concat(mapData);

                if (App.filter[filterView]) {
                    this.setStatus(filterView);
                    status = true;
                } else {
                    status = false;
                }

                itemView = new valuesView({
                    groupStatus      : groupStatus,
                    parentContentType: this.parentContentType,
                    element          : idString,
                    status           : status,
                    groupName        : key,
                    groupViewName    : filterView,
                    currentCollection: this.currentCollection[filterView],
                    sortOptions      : sortOptions
                });

                container.html('');
                container.html(itemView.render());

                if (cb) {
                    cb();
                }

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
                var $currentElement = e.target ? $(e.target).closest("li") : e;

                var container = $currentElement.closest('.ui-autocomplete');
                var checkOnGroup = $currentElement.hasClass('ui-autocomplete-category');

                var filterObjectName = $currentElement.attr('data-view');
                var groupType = $currentElement.attr('data-back');
                var elements = container.find('.' + filterObjectName);

                var groupName = this.$el.find('#' + filterObjectName).text(); //  added groupname for finding constantsObject filter
                var filterType = this.constantsObject[groupName].type; // filterType searches in types of constantsObject filters

                if (!App.filter[filterObjectName]) {
                    App.filter[filterObjectName] = {
                        key  : groupType,
                        value: [],
                        type : filterType ? filterType : null // added type for filterMapper (bug of no searching in searchfield on wTrack)
                    };
                }

                if (checkOnGroup) {
                    $.each(elements, function (index, element) {
                        value = $(element).attr('data-content');
                        intVal = parseInt(value);
                        value = (isNaN(intVal) || value.length === 24) ? value : intVal;

                        App.filter[filterObjectName]['value'].push(value);
                    });
                } else {
                    value = $currentElement.attr('data-content');
                    intVal = parseInt(value);
                    value = (isNaN(intVal) || value.length === 24) ? value : intVal;
                    App.filter[filterObjectName]['value'].push(value);
                }

                this.setDbOnce();
                this.showFilterIcons(App.filter);

            },

            render: function (options) {
                var self = this;
                var $currentEl = this.$el;
                var searchInput;
                var filterName = this.parentContentType + '.filter';
                var filters = custom.retriveFromCash(filterName) || App.filter;
                var allResults;
                App.filter = filters;
                $currentEl.html(this.template({filterCollection: this.constantsObject}));

                this.renderFilterContent(options);
                //this.showFilterIcons(filters);
                this.renderSavedFilters();

                $.widget("custom.catcomplete", $.ui.autocomplete, {
                    _create    : function () {
                        this._super();
                        this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
                    },
                    _renderMenu: function (ul, items) {
                        var that = this;
                        var currentCategory = "";

                        that._renderItemData = function (ul, item) {
                            ul.hide();
                            return $("<li>")
                                .data("item.autocomplete", item)
                                .append(item.label)
                                .appendTo(ul);
                        };

                        $.each(items, function (index, item) {
                            var li;
                            var categoryLi;

                            item.text = that.element.text();

                            categoryLi = $(self.searchGroupTemplate({item: item}));

                            if (item.category != currentCategory) {
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
                                li.attr("class", item.categoryView);
                                li.attr("data-content", item.data);
                            }
                        });
                    }
                });

                searchInput = $currentEl.find("#searchInput");

                searchInput.keydown(function (e) {
                    if (e.which === 13) {
                        allResults = searchInput.next().find('.ui-autocomplete-category');

                        allResults.each(function () {
                            var element = $(this);

                            self.clickSearchResult(element);
                        });

                        if (!allResults.length && searchInput.html()) {  // added message in case of search unsuccessful
                            App.render({
                                type   : 'error',
                                message: 'No such result'
                            });
                        }

                        allResults.remove(); // to prevent appearing last filters after selecting new
                        searchInput.html("");// to prevent appearing value in Search after selecting
                        e.preventDefault();  // to prevent appearing previous values by pressing Backspace
                    }
                });

                searchInput.catcomplete({
                    source  : this.searchRessult,
                    appendTo: searchInput.closest('#searchGlobalContainer')
                    /*focus : function (event, ui) {
                     $(this).closest("#mainSearch").text(ui.item.label);
                     return false;
                     },*/
                    /*select: function (event, ui) {
                     self.clickSearchResult(ui);
                     return false;
                     }*/
                });

                return this;
            },

            renderSavedFilters: function () {
                var contentType = this.parentContentType;
                var self = this;
                var keys;
                var filterId;
                var filterByDefault;
                var viewType;
                var savedID;

                this.$el.find('#favoritesContent').append(_.template(savedFilterTemplate));

                var content = this.$el.find('#favoritesContent');

                if (App.savedFilters[contentType]) {
                    this.savedFilters = App.savedFilters[contentType];

                    for (var j = this.savedFilters.length - 1; j >= 0; j--) {
                        if (this.savedFilters[j]) {
                            if (this.savedFilters[j].byDefault === contentType) {
                                keys = Object.keys(this.savedFilters[j]['_id']['filter']);

                                filter = this.savedFilters[j]['_id']['filter'][keys[0]];

                                App.filter = filter;

                                if (this.savedFilters[j].viewType) {
                                    viewType = this.savedFilters[j].viewType;
                                }

                                self.trigger('filter', App.filter, viewType);
                                self.renderFilterContent();

                                savedID = this.savedFilters[j]['_id']['_id'];

                                if (typeof (savedID) === 'object') {
                                    filterByDefault = savedID._id;
                                }

                                self.showFilterName(keys[0]);

                                this.enable = false;

                            }

                            filterId = this.savedFilters[j]['_id']['_id'];

                            keys = Object.keys(this.savedFilters[j]['_id']['filter']);
                            for (var i = keys.length - 1; i >= 0; i--) {
                                content.append('<li class="filters"  id ="' + filterId + '">' + keys[i] + '</li><button class="removeSavedFilter" id="' + filterId + '">' + 'x' + '</button>');
                            }
                        }
                    }
                }

                this.$el.find('#favoritesContent').append(content);
                self.selectedFilter(savedID);
            },

            selectedFilter: function (filterId) {
                var filterName = this.$el.find('#' + filterId);
                var filterNames = this.$el.find('.filters');

                if (filterId) {

                    filterNames.removeClass('checkedValue');

                    filterName.addClass('checkedValue');
                }
            },

            removeSelectedFilter: function () {
                var filterNames = this.$el.find('.filters');

                filterNames.removeClass('checkedValue');
            },

            parseFilter: function () {
                var browserString = window.location.hash;
                var browserFilter = browserString.split('/filter=')[1];

                App.filter = (browserFilter) ? JSON.parse(decodeURIComponent(browserFilter)) : {};
            },

            setStatus: function (filterKey) {
                var valuesArray;
                var collectionElement;

                valuesArray = App.filter[filterKey]['value'];

                if (this.currentCollection[filterKey].length === 0) {
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
                var selector = 'fa-caret-up';

                searchOpt.removeClass('hidden');

                if (el.hasClass(selector)) {
                    el.removeClass(selector);
                    this.$el.find('.search-options').addClass('hidden');
                } else {
                    el.addClass(selector)
                }
            },

            showFilterContent: function (e) {
                var currentValue = $(e.target).attr('data-value');

                this.$el.find(currentValue)
                    .removeClass('hidden')
                    .siblings()
                    .addClass('hidden');

            }
        });

        return FilterView;
    });