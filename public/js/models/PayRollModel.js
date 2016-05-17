define([
    'Backbone',
    'constants'
], function (Backbone, CONSTANTS) {
    'use strict';
    var PayRollModel = Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot    : function () {
            return CONSTANTS.URLS.PAYROLL;
        }
    });
    return PayRollModel;
});