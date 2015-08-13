/**
 * Created by liliya on 8/13/15.
 */
define([
        'text!templates/Filter/filterFavourites.html',
        'models/UsersModel'
    ],
    function (ContentFilterTemplate, usersModel) {
        var FilterView;
        FilterView = Backbone.View.extend({
            el: '#favoritesContent',
            contentType: null,
            savedFilters: {},
            filter: null,

            events: {
                "click #saveFilterButton": "saveFilter",
                "click .removeSavedFilter": "removeFilter"
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
                                this.$el.append('<li class="filters"  id ="' + this.savedFilters[j]['_id'] + '">' + keys[i] + '</li><li class="removeSavedFilter" id="' + this.savedFilters[j]['_id'] + '">' + 'x'+ '</li><br/>');
                            }
                        }
                    }
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
                var length;
                var filters;
                var lastFilter;

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
                                id = model.get('_id');
                                if (!App.savedFilters[self.contentType]) {
                                    App.savedFilters[self.contentType] = [];
                                }
                                length = model.get('savedFilters').length;
                                filters = model.get('savedFilters');
                                lastFilter = filters[length - 1];
                                App.savedFilters[self.contentType].push(lastFilter);
                                self.savedFilters = filterObj.filter;

                                self.$el.append('<li class="filters"  id ="' + id + '">' +filterName + '</li><span class="removeSavedFilter" id="' + id + '">' + 'x'+ '</span><br/>');
                                self.$el.find('#forFilterName').val('');
                            },
                            error: function (model, xhr) {
                                console.error(xhr);
                            },
                            editMode: false
                        });

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

                $.find('#' + filterID)[0].remove();
                $.find('#' + filterID)[0].remove();

                var filters = App.savedFilters[this.contentType];
                for (var i = filters.length - 1; i >= 0; i--){
                    if (filters[i]['_id'] === filterID){
                        filters.splice(i , 1);
                    }

                }
            }

        });
        return FilterView;
    });