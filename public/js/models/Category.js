/**
 * Created by soundstorm on 29.04.15.
 */
define(['Validation', 'common'], function (Validation, common) {
    var Model = Backbone.Model.extend({
        idAttribute: "_id",
        initialize : function () {

        },

        urlRoot: function () {
            return "/category/";
        }
    });
    return Model;
});