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

            events: {},

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
                        if (this.savedFilters[j]) {
                            var keys = Object.keys(this.savedFilters[j]['filter']);
                            for (var i = keys.length - 1; i >= 0; i--) {
                                this.$el.append('<li class="filters"  id ="' + this.savedFilters[j]['_id'] + '">' + keys[i] + '</li><button class="removeSavedFilter" id="' + this.savedFilters[j]['_id'] + '">' + 'x' + '</button>');
                            }
                        }
                    }
                }
            }

        });
        return FilterView;
    });