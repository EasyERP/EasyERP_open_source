/**
 * Created by liliya on 8/13/15.
 */
define([
        'text!templates/Filter/FilterTemplate.html',
        'models/UsersModel',
        'custom'
    ],
    function (ContentFilterTemplate, usersModel, custom ) {
        var FilterView;
        FilterView = Backbone.View.extend({
            el: '#searchContainer',
            contentType: null,
            savedFilters: null,
            filter: null,
            template: _.template(ContentFilterTemplate),

            events: {
                "click .saveFilterButton": "saveFilter",
                "click .removeSavedFilter": "removeFilter",
                "click .filters": "useFilter"
            },

            initialize: function (options) {
                this.contentType = options.contentType;
                this.filter = options.filter;

                this.render();
            },

            render: function () {
                var filterContainer;
                var filterKeys;

                if (App.savedFilters[this.contentType]) {
                    this.savedFilters = App.savedFilters[this.contentType];

                        for (var j = this.savedFilters.length - 1; j >= 0; j--) {
                            var keys = Object.keys(this.savedFilters[j]['filter']);
                            for (var i = keys.length - 1; i >= 0; i--) {
                                this.$el.find('#savedFilters').append('<li class="filters"  id ="' + this.savedFilters[j]['_id'] + '">' + keys[i] + '</li><span class="removeSavedFilter" data-id="' + this.savedFilters[j]['_id'] + '">' + 'x'+ '</span><br/>');
                            }
                        }
                    }


                if (this.filter) {
                    filterContainer = this.$el.find('.oe_searchview_input');
                    filterKeys = Object.keys(this.filter);
                    filterKeys.pop();

                    filterKeys.forEach(function (key) {
                        filterContainer.append('<div class="filter-icons active" > <span class="fa fa-filter funnelIcon"></span>' +
                            '<span class="filterValues"> <span class="Clear" >' + key + '</span> </span> <span class="removeValues" >' + 'x' + '</span> </div>');
                    });
                }
            },

            saveFilter: function () {
                var currentUser = new usersModel(App.currentUser);
                var subMenu = $('#submenu-holder').find('li.selected').text();
                var key;
                var filterObj = {};
                var mid = 39;
                var filterName = this.$el.find('#forFilterName').val();

                key = subMenu.trim();

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

            },

            removeFilter: function (e) {
                var currentUser = new usersModel(App.currentUser);
                var filterObj = {};
                var mid = 39;
                var filterID = $(e.target).attr('id'); //this.$el.find('.current').attr('id'); //chosen current filter name
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
                this.$el.find('.filterValues').empty();
                this.$el.find('.filter-icons').removeClass('active');
                this.$el.find('.chooseOption').children().remove();
                this.$el.find('.filterOptions').removeClass('chosen');
                this.$el.find(".filterOptions, .filterActions").hide();

                $.each($('.drop-down-filter input'), function (index, value) {
                    value.checked = false
                });

                this.trigger('filter');
               // this.showFilteredPage();
            },

            useFilter: function (e) {
                var target = $(e.target);
                this.$el.find('.filterValues').empty();
                this.$el.find('.filter-icons').removeClass('active');
                var filterContainer = this.$el.find('.oe_searchview_input');

                this.$el.find('.filters').removeClass('current');

                $(e.target).addClass('current');

                //filterContainer.append('<div class="filter-icons active" > <span class="fa fa-filter funnelIcon"></span>' +
                //    '<span class="filterValues"> <span class="Clear" >' + 'Filter' + '</span> </span> <span class="removeValues" >' + 'x </span> </div>');


                var targetId = target.attr('id');
                var itemsNumber = this.$el.find("#itemsNumber").text();
                var savedFilters = this.savedFilters;

                var filter = custom.getFilterById(savedFilters, targetId);
                var filterKeys = Object.keys(filter);
                filterKeys.pop();

                filterKeys.forEach(function (key) {
                    filterContainer.append('<div class="filter-icons active" > <span class="fa fa-filter funnelIcon"></span>' +
                        '<span class="filterValues"> <span class="Clear" >' + this.savedFilters[j]['_id'] + '</span> </span> <span class="removeValues" >' + 'x' + '</span> </div>');
                });

                this.trigger('filter', this.filter);
                //this.changeLocationHash(1, itemsNumber, filter);
                //this.collection.showMore({count: itemsNumber, page: 1, filter: filter});
                //this.getTotalLength(null, itemsNumber, filter);
            }

        });
        return FilterView;
    });