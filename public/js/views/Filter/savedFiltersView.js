/**
 * Created by liliya on 8/13/15.
 */
define([
        'Backbone',
        'jQuery',
        'Underscore',
        'text!templates/Filter/filterFavourites.html',
        'models/UsersModel',
        'custom'
    ],
    function (Backbone, $, _, ContentFilterTemplate, usersModel, custom) {
        'use strict';

        var FilterView;
        FilterView = Backbone.View.extend({
            el          : '#favoritesContent',
            contentType : null,
            savedFilters: {},
            filter      : null,

            events: {},

            initialize: function (options) {
                this.contentType = options.contentType;
                this.filter = options.filter;

                this.render();
            },

            render: function () {
                this.$el.append(_.template(ContentFilterTemplate));

                if (App.savedFilters[this.contentType]) {
                    this.savedFilters = App.savedFilters[this.contentType];

                    for (var j = this.savedFilters.length - 1; j >= 0; j--) {
                        if (this.savedFilters[j]) {
                            if (this.savedFilters[j].byDefault === this.contentType) {
                                var keys = Object.keys(this.savedFilters[j]['_id']['filter']);

                                filter = this.savedFilters[j]['_id']['filter'][keys[0]];

                                //url += '/filter=' + encodeURI(JSON.stringify(filter));
                                //Backbone.history.fragment = "";
                                //Backbone.history.navigate(url, {trigger: true});

                                self.useFilter(filter);
                            }
                            var keys = Object.keys(this.savedFilters[j]['_id']['filter']);
                            for (var i = keys.length - 1; i >= 0; i--) {
                                this.$el.append('<li class="filters"  id ="' + this.savedFilters[j]['_id']['_id'] + '">' + keys[i] + '</li><button class="removeSavedFilter" id="' + this.savedFilters[j]['_id']['_id'] + '">' + 'x' + '</button>');
                            }
                        }
                    }
                }
            }

        });
        return FilterView;
    });