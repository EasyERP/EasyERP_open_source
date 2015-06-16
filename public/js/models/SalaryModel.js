/**
 * Created by soundstorm on 15.06.15.
 */
define(['Validation','common'],function () {
    var SalaryModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: function () {
            return "/Salary";
        }
    });
    return SalaryModel;
});