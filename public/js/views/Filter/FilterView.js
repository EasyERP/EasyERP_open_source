define([
        'text!templates/Filter/FilterTemplate.html',
        'text!templates/Filter/filterFavourites.html',
        'views/Filter/FilterValuesView',
        'views/Filter/savedFiltersView',
        'collections/Filter/filterCollection',
        'custom',
        'common',
        'constants',
        'models/UsersModel',
        'dataService'
    ],
    function (ContentFilterTemplate, savedFilterTemplate, valuesView, savedFiltersView, filterValuesCollection, Custom, Common, CONSTANTS, usersModel, dataService) {
        var FilterView;
        FilterView = Backbone.View.extend({
            el: '#searchContainer',
            contentType: "Filter",
            savedFilters: {},
            filterIcons: {},
            template: _.template(ContentFilterTemplate),

            events: {
                "mouseover .search-content": 'showSearchContent',
                "click .filter-dialog-tabs .btn": 'showFilterContent',
                'click #applyFilter': 'applyFilter',
                'click .condition li': 'conditionClick',
                'click .groupName': 'showHideValues',
                "click .filterValues li": "selectValue",
                "click .filters": "useFilter",
                "click #saveFilterButton": "saveFilter",
                "click .removeSavedFilter": "removeFilterFromDB",
                "click .removeValues": "removeFilter"
            },

            initialize: function (options) {
                this.parentContentType = options.contentType;
                this.constantsObject = CONSTANTS.FILTERS[this.parentContentType];

                App.filter = {};

                this.currentCollection = {};

                if (App.savedFilters[this.parentContentType]) {
                    this.savedFilters = App.savedFilters[this.parentContentType];
                }

                this.parseFilter();

                this.setDbOnce = _.debounce(
                    function () {
                        this.trigger('filter', App.filter)
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
                        for (var i = length - 1; i >= 0; i--){
                            if (savedFilters[i]['_id'] === targetId){
                                keys = Object.keys(savedFilters[i]['filter']);
                                App.filter = savedFilters[i]['filter'][keys[0]];
                            }
                        }

                        self.trigger('filter', App.filter);
                        self.renderFilterContent();
                        self.showFilterIcons(App.filter);
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
                    if (filterKey){
                        filterValue = filter[filterkey]['value'];
                        for (var i = filterValue.length - 1; i >= 0; i--) {
                            newFilterValue.push(filterValue[i]);
                        }
                    } else {
                        filterKey = 'letter';
                        newFilterValue = filter[filterkey];
                    }
                    newFilter[filterkey] = {
                        key: filterKey,
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
                var bool = true;
                var self = this;
                var filters;
                var favouritesContent = this.$el.find('#favoritesContent');
                var filterForSave = {};
                var updatedInfo = {};
                var allFilterNames = this.$el.find('.filters');
                var allowName = true;

                _.forEach(allFilterNames, function (filter) {
                    if (filter.innerHTML === filterName) {
                        return allowName = false;
                    }
                });

                key = this.parentContentType;

                filterForSave[filterName] = self.cloneFilter(App.filter);

                if (!App.savedFilters[this.parentContentType]) {
                    App.savedFilters[this.parentContentType] = [];
                }

                if (!allowName) {
                    alert('Filter with same name already exists! Please, change filter name.');
                    bool = false;
                }

                if ((Object.keys(App.filter)).length === 0) {
                    alert('Please, use some filter!');
                    bool = false;
                }

                if (bool && filterName.length > 0) {
                    filterObj['filter'] = {};
                    filterObj['filter'][filterName] = {};
                    filterObj['filter'][filterName] = App.filter;
                    filterObj['key'] = key;

                    currentUser.changed = filterObj;

                    currentUser.save(
                        filterObj,
                        {
                            headers: {
                                mid: mid
                            },
                            wait: true,
                            patch: true,
                            validate: false,
                            success: function (model) {
                                updatedInfo = model.get('success');
                                filters = updatedInfo['savedFilters'];
                                length = filters.length;
                                id = filters[length - 1];
                                App.savedFilters[self.parentContentType].push(
                                    {
                                        _id: id,
                                        contentView: key,
                                        filter: filterForSave
                                    }
                                );
                                favouritesContent.append('<li class="filters"  id ="' + id + '">' + filterName + '</li><button class="removeSavedFilter" id="' + id + '">' + 'x' + '</button>');

                            },
                            error: function (model, xhr) {
                                console.error(xhr);
                            },
                            editMode: false
                        });

                    this.$el.find('#forFilterName').val('');
                }
            },

            removeFilterFromDB: function (e) {
                var currentUser = new usersModel(App.currentUser);
                var filterObj = {};
                var mid = 39;
                var savedFilters =  App.savedFilters[this.parentContentType];
                var filterID = $(e.target).attr('id'); //chosen current filter id
                var i = 0;

                filterObj['deleteId'] = filterID;

                currentUser.changed = filterObj;

                currentUser.save(
                    filterObj,
                    {
                        headers: {
                            mid: mid
                        },
                        wait: true,
                        patch: true,
                        validate: false,
                        success: function (model) {
                        },
                        error: function (model, xhr) {
                            console.error(xhr);
                        },
                        editMode: false
                    }
                );

                $.find('#' + filterID)[0].remove();
                $.find('#' + filterID)[0].remove();

               for (var i = savedFilters.length - 1; i >= 0; i--){
                   if (savedFilters[i]['_id'] === filterID){
                       App.savedFilters[this.parentContentType].splice(i, 1);
                   }
               }
            },

            selectValue: function (e) {
                var currentElement = $(e.target);
                var currentValue = currentElement.attr('data-value');
                var filterGroupElement = currentElement.closest('.filterGroup');
                var groupType = filterGroupElement.attr('data-value');
                var groupNameElement = filterGroupElement.find('.groupName')
                var constantsName = $.trim(groupNameElement.text());
                var filterObjectName = this.constantsObject[constantsName].view;
                var currentCollection = this.currentCollection[filterObjectName];
                var collectionElement;
                var intVal;
                var index;

                currentElement.toggleClass('checkedValue');

                intVal = parseInt(currentValue);

                currentValue = (isNaN(intVal) || currentValue.length === 24) ? currentValue : intVal;

                collectionElement = currentCollection.findWhere({_id: currentValue});

                if (currentElement.hasClass('checkedValue')) {

                    if (!App.filter[filterObjectName]) {
                        App.filter[filterObjectName] = {
                            key: groupType,
                            value: []
                        };
                    }

                    App.filter[filterObjectName]['value'].push(currentValue);
                    collectionElement.set({status: true});

                    groupNameElement.addClass('checkedGroup');

                } else {
                    index = App.filter[filterObjectName]['value'].indexOf(currentValue);

                    if (index >= 0) {
                        App.filter[filterObjectName]['value'].splice(index, 1);
                        collectionElement.set({status: false});

                        if (App.filter[filterObjectName]['value'].length === 0) {
                            delete App.filter[filterObjectName];
                            groupNameElement.removeClass('checkedGroup');
                        }
                    };
                }

                //this.trigger('filter', App.filter);
                this.setDbOnce();
                this.showFilterIcons(App.filter);
            },

            showFilterIcons: function (filter) {
                var filterIc = this.$el.find('.filter-icons');
                var filterValues = this.$el.find('.search-field .oe_searchview_input');
                var filter = Object.keys(filter);
                var self = this;
                var groupName;

                filterValues.empty();
                _.forEach(filter, function (key, value) {
                    groupName = self.$el.find('#' + key).text();
                    if (groupName.length > 0){
                        filterIc.addClass('active');
                        filterValues.append('<div class="forFilterIcons"><span class="fa fa-filter funnelIcon"></span><span data-value="' + key + '" class="filterValues">' + groupName + '</span><span class="removeValues">x</span></div>');
                    } else {
                        if (key != 'forSales'){
                            groupName = 'Letter';
                            filterIc.addClass('active');
                            filterValues.append('<div class="forFilterIcons"><span class="fa fa-filter funnelIcon"></span><span data-value="' + 'letter' + '" class="filterValues">' + groupName + '</span><span class="removeValues">x</span></div>');
                        }
                    }});
            },

            removeFilter: function (e) {
                var target = $(e.target);
                var groupName = target.prev().text();
                var filterView = target.prev().attr('data-value');

                var valuesArray;
                var collectionElement;

                valuesArray = App.filter[filterView]['value'];

                if (valuesArray){
                    for (var i = valuesArray.length - 1; i >= 0; i--) {
                        collectionElement = this.currentCollection[filterView].findWhere({_id: valuesArray[i]});
                        collectionElement.set({status: false});
                    }
                    delete App.filter[filterView];

                    this.renderGroup(groupName);
                } else {
                    delete App.filter['letter'];
                }

                $(e.target).closest('div').remove();

                this.renderFilterContent();
                this.trigger('filter', App.filter);
            },

            showHideValues: function (e) {
                var filterGroupContainer = $(e.target).closest('.filterGroup');

                filterGroupContainer.find('.ulContent').toggleClass('hidden');
                filterGroupContainer.toggleClass('activeGroup');
            },

            renderFilterContent: function () {
                var filtersGroupContainer;
                var self = this;
                var keys = Object.keys(this.constantsObject);
                var containerString;
                var filterBackend;
                var filterView;
                var groupStatus;
                var groupContainer;

                filtersGroupContainer = this.$el.find('#filtersContent');

                if (keys.length) {
                    keys.forEach(function (key) {
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
                        self.renderGroup(key, filterView, groupStatus);
                    });
                };

                this.showFilterIcons(App.filter);
            },

            renderGroup: function (key, filterView, groupStatus) {
                var itemView;
                var idString = '#' + filterView + 'FullContainer';
                var container = this.$el.find(idString);
                var status;
                var self = this;

                if (!App.filtersValues || !App.filtersValues[self.parentContentType]) {
                    return setTimeout(function () {
                        self.renderGroup(key, filterView, groupStatus);
                    }, 10);
                }

                this.filterObject = App.filtersValues[this.parentContentType];

                this.currentCollection[filterView] = new filterValuesCollection(this.filterObject[filterView]);

                if (App.filter[filterView]) {
                    this.setStatus(filterView);
                    status = true;
                } else {
                    status = false;
                }

                itemView = new valuesView({
                    groupStatus: groupStatus,
                    parentContentType: this.parentContentType,
                    element: idString,
                    status: status,
                    groupName: key,
                    groupViewName: filterView,
                    currentCollection: this.currentCollection[filterView]
                });

                container.html('');
                container.html(itemView.render());
            },

            render: function () {
                var savedContentView;

                this.$el.html(this.template({filterCollection: this.constantsObject}));

                this.renderFilterContent();

                savedContentView = new savedFiltersView({
                    contentType: this.parentContentType,
                    filter: App.filter
                });

                this.$el.find('#favoritesContent').append(savedContentView);

                return this;
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

                for (var i = valuesArray.length - 1; i >= 0; i--) {
                    collectionElement = this.currentCollection[filterKey].findWhere({_id: valuesArray[i]});
                    collectionElement.set({status: true});
                }
            },

            //applyFilter: function () {
            //    this.trigger('filter', App.filter);
            //},


            showSearchContent: function () {
                var el = this.$el.find('.search-content');
                var searchOpt = this.$el.find('.search-options');
                var selector = 'fa-caret-up';

                searchOpt.removeClass('hidden');

                if (el.hasClass(selector)) {
                    el.removeClass(selector)
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