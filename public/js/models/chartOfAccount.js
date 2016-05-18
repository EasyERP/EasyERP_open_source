/**
 * Created by lilya on 27/11/15.
 */
define([], function () {

    var ChartOfAccountModel = Backbone.Model.extend({
        idAttribute: "_id",

        default: {
            account  : "",
            type     : "",
            payMethod: null
        },

        urlRoot: function () {
            return "/ChartOfAccount";
        }
    });
    return ChartOfAccountModel;

});