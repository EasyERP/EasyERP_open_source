/**
 * Created by Liliya_Pikiner on 7/1/2015.
 */
define([
    'Backbone'
], function (Backbone) {

    var bonusTypeModel = Backbone.Model.extend({
        idAttribute: "_id",

        urlRoot: function () {
            return "/bonusType";
        },

        defaults: {
            bonusType: ''
        }
    });
    return bonusTypeModel;

});