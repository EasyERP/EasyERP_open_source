/**
 * Created by soundstorm on 12.08.15.
 */
define([], function () {
    var FilterModel = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            name  : '',
            status: false
        }
    });
    return FilterModel;
});