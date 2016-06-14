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
                'click #saveFilterButton': 'saveFilter'
            },

            initialize: function (options) {
                var defSavedFilter;

                this.contentType = options.contentType;
                this.savedFilters = this.getSavedFilters(App);

                defSavedFilter = _.findWhere(this.savedFilters, {byDefault: true});

                if (defSavedFilter) {
                    App.filter = defSavedFilter.filters;
                    this.trigger('savedNewFavorite', defSavedFilter._id, defSavedFilter.name, true);
                }
                this.render();
            },

            getSavedFilters: function(object) {
                var savedFiltersObject = object && object.savedFilters ? object.savedFilters[this.contentType] : [];
                var savedFilters = savedFiltersObject && savedFiltersObject.length ? savedFiltersObject[0].filter : [];

                return savedFilters;
            },

            saveFilter: function () {
                var $curEl = this.$el;
                var currentUser = new UserModel(App.currentUser);
                var key = this.contentType;
                var id;
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
                if ((Object.keys(App.filter)).length === 0) {
                    return App.render({type: 'error', message: 'Please, use some filter!'});
                }

                if (!App.savedFilters[key]) {
                    App.savedFilters[key] = [];
                }

                filterForSave[filterName] = _.extend({}, App.filter);

                if (byDefault) {
                    this.savedFilters = _.map(this.savedFilters, function (element) {
                        element.byDefault = false;

                        return element;
                    })
                }

                filterObj = {
                    filter      : filterForSave[filterName],
                    key         : key,
                    name        : filterName,
                    useByDefault: byDefault
                };

                currentUser.changed = {newFilter: filterObj};

                currentUser.save(
                    {newFilter: filterObj},
                    {
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

                            self.savedFilters.push(filterObj);
                            $byDefEl.attr('checked', false);
                            $filterNameEl.val('');
                            self.renderSavedFiltersElements();

                            self.trigger('savedNewFavorite', id, filterName);
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

                $favouritesContent.html(this.elementsTemplate({collection: this.savedFilters}));
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