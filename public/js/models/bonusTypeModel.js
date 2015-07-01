/**
 * Created by Liliya_Pikiner on 7/1/2015.
 */
define([], function () {

    var bonusTypeModel = Backbone.Model.extend({
        idAttribute: "_id",

        urlRoot: function () {
            return "/bonusType";
        }
    });
    return bonusTypeModel;

});