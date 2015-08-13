/**
 * Created by soundstorm on 12.08.15.
 */
define([
    'models/FilterModel'
], function (FilterModel) {
    var FilterCollection = Backbone.Collection.extend({
        model: FilterModel,

        comparator: function (filterModel) {
            return filterModel.get('name');
        },

        initialize: function () {
        }
    });
    return FilterCollection;
});