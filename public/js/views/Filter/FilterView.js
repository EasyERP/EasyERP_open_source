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
                this.filterObject = App.filtersValues[this.parentContentType];
                this.filter = {};
                this.currentCollection = {};
                if (App.savedFilters[this.parentContentType]) {
                    this.savedFilters = App.savedFilters[this.parentContentType];
                }
                this.parseFilter();
            },

            useFilter: function (e) {
                var target = $(e.target);

                //this.$el.find('.filters').removeClass('current');
               // $(e.target).addClass('current');

                var targetId = target.attr('id');
                var savedFilters = App.savedFilters[this.parentContentType];

                this.filter = Custom.getFilterById(savedFilters, targetId);

                this.trigger('filter', this.filter);
                this.showFilterIcons(this.filter);
            },

            saveFilter: function () {
                var currentUser = new usersModel(App.currentUser);
                var subMenu = $('#submenu-holder').find('li.selected').text();
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

                key = subMenu.trim();
                filterForSave[filterName] = self.filter;

                if (!App.savedFilters[this.parentContentType]) {
                    App.savedFilters[self.parentContentType] = [];
                }

                if (!allowName) {
                    alert('Filter with same name already exists! Please, change filter name.');
                    bool = false;
                }

                if ((Object.keys(this.filter)).length === 0) {
                    alert('Please, use some filter!');
                    bool = false;
                }

                if (bool && filterName.length > 0) {
                    filterObj['filter'] = {};
                    filterObj['filter'][filterName] = {};
                    filterObj['filter'][filterName] = this.filter;
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
                var filterID = $(e.target).attr('id'); //chosen current filter id

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

                var filters = App.savedFilters[this.parentContentType];
                for (var i = filters.length - 1; i >= 0; i--) {
                    if (filters[i]['_id'] === filterID) {
                        filters.splice(i, 1);
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

                    if (!this.filter[filterObjectName]) {
                        this.filter[filterObjectName] = {
                            key: groupType,
                            value: []
                        };
                    }

                    this.filter[filterObjectName]['value'].push(currentValue);
                    collectionElement.set({status: true});

                    groupNameElement.addClass('checkedGroup');

                } else {
                    index = this.filter[filterObjectName]['value'].indexOf(currentValue);

                    if (index >= 0) {
                        this.filter[filterObjectName]['value'].splice(index, 1);
                        collectionElement.set({status: false});

                        if (this.filter[filterObjectName]['value'].length === 0) {
                            delete this.filter[filterObjectName];
                            groupNameElement.removeClass('checkedGroup');
                        }
                    }
                    ;
                }

                this.trigger('filter', this.filter);
                this.showFilterIcons(this.filter);
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
                    filterIc.addClass('active');
                    filterValues.append('<div class="forFilterIcons"><span class="fa fa-filter funnelIcon"></span><span data-value="' + key + '" class="filterValues">' + groupName + '</span><span class="removeValues">x</span></div>');
                });


            },

            removeFilter: function (e) {
                var target = $(e.target);
                var groupName = target.prev().text();
                var filterView = target.prev().attr('data-value');

                var valuesArray;
                var collectionElement;

                valuesArray = this.filter[filterView]['value'];

                for (var i = valuesArray.length - 1; i >= 0; i--) {
                    collectionElement = this.currentCollection[filterView].findWhere({_id: valuesArray[i]});
                    collectionElement.set({status: false});
                }
                delete this.filter[filterView];

                this.renderGroup(groupName);
                $(e.target).closest('div').remove();

                this.renderFilterContent();
                this.trigger('filter', this.filter);
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
                this.showFilterIcons(this.filter);
            },

            renderGroup: function (key, filterView, groupStatus) {
                var itemView;
                var idString = '#' + filterView + 'FullContainer';
                var container = this.$el.find(idString);
                var status;

                this.currentCollection[filterView] = new filterValuesCollection(this.filterObject[filterView]);

                if (this.filter[filterView]) {
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
                    filter: this.filter
                });

                this.$el.find('#favoritesContent').append(savedContentView);

                return this;
            },

            parseFilter: function () {
                var browserString = window.location.hash;
                var browserFilter = browserString.split('/filter=')[1];

                this.filter = (browserFilter) ? JSON.parse(decodeURIComponent(browserFilter)) : {};
            },

            setStatus: function (filterKey) {
                var valuesArray;
                var collectionElement;

                valuesArray = this.filter[filterKey]['value'];

                for (var i = valuesArray.length - 1; i >= 0; i--) {
                    collectionElement = this.currentCollection[filterKey].findWhere({_id: valuesArray[i]});
                    collectionElement.set({status: true});
                }
            },

            applyFilter: function () {
                this.trigger('filter', this.filter);
            },


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