/**
 * Created by liliya on 8/12/15.
 */
define([
    'models/savedFiltersModel'
], function (savedFiltersModel) {
    var savedFiltersCollection = Backbone.Collection.extend({
        model: savedFiltersModel,
        url: '/savedFilters',

        initialize: function () {
            this.fetch({
                reset: true,
                success: function () {
                },
                error: function (models, xhr) {
                    if (xhr.status == 401) Backbone.history.navigate('#login', {trigger: true});
                }
            });
        }
    });

    return savedFiltersCollection;
});