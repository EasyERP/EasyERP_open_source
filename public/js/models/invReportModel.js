define([
    'Backbone'
], function (Backbone) {
    var invReportModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    return invReportModel;
});
