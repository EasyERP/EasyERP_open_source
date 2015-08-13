/**
 * Created by liliya on 8/13/15.
 */
define([
        'text!templates/Filter/filterFavourites.html',
        'models/UsersModel',
        'custom'
    ],
    function (ContentFilterTemplate, usersModel, custom) {
        var FilterView;
        FilterView = Backbone.View.extend({
            el: '#favoritesContent',
            contentType: null,
            savedFilters: null,
            filter: null,

            events: {
                "click #saveFilterButton": "saveFilter",
                "click .removeSavedFilter": "removeFilter",
                "click .filters": "useFilter"
            },

            initialize: function (options) {
                this.contentType = options.contentType;
                this.filter = options.filter;

                this.render();
            },

            render: function () {
                $(this.el).append(_.template(ContentFilterTemplate));

                if (App.savedFilters[this.contentType]) {
                    this.savedFilters = App.savedFilters[this.contentType];

                        for (var j = this.savedFilters.length - 1; j >= 0; j--) {
                            var keys = Object.keys(this.savedFilters[j]['filter']);
                            for (var i = keys.length - 1; i >= 0; i--) {
                                this.$el.append('<li class="filters"  id ="' + this.savedFilters[j]['_id'] + '">' + keys[i] + '</li><span class="removeSavedFilter" data-id="' + this.savedFilters[j]['_id'] + '">' + 'x'+ '</span><br/>');
                            }
                        }
                    }
            },

            saveFilter: function () {
                var currentUser = new usersModel(App.currentUser);
                var subMenu = $('#submenu-holder').find('li.selected').text();
                var key;
                var filterObj = {};
                var mid = 39;
                var filterName = this.$el.find('#forFilterName').val();
                var bool = true;

                key = subMenu.trim();

                if (!filterName){
                    alert('Please, enter filter name!');
                    bool = false;
                }

                if (bool && filterName){
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
                                console.log('Filter was saved to db');
                            },
                            error: function (model, xhr) {
                                console.error(xhr);
                            },
                            editMode: false
                        });

                    if (!App.savedFilters['wTrack']) {
                        App.savedFilters['wTrack'] = [];
                    }
                    App.savedFilters['wTrack'].push(filterObj.filter);
                    this.savedFilters.push(filterObj.filter);
                }
            },

            removeFilter: function (e) {
                var currentUser = new usersModel(App.currentUser);
                var filterObj = {};
                var mid = 39;
                var filterID = $(e.target).attr('id'); //chosen current filter id
                var filterName = this.$el.find('#forFilterName').val();

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
                            console.log('Filter was removed from db');
                        },
                        error: function (model, xhr) {
                            console.error(xhr);
                        },
                        editMode: false
                    }
                );

                this.clearFilter();

                if (App.currentUser.savedFilters['wTrack']) {
                    delete App.currentUser.savedFilters['wTrack'][filterName];
                }
            },

            clearFilter: function () {
                this.trigger('filter', {});
            },

            useFilter: function (e) {
                var target = $(e.target);

                this.$el.find('.filters').removeClass('current');
                $(e.target).addClass('current');

                var targetId = target.attr('id');
                var savedFilters = this.savedFilters;
                var filter = custom.getFilterById(savedFilters, targetId);

                this.trigger('filter', filter);
            }

        });
        return FilterView;
    });