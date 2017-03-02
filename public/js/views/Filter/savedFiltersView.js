define([
        'Backbone',
        'jQuery',
        'Underscore',
        'text!templates/Filter/filterFavourites.html',
        'text!templates/Filter/filterFavouritesElements.html',
        'models/UsersModel'
    ],
    function (Backbone, $, _, SavedFilterTemplate, SavedElementsTemplate, UserModel) {
        'use strict';

        var FilterView;
        FilterView = Backbone.View.extend({
            el              : '#favoritesContent',
            template        : _.template(SavedFilterTemplate),
            elementsTemplate: _.template(SavedElementsTemplate),

            events: {
                'click #saveFilterButton'          : 'saveFilter',
                'keydown #forFilterName'           : 'keyDown',
                'click .filters'                   : 'useFilter',
                'click .filters .removeSavedFilter': 'removeFilterFromDB'
            },

            initialize: function (options) {
                this.contentType = options.contentType;
                this.savedFilters = this.getSavedFilters(App);
            },

            removeFilterFromDB: function (e) {
                var self = this;
                var $target = $(e.target);
                var $selectedLi = $target.closest('.filters');
                var filterId = $selectedLi.attr('id');
                var currentUser = new UserModel(App.currentUser);
                var mid = 39;

                var currentFilter = _.findWhere(this.savedFilters, {_id: filterId});

                e.stopPropagation();

                currentUser.save(
                    {
                        deleteFilter: {
                            id         : currentFilter._id,
                            contentType: this.contentType,
                            byDefault  : currentFilter.byDefault
                        }
                    }, {
                        headers : {
                            mid: mid
                        },
                        wait    : true,
                        patch   : true,
                        validate: false,
                        success : function () {
                            $selectedLi.remove();
                            self.savedFilters = _.without(self.savedFilters, currentFilter);
                            App.filtersObject.savedFilters[self.contentType][0].filter = self.savedFilters;
                            self.trigger('savedFilterDeleted', currentFilter.name);
                        },
                        error   : function (model, xhr) {
                            console.error(xhr);
                        },
                        editMode: false
                    }
                );
            },

            keyDown: function (e) {
                if (e.which === 13) {
                    this.saveFilter();
                }
            },

            useFilter: function (e) {
                var self = this;
                var mid = 39;
                var $target = $(e.target);
                var $curTarget = $(e.currentTarget);
                var targetId = $curTarget.attr('id');
                var curFilter = _.findWhere(this.savedFilters, {_id: targetId});
                var filterName = curFilter.name;
                var checkBoxState = $target.prop('checked');
                var oldFilterName = App.storage.find(this.contentType + '.savedFilter');

                var currentUser;

                if (oldFilterName === filterName) {
                    return false;
                }

                if ($target.hasClass('defFilterCheckBox')) {
                    currentUser = new UserModel(App.currentUser);

                    return currentUser.save(
                        {
                            byDefault: {
                                _id        : targetId,
                                contentType: self.contentType,
                                byDefault  : checkBoxState
                            }
                        }, {
                            headers : {
                                mid: mid
                            },
                            wait    : true,
                            patch   : true,
                            validate: false,
                            success : function (model) {
                                var savedFiltersForCT = App.filtersObject.savedFilters[self.contentType];
                                var savedFiltersValues = savedFiltersForCT[0].filter;

                                savedFiltersValues = _.map(savedFiltersValues, function (element) {
                                    element.byDefault = element._id === targetId ? checkBoxState : false;

                                    return element;
                                });

                                self.savedFilters = savedFiltersValues;
                                self.renderSavedFiltersElements();

                                App.render({
                                    type   : 'notify',
                                    message: 'Saved filter <b>' + filterName + '</b> will' + (checkBoxState ? '' : ' not') + ' be used as default.'
                                });
                            },
                            error   : function (model, xhr) {
                                console.error(xhr);
                            },
                            editMode: false
                        });
                }

                App.filtersObject.filter = $.extend({}, curFilter.filters);

                App.storage.save(this.contentType + '.savedFilter', curFilter.name);

                this.selectFilter(targetId);

                this.trigger('selectFavorite', {
                    name        : curFilter.name,
                    triggerState: true
                });
            },

            selectFilter: function (id, state) {
                var $curEl = this.$el;
                var $favouritesContent = $curEl.find('#savedFiltersElements');
                var $currentLi = $favouritesContent.find('#' + id);

                $currentLi
                    .find('.defFilterCheckBox')
                    .prop('checked', state);

                $currentLi
                    .addClass('checkedValue')
                    .siblings('.filters')
                    .removeClass('checkedValue');
            },

            getSavedFilters: function (object) {
                var savedFiltersObject;
                var savedFilters;

                object.filtersObject = object.filtersObject || {};
                object.filtersObject.savedFilters = object.filtersObject.savedFilters || {};
                object.filtersObject.savedFilters[this.contentType] = object.filtersObject.savedFilters[this.contentType] || [];

                savedFiltersObject = object.filtersObject.savedFilters[this.contentType];

                if (!savedFiltersObject.length) {
                    savedFiltersObject.push({
                        filter: []
                    });
                }

                savedFilters = savedFiltersObject[0].filter;

                return savedFilters;
            },

            saveFilter: function () {
                var $curEl = this.$el;
                var currentUser = new UserModel(App.currentUser);
                var key = this.contentType;
                var filterObj = {};
                var mid = 39;
                var $filterNameEl = $curEl.find('#forFilterName');
                var filterName = $filterNameEl.val().trim();
                var $byDefEl = $curEl.find('.defaultFilter');
                var byDefault = $byDefEl.prop('checked');
                var self = this;
                var filterForSave = {};
                var sameSavedFilter = _.findWhere(this.savedFilters, {name: filterName});

                if (!filterName.length) {
                    return App.render({type: 'error', message: 'Please, enter filter name'});
                }

                if (sameSavedFilter) {
                    return App.render({
                        type   : 'error',
                        message: 'Filter with same name already exists! Please, change filter name.'
                    });
                }
                if (!App.filtersObject || !App.filtersObject.filter || (Object.keys(App.filtersObject.filter)).length === 0) {
                    return App.render({type: 'error', message: 'Please, use some filter!'});
                }

                if (!App.filtersObject.savedFilters[key]) {
                    App.filtersObject.savedFilters[key] = [];
                }

                filterForSave[filterName] = _.extend({}, App.filtersObject.filter);

                if (byDefault) {
                    this.savedFilters = _.map(this.savedFilters, function (element) {
                        element.byDefault = false;

                        return element;
                    });
                }

                filterObj = {
                    filter      : filterForSave[filterName],
                    key         : key,
                    name        : filterName,
                    useByDefault: byDefault
                };

                currentUser.changed = {newFilter: filterObj};

                currentUser.save(
                    {
                        newFilter: filterObj
                    }, {
                        headers : {
                            mid: mid
                        },
                        wait    : true,
                        patch   : true,
                        validate: false,
                        success : function (model) {
                            var updatedInfo = model.get('success');
                            var filters = updatedInfo.savedFilters;
                            var justSavedFilter = _.last(filters);
                            var id = justSavedFilter._id;

                            filterObj._id = id;

                            self.savedFilters.push(
                                {
                                    _id      : id,
                                    byDefault: justSavedFilter.byDefault,
                                    filters  : filterObj.filter,
                                    name     : filterObj.name
                                }
                            );

                            App.filtersObject.savedFilters[self.contentType][0].filter = self.savedFilters;

                            $byDefEl.attr('checked', false);
                            $filterNameEl.val('');
                            self.renderSavedFiltersElements();

                            self.selectFilter(id, byDefault);

                            App.storage.save(self.contentType + '.savedFilter', filterName);

                            self.trigger('selectFavorite', {
                                name: filterName
                            });
                        },
                        error   : function (model, xhr) {
                            console.error(xhr);
                        },
                        editMode: false
                    });
            },

            renderSavedFiltersElements: function () {
                var $curEl = this.$el;
                var $favouritesContent = $curEl.find('#savedFiltersElements');
                var savedFilterChecked = App.storage.find(this.contentType + '.savedFilter');

                $favouritesContent.html(this.elementsTemplate({
                    checkedFilterName: savedFilterChecked,
                    collection       : this.savedFilters
                }));
            },

            render: function () {
                var $curEl = this.$el;

                $curEl.append(this.template());

                this.renderSavedFiltersElements();

                return this;
            }

        });
        return FilterView;
    });